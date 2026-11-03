import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOSTED_APP_URL, getSiteUrl } from "@/lib/blog-posts";
import { GITHUB_URL, UPSTREAM_GITHUB_URL } from "@/lib/site";

const LAST_UPDATED = "2 de julho de 2026";
const CONTACT_EMAIL = "kikitobroficial@gmail.com";

export const metadata: Metadata = {
  title: "Termos de Serviço | Kortes",
  description:
    "Os termos que regem o seu uso dos aplicativos Kortes e do serviço hospedado de cortes de vídeo, incluindo assinaturas adquiridas na web ou na App Store.",
  alternates: {
    canonical: `${getSiteUrl()}/terms`,
  },
  openGraph: {
    title: "Termos de Serviço do Kortes",
    description: "Os termos que regem o seu uso do Kortes.",
    type: "website",
    url: `${getSiteUrl()}/terms`,
    siteName: "Kortes",
  },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2
        className="text-2xl font-bold tracking-tight"
        style={{ fontFamily: "var(--font-syne), var(--font-geist-sans), system-ui" }}
      >
        {title}
      </h2>
      <div className="space-y-3 text-base leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/95">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Kortes" width={24} height={24} className="rounded-lg" />
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: "var(--font-syne), var(--font-geist-sans), system-ui" }}
            >
              Kortes
            </span>
          </Link>
          <a href={HOSTED_APP_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Abrir App
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <div className="space-y-3">
          <h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-syne), var(--font-geist-sans), system-ui" }}
          >
            Termos de Serviço
          </h1>
          <p className="text-sm text-muted-foreground">Última atualização: {LAST_UPDATED}</p>
        </div>

        <div className="mt-12 space-y-10">
          <Section title="Acordo">
            <p>
              Estes Termos de Serviço (&ldquo;Termos&rdquo;) regem o uso dos aplicativos e do serviço
              hospedado Kortes (&ldquo;Serviço&rdquo;), que transformam vídeos longos em clipes curtos
              e legendados. Ao criar uma conta ou usar o Serviço, você concorda com estes Termos.
              Se você não concordar, não use o Serviço.
            </p>
            <p>
              O Kortes também está disponível como software de código aberto que você pode auto-hospedar.
              Estes Termos se aplicam ao serviço hospedado operado pelo Kortes; instâncias auto-hospedadas
              são regidas pela licença de código aberto aplicável e pelos termos do próprio operador.
            </p>
          </Section>

          <Section title="Sua Conta">
            <p>
              Você deve fornecer informações precisas ao criar uma conta e manter suas credenciais seguras.
              Você é responsável pelas atividades que ocorrem em sua conta. Você deve ter pelo menos 13 anos
              de idade (ou a idade mínima exigida em sua jurisdição) para usar o Serviço.
            </p>
          </Section>

          <Section title="Seu Conteúdo e Responsabilidades">
            <p>
              Você mantém a propriedade dos vídeos que envia e dos clipes que o Serviço gera a partir deles.
              Você nos concede os direitos limitados necessários para processar, armazenar e fornecer esse
              conteúdo a você como parte da operação do Serviço.
            </p>
            <p>
              Você é o único responsável por possuir os direitos necessários sobre qualquer conteúdo enviado,
              incluindo vídeos referenciados por URL. Você não pode usar o Serviço para processar conteúdo que
              infrinja os direitos de terceiros, seja ilícito ou viole os termos de qualquer plataforma que o vincule.
            </p>
          </Section>

          <Section title="Assinaturas e Faturamento">
            <p>
              Planos pagos (por exemplo, Pro e Scale) desbloqueiam limites mensais maiores de geração de clipes.
              O mesmo benefício do plano se aplica à sua conta, independentemente de onde você realizou a compra.
            </p>
            <p className="font-medium text-foreground">Compras na web.</p>
            <p>
              As assinaturas na web são cobradas mensalmente pelo nosso processador de pagamentos, Stripe.
              Elas são renovadas automaticamente até serem canceladas. Você pode cancelar a qualquer momento
              pelo portal de faturamento nas Configurações; o acesso continua até o término do período já pago.
            </p>
            <p className="font-medium text-foreground">Compras no aplicativo iOS.</p>
            <p>
              As assinaturas adquiridas no aplicativo iOS são cobradas no seu Apple ID como assinaturas auto-renováveis.
              O pagamento é debitado na confirmação da compra, e a assinatura é renovada automaticamente, a menos que seja
              cancelada pelo menos 24 horas antes do término do período atual. Você pode gerenciar ou cancelar
              assinaturas da App Store nas configurações de assinatura do seu dispositivo; elas não podem ser
              gerenciadas pela web. Reembolsos de compras na App Store são processados exclusivamente pela Apple.
            </p>
            <p>
              A assinatura é gerenciada pela plataforma onde foi adquirida. Os preços podem mudar mediante aviso prévio;
              as alterações entram em vigor na renovação seguinte. Exceto quando exigido por lei ou pela política de reembolso
              da respectiva plataforma, os valores pagos não são reembolsáveis.
            </p>
          </Section>

          <Section title="Uso Aceitável">
            <ul className="list-disc space-y-2 pl-6">
              <li>É proibido conteúdo infrator, ilegal ou prejudicial.</li>
              <li>São proibidas tentativas de testar vulnerabilidades, interromper ou sobrecarregar o Serviço, ou contornar limites de uso.</li>
              <li>É proibida a revenda ou distribuição em formato white-label do Serviço hospedado sem nossa permissão prévia por escrito.</li>
              <li>É proibido usar o Serviço para violar termos de uso de plataformas terceiras aplicáveis a você.</li>
            </ul>
            <p>Podemos suspender ou encerrar contas que violem estes Termos.</p>
          </Section>

          <Section title="Propriedade Intelectual">
            <p>
              O Serviço, incluindo software, design e marca, é de propriedade do Kortes ou de seus licenciadores.
              Os componentes de código aberto são licenciados sob suas respectivas licenças. Estes Termos não concedem
              a você nenhum direito de utilizar nossas marcas registradas.
            </p>
            <p>
              O Kortes é baseado no <a href={UPSTREAM_GITHUB_URL} className="underline underline-offset-4">SupoClip</a>,
              licenciado sob a AGPL-3.0. O <a href={GITHUB_URL} className="underline underline-offset-4">código-fonte
              correspondente</a> está disponível sob a mesma licença.
            </p>
          </Section>

          <Section title="Isenção de Garantias">
            <p>
              O Serviço é fornecido &ldquo;como está&rdquo; e &ldquo;conforme disponível&rdquo;. Os resultados
              gerados por IA (transcrições, legendas, cortes selecionados e estimativas de viralidade) podem conter
              imprecisões e são fornecidos sem garantia de exatidão. Na extensão máxima permitida por lei, nos
              isentamos de todas as garantias, expressas ou implícitas, incluindo adequação a uma finalidade específica
              e não violação de direitos.
            </p>
          </Section>

          <Section title="Limitação de Responsabilidade">
            <p>
              Na extensão máxima permitida pela legislação aplicável, o Kortes não será responsável por danos indiretos,
              incidentais, especiais, consequenciais ou punitivos, nem por perda de lucros, dados ou reputação.
              Nossa responsabilidade total por reclamações relacionadas ao Serviço é limitada ao valor pago por você nos
              doze meses anteriores ao fato que originou a reclamação.
            </p>
          </Section>

          <Section title="Rescisão">
            <p>
              Você pode parar de usar o Serviço e excluir sua conta a qualquer momento. Podemos suspender ou encerrar
              seu acesso por violação destes Termos ou conforme exigido por lei. As seções que por sua natureza devem
              continuar em vigor após a rescisão (como propriedade intelectual, isenção de garantias e limitação de
              responsabilidade) permanecerão ativas.
            </p>
          </Section>

          <Section title="Alterações nestes Termos">
            <p>
              Podemos atualizar estes Termos periodicamente. Quando o fizermos, atualizaremos a data de &ldquo;Última atualização&rdquo;
              acima e, se apropriado, forneceremos aviso prévio. O uso contínuo do Serviço após a atualização significa que você
              aceita os Termos revisados.
            </p>
          </Section>

          <Section title="Fale Conosco">
            <p>
              Dúvidas sobre estes Termos? Envie um e-mail para{" "}
              <a className="text-foreground underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </Section>
        </div>

        <div className="mt-14 border-t pt-8 text-sm text-muted-foreground">
          <Link href="/privacy" className="underline hover:text-foreground">
            Política de Privacidade
          </Link>
          <span className="mx-2">&middot;</span>
          <Link href="/" className="underline hover:text-foreground">
            Voltar ao Kortes
          </Link>
        </div>
      </article>
    </main>
  );
}
