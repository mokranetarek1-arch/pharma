"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pressable } from "@/components/ui/motion";

type Tone = "blue" | "emerald" | "amber";

const toneClasses: Record<Tone, { idle: string; active: string; title: string; text: string; badge: string }> = {
  blue: {
    idle: "border-blue-100 bg-blue-50 hover:border-blue-200",
    active: "border-blue-300 bg-blue-100 ring-2 ring-blue-200 shadow-[0_12px_30px_rgba(59,130,246,0.18)]",
    title: "text-blue-900",
    text: "text-blue-700",
    badge: "bg-white text-blue-700 border border-blue-200"
  },
  emerald: {
    idle: "border-emerald-100 bg-emerald-50 hover:border-emerald-200",
    active: "border-emerald-300 bg-emerald-100 ring-2 ring-emerald-200 shadow-[0_12px_30px_rgba(16,185,129,0.16)]",
    title: "text-emerald-900",
    text: "text-emerald-700",
    badge: "bg-white text-emerald-700 border border-emerald-200"
  },
  amber: {
    idle: "border-amber-100 bg-amber-50 hover:border-amber-200",
    active: "border-amber-300 bg-amber-100 ring-2 ring-amber-200 shadow-[0_12px_30px_rgba(245,158,11,0.16)]",
    title: "text-amber-900",
    text: "text-amber-700",
    badge: "bg-white text-amber-700 border border-amber-200"
  }
};

export function DashboardShortcutCard({ href, title, text, cta, tone = "blue", exact = true }: { href: string; title: string; text: string; cta: string; tone?: Tone; exact?: boolean }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);
  const toneSet = toneClasses[tone];

  return (
    <Pressable>
      <Link href={href} className={`interactive-card block rounded-[1rem] border p-4 transition ${active ? toneSet.active : toneSet.idle}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`font-semibold ${toneSet.title}`}>{title}</p>
            <p className={`mt-2 text-xs leading-6 ${toneSet.text}`}>{text}</p>
          </div>
          {active ? <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${toneSet.badge}`}>Actuel</span> : null}
        </div>
        <p className={`mt-4 text-sm font-semibold ${toneSet.title}`}>{cta}</p>
      </Link>
    </Pressable>
  );
}
