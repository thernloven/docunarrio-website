import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppProvider from "@/components/app/AppProvider";
import AppShell from "@/components/app/AppShell";
import { readSession } from "@/lib/dn/server";

export const metadata: Metadata = { title: "Docunarrio" };

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!(await readSession())) redirect("/login");
  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}
