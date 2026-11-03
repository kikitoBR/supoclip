import type { Metadata } from "next";

import { HomeRouter } from "@/components/home-router";
import { getPublicBillingPlans } from "@/lib/billing-plans";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    absolute: "Kortes – Cortes de vídeo com IA para Shorts e Reels",
  },
  description:
    "Transforme vídeos longos em YouTube Shorts, TikToks e Reels legendados com IA, pontuação de viralidade e cortes 9:16 que acompanham o rosto.",
  alternates: {
    canonical: siteUrl,
  },
  keywords: [
    "cortes de vídeo com IA",
    "cortador de vídeo com IA",
    "criar YouTube Shorts",
    "vídeo longo para shorts",
    "gerador de clipes com IA",
  ],
  openGraph: {
    title: "Kortes – Cortes de vídeo com IA para Shorts e Reels",
    description:
      "Transforme vídeos longos em YouTube Shorts, TikToks e Reels legendados com IA.",
    url: siteUrl,
    siteName: "Kortes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kortes – Cortes de vídeo com IA para Shorts e Reels",
    description:
      "Cortes com IA, pontuação de viralidade, legendas e enquadramento vertical que acompanha o rosto.",
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kortes",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Kortes",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web, iOS",
    url: siteUrl,
    description:
      "Cortador de vídeo com IA que encontra os melhores momentos, cria cortes verticais, adiciona legendas sincronizadas palavra a palavra e exporta vídeos curtos.",
    featureList: [
      "Descoberta de momentos com IA e pontuação de viralidade",
      "Corte vertical 9:16 que acompanha o rosto",
      "Legendas animadas sincronizadas palavra a palavra",
      "Exportação para YouTube Shorts, TikTok e Instagram Reels",
      "Processamento na nuvem, sem instalar nada",
    ],
    offers: {
      "@type": "Offer",
      price: getPublicBillingPlans()[0].priceMonthly,
      priceCurrency: "USD",
      category: "Assinatura mensal",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kortes",
    url: siteUrl,
    description: "Cortes de vídeo com IA para conteúdo curto.",
  },
];

export default function HomePage() {
  return (
    <>
      {structuredData.map((entry) => (
        <script
          key={entry["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
      <HomeRouter />
    </>
  );
}
