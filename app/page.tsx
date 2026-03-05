const products = [
  {
    name: "じょぶにゃは  えーあい",
    description: "VRChatのフレンドをAIにしました",
    url: "/jobnyaha_ai",
    icon: <img src="/jobnyaha.jpg" alt="じょぶにゃはあい" className="w-full h-full object-cover" />,
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
className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                {product.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{product.name}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">{product.description}</p>
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400 dark:group-hover:text-zinc-400 shrink-0 transition-colors"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
