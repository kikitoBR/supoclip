import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

export { HOSTED_APP_URL, getSiteUrl } from "@/lib/site";

export interface BlogPost {
  slug: string;
  image?: { src: string; alt: string; width: number; height: number };
  title: string;
  description: string;
  eyebrow: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  author: string;
  keywords: string[];
  summary: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "supoclip-vs-supo-live",
    image: { src: "/blog/supoclip-open-source-clipping.webp", alt: "Ilustração de uma gravação de podcast virando três clipes de vídeo verticais", width: 1672, height: 941 },
    title: "Kortes vs supo.live: por que o código aberto vence",
    description:
      "Compare o Kortes e o supo.live para cortes de vídeo com IA. Veja por que o Kortes vence em controle do código, auto-hospedagem e fluxos personalizáveis.",
    eyebrow: "Alternativa ao supo.live",
    category: "Comparação",
    publishedAt: "2026-09-21",
    updatedAt: "2026-10-05",
    readingTime: "5 min de leitura",
    author: "Kortes",
    keywords: ["Kortes vs supo.live", "alternativa ao supo.live", "cortador de vídeo de código aberto", "cortes de vídeo com IA auto-hospedados", "gerador de clipes com IA"],
    summary:
      "Para criadores e equipes que querem controlar o próprio fluxo de cortes, o Kortes é a melhor alternativa de código aberto ao supo.live.",
  },
  {
    slug: "supoclip-vs-opusclip",
    title: "Kortes vs OpusClip: uma comparação com fontes",
    description:
      "Kortes e OpusClip comparados em instalação, modelo de preço, marca d'água, escolha de modelo e fluxo de trabalho, com uma fonte para cada afirmação.",
    eyebrow: "Comparação com o OpusClip",
    category: "Comparação",
    publishedAt: "2026-10-05",
    updatedAt: "2026-10-05",
    readingTime: "7 min de leitura",
    author: "Kortes",
    keywords: [
      "Kortes vs OpusClip",
      "alternativa ao OpusClip",
      "OpusClip vs código aberto",
      "alternativa ao OpusClip auto-hospedada",
      "marca d'água do OpusClip",
    ],
    summary:
      "Um lado a lado do que cada produto documenta, onde os dois diferem e qual combina com o seu fluxo.",
  },
  {
    slug: "self-host-supoclip-docker",
    title: "Como hospedar o Kortes com Docker Compose",
    description:
      "Hospede o Kortes, o cortador de vídeo com IA de código aberto: requisitos, configuração do .env, uma opção 100% local com Whisper + Ollama, verificações da primeira execução e um checklist de produção.",
    eyebrow: "Guia de auto-hospedagem",
    category: "Guia",
    publishedAt: "2026-10-05",
    updatedAt: "2026-10-05",
    readingTime: "9 min de leitura",
    author: "Kortes",
    keywords: [
      "hospedar o Kortes",
      "cortador de vídeo com IA auto-hospedado",
      "cortador de vídeo de código aberto com Docker",
      "alternativa ao OpusClip auto-hospedada",
      "cortes de vídeo com Whisper e Ollama",
    ],
    summary:
      "Um passo a passo prático do Docker Compose do repositório: o que cada serviço faz, quais chaves você precisa, como rodar sem IA na nuvem e o que reforçar antes de ir para produção.",
  },
  {
    slug: "best-free-opusclip-alternative",
    title: "A melhor alternativa gratuita e auto-hospedada ao OpusClip",
    description:
      "Procurando uma alternativa gratuita ao OpusClip? O Kortes é um gerador de clipes com IA de código aberto que você hospeda de graça. Ele transforma vídeos longos em cortes verticais legendados.",
    eyebrow: "Alternativa ao OpusClip",
    category: "Comparação",
    publishedAt: "2026-05-07",
    updatedAt: "2026-10-05",
    readingTime: "6 min de leitura",
    author: "Kortes",
    keywords: [
      "alternativa gratuita ao OpusClip",
      "alternativa ao OpusClip",
      "gerador de clipes com IA",
      "cortador de vídeo com IA grátis",
      "alternativa ao OpusClip de código aberto",
      "cortador de YouTube Shorts",
    ],
    summary:
      "O Kortes foi feito para criadores que querem cortes com IA no estilo do OpusClip na própria infraestrutura, sem mais uma assinatura baseada em créditos.",
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostMetadata(post: BlogPost): Metadata {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    title: { absolute: `${post.title} | Kortes` },
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      siteName: "Kortes",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.keywords,
      images: post.image ? [{ url: post.image.src, width: post.image.width, height: post.image.height, alt: post.image.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      images: post.image ? [{ url: post.image.src, alt: post.image.alt }] : undefined,
      title: post.title,
      description: post.description,
    },
  };
}
