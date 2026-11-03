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
    slug: "supoclip-vs-opusclip",
    title: "Kortes vs OpusClip: uma comparação com fontes",
    description:
      "Kortes e OpusClip comparados em preço, marca d'água, automação e fluxo de trabalho, com uma fonte para cada afirmação do OpusClip.",
    eyebrow: "Comparação com o OpusClip",
    category: "Comparação",
    publishedAt: "2026-10-05",
    updatedAt: "2026-10-05",
    readingTime: "7 min de leitura",
    author: "Kortes",
    keywords: [
      "Kortes vs OpusClip",
      "alternativa ao OpusClip",
      "OpusClip grátis",
      "marca d'água do OpusClip",
    ],
    summary:
      "Um lado a lado do que cada produto documenta, onde os dois diferem e qual combina com o seu fluxo.",
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
