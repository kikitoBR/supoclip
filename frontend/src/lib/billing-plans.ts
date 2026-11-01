export type BillingPlanId = "pro" | "scale";

export type PublicBillingPlan = {
  id: BillingPlanId;
  name: string;
  priceMonthly: string;
  generationLimit: number;
  youtubeMaxMinutes: number;
  description: string;
  highlights: string[];
  cta: string;
  highlighted: boolean;
};

export const PAID_PLAN_IDS: BillingPlanId[] = ["pro", "scale"];

export function formatBillingPlanName(plan: string | null | undefined): string {
  if (plan === "pro") {
    return "Pro";
  }
  if (plan === "scale") {
    return "Scale";
  }
  if (plan === "self_host") {
    return "Auto-hospedado";
  }
  return "Gratuito";
}

export function isPaidBillingPlan(plan: string | null | undefined): plan is BillingPlanId {
  return plan === "pro" || plan === "scale";
}

export function getPublicBillingPlans(): PublicBillingPlan[] {
  const proPriceMonthly = process.env.NEXT_PUBLIC_PRO_PRICE_MONTHLY || "10";
  const scalePriceMonthly = process.env.NEXT_PUBLIC_SCALE_PRICE_MONTHLY || "50";
  const proLimit = parseInt(process.env.NEXT_PUBLIC_PRO_PLAN_TASK_LIMIT || "50", 10);
  const scaleLimit = parseInt(process.env.NEXT_PUBLIC_SCALE_PLAN_TASK_LIMIT || "300", 10);
  // Mirrors the backend's PRO_/SCALE_YOUTUBE_MAX_VIDEO_DURATION defaults.
  const proYoutubeMinutes = parseInt(process.env.NEXT_PUBLIC_PRO_YOUTUBE_MAX_MINUTES || "90", 10);
  const scaleYoutubeMinutes = parseInt(process.env.NEXT_PUBLIC_SCALE_YOUTUBE_MAX_MINUTES || "180", 10);

  return [
    {
      id: "pro",
      name: "Pro",
      priceMonthly: proPriceMonthly,
      generationLimit: proLimit,
      youtubeMaxMinutes: proYoutubeMinutes,
      description: "Para criadores que produzem clipes com frequência todos os meses.",
      highlights: [
        `${proLimit} vídeos cortados todo mês`,
        `Vídeos do YouTube de até ${formatMinutes(proYoutubeMinutes)}`,
        "Fontes personalizadas, B-roll e modelos de legendas",
      ],
      cta: "Fazer upgrade para o Pro",
      highlighted: true,
    },
    {
      id: "scale",
      name: "Scale",
      priceMonthly: scalePriceMonthly,
      generationLimit: scaleLimit,
      youtubeMaxMinutes: scaleYoutubeMinutes,
      description: "Para equipes e criadores com alto volume de publicação.",
      highlights: [
        `${scaleLimit} vídeos cortados todo mês`,
        `Vídeos do YouTube de até ${formatMinutes(scaleYoutubeMinutes)}`,
        "Processamento prioritário",
      ],
      cta: "Fazer upgrade para o Scale",
      highlighted: false,
    },
  ];
}

export function formatMinutes(minutes: number): string {
  if (minutes >= 60 && minutes % 60 === 0) {
    const hours = minutes / 60;
    return `${hours} ${hours === 1 ? "hora" : "horas"}`;
  }
  return `${minutes} minutos`;
}

/** The plan one step above `plan`, or null when there is nothing to upgrade to. */
export function getNextBillingPlan(plan: string | null | undefined): PublicBillingPlan | null {
  const plans = getPublicBillingPlans();
  if (plan === "scale" || plan === "self_host") return null;
  if (plan === "pro") return plans.find((candidate) => candidate.id === "scale") ?? null;
  return plans.find((candidate) => candidate.id === "pro") ?? null;
}
