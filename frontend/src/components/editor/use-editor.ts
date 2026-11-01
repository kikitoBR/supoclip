"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatSupportMessage, parseApiError } from "@/lib/api-error";
import type { EditDocument, EditorState } from "@/lib/editor/document";

export async function editorRequest<T>(
  url: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  const response = await fetch(url, {
    method,
    cache: "no-store",
    ...(body === undefined
      ? {}
      : {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
  });
  if (!response.ok)
    throw new Error(
      formatSupportMessage(
        await parseApiError(response, "Não foi possível atualizar o editor."),
      ),
    );
  return response.json();
}
interface History {
  past: EditDocument[];
  present: EditDocument;
  future: EditDocument[];
}
export function useEditor(endpoint: string) {
  const [asset, setAsset] = useState<EditorState | null>(null);
  const [history, setHistory] = useState<History | null>(null);
  const [status, setStatus] = useState("Preparando pré-visualização…");
  const [error, setError] = useState<string | null>(null);
  const [storageError, setStorageError] = useState(false);
  const historyRef = useRef<History | null>(null);
  const assetRef = useRef<EditorState | null>(null);
  const revision = useRef(0),
    saved = useRef("");
  const inFlight = useRef<Promise<void> | null>(null);
  const mounted = useRef(true);
  const cacheKey = `supoclip-editor:${endpoint}`;
  const lastEdit = useRef({ group: "", at: 0 });
  const cache = useCallback(
    (value: History) => {
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            basis: assetRef.current?.basis,
            revision: revision.current,
            saved: saved.current,
            history: value,
          }),
        );
        setStorageError(false);
      } catch {
        setStorageError(true);
      }
    },
    [cacheKey],
  );
  const publish = useCallback(
    (next: History) => {
      historyRef.current = next;
      setHistory(next);
      cache(next);
      const isSaved = JSON.stringify(next.present) === saved.current;
      setStatus(isSaved ? "Todas as alterações salvas" : "Alterações não salvas");
      if (isSaved) setError(null);
    },
    [cache],
  );
  const update = useCallback(
    (change: (doc: EditDocument) => EditDocument, group = "") => {
      const current = historyRef.current;
      if (!current) return;
      const next = change(current.present);
      if (JSON.stringify(next) === JSON.stringify(current.present)) return;
      const coalesce =
        group &&
        lastEdit.current.group === group &&
        Date.now() - lastEdit.current.at < 700;
      publish({
        past: coalesce
          ? current.past
          : [...current.past, current.present].slice(-50),
        present: next,
        future: [],
      });
      lastEdit.current = { group, at: Date.now() };
    },
    [publish],
  );
  const undo = useCallback(() => {
    const h = historyRef.current;
    if (h?.past.length)
      publish({
        past: h.past.slice(0, -1),
        present: h.past[h.past.length - 1],
        future: [h.present, ...h.future],
      });
    lastEdit.current.group = "";
  }, [publish]);
  const redo = useCallback(() => {
    const h = historyRef.current;
    if (h?.future.length)
      publish({
        past: [...h.past, h.present],
        present: h.future[0],
        future: h.future.slice(1),
      });
    lastEdit.current.group = "";
  }, [publish]);
  const save = useCallback(async () => {
    // All callers drain the same serialized queue, including edits made during a save.
    for (;;) {
      while (inFlight.current) await inFlight.current;
      const h = historyRef.current,
        a = assetRef.current;
      if (!h || !a || JSON.stringify(h.present) === saved.current) return;
      const document = h.present;
      setStatus("Salvando…");
      const operation = (async () => {
        try {
          const result = await editorRequest<{ revision: number }>(
            endpoint,
            "PATCH",
            { basis: a.basis, revision: revision.current, document },
          );
          revision.current = result.revision;
          saved.current = JSON.stringify(document);
          if (mounted.current) {
            setError(null);
            setStatus(
              JSON.stringify(historyRef.current?.present) === saved.current
                ? "Todas as alterações salvas"
                : "Alterações não salvas",
            );
            if (historyRef.current) cache(historyRef.current);
          }
        } catch (e) {
          if (mounted.current) {
            setError(e instanceof Error ? e.message : "Não foi possível salvar o rascunho");
            setStatus("Falha ao salvar · rascunho mantido localmente");
          }
          throw e;
        }
      })();
      inFlight.current = operation;
      try {
        await operation;
      } finally {
        if (inFlight.current === operation) inFlight.current = null;
      }
    }
  }, [cache, endpoint]);
  useEffect(() => {
    mounted.current = true;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    async function load() {
      try {
        const state = await editorRequest<EditorState>(endpoint);
        if (stopped) return;
        setAsset(state);
        if (state.status === "unprepared") {
          await editorRequest(`${endpoint}/prepare`, "POST");
          if (!stopped) timer = setTimeout(load, 1500);
          return;
        }
        if (state.status === "preparing") {
          timer = setTimeout(load, 1500);
          return;
        }
        if (state.status === "failed") {
          setError(state.error || "Falha na preparação da pré-visualização");
          return;
        }
        assetRef.current = state;
        revision.current = state.draft.revision;
        saved.current = JSON.stringify(state.draft.document);
        let h: History = {
          past: [],
          present: state.draft.document,
          future: [],
        };
        try {
          const local = JSON.parse(localStorage.getItem(cacheKey) || "null");
          if (
            local?.basis === state.basis &&
            local.history?.present?.version === 1
          ) {
            if (
              local.revision === state.draft.revision ||
              JSON.stringify(local.history.present) === saved.current
            )
              h = local.history;
            else if (JSON.stringify(local.history.present) !== local.saved) {
              h = local.history;
              revision.current = local.revision;
              setError(
                "Existe um rascunho mais recente no servidor. Suas alterações locais foram mantidas. Baixe um backup do rascunho e recarregue a versão salva para resolver o conflito.",
              );
            }
          }
        } catch {
          /* An unreadable local cache never prevents server recovery. */
        }
        historyRef.current = h;
        setHistory(h);
        setStatus(
          JSON.stringify(h.present) === saved.current
            ? "Todas as alterações salvas"
            : "Rascunho local recuperado",
        );
      } catch (e) {
        if (!stopped)
          setError(e instanceof Error ? e.message : "Não foi possível carregar o editor");
      }
    }
    void load();
    return () => {
      stopped = true;
      mounted.current = false;
      clearTimeout(timer);
    };
  }, [cacheKey, endpoint]);
  useEffect(() => {
    if (!history || error) return;
    const timer = setTimeout(() => void save().catch(() => {}), 700);
    return () => clearTimeout(timer);
  }, [history, save, error]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (
        historyRef.current &&
        JSON.stringify(historyRef.current.present) !== saved.current
      )
        event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  const reload = async () => {
    if (inFlight.current) await inFlight.current.catch(() => {});
    const state = await editorRequest<EditorState>(endpoint);
    if (state.status !== "ready") throw new Error("A pré-visualização não está pronta");
    revision.current = state.draft.revision;
    saved.current = JSON.stringify(state.draft.document);
    assetRef.current = state;
    setAsset(state);
    const h = { past: [], present: state.draft.document, future: [] };
    historyRef.current = h;
    setHistory(h);
    cache(h);
    setError(null);
    setStatus("Todas as alterações salvas");
  };
  return {
    asset,
    document: history?.present ?? null,
    update,
    undo,
    redo,
    canUndo: !!history?.past.length,
    canRedo: !!history?.future.length,
    save,
    reload,
    status,
    error,
    storageError,
  };
}
