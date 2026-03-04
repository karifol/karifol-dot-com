"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FadeIn } from "../../fade-in";

const PRONOUNS = ["ぼく", "わたし", "うち", "おれ", "あたし"];

const CATCHPHRASE_TAGS = [
  "にゃは！", "〜だよ〜", "〜だにゃ", "えへ", "〜かも",
  "うーん", "やったー", "えっと", "ふわ〜", "〜ねえ",
];

const ENDING_TAGS = [
  "〜にゃ", "〜だよ〜", "〜ね", "〜かな", "〜ー",
  "〜！", "笑", "w", "〜♪", "〜だよ",
];

type Step = 0 | 1 | 2 | 3; // 0=一人称, 1=口癖, 2=語尾, 3=完了

const questions: { text: string; sub?: string }[] = [
  { text: "じょぶにゃはの一人称は\nなんて呼ぶ？" },
  { text: "じょぶにゃはの口癖を\n教えて", sub: "いくつでも選んでね" },
  { text: "語尾はどんな感じ？", sub: "いくつでも選んでね" },
];

function useTypewriter(text: string, speed = 60, active = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      setDone(false);
      return;
    }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, active]);

  return { displayed, done };
}

export default function TrainWords() {
  const [step, setStep] = useState<Step>(0);
  const [pronoun, setPronoun] = useState<string | null>(null);
  const [catchphrases, setCatchphrases] = useState<string[]>([]);
  const [endings, setEndings] = useState<string[]>([]);
  const [choicesVisible, setChoicesVisible] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const currentQuestion = step < 3 ? questions[step] : null;
  const { displayed, done: typeDone } = useTypewriter(
    currentQuestion?.text ?? "",
    50,
    step < 3 && !transitioning,
  );

  // 質問のタイプが完了したら選択肢をフェードイン
  useEffect(() => {
    if (typeDone && step < 3) {
      const t = setTimeout(() => setChoicesVisible(true), 200);
      return () => clearTimeout(t);
    }
    setChoicesVisible(false);
  }, [typeDone, step]);

  const goNext = useCallback(() => {
    setTransitioning(true);
    setChoicesVisible(false);
    setTimeout(() => {
      setStep((s) => (Math.min(s + 1, 3) as Step));
      setTransitioning(false);
    }, 500);
  }, []);

  const handlePronoun = (p: string) => {
    setPronoun(p);
    setTimeout(goNext, 400);
  };

  const toggleCatchphrase = (tag: string) =>
    setCatchphrases((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  const toggleEnding = (tag: string) =>
    setEndings((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  // ステップ3: 完了 → trainページへ遷移 (将来)
  const summary = useMemo(() => {
    if (step !== 3) return null;
    return { pronoun, catchphrases, endings };
  }, [step, pronoun, catchphrases, endings]);

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      {/* 背景 */}
      <div
        className="absolute inset-0 scale-110"
        style={{
          backgroundImage: "url('/jobnyaha-overlay.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(12px) brightness(0.3) saturate(0.8)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* パーティクル的な装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float${i % 3} ${8 + i * 2}s ease-in-out infinite`,
            }}
          />
        ))}
        <style>{`
          @keyframes float0 { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; } 50% { transform: translateY(-20px) scale(1.05); opacity: 0.5; } }
          @keyframes float1 { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; } 50% { transform: translateY(15px) scale(0.95); opacity: 0.4; } }
          @keyframes float2 { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.25; } 50% { transform: translateY(-10px) scale(1.1); opacity: 0.45; } }
        `}</style>
      </div>

      <FadeIn>
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* 上部: ステップインジケータ */}
          <div className="flex justify-center pt-8 pb-4">
            <div className="flex items-center gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      i < step
                        ? "bg-white/60 scale-100"
                        : i === step
                          ? "bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                          : "bg-white/15 scale-100"
                    }`}
                  />
                  {i < 2 && (
                    <div
                      className={`w-8 h-px transition-colors duration-500 ${
                        i < step ? "bg-white/30" : "bg-white/8"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* アイコン */}
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/15 shadow-lg">
              <img
                src="/jobnyaha.jpg"
                alt="じょぶにゃは"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1 flex flex-col items-center px-6">
            {step < 3 ? (
              <>
                {/* 質問テキスト (タイプライター) */}
                <div
                  className="text-center mb-10 min-h-[4rem] transition-opacity duration-400"
                  style={{ opacity: transitioning ? 0 : 1 }}
                >
                  <p className="text-xl font-light text-white/90 tracking-wider leading-relaxed whitespace-pre-line">
                    {displayed}
                    {!typeDone && (
                      <span className="inline-block w-px h-5 bg-white/60 ml-0.5 animate-pulse" />
                    )}
                  </p>
                  {typeDone && currentQuestion?.sub && (
                    <p
                      className="text-xs text-white/30 mt-3 tracking-wider transition-opacity duration-500"
                      style={{ opacity: choicesVisible ? 1 : 0 }}
                    >
                      {currentQuestion.sub}
                    </p>
                  )}
                </div>

                {/* 選択肢 */}
                <div
                  className="w-full max-w-sm transition-all duration-500"
                  style={{
                    opacity: choicesVisible ? 1 : 0,
                    transform: choicesVisible
                      ? "translateY(0)"
                      : "translateY(12px)",
                  }}
                >
                  {/* ステップ0: 一人称 */}
                  {step === 0 && (
                    <div className="flex flex-col items-center gap-3">
                      {PRONOUNS.map((p, i) => (
                        <button
                          key={p}
                          onClick={() => handlePronoun(p)}
                          className={`w-full max-w-[200px] py-3 rounded-2xl text-sm tracking-widest border transition-all duration-300 cursor-pointer ${
                            pronoun === p
                              ? "bg-white/20 text-white border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                              : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white/80 hover:border-white/20"
                          }`}
                          style={{
                            animationDelay: `${i * 80}ms`,
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ステップ1: 口癖 */}
                  {step === 1 && (
                    <div className="flex flex-col items-center gap-5">
                      <div className="flex flex-wrap justify-center gap-2">
                        {CATCHPHRASE_TAGS.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleCatchphrase(tag)}
                            className={`px-4 py-2 rounded-full text-sm border transition-all duration-300 cursor-pointer ${
                              catchphrases.includes(tag)
                                ? "bg-white/20 text-white border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.08)]"
                                : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={goNext}
                        className="mt-2 px-8 py-2.5 rounded-full text-xs tracking-widest text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/80 transition-all duration-300 cursor-pointer"
                      >
                        つぎへ
                      </button>
                    </div>
                  )}

                  {/* ステップ2: 語尾 */}
                  {step === 2 && (
                    <div className="flex flex-col items-center gap-5">
                      <div className="flex flex-wrap justify-center gap-2">
                        {ENDING_TAGS.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleEnding(tag)}
                            className={`px-4 py-2 rounded-full text-sm border transition-all duration-300 cursor-pointer ${
                              endings.includes(tag)
                                ? "bg-white/20 text-white border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.08)]"
                                : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={goNext}
                        className="mt-2 px-8 py-2.5 rounded-full text-xs tracking-widest text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/80 transition-all duration-300 cursor-pointer"
                      >
                        つぎへ
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ステップ3: 完了画面 */
              <div className="flex flex-col items-center gap-6 text-center">
                <div
                  className="text-4xl"
                  style={{ animation: "popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                >
                  ✨
                </div>
                <p className="text-lg font-light text-white/90 tracking-wider">
                  ありがとう
                </p>
                <p className="text-xs text-white/40 leading-relaxed">
                  じょぶにゃはの口癖を覚えたよ
                </p>

                {summary && (
                  <div className="mt-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 w-full max-w-xs text-left">
                    <div className="flex flex-col gap-3">
                      <div>
                        <span className="text-xs text-white/30">一人称</span>
                        <p className="text-sm text-white/70 mt-0.5">{summary.pronoun}</p>
                      </div>
                      {summary.catchphrases.length > 0 && (
                        <div>
                          <span className="text-xs text-white/30">口癖</span>
                          <p className="text-sm text-white/70 mt-0.5">
                            {summary.catchphrases.join("、")}
                          </p>
                        </div>
                      )}
                      {summary.endings.length > 0 && (
                        <div>
                          <span className="text-xs text-white/30">語尾</span>
                          <p className="text-sm text-white/70 mt-0.5">
                            {summary.endings.join("、")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <a
                  href="/jobnyaha_ai/train_test"
                  className="mt-4 px-8 py-2.5 rounded-full text-xs tracking-widest text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/80 transition-all duration-300"
                >
                  もどる
                </a>
              </div>
            )}
          </div>

          {/* 下部: カテゴリラベル */}
          <div className="flex justify-center pb-8 pt-4">
            <span className="text-xs tracking-[0.3em] text-white/15 uppercase">
              口癖
            </span>
          </div>
        </div>
      </FadeIn>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
