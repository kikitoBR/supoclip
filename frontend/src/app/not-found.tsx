import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl space-y-4 px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold">Página não encontrada</h1>
      <p className="text-muted-foreground">Esta página pode ter sido movida ou excluída.</p>
      <Button asChild><Link href="/">Voltar ao início</Link></Button>
    </main>
  );
}
