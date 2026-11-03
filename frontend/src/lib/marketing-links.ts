/**
 * Single registry of indexable marketing pages. The landing page, footer,
 * SEO pages, and blog all link from here so new pages are never orphaned.
 */
export type MarketingLinkGroup = "product" | "guide" | "comparison";

export interface MarketingLink {
  href: string;
  group: MarketingLinkGroup;
  eyebrow: string;
  title: string;
  /** Short footer label. */
  label: string;
  description: string;
  /** Hand-picked next reads, in priority order. */
  related: string[];
}

export const OPUSCLIP_COMPARISON_HREF = "/blog/supoclip-vs-opusclip";

export const marketingLinks: MarketingLink[] = [
  {
    href: "/demo",
    group: "product",
    eyebrow: "Demonstração",
    title: "Veja clipes reais criados pelo Kortes a partir de um vídeo longo",
    label: "Demonstração",
    description: "Assista ao resultado e pule para cada momento no vídeo de origem original.",
    related: ["/ai-video-clipper", "/youtube-shorts-clipper", OPUSCLIP_COMPARISON_HREF],
  },
  {
    href: "/ai-video-clipper",
    group: "guide",
    eyebrow: "Cortes com IA",
    title: "Criador de clipes com IA para Shorts, Reels e TikTok",
    label: "Criador de clipes com IA",
    description: "Como o Kortes encontra momentos, pontua candidatos, reenquadra rostos e adiciona legendas.",
    related: ["/demo", "/youtube-shorts-clipper", OPUSCLIP_COMPARISON_HREF],
  },
  {
    href: "/youtube-shorts-clipper",
    group: "guide",
    eyebrow: "YouTube para Shorts",
    title: "Transforme vídeos longos do YouTube em Shorts",
    label: "Criador de YouTube Shorts",
    description: "Um fluxo prático para selecionar, legendar, reenquadrar e revisar clipes.",
    related: ["/demo", "/ai-video-clipper", OPUSCLIP_COMPARISON_HREF],
  },
  {
    href: OPUSCLIP_COMPARISON_HREF,
    group: "comparison",
    eyebrow: "Comparativo",
    title: "Kortes vs OpusClip: uma comparação detalhada",
    label: "Kortes vs OpusClip",
    description: "Preço, marca d'água, automação e fluxo de trabalho, com referências diretas.",
    related: ["/demo", "/ai-video-clipper", "/youtube-shorts-clipper"],
  },
];

export function getMarketingLink(href: string) {
  return marketingLinks.find((link) => link.href === href);
}

export function getMarketingLinks(group: MarketingLinkGroup) {
  return marketingLinks.filter((link) => link.group === group);
}

export function getRelatedMarketingLinks(href: string): MarketingLink[] {
  return (getMarketingLink(href)?.related ?? [])
    .map(getMarketingLink)
    .filter((link): link is MarketingLink => Boolean(link));
}
