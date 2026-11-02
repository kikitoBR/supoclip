"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SocialProviderIcon } from "@/components/social-provider-icon";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ViewsChart, type DailyViews } from "@/components/views-chart";
import { useSocialAccess } from "@/hooks/use-social-access";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  PROVIDER_LABELS,
  durationBucketLabel,
  formatDateTime,
  formatMetric,
  formatPercent,
  type PerformanceSummary,
} from "@/lib/social";

const SECTION_HEADING = "mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground";
const TABLE_HEAD = "bg-muted/50 text-left text-xs text-muted-foreground";
const PAGE = "mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 md:py-10";

function sum(values: (number | null)[]): number {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

interface ViewsTimeseries {
  days: DailyViews[];
  measured_days: number;
  min_days: number;
}

const RANGES = [7, 30, 90] as const;

function ViewsSection() {
  const [range, setRange] = useState<(typeof RANGES)[number]>(30);
  const [series, setSeries] = useState<ViewsTimeseries | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/social/performance/timeseries?days=${range}`, { cache: "no-store" })
      .then(async (response) => (response.ok ? ((await response.json()) as ViewsTimeseries) : null))
      .then((data) => {
        if (!cancelled && data) setSeries(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [range]);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Visualizações diárias</h2>
        <ToggleGroup
          type="single"
          size="sm"
          variant="outline"
          value={String(range)}
          onValueChange={(value) => value && setRange(Number(value) as (typeof RANGES)[number])}
          aria-label="Período"
        >
          {RANGES.map((option) => (
            <ToggleGroupItem key={option} value={String(option)} className="px-2.5 text-xs">
              {option}d
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="rounded-xl border bg-background p-4">
        {!series ? (
          <Skeleton className="h-[200px] w-full" />
        ) : series.measured_days < series.min_days ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            O gráfico de visualizações aparece depois de {series.min_days} dias de resultados.{" "}
            Até agora: {series.measured_days} {series.measured_days === 1 ? "dia" : "dias"}.
          </p>
        ) : (
          <ViewsChart days={series.days} />
        )}
      </div>
    </section>
  );
}

export default function AnalyticsPage() {
  const { data: session, isPending } = useSession();
  const [performance, setPerformance] = useState<PerformanceSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socialAccess = useSocialAccess(Boolean(session?.user?.id));

  useEffect(() => {
    if (!session?.user?.id || !socialAccess) return;
    fetch("/api/social/performance", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Não foi possível carregar as métricas");
        setPerformance((await response.json()) as PerformanceSummary);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Não foi possível carregar as métricas"));
  }, [session?.user?.id, socialAccess]);

  if (isPending) {
    return (
      <main className={PAGE}>
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="mb-4 text-muted-foreground">Entre para ver o desempenho dos seus clipes.</p>
        <Link href="/sign-in">
          <Button>Entrar</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className={PAGE}>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Métricas</h1>
        <p className="mt-2 text-muted-foreground">
          O desempenho dos seus clipes publicados. O Kortes busca visualizações, curtidas e comentários em cada
          plataforma e usa esses dados para escolher os próximos clipes de acordo com o que funciona para o seu público.
        </p>
      </div>

      {socialAccess === false ? (
        <p className="text-sm text-muted-foreground">
          As métricas acompanham a publicação nas redes sociais, que ainda não está disponível na sua conta.
        </p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : !performance ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : performance.total_published === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          <p>Nada publicado ainda.</p>
          <p className="mt-1">
            Conecte uma conta na página{" "}
            <Link href="/settings/social" className="font-medium text-foreground underline underline-offset-4">
              Redes Sociais
            </Link>{" "}
            e use Publicar em qualquer clipe. Os resultados aparecem aqui em até uma hora.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Clipes publicados" value={formatMetric(performance.total_published)} />
            <StatTile label="Visualizações" value={formatMetric(sum(performance.by_provider.map((row) => row.total_views)))} />
            <StatTile label="Curtidas" value={formatMetric(sum(performance.by_provider.map((row) => row.total_likes)))} />
            <StatTile label="Comentários" value={formatMetric(sum(performance.by_provider.map((row) => row.total_comments)))} />
          </section>

          <ViewsSection />

          <section className="rounded-xl border bg-muted/50 p-4 text-sm">
            {performance.personalization_active ? (
              <p>
                A seleção personalizada de clipes está <span className="font-medium">ativa</span>. As novas gerações
                usam os resultados de {performance.measured_posts} clipes publicados.
              </p>
            ) : (
              <p className="text-muted-foreground">
                A seleção personalizada de clipes é ativada depois de {performance.min_posts_for_personalization} clipes
                medidos. Até agora: {performance.measured_posts}.
              </p>
            )}
          </section>

          {performance.top_posts.length > 0 && (
            <section>
              <h2 className={SECTION_HEADING}>Melhores clipes</h2>
              <div className="divide-y rounded-xl border bg-background">
                {performance.top_posts.map((post) => (
                  <div key={post.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                    <SocialProviderIcon provider={post.provider} className="text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      {post.task_id ? (
                        <Link href={`/tasks/${post.task_id}`} className="block truncate font-medium hover:underline underline-offset-4">
                          {post.hook_title || post.title || "Clipe sem título"}
                        </Link>
                      ) : (
                        <p className="truncate font-medium">{post.hook_title || post.title || "Clipe sem título"}</p>
                      )}
                      <p className="truncate text-xs text-muted-foreground">
                        {post.hook_type ? `gancho ${post.hook_type} · ` : ""}
                        {formatDateTime(post.published_at)}
                      </p>
                    </div>
                    <span className="shrink-0 tabular-nums font-semibold">
                      {formatMetric(post.metrics?.views)} {post.metrics?.views === 1 ? "visualização" : "visualizações"}
                    </span>
                    {post.external_url && (
                      <Button asChild size="icon" variant="ghost" className="size-8 text-muted-foreground">
                        <a href={post.external_url} target="_blank" rel="noreferrer" aria-label="Abrir publicação">
                          <ExternalLink className="size-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {performance.by_provider.length > 0 && (
            <section>
              <h2 className={SECTION_HEADING}>Por plataforma</h2>
              <div className="overflow-x-auto rounded-xl border bg-background">
                <table className="w-full text-sm">
                  <thead className={TABLE_HEAD}>
                    <tr>
                      <th className="px-3 py-2 font-medium">Plataforma</th>
                      <th className="px-3 py-2 font-medium text-right">Publicações</th>
                      <th className="px-3 py-2 font-medium text-right">Visualizações</th>
                      <th className="px-3 py-2 font-medium text-right">Média de visualizações</th>
                      <th className="px-3 py-2 font-medium text-right">Curtidas</th>
                      <th className="px-3 py-2 font-medium text-right">Comentários</th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {performance.by_provider.map((row) => (
                      <tr key={row.provider} className="border-t">
                        <td className="px-3 py-2">
                          <span className="flex items-center gap-2">
                            <SocialProviderIcon provider={row.provider} className="size-3.5" />
                            {PROVIDER_LABELS[row.provider] ?? row.provider}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right">{row.posts}</td>
                        <td className="px-3 py-2 text-right">{formatMetric(row.total_views)}</td>
                        <td className="px-3 py-2 text-right">{formatMetric(row.avg_views)}</td>
                        <td className="px-3 py-2 text-right">{formatMetric(row.total_likes)}</td>
                        <td className="px-3 py-2 text-right">{formatMetric(row.total_comments)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {performance.by_hook_type.length > 0 && (
            <section>
              <h2 className={SECTION_HEADING}>Por tipo de gancho</h2>
              <div className="overflow-x-auto rounded-xl border bg-background">
                <table className="w-full text-sm">
                  <thead className={TABLE_HEAD}>
                    <tr>
                      <th className="px-3 py-2 font-medium">Gancho</th>
                      <th className="px-3 py-2 font-medium text-right">Publicações</th>
                      <th className="px-3 py-2 font-medium text-right">Mediana de visualizações</th>
                      <th className="px-3 py-2 font-medium text-right">Engajamento</th>
                      <th className="px-3 py-2 font-medium text-right">Pontuação prevista</th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {performance.by_hook_type.map((row) => (
                      <tr key={row.hook_type} className="border-t">
                        <td className="px-3 py-2 capitalize">{row.hook_type}</td>
                        <td className="px-3 py-2 text-right">{row.posts}</td>
                        <td className="px-3 py-2 text-right">{formatMetric(row.median_views)}</td>
                        <td className="px-3 py-2 text-right">{formatPercent(row.avg_engagement_rate)}</td>
                        <td className="px-3 py-2 text-right">
                          {row.avg_predicted_score === null ? "—" : Math.round(row.avg_predicted_score)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {performance.by_duration.length > 0 && (
            <section>
              <h2 className={SECTION_HEADING}>Por duração do clipe</h2>
              <div className={cn("grid gap-3", performance.by_duration.length > 2 ? "sm:grid-cols-4" : "sm:grid-cols-2")}>
                {performance.by_duration.map((row) => (
                  <div key={row.bucket} className="rounded-xl border bg-background p-4">
                    <p className="text-xs text-muted-foreground">{durationBucketLabel(row.bucket)}</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">{formatMetric(row.avg_views)}</p>
                    <p className="text-xs text-muted-foreground">
                      média de visualizações · {row.posts} {row.posts === 1 ? "publicação" : "publicações"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
