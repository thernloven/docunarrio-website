import { cookies } from "next/headers";

// The DocuNarrio API has no CORS headers, so the browser never calls it
// directly: every call goes through this server, which keeps the tokens in
// httpOnly cookies and refreshes them when the API says `Token-Expired`.

export const API_BASE = process.env.DOCUNARRIO_API_URL ?? "https://piotcloud.se/api";

const ACCESS = "dn_at";
const REFRESH = "dn_rt";
const USER = "dn_uid";

type Session = { accessToken: string; refreshToken: string; userId: string };

type TokenResponse = {
  accessToken: string | null;
  refreshToken: string | null;
  user: { id: string } & Record<string, unknown> | null;
};

export async function readSession(): Promise<Session | null> {
  const jar = await cookies();
  const accessToken = jar.get(ACCESS)?.value;
  const refreshToken = jar.get(REFRESH)?.value;
  const userId = jar.get(USER)?.value;
  return accessToken && refreshToken && userId ? { accessToken, refreshToken, userId } : null;
}

export async function writeSession(s: Session, remember = true) {
  const jar = await cookies();
  const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    // "Keep me signed in": 30 days; otherwise a browser-session cookie.
    ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  };
  jar.set(ACCESS, s.accessToken, base);
  jar.set(REFRESH, s.refreshToken, base);
  jar.set(USER, s.userId, base);
}

export async function clearSession() {
  const jar = await cookies();
  for (const n of [ACCESS, REFRESH, USER]) jar.delete(n);
}

export function sessionFrom(tr: TokenResponse): Session | null {
  if (!tr.accessToken || !tr.refreshToken || !tr.user?.id) return null;
  return { accessToken: tr.accessToken, refreshToken: tr.refreshToken, userId: tr.user.id };
}

/** One API call with a given token. */
function send(path: string, init: { body: BodyInit; contentType?: string }, token?: string) {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (init.contentType) headers["Content-Type"] = init.contentType;
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(`${API_BASE}/${path}`, { method: "POST", headers, body: init.body, cache: "no-store" });
}

/**
 * An authenticated call. On `401` + `Token-Expired: true`, rotate the tokens
 * once and retry; any other 401 is final.
 */
export async function authed(path: string, init: { body: BodyInit; contentType?: string }) {
  const s = await readSession();
  if (!s) return new Response(JSON.stringify({ title: "SignedOut", status: 401, detail: "Sign in again." }), { status: 401, headers: { "Content-Type": "application/problem+json" } });

  let res = await send(path, init, s.accessToken);
  if (res.status === 401 && res.headers.get("Token-Expired")?.toLowerCase() === "true") {
    const refreshed = await send(
      "sys/account/refreshaccesstoken",
      { body: JSON.stringify({ userId: s.userId, expiredAccessToken: s.accessToken, refreshToken: s.refreshToken }), contentType: "application/json" },
    );
    const fresh = refreshed.ok ? sessionFrom(await refreshed.json()) : null;
    if (!fresh) {
      await clearSession();
      return new Response(JSON.stringify({ title: "SignedOut", status: 401, detail: "Your session has ended. Sign in again." }), { status: 401, headers: { "Content-Type": "application/problem+json" } });
    }
    await writeSession(fresh);
    res = await send(path, init, fresh.accessToken);
  }
  return res;
}
