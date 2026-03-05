"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { SiteHeader } from "../../site-header";
import { FadeIn } from "../fade-in";
import { getUserId } from "../../lib/user-id";

const MAX_INPUT_LENGTH = 100;

const SUGGESTIONS = [
  "自己紹介して",
  "にゃは !"
];

const ERROR_MESSAGES: Record<string, string> = {
  monthly_limit_reached: "今月の利用上限に達しました。また来月お試しください。",
  token_limit_reached: "このセッションの利用上限に達しました。新しい会話を始めてください。",
};

type Message = {
  role: "user" | "assistant";
  content: string;
  isWarning?: boolean;
  id: string;
};

async function sendFeedback(message: string, rating: "good" | "bad", comment = ""): Promise<void> {
  await fetch("/api/train/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: getUserId(), message, rating, comment }),
  });
}

async function sendMessageStream(
  message: string,
  sessionId: string,
  callbacks: {
    onChunk: (text: string) => void;
    onToolCall: (tool: string) => void;
    onToolResult: () => void;
    onInfo: (content: string) => void;
    onDone: () => void;
    onError: (err: string) => void;
  }
) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId, user_id: getUserId() }),
  });

  if (!response.ok) {
    callbacks.onError("送信に失敗しました。");
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) { callbacks.onError("レスポンスの読み取りに失敗しました。"); return; }

  const decoder = new TextDecoder();
  let buffer = "";
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) { callbacks.onDone(); break; }

    buffer += decoder.decode(value, { stream: true });

    let newlineIndex = buffer.indexOf("\n");
    while (newlineIndex !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);

      if (!line) { newlineIndex = buffer.indexOf("\n"); continue; }

      const jsonStr = line.startsWith("data: ") ? line.slice(6) : line;
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.type === "content") {
          accumulated += parsed.text ?? "";
          callbacks.onChunk(accumulated);
        } else if (parsed.type === "tool_call") {
          callbacks.onToolCall(parsed.tool ?? "");
        } else if (parsed.type === "tool_result") {
          callbacks.onToolResult();
        } else if (parsed.type === "info") {
          callbacks.onInfo(parsed.content ?? "");
        } else if (parsed.type === "done") {
          callbacks.onDone();
        } else if (parsed.type === "error") {
          const errKey = parsed.error ?? "";
          callbacks.onError(ERROR_MESSAGES[errKey] ?? "エラーが発生しました。");
        }
      } catch { /* ignore */ }

      newlineIndex = buffer.indexOf("\n");
    }
  }
}

