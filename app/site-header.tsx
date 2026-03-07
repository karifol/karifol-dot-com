"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BREADCRUMB_MATCHERS: { match: string; label: string; href: string; exact?: boolean }[] = [
  { match: "/jobnyaha_ai/chat", label: "会話する", href: "/jobnyaha_ai/chat", exact: true },
  { match: "/jobnyaha_ai/train", label: "育てる", href: "/jobnyaha_ai/train", exact: true },
  { match: "/jobnyaha_ai", label: "じょぶにゃは えーあい", href: "/jobnyaha_ai", exact: true },
];

type Crumb = {
  label: string;
  href: string;
};

export function SiteHeader() {
  const pathname = usePathname();
  const crumbs: Crumb[] = [];

  if (pathname.startsWith("/jobnyaha_ai")) {
    crumbs.push({ label: "じょぶにゃは えーあい", href: "/jobnyaha_ai" });
    if (pathname === "/jobnyaha_ai/chat") {
      crumbs.push({ label: "会話する", href: "/jobnyaha_ai/chat" });
    }
    if (pathname === "/jobnyaha_ai/train") {
      crumbs.push({ label: "育てる", href: "/jobnyaha_ai/train" });
    }
  } else {
    const matched = BREADCRUMB_MATCHERS.find((crumb) =>
      crumb.exact ? pathname === crumb.match : pathname.startsWith(crumb.match),
    );
    if (matched) {
      crumbs.push({ label: matched.label, href: matched.href });
    }
  }

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-50 p-4 sm:p-5">
      <header className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white/80 px-3 py-2 shadow-sm backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/75">
        <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity shrink-0">
          <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
            <img src="/karifol.png" alt="karifol" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">karifol</span>
        </Link>
        {crumbs.map((crumb) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            <span className="text-zinc-400 text-xs">/</span>
            <Link
              href={crumb.href}
              className="text-xs text-zinc-500 hover:opacity-70 transition-opacity whitespace-nowrap dark:text-zinc-300"
            >
              {crumb.label}
            </Link>
          </span>
        ))}
      </header>
    </div>
  );
}
