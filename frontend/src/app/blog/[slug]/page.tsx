import { formatArticleDate } from "@/components/articles/article-shell";
import { OpusClipComparisonArticle } from "@/components/articles/opusclip-comparison-article";
import { SelfHostingGuideArticle } from "@/components/articles/self-hosting-guide-article";
import { RelatedGuides } from "@/components/marketing/related-guides";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SupoLiveArticle } from "@/components/supo-live-article";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Captions,
  Clock,
  ExternalLink,
  Github,
  ListChecks,
  Play,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HOSTED_APP_URL, blogPosts, getBlogPost, getBlogPostMetadata, getSiteUrl } from "@/lib/blog-posts";
import { OPUSCLIP_COMPARISON_HREF, SELF_HOSTING_GUIDE_HREF } from "@/lib/marketing-links";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const comparisonRows = [
  {
    icon: ShieldCheck,
    feature: "Modelo de uso gratuito",
    supoclip: "Código aberto e auto-hospedável sem limites de plano. Seus custos são sua própria máquina e chaves de API. O app na nuvem é pago.",
    opusClip: "Plano gratuito disponível, mas as exportações podem conter marca d'água do OpusClip.",
  },
  {
    icon: Sparkles,
    feature: "Descoberta de clipes",
    supoclip: "Transcreve vídeos longos, pontua segmentos e revela os momentos mais promissores para vídeos curtos.",
    opusClip: "Fluxo de cortes com IA criado para encontrar clipes prontos para redes sociais a partir de vídeos longos.",
  },
  {
    icon: ScanFace,
    feature: "Formatação vertical",
    supoclip: "Corte 9:16 centrado no rosto, legendas dinâmicas e exportações otimizadas para plataformas.",
    opusClip: "Oferece exportações em formato vertical e reenquadramento com IA para redes sociais.",
  },
  {
    icon: Github,
    feature: "Controle total",
    supoclip: "Acesso total ao código-fonte, implantação editável e sem aprisionamento tecnológico (lock-in).",
    opusClip: "Produto hospedado com fluxos fechados e camadas de assinatura por créditos.",
  },
];

const faqs = [
  {
    icon: Sparkles,
    question: "Qual é a melhor alternativa gratuita ao OpusClip?",
    answer:
      "O Kortes é uma forte alternativa gratuita ao OpusClip se você quer um criador de clipes com IA de código aberto que você pode auto-hospedar, personalizar e executar no seu próprio fluxo.",
  },
  {
    icon: ShieldCheck,
    question: "O Kortes é totalmente gratuito?",
    answer:
      "O código-fonte do Kortes é 100% gratuito e de código aberto, e instâncias auto-hospedadas não têm limites de plano. Você paga apenas pela sua própria infraestrutura e pelos provedores de transcrição ou LLM que configurar. A versão hospedada na nuvem requer assinatura paga.",
  },
  {
    icon: Captions,
    question: "O Kortes adiciona marca d'água?",
    answer:
      "Não. O pipeline de renderização do Kortes não inclui nenhuma marca d'água, tanto no aplicativo na nuvem quanto em instalações auto-hospedadas.",
  },
];

