"use client";

import { BookOpen, ChevronDown, Check, LogOut, Menu, MessageSquare, SquarePen, Trash2, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { logout } from "@/lib/dn/client";
import { roleName } from "@/lib/dn/types";
import { useApp } from "./AppProvider";
import { Lockup } from "./Logo";

// Figma: Web — App sidebar (264 px, Snow, hairline right).
export default function AppShell({ children }: { children: ReactNode }) {
  // Open for one route only: navigating closes it without an effect.
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const mobileOpen = openOn === pathname;
  const setMobileOpen = (v: boolean) => setOpenOn(v ? pathname : null);

  return (
    <div className="flex h-dvh bg-white text-ink overflow-hidden">
      <div className={`fixed inset-0 z-40 bg-ink/40 lg:hidden transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setMobileOpen(false)} />
      <aside
        className={`fixed lg:static z-50 inset-y-0 left-0 w-[264px] shrink-0 bg-snow border-r border-sand flex flex-col transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar onClose={() => setMobileOpen(false)} />
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden flex items-center gap-3 h-14 px-3 border-b border-sand">
          <button onClick={() => setMobileOpen(true)} className="size-10 grid place-items-center rounded-lg hover:bg-sand-tint" aria-label="Open menu">
            <Menu className="size-5" strokeWidth={1.5} />
          </button>
          <Lockup height={18} className="text-ink" />
        </div>
        {children}
      </div>
    </div>
  );
}

function Sidebar({ onClose }: { onClose: () => void }) {
  const { user, admin, conversations, active, openConversation, deleteConversation } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const nav = [
    { href: "/app", label: "Chat", icon: MessageSquare, show: true },
    { href: "/app/libraries", label: "Libraries", icon: BookOpen, show: admin },
    { href: "/app/team", label: "Team", icon: Users, show: true },
  ];
  const isActive = (href: string) => (href === "/app" ? pathname === "/app" : pathname.startsWith(href));

  function newChat() {
    openConversation(null);
    router.push("/app");
  }

  return (
    <div className="flex flex-col h-full px-4 pt-[22px] pb-4 gap-5">
      <div className="flex items-center justify-between pl-2">
        <Link href="/app" onClick={() => openConversation(null)}><Lockup height={20} className="text-ink" /></Link>
        <button onClick={onClose} className="lg:hidden size-8 grid place-items-center rounded-lg hover:bg-sand-tint" aria-label="Close menu"><X className="size-4" /></button>
      </div>

      <button onClick={newChat} className="h-10 rounded-[10px] bg-white border border-mist text-[14px] font-medium hover:bg-sand-tint inline-flex items-center justify-center gap-2">
        <SquarePen className="size-4" strokeWidth={1.5} /> New chat
      </button>

      <LibrarySwitcher />

      <nav className="flex flex-col gap-0.5">
        {nav.filter((n) => n.show).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-[14px] ${isActive(href) ? "bg-white border border-sand font-medium text-ink" : "text-ink-700 hover:bg-sand-tint border border-transparent"}`}
          >
            <Icon className={`size-[18px] ${isActive(href) ? "text-ink" : "text-stone"}`} strokeWidth={1.5} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex-1 min-h-0 flex flex-col">
        <p className="px-2.5 pb-1.5 text-[11px] leading-[14px] font-semibold tracking-[0.08em] uppercase text-stone">Recent</p>
        <div className="flex-1 overflow-y-auto -mx-1 px-1">
          {conversations.length === 0 && <p className="px-2.5 py-2 text-[13px] text-stone">Your conversations will appear here.</p>}
          {conversations.map((c) => (
            <div key={c.id} className={`group flex items-center rounded-lg ${active?.id === c.id && pathname === "/app" ? "bg-sand-tint" : "hover:bg-sand-tint/70"}`}>
              <button
                onClick={() => { openConversation(c.id); router.push("/app"); onClose(); }}
                className="flex-1 min-w-0 text-left px-2.5 py-[7px] text-[14px] text-ink-700 truncate"
                title={c.title}
              >
                {c.title}
              </button>
              <button
                onClick={() => deleteConversation(c.id)}
                className="opacity-0 group-hover:opacity-100 size-7 mr-1 grid place-items-center rounded-md text-stone hover:text-danger"
                aria-label="Delete conversation"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2.5 px-2 py-2 rounded-[10px]">
        <span className="size-8 rounded-full bg-sand grid place-items-center text-[13px] font-medium text-slate shrink-0">
          {((user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "")).toUpperCase() || "·"}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium leading-[18px] truncate">{user ? `${user.firstName} ${user.lastName}` : "…"}</p>
          <p className="text-[12px] leading-4 text-stone truncate">{user ? `${roleName(user.role?.name)} · ${user.tenant?.name ?? ""}` : ""}</p>
        </div>
        <button onClick={logout} className="size-8 grid place-items-center rounded-lg text-stone hover:text-ink hover:bg-sand-tint" aria-label="Sign out" title="Sign out">
          <LogOut className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

function LibrarySwitcher() {
  const { stores, selectedStore, selectStore, libraries } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const pages = selectedStore?.documents?.length ?? 0;
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={stores.length === 0}
        className="w-full flex items-center gap-2.5 p-2.5 rounded-[10px] bg-white border border-sand text-left hover:border-mist disabled:opacity-60"
      >
        <span className="size-8 rounded-lg bg-ink grid place-items-center shrink-0"><BookOpen className="size-4 text-white" strokeWidth={1.5} /></span>
        <span className="flex-1 min-w-0">
          <span className="block text-[13px] font-medium leading-[18px] truncate">{selectedStore?.name ?? (libraries.status === "loading" ? "Loading…" : "No library")}</span>
          <span className="block text-[12px] leading-4 text-stone truncate">{selectedStore ? `${pages} document${pages === 1 ? "" : "s"}` : "—"}</span>
        </span>
        <ChevronDown className="size-4 text-stone" />
      </button>
      {open && (
        <div className="absolute z-20 left-0 right-0 mt-1.5 p-1.5 rounded-xl bg-white border border-sand shadow-[0_12px_32px_-8px_rgba(30,30,30,0.18)]">
          {stores.map((s) => (
            <button
              key={s.id}
              onClick={() => { selectStore(s.id); setOpen(false); router.push("/app"); }}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-[14px] hover:bg-sand-tint"
            >
              <span className="flex-1 truncate">{s.name}</span>
              {s.id === selectedStore?.id && <Check className="size-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
