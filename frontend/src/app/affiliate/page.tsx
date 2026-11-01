import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift, Link2, Percent, Search, Send } from "lucide-react";

import { SiteFooter } from "@/components/marketing/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicBillingPlans } from "@/lib/billing-plans";
import { getSiteUrl } from "@/lib/site";

const APPLY_HREF = "/settings/creator-program";
const VIDEO = {
  src: "/videos/creator-program.mp4",
  poster: "/videos/creator-program-poster.jpg",
  durationSeconds: 27,
  uploadDate: "2026-10-09",
};

const title = "Programa de Criadores SupoClip: Ganhe o Pro Grátis ao Criar Vídeos";
const description =
  "Crie Shorts, Reels, TikToks ou vídeos sobre o SupoClip e ganhe o SupoClip Pro de graça. Seu público ganha 20% de desconto nos primeiros 3 meses com seu código.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${getSiteUrl()}/affiliate` },
  openGraph: {
    title,
    description,
    url: `${getSiteUrl()}/affiliate`,
    siteName: "SupoClip",
    type: "website",
    images: [{ url: `${getSiteUrl()}${VIDEO.poster}`, width: 1920, height: 1080 }],
    videos: [{ url: `${getSiteUrl()}${VIDEO.src}`, width: 1920, height: 1080, type: "video/mp4" }],
  },
  twitter: { card: "summary_large_image", title, description },
};

const steps = [
  { icon: Send, title: "Inscreva-se", detail: "Conte onde você posta seus vídeos e escolha seu código, como MAYA. Leva dois minutos." },
  { icon: Search, title: "Nós avaliamos", detail: "Cada inscrição é avaliada manualmente. Você receberá um e-mail com o retorno." },
  { icon: Link2, title: "Compartilhe", detail: "Coloque seu link na bio ou mencione seu código nos vídeos. Sua conta ganha o Pro imediatamente." },
];

const rules = [
  "Identifique conteúdos patrocinados de forma clara, por exemplo com #publi ou #ad.",
  "Não anuncie usando a marca SupoClip em links patrocinados nem poste seu código em sites de cupons ou promoções.",
  "Não use o seu próprio código na sua conta.",
  "Podemos encerrar o programa ou desligar um criador participante a qualquer momento.",
];

function getFaqs(proPrice: string) {
  return [
    {
      question: "Eu recebo pagamentos em dinheiro?",
      answer: `No momento não. Criadores aprovados recebem o SupoClip Pro (normalmente $${proPrice}/mês) de graça enquanto estiverem no programa.`,
    },
    {
      question: "Há um número mínimo de seguidores?",
      answer: "Não. Avaliamos a qualidade do que você publica, não apenas a contagem de inscritos. Criadores em crescimento que já produzem conteúdo sobre o SupoClip são muito bem-vindos.",
    },
    {
      question: "O que o meu público ganha?",
      answer: "Qualquer pessoa que se cadastrar pelo seu link ou inserir seu código no checkout recebe 20% de desconto nos primeiros 3 meses. Na web vale para qualquer plano. No iPhone vale para o Pro: o usuário toca em “Tem um código de criador?” no app ou abre seu link especial.",
    },
    {
      question: "Posso escolher meu próprio código?",
      answer: "Sim. Os códigos têm de 3 a 20 caracteres (letras, números ou hífens) e cada código pertence exclusivamente a um criador. O formulário informa na hora se o código está livre.",
    },
    {
      question: "O que acontece se minha inscrição não for aprovada?",
      answer: "Você receberá um e-mail com os motivos apontados pela nossa equipe. Você poderá se inscrever novamente após 30 dias.",
    },
    {
      question: "Preciso ter uma conta no SupoClip?",
      answer: "Sim. O programa é vinculado à sua conta, então basta criar uma conta gratuita (ou entrar na sua) antes de enviar a inscrição.",
    },
  ];
}

