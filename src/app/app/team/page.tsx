"use client";

import { Mail } from "lucide-react";
import { useApp } from "@/components/app/AppProvider";
import { roleName } from "@/lib/dn/types";

// The API has no endpoints for listing members or sending invites yet, so
// this shows the signed-in account and what each role can do.
export default function TeamPage() {
  const { user } = useApp();
  const roles = [
    ["Admin", "Manage libraries, upload documents and invite people."],
    ["Analyst", "Chat, and follow how documents are indexing."],
    ["Member", "Ask questions and read the cited pages."],
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 lg:px-12 py-10 space-y-7 max-w-[1000px]">
        <div className="space-y-2">
          <h1 className="font-display text-[32px] leading-10 font-semibold tracking-[-0.015em]">Team</h1>
          <p className="text-[16px] leading-[26px] text-stone">Everyone here can sign in to {user?.tenant?.name ?? "your company"}’s workspace.</p>
        </div>

        <div className="rounded-[14px] bg-white border border-sand overflow-hidden">
          <div className="grid grid-cols-[1fr_150px_140px] bg-snow px-5 py-2.5 text-[12px] text-stone">
            <span>Name</span><span>Role</span><span>Status</span>
          </div>
          {user && (
            <div className="grid grid-cols-[1fr_150px_140px] items-center px-5 py-3.5 border-t border-sand text-[14px]">
              <span className="flex items-center gap-3 min-w-0">
                <span className="size-8 rounded-full bg-sand grid place-items-center text-[13px] font-medium text-slate shrink-0">{(user.firstName[0] ?? "") + (user.lastName[0] ?? "")}</span>
                <span className="min-w-0">
                  <span className="block font-medium truncate">{user.firstName} {user.lastName} <span className="text-stone font-normal">(you)</span></span>
                  <span className="block text-[12px] text-stone truncate">{user.email}</span>
                </span>
              </span>
              <span>{roleName(user.role?.name)}</span>
              <span className="flex items-center gap-1.5 text-ink-700"><span className="size-1.5 rounded-full bg-success" /> Active</span>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 rounded-[14px] bg-sand-tint px-4 py-4">
          <Mail className="size-5 text-slate shrink-0 mt-0.5" strokeWidth={1.5} />
          <div className="space-y-1">
            <p className="text-[14px] font-medium">Inviting people from here is coming soon</p>
            <p className="text-[14px] text-ink-700">Until then, send the names, emails and roles of the people you want to add to your Docunarrio contact and we’ll set them up.</p>
          </div>
        </div>

        <div className="rounded-[14px] border border-sand divide-y divide-sand">
          {roles.map(([r, d]) => (
            <div key={r} className="flex gap-4 px-4 py-3 text-[14px]"><span className="w-[84px] font-medium">{r}</span><span className="text-ink-700">{d}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}
