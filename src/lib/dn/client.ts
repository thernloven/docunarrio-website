"use client";

/** A failed API call. `code` is the Problem+JSON `title`; `message` is safe to show. */
export class ApiError extends Error {
  constructor(public code: string, message: string, public status: number) {
    super(message);
  }
}

const FRIENDLY: Record<string, string> = {
  LlmUnavailable: "The assistant is unavailable right now. Try again in a moment.",
  LlmNoChoices: "The assistant is unavailable right now. Try again in a moment.",
  UnExpectedException: "Something went wrong on our side. Try again.",
  StoreLocked: "Someone else is working on this library right now. Try again in a minute.",
  ThereAreDocumentsInStore: "Remove every document from this library before deleting it.",
  StoreNameExits: "A library with that name already exists.",
  UnAuthorized: "Your account doesn’t have access to this.",
};

async function toError(res: Response): Promise<ApiError> {
  const p = await res.json().catch(() => null);
  const code: string = p?.title ?? `HTTP${res.status}`;
  const detail: string = FRIENDLY[code] ?? p?.detail ?? `Something went wrong (${res.status}).`;
  return new ApiError(code, detail, res.status);
}

/** POST through the app's proxy. Signs out to /login when the session is gone. */
export async function api<T>(path: string, body: unknown = {}, init?: { form?: FormData; signal?: AbortSignal }): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/dn/${path}`, {
      method: "POST",
      headers: init?.form ? undefined : { "Content-Type": "application/json" },
      body: init?.form ?? JSON.stringify(body),
      signal: init?.signal,
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new ApiError("Network", "Couldn’t reach Docunarrio. Check your connection and try again.", 0);
  }
  if (!res.ok) {
    const err = await toError(res);
    if (err.code === "SignedOut" && typeof window !== "undefined") window.location.href = "/login";
    throw err;
  }
  return res.json() as Promise<T>;
}

export async function login(email: string, password: string, remember: boolean) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, remember }),
  }).catch(() => null);
  if (!res) throw new ApiError("Network", "Couldn’t reach Docunarrio. Check your connection and try again.", 0);
  if (!res.ok) throw await toError(res);
  return res.json();
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
  window.location.href = "/login";
}
