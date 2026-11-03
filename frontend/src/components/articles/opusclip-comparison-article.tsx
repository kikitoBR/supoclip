import Link from "next/link";

import { ArticleShell, type ArticleFaq } from "@/components/articles/article-shell";
import type { BlogPost } from "@/lib/blog-posts";

const OPUS_SOURCES = {
  plans: "https://help.opus.pro/docs/article/plans-and-credits",
  watermark: "https://help.opus.pro/docs/article/watermark",
};

const faqs: ArticleFaq[] = [
  {
    question: "O Kortes é melhor que o OpusClip?",
    answer:
      "Depende do que você precisa. O Kortes combina mais se você quer cortes sem marca d'água e sem contar créditos. O OpusClip combina mais se você depende de recursos específicos dele. Não afirmamos que nenhum dos dois gera clipes melhores, porque não fizemos um teste controlado que sustente isso.",
  },
  {
    question: "O Kortes coloca marca d'água?",
    answer:
      "Não. O processo de renderização do Kortes não tem etapa de marca d'água. A central de ajuda do OpusClip diz que as exportações do plano gratuito podem incluir uma marca d'água do OpusClip.",
  },
  {
    question: "Preciso instalar alguma coisa para usar o Kortes?",
    answer:
      "Não. O Kortes funciona no navegador: crie uma conta, cole um link do YouTube ou envie um arquivo, e o processamento acontece na nuvem.",
  },
  {
    question: "Qual é mais rápido ou gera clipes melhores?",
    answer:
      "Não publicamos um teste controlado de velocidade ou de qualidade dos clipes, então não fazemos essa afirmação. Os resultados dependem dos seus vídeos; os passos de teste justo desta página mostram como comparar com o seu próprio conteúdo.",
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
  const rows: Array<[string, React.ReactNode, React.ReactNode]> = [
    ["Como você usa", "App na web, sem instalar nada", "Serviço hospedado"],
    [
      "Modelo de preço",
      "Gratuito no momento, sem créditos por minuto",
      <>Planos com créditos por minutos de processamento, além de um plano gratuito (<a href={OPUS_SOURCES.plans}>central de ajuda</a>)</>,
    ],
    [
      "Marca d'água",
      "Nenhuma",
      <>As exportações do plano gratuito podem ter uma (<a href={OPUS_SOURCES.watermark}>central de ajuda</a>)</>,
    ],
    ["Enquadramento", "Corte 9:16 que acompanha o rosto de quem fala", "Não coberto pelas fontes abaixo"],
    ["Legendas", "Sincronizadas palavra a palavra, com modelos editáveis", "Não coberto pelas fontes abaixo"],
    ["Automação", "API REST com chaves por usuário e um servidor MCP", "Não coberto pelas fontes abaixo"],
  ];

  return (
    <ArticleShell post={post} breadcrumb="Kortes vs OpusClip" toc={toc} faqs={faqs}>
      <p>
        O OpusClip ajudou a definir os cortes com IA: você envia um vídeo longo e recebe clipes verticais curtos. O Kortes faz
        o mesmo trabalho direto no navegador. Esta comparação se limita ao que cada produto documenta. As afirmações sobre o
        OpusClip apontam para a central de ajuda do próprio OpusClip. Quando uma fonte não cobre algo, a tabela diz isso em vez de adivinhar.
      </p>
      <p>
        Esta página não avalia a qualidade dos clipes, a precisão das legendas nem a velocidade de processamento. Para comparar isso, veja{" "}
        <a href="#test">como fazer o seu próprio teste</a>.
      </p>

      <h2 id="verdict">A resposta curta</h2>
      <ul>
        <li><strong>Escolha o Kortes</strong> se você quer exportar sem marca d&apos;água, sem contar créditos por minuto e com legendas e enquadramento prontos para postar.</li>
        <li><strong>Escolha o OpusClip</strong> se você depende de um recurso específico dele que não aparece nesta comparação.</li>
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

      <h2 id="pricing">Modelo de preço</h2>
      <p>
        O <a href={OPUS_SOURCES.plans}>artigo de planos e créditos</a> do OpusClip descreve planos pagos que usam créditos por
        minutos de processamento, além de um plano gratuito. O <a href={OPUS_SOURCES.watermark}>artigo sobre marca d&apos;água</a> diz que as
        exportações do plano gratuito podem ter uma marca d&apos;água do OpusClip. Preços e quantidades de créditos mudam, então confira a
        página de preços atual do OpusClip em vez de confiar em números copiados para um artigo de blog.
      </p>
      <p>
        O Kortes é gratuito no momento: você cria uma conta e processa seus vídeos sem créditos por minuto e sem marca d&apos;água.
      </p>

      <h2 id="choose-supoclip">Quando o Kortes combina mais</h2>
      <ul>
        <li><strong>Você quer postar sem marca d&apos;água.</strong> Os clipes saem limpos, prontos para Shorts, Reels e TikTok.</li>
        <li><strong>Você grava conversas e entrevistas.</strong> O enquadramento acompanha o rosto de quem está falando, e as legendas são sincronizadas palavra a palavra.</li>
        <li><strong>Você quer revisar antes de publicar.</strong> Dá para ajustar início e fim, dividir, juntar clipes e editar as legendas.</li>
        <li><strong>Você está integrando os cortes a outra ferramenta.</strong> Chaves de API, uma API REST e um servidor MCP permitem que scripts e agentes de IA criem e baixem clipes.</li>
      </ul>

      <h2 id="choose-opusclip">Quando o OpusClip combina mais</h2>
      <ul>
        <li><strong>Você já tem um fluxo montado nele.</strong> Trocar de ferramenta tem custo; teste o Kortes com alguns vídeos antes de mudar tudo.</li>
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
        <li>Kortes: recursos descritos a partir do próprio app e da <Link href="/demo">página de demonstração</Link>.</li>
      </ul>
    </ArticleShell>
  );
}
