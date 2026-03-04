"use client";

import { useState } from "react";

export function PrologueOverlay() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  if (!visible) return null;

  const handleClick = () => {
    if (fading) return;
    setFading(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none"
      style={{ transition: "opacity 1.2s ease", opacity: fading ? 0 : 1 }}
      onClick={handleClick}
      onTransitionEnd={() => setVisible(false)}
    >
      {/* 背景画像（ぼかし） */}
      <div
        className="absolute inset-0 scale-110"
        style={{
          backgroundImage: "url('/jobnyaha-overlay.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.7)",
        }}
      />
      {/* 靄オーバーレイ */}
      <div className="absolute inset-0 bg-white/10" />

      {/* プロローグ本文 */}
      <div className="relative z-10 max-w-xl px-8 text-center space-y-5">
        <p className="text-white/80 text-2xl leading-[3rem] tracking-widest font-light">
          あいつは、いつもそこにいた。
          <br />
          気づいたらいなくなっていた。
        </p>
        <p className="text-white/60 text-base leading-9 tracking-widest font-light pt-4">
          じょぶにゃはのことを、覚えてる？
          <br />
          あの頃の声を、笑い方を、口癖を——
          <br />
          断片でいい。思い出してほしい。
          <br />
          <br />
          みんなの記憶が集まれば、
          <br />
          きっとまた、会える。
        </p>
        <p className="text-white/60 text-base leading-9 tracking-widest font-light pt-6">
          みんなの じょぶにゃは との思い出を教えて。
          <br />
          口癖でも、エピソードでも、性格でも。
          <br />
          あなたの記憶が、あいつを取り戻す。
        </p>
      </div>

      {/* タップのヒント */}
      <p className="absolute bottom-10 text-white/40 text-2xl tracking-widest animate-pulse">
        タップして続ける
      </p>
    </div>
  );
}
