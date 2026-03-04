"use client";

import { useState } from "react";
import Link from "next/link";

export default function JobnyahaAITestTop() {
  const [hovered, setHovered] = useState<"chat" | "train" | null>(null);

  // 斜めの角度を強めに: 左上70% → 左下20% のライン
  // ホバー時にそのラインが左右にずれる
  const chatClip =
    hovered === "train"
      ? "polygon(0 0, 58% 0, 8% 100%, 0 100%)"
      : hovered === "chat"
        ? "polygon(0 0, 82% 0, 32% 100%, 0 100%)"
        : "polygon(0 0, 70% 0, 20% 100%, 0 100%)";

  const trainClip =
    hovered === "train"
      ? "polygon(58% 0, 100% 0, 100% 100%, 8% 100%)"
      : hovered === "chat"
        ? "polygon(82% 0, 100% 0, 100% 100%, 32% 100%)"
        : "polygon(70% 0, 100% 0, 100% 100%, 20% 100%)";

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none">
      {/* ===== 左側: 会話する ===== */}
      <Link
        href="/jobnyaha_ai/chat"
        className="absolute inset-0 z-10"
        style={{
          clipPath: chatClip,
          transition: "clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onMouseEnter={() => setHovered("chat")}
        onMouseLeave={() => setHovered(null)}
      >
        {/* 背景 */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            backgroundImage: "url('/jobnyaha-overlay.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center left",
            filter:
              hovered === "chat"
                ? "brightness(0.5) saturate(1.2)"
                : "brightness(0.3) saturate(0.8)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-rose-400/40 to-amber-300/30" />

        {/* コンテンツ - 左寄りに配置 */}
        <div className="relative z-10 flex h-full items-center" style={{ paddingLeft: "15%" }}>
          <div
            className="flex flex-col items-center gap-4 transition-all duration-500"
            style={{
              opacity: hovered === "train" ? 0.5 : 1,
              transform: hovered === "chat" ? "scale(1.05)" : "scale(1)",
            }}
          >
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-white/80">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>
            <h2 className="text-3xl font-light tracking-[0.15em] text-white/90">会話する</h2>
            <p className="text-sm text-white/40 tracking-wider">じょぶにゃはとおしゃべりする</p>
          </div>
        </div>
      </Link>

      {/* ===== 右側: 育てる ===== */}
      <Link
        href="/jobnyaha_ai/train"
        className="absolute inset-0 z-10"
        style={{
          clipPath: trainClip,
          transition: "clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onMouseEnter={() => setHovered("train")}
        onMouseLeave={() => setHovered(null)}
      >
        {/* 背景 */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            backgroundImage: "url('/jobnyaha-overlay.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center right",
            filter:
              hovered === "train"
                ? "brightness(0.5) saturate(1.2)"
                : "brightness(0.3) saturate(0.8)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-sky-300/35 to-violet-400/30" />

        {/* コンテンツ - 右寄りに配置 */}
        <div className="relative z-10 flex h-full items-center justify-end" style={{ paddingRight: "15%" }}>
          <div
            className="flex flex-col items-center gap-4 transition-all duration-500"
            style={{
              opacity: hovered === "chat" ? 0.5 : 1,
              transform: hovered === "train" ? "scale(1.05)" : "scale(1)",
            }}
          >
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-white/80">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
            </div>
            <h2 className="text-3xl font-light tracking-[0.15em] text-white/90">育てる</h2>
            <p className="text-sm text-white/40 tracking-wider">AIにじょぶにゃはを教える</p>
          </div>
        </div>
      </Link>

      {/* ===== 中央タイトル ===== */}
      <div className="absolute inset-0 z-30 pointer-events-none flex items-start justify-center pt-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/20 shadow-2xl">
            <img src="/jobnyaha.jpg" alt="じょぶにゃは えーあい" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-light tracking-[0.2em] text-white/90 drop-shadow-lg flex items-baseline gap-2">
            じょぶにゃは<span className="text-sm tracking-[0.3em] text-white/30 uppercase">AI</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
