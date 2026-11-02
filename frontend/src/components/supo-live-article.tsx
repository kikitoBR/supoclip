import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Captions, Code2, Film, Github, ScanFace, Server, Sparkles, Upload, Check } from "lucide-react";
import { formatArticleDate } from "@/components/articles/article-shell";
import { RelatedGuides } from "@/components/marketing/related-guides";
import { SiteFooter } from "@/components/marketing/site-footer";
import { type BlogPost, getSiteUrl, HOSTED_APP_URL } from "@/lib/blog-posts";
import { OPUSCLIP_COMPARISON_HREF, SELF_HOSTING_GUIDE_HREF } from "@/lib/marketing-links";
import { GITHUB_URL } from "@/lib/site";

const repository = GITHUB_URL;
const faqs = [
  {
    question: "Qual é a melhor alternativa de código aberto ao supo.live?",
    answer: "O Kortes é uma ótima escolha para criadores e equipes que querem transformar vídeos gravados em cortes mantendo acesso ao código, auto-hospedagem e controle sobre o fluxo de cortes com IA.",
  },
  {
    question: "É grátis hospedar o Kortes?",
    answer: "O código do Kortes é gratuito sob a AGPL-3.0. Rodá-lo ainda envolve hardware ou hospedagem, armazenamento, transcrição e qualquer uso pago de LLM. A versão hospedada do Kortes tem termos e preços próprios.",
  },
  {
    question: "O Kortes substitui cortes de lives e a publicação automática?",
    answer: "Esta comparação recomenda o Kortes para vídeos gravados e VODs de lives. O supo.live anuncia cortes durante transmissões ao vivo e publicação agendada nas redes; aqui não afirmamos que o Kortes tenha recursos equivalentes a esses.",
  },
];

