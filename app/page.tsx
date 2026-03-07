const products = [
  {
    name: "じょぶにゃは  えーあい",
    description: "VRChatのフレンドをAIにしました",
    url: "/jobnyaha_ai",
    bg: "/jobnyaha-overlay.jpg",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center px-6 pt-32 sm:pt-64 pb-20">
      {/* プロフィールアイコン */}
      <div className="w-24 h-24 rounded-full border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <img src="/karifol.png" alt="karifol" className="w-full h-full object-cover" />
      </div>

      {/* タイトル */}
      <h1 className="mt-5 text-xl font-medium text-zinc-800 dark:text-zinc-100 tracking-wide">
        karifolの個人ウェブサイト
      </h1>

      {/* プロダクト一覧 */}
      <ul className="mt-14 w-full max-w-sm flex flex-col gap-3">
        {products.map((product) => (
          <li key={product.name}>
            <a
              href={product.url}
              className="relative flex items-center gap-4 px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors group overflow-hidden"
            >
              {product.bg && (
                <div
                  className="absolute inset-0 opacity-10 dark:opacity-15 group-hover:opacity-20 dark:group-hover:opacity-25 transition-opacity"
                  style={{
                    backgroundImage: `url('${product.bg}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
              <div className="relative flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{product.name}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">{product.description}</p>
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="relative w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400 dark:group-hover:text-zinc-400 shrink-0 transition-colors"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </a>
          </li>
        ))}
      </ul>

      {/* SNSリンク */}
      <a
        href="https://x.com/karifol133027"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
    </div>
  );
}
