import type { Metadata } from "next";

import { HomeRouter } from "@/components/home-router";
import { GITHUB_URL, getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    absolute: "Kortes – Cortes de vídeo com IA para Shorts e Reels",
  },
  description:
    "Transforme vídeos longos em YouTube Shorts, TikToks e Reels legendados com IA de código aberto, pontuação de viralidade e cortes 9:16 que acompanham o rosto.",
  alternates: {
    canonical: siteUrl,
  },
  keywords: [
    "cortes de vídeo com IA",
    "cortador de vídeo de código aberto",
    "criar YouTube Shorts",
    "vídeo longo para shorts",
    "gerador de clipes com IA",
  ],
  openGraph: {
    title: "Kortes – Cortes de vídeo com IA para Shorts e Reels",
    description:
      "Transforme vídeos longos em YouTube Shorts, TikToks e Reels legendados com IA de código aberto.",
    url: siteUrl,
    siteName: "Kortes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kortes – Cortes de vídeo com IA para Shorts e Reels",
    description:
      "Cortes com IA de código aberto, pontuação de viralidade, legendas e enquadramento vertical que acompanha o rosto.",
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kortes",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [GITHUB_URL],
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Kortes",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web, Docker",
    url: siteUrl,
    description:
      "Cortador de vídeo com IA de código aberto que encontra os melhores momentos, cria cortes verticais, adiciona legendas sincronizadas palavra a palavra e exporta vídeos curtos.",
    featureList: [
      "Descoberta de momentos com IA e pontuação de viralidade",
      "Corte vertical 9:16 que acompanha o rosto",
      "Legendas animadas sincronizadas palavra a palavra",
      "Exportação para YouTube Shorts, TikTok e Instagram Reels",
      "Hospedagem própria com código aberto",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      category: "Edição auto-hospedada de código aberto",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kortes",
    url: siteUrl,
    description: "Cortes de vídeo com IA de código aberto para conteúdo curto.",
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
