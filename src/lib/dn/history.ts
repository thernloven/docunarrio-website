"use client";

import type { ChatPage } from "./types";

// The API keeps chat sessions in memory and has no endpoint that lists them,
// so conversations live in this browser (localStorage, per user). Page
// images are too big for localStorage (~300 KB each), so they go to
// IndexedDB, keyed by document and page.

export type PageRef = Omit<ChatPage, "pageImageBase64">;

export type Turn = {
  id: string;
  question: string;
  askedAt: number;
  answer?: string;
  pages: PageRef[];
  totalTimeMs?: number;
  error?: string;
  /** The server had forgotten the session: this answer has no memory of earlier turns. */
  restarted?: boolean;
};

export type Conversation = {
  id: string;
  sessionId?: string;
  storeId: string;
  storeName: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  turns: Turn[];
};

const key = (userId: string) => `dn.conversations.${userId}`;

export function loadConversations(userId: string): Conversation[] {
  try {
    const list: Conversation[] = JSON.parse(localStorage.getItem(key(userId)) ?? "[]");
    // A question in flight when the tab closed will never be answered.
    for (const c of list) for (const t of c.turns) if (t.answer === undefined && !t.error) t.error = "This question was interrupted. Ask it again.";
    return list.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function saveConversations(userId: string, list: Conversation[]) {
  try {
    localStorage.setItem(key(userId), JSON.stringify(list));
  } catch {
    /* storage full or blocked: history just won't persist */
  }
}

// MARK: page images

const pageKey = (p: { docId: string; pageNum: number }) => `${p.docId}#${p.pageNum}`;
const memory = new Map<string, string>();

function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("docunarrio", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("pages");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function storePages(pages: ChatPage[]) {
  const fresh = pages.filter((p) => p.pageImageBase64 && !memory.has(pageKey(p)));
  if (!fresh.length) return;
  for (const p of fresh) memory.set(pageKey(p), `data:image/png;base64,${p.pageImageBase64}`);
  try {
    const d = await db();
    const tx = d.transaction("pages", "readwrite");
    for (const p of fresh) tx.objectStore("pages").put(memory.get(pageKey(p)), pageKey(p));
  } catch {
    /* memory copy still works for this visit */
  }
}

export async function pageImage(p: { docId: string; pageNum: number }): Promise<string | null> {
  const k = pageKey(p);
  if (memory.has(k)) return memory.get(k)!;
  try {
    const d = await db();
    return await new Promise((resolve) => {
      const req = d.transaction("pages").objectStore("pages").get(k);
      req.onsuccess = () => {
        if (req.result) memory.set(k, req.result);
        resolve(req.result ?? null);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}