const articleBodyClassName =
  "space-y-6 text-base leading-8 text-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:first:mt-0 [&_li]:mt-2 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:text-muted-foreground";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return getBlogPostMetadata(post);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  if (slug === "supoclip-vs-supo-live") {
    return <SupoLiveArticle post={post} />;
  }
  if (slug === "supoclip-vs-opusclip") {
    return <OpusClipComparisonArticle post={post} />;
  }
  if (slug === "self-host-supoclip-docker") {
    return <SelfHostingGuideArticle post={post} />;
  }

  const siteUrl = getSiteUrl();
  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Kortes",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: articleUrl,
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="border-b bg-background/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Kortes" width={24} height={24} className="rounded-lg" />
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: "var(--font-syne), var(--font-geist-sans), system-ui" }}
            >
              Kortes
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/blog">
              <Button variant="ghost" size="sm">
                Blog
              </Button>
            </Link>
            <a href={HOSTED_APP_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Abrir App
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
            <Link href="/sign-up">
              <Button size="sm">Começar a Criar Clipes</Button>
            </Link>
          </div>
        </div>
      </header>

      <article>
        <section className="border-b bg-muted/35">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1fr_0.42fr] md:py-20">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  {post.eyebrow}
                </Badge>
                <a href={HOSTED_APP_URL} target="_blank" rel="noopener noreferrer">
                  <Badge variant="outline" className="gap-2">
                    <Play className="h-3.5 w-3.5" />
                    Testar Kortes na nuvem
                  </Badge>
                </a>
              </div>
              <h1
                className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-syne), var(--font-geist-sans), system-ui" }}
              >
                {post.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Se você gosta da ideia do OpusClip mas quer uma alternativa gratuita e de código aberto, o Kortes
                oferece o fluxo essencial: encontre os melhores momentos em vídeos longos, reenquadre verticalmente,
                adicione legendas e exporte clipes para Shorts, Reels e TikTok.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span>{post.author}</span>
                <span>Atualizado em <time dateTime={post.updatedAt}>{formatArticleDate(post.updatedAt)}</time></span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime}
                </span>
              </div>
            </div>

            <aside className="rounded-lg border bg-background p-5 md:self-end">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Ideal para
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  { icon: Play, label: "Criadores cortando vídeos do YouTube em shorts" },
                  { icon: ShieldCheck, label: "Equipes que preferem auto-hospedagem" },
                  { icon: Github, label: "Desenvolvedores que buscam controle total do código" },
                ].map(({ icon: Icon, label }) => (
                  <li key={label} className="flex gap-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
              <a href={HOSTED_APP_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex text-sm font-semibold">
                Abrir versão na nuvem
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </aside>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:py-16">
          <div className="min-w-0">
            <div className={articleBodyClassName}>
              <p>
                O OpusClip ajudou a popularizar a categoria moderna de clipes com IA: envie um vídeo longo,
                deixe a IA identificar os momentos e publique vídeos curtos rapidamente. Esse fluxo é extremamente
                útil. A fricção surge quando você busca uma rota gratuita, maior controle ou um pipeline que
                possa executar por conta própria.
              </p>

              <p>
                O Kortes é a melhor alternativa gratuita ao OpusClip para esse criador: alguém que busca
                descoberta de clipes com IA, exportações verticais, legendas dinâmicas e controle sobre o
                sistema subjacente. Você também pode{" "}
                <a href={HOSTED_APP_URL} target="_blank" rel="noopener noreferrer">
                  usar o Kortes hospedado na nuvem
                </a>{" "}
                em um plano pago se preferir pular qualquer configuração técnica.
              </p>

              <h2 id="quick-verdict">Veredito Rápido</h2>
              <p>
                Escolha o Kortes se você quer um criador de clipes com IA de código aberto que você pode auto-hospedar.
                Escolha o OpusClip se você prefere um serviço totalmente gerenciado e não se importa com limites de plano,
                marcas d&apos;água e modelo por créditos.
              </p>

              <div className="not-prose my-8 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: ShieldCheck, label: "Custo", value: "Código-fonte grátis" },
                  { icon: Wand2, label: "Fluxo", value: "Vídeo longo em shorts" },
                  { icon: Github, label: "Controle", value: "Auto-hospedável" },
                ].map(({ icon: Icon, ...stat }) => (
                  <div key={stat.label} className="rounded-lg border bg-muted/35 p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      <Icon className="h-4 w-4" />
                      {stat.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>

              <h2>Por que criadores buscam alternativas ao OpusClip</h2>
              <p>
                Os motivos comuns são diretos: criadores querem custos menores, exportações limpas sem marca d&apos;água
                em planos gratuitos, mais controle sobre o processamento e menos limitações ao processar lotes de vídeos
                antigos do YouTube, podcasts ou transmissões ao vivo.
              </p>

              <p>
                A própria documentação do OpusClip indica que exportações no plano gratuito podem incluir a marca d&apos;água
                do produto, e seus planos utilizam créditos por minuto processado. Para testes esporádicos isso pode funcionar,
                mas para criadores recorrentes isso eleva o custo.
              </p>

              <h2>O que torna o Kortes diferente</h2>
              <p>
                O Kortes não é apenas uma casca sobre um editor na nuvem. É uma aplicação completa de código aberto com
                backend FastAPI, frontend Next.js, workers assíncronos, transcrição, pontuação por IA, reenquadramento
                vertical inteligente com foco no rosto, estilização de legendas e predefinições de exportação.
              </p>

              <p>
                A escolha fica clara: você assume a infraestrutura, mas ganha a posse total. Você pode inspecionar o código,
                adaptá-lo ao seu fluxo e escolher se utiliza provedores de IA na nuvem ou modelos 100% locais. O{" "}
                <Link href={SELF_HOSTING_GUIDE_HREF}>guia de auto-hospedagem</Link> explica todo o passo a passo, incluindo
                a opção totalmente local com Whisper + Ollama.
              </p>

              <h2 id="supoclip-vs-opusclip">Kortes vs OpusClip</h2>
              <p>
                O resumo abaixo cobre os pontos essenciais. Para um comparativo linha por linha com referências para cada
                afirmação, leia <Link href={OPUSCLIP_COMPARISON_HREF}>Kortes vs OpusClip: uma comparação detalhada</Link>.
              </p>
            </div>

            <div className="my-8 overflow-hidden rounded-lg border">
              <div className="grid grid-cols-[0.85fr_1fr_1fr] bg-muted/50 text-sm font-semibold">
                <div className="p-4">Recurso</div>
                <div className="border-l p-4">Kortes</div>
                <div className="border-l p-4">OpusClip</div>
              </div>
              {comparisonRows.map(({ icon: Icon, ...row }) => (
                <div key={row.feature} className="grid grid-cols-[0.85fr_1fr_1fr] border-t text-sm">
                  <div className="flex items-start gap-2 p-4 font-medium">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    {row.feature}
                  </div>
                  <div className="border-l p-4 leading-6 text-muted-foreground">{row.supoclip}</div>
                  <div className="border-l p-4 leading-6 text-muted-foreground">{row.opusClip}</div>
                </div>
              ))}
            </div>

            <div className={articleBodyClassName}>
              <h2>Como o Kortes funciona</h2>
              <ol>
                <li>Cole uma URL do YouTube ou envie um arquivo de vídeo.</li>
                <li>O Kortes transcreve o áudio e encontra os momentos candidatos.</li>
                <li>A IA avalia os clipes quanto à força do gancho, engajamento, valor e potencial de compartilhamento.</li>
                <li>O estúdio cria clipes verticais, com legendas sincronizadas e reenquadramento facial.</li>
                <li>Você exporta os vídeos prontos para YouTube Shorts, TikTok, Instagram Reels e outras redes.</li>
              </ol>

              <h2>Quando o Kortes é a melhor escolha</h2>
              <p>
                O Kortes é ideal quando você quer uma alternativa gratuita ao OpusClip com controle total de código.
                É especialmente vantajoso para criadores com um acervo extenso de vídeos longos, agências que desejam
                personalizar fluxos de corte ou equipes técnicas que querem incorporar IA de vídeo dentro da sua própria infraestrutura.
              </p>

              <h2>Quando o OpusClip ainda pode ser preferível</h2>
              <p>
                O OpusClip ainda pode ser uma boa opção se você busca a conveniência de um serviço pronto e polido, sem
                precisar se preocupar com infraestrutura, servidores, chaves de API ou filas de processamento.
              </p>
            </div>

            <section className="my-10 rounded-lg border bg-foreground p-6 text-background md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-background/70">
                    <ListChecks className="h-4 w-4" />
                    Gratuito se auto-hospedar, planos na nuvem se preferir praticidade
                  </p>
                  <h2
                    className="mt-2 text-2xl font-bold tracking-tight"
                    style={{ fontFamily: "var(--font-syne), var(--font-geist-sans), system-ui" }}
                  >
                    Comece a criar clipes com o Kortes.
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href={SELF_HOSTING_GUIDE_HREF}>
                    <Button variant="secondary">Guia de auto-hospedagem</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="secondary">
                      Abrir aplicativo
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <a href="https://github.com/FujiwaraChoki/supoclip" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground">
                      <Github className="h-4 w-4" />
                      GitHub
                    </Button>
                  </a>
                </div>
              </div>
            </section>

            <div className={articleBodyClassName}>
              <h2 id="faq">Perguntas Frequentes</h2>
            </div>

            <div className="mt-6 space-y-4">
              {faqs.map(({ icon: Icon, ...faq }) => (
                <section key={faq.question} className="rounded-lg border p-5">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                </section>
              ))}
            </div>

            <Separator className="my-10" />

            <RelatedGuides href={`/blog/${post.slug}`} heading="Guias relacionados do Kortes" />

            <Separator className="my-10" />

            <section className="text-sm leading-7 text-muted-foreground">
              <h2 className="text-base font-semibold text-foreground">Fontes e referências</h2>
              <p className="mt-2">
                As informações sobre planos e marcas d&apos;água do OpusClip têm como base a central de ajuda oficial:{" "}
                <a href="https://help.opus.pro/docs/article/plans-and-credits" className="font-medium text-foreground underline underline-offset-4">
                  planos e créditos
                </a>{" "}
                e{" "}
                <a href="https://help.opus.pro/docs/article/watermark" className="font-medium text-foreground underline underline-offset-4">
                  diretrizes de marca d&apos;água
                </a>.
              </p>
            </section>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-8 space-y-4">
              <div className="rounded-lg border p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Neste artigo
                </p>
                <div className="mt-4 space-y-3 text-sm">
                  <a href="#quick-verdict" className="block text-muted-foreground hover:text-foreground">
                    Veredito rápido
                  </a>
                  <a href="#supoclip-vs-opusclip" className="block text-muted-foreground hover:text-foreground">
                    Comparativo
                  </a>
                  <a href="#faq" className="block text-muted-foreground hover:text-foreground">
                    Perguntas frequentes
                  </a>
                </div>
              </div>
              <div className="rounded-lg border bg-muted/35 p-5">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <p className="mt-3 text-sm font-semibold">Controle em código aberto</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Use o Kortes quando você quer o fluxo de cortes sem transferir cada decisão para uma plataforma proprietária fechada.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
