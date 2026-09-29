import { NextResponse } from "next/server";
import { clearSession } from "@/lib/dn/server";

export async function POST() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
