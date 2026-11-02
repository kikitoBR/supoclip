import Link from "next/link";

import { ArticleShell, type ArticleFaq } from "@/components/articles/article-shell";
import type { BlogPost } from "@/lib/blog-posts";
import { getPublicBillingPlans } from "@/lib/billing-plans";
import { SELF_HOSTING_GUIDE_HREF } from "@/lib/marketing-links";
import { GITHUB_URL } from "@/lib/site";

const source = (path: string) => `${GITHUB_URL}/blob/main/${path}`;

const OPUS_SOURCES = {
  plans: "https://help.opus.pro/docs/article/plans-and-credits",
  watermark: "https://help.opus.pro/docs/article/watermark",
};

const faqs: ArticleFaq[] = [
  {
    question: "O Kortes é melhor que o OpusClip?",
    answer:
      "Depende do que você precisa. O Kortes combina mais se você quer acesso ao código, auto-hospedagem ou escolher os próprios modelos de IA. O OpusClip combina mais se você quer um produto gerenciado com um plano gratuito para testar. Não afirmamos que nenhum dos dois gera clipes melhores, porque não fizemos um teste controlado que sustente isso.",
  },
  {
    question: "O Kortes coloca marca d'água?",
    answer:
      "Não. O processo de renderização do Kortes não tem etapa de marca d'água, nem na versão hospedada nem na instalação própria. A central de ajuda do OpusClip diz que as exportações do plano gratuito podem incluir uma marca d'água do OpusClip.",
  },
  {
    question: "A versão hospedada do Kortes tem plano gratuito?",
    answer:
      "Não. A versão hospedada exige uma assinatura Pro ou Scale para processar vídeos. O caminho gratuito é hospedar o código aberto você mesmo, sem limites de plano; você paga apenas a sua infraestrutura e os provedores de IA que configurar.",
  },
  {
    question: "Qual é mais rápido ou gera clipes melhores?",
    answer:
      "Não publicamos um teste controlado de velocidade ou de qualidade dos clipes, então não fazemos essa afirmação. Os resultados dependem dos seus vídeos e configurações; os passos de teste justo desta página mostram como comparar com o seu próprio conteúdo.",
  },
];

const toc: Array<[string, string]> = [
  ["verdict", "Resposta curta"],
  ["comparison", "Lado a lado"],
  ["pricing", "Modelo de preço"],
  ["choose-supoclip", "Quando o Kortes combina"],
  ["choose-opusclip", "Quando o OpusClip combina"],
  ["test", "Faça o seu teste"],
  ["sources", "Fontes"],
  ["faq", "Perguntas frequentes"],
];

