"use client";

import { useState } from "react";
import { signUp } from "../../lib/auth-client";
import { attributionMetadata, getAnonymousAttribution } from "@/lib/attribution";
import { postAuthPath } from "@/lib/auth-redirect";
import { track } from "@/lib/datafast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await signUp.email({
      email,
      password,
      name,
    });

    if (response.error) {
      setMessage(response.error.message || "Falha ao criar conta");
      setLoading(false);
      return;
    }

    track("signup_completed", {
      auth_method: "email",
      ...attributionMetadata(getAnonymousAttribution()),
    });
    setMessage("Conta criada com sucesso! Entrando...");
    setLoading(false);

    // Automatically sign in after successful sign up
    setTimeout(() => {
      window.location.href = postAuthPath(window.location.search);
    }, 1000);
  };

  return (
    <div className="w-full">
      <h1 className="font-display text-3xl font-bold tracking-tight">Crie sua conta</h1>
      <p className="mt-2 text-sm text-muted-foreground">Transforme vídeos longos em clipes verticais legendados.</p>
      <div className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            className="h-11"
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            className="h-11"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            className="h-11"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={8}
          />
          <Button type="submit" className="h-11 w-full" disabled={loading}>
            {loading ? "Criando conta..." : "Cadastrar-se"}
          </Button>
        </form>
        {message && (
          <p className={`mt-4 text-sm ${message.includes("sucesso") || message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
