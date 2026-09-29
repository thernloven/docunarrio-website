import type { Metadata } from "next";
import Onboarding from "./Onboarding";

export const metadata: Metadata = { title: "Set up your company — Docunarrio" };

export default function AdminPage() {
  return <Onboarding />;
}
