"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode, type MouseEvent } from "react";

export function NavOverlay({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [target, setTarget] = useState<string | null>(null);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest("a[href]");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href || target) return;

    e.preventDefault();
    setTarget(href);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        transition: "opacity 0.8s ease",
        opacity: target ? 0 : 1,
      }}
      onTransitionEnd={() => {
        if (target) router.push(target);
      }}
    >
      {children}
    </div>
  );
}
