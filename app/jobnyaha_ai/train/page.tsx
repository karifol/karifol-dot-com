"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FadeIn } from "../fade-in";
import { SiteHeader } from "../../site-header";
import { loadTrainData, saveTrainData } from "../../lib/train-storage";
import { getUserId } from "../../lib/user-id";

const PRONOUNS = ["ぼく", "わたし", "うち", "おれ", "あたし"];

const CATCHPHRASE_TAGS = [
  "にゃは！", "〜だよ〜", "〜だにゃ", "えへ", "〜かも",
  "うーん", "やったー", "えっと", "ふわ〜", "〜ねえ",
];

const ENDING_TAGS = [
  "〜にゃ", "〜だよ〜", "〜ね", "〜かな", "〜ー",
  "〜！", "笑", "w", "〜♪", "〜だよ",
];

const NATURE_TRAITS = [
  { key: "energy",  left: "のんびり", right: "元気いっぱい" },
  { key: "social",  left: "内向的",   right: "外向的" },
  { key: "emotion", left: "クール",   right: "感情豊か" },
  { key: "caution", left: "慎重",     right: "大胆" },
  { key: "serious", left: "真面目",   right: "おちゃらけ" },
];

type Step = 0 | 1 | 2 | 3 | 4 | 5;

const questions: { text: string; sub?: string }[] = [
  { text: "じょぶにゃはの一人称は\nなんて呼ぶ？" },
  { text: "じょぶにゃはの口癖を\n教えて", sub: "いくつでも選んでね" },
  { text: "語尾はどんな感じ？", sub: "いくつでも選んでね" },
  { text: "じょぶにゃはの性格は\nどんな感じ？", sub: "それぞれ5段階で教えてね" },
  { text: "じょぶにゃはとの\nエピソードを教えて", sub: "思い出や出会いを自由に書いてね" },
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

export default function TrainPage() {
  const [step, setStep] = useState<Step>(0);
  const [pronoun, setPronoun] = useState<string | null>(null);
  const [catchphrases, setCatchphrases] = useState<string[]>([]);
  const [endings, setEndings] = useState<string[]>([]);
  const [nature, setNature] = useState<Record<string, number>>(
    Object.fromEntries(NATURE_TRAITS.map((t) => [t.key, 3])),
  );
  const [episodeText, setEpisodeText] = useState("");
  const [choicesDelay, setChoicesDelay] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // ローカルストレージから初期値を読み込む
  useEffect(() => {
    const saved = loadTrainData();
    if (saved.words) {
      if (saved.words.pronoun) setPronoun(saved.words.pronoun);
      if (saved.words.catchphrases) setCatchphrases(saved.words.catchphrases);
      if (saved.words.endings) setEndings(saved.words.endings);
    }
    if (saved.personality) {
      setNature((prev) => ({ ...prev, ...saved.personality }));
    }
    if (saved.episode?.text) {
      setEpisodeText(saved.episode.text);
    }
  }, []);

  const currentQuestion = step < 5 ? questions[step] : null;
  const { displayed, done: typeDone } = useTypewriter(
    currentQuestion?.text ?? "",
    50,
    step < 5 && !transitioning,
  );

  const choicesTimer = useRef<ReturnType<typeof setTimeout>>(null);
  useEffect(() => {
    if (choicesTimer.current) clearTimeout(choicesTimer.current);
    if (typeDone && step < 5) {
      choicesTimer.current = setTimeout(() => setChoicesDelay(true), 200);
    } else {
      setChoicesDelay(false);
    }
    return () => {
      if (choicesTimer.current) clearTimeout(choicesTimer.current);
    };
  }, [typeDone, step]);

  const choicesVisible = choicesDelay && !transitioning;

  // 現在のステップのデータをローカルストレージに保存
  const saveCurrentStep = useCallback((currentStep: Step) => {
    if (currentStep <= 2) {
      saveTrainData({ words: { pronoun: pronoun ?? "ぼく", catchphrases, endings } });
    } else if (currentStep === 3) {
      saveTrainData({ personality: nature });
    } else if (currentStep === 4) {
      saveTrainData({ episode: { text: episodeText } });
    }
  }, [pronoun, catchphrases, endings, nature, episodeText]);

  // 全データをAPIに送信
  const saveToApi = useCallback(async () => {
    const userId = getUserId();
    await Promise.allSettled([
      fetch("/api/train/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, pronoun: pronoun ?? "ぼく", catchphrases, endings }),
      }),
      fetch("/api/train/personality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, ...nature }),
      }),
      fetch("/api/train/episode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, text: episodeText }),
      }),
    ]);
  }, [pronoun, catchphrases, endings, nature, episodeText]);

  const goNext = useCallback(() => {
    saveCurrentStep(step);
    // 最後の質問 → 完了画面：APIに保存
    if (step === 4) saveToApi();
    setTransitioning(true);
    setTimeout(() => {
      setChoicesDelay(false);
      setStep((s) => Math.min(s + 1, 5) as Step);
      setTimeout(() => {
        setTransitioning(false);
      }, 100);
    }, 600);
  }, [step, saveCurrentStep, saveToApi]);

  const goBack = useCallback(() => {
    if (step === 0) return;
    saveCurrentStep(step);
    setTransitioning(true);
    setTimeout(() => {
      setChoicesDelay(false);
      setStep((s) => Math.max(s - 1, 0) as Step);
      setTimeout(() => {
        setTransitioning(false);
      }, 100);
    }, 600);
  }, [step, saveCurrentStep]);

  const goToStep = useCallback((target: Step) => {
    if (target === step || transitioning) return;
    if (step < 5) saveCurrentStep(step);
    setTransitioning(true);
    setTimeout(() => {
      setChoicesDelay(false);
      setStep(target);
      setTimeout(() => {
        setTransitioning(false);
      }, 100);
    }, 600);
  }, [step, transitioning, saveCurrentStep]);

  const handlePronoun = (p: string) => {
    setPronoun(p);
    // 一人称選択時もローカル保存
    saveTrainData({ words: { pronoun: p, catchphrases, endings } });
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

  const summary = useMemo(() => {
    if (step !== 5) return null;
    return { pronoun, catchphrases, endings, nature, episodeText };
  }, [step, pronoun, catchphrases, endings, nature, episodeText]);

  const TOTAL_QUESTION_STEPS = 5;

  const BackButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="mt-3 px-4 py-2 -mx-4 -my-2 flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors duration-300 cursor-pointer"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
      <span className="text-xs tracking-wider">もどる</span>
    </button>
  );

  const NextButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="mt-3 px-4 py-2 -mx-4 -my-2 flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors duration-300 cursor-pointer"
    >
      <span className="text-xs tracking-wider">つぎへ</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
      </svg>
    </button>
  );

  const NavButtons = () => (
    <div className={`mt-3 flex w-full ${step > 0 ? "justify-between" : "justify-end"}`}>
      {step > 0 && <BackButton onClick={goBack} />}
      <NextButton onClick={goNext} />
    </div>
  );

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      {/* ヘッダー */}
      <div className="absolute top-0 left-0 z-40 pointer-events-auto">
        <SiteHeader />
      </div>

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

      {/* パーティクル装飾 */}
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

      {/* ステップインジケータ */}
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-center pt-8">
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <button
                onClick={() => goToStep(i as Step)}
                className="flex items-center justify-center w-8 h-8 cursor-pointer"
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i < step
                      ? "bg-white/60 scale-100"
                      : i === step
                        ? "bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                        : "bg-white/15 scale-100"
                  }`}
                />
              </button>
              {i < 4 && (
                <div
                  className={`w-4 h-px transition-colors duration-500 ${
                    i < step ? "bg-white/30" : "bg-white/8"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>


      <FadeIn className="absolute inset-0 z-10">
        <div className="flex flex-col items-center justify-center h-full px-6">
          <div className="flex flex-col items-center w-full max-w-sm">
            {step < TOTAL_QUESTION_STEPS ? (
              <div
                className="flex flex-col items-center w-full transition-opacity duration-500"
                style={{ opacity: transitioning ? 0 : 1 }}
              >
                {/* 質問テキスト */}
                <div className="text-center mb-10 min-h-16">
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
                  className="w-full max-w-sm"
                  style={{
                    transition: "opacity 500ms, transform 500ms",
                    opacity: choicesVisible ? 1 : 0,
                    transform: choicesVisible || transitioning
                      ? "translateY(0)"
                      : "translateY(12px)",
                  }}
                >
                  {/* ステップ0: 一人称 */}
                  <div className={step === 0 ? "" : "hidden"}>
                    <div className="flex flex-col items-center gap-3">
                      {PRONOUNS.map((p) => (
                        <button
                          key={p}
                          onClick={() => handlePronoun(p)}
                          className={`w-50 py-3 rounded-2xl text-sm tracking-widest border transition-colors duration-300 cursor-pointer ${
                            pronoun === p
                              ? "bg-white/20 text-white border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                              : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white/80 hover:border-white/20"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ステップ1: 口癖 */}
                  <div className={step === 1 ? "" : "hidden"}>
                    <div className="flex flex-col items-center gap-5">
                      <div className="flex flex-wrap justify-center gap-2">
                        {CATCHPHRASE_TAGS.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleCatchphrase(tag)}
                            className={`px-4 py-2 rounded-full text-sm border transition-colors duration-300 cursor-pointer ${
                              catchphrases.includes(tag)
                                ? "bg-white/20 text-white border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.08)]"
                                : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <NavButtons />
                    </div>
                  </div>

                  {/* ステップ2: 語尾 */}
                  <div className={step === 2 ? "" : "hidden"}>
                    <div className="flex flex-col items-center gap-5">
                      <div className="flex flex-wrap justify-center gap-2">
                        {ENDING_TAGS.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleEnding(tag)}
                            className={`px-4 py-2 rounded-full text-sm border transition-colors duration-300 cursor-pointer ${
                              endings.includes(tag)
                                ? "bg-white/20 text-white border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.08)]"
                                : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <NavButtons />
                    </div>
                  </div>

                  {/* ステップ3: 性格 */}
                  <div className={step === 3 ? "" : "hidden"}>
                    <div className="flex flex-col items-center gap-5 w-full">
                      <div className="flex flex-col gap-5 w-full">
                        {NATURE_TRAITS.map((trait) => (
                          <div key={trait.key}>
                            <div className="flex justify-between mb-2">
                              <span className="text-xs text-white/40">{trait.left}</span>
                              <span className="text-xs text-white/40">{trait.right}</span>
                            </div>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((v) => (
                                <button
                                  key={v}
                                  onClick={() =>
                                    setNature((prev) => ({ ...prev, [trait.key]: v }))
                                  }
                                  className={`flex-1 h-9 rounded-xl border transition-colors duration-300 cursor-pointer text-xs font-medium ${
                                    nature[trait.key] === v
                                      ? "bg-white/20 border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.06)]"
                                      : "bg-white/5 border-white/10 text-white/25 hover:bg-white/10 hover:border-white/20 hover:text-white/40"
                                  }`}
                                >
                                  {v}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <NavButtons />
                    </div>
                  </div>

                  {/* ステップ4: エピソード */}
                  <div className={step === 4 ? "" : "hidden"}>
                    <div className="flex flex-col items-center gap-4 w-full">
                      <textarea
                        value={episodeText}
                        onChange={(e) => setEpisodeText(e.target.value.slice(0, 300))}
                        placeholder="例：VRChatのイベントでたまたま隣に来た猫アバターが声をかけてきた。最初は人見知りっぽかったけど、話してみたらすごく優しかった。"
                        rows={5}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white/70 placeholder-white/20 outline-none focus:border-white/25 resize-none backdrop-blur-sm"
                      />
                      <p
                        className={`text-xs self-end ${
                          episodeText.length >= 300
                            ? "text-red-400/70"
                            : "text-white/20"
                        }`}
                      >
                        {episodeText.length} / 300
                      </p>
                      <NavButtons />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ステップ5: 完了画面 */
              <div className="flex flex-col items-center gap-6 text-center">
                <p className="text-lg font-light text-white/90 tracking-wider">
                  ありがとう
                </p>
                <p className="text-xs text-white/40 leading-relaxed">
                  じょぶにゃはのこと、覚えたよ
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
                      <div>
                        <span className="text-xs text-white/30">性格</span>
                        <div className="flex flex-col gap-1 mt-1">
                          {NATURE_TRAITS.map((trait) => (
                            <div key={trait.key} className="flex items-center gap-2">
                              <span className="text-xs text-white/40 w-20 shrink-0 text-right">
                                {trait.left}
                              </span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((v) => (
                                  <div
                                    key={v}
                                    className={`w-2 h-2 rounded-full ${
                                      v === summary.nature[trait.key]
                                        ? "bg-white/70"
                                        : "bg-white/10"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-white/40 w-20 shrink-0">
                                {trait.right}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {summary.episodeText && (
                        <div>
                          <span className="text-xs text-white/30">エピソード</span>
                          <p className="text-sm text-white/70 mt-0.5 line-clamp-3">
                            {summary.episodeText}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between w-full max-w-xs">
                  <button
                    onClick={() => goToStep(4)}
                    className="px-4 py-2 -mx-4 -my-2 flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors duration-300 cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    <span className="text-xs tracking-wider">もどる</span>
                  </button>
                  <a
                    href="/jobnyaha_ai"
                    className="px-4 py-2 -mx-4 -my-2 flex items-center gap-1.5 text-white/70 hover:text-white transition-colors duration-300"
                  >
                    <span className="text-xs tracking-wider">おわる</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
