"use client";

import { ArrowRight, ArrowUp, BookOpen, ChevronLeft, ChevronRight, Copy, Check, RotateCw, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { pageImage, type PageRef, type Turn } from "@/lib/dn/history";
import { useApp } from "./AppProvider";
import { LogoMark } from "./Logo";
import Markdown from "./Markdown";

type Selection = { pages: PageRef[]; index: number };

export default function ChatScreen() {
  const { active } = useApp();
  // The open source belongs to one conversation; switching hides it.
  const [picked, setPicked] = useState<(Selection & { conv?: string }) | null>(null);
  const source = picked && picked.conv === active?.id ? picked : null;
  const setSource = (s: Selection | null) => setPicked(s && { ...s, conv: active?.id });

  return (
    <div className="flex-1 min-h-0 flex">
      <div className="flex-1 min-w-0 flex flex-col">
        {active ? <Thread onSource={setSource} /> : <Welcome />}
      </div>
      {source && <SourcePanel selection={source} onChange={setSource} onClose={() => setSource(null)} />}
    </div>
  );
}

// MARK: - New chat

function Welcome() {
  const { user, selectedStore, libraries, reloadLibraries, ask } = useApp();
  const h = new Date().getHours();
  const part = h < 5 ? "Good evening" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const docs = (selectedStore?.documents ?? []).slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center px-6 py-12 gap-8">
        <LogoMark className="h-11 w-auto text-ink" />
        <div className="text-center space-y-2.5">
          <h1 className="font-display text-[40px] lg:text-[48px] leading-[1.15] font-semibold tracking-[-0.02em]">
            {part}{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <p className="text-[16px] leading-[26px] text-stone">
            {selectedStore ? <>Ask about {selectedStore.name} — every answer links to the page it came from.</> : "Every answer links to the page it came from."}
          </p>
        </div>

        <div className="w-full max-w-[720px]"><Composer autoFocus /></div>

        {libraries.status === "failed" && (
          <div className="w-full max-w-[720px] rounded-xl bg-sand-tint px-4 py-3.5 text-[14px] text-ink-700 flex items-center justify-between gap-4">
            {libraries.message}
            <button onClick={reloadLibraries} className="font-medium text-ink shrink-0">Try again</button>
          </div>
        )}

        {docs.length > 0 && (
          <div className="w-full max-w-[720px] grid sm:grid-cols-2 gap-3">
            {docs.map((d) => {
              const name = d.fileName.replace(/\.pdf$/i, "");
              const q = `What are the key points in ${name}?`;
              return (
                <button key={d.id} onClick={() => ask(q)} className="group text-left rounded-[14px] bg-snow border border-sand px-4 py-3.5 hover:border-mist transition-colors">
                  <p className="text-[14px] leading-[22px] font-medium text-ink flex items-start justify-between gap-3">
                    {q}
                    <ArrowRight className="size-4 mt-[3px] text-stone opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </p>
                  <p className="text-[12px] leading-4 text-stone mt-1">{d.fileName}{d.fileVersion ? ` · v${d.fileVersion}` : ""}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// MARK: - Conversation

function Thread({ onSource }: { onSource: (s: Selection) => void }) {
  const { active, sending, retry } = useApp();
  const scroller = useRef<HTMLDivElement>(null);
  const count = active?.turns.length ?? 0;
  const lastId = active?.turns.at(-1)?.id;

  // Open at the latest answer; pin each new question to the top while its
  // answer is written below it, and again when the answer lands.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [active?.id]);
  useEffect(() => {
    if (!lastId) return;
    requestAnimationFrame(() => document.getElementById(`turn-${lastId}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [count, lastId, sending]);

  if (!active) return null;
  return (
    <>
      <header className="h-[61px] shrink-0 flex items-center gap-3 px-8 border-b border-sand">
        <h1 className="flex-1 min-w-0 truncate font-display text-[18px] font-medium">{active.title}</h1>
        <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-snow border border-sand text-[12px] text-ink-700">
          <BookOpen className="size-3.5 text-slate" strokeWidth={1.5} /> {active.storeName}
        </span>
      </header>
      <div ref={scroller} className="flex-1 overflow-y-auto">
        <div className="max-w-[680px] mx-auto px-6 pt-8 space-y-7">
          {active.turns.map((t) => (
            <TurnView key={t.id} turn={t} storeName={active.storeName} onSource={onSource} onRetry={() => retry(t.id)} />
          ))}
          <div style={{ height: sending ? "60vh" : 24 }} />
        </div>
      </div>
      <div className="shrink-0 px-6 pb-5 pt-2">
        <div className="max-w-[680px] mx-auto">
          <Composer placeholder="Ask a follow-up…" />
          <p className="text-center text-[12px] text-stone mt-2.5">Answers are generated from your documents. Always check the cited page.</p>
        </div>
      </div>
    </>
  );
}

function TurnView({ turn, storeName, onSource, onRetry }: { turn: Turn; storeName: string; onSource: (s: Selection) => void; onRetry: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <section id={`turn-${turn.id}`} className="space-y-7 scroll-mt-6">
      <div className="flex justify-end pl-12">
        <p className="bg-sand-tint rounded-2xl rounded-br-[4px] px-4 py-[11px] text-[16px] leading-[26px] whitespace-pre-wrap">{turn.question}</p>
      </div>
      <div className="flex gap-3.5">
        <span className="size-7 shrink-0 rounded-full bg-white border border-sand grid place-items-center"><LogoMark className="h-[15px] w-auto text-ink" /></span>
        <div className="flex-1 min-w-0 space-y-3.5 pt-[1px]">
          {turn.error ? (
            <div className="rounded-xl border border-danger/25 bg-burgundy-soft/60 px-4 py-3.5 space-y-2">
              <p className="text-[14px] text-danger">{turn.error}</p>
              <button onClick={onRetry} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink"><RotateCw className="size-3.5" /> Try again</button>
            </div>
          ) : turn.answer === undefined ? (
            <div className="space-y-3.5">
              <p className="text-[14px] text-slate flex items-center gap-2"><span className="size-1.5 rounded-full bg-slate dn-pulse" /> Searching {storeName}…</p>
              {[100, 92, 60].map((w) => <div key={w} className="h-2.5 rounded-full bg-sand-tint dn-pulse" style={{ width: `${w}%` }} />)}
            </div>
          ) : (
            <>
              {turn.restarted && <p className="text-[12px] text-stone">Earlier messages had expired, so this was answered on its own.</p>}
              <Markdown source={turn.answer} />
              {turn.pages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] leading-[14px] font-semibold tracking-[0.08em] uppercase text-stone">Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {turn.pages.map((p, i) => <SourceChip key={`${p.docId}#${p.pageNum}`} page={p} onClick={() => onSource({ pages: turn.pages, index: i })} />)}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3.5 text-stone">
                <button
                  onClick={() => { navigator.clipboard.writeText(turn.answer ?? ""); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                  className="hover:text-ink" aria-label="Copy answer"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" strokeWidth={1.5} />}
                </button>
                {turn.totalTimeMs != null && <span className="font-mono text-[12px]">{turn.pages.length} pages · {(turn.totalTimeMs / 1000).toFixed(1)} s</span>}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function SourceChip({ page, onClick }: { page: PageRef; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-[10px] bg-white border border-sand hover:border-ink transition-colors text-left">
      <span className="min-w-5 h-5 px-1 rounded-md bg-sand-tint font-mono text-[12px] text-slate grid place-items-center">{page.rank}</span>
      <PageThumb page={page} className="w-7 h-9" />
      <span>
        <span className="block text-[13px] leading-[18px] font-medium">{page.fileName.replace(/\.pdf$/i, "")}</span>
        <span className="block text-[12px] leading-4 text-stone">Page {page.pageNum}</span>
      </span>
    </button>
  );
}

function PageThumb({ page, className }: { page: PageRef; className: string }) {
  const src = usePageImage(page);
  return (
    <span className={`${className} shrink-0 rounded-[3px] border border-sand bg-white overflow-hidden`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && <img src={src} alt="" className="w-full h-full object-cover object-top" />}
    </span>
  );
}

function usePageImage(page: PageRef) {
  const key = `${page.docId}#${page.pageNum}`;
  const [loaded, setLoaded] = useState<{ key: string; src: string | null } | null>(null);
  useEffect(() => {
    let live = true;
    pageImage(page).then((src) => live && setLoaded({ key, src }));
    return () => { live = false; };
  }, [page, key]);
  return loaded?.key === key ? loaded.src : null;
}

// MARK: - Source page panel

function SourcePanel({ selection, onChange, onClose }: { selection: Selection; onChange: (s: Selection) => void; onClose: () => void }) {
  const page = selection.pages[selection.index];
  const src = usePageImage(page);
  const go = (d: number) => onChange({ ...selection, index: Math.min(selection.pages.length - 1, Math.max(0, selection.index + d)) });

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <div className="fixed inset-0 z-30 bg-ink/40 xl:hidden" onClick={onClose} />
      <aside className="fixed xl:static z-40 inset-y-0 right-0 w-[min(440px,100vw)] xl:w-[400px] shrink-0 bg-snow border-l border-sand flex flex-col gap-4 px-6 pt-4 pb-6">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium truncate">{page.fileName}</p>
            <p className="text-[12px] text-stone">Page {page.pageNum} · Source {selection.index + 1} of {selection.pages.length}</p>
          </div>
          <button onClick={onClose} className="size-8 grid place-items-center rounded-lg text-stone hover:text-ink hover:bg-sand-tint" aria-label="Close source"><X className="size-5" strokeWidth={1.5} /></button>
        </div>
        <div className="flex-1 min-h-0 overflow-auto rounded border border-sand bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {src ? <a href={src} target="_blank" rel="noreferrer" title="Open full size"><img src={src} alt={`${page.fileName}, page ${page.pageNum}`} className="w-full h-auto" /></a> : <div className="h-full grid place-items-center text-[13px] text-stone">Page image not available</div>}
        </div>
        <div className="flex items-center justify-between">
          <button onClick={() => go(-1)} disabled={selection.index === 0} className="size-8 grid place-items-center rounded-lg bg-white border border-sand disabled:opacity-40" aria-label="Previous source"><ChevronLeft className="size-4" /></button>
          <div className="flex gap-1.5">
            {selection.pages.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === selection.index ? "w-[18px] bg-ink" : "w-1.5 bg-mist"}`} />)}
          </div>
          <button onClick={() => go(1)} disabled={selection.index === selection.pages.length - 1} className="size-8 grid place-items-center rounded-lg bg-white border border-sand disabled:opacity-40" aria-label="Next source"><ChevronRight className="size-4" /></button>
        </div>
      </aside>
    </>
  );
}

// MARK: - Composer

function Composer({ placeholder = "Ask anything about your documents…", autoFocus }: { placeholder?: string; autoFocus?: boolean }) {
  const { ask, sending, selectedStore, active } = useApp();
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const storeName = active?.storeName ?? selectedStore?.name;
  const canSend = !!text.trim() && !sending && (!!active || !!selectedStore);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [text]);

  function send() {
    if (!canSend) return;
    const q = text;
    setText("");
    ref.current?.blur();
    ask(q);
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="rounded-[18px] bg-white border border-mist shadow-[0_8px_24px_-4px_rgba(30,30,30,0.06)] pl-[18px] pr-3 pt-4 pb-3 focus-within:border-ink transition-colors">
      <textarea
        ref={ref}
        rows={1}
        value={text}
        autoFocus={autoFocus}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKey}
        placeholder={placeholder}
        className="w-full resize-none bg-transparent outline-none text-[16px] leading-[26px] placeholder:text-stone"
      />
      <div className="flex items-center gap-2 mt-3">
        {storeName && (
          <span className="inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-full bg-snow border border-sand text-[13px] font-medium text-ink-700">
            <BookOpen className="size-4 text-slate" strokeWidth={1.5} /> {storeName}
          </span>
        )}
        <span className="flex-1" />
        <button onClick={send} disabled={!canSend} className="size-9 rounded-full bg-ink text-white grid place-items-center disabled:opacity-30 transition-opacity" aria-label="Send">
          <ArrowUp className="size-[18px]" />
        </button>
      </div>
    </div>
  );
}
