"use client";

import { useEffect, useState, type ReactNode } from "react";

export function FadeIn({ children, duration = 800, className }: { children: ReactNode; duration?: number; className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className={className}
      style={{
        transition: `opacity ${duration}ms ease`,
        opacity: visible ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