export default function JobnyahaAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toolStatus, setToolStatus] = useState<string | null>(null);
  const [sessionLimitReached, setSessionLimitReached] = useState(false);
  const [ratings, setRatings] = useState<Record<string, "good" | "bad">>({});
  const [teachOpenId, setTeachOpenId] = useState<string | null>(null);
  const [teachInputs, setTeachInputs] = useState<Record<string, string>>({});
  const [teachSentIds, setTeachSentIds] = useState<Set<string>>(new Set());
  const sessionId = useRef(crypto.randomUUID());
  const messagesRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, toolStatus]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading || text.length > MAX_INPUT_LENGTH) return;

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { role: "user", content: text, id: crypto.randomUUID() }]);
    setLoading(true);
    setToolStatus(null);
    setMessages((prev) => [...prev, { role: "assistant", content: "", id: assistantId }]);

    await sendMessageStream(text, sessionId.current, {
      onChunk: (accumulated) => {
        setToolStatus(null);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, role: "assistant", content: accumulated };
          return updated;
        });
      },
      onToolCall: (tool) => {
        setToolStatus(tool || "検索中");
      },
      onToolResult: () => {
        setToolStatus(null);
      },
      onInfo: (content) => {
        if (content === "token_limit_reached") {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "このセッションの利用上限に達しました。新しい会話を始めてください。", isWarning: true, id: crypto.randomUUID() },
          ]);
        }
      },
      onDone: () => {
        setLoading(false);
        setToolStatus(null);
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && !last.content) {
            return prev.slice(0, -1);
          }
          return prev;
        });
      },
      onError: (err) => {
        setLoading(false);
        setToolStatus(null);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...updated[updated.length - 1], role: "assistant", content: err, isWarning: true };
          return updated;
        });
        if (err === ERROR_MESSAGES.token_limit_reached) {
          setSessionLimitReached(true);
        }
      },
    });

    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      {/* 背景画像 */}
      <div
        className="absolute inset-0 scale-110"
        style={{
          backgroundImage: "url('/jobnyaha-overlay.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px) brightness(0.4)",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <FadeIn className="flex-1 min-h-0 flex flex-col">
      {hasMessages ? (
          <div className="relative z-10 flex flex-col flex-1 min-h-0">
            <SiteHeader />

            {/* メッセージ一覧 */}
            <main ref={messagesRef} className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mx-auto flex max-w-3xl flex-col gap-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="flex flex-col items-start max-w-[80%]">
                      <div
                        className={`rounded-2xl px-4 py-3 text-base leading-relaxed w-full ${
                          msg.role === "user"
                            ? "bg-white/15 text-white/90 backdrop-blur-sm whitespace-pre-wrap"
                            : msg.isWarning
                              ? "text-amber-400"
                              : "text-white/80"
                        }`}
                      >
                        {msg.role === "assistant" && msg.content ? (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                              li: ({ children }) => <li>{children}</li>,
                              code: ({ children, className }) =>
                                className ? (
                                  <code className="block bg-white/10 rounded-lg px-3 py-2 my-2 text-xs font-mono overflow-x-auto">{children}</code>
                                ) : (
                                  <code className="bg-white/10 rounded px-1 py-0.5 text-xs font-mono">{children}</code>
                                ),
                              pre: ({ children }) => <pre className="my-2">{children}</pre>,
                              h1: ({ children }) => <h1 className="text-base font-bold mb-1">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-sm font-bold mb-1">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                              blockquote: ({ children }) => <blockquote className="border-l-2 border-white/30 pl-3 italic">{children}</blockquote>,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        ) : (
                        msg.content || (loading && i === messages.length - 1 && (
                          toolStatus ? (
                            <span className="text-white/30 text-xs">調べています...</span>
                          ) : (
                            <>
                              <style>{`
                                @keyframes pw1 { 0%,100%{width:80%} 50%{width:50%} }
                                @keyframes pw2 { 0%,100%{width:60%} 50%{width:85%} }
                                @keyframes pw3 { 0%,100%{width:40%} 50%{width:65%} }
                              `}</style>
                              <div className="flex flex-col gap-2 w-48">
                                <div className="h-3 rounded-lg bg-white/15" style={{ animation: "pw1 1.8s ease-in-out infinite" }} />
                                <div className="h-3 rounded-lg bg-white/15" style={{ animation: "pw2 1.8s ease-in-out infinite" }} />
                                <div className="h-3 rounded-lg bg-white/15" style={{ animation: "pw3 1.8s ease-in-out infinite" }} />
                              </div>
                            </>
                          )
                        )))}
                      </div>
                      {/* 評価ボタン */}
                      {msg.role === "assistant" && msg.content && !msg.isWarning && !(loading && i === messages.length - 1) && (
                        <div className="mt-1 ml-1">
                          <div className="flex gap-2 items-center">
                            <div className="relative group">
                              <button
                                onClick={() => {
                                  const next = ratings[msg.id] === "good" ? undefined : "good";
                                  setRatings((prev) => { const r = { ...prev }; if (next) r[msg.id] = next; else delete r[msg.id]; return r; });
                                  if (next) sendFeedback(msg.content, "good");
                                }}
                                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                                  ratings[msg.id] === "good"
                                    ? "text-blue-400"
                                    : "text-white/20 hover:text-white/50"
                                }`}
                              >
                                <FiThumbsUp size={14} />
                              </button>
                              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded bg-black/60 backdrop-blur-sm px-2 py-0.5 text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                                じょぶにゃはらしい
                              </span>
                            </div>
                            <div className="relative group">
                              <button
                                onClick={() => {
                                  const next = ratings[msg.id] === "bad" ? undefined : "bad";
                                  setRatings((prev) => { const r = { ...prev }; if (next) r[msg.id] = next; else delete r[msg.id]; return r; });
                                  if (next) sendFeedback(msg.content, "bad");
                                  setTeachOpenId(next ? msg.id : null);
                                }}
                                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                                  ratings[msg.id] === "bad"
                                    ? "text-red-400"
                                    : "text-white/20 hover:text-white/50"
                                }`}
                              >
                                <FiThumbsDown size={14} />
                              </button>
                              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded bg-black/60 backdrop-blur-sm px-2 py-0.5 text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                                じょぶにゃはらしくない
                              </span>
                            </div>
                          </div>
                          {teachOpenId === msg.id && (
                            <div className="flex flex-col gap-1 mt-2 min-w-[280px] sm:min-w-[400px]">
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={teachInputs[msg.id] ?? ""}
                                  onChange={(e) => setTeachInputs((prev) => ({ ...prev, [msg.id]: e.target.value.slice(0, 100) }))}
                                  placeholder="じょぶにゃはは〇〇が好き、など"
                                  className="rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-1.5 text-sm text-white/80 outline-none placeholder-white/20 w-full"
                                />
                                {(teachInputs[msg.id]?.length ?? 0) > 0 && (
                                  <span className={`text-xs shrink-0 ${(teachInputs[msg.id]?.length ?? 0) >= 100 ? "text-red-400" : "text-white/30"}`}>
                                    {teachInputs[msg.id]?.length ?? 0}/100
                                  </span>
                                )}
                                <button
                                  disabled={!teachInputs[msg.id]?.trim() || teachSentIds.has(msg.id)}
                                  onClick={async () => {
                                    const text = teachInputs[msg.id]?.trim();
                                    if (!text) return;
                                    await sendFeedback(msg.content, "bad", text);
                                    setTeachSentIds((prev) => new Set(prev).add(msg.id));
                                    setTeachInputs((prev) => ({ ...prev, [msg.id]: "" }));
                                    setTimeout(() => {
                                      setTeachOpenId(null);
                                      setTeachSentIds((prev) => { const s = new Set(prev); s.delete(msg.id); return s; });
                                    }, 1500);
                                  }}
                                  className="text-xs text-white/40 hover:opacity-70 transition-opacity disabled:opacity-30 shrink-0"
                                >
                                  {teachSentIds.has(msg.id) ? "送信しました" : "送信"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div />
              </div>
            </main>

            {/* 入力欄 */}
            <div className="px-6 py-6 shrink-0">
              <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-3xl h-13 items-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm focus-within:border-white/40 transition-colors"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
                  onKeyDown={handleKeyDown}
                  placeholder={sessionLimitReached ? "このセッションは終了しました" : "メッセージを入力..."}
                  disabled={sessionLimitReached}
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white/80 outline-none placeholder-white/20 disabled:opacity-50"
                />
                {input.length > 0 && (
                  <span className={`text-xs shrink-0 mr-2 ${input.length >= MAX_INPUT_LENGTH ? "text-red-400" : "text-white/30"}`}>
                    {input.length}/{MAX_INPUT_LENGTH}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={!input.trim() || loading || sessionLimitReached || input.length > MAX_INPUT_LENGTH}
                  className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 disabled:opacity-30 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                  </svg>
                </button>
              </form>
              <p className="mt-3 text-center text-xs text-white/50">
                AIの回答は不確実な場合があり、じょぶにゃは本人の思想や意図と異なります。ジョークです。
              </p>
              <a
                href="/jobnyaha_ai/train"
                className="mt-2 block text-center text-xs text-white/30 hover:text-white/50 transition-colors"
              >
                じょぶにゃはを育てる →
              </a>
            </div>
          </div>
        ) : (
          /* 初期画面 */
          <div className="relative z-10 flex flex-col flex-1 min-h-0">
            <SiteHeader />
            <div className="flex flex-1 flex-col items-center justify-center px-6">
              <div className="flex w-full max-w-3xl flex-col items-center">
                <h1 className="mb-2 text-2xl sm:text-4xl font-light tracking-[0.2em] text-white/90 flex items-baseline gap-3">
                  じょぶにゃは<span className="text-4xls tracking-[0.3em] text-white/30 uppercase">AI</span>
                </h1>
                <p className="mb-10 text-sm text-white/30 tracking-widest"></p>

                <form
                  onSubmit={handleSubmit}
                  className="flex h-15 w-full items-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm focus-within:border-white/40 transition-colors"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
                    placeholder="メッセージを入力..."
                    className="flex-1 bg-transparent px-4 py-2.5 text-white/80 outline-none placeholder-white/20"
                  />
                  {input.length > 0 && (
                    <span className={`text-xs shrink-0 mr-2 ${input.length >= MAX_INPUT_LENGTH ? "text-red-400" : "text-white/30"}`}>
                      {input.length}/{MAX_INPUT_LENGTH}
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={!input.trim() || input.length > MAX_INPUT_LENGTH}
                    className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 disabled:opacity-30 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                    </svg>
                  </button>
                </form>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setInput(""); sendMessage(s); }}
                      className="rounded-full border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 text-sm text-white/50 hover:bg-white/10 hover:text-white/70 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="mt-6 text-center text-xs sm:text-sm text-white/50">
                  AIの回答は不確実な場合があり、じょぶにゃは本人の思想や意図と異なります。ジョークです。
                </p>
              </div>
            </div>
          </div>
        )}
      </FadeIn>
    </div>
  );
}
