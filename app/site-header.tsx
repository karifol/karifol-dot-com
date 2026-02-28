"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BREADCRUMBS: { match: string; label: string; href: string }[] = [
  { match: "/jobnyaha_ai/chat",  label: "会話する",           href: "/jobnyaha_ai/chat" },
  { match: "/jobnyaha_ai/train", label: "育てる",             href: "/jobnyaha_ai/train" },
  { match: "/jobnyaha_ai",       label: "じょぶにゃは えーあい", href: "/jobnyaha_ai" },
];

export function SiteHeader() {
  const pathname = usePathname();

  const crumbs = BREADCRUMBS.filter(b => pathname.startsWith(b.match))
    .sort((a, b) => a.match.length - b.match.length);

  return (
    <header className="flex items-center gap-1.5 px-4 py-3 shrink-0">
      <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity shrink-0">
        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
          <img src="/karifol.png" alt="karifol" className="w-full h-full object-cover" />
        </div>
        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">karifol</span>
      </Link>
      {crumbs.map(crumb => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <span className="text-zinc-100 text-xs">/</span>
          <Link
            href={crumb.href}
            className="text-xs text-zinc-100 hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            {crumb.label}
          </Link>
        </span>
      ))}
    </header>
  );
}
