"use client";

import { BookOpen, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/components/app/AppProvider";
import Modal from "@/components/app/Modal";
import { Button, Field } from "@/components/app/ui";
import { api } from "@/lib/dn/client";
import { EMPTY_GUID, type Store } from "@/lib/dn/types";

export default function LibrariesPage() {
  const { stores, libraries, reloadLibraries, admin } = useApp();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const shown = stores.filter((s) => `${s.name} ${s.description ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  const docCount = stores.reduce((n, s) => n + (s.documents?.length ?? 0), 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 lg:px-12 py-10 space-y-7 max-w-[1200px]">
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <h1 className="font-display text-[32px] leading-10 font-semibold tracking-[-0.015em]">Libraries</h1>
            <p className="text-[16px] leading-[26px] text-stone">Each library is a private collection your team can ask questions about.</p>
          </div>
          {admin && <Button size="md" onClick={() => setCreating(true)}><Plus className="size-4" /> New library</Button>}
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2.5 w-full max-w-[360px] h-10 px-3.5 rounded-[10px] bg-white border border-mist focus-within:border-ink">
            <Search className="size-[18px] text-stone" strokeWidth={1.5} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search libraries" className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-stone" />
          </label>
          <span className="flex-1" />
          <p className="hidden md:block text-[14px] text-stone">{stores.length} librar{stores.length === 1 ? "y" : "ies"} · {docCount} document{docCount === 1 ? "" : "s"}</p>
        </div>

        {libraries.status === "failed" && (
          <div className="rounded-xl bg-sand-tint px-4 py-3.5 text-[14px] text-ink-700 flex items-center justify-between">
            {libraries.message}
            <button onClick={reloadLibraries} className="font-medium text-ink">Try again</button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {libraries.status === "loading" && [0, 1, 2].map((i) => <div key={i} className="h-[178px] rounded-2xl bg-snow border border-sand dn-pulse" />)}
          {shown.map((s) => <LibraryCard key={s.id} store={s} />)}
          {admin && libraries.status === "loaded" && (
            <button onClick={() => setCreating(true)} className="min-h-[178px] rounded-2xl bg-snow border-[1.5px] border-dashed border-mist grid place-items-center hover:border-stone transition-colors">
              <span className="flex flex-col items-center gap-2.5">
                <span className="size-10 rounded-full bg-white border border-sand grid place-items-center"><Plus className="size-5" /></span>
                <span className="text-[14px] font-medium">New library</span>
                <span className="text-[12px] text-stone">Group documents by team or topic</span>
              </span>
            </button>
          )}
        </div>
      </div>
      {creating && <NewLibrary onClose={() => setCreating(false)} />}
    </div>
  );
}

function LibraryCard({ store }: { store: Store }) {
  const n = store.documents?.length ?? 0;
  const latest = (store.documents ?? []).map((d) => d.fileUploadedTime).sort().at(-1);
  return (
    <Link href={`/app/libraries/${store.id}`} className="rounded-2xl bg-white border border-sand hover:border-mist p-5 pb-[18px] flex flex-col gap-4 transition-colors">
      <span className="size-10 rounded-[10px] bg-snow border border-sand grid place-items-center"><BookOpen className="size-5" strokeWidth={1.5} /></span>
      <span className="space-y-1 flex-1">
        <span className="block font-display text-[18px] leading-[26px] font-medium">{store.name}</span>
        <span className="block text-[14px] leading-[22px] text-stone line-clamp-2">{store.description || "No description"}</span>
      </span>
      <span className="flex items-center justify-between pt-3.5 border-t border-sand text-[12px]">
        <span className="text-ink-700">{n} document{n === 1 ? "" : "s"}</span>
        {latest && <span className="text-stone">Updated {new Date(latest).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span>}
      </span>
    </Link>
  );
}

function NewLibrary({ onClose }: { onClose: () => void }) {
  const { reloadLibraries } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const store = await api<Store>("store/update", { id: EMPTY_GUID, name: name.trim(), description: description.trim() });
      await reloadLibraries();
      router.push(`/app/libraries/${store.id}`);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <Modal
      title="New library"
      subtitle="Group documents your team should be able to ask about together."
      onClose={onClose}
      footer={<><Button kind="ghost" size="md" onClick={onClose}>Cancel</Button><Button size="md" busy={busy} disabled={!name.trim()} onClick={create}>Create library</Button></>}
    >
      <div className="space-y-4">
        <Field label="Name" placeholder="e.g. Flight Operations" value={name} onChange={(e) => { setName(e.target.value); setError(null); }} error={error} autoFocus />
        <Field label="Description" placeholder="What belongs in this library?" value={description} onChange={(e) => setDescription(e.target.value)} hint="Optional" />
      </div>
    </Modal>
  );
}
