import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOSTED_APP_URL, getSiteUrl } from "@/lib/blog-posts";

const LAST_UPDATED = "16 de outubro de 2026";
const CONTACT_EMAIL = "privacy@supoclip.com";

export const metadata: Metadata = {
  title: "Política de Privacidade | Kortes",
  description:
    "Como o Kortes coleta, utiliza, compartilha e protege seus dados ao utilizar o serviço de corte de vídeos Kortes.",
  alternates: {
    canonical: `${getSiteUrl()}/privacy`,
  },
  openGraph: {
    title: "Política de Privacidade do Kortes",
    description: "Como o Kortes cuida dos seus dados.",
    type: "website",
    url: `${getSiteUrl()}/privacy`,
    siteName: "Kortes",
  },
};

function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
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

export default function PrivacyPolicyPage() {
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
            Política de Privacidade
          </h1>
          <p className="text-sm text-muted-foreground">Última atualização: {LAST_UPDATED}</p>
        </div>

        <div className="mt-12 space-y-10">
          <Section title="Visão Geral">
            <p>
              Esta Política de Privacidade explica como o Kortes (&ldquo;Kortes,&rdquo; &ldquo;nós,&rdquo;)
              coleta, utiliza, compartilha e protege informações quando você usa os aplicativos e o serviço hospedado
              Kortes (&ldquo;Serviço&rdquo;), que transformam vídeos longos em clipes curtos e legendados.
            </p>
            <p>
              O Kortes também está disponível como software de código aberto que você pode auto-hospedar. Se você
              utilizar uma instância auto-hospedada operada por você ou por terceiros, esse operador &mdash; e não o
              Kortes &mdash; será o responsável pelos dados processados por essa instância. Esta política descreve o
              serviço hospedado operado diretamente pelo Kortes.
            </p>
          </Section>

          <Section title="Informações que Coletamos">
            <p className="font-medium text-foreground">Informações da conta.</p>
            <p>
              Ao criar uma conta, coletamos seu nome, endereço de e-mail e uma senha protegida por hash criptográfico seguro.
              A autenticação é gerenciada pelo nosso provedor de autenticação; nunca armazenamos senhas em texto puro.
            </p>
            <p className="font-medium text-foreground">Conteúdo fornecido por você.</p>
            <p>
              Para gerar clipes, processamos as URLs de vídeos que você envia (por exemplo, links de vídeos que você tem
              autorização para usar) e quaisquer arquivos de vídeo carregados. Armazenamos os clipes resultantes,
              transcrições, legendas e metadados de processamento associados para que você possa visualizá-los, editá-los e
              exportá-los. Você é responsável por ter os direitos sobre qualquer conteúdo enviado.
            </p>
            <p className="font-medium text-foreground">Informações de faturamento.</p>
            <p>
              Os planos pagos são processados pelo nosso intermediador de pagamentos, Stripe. Não armazenamos o número completo
              do seu cartão; mantemos apenas o status da sua assinatura e o identificador de cliente necessário para gerenciar cobranças.
            </p>
            <p className="font-medium text-foreground">Dados de uso, dispositivo e registros técnicos.</p>
            <p>
              Coletamos identificadores de sessão, endereço IP e registros técnicos básicos para operar, proteger e diagnosticar o
              Serviço. Se métricas analíticas estiverem ativadas para o site hospedado, usamos um provedor focado em privacidade que
              não rastreia você entre sites nem constrói perfis publicitários.
            </p>
            <p className="font-medium text-foreground">Informações de campanhas e referências.</p>
            <p>
              Quando você visita nosso site sem estar conectado, seu navegador mantém um registro de como você chegou pela primeira vez,
              por até 90 dias. Esses dados são salvos no armazenamento local (localStorage) do seu navegador, e não em cookies. O
              registro inclui parâmetros de campanha no link acessado (como <code>utm_source</code>, <code>utm_campaign</code> ou um código <code>ref</code>),
              o domínio do site de origem (não o endereço completo), a página em que você entrou e a data/hora dessa visita. Os endereços das
              páginas são reduzidos à rota básica, garantindo que links de compartilhamento e IDs de projetos nunca sejam gravados. Nada é
              registrado enquanto você estiver conectado à sua conta.
            </p>
            <p>
              A primeira conta que fizer login nesse navegador assume esse registro, que em seguida é removido do navegador para que nenhuma
              outra conta possa utilizá-lo. Se a conta for nova, associamos o registro a ela uma única vez logo após o cadastro. Também
              registramos quando você baixa ou exporta um clipe pela primeira vez. Usamos essas informações para entender quais canais atraem
              usuários que consideram o Kortes útil. Se as análises estiverem ativadas, os eventos de cadastro e exportação de clipe enviados
              ao nosso provedor de análise incluirão os mesmos campos de campanha. Não usamos essas informações para publicidade nem as comercializamos.
              Você pode remover o registro do seu navegador a qualquer momento limpando os dados deste site.
            </p>
          </Section>

          <Section title="Como Usamos Suas Informações">
            <ul className="list-disc space-y-2 pl-6">
              <li>Fornecer o Serviço &mdash; processar seus vídeos e gerar, editar e exportar clipes.</li>
              <li>Autenticar seu acesso e manter sua conta segura.</li>
              <li>Processar pagamentos e gerenciar assinaturas.</li>
              <li>Enviar e-mails transacionais (como confirmação de cadastro, avisos de conclusão de processamento e recibos).</li>
              <li>Manter, diagnosticar falhas, proteger e aprimorar o Serviço.</li>
              <li>Entender quais campanhas e sites de referência geram cadastros e primeiras exportações de clipes.</li>
              <li>Caso você conecte uma rede social, publicar os clipes selecionados por você e exibir as métricas de desempenho.</li>
              <li>Cumprir obrigações legais e fazer cumprir nossos termos de uso.</li>
            </ul>
          </Section>

          <Section title="Contas de Redes Sociais Conectadas" id="connected-accounts">
            <p>
              Você pode conectar uma conta do YouTube, TikTok ou Instagram para que o Kortes publique clipes para você. A conexão
              é opcional, é feita diretamente pela tela de login da respectiva plataforma e nunca temos acesso à sua senha daquela rede social.
            </p>
            <p className="font-medium text-foreground">O que acessamos e por quê.</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <span className="text-foreground">Perfil básico</span> (ID da conta, nome de exibição, nome de usuário e foto do perfil) &mdash; para identificar qual conta está conectada.
              </li>
              <li>
                <span className="text-foreground">Permissão para upload ou publicação</span> &mdash; para publicar os clipes que você escolher, com o título, legenda, visibilidade e horário programados por você. Nunca publicamos nada que você não tenha solicitado explicitamente.
              </li>
              <li>
                <span className="text-foreground">Estatísticas de publicações feitas pelo Kortes</span> (visualizações, curtidas, comentários, compartilhamentos) &mdash; para exibir o desempenho dos seus clipes e, quando houver histórico suficiente, refinar a seleção automática de clipes para seus futuros vídeos.
              </li>
            </ul>
            <p>
              Armazenamos os tokens de acesso emitidos pelas plataformas de forma criptografada e os utilizamos exclusivamente para as
              finalidades descritas acima. Não comercializamos esses dados, não os utilizamos para anúncios, não os compartilhamos com outros
              usuários e não os usamos para treinar modelos de inteligência artificial de uso geral.
            </p>
            <p className="font-medium text-foreground">Desconexão e exclusão.</p>
            <p>
              Você pode desconectar uma rede social a qualquer momento na página Redes Sociais. A desconexão remove os tokens armazenados
              imediatamente, cancela eventuais publicações ainda agendadas para essa conta e solicita a revogação do acesso do Kortes
              junto à plataforma (quando suportado). Você também pode excluir o histórico de postagens publicadas e suas estatísticas no próprio
              aplicativo. A exclusão da sua conta Kortes remove todos esses dados permanentemente. Você também pode revogar a permissão
              diretamente nas configurações da própria plataforma, como no Google através das{" "}
              <a
                className="text-foreground underline"
                href="https://security.google.com/settings/security/permissions"
                target="_blank"
                rel="noreferrer"
              >
                configurações de segurança do Google
              </a>
              . Para solicitar a exclusão desses dados, envie um e-mail para{" "}
              <a className="text-foreground underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
            <p className="font-medium text-foreground">YouTube e Google.</p>
            <p>
              O Kortes utiliza os Serviços de API do YouTube. Ao conectar uma conta do YouTube, você concorda com os{" "}
              <a className="text-foreground underline" href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer">
                Termos de Serviço do YouTube
              </a>
              , e o tratamento dos seus dados pelo Google está descrito na{" "}
              <a className="text-foreground underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
                Política de Privacidade do Google
              </a>
              . O uso e a transferência para qualquer outro aplicativo de informações recebidas das APIs do Google pelo Kortes atenderão à{" "}
              <a
                className="text-foreground underline"
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noreferrer"
              >
                Política de Dados do Usuário dos Serviços de API do Google
              </a>
              , incluindo os requisitos de Uso Limitado.
            </p>
          </Section>

          <Section title="Provedores de Serviços e Subprocessadores">
            <p>
              Compartilhamos dados com fornecedores terceiros que os processam em nosso nome, apenas conforme necessário para viabilizar o Serviço:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li><span className="text-foreground">Transcrição</span> &mdash; para transcrever o áudio dos seus vídeos.</li>
              <li><span className="text-foreground">Provedores de IA/LLM</span> &mdash; para analisar transcrições e identificar os melhores momentos para clipes.</li>
              <li><span className="text-foreground">Stripe</span> &mdash; processamento de pagamentos.</li>
              <li><span className="text-foreground">Envio de e-mails</span> &mdash; e-mails transacionais e notificações.</li>
              <li><span className="text-foreground">Hospedagem e infraestrutura</span> &mdash; para manter o Serviço funcionando na nuvem.</li>
              <li><span className="text-foreground">Análise de métricas</span> &mdash; quando ativada, para mensurar visitas, cadastros e exportações de clipes.</li>
              <li><span className="text-foreground">YouTube, TikTok e Instagram (Meta)</span> &mdash; somente se você conectar sua conta, para publicar os clipes selecionados e coletar estatísticas (conforme seção Contas de Redes Sociais Conectadas).</li>
            </ul>
            <p>
              Não comercializamos suas informações pessoais e não as utilizamos para publicidade comportamental entre contextos. Podemos divulgar
              informações se exigido por lei ou para proteger os direitos, a segurança e a integridade de nossos usuários e do Serviço.
            </p>
          </Section>

          <Section title="Retenção de Dados">
            <p>
              Mantemos as informações da sua conta, incluindo dados de campanha e referência salvos no cadastro, enquanto sua conta estiver ativa.
              Suas tarefas, vídeos carregados e clipes gerados são mantidos até que você os exclua ou encerre sua conta. Arquivos temporários de
              processamento são excluídos automaticamente após a conclusão da tarefa. Podemos reter registros limitados conforme exigido para
              fins legais, contábeis ou de segurança.
            </p>
          </Section>

          <Section title="Seus Direitos e Escolhas">
            <p>
              Você pode acessar e atualizar os dados da sua conta diretamente no aplicativo. Você pode excluir tarefas e clipes individuais a qualquer momento.
              Você pode excluir sua conta &mdash; o que remove seus dados associados de forma definitiva &mdash; direto no aplicativo ou entrando em contato pelo e-mail{" "}
              <a className="text-foreground underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
            <p>
              Dependendo de onde você reside (por exemplo, sob a LGPD no Brasil, GDPR na Europa ou CCPA/CPRA nos EUA), você pode ter direitos de acessar,
              corrigir, excluir ou portar seus dados pessoais, além de se opor ou restringir determinados processamentos. Para exercer esses direitos,
              entre em contato pelo endereço informado. Não faremos qualquer discriminação contra você pelo exercício dos seus direitos.
            </p>
          </Section>

          <Section title="Segurança">
            <p>
              Utilizamos medidas de proteção padrão da indústria, incluindo criptografia em trânsito (HTTPS). Em dispositivos móveis, as credenciais
              de sessão são armazenadas no chaveiro seguro do sistema operacional. Nenhum método de transmissão ou armazenamento é 100% infalível, mas
              trabalhamos continuamente para proteger suas informações com medidas técnicas e organizacionais adequadas.
            </p>
          </Section>

          <Section title="Transferências Internacionais">
            <p>
              Podemos processar e armazenar informações em servidores localizados fora do seu país de residência. Sempre que necessário, adotamos
              salvaguardas legais adequadas para assegurar a proteção dessas transferências.
            </p>
          </Section>

          <Section title="Privacidade de Menores">
            <p>
              O Serviço não é direcionado a menores de 13 anos (ou a idade mínima exigida em sua jurisdição) e não coletamos intencionalmente informações
              pessoais desse público. Se você acredita que um menor nos forneceu dados pessoais, entre em contato conosco para que possamos providenciar
              a exclusão imediata.
            </p>
          </Section>

          <Section title="Alterações nesta Política">
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Quando o fizermos, atualizaremos a data de &ldquo;Última atualização&rdquo;
              acima e, quando apropriado, forneceremos aviso prévio. A continuidade do uso do Serviço após a atualização constitui sua concordância com
              a política revisada.
            </p>
          </Section>

          <Section title="Fale Conosco">
            <p>
              Dúvidas sobre esta política ou sobre seus dados? Envie um e-mail para{" "}
              <a className="text-foreground underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </Section>
        </div>

        <div className="mt-14 border-t pt-8 text-sm text-muted-foreground">
          <Link href="/" className="underline hover:text-foreground">
            Voltar ao Kortes
          </Link>
        </div>
      </article>
    </main>
  );
}