export default function AffiliatePage() {
  const siteUrl = getSiteUrl();
  const pro = getPublicBillingPlans().find((plan) => plan.id === "pro");
  const proPrice = pro?.priceMonthly ?? "10";
  const faqs = getFaqs(proPrice);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "SupoClip", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Programa de criadores", item: `${siteUrl}/affiliate` },
        ],
      },
      {
        "@type": "VideoObject",
        name: "Como funciona o programa de criadores SupoClip",
        description: "Inscreva-se, escolha seu código e seu público ganha 20% de desconto nos primeiros 3 meses. Criadores aprovados ganham o SupoClip Pro de graça.",
        thumbnailUrl: `${siteUrl}${VIDEO.poster}`,
        contentUrl: `${siteUrl}${VIDEO.src}`,
        uploadDate: VIDEO.uploadDate,
        duration: `PT${VIDEO.durationSeconds}S`,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <header className="border-b bg-background/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="SupoClip" width={24} height={24} className="rounded-lg" />
            <span className="text-lg font-bold tracking-tight">SupoClip</span>
          </Link>
          <nav className="flex items-center gap-2" aria-label="Navegação principal">
            <Link href="/demo"><Button variant="ghost" size="sm">Demonstração</Button></Link>
            <Link href={APPLY_HREF}><Button size="sm">Inscrever-se</Button></Link>
          </nav>
        </div>
      </header>

      <section className="border-b bg-muted/35">
        <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
          <Badge variant="secondary">Programa de criadores</Badge>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ fontFamily: "var(--font-syne), var(--font-geist-sans), system-ui" }}>
            Crie vídeos sobre o SupoClip. Ganhe o Pro de graça.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Posta Shorts, Reels ou TikToks sobre cortes de vídeo, podcasts ou criação de conteúdo? Tenha seu próprio código.
            Seu público economiza no SupoClip e você ganha o plano Pro enquanto estiver no programa.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={APPLY_HREF}><Button size="lg">Inscreva-se agora <ArrowRight className="h-4 w-4" /></Button></Link>
            <span className="text-sm text-muted-foreground">Sem mínimo de seguidores.</span>
          </div>
          <video
            src={VIDEO.src}
            poster={VIDEO.poster}
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            width={1920}
            height={1080}
            className="mt-12 aspect-video w-full rounded-2xl border bg-muted shadow-lg"
            aria-label="Explicação do programa de criadores: inscreva-se, escolha seu código e seu público ganha 20% de desconto nos primeiros 3 meses"
          />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <section aria-labelledby="offer-heading">
          <h2 id="offer-heading" className="text-3xl font-bold tracking-tight">O que todo mundo ganha</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border p-6">
              <Gift className="h-5 w-5" />
              <h3 className="mt-4 text-lg font-semibold">Você ganha o SupoClip Pro, grátis</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                O Pro custa normalmente ${proPrice}/mês{pro ? ` e inclui ${pro.generationLimit} vídeos por mês` : ""}. Criadores
                aprovados têm acesso gratuito enquanto estiverem participando do programa.
              </p>
            </div>
            <div className="rounded-2xl border p-6">
              <Percent className="h-5 w-5" />
              <h3 className="mt-4 text-lg font-semibold">Seu público ganha 20% de desconto</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Válido para os primeiros 3 meses em qualquer plano. Funciona pelo seu link especial ou inserindo seu código no checkout.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16" aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-3xl font-bold tracking-tight">Como funciona</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title: stepTitle, detail }, index) => (
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
        </section>

        <section className="mt-16" aria-labelledby="rules-heading">
          <h2 id="rules-heading" className="text-3xl font-bold tracking-tight">Regras do programa</h2>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-base leading-7 text-muted-foreground">
            {rules.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-3xl font-bold tracking-tight">Dúvidas frequentes</h2>
          <dl className="mt-8 divide-y rounded-2xl border">
            {faqs.map((faq) => (
              <div key={faq.question} className="p-5">
                <dt className="font-semibold">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-16 rounded-2xl border bg-foreground p-6 text-background md:p-8">
          <h2 className="text-2xl font-bold tracking-tight">Já publica conteúdos sobre o SupoClip?</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-background/70">
            Inscreva-se informando o link do seu perfil e o código desejado. Se você já gravou vídeos sobre o SupoClip, não se esqueça de incluí-los!
          </p>
          <div className="mt-6">
            <Link href={APPLY_HREF}><Button variant="secondary">Inscreva-se agora <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
