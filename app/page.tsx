import { ThemeToggle } from "./theme-toggle";

const products = [
  {
    name: "じょぶにゃは えーあい",
    description: "VRChatのフレンドをAIにしました",
    url: "/jobnyaha_ai",
    icon: "/jobnyaha.jpg",
    tag: "AI",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <ThemeToggle />

      <main className="flex flex-col items-center px-6 pt-24 sm:pt-32 pb-24">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-zinc-200 dark:ring-zinc-800 shadow-md">
          <img src="/karifol.png" alt="karifol" className="w-full h-full object-cover" />
        </div>

        {/* Name & bio */}
        <h1 className="mt-5 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          karifol
        </h1>
        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500 text-center max-w-xs">
          個人ウェブサイト
        </p>

        {/* Divider */}
        <div className="mt-10 w-full max-w-sm border-t border-zinc-100 dark:border-zinc-800" />

        {/* Product cards */}
        <ul className="mt-6 w-full max-w-sm flex flex-col gap-2">
          {products.map((product) => (
            <li key={product.name}>
              <a
                href={product.url}
                className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-150"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 ring-1 ring-black/5 dark:ring-white/10">
                  <img src={product.icon} alt={product.name} className="w-full h-full object-cover" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{product.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 leading-none">
                      {product.tag}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">{product.description}</p>
                </div>

                {/* Arrow */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4 text-zinc-300 dark:text-zinc-600 shrink-0"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        {/* Social links */}
        <div className="mt-8 flex items-center gap-3">
          <a
            href="https://x.com/karifol133027"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-150"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @karifol133027
          </a>
        </div>
      </main>
    </div>
  );
}
