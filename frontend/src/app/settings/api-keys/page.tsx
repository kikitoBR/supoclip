"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Bot, Braces, Copy, Check, Trash2, AlertCircle, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, useSession } from "@/lib/auth-client";
import { GITHUB_URL } from "@/lib/site";

const DOCS = [
  {
    title: "Conectar um agente",
    description: "Configure o servidor MCP no Claude, Cursor e outros clientes MCP.",
    href: `${GITHUB_URL}/blob/main/mcp/README.md`,
    icon: Bot,
  },
  {
    title: "Referência da API REST",
    description: "Endpoints, autenticação e exemplos para acesso direto à API.",
    href: `${GITHUB_URL}/blob/main/docs/api-reference.md#authenticating-with-api-keys`,
    icon: Braces,
  },
];

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string | null;
  last_used_at: string | null;
  revoked: boolean;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

export default function ApiKeysPage() {
  const { data: session, isPending, refetch } = useSession();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const emailVerified = session?.user?.emailVerified === true;

  useEffect(() => {
    const verificationError = new URLSearchParams(window.location.search).get("error");
    if (verificationError === "TOKEN_EXPIRED" || verificationError === "INVALID_TOKEN") {
      setError("Este link de verificação é inválido ou expirou. Solicite um novo e-mail abaixo.");
    }
  }, []);

  const handleSendVerification = async () => {
    if (!session?.user.email) return;
    setIsSendingVerification(true);
    setError(null);
    try {
      const result = await authClient.sendVerificationEmail({
        email: session.user.email,
        callbackURL: "/settings/api-keys",
      });
      if (result.error) throw new Error(result.error.message || "Falha ao enviar e-mail de verificação");
      setVerificationSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar e-mail de verificação");
    } finally {
      setIsSendingVerification(false);
    }
  };

  const loadKeys = useCallback(async () => {
    setIsFetching(true);
    try {
      const response = await fetch("/api/api-keys", { cache: "no-store" });
      if (!response.ok) throw new Error("Falha ao carregar chaves de API");
      const data = await response.json();
      setKeys(data.api_keys || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar chaves de API");
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      loadKeys();
    }
  }, [session?.user?.id, loadKeys]);

  const handleCreate = async () => {
    if (!emailVerified) return;
    setIsCreating(true);
    setError(null);
    setNewKey(null);
    setCopied(false);
    try {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || "Chave de API" }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.detail || "Falha ao criar chave de API");
      }
      setNewKey(data.api_key?.key ?? null);
      setName("");
      await loadKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar chave de API");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    setError(null);
    try {
      const response = await fetch(`/api/api-keys/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.detail || "Falha ao revogar chave de API");
      }
      await loadKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao revogar chave de API");
    }
  };

  const handleCopy = async () => {
    if (!newKey) return;
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Skeleton className="h-32 w-full max-w-xl" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <p className="text-gray-600 mb-4">Entre para gerenciar suas chaves de API.</p>
          <Link href="/sign-in">
            <Button>Entrar</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 md:py-10">
        <div>
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight">Agentes &amp; API</h1>
            <p className="mt-2 text-muted-foreground">
              Permita que Claude, Cursor e outros agentes de IA criem clipes para você através do{" "}
              <span className="font-medium text-foreground">servidor MCP do Kortes</span>, ou chame a API REST
              diretamente do seu próprio código. Trate suas chaves como senhas; elas concedem acesso total à sua conta.
            </p>
          </div>

          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            {DOCS.map((doc) => (
              <a
                key={doc.href}
                href={doc.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3 rounded-xl border bg-background p-4 transition-colors hover:border-foreground/25"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted"><doc.icon className="size-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 text-sm font-semibold">
                    {doc.title}
                    <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{doc.description}</span>
                </span>
              </a>
            ))}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!emailVerified && (
            <Alert className="mb-6">
              <AlertDescription>
                <p className="font-medium">Confirme seu e-mail para criar chaves de API</p>
                <p className="mt-1">Confirme que você é proprietário de {session.user.email}. Você ainda pode visualizar e revogar chaves existentes.</p>
                {verificationSent && (
                  <p role="status" className="mt-2">E-mail de verificação solicitado. Verifique sua caixa de entrada; o link expira em 1 hora.</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="outline" onClick={handleSendVerification} disabled={isSendingVerification}>
                    {isSendingVerification ? "Enviando…" : verificationSent ? "Reenviar e-mail de verificação" : "Enviar e-mail de verificação"}
                  </Button>
                  <Button variant="ghost" onClick={() => void refetch()}>
                    Já confirmei meu e-mail
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* One-time key reveal */}
          {newKey && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription>
                <p className="font-medium text-green-900 mb-2">
                  Copie sua nova chave agora — ela não será exibida novamente.
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-white border rounded text-sm break-all">
                    {newKey}
                  </code>
                  <Button size="sm" variant="outline" onClick={handleCopy}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Create form */}
          <div className="mb-10 p-4 border rounded-lg">
            <Label htmlFor="key-name" className="mb-2 block">
              Criar uma nova chave
            </Label>
            <div className="flex gap-2">
              <Input
                id="key-name"
                placeholder="Ex: MCP do meu notebook"
                value={name}
                maxLength={120}
                onChange={(e) => setName(e.target.value)}
                disabled={isCreating || !emailVerified}
              />
              <Button onClick={handleCreate} disabled={isCreating || !emailVerified}>
                <Plus className="w-4 h-4" />
                {isCreating ? "Criando…" : "Criar"}
              </Button>
            </div>
          </div>

          {/* Key list */}
          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Suas chaves
            </h2>
            {isFetching ? (
              <Skeleton className="h-20 w-full" />
            ) : keys.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma chave de API ainda.</p>
            ) : (
              <div className="space-y-3">
                {keys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-black truncate">{key.name}</span>
                        {key.revoked && <Badge variant="secondary">Revogada</Badge>}
                      </div>
                      <p className="text-xs text-gray-500 font-mono mt-1">
                        {key.key_prefix}…
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Criada em {formatDate(key.created_at)} · Último uso em{" "}
                        {formatDate(key.last_used_at)}
                      </p>
                    </div>
                    {!key.revoked && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRevoke(key.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Revogar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
    </main>
  );
}
