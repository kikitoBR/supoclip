"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "../../lib/auth-client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const linkError = searchParams.get("error");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem");
      return;
    }

    setLoading(true);
    setMessage("");

    const response = await resetPassword({ newPassword: password, token });

    setLoading(false);
    if (response.error) {
      setMessage(response.error.message || "Falha ao redefinir a senha");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/sign-in"), 1500);
  };

  if (!token || linkError) {
    return (
      <div className="w-full">
        <h1 className="font-display text-3xl font-bold tracking-tight">Link expirado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Este link de redefinição de senha é inválido ou expirou.
        </p>
        <Link href="/forgot-password" className="mt-8 inline-block text-sm font-medium underline-offset-4 hover:underline">
          Solicitar um novo link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="font-display text-3xl font-bold tracking-tight">Escolha uma nova senha</h1>
      <p className="mt-2 text-sm text-muted-foreground">Você será desconectado de outros dispositivos.</p>
      <div className="mt-8">
        {done ? (
          <p className="text-sm text-green-600">Senha atualizada com sucesso. Redirecionando para o login...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              className="h-11"
              type="password"
              placeholder="Nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
            <Input
              className="h-11"
              type="password"
              placeholder="Confirme a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? "Salvando..." : "Redefinir senha"}
            </Button>
          </form>
        )}
        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      </div>
    </div>
  );
}
