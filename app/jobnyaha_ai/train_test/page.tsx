"use client";

import { useState } from "react";
import Link from "next/link";

const sections = [
  {
    id: "words",
    label: "口癖",
    description: "一人称・語尾・フレーズを教える",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-white/80">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
    gradient: "bg-gradient-to-br from-rose-400/40 to-orange-300/30",
  },
  {
    id: "nature",
    label: "性格",
    description: "性格の度合いを5段階で伝える",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-white/80">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    gradient: "bg-gradient-to-br from-sky-300/35 to-violet-400/30",
  },
  {
    id: "episode",
    label: "エピソード",
    description: "思い出や出会いを自由に書く",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-white/80">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    gradient: "bg-gradient-to-br from-amber-300/35 to-pink-400/30",
  },
] as const;

type SectionId = (typeof sections)[number]["id"];

// 3分割のclip-path: 斜めに強い角度で切る
// 左: 0,0 → ~45%,0 → ~10%,100 → 0,100
// 中: ~45%,0 → ~78%,0 → ~43%,100 → ~10%,100
// 右: ~78%,0 → 100,0 → 100,100 → ~43%,100
function getClipPaths(hovered: SectionId | null) {
  // デフォルト境界線: 左端45%/10%, 右端78%/43%
  // ホバー時: ホバーしたセクションが広がり、他が縮む
  const presets: Record<string, [string, string, string]> = {
    none: [
      "polygon(0 0, 45% 0, 10% 100%, 0 100%)",
      "polygon(45% 0, 78% 0, 43% 100%, 10% 100%)",
      "polygon(78% 0, 100% 0, 100% 100%, 43% 100%)",
    ],
    words: [
      "polygon(0 0, 60% 0, 25% 100%, 0 100%)",
      "polygon(60% 0, 82% 0, 47% 100%, 25% 100%)",
      "polygon(82% 0, 100% 0, 100% 100%, 47% 100%)",
    ],
    nature: [
      "polygon(0 0, 35% 0, 0% 100%, 0 100%)",
      "polygon(35% 0, 88% 0, 53% 100%, 0% 100%)",
      "polygon(88% 0, 100% 0, 100% 100%, 53% 100%)",
    ],
    episode: [
      "polygon(0 0, 38% 0, 3% 100%, 0 100%)",
      "polygon(38% 0, 68% 0, 33% 100%, 3% 100%)",
      "polygon(68% 0, 100% 0, 100% 100%, 33% 100%)",
    ],
  };

  return presets[hovered ?? "none"];
}

export default function JobnyahaAITrainTest() {
  const [hovered, setHovered] = useState<SectionId | null>(null);

  const clips = getClipPaths(hovered);

  // コンテンツの配置位置 (左からの%)
  const positions = [15, 42, 72];

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none">
      {sections.map((section, i) => (
        <Link
          key={section.id}
          href={section.id === "words" ? "/jobnyaha_ai/train_test/words" : `/jobnyaha_ai/train?tab=${section.id}`}
          className="absolute inset-0 z-10"
          style={{
            clipPath: clips[i],
            transition: "clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={() => setHovered(section.id)}
          onMouseLeave={() => setHovered(null)}
        >
          {/* 背景 */}
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{
              backgroundImage: "url('/jobnyaha-overlay.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter:
                hovered === section.id
                  ? "brightness(0.5) saturate(1.2)"
                  : "brightness(0.3) saturate(0.8)",
            }}
          />
          <div className={`absolute inset-0 ${section.gradient}`} />

          {/* コンテンツ */}
          <div
            className="relative z-10 flex h-full items-center"
            style={{ paddingLeft: `${positions[i]}%` }}
          >
            <div
              className="flex flex-col items-center gap-4 transition-all duration-500"
              style={{
                opacity: hovered !== null && hovered !== section.id ? 0.4 : 1,
                transform: hovered === section.id ? "scale(1.08)" : "scale(1)",
              }}
            >
              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                {section.icon}
              </div>
              <h2 className="text-2xl font-light tracking-[0.15em] text-white/90">{section.label}</h2>
              <p className="text-xs text-white/40 tracking-wider text-center max-w-[140px]">{section.description}</p>
            </div>
          </div>
        </Link>
      ))}

      {/* 中央上部タイトル */}
      <div className="absolute inset-0 z-30 pointer-events-none flex items-start justify-center pt-10">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/20 shadow-2xl">
            <img src="/jobnyaha.jpg" alt="じょぶにゃは えーあい" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-light tracking-[0.2em] text-white/90 drop-shadow-lg">
            じょぶにゃはを育てる
          </h1>
          <p className="text-xs text-white/30 tracking-wider">教えたいカテゴリを選んでください</p>
        </div>
      </div>
    </div>
  );
}
