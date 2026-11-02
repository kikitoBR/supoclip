import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { monetizationEnabled } from "@/lib/monetization";
import { getPrismaClient } from "@/server/prisma";
import { getServerStripeClient } from "@/server/stripe";
import { upsertSubscriptionState } from "@/server/stripe-subscription-sync";

// Undo a scheduled cancellation so the subscription renews as normal.
export async function POST() {
  if (!monetizationEnabled) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getPrismaClient().user.findUnique({
    where: { id: session.user.id },
    select: { stripe_subscription_id: true, subscription_provider: true },
  });

  if (!user?.stripe_subscription_id || user.subscription_provider === "apple") {
    return NextResponse.json({ error: "Nenhuma assinatura do Stripe para reativar" }, { status: 400 });
  }

  const stripe = getServerStripeClient();
  try {
    let subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id);
    if (subscription.status === "canceled") {
      return NextResponse.json(
        { error: "Esta assinatura já terminou. Escolha um plano para assinar de novo." },
        { status: 409 }
      );
    }

    if (subscription.cancel_at_period_end) {
      subscription = await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: false,
      });
    } else if (subscription.cancel_at) {
      subscription = await stripe.subscriptions.update(subscription.id, { cancel_at: "" });
    }

    // Sync immediately instead of waiting for the webhook.
    await upsertSubscriptionState(subscription);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to restart Stripe subscription", error);
    return NextResponse.json({ error: "Não foi possível reativar a assinatura" }, { status: 500 });
  }
}
