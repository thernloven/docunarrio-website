"use client";

import { ChevronRight, Clock, FileText, MoreHorizontal, Pencil, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "@/components/app/AppProvider";
import Modal from "@/components/app/Modal";
import { Button, Checkbox, Field, Progress, StatusBadge, type BadgeState } from "@/components/app/ui";
import { api } from "@/lib/dn/client";
import type { Store, StoreStatus } from "@/lib/dn/types";

type EngineDoc = StoreStatus["documents"][string];

const fmtSize = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);
const fmtDate = (s: string) => new Date(s).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

function badge(d?: EngineDoc): { state: BadgeState; text: string; progress?: number } {
  if (!d) return { state: "queued", text: "Waiting" };
  switch (d.status) {
    case "completed": return { state: "completed", text: "Indexed" };
    case "error": return { state: "error", text: "Failed" };
    case "queued": return { state: "queued", text: "Queued" };
    default: {
      const p = d.page_count ? d.pages_done / d.page_count : 0;
      return { state: "processing", text: `Indexing ${Math.round(p * 100)}%`, progress: p };
    }
  }
}

export default function LibraryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { reloadLibraries } = useApp();
  const [store, setStore] = useState<Store | null>(null);
  const [status, setStatus] = useState<StoreStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [busyDoc, setBusyDoc] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [s, st] = await Promise.all([api<Store>("store/get", { id }), api<StoreStatus>("store/v2/store_status", { storeId: id }).catch(() => null)]);
      setStore(s);
      setStatus(st);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // Poll every 2 s while anything is still being indexed (as the API suggests).
  const indexing = Object.values(status?.documents ?? {}).some((d) => d.status !== "completed" && d.status !== "error");
  const docsWithoutStatus = (store?.documents ?? []).some((d) => !status?.documents?.[d.fileId]);
  useEffect(() => {
    if (!indexing && !docsWithoutStatus) return;
    const t = setInterval(async () => {
      const st = await api<StoreStatus>("store/v2/store_status", { storeId: id }).catch(() => null);
      if (st) setStatus(st);
    }, 2000);
    return () => clearInterval(t);
  }, [indexing, docsWithoutStatus, id]);

  const docs = store?.documents ?? [];
  const engine = status?.documents ?? {};
  const pages = Object.values(engine).reduce((n, d) => n + (d.page_count || 0), 0);
  const done = Object.values(engine).reduce((n, d) => n + (d.pages_done || 0), 0);

  async function deleteDoc(fileId: string, name: string) {
    setMenu(null);
    if (!confirm(`Remove “${name}” from this library? It will no longer be used in answers.`)) return;
    setBusyDoc(fileId);
    try {
      await api("store/v2/delete_doc", { storeId: id, fileId });
      await load();
      reloadLibraries();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusyDoc(null);
    }
  }

  async function deleteLibrary() {
    if (!store) return;
    if (docs.length) { alert("Remove every document from this library before deleting it."); return; }
    if (!confirm(`Delete the library “${store.name}”?`)) return;
    try {
      await api("store/delete", { id });
      await reloadLibraries();
      router.push("/app/libraries");
    } catch (e) {
      alert((e as Error).message);
    }
  }

  if (error && !store) {
    return <div className="flex-1 grid place-items-center text-[14px] text-stone px-6 text-center">{error}</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 lg:px-12 py-10 space-y-7 max-w-[1200px]">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[260px] space-y-2">
            <p className="flex items-center gap-1.5 text-[13px] font-medium">
              <Link href="/app/libraries" className="text-stone hover:text-ink">Libraries</Link>
              <ChevronRight className="size-3.5 text-stone" />
              <span>{store?.name ?? "…"}</span>
            </p>
            <h1 className="font-display text-[32px] leading-10 font-semibold tracking-[-0.015em]">{store?.name ?? " "}</h1>
            <p className="text-[16px] leading-[26px] text-stone">{store?.description || "No description"}</p>
          </div>
          <Button kind="secondary" size="md" onClick={() => setEditing(true)} disabled={!store}><Pencil className="size-4" strokeWidth={1.5} /> Edit</Button>
          <Button size="md" onClick={() => setUploading(true)} disabled={!store}><Upload className="size-4" strokeWidth={1.5} /> Upload documents</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Documents" value={String(docs.length)} sub={indexing ? "Some still indexing" : "All processed"} />
          <Stat label="Pages" value={pages.toLocaleString()} sub={`${done.toLocaleString()} searchable`} />
          <Stat label="Index progress" value={pages ? `${Math.round((done / pages) * 100)}%` : "—"} bar={pages ? done / pages : 0} />
          <Stat label="Engine" value={status?.engine ? "ColPali" : "—"} sub={status?.model?.split("/").at(-1) ?? ""} />
        </div>

        <div className="rounded-[14px] bg-white border border-sand overflow-x-auto">
          <table className="w-full min-w-[760px] text-[14px]">
            <thead>
              <tr className="bg-snow text-left text-[12px] text-stone">
                <th className="font-normal pl-5 py-2.5">Document</th>
                <th className="font-normal w-[90px]">Version</th>
                <th className="font-normal w-[100px]">Pages</th>
                <th className="font-normal w-[90px]">Size</th>
                <th className="font-normal w-[170px]">Uploaded</th>
                <th className="font-normal w-[150px]">Status</th>
                <th className="w-[48px]" />
              </tr>
            </thead>
            <tbody>
              {docs.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-stone border-t border-sand">No documents yet. Upload PDFs to start answering questions from them.</td></tr>
              )}
              {docs.map((d) => {
                const e = engine[d.fileId];
                const b = badge(e);
                return (
                  <tr key={d.id} className={`border-t border-sand ${busyDoc === d.fileId ? "opacity-50" : ""}`}>
                    <td className="pl-5 py-3.5">
                      <span className="flex items-center gap-3">
                        <span className="size-9 rounded-lg bg-snow border border-sand grid place-items-center shrink-0"><FileText className="size-[18px] text-slate" strokeWidth={1.5} /></span>
                        <span className="min-w-0">
                          <span className="block font-medium truncate">{d.fileName}</span>
                          <span className="block text-[12px] text-stone truncate">{d.fileDescription || "—"}</span>
                        </span>
                      </span>
                    </td>
                    <td className="text-ink-700">{d.fileVersion}</td>
                    <td className="text-ink-700 tabular-nums">{e ? (e.status === "completed" ? e.page_count : `${e.pages_done} / ${e.page_count || "…"}`) : "—"}</td>
                    <td className="text-ink-700 tabular-nums">{fmtSize(d.fileSize)}</td>
                    <td className="text-ink-700">{fmtDate(d.fileUploadedTime)}</td>
                    <td>
                      <span className="flex flex-col gap-1.5 w-[120px]" title={e?.error ?? undefined}>
                        <StatusBadge state={b.state}>{b.text}</StatusBadge>
                        {b.progress != null && <Progress value={b.progress} />}
                      </span>
                    </td>
                    <td className="relative pr-3">
                      <button onClick={() => setMenu(menu === d.fileId ? null : d.fileId)} className="size-8 grid place-items-center rounded-lg text-stone hover:text-ink hover:bg-sand-tint" aria-label="Document actions">
                        <MoreHorizontal className="size-[18px]" />
                      </button>
                      {menu === d.fileId && (
                        <div className="absolute right-3 top-11 z-10 w-44 p-1.5 rounded-xl bg-white border border-sand shadow-[0_12px_32px_-8px_rgba(30,30,30,0.18)]">
                          <button onClick={() => deleteDoc(d.fileId, d.fileName)} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[14px] text-danger hover:bg-burgundy-soft">
                            <Trash2 className="size-4" /> Remove document
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2.5 rounded-[10px] bg-sand-tint px-3.5 py-3 text-[14px] text-ink-700">
          <Clock className="size-[18px] text-slate shrink-0" strokeWidth={1.5} />
          New documents become searchable page by page. Your team can already ask about pages that are indexed.
        </div>

        <div className="pt-4">
          <button onClick={deleteLibrary} className="text-[13px] text-stone hover:text-danger">Delete this library</button>
        </div>
      </div>

      {uploading && store && <UploadModal store={store} onClose={() => setUploading(false)} onUploaded={() => { load(); reloadLibraries(); }} />}
      {editing && store && <EditModal store={store} onClose={() => setEditing(false)} onSaved={(s) => { setStore(s); reloadLibraries(); }} />}
    </div>
  );
}

function Stat({ label, value, sub, bar }: { label: string; value: string; sub?: string; bar?: number }) {
  return (
    <div className="rounded-[14px] bg-snow border border-sand px-[18px] py-4 space-y-1.5">
      <p className="text-[12px] text-stone">{label}</p>
      <p className="font-display text-[24px] leading-8 font-semibold">{value}</p>
      {bar != null ? <div className="pt-1"><Progress value={bar} /></div> : <p className="text-[12px] text-stone truncate">{sub}</p>}
    </div>
  );
}

function UploadModal({ store, onClose, onUploaded }: { store: Store; onClose: () => void; onUploaded: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [overwrite, setOverwrite] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function pick(f?: File | null) {
    if (!f) return;
    setFile(f);
    setError(null);
    // Suggest a version from names like "OM-A Rev03.pdf".
    const rev = f.name.match(/\b(rev\s?\d+[a-z]?)\b/i)?.[1];
    if (rev && !version) setVersion(rev.replace(/\s/, ""));
  }

  async function upload() {
    if (!file) return;
    setBusy(true);
    setError(null);
    const form = new FormData();
    form.append("file", file, file.name);
    form.append("StoreId", store.id);
    form.append("fileDescription", description.trim());
    form.append("fileVersion", version.trim());
    form.append("Action", "1");
    form.append("Overwrite", String(overwrite));
    try {
      const res = await api<{ status: string; message?: string }>("store/v2/uploadfile", {}, { form });
      if (res.status === "skipped") {
        setError("A document with this file name is already in the library. Turn on “Replace” to upload it again.");
        setBusy(false);
        return;
      }
      onUploaded();
      onClose();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <Modal
      title="Upload documents"
      subtitle={`Add to ${store.name}. Indexing runs in the background.`}
      onClose={onClose}
      footer={<><Button kind="ghost" size="md" onClick={onClose}>Cancel</Button><Button size="md" busy={busy} disabled={!file || !description.trim() || !version.trim()} onClick={upload}>Upload and index</Button></>}
    >
      <input ref={input} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]); }}
        className={`w-full flex items-center gap-3.5 rounded-xl border-[1.5px] border-dashed px-4 py-3.5 text-left transition-colors ${dragging ? "border-ink bg-sand-tint" : "border-mist bg-snow hover:border-stone"}`}
      >
        <span className="size-10 rounded-[10px] bg-white border border-sand grid place-items-center shrink-0">{file ? <FileText className="size-5" strokeWidth={1.5} /> : <Upload className="size-5" strokeWidth={1.5} />}</span>
        <span className="flex-1 min-w-0">
          <span className="block text-[14px] font-medium truncate">{file ? file.name : "Drop a PDF here or browse"}</span>
          <span className="block text-[12px] text-stone">{file ? `${fmtSize(file.size)} · ready to upload` : "Scanned pages are fine"}</span>
        </span>
        {file && <span className="text-[13px] font-medium text-slate">Replace</span>}
      </button>
      <Field label="Description" placeholder="e.g. Operations manual part A" value={description} onChange={(e) => setDescription(e.target.value)} hint="Shown to your team next to sources" />
      <Field label="Version" placeholder="e.g. Rev03" value={version} onChange={(e) => setVersion(e.target.value)} />
      <Checkbox checked={overwrite} onChange={setOverwrite} label="Replace if a file with the same name exists" />
      {error && <p className="text-[13px] text-danger">{error}</p>}
    </Modal>
  );
}

function EditModal({ store, onClose, onSaved }: { store: Store; onClose: () => void; onSaved: (s: Store) => void }) {
  const [name, setName] = useState(store.name);
  const [description, setDescription] = useState(store.description ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    try {
      const s = await api<Store>("store/update", { id: store.id, name: name.trim(), description: description.trim() });
      onSaved({ ...store, ...s, documents: store.documents });
      onClose();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <Modal
      title="Edit library"
      onClose={onClose}
      footer={<><Button kind="ghost" size="md" onClick={onClose}>Cancel</Button><Button size="md" busy={busy} disabled={!name.trim()} onClick={save}>Save</Button></>}
    >
      <div className="space-y-4">
        <Field label="Name" value={name} onChange={(e) => { setName(e.target.value); setError(null); }} error={error} autoFocus />
        <Field label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
    </Modal>
  );
}
