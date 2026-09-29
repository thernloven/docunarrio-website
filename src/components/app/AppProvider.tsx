"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { api, ApiError } from "@/lib/dn/client";
import { loadConversations, saveConversations, storePages, type Conversation, type Turn } from "@/lib/dn/history";
import { EMPTY_GUID, isAdmin, type ChatSession, type Store, type User } from "@/lib/dn/types";

/** Pages retrieved per question and generation settings (API defaults). */
export const TOP_K = 5;
const TEMPERATURE = 0.4;
const MAX_TOKENS = 2048;

type LibraryState = { status: "loading" } | { status: "loaded" } | { status: "failed"; message: string };

type Ctx = {
  user: User | null;
  admin: boolean;
  stores: Store[];
  libraries: LibraryState;
  reloadLibraries: () => Promise<void>;
  selectedStore: Store | null;
  selectStore: (id: string) => void;

  conversations: Conversation[];
  active: Conversation | null;
  sending: boolean;
  openConversation: (id: string | null) => void;
  deleteConversation: (id: string) => void;
  ask: (question: string) => Promise<void>;
  retry: (turnId: string) => Promise<void>;
};

const AppContext = createContext<Ctx | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp outside AppProvider");
  return ctx;
}

const uid = () => crypto.randomUUID();

export default function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [libraries, setLibraries] = useState<LibraryState>({ status: "loading" });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const convRef = useRef<Conversation[]>([]);

  // Every change to history goes through here so it is saved as it happens.
  const commit = useCallback(
    (next: Conversation[]) => {
      convRef.current = next;
      setConversations(next);
      if (user) saveConversations(user.id, next);
    },
    [user],
  );

  const reloadLibraries = useCallback(async () => {
    try {
      const list = await api<Store[]>("store/list", { search: "" });
      list.sort((a, b) => a.name.localeCompare(b.name));
      setStores(list);
      setSelectedId((cur) => {
        const saved = cur ?? localStorage.getItem("dn.store");
        return list.some((s) => s.id === saved) ? saved : list[0]?.id ?? null;
      });
      setLibraries({ status: "loaded" });
    } catch (e) {
      const err = e as ApiError;
      setLibraries({
        status: "failed",
        message: err.status === 401 ? "Your account can’t list libraries yet. Ask your company admin for access." : err.message,
      });
    }
  }, []);

  useEffect(() => {
    api<User>("sys/account/getaccount")
      .then((me) => {
        setUser(me);
        const list = loadConversations(me.id);
        convRef.current = list;
        setConversations(list);
      })
      .catch(() => {});
    reloadLibraries();
  }, [reloadLibraries]);

  const selectStore = useCallback((id: string) => {
    setSelectedId(id);
    localStorage.setItem("dn.store", id);
    setActiveId(null);
  }, []);

  const selectedStore = stores.find((s) => s.id === selectedId) ?? stores[0] ?? null;
  const active = conversations.find((c) => c.id === activeId) ?? null;
  const sending = active?.turns.at(-1)?.answer === undefined && !active?.turns.at(-1)?.error && !!active?.turns.length;

  const patch = useCallback(
    (convId: string, fn: (c: Conversation) => Conversation) => {
      commit(convRef.current.map((c) => (c.id === convId ? { ...fn(c), updatedAt: Date.now() } : c)).sort((a, b) => b.updatedAt - a.updatedAt));
    },
    [commit],
  );
  const patchTurn = useCallback(
    (convId: string, turnId: string, fn: (t: Turn) => Turn) => patch(convId, (c) => ({ ...c, turns: c.turns.map((t) => (t.id === turnId ? fn(t) : t)) })),
    [patch],
  );

  const answer = useCallback(
    async (convId: string, turnId: string, fresh = false): Promise<void> => {
      const conv = convRef.current.find((c) => c.id === convId);
      const turn = conv?.turns.find((t) => t.id === turnId);
      if (!conv || !turn) return;
      try {
        const session = await api<ChatSession>("chat/query", {
          sessionId: fresh ? EMPTY_GUID : conv.sessionId ?? EMPTY_GUID,
          storeId: conv.storeId,
          question: turn.question,
          topK: TOP_K,
          temperature: TEMPERATURE,
          maxTokens: MAX_TOKENS,
        });
        await storePages(session.interactions.flatMap((i) => i.pages ?? []));
        const reply = [...session.interactions].reverse().find((i) => i.userPrompt === turn.question) ?? session.interactions.at(-1);
        patch(convId, (c) => ({ ...c, sessionId: session.id }));
        patchTurn(convId, turnId, (t) => ({
          ...t,
          answer: reply?.assistantPrompt ?? "",
          pages: [...(reply?.pages ?? [])].sort((a, b) => a.rank - b.rank).map((p) => ({ rank: p.rank, score: p.score, docId: p.docId, fileName: p.fileName, pageNum: p.pageNum })),
          totalTimeMs: reply?.totalTimeMs,
          restarted: fresh,
          error: undefined,
        }));
      } catch (e) {
        // The server forgot this conversation: ask again in a new session.
        if ((e as ApiError).code === "SessionNotFound" && !fresh) return answer(convId, turnId, true);
        patchTurn(convId, turnId, (t) => ({ ...t, error: (e as Error).message }));
      }
    },
    [patch, patchTurn],
  );

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || sending) return;
      let conv = active;
      if (!conv) {
        const store = selectedStore;
        if (!store) return;
        conv = { id: uid(), storeId: store.id, storeName: store.name, title: q.slice(0, 80), createdAt: Date.now(), updatedAt: Date.now(), turns: [] };
        commit([conv, ...convRef.current]);
        setActiveId(conv.id);
      }
      const turn: Turn = { id: uid(), question: q, askedAt: Date.now(), pages: [] };
      patch(conv.id, (c) => ({ ...c, turns: [...c.turns, turn] }));
      await answer(conv.id, turn.id);
    },
    [active, selectedStore, sending, commit, patch, answer],
  );

  const retry = useCallback(
    async (turnId: string) => {
      if (!active) return;
      patchTurn(active.id, turnId, (t) => ({ ...t, error: undefined }));
      await answer(active.id, turnId);
    },
    [active, patchTurn, answer],
  );

  const openConversation = useCallback(
    (id: string | null) => {
      setActiveId(id);
      const c = convRef.current.find((x) => x.id === id);
      if (c && c.storeId !== selectedId) {
        setSelectedId(c.storeId);
        localStorage.setItem("dn.store", c.storeId);
      }
    },
    [selectedId],
  );

  const deleteConversation = useCallback(
    (id: string) => {
      commit(convRef.current.filter((c) => c.id !== id));
      setActiveId((cur) => (cur === id ? null : cur));
    },
    [commit],
  );

  const value = useMemo<Ctx>(
    () => ({
      user, admin: isAdmin(user), stores, libraries, reloadLibraries, selectedStore, selectStore,
      conversations, active, sending, openConversation, deleteConversation, ask, retry,
    }),
    [user, stores, libraries, reloadLibraries, selectedStore, selectStore, conversations, active, sending, openConversation, deleteConversation, ask, retry],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
