import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, ExternalLink, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HOSTED_APP_URL, blogPosts, getSiteUrl } from "@/lib/blog-posts";
import { getMarketingLinks } from "@/lib/marketing-links";

export const metadata: Metadata = {
  title: { absolute: "Blog do SupoClip | Guias de Cortes de Vídeo com IA" },
  description:
    "Guias práticos, comparações de ferramentas e fluxos de trabalho para criadores transformarem vídeos longos em shorts prontos para postar com o SupoClip.",
  alternates: {
    canonical: `${getSiteUrl()}/blog`,
  },
  openGraph: {
    title: "Blog do SupoClip",
    description:
      "Guias e comparativos para criação de clipes com IA, legendas automáticas, reenquadramento vertical e fluxos de vídeos curtos.",
    type: "website",
    url: `${getSiteUrl()}/blog`,
    siteName: "SupoClip",
  },
};

export default function BlogIndexPage() {
  const featuredPost = blogPosts[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="SupoClip" width={24} height={24} className="rounded-lg" />
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: "var(--font-syne), var(--font-geist-sans), system-ui" }}
            >
              SupoClip
            </span>
          </Link>
          <div className="flex items-center gap-2">
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

      <section className="border-b bg-muted/35">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-5 flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Guias para Criadores
            </Badge>
            <a href={HOSTED_APP_URL} target="_blank" rel="noopener noreferrer">
              <Badge variant="outline" className="gap-2">
                <ExternalLink className="h-3.5 w-3.5" />
                Testar SupoClip na nuvem
              </Badge>
            </a>
          </div>
          <div className="max-w-3xl">
            <h1
              className="text-4xl font-extrabold tracking-tight sm:text-5xl"
              style={{ fontFamily: "var(--font-syne), var(--font-geist-sans), system-ui" }}
            >
              Guias práticos para transformar vídeos longos em shorts melhores.
            </h1>
            <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
              Comparativos, fluxos de trabalho e dicas de edição para criadores que desejam um processo
              consistente, legendas limpas e maior controle da sua produção.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="group grid gap-8 rounded-lg border bg-card p-6 transition-colors hover:border-foreground/30 md:grid-cols-[1fr_0.55fr] md:p-8"
        >
          <article>
            <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="outline">{featuredPost.category}</Badge>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {featuredPost.readingTime}
              </span>
            </div>
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ fontFamily: "var(--font-syne), var(--font-geist-sans), system-ui" }}
            >
              {featuredPost.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              {featuredPost.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold">
                Ler artigo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Github className="h-4 w-4" />
                Código aberto
              </span>
            </div>
          </article>

          {featuredPost.image ? (
            <Image
              src={featuredPost.image.src}
              alt={featuredPost.image.alt}
              width={featuredPost.image.width}
              height={featuredPost.image.height}
              sizes="(max-width: 768px) 100vw, 420px"
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <div className="rounded-lg border bg-muted/45 p-5">
              <p className="font-semibold">Criação de clipes em código aberto</p>
            </div>
          )}
        </Link>

        {blogPosts.length > 1 && (
          <section className="mt-12" aria-labelledby="more-articles">
            <h2 id="more-articles" className="text-2xl font-bold">Mais guias de clipes</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {blogPosts.slice(1).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="rounded-xl border p-6 hover:border-foreground/30"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{post.category}</p>
                  <h3 className="mt-3 text-xl font-bold">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{post.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                    Ler artigo<ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14" aria-labelledby="product-guides-heading">
          <h2 id="product-guides-heading" className="text-2xl font-bold tracking-tight">
            Guias do produto
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...getMarketingLinks("product"), ...getMarketingLinks("guide").filter((link) => !link.href.startsWith("/blog/"))].map(({ href, label, description }) => (
              <Link key={href} href={href} className="rounded-lg border p-5 transition-colors hover:border-foreground/30">
                <h3 className="font-semibold">{label}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </Link>
            ))}
          </div>
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}