export function OpusClipComparisonArticle({ post }: { post: BlogPost }) {
  const [pro, scale] = getPublicBillingPlans();
  const rows: Array<[string, React.ReactNode, React.ReactNode]> = [
    [
      "Como você usa",
      <>App hospedado ou instalação própria com <a href={source("docker-compose.yml")}>Docker Compose</a></>,
      "Serviço hospedado",
    ],
    [
      "Código-fonte",
      <>Público, <a href={source("LICENSE")}>AGPL-3.0</a></>,
      "Não coberto pelas fontes abaixo",
    ],
    [
      "Modelo de preço",
      <>Hospedado: planos mensais com um número fixo de vídeos. Auto-hospedado: sem limites de plano.</>,
      <>Planos com créditos por minutos de processamento, além de um plano gratuito (<a href={OPUS_SOURCES.plans}>central de ajuda</a>)</>,
    ],
    [
      "Marca d'água",
      <>Nenhuma; o <a href={`${GITHUB_URL}/tree/main/backend/src/media`}>processo de renderização</a> não tem etapa de marca d&apos;água</>,
      <>As exportações do plano gratuito podem ter uma (<a href={OPUS_SOURCES.watermark}>central de ajuda</a>)</>,
    ],
    [
      "Escolha do modelo de IA",
      <>OpenAI, Google, Anthropic, OpenRouter ou Ollama local (<a href={source("docs/configuration.md")}>configuração</a>)</>,
      "Não coberto pelas fontes abaixo",
    ],
    [
      "Transcrição",
      "AssemblyAI, Whisper local ou legendas do YouTube",
      "Não coberto pelas fontes abaixo",
    ],
    [
      "Automação",
      <>API REST com chaves por usuário e um <a href={source("mcp/README.md")}>servidor MCP</a></>,
      "Não coberto pelas fontes abaixo",
    ],
  ];

  return (
    <ArticleShell post={post} breadcrumb="Kortes vs OpusClip" toc={toc} faqs={faqs}>
      <p>
        O OpusClip ajudou a definir os cortes com IA: você envia um vídeo longo e recebe clipes verticais curtos. O Kortes faz
        o mesmo trabalho como um projeto de código aberto que você pode usar hospedado ou rodar você mesmo. Esta comparação se
        limita ao que cada produto documenta. As afirmações sobre o Kortes apontam para o nosso código. As afirmações sobre o
        OpusClip apontam para a central de ajuda do próprio OpusClip. Quando uma fonte não cobre algo, a tabela diz isso em vez de adivinhar.
      </p>
      <p>
        Esta página não avalia a qualidade dos clipes, a precisão das legendas nem a velocidade de processamento. Para comparar isso, veja{" "}
        <a href="#test">como fazer o seu próprio teste</a>.
      </p>

      <h2 id="verdict">A resposta curta</h2>
      <ul>
        <li><strong>Escolha o Kortes</strong> se você quer hospedar por conta própria, inspecionar ou modificar o código, escolher os seus modelos de IA (inclusive 100% locais) ou exportar sem marca d&apos;água.</li>
        <li><strong>Escolha o OpusClip</strong> se você quer um produto gerenciado que nunca precise instalar e quer começar num plano gratuito.</li>
      </ul>

      <h2 id="comparison">Lado a lado</h2>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[600px] text-left text-sm leading-6">
          <caption className="sr-only">Comparação entre Kortes e OpusClip com fontes</caption>
          <thead className="bg-muted">
            <tr><th scope="col" className="p-3">Área</th><th scope="col" className="p-3">Kortes</th><th scope="col" className="p-3">OpusClip</th></tr>
          </thead>
          <tbody>
            {rows.map(([area, supoclip, opusclip]) => (
              <tr key={area} className="border-t">
                <th scope="row" className="p-3 align-top">{area}</th>
                <td className="p-3 align-top text-muted-foreground">{supoclip}</td>
                <td className="p-3 align-top text-muted-foreground">{opusclip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm">
        &ldquo;Não coberto pelas fontes abaixo&rdquo; significa que os artigos citados da central de ajuda do OpusClip não tratam do assunto.
        Não quer dizer que o OpusClip não tenha o recurso. Consulte o <a href="https://www.opus.pro/">opus.pro</a> para o que não estiver listado aqui.
      </p>

      <h2 id="pricing">Modelo de preço: créditos, planos ou a sua própria infraestrutura</h2>
      <p>
        O <a href={OPUS_SOURCES.plans}>artigo de planos e créditos</a> do OpusClip descreve planos pagos que usam créditos por
        minutos de processamento, além de um plano gratuito. O <a href={OPUS_SOURCES.watermark}>artigo sobre marca d&apos;água</a> diz que as
        exportações do plano gratuito podem ter uma marca d&apos;água do OpusClip. Preços e quantidades de créditos mudam, então confira a
        página de preços atual do OpusClip em vez de confiar em números copiados para um artigo de blog.
      </p>
      <p>
        O Kortes oferece dois caminhos. A versão hospedada tem o <strong>{pro.name}</strong> por US${pro.priceMonthly}/mês para{" "}
        {pro.generationLimit} vídeos e o <strong>{scale.name}</strong> por US${scale.priceMonthly}/mês para {scale.generationLimit} vídeos.
        Não há plano hospedado gratuito; o processamento exige uma assinatura. O caminho auto-hospedado é software livre, sem limites
        de plano. Você paga o servidor e as APIs de IA que configurar, e o{" "}
        <Link href={SELF_HOSTING_GUIDE_HREF}>guia de auto-hospedagem</Link> mostra uma configuração 100% local, sem taxas de IA por requisição.
      </p>

      <h2 id="choose-supoclip">Quando o Kortes combina mais</h2>
      <ul>
        <li><strong>Você precisa controlar para onde o vídeo vai.</strong> A auto-hospedagem mantém o app, o banco de dados e os clipes renderizados na sua infraestrutura. Com Whisper e Ollama, a transcrição e a seleção de clipes também rodam localmente.</li>
        <li><strong>Você tem um acervo grande.</strong> Instalações próprias não têm limite mensal de vídeos. A vazão depende do seu hardware e dos limites dos provedores.</li>
        <li><strong>Você quer mudar como os clipes são escolhidos.</strong> O prompt de seleção, a pontuação, os modelos de legenda e a renderização estão todos no repositório.</li>
        <li><strong>Você está integrando os cortes a outra ferramenta.</strong> Chaves de API, uma API REST e um servidor MCP permitem que scripts e agentes de IA criem e baixem clipes.</li>
      </ul>

      <h2 id="choose-opusclip">Quando o OpusClip combina mais</h2>
      <ul>
        <li><strong>Você não quer operar nada.</strong> Hospedar por conta própria significa cuidar do Docker, das chaves dos provedores, das atualizações e dos backups.</li>
        <li><strong>Você quer testar antes de pagar.</strong> O OpusClip documenta um plano gratuito (com possível marca d&apos;água). A versão hospedada do Kortes não tem plano gratuito.</li>
        <li><strong>Você depende de recursos não cobertos aqui.</strong> Se um fluxo específico do OpusClip é importante para você, confirme no opus.pro e teste se o Kortes atende antes de trocar.</li>
      </ul>

      <h2 id="test">Como fazer o seu próprio teste justo</h2>
      <p>A comparação que mais importa é a feita com o seu próprio conteúdo:</p>
      <ol>
        <li>Escolha duas ou três gravações que representem o seu canal: uma fácil (uma pessoa falando) e uma difícil (várias pessoas, compartilhamento de tela).</li>
        <li>Rode cada uma nas duas ferramentas com as configurações padrão e anote o tempo entre o envio e os clipes prontos.</li>
        <li>Embaralhe os clipes e revise sem saber qual ferramenta fez cada um. Avalie se cada clipe faz sentido sem contexto, tem um gancho claro, enquadra bem quem fala e tem legendas precisas.</li>
        <li>Conte quantas edições cada clipe precisa antes de você publicar. O tempo de edição é um custo que o preço da assinatura não mostra.</li>
      </ol>
      <p>
        Quer ver resultados do Kortes primeiro? A <Link href="/demo">página de demonstração</Link> mostra clipes reais com links para os
        trechos originais.
      </p>

      <h2 id="sources">Fontes</h2>
      <ul>
        <li>Central de ajuda do OpusClip: <a href={OPUS_SOURCES.plans}>Planos e créditos</a> e <a href={OPUS_SOURCES.watermark}>Marca d&apos;água</a>. Os planos podem mudar; confirme os detalhes atuais no <a href="https://www.opus.pro/">opus.pro</a>.</li>
        <li>Kortes: <a href={GITHUB_URL}>repositório público</a>, incluindo o <a href={source("docker-compose.yml")}>docker-compose.yml</a>, a <a href={source("docs/configuration.md")}>documentação de configuração</a> e as <a href={source("backend/src/services/billing_service.py")}>regras de cobrança</a>. Os preços da versão hospedada vêm da seção de preços do Kortes.</li>
      </ul>
    </ArticleShell>
  );
}
