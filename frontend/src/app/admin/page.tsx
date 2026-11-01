import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AdminUserToggle } from "@/components/admin/admin-user-toggle";
import { AffiliateReviewActions } from "@/components/admin/affiliate-review-actions";
import {
  RuntimeSettingsForm,
  type RuntimeSetting,
} from "@/components/admin/runtime-settings-form";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/app/status-badge";
import { cn } from "@/lib/utils";
import { APP_STORE_ID } from "@/lib/site";
import { fetchBackend } from "@/server/backend-api";

const ACTIVE_TASK_STATUSES = ["queued", "processing", "pending"];
/** The Pro subscription's "Creator offer" in App Store Connect; add each creator's custom code there. */
const APP_STORE_CREATOR_OFFER_URL = `https://appstoreconnect.apple.com/apps/${APP_STORE_ID}/distribution/subscriptions/6786756790/pricing/offer-codes/e3b69863-0319-4852-a9c8-204bd84a8183`;

const th = "px-5 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground";
const td = "px-5 py-3 text-sm";

function Panel({ title, description, action, children }: { title: string; description: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-background">
      <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function TaskCell({ id, title }: { id: string; title?: string | null }) {
  return (
    <td className={td}>
      <Link href={`/tasks/${id}`} className="block max-w-[420px] truncate font-medium hover:underline">{title || "Vídeo sem título"}</Link>
      <span className="font-mono text-[11px] text-muted-foreground">{id.slice(0, 8)}</span>
    </td>
  );
}

function Gate({ message, children }: { message: string; children?: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold tracking-tight">Painel Admin</h1>
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      {children}
    </main>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ user?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return (
      <Gate message="Você precisa entrar para visualizar esta página.">
        <Link href="/sign-in" className="mt-6 inline-block text-sm font-medium underline underline-offset-4">Ir para login</Link>
      </Gate>
    );
  }

  const isAdmin = Boolean((session.user as { is_admin?: boolean }).is_admin);

  if (!isAdmin) {
    return <Gate message="Você está conectado, mas sua conta não possui privilégios de administrador." />;
  }

  const { user: selectedUserId } = await searchParams;
  const adminUserId = session.user.id;

  async function loadRuntimeSettings(): Promise<{
    settings: RuntimeSetting[];
    error: string | null;
  }> {
    try {
      const response = await fetchBackend("/admin/runtime-settings", {
        method: "GET",
        userId: adminUserId,
        cache: "no-store",
      });
      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { detail?: string } | null;
        return {
          settings: [],
          error: errorData?.detail
            ? `Não foi possível carregar as configurações: ${errorData.detail}`
            : `Não foi possível carregar as configurações de execução (Status: ${response.status}).`,
        };
      }
      const payload = (await response.json()) as { settings?: RuntimeSetting[] };
      return { settings: payload.settings ?? [], error: null };
    } catch {
      return { settings: [], error: "Não foi possível alcançar a API de configurações do backend." };
    }
  }

  const [
    runtimeSettings,
    totalUsers,
    adminUsers,
    totalTasks,
    completedTasks,
    activeTasks,
    recentUsers,
    processingNow,
    recentGenerations,
    tasksByUser,
    selectedUser,
    selectedUserTasks,
    affiliates,
  ] = await Promise.all([
    loadRuntimeSettings(),
    prisma.user.count(),
    prisma.user.count({ where: { is_admin: true } }),
    prisma.task.count(),
    prisma.task.count({ where: { status: "completed" } }),
    prisma.task.count({ where: { status: { in: ACTIVE_TASK_STATUSES } } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        email: true,
        name: true,
        is_admin: true,
        plan: true,
        createdAt: true,
      },
    }),
    prisma.task.findMany({
      where: { status: { in: ACTIVE_TASK_STATUSES } },
      orderBy: { updated_at: "desc" },
      take: 25,
      select: {
        id: true,
        status: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        source: {
          select: {
            title: true,
          },
        },
      },
    }),
    prisma.task.findMany({
      orderBy: { created_at: "desc" },
      take: 40,
      select: {
        id: true,
        status: true,
        created_at: true,
        generated_clips_ids: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        source: {
          select: {
            title: true,
            type: true,
          },
        },
      },
    }),
    prisma.task.groupBy({
      by: ["user_id"],
      _count: {
        _all: true,
      },
    }),
    selectedUserId
      ? prisma.user.findUnique({
          where: { id: selectedUserId },
          select: {
            id: true,
            email: true,
            name: true,
            is_admin: true,
          },
        })
      : Promise.resolve(null),
    selectedUserId
      ? prisma.task.findMany({
          where: { user_id: selectedUserId },
          orderBy: { created_at: "desc" },
          take: 40,
          select: {
            id: true,
            status: true,
            created_at: true,
            generated_clips_ids: true,
            source: {
              select: {
                title: true,
                type: true,
              },
            },
          },
        })
      : Promise.resolve([]),
    prisma.affiliate.findMany({
      where: { status: { in: ["pending", "approved"] } },
      orderBy: { created_at: "desc" },
      take: 100,
      select: {
        id: true,
        slug: true,
        status: true,
        platform: true,
        profile_url: true,
        audience_size: true,
        video_url: true,
        promotion_plan: true,
        app_store_code_added_at: true,
        created_at: true,
        user: { select: { email: true, name: true } },
      },
    }),
  ]);

  // Pending applications first; each group newest first.
  const sortedAffiliates = [...affiliates].sort(
    (a, b) => Number(b.status === "pending") - Number(a.status === "pending"),
  );
  const pendingAffiliates = affiliates.filter((affiliate) => affiliate.status === "pending").length;

  const generationCountByUser = new Map(tasksByUser.map((item) => [item.user_id, item._count._all]));

  const stats = [
    { label: "Total de usuários", value: totalUsers },
    { label: "Administradores", value: adminUsers },
    { label: "Total de tarefas", value: totalTasks },
    { label: "Tarefas concluídas", value: completedTasks },
    { label: "Em processamento agora", value: activeTasks, live: activeTasks > 0 },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-8 md:py-10">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Painel Administrativo</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gerencie usuários e acompanhe as atividades gerais da plataforma.</p>
        <Link href="/admin/announcements" className="mt-3 inline-block text-sm font-medium text-brand underline-offset-4 hover:underline">Gerenciar avisos &amp; comunicados</Link>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className={cn("rounded-2xl border bg-background p-4", stat.live && "border-brand/40 bg-brand-soft")}>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {stat.live && <span className="size-1.5 rounded-full bg-brand motion-safe:animate-pulse" />}{stat.label}
            </p>
            <p className="mt-1 font-display text-3xl font-bold tabular-nums">{stat.value}</p>
          </div>
        ))}
      </section>

      <div id="affiliates" className="scroll-mt-6">
        <Panel
          title="Programa de Criadores"
          description={`${pendingAffiliates} inscrição pendente${pendingAffiliates === 1 ? "" : "s"}. Aprovar cria o cupom no Stripe e concede Pro ao criador. Para iPhone, adicione o código na App Store em "Ofertas para criadores" e marque como adicionado.`}
          action={<a href={APP_STORE_CREATOR_OFFER_URL} target="_blank" rel="noopener noreferrer" className="text-xs font-medium underline-offset-4 hover:underline">Códigos da App Store</a>}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className="bg-muted/40"><tr><th className={th}>Criador</th><th className={th}>Cupom</th><th className={th}>Canal</th><th className={th}>Proposta</th><th className={cn(th, "text-right")}>Ação</th></tr></thead>
              <tbody className="divide-y">
                {sortedAffiliates.length === 0 ? (
                  <tr><td className={cn(td, "text-muted-foreground")} colSpan={5}>Nenhuma inscrição ainda.</td></tr>
                ) : sortedAffiliates.map((affiliate) => (
                  <tr key={affiliate.id} className="align-top hover:bg-muted/30">
                    <td className={td}>
                      <p className="flex items-center gap-2 font-medium">
                        {affiliate.user.name || "Usuário sem nome"}
                        <Badge variant={affiliate.status === "pending" ? "default" : "outline"} className="capitalize">{affiliate.status === "pending" ? "Pendente" : "Aprovado"}</Badge>
                      </p>
                      <p className="text-xs text-muted-foreground">{affiliate.user.email} · inscrito em {affiliate.created_at.toLocaleDateString("pt-BR")}</p>
                    </td>
                    <td className={cn(td, "font-mono")}>{affiliate.slug?.toUpperCase()}</td>
                    <td className={td}>
                      <a href={affiliate.profile_url} target="_blank" rel="noopener noreferrer" className="font-medium capitalize underline-offset-4 hover:underline">{affiliate.platform}</a>
                      <p className="text-xs text-muted-foreground">{affiliate.audience_size} seguidores</p>
                      {affiliate.video_url && (
                        <a href={affiliate.video_url} target="_blank" rel="noopener noreferrer" className="text-xs underline-offset-4 hover:underline">Vídeo SupoClip</a>
                      )}
                    </td>
                    <td className={cn(td, "max-w-xs text-xs text-muted-foreground")}>{affiliate.promotion_plan || "—"}</td>
                    <td className={cn(td, "text-right")}>
                      <AffiliateReviewActions affiliateId={affiliate.id} status={affiliate.status} appStoreCodeAdded={Boolean(affiliate.app_store_code_added_at)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <Panel title="Tarefas em Processamento" description="Fila em tempo real de todos os usuários.">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-muted/40"><tr><th className={th}>Tarefa</th><th className={th}>Usuário</th><th className={th}>Status</th><th className={th}>Atualizado</th></tr></thead>
            <tbody className="divide-y">
              {processingNow.length === 0 ? (
                <tr><td className={cn(td, "text-muted-foreground")} colSpan={4}>Nenhuma tarefa está sendo processada no momento.</td></tr>
              ) : processingNow.map((task) => (
                <tr key={task.id} className="hover:bg-muted/30">
                  <TaskCell id={task.id} title={task.source?.title} />
                  <td className={cn(td, "text-muted-foreground")}>{task.user.email}</td>
                  <td className={td}><StatusBadge status={task.status} /></td>
                  <td className={cn(td, "whitespace-nowrap text-muted-foreground")}>{task.updated_at.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Usuários" description="Usuários mais recentes. Alterne o acesso de administrador e inspecione tarefas do usuário.">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className="bg-muted/40"><tr><th className={th}>Usuário</th><th className={th}>Plano</th><th className={th}>Tarefas</th><th className={cn(th, "text-right")}>Ação</th></tr></thead>
              <tbody className="divide-y">
                {recentUsers.map((user) => (
                  <tr key={user.id} className={cn("hover:bg-muted/30", user.id === selectedUserId && "bg-brand-soft/60")}>
                    <td className={td}>
                      <p className="flex items-center gap-2 font-medium">
                        {user.name || "Usuário sem nome"}
                        {user.is_admin && <Badge className="bg-foreground text-background">Admin</Badge>}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email} · cadastrado em {user.createdAt.toLocaleDateString("pt-BR")}</p>
                    </td>
                    <td className={td}><Badge variant="outline" className="capitalize">{user.plan}</Badge></td>
                    <td className={td}>
                      <Link href={`/admin?user=${user.id}`} className="tabular-nums underline-offset-4 hover:underline" aria-label={`Ver tarefas do usuário ${user.email}`}>
                        {generationCountByUser.get(user.id) || 0}
                      </Link>
                    </td>
                    <td className={cn(td, "text-right")}>
                      <AdminUserToggle userId={user.id} isAdmin={user.is_admin} isCurrentUser={user.id === session.user.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Explorador de Tarefas do Usuário"
          description={selectedUser ? `Visualizando ${selectedUser.name || selectedUser.email} (${selectedUser.email})` : "Inspecione os vídeos gerados de um usuário específico."}
          action={selectedUserId ? <Link href="/admin" className="text-xs font-medium underline-offset-4 hover:underline">Limpar filtro</Link> : undefined}
        >
          {!selectedUser ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">Selecione o número de tarefas de um usuário para visualizar suas criações.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y">
                <thead className="bg-muted/40"><tr><th className={th}>Tarefa</th><th className={th}>Status</th><th className={th}>Clipes</th><th className={th}>Criado</th></tr></thead>
                <tbody className="divide-y">
                  {selectedUserTasks.length === 0 ? (
                    <tr><td className={cn(td, "text-muted-foreground")} colSpan={4}>Nenhuma tarefa encontrada para este usuário.</td></tr>
                  ) : selectedUserTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-muted/30">
                      <TaskCell id={task.id} title={task.source?.title} />
                      <td className={td}><StatusBadge status={task.status} /></td>
                      <td className={cn(td, "tabular-nums")}>{task.generated_clips_ids.length}</td>
                      <td className={cn(td, "whitespace-nowrap text-muted-foreground")}>{task.created_at.toLocaleString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <Panel title="Vídeos Recentes" description="Última atividade de tarefas na plataforma.">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-muted/40"><tr><th className={th}>Tarefa</th><th className={th}>Usuário</th><th className={th}>Status</th><th className={th}>Clipes</th><th className={th}>Criado</th></tr></thead>
            <tbody className="divide-y">
              {recentGenerations.map((task) => (
                <tr key={task.id} className="hover:bg-muted/30">
                  <TaskCell id={task.id} title={task.source?.title} />
                  <td className={cn(td, "text-muted-foreground")}>{task.user.email}</td>
                  <td className={td}><StatusBadge status={task.status} /></td>
                  <td className={cn(td, "tabular-nums")}>{task.generated_clips_ids.length}</td>
                  <td className={cn(td, "whitespace-nowrap text-muted-foreground")}>{task.created_at.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Configurações de Execução" description="Configure chaves de provedores e modelos sem precisar editar arquivos de ambiente.">
        {runtimeSettings.error ? (
          <div className="px-5 py-5 text-sm text-red-700">{runtimeSettings.error}</div>
        ) : (
          <RuntimeSettingsForm settings={runtimeSettings.settings} />
        )}
      </Panel>
    </main>
  );
}
