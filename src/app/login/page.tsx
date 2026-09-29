import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/dn/server";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in — Docunarrio" };

export default async function LoginPage() {
  if (await readSession()) redirect("/app");
  return <LoginForm />;
}
