"use client";

import { PageError } from "@/components/app/page-state";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <PageError message="Não foi possível carregar esta página. Por favor, tente novamente." retry={reset} />;
}
