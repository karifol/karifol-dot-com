"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "../../site-header";
import { getUserId } from "../../lib/user-id";
import { loadTrainData, saveTrainData } from "../../lib/train-storage";

type Tab = "words" | "nature" | "episode";

const CATCHPHRASE_TAGS = [
  "にゃは！", "〜だよ〜", "〜だにゃ", "えへ", "〜かも",
  "うーん", "やったー", "えっと", "ふわ〜", "〜ねえ",
];

const ENDING_TAGS = [
  "〜にゃ", "〜だよ〜", "〜ね", "〜かな", "〜ー",
  "〜！", "笑", "w", "〜♪", "〜だよ",
];

const PRONOUNS = ["ぼく", "わたし", "うち", "おれ", "あたし"];

const NATURE_TRAITS = [
  { key: "energy",   left: "のんびり", right: "元気いっぱい" },
  { key: "social",   left: "内向的",   right: "外向的" },
  { key: "emotion",  left: "クール",   right: "感情豊か" },
  { key: "caution",  left: "慎重",     right: "大胆" },
  { key: "serious",  left: "真面目",   right: "おちゃらけ" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "口癖": "bg-purple-400",
  "性格": "bg-pink-400",
  "エピソード": "bg-emerald-400",
};

const CIRCLE_R = 42;
const CIRCLE_C = 2 * Math.PI * CIRCLE_R;

type Stats = {
  overall: number;
  participants: number;
  categories: { label: string; pct: number }[];
};

export default function JobnyahaAITrain() {
  const [activeTab, setActiveTab] = useState<Tab>("words");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // グラフ
  const [stats, setStats] = useState<Stats>({
    overall: 0,
    participants: 0,
    categories: [
      { label: "口癖",     pct: 0 },
      { label: "性格",     pct: 0 },
      { label: "エピソード", pct: 0 },
    ],
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // 口癖
  const [pronoun, setPronoun] = useState("ぼく");
  const [selectedCatchphrases, setSelectedCatchphrases] = useState<string[]>([]);
  const [selectedEndings, setSelectedEndings] = useState<string[]>([]);

  // 性格
  const [nature, setNature] = useState<Record<string, number>>(
    Object.fromEntries(NATURE_TRAITS.map(t => [t.key, 3]))
  );

  // エピソード
  const [episodeText, setEpisodeText] = useState("");

  useEffect(() => {
    fetchStats();
    const saved = loadTrainData();
    if (saved.words) {
      setPronoun(saved.words.pronoun || "ぼく");
      setSelectedCatchphrases(saved.words.catchphrases || []);
      setSelectedEndings(saved.words.endings || []);
    }
    if (saved.personality) {
      setNature(prev => ({ ...prev, ...saved.personality }));
    }
    if (saved.episode) {
      setEpisodeText(saved.episode.text || "");
    }
  }, []);

  useEffect(() => {
    setSaved(false);
    setSaving(false);
  }, [activeTab]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/train/stats");
      if (res.ok) setStats(await res.json());
    } catch {
      // フェッチ失敗時はデフォルト値のまま
    } finally {
      setStatsLoading(false);
    }
  };

  const toggleCatchphrase = (tag: string) =>
    setSelectedCatchphrases(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );

  const toggleEnding = (tag: string) =>
    setSelectedEndings(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeTab === "words") {
        await fetch("/api/train/words", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: getUserId(),
            pronoun,
            catchphrases: selectedCatchphrases,
            endings: selectedEndings,
          }),
        });
        saveTrainData({ words: { pronoun, catchphrases: selectedCatchphrases, endings: selectedEndings } });
      } else if (activeTab === "nature") {
        await fetch("/api/train/personality", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: getUserId(), ...nature }),
        });
        saveTrainData({ personality: nature });
      } else if (activeTab === "episode") {
        await fetch("/api/train/episode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: getUserId(), text: episodeText }),
        });
        saveTrainData({ episode: { text: episodeText } });
      }
      setSaved(true);
      await fetchStats();
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "words",   label: "口癖" },
    { id: "nature",  label: "性格" },
    { id: "episode", label: "エピソード" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <SiteHeader />

      <div className="flex flex-1 flex-col items-center px-4 pt-10 pb-16">
        <div className="w-full max-w-lg">

          {/* ページタイトル */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
              <img src="/jobnyaha.jpg" alt="じょぶにゃは" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-zinc-100">じょぶにゃは を育てる</h1>
              <p className="text-xs text-zinc-500">AIに口癖・性格・エピソードを教えます</p>
            </div>
          </div>
          
          {/* 学習率パネル */}
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-4 mb-3">
            {/* ヘッダー */}
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-xs font-medium text-zinc-300">じょぶにゃは えーあい 学習状況</span>
              {statsLoading ? (
                <div className="h-3 w-16 bg-zinc-700 rounded animate-pulse" />
              ) : (
                <span className="text-xs text-zinc-500">（{stats.participants}人が参加中）</span>
              )}
            </div>
            {statsLoading ? (
              <div className="flex items-center gap-4">
                {/* 円グラフ スケルトン */}
                <div className="relative shrink-0">
                  <svg width="96" height="96" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r={CIRCLE_R} fill="none" stroke="#27272a" strokeWidth="8" />
                    <circle
                      cx="48" cy="48" r={CIRCLE_R}
                      fill="none"
                      stroke="#3f3f46"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${CIRCLE_C * 0.25} ${CIRCLE_C * 0.75}`}
                      transform="rotate(-90 48 48)"
                      style={{ animation: "spin 1.2s linear infinite" }}
                    />
                    <style>{`@keyframes spin { from { transform: rotate(-90deg); transform-origin: 48px 48px; } to { transform: rotate(270deg); transform-origin: 48px 48px; } }`}</style>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-4 bg-zinc-700 rounded animate-pulse" />
                  </div>
                </div>
                {/* バー スケルトン */}
                <div className="flex-1 flex flex-col gap-1.5">
                  {["口癖", "性格", "エピソード"].map(label => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 w-16 shrink-0">{label}</span>
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-zinc-700 rounded-full animate-pulse" />
                      </div>
                      <div className="w-8 h-3 bg-zinc-700 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <svg width="96" height="96" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r={CIRCLE_R} fill="none" stroke="#27272a" strokeWidth="8" />
                    <circle
                      cx="48" cy="48" r={CIRCLE_R}
                      fill="none"
                      stroke="url(#learningGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={CIRCLE_C}
                      strokeDashoffset={CIRCLE_C * (1 - stats.overall / 100)}
                      transform="rotate(-90 48 48)"
                      style={{ transition: "stroke-dashoffset 1s ease" }}
                    />
                    <defs>
                      <linearGradient id="learningGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-zinc-100 leading-none">{stats.overall}%</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1.5">
                    {stats.categories.map(cat => (
                      <div key={cat.label} className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 w-16 shrink-0">{cat.label}</span>
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${CATEGORY_COLORS[cat.label] ?? "bg-zinc-400"} opacity-80`}
                            style={{ width: `${cat.pct}%`, transition: "width 1s ease" }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500 w-10 text-right shrink-0">{cat.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* タブ＋コンテンツパネル */}
          <p className="text-xs font-medium text-zinc-400 mb-2 px-1">AIにじょぶにゃはを教えてください</p>
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="flex border-b border-zinc-800">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? "text-zinc-100 border-zinc-400"
                      : "text-zinc-500 border-transparent hover:text-zinc-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-5">

            {/* ===== 口癖タブ ===== */}
            {activeTab === "words" && (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-medium text-white mb-2">一人称</label>
                  <div className="flex flex-wrap gap-2">
                    {PRONOUNS.map(p => (
                      <button
                        key={p}
                        onClick={() => setPronoun(p)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${
                          pronoun === p
                            ? "bg-zinc-200 text-zinc-900 border-zinc-200"
                            : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white mb-2">
                    口癖・よく使うフレーズ <span className="text-zinc-600 font-normal">（当てはまるものを選ぶ）</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATCHPHRASE_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleCatchphrase(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${
                          selectedCatchphrases.includes(tag)
                            ? "bg-zinc-200 text-zinc-900 border-zinc-200"
                            : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white mb-2">
                    語尾 <span className="text-zinc-600 font-normal">（当てはまるものを選ぶ）</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ENDING_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleEnding(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${
                          selectedEndings.includes(tag)
                            ? "bg-zinc-200 text-zinc-900 border-zinc-200"
                            : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ===== 性格タブ ===== */}
            {activeTab === "nature" && (
              <div className="flex flex-col gap-5">
                <p className="text-xs text-white">じょぶにゃはの性格の度合いを5段階で教えてください。</p>
                {NATURE_TRAITS.map(trait => (
                  <div key={trait.key}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-white">{trait.left}</span>
                      <span className="text-xs text-white">{trait.right}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button
                          key={v}
                          onClick={() => setNature(prev => ({ ...prev, [trait.key]: v }))}
                          className={`flex-1 h-8 rounded-lg border transition-colors cursor-pointer text-xs font-medium ${
                            nature[trait.key] === v
                              ? "bg-zinc-200 border-zinc-200 text-zinc-900"
                              : "border-zinc-700 text-zinc-600 hover:border-zinc-500 hover:text-zinc-400"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ===== エピソードタブ ===== */}
            {activeTab === "episode" && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-white">じょぶにゃは とのエピソードや出会いを自由に記述してください</p>
                <textarea
                  value={episodeText}
                  onChange={e => setEpisodeText(e.target.value.slice(0, 300))}
                  placeholder="例：VRChatのイベントでたまたま隣に来た猫アバターが声をかけてきた。最初は人見知りっぽかったけど、話してみたらすごく優しかった。"
                  rows={6}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 placeholder-zinc-600 outline-none focus:border-zinc-500 resize-none"
                />
                <p className={`text-xs text-right ${episodeText.length >= 300 ? "text-red-400" : "text-zinc-600"}`}>
                  {episodeText.length} / 300
                </p>
              </div>
            )}
            </div>
          </div>

          {/* 保存ボタン */}
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`mt-4 w-full py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              saved
                ? "bg-zinc-700 text-zinc-400"
                : saving
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-zinc-100 text-zinc-900 hover:bg-white"
            }`}
          >
            {saved ? "保存しました" : saving ? "保存中..." : "保存する"}
          </button>
          <a
            href="/jobnyaha_ai/chat"
            className="mt-3 block text-center text-xs text-zinc-500 hover:opacity-70 transition-opacity"
          >
            じょぶにゃはと会話する →
          </a>
        </div>
      </div>
    </div>
  );
}
