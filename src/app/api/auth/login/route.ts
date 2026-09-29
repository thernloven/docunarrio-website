import { NextResponse } from "next/server";
import { API_BASE, sessionFrom, writeSession } from "@/lib/dn/server";

export async function POST(request: Request) {
  const { email, password, remember } = await request.json().catch(() => ({}));
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return NextResponse.json({ title: "ValidationError", status: 400, detail: "Enter your email and password." }, { status: 400 });
  }

  const res = await fetch(`${API_BASE}/sys/account/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email: email.trim(), password }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return NextResponse.json(data ?? { title: "UnExpectedException", status: res.status, detail: "Couldn’t sign in. Try again." }, { status: res.status });
  }

  const session = sessionFrom(data);
  if (!session) return NextResponse.json({ title: "UnExpectedException", status: 502, detail: "Couldn’t sign in. Try again." }, { status: 502 });
  await writeSession(session, remember !== false);
  return NextResponse.json({ user: data.user });
}
