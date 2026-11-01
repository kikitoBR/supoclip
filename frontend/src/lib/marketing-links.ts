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

export const SELF_HOSTING_GUIDE_HREF = "/blog/self-host-supoclip-docker";
export const OPUSCLIP_COMPARISON_HREF = "/blog/supoclip-vs-opusclip";

export const marketingLinks: MarketingLink[] = [
  {
    href: "/demo",
    group: "product",
    eyebrow: "Demonstração",
    title: "Veja clipes reais criados pelo SupoClip a partir de um vídeo longo",
    label: "Demonstração",
    description: "Assista ao resultado e pule para cada momento no vídeo de origem original.",
    related: ["/ai-video-clipper", "/youtube-shorts-clipper", SELF_HOSTING_GUIDE_HREF],
  },
  {
    href: "/ai-video-clipper",
    group: "guide",
    eyebrow: "Cortes com IA",
    title: "Criador de clipes com IA para Shorts, Reels e TikTok",
    label: "Criador de clipes com IA",
    description: "Como o SupoClip encontra momentos, pontua candidatos, reenquadra rostos e adiciona legendas.",
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
    href: "/open-source-video-clipper",
    group: "guide",
    eyebrow: "Código Aberto",
    title: "Criador de clipes de código aberto sob seu controle",
    label: "Clipper de código aberto",
    description: "O que a auto-hospedagem muda sobre controle, provedores de modelos e infraestrutura.",
    related: [SELF_HOSTING_GUIDE_HREF, OPUSCLIP_COMPARISON_HREF, "/blog/supoclip-vs-supo-live"],
  },
  {
    href: SELF_HOSTING_GUIDE_HREF,
    group: "guide",
    eyebrow: "Guia de Auto-hospedagem",
    title: "Hospede o SupoClip você mesmo com Docker Compose",
    label: "Guia de auto-hospedagem",
    description: "Requisitos, variáveis de ambiente, primeira execução, configuração local e verificações de produção.",
    related: ["/open-source-video-clipper", OPUSCLIP_COMPARISON_HREF, "/youtube-shorts-clipper"],
  },
  {
    href: OPUSCLIP_COMPARISON_HREF,
    group: "comparison",
    eyebrow: "Comparativo",
    title: "SupoClip vs OpusClip: uma comparação detalhada",
    label: "SupoClip vs OpusClip",
    description: "Modelo de preços, implantação, marcas d'água e fluxo de trabalho, com referências diretas.",
    related: [SELF_HOSTING_GUIDE_HREF, "/blog/best-free-opusclip-alternative", "/ai-video-clipper"],
  },
  {
    href: "/blog/best-free-opusclip-alternative",
    group: "comparison",
    eyebrow: "Comparativo",
    title: "Melhor alternativa gratuita e auto-hospedada ao OpusClip",
    label: "Alternativa auto-hospedada ao OpusClip",
    description: "Quando um clipper de código aberto auto-hospedado é a melhor opção em vez de uma ferramenta por créditos.",
    related: [OPUSCLIP_COMPARISON_HREF, SELF_HOSTING_GUIDE_HREF, "/open-source-video-clipper"],
  },
  {
    href: "/blog/supoclip-vs-supo-live",
    group: "comparison",
    eyebrow: "Comparativo",
    title: "SupoClip vs supo.live: controle de código aberto",
    label: "SupoClip vs supo.live",
    description: "Compare auto-hospedagem, cortes com IA e edição antes de escolher uma ferramenta de vídeo.",
    related: ["/open-source-video-clipper", SELF_HOSTING_GUIDE_HREF, OPUSCLIP_COMPARISON_HREF],
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
