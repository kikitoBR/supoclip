import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Captions, ExternalLink, Info, ScanFace, Sparkles, Type, Youtube } from "lucide-react";

import { RelatedGuides } from "@/components/marketing/related-guides";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_CLIPS, DEMO_PUBLISHED_AT, DEMO_SOURCE, getDemoSourceMomentUrl } from "@/lib/demo";
import { getSiteUrl } from "@/lib/site";

const title = "Demonstração do Kortes: Clipes Reais com IA a Partir de um Vídeo Longo";
const description =
  "Assista aos clipes verticais e legendados que o Kortes gerou de um podcast longo, com carimbos originais, títulos de gancho e a explicação de cada etapa do processo.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${getSiteUrl()}/demo` },
  openGraph: {
    title,
    description,
    url: `${getSiteUrl()}/demo`,
    siteName: "Kortes",
    type: "website",
    videos: DEMO_CLIPS.map((clip) => ({ url: `${getSiteUrl()}${clip.src}`, width: 540, height: 960, type: "video/mp4" })),
  },
  twitter: { card: "summary_large_image", title, description },
};

const pipeline = [
  { icon: Type, title: "Transcrever", detail: "O áudio de origem é transcrito com carimbos de data/hora no nível de palavras." },
  { icon: Sparkles, title: "Selecionar momentos", detail: "Um LLM analisa a transcrição em janelas sobrepostas, propõe segmentos independentes e classifica cada um com base em gancho, engajamento, valor e compartilhamento." },
  { icon: Captions, title: "Criar um gancho", detail: "Cada clipe recebe um título curto de gancho visual, fixado no topo do vídeo nos primeiros segundos." },
  { icon: ScanFace, title: "Reenquadrar para 9:16", detail: "Cada plano é analisado. Momentos com pessoas falando recebem um corte dinâmico focado no rosto do orador. Telas, slides e gráficos mantêm o enquadramento original sobre fundo desfocado. As transições respeitam os cortes de cena do vídeo original." },
];

export default function DemoPage() {
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Kortes", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Demo", item: `${siteUrl}/demo` },
        ],
      },
      ...DEMO_CLIPS.map((clip) => ({
        "@type": "VideoObject",
        name: clip.hook,
        description: `Clipe vertical gerado pelo Kortes a partir de "${DEMO_SOURCE.title}" (${clip.range}). Prévia na web de um clipe de ${clip.duration}.`,
        thumbnailUrl: `${siteUrl}${clip.poster}`,
        contentUrl: `${siteUrl}${clip.src}`,
        uploadDate: DEMO_PUBLISHED_AT,
        duration: `PT${clip.previewSeconds}S`,
        isBasedOn: DEMO_SOURCE.url,
      })),
    ],
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <header className="border-b bg-background/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Kortes" width={24} height={24} className="rounded-lg" />
            <span className="text-lg font-bold tracking-tight">Kortes</span>
          </Link>
          <nav className="flex items-center gap-2" aria-label="Navegação principal">
            <Link href="/blog"><Button variant="ghost" size="sm">Blog</Button></Link>
            <Link href="/sign-up"><Button size="sm">Começar a criar clipes</Button></Link>
          </nav>
        </div>
      </header>

      <section className="border-b bg-muted/35">
        <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
          <Badge variant="secondary">Demonstração</Badge>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ fontFamily: "var(--font-syne), var(--font-geist-sans), system-ui" }}>
            Um episódio longo entra, clipes verticais prontos para postar saem
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Estes clipes foram gerados pelo Kortes a partir de um vídeo longo público. Assista aos resultados e depois
            pule para o momento exato no original para ver o que a IA escolheu e como o corte foi reenquadrado.
          </p>
          <a href={DEMO_SOURCE.url} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-3 rounded-lg border bg-background p-3 pr-4 text-sm transition-colors hover:border-foreground/30">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-red-500/10"><Youtube className="h-4 w-4 text-red-500" /></span>
            <span>
              <span className="block font-medium">{DEMO_SOURCE.title}</span>
              <span className="block text-xs text-muted-foreground">Vídeo original no YouTube</span>
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <section aria-labelledby="clips-heading">
          <h2 id="clips-heading" className="text-3xl font-bold tracking-tight">Os clipes</h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {DEMO_CLIPS.map((clip) => (
              <article key={clip.id} id={clip.id} className="scroll-mt-8">
                <video
                  src={clip.src}
                  poster={clip.poster}
                  controls
                  playsInline
                  preload="none"
                  width={540}
                  height={960}
                  className="mx-auto aspect-[9/16] w-full max-w-[300px] rounded-xl bg-black shadow-lg ring-1 ring-border"
                  aria-label={`Clipe Kortes: ${clip.hook}`}
                />
                <h3 className="mt-5 text-center text-lg font-semibold">{clip.hook}</h3>
                <p className="mt-1 text-center text-sm tabular-nums text-muted-foreground">
                  Origem {clip.range} · clipe completo {clip.duration}
                </p>
                <p className="mt-3 text-center text-sm">
                  <a href={getDemoSourceMomentUrl(clip)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium underline underline-offset-4">
                    Assistir a este momento no original <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </p>
              </article>
            ))}
          </div>
          <aside className="mt-10 flex gap-3 rounded-lg border bg-muted/40 p-5 text-sm leading-7 text-muted-foreground">
            <Info className="mt-1 h-4 w-4 shrink-0" />
            <p>
              <strong className="text-foreground">Sobre estas prévias.</strong> Para manter esta página rápida, os arquivos acima
              foram encurtados ({DEMO_CLIPS.map((clip) => `${clip.previewSeconds}s`).join(" e ")}) e redimensionados para 540×960. O Kortes
              renderiza clipes completos em 1080×1920. Não exibimos métricas de viralidade ou benchmarks de velocidade aqui porque uma única demonstração
              não representa todos os casos. O teste ideal é utilizar suas próprias gravações.
            </p>
          </aside>
        </section>

        <section className="mt-16" aria-labelledby="pipeline-heading">
          <h2 id="pipeline-heading" className="text-3xl font-bold tracking-tight">O que o Kortes fez</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {pipeline.map(({ icon: Icon, title: stepTitle, detail }, index) => (
              <li key={stepTitle} className="rounded-lg border p-5">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5" />
                  <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="mt-4 font-semibold">{stepTitle}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm leading-7 text-muted-foreground">
            As legendas são sincronizadas palavra por palavra, com destaque visual na palavra ativa. O
            <Link href="/ai-video-clipper" className="font-medium text-foreground underline underline-offset-4">guia do criador de clipes com IA</Link> explica cada fase detalhadamente.
          </p>
        </section>

        <section className="mt-16 rounded-2xl border bg-foreground p-6 text-background md:p-8">
          <h2 className="text-2xl font-bold tracking-tight">Experimente com seu próprio vídeo</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-background/70">
            Cole um link do YouTube ou envie um arquivo. Revise os clipes sugeridos, personalize as legendas e exporte para Shorts, Reels ou TikTok.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/sign-up"><Button variant="secondary">Começar a criar clipes <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </section>

        <div className="mt-16 border-t pt-12">
          <RelatedGuides href="/demo" />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