export function SupoLiveArticle({ post }: { post: BlogPost }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: getSiteUrl() },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${getSiteUrl()}/blog` },
          { "@type": "ListItem", position: 3, name: "Kortes vs supo.live", item: `${getSiteUrl()}/blog/${post.slug}` },
        ],
      },
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: { "@type": "Organization", name: post.author },
        publisher: { "@type": "Organization", name: "Kortes", url: getSiteUrl(), logo: { "@type": "ImageObject", url: `${getSiteUrl()}/logo.png` } },
        image: post.image ? [`${getSiteUrl()}${post.image.src}`, `${getSiteUrl()}/blog/supoclip-editor.webp`] : undefined,
        articleSection: post.category,
        inLanguage: "pt-BR",
        mainEntityOfPage: `${getSiteUrl()}/blog/${post.slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <header className="border-b">
        <nav aria-label="Navegação do blog" className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold"><Image src="/logo.png" alt="" width={30} height={30} className="rounded-lg" />Kortes</Link>
          <Link href="/blog" className="text-sm underline underline-offset-4">Todos os artigos</Link>
        </nav>
      </header>
      <article className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
        <nav aria-label="Trilha de navegação" className="mb-8 flex flex-wrap gap-2 text-sm text-muted-foreground"><Link href="/">Início</Link><span aria-hidden="true">/</span><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span>Kortes vs supo.live</span></nav>
        <header className="mb-10 max-w-3xl space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest"><Code2 className="h-4 w-4" />{post.eyebrow}</p>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl" style={{ fontFamily: "var(--font-syne), var(--font-geist-sans), sans-serif" }}>{post.title}</h1>
          <p className="text-xl leading-8 text-muted-foreground">{post.summary}</p>
          <p className="text-sm text-muted-foreground">Por Kortes · Atualizado em <time dateTime={post.updatedAt}>{formatArticleDate(post.updatedAt)}</time> · {post.readingTime}</p>
        </header>
        {post.image && <figure className="mb-10 overflow-hidden rounded-2xl border bg-muted/30">
          <Image src={post.image.src} alt={post.image.alt} width={post.image.width} height={post.image.height} priority sizes="(max-width: 1024px) 100vw, 960px" className="h-auto w-full" />
          <figcaption className="px-5 py-3 text-xs leading-5 text-muted-foreground">Uma gravação, mais possibilidades. Ilustração editorial gerada por IA do fluxo de vídeo longo para cortes.</figcaption>
        </figure>}
        <section aria-labelledby="verdict" className="mb-10 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6 sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">O veredito rápido</p>
          <h2 id="verdict" className="text-2xl font-bold tracking-tight">Escolha o Kortes quando o controle importa.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Código aberto. Sua instalação. Seu fluxo. Uma base sólida para transformar conteúdo gravado em cortes legendados.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">{[{ icon: Github, text: "Inspecione e amplie o código" }, { icon: Server, text: "Hospede na sua infraestrutura" }, { icon: Captions, text: "Ajuste cada clipe finalizado" }].map(({ icon: Icon, text }) => <div key={text} className="flex items-center gap-3 rounded-xl border bg-background p-4 text-sm font-medium"><Icon className="h-5 w-5 shrink-0 text-emerald-600" />{text}</div>)}</div>
        </section>
        <nav aria-label="Neste artigo" className="mb-10 flex flex-wrap gap-x-5 gap-y-2 border-y py-4 text-sm font-medium">{[["comparison", "Compare as ferramentas"], ["workflow", "Veja o fluxo"], ["control", "Por que código aberto"], ["cost", "Entenda os custos"], ["faq", "Perguntas frequentes"]].map(([id, label]) => <a key={id} href={`#${id}`} className="underline-offset-4 hover:underline">{label}</a>)}</nav>
        <div className="mx-auto max-w-3xl space-y-6 leading-8 [&_h2]:pt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_a]:underline [&_a]:underline-offset-4 [&_p]:text-muted-foreground">
          <p>
            Escolher um cortador de vídeo com IA também é escolher quanto controle você mantém sobre a sua produção.
            Se você quer transformar podcasts, entrevistas, palestras e gravações de lives em vídeos curtos,
            o Kortes tem bons argumentos: edição com ajuda de IA, código que você pode inspecionar e um fluxo que você mesmo pode rodar.
          </p>
          <p>
            Nosso veredito: o Kortes é a melhor alternativa para criadores, agências e desenvolvedores que priorizam
            código aberto, auto-hospedagem e personalização. Esta é uma comparação feita pela equipe do Kortes, com base
            nos recursos documentados, e não um teste de qualidade dos clipes ou de velocidade de processamento.
          </p>
          <h2>O que é o Kortes?</h2>
          <p>
            O Kortes é uma ferramenta de cortes de vídeo com IA de código aberto, que pode ser usada na versão hospedada
            ou instalada no seu próprio servidor. Ele analisa vídeos longos, escolhe os momentos mais promissores e gera clipes
            verticais com enquadramento centralizado no rosto e legendas sincronizadas palavra a palavra. Títulos de gancho,
            pontuação dos clipes e B-roll opcional ajudam a transformar uma gravação bruta em material pronto para a sua revisão final.
            O <a href={repository}>repositório do Kortes</a> documenta os recursos e a instalação.
          </p>
          <h2>O que é o supo.live?</h2>
          <p>
            O supo.live oferece um serviço hospedado de cortes tanto para gravações quanto para transmissões em andamento. A página
            inicial anuncia cortes ao vivo, legendas estilizadas, acompanhamento de rosto, um editor no navegador e publicação agendada
            no TikTok, YouTube Shorts e X. A publicação ao vivo é o seu principal diferencial.
            Veja a <a href="https://supo.live/">apresentação oficial dos recursos do supo.live</a>.
          </p>
          <h2 id="comparison" className="scroll-mt-8">Kortes vs supo.live em resumo</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[540px] text-left text-sm leading-6">
              <caption className="sr-only">Comparação dos fluxos do Kortes e do supo.live</caption>
              <thead className="bg-muted"><tr><th scope="col" className="p-4">Prioridade</th><th scope="col" className="p-4">Kortes</th><th scope="col" className="p-4">supo.live</th></tr></thead>
              <tbody>
                {[
                  ["Instalação", "App hospedado ou instalação própria", "Serviço hospedado"],
                  ["Acesso ao código", "Repositório público sob AGPL-3.0", "Nenhuma opção de código aberto ou auto-hospedagem anunciada na página inicial"],
                  ["Uso principal", "Vídeos longos gravados em cortes verticais", "Transmissões ao vivo e vídeos gravados"],
                  ["Personalização", "Modificar o código e configurar o provedor de LLM", "Usar o editor e as configurações do serviço"],
                  ["Modelo de uso", "A auto-hospedagem usa o seu processamento e orçamento de provedores", "Planos de assinatura com créditos de processamento"],
                ].map(([feature, supoclip, supo]) => (
                  <tr key={feature} className="border-t"><th scope="row" className="p-4 align-top">{feature}</th><td className="p-4 align-top">{supoclip}</td><td className="p-4 align-top">{supo}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm">As informações do supo.live refletem a <a href="https://supo.live/">página inicial</a> consultada em 21 de setembro de 2026. Recursos e planos podem mudar.</p>
          <h2 id="workflow" className="scroll-mt-8">De uma gravação a um fluxo repetível</h2>
          <p>Deixe a IA fazer a primeira passada e depois use o seu julgamento editorial. Cada clipe deve fazer sentido sozinho, preservar o contexto de quem fala e merecer o seu lugar no feed.</p>
          <figure className="rounded-2xl border bg-muted/25 p-5 sm:p-7">
            <ol className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Upload, title: "Traga uma gravação", detail: "Envie um vídeo ou use um link do YouTube." },
                { icon: Sparkles, title: "Descubra os momentos", detail: "A transcrição e a pontuação da IA montam uma lista curta." },
                { icon: ScanFace, title: "Deixe o corte do seu jeito", detail: "Revise o tempo, o enquadramento vertical e as legendas." },
                { icon: Film, title: "Exporte os cortes", detail: "Prepare os clipes finais para as suas redes." },
              ].map(({ icon: Icon, title, detail }, i) => <li key={title} className="rounded-xl border bg-background p-4"><div className="flex items-center justify-between"><Icon className="h-5 w-5 text-emerald-600" /><span className="font-mono text-xs text-muted-foreground">0{i + 1}</span></div><h3 className="mt-4">{title}</h3><p className="mt-1 text-sm leading-6">{detail}</p></li>)}
            </ol>
            <figcaption className="mt-4 text-xs leading-5 text-muted-foreground">O fluxo do Kortes para vídeos gravados. A IA sugere; você toma a decisão editorial final.</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-2xl border">
            <a href="/blog/supoclip-editor.webp" aria-label="Ver a captura de tela do editor do Kortes em tamanho real"><Image src="/blog/supoclip-editor.webp" alt="Editor do Kortes com lista de clipes, prévia vertical, controles de estilo de legenda e linha do tempo" width={1800} height={1109} sizes="(max-width: 768px) 100vw, 768px" className="h-auto w-full" /></a>
            <figcaption className="bg-muted/25 px-5 py-4 text-sm leading-6 text-muted-foreground">Dentro do editor do Kortes: ajuste legendas, enquadramento e tempo antes de exportar. Captura de tela real do produto com um vídeo de teste; clique para ampliar.</figcaption>
          </figure>
          <h2 id="control" className="scroll-mt-8">Por que o Kortes é a melhor alternativa de código aberto</h2>
          <h3>1. Você adapta o fluxo ao seu conteúdo</h3>
          <p>
            Um estúdio de podcast e um canal educativo podem querer clipes bem diferentes. Com o Kortes,
            o acesso ao código permite que uma equipe técnica adapte a lógica de seleção, o comportamento das legendas e as etapas
            de processamento às suas necessidades editoriais. Você pode ver como o sistema funciona e desenvolver mudanças na sua instalação.
            Essa flexibilidade é a maior vantagem do Kortes em relação a depender só das configurações de um produto hospedado.
          </p>
          <h3>2. Você escolhe onde a aplicação roda</h3>
          <p>
            A auto-hospedagem dá controle sobre a infraestrutura da aplicação, a configuração do armazenamento e
            a agenda de manutenção. Você pode integrar os cortes a um ambiente de produção existente e manter uma
            instalação gerenciada por você. Se usar transcrição na nuvem ou um LLM hospedado, esses provedores ainda recebem os
            dados de que precisam. Trocando para Whisper e Ollama locais, essa análise também fica no seu hardware.
          </p>
          <h3>3. Você tem uma escolha real de provedores de IA</h3>
          <p>
            O Kortes aceita configurações de LLM do Google, OpenAI, Anthropic e modelos locais do Ollama.
            Assim você avalia os provedores com o seu próprio conteúdo e orçamento. A transcrição usa o AssemblyAI por padrão
            e pode trocar para o Whisper local ou, em links do YouTube, para as legendas existentes.
            O <Link href={SELF_HOSTING_GUIDE_HREF}>guia de auto-hospedagem</Link> mostra uma configuração 100% local.
          </p>
          <h3>4. O seu fluxo de cortes pode virar parte das suas ferramentas</h3>
          <p>
            O Kortes inclui uma API REST e um servidor MCP. Os desenvolvedores podem ligar os cortes a outras aplicações
            ou a clientes de IA compatíveis, em vez de tratar o navegador como a única porta de entrada.
            Para uma agência que processa gravações recorrentes de clientes, isso abre espaço para montar um fluxo
            repetível em torno do próprio processo de revisão. A <a href={`${repository}/blob/main/docs/api-reference.md`}>referência da API</a> explica os endpoints disponíveis.
          </p>
          <figure className="rounded-2xl bg-zinc-950 p-6 text-zinc-50 sm:p-8">
            <figcaption className="mb-6 font-semibold">O que você controla quando hospeda por conta própria</figcaption>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-5"><Server className="mb-3 h-6 w-6 text-emerald-300" /><h3>Sua instalação</h3><ul className="mt-3 space-y-2 text-sm text-zinc-300"><li>Aplicação e código-fonte</li><li>Armazenamento e recursos de processamento</li><li>Personalização editorial</li></ul></div>
              <ArrowRight className="mx-auto h-5 w-5 rotate-90 text-zinc-400 sm:rotate-0" aria-hidden="true" />
              <div className="rounded-xl border border-zinc-700 p-5"><Sparkles className="mb-3 h-6 w-6 text-zinc-300" /><h3>Serviços de IA conectados</h3><ul className="mt-3 space-y-2 text-sm text-zinc-300"><li>AssemblyAI ou Whisper local</li><li>LLM hospedado ou Ollama local</li><li>Custos dos provedores e fluxo de dados</li></ul></div>
            </div>
            <div className="mt-5 text-xs leading-6 text-zinc-400">Os provedores na nuvem são opcionais: com Whisper e Ollama, a transcrição e a seleção de clipes ficam locais.</div>
          </figure>
          <h2 id="cost" className="scroll-mt-8">Custo: código gratuito, custos de operação reais</h2>
          <p>
            O código aberto do Kortes é gratuito para hospedar. Os custos reais dependem de processamento, armazenamento,
            transcrição, uso pago de modelos e do tempo para manter a instalação. A capacidade acompanha
            os recursos que você providencia e os limites dos provedores. Isso pode ser atraente para equipes que já mantêm
            infraestrutura, mas não é uma promessa de que todo uso sai mais barato.
          </p>
          <p>
            A versão hospedada do Kortes é uma opção à parte, com preços e termos próprios. Escolha-a quando quiser
            começar com menos configuração; escolha a auto-hospedagem quando o controle da instalação for a prioridade.
          </p>
          <h2>Qual escolher?</h2>
          <p>
            Escolha o Kortes para uma biblioteca de podcasts, entrevistas, webinars ou VODs de lives que você quer
            reaproveitar com um processo personalizável. Ele reúne descoberta de clipes, pontuação, legendas
            e enquadramento vertical, com a liberdade de inspecionar e ampliar a aplicação.
          </p>
          <p>
            Se a sua exigência essencial é cortar uma transmissão enquanto ela ainda acontece e publicar os resultados
            automaticamente, avalie o fluxo ao vivo anunciado pelo supo.live. O fluxo do Kortes para vídeos gravados
            não deve ser tratado como um substituto comprovado desses recursos.
          </p>
          <h2>Comece um fluxo de cortes que você controla</h2>
          <p>
            O Kortes é a nossa escolha para equipes que querem cortes úteis com IA hoje e espaço para adaptá-los amanhã.
            Comece com uma gravação representativa, revise os clipes sugeridos, ajuste as legendas e o enquadramento
            e exporte os resultados. Depois decida se a praticidade da versão hospedada ou a sua própria instalação combina com o seu fluxo.
          </p>
          <section className="rounded-2xl border bg-muted/30 p-6 sm:p-8" aria-label="Comece com o Kortes">
            <Image src="/logo.png" alt="Logo do Kortes" width={40} height={40} className="mb-4 rounded-lg" />
            <h3>A sua próxima gravação merece uma segunda vida.</h3>
            <ul className="my-5 space-y-2 text-sm">{["Comece com uma gravação que você conhece bem", "Revise os momentos sugeridos mais fortes", "Ajuste as legendas e exporte"].map(text => <li key={text} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" />{text}</li>)}</ul>
            <div className="flex flex-wrap gap-3"><a href={HOSTED_APP_URL} className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-semibold !text-background !no-underline">Experimentar o Kortes<ArrowRight className="h-4 w-4" /></a><a href={repository} className="inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold !no-underline"><Github className="h-4 w-4" />Ver o código-fonte</a></div>
          </section>
          <h2 id="faq" className="scroll-mt-8">Perguntas frequentes</h2>
          {faqs.map(({ question, answer }) => <section key={question} className="space-y-2 rounded-lg border p-5"><h3>{question}</h3><p>{answer}</p></section>)}
          <p>Conheça o nosso <Link href="/open-source-video-clipper">guia do cortador de vídeo de código aberto</Link> ou leia a <Link href={OPUSCLIP_COMPARISON_HREF}>comparação entre Kortes e OpusClip</Link>.</p>
        </div>
        <div className="mx-auto mt-16 max-w-5xl border-t pt-12">
          <RelatedGuides href={`/blog/${post.slug}`} heading="Continue lendo" />
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
