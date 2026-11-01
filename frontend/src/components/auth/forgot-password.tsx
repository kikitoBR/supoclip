"use client";

import { useState } from "react";
import { requestPasswordReset } from "../../lib/auth-client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const response = await requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    setLoading(false);
    if (response.error) {
      setError(response.error.message || "Não foi possível enviar o link de recuperação");
      return;
    }
    setSent(true);
  };

  return (
    <div className="w-full">
      <h1 className="font-display text-3xl font-bold tracking-tight">Esqueceu sua senha?</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Digite seu e-mail e nós enviaremos um link para redefinir sua senha.
      </p>
      <div className="mt-8">
        {sent ? (
          <p className="text-sm text-green-600">
            Se existir uma conta associada a {email}, um link de recuperação foi enviado. Verifique sua caixa de entrada e pasta de spam.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              className="h-11"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
          </form>
        )}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
