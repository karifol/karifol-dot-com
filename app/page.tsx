import { ThemeToggle } from "./theme-toggle";

const products = [
  {
    name: "じょぶにゃは えーあい",
    description: "VRChatのフレンドをAIにしました",
    url: "/jobnyaha_ai",
    icon: "/jobnyaha.jpg",
    bg: "/jobnyaha-overlay.jpg",
    tag: "AI",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-400/25 dark:bg-violet-600/15 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-sky-400/20 dark:bg-sky-600/10 blur-3xl animate-pulse-slow delay-700" />
        <div className="absolute top-2/3 right-1/4 w-64 h-64 rounded-full bg-pink-400/15 dark:bg-pink-600/8 blur-3xl animate-pulse-slow delay-1400" />
      </div>

      <ThemeToggle />

      <main className="relative flex flex-col items-center px-6 pt-24 sm:pt-32 pb-24">
        {/* Avatar */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-pink-500 to-sky-500 blur-md opacity-40 dark:opacity-30 scale-110 group-hover:opacity-60 transition-opacity duration-500" />
          <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/80 dark:ring-zinc-800/80 shadow-2xl">
            <img src="/karifol.png" alt="karifol" className="w-full h-full object-cover" />
          </div>
          <span className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white dark:border-zinc-950 shadow-sm" />
        </div>

        {/* Name & bio */}
        <h1 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-600 via-pink-500 to-sky-500 dark:from-violet-400 dark:via-pink-400 dark:to-sky-400 bg-clip-text text-transparent">
          karifol
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-xs leading-relaxed">
          個人ウェブサイト — AIプロダクトを作っています
        </p>

        {/* Divider */}
        <div className="mt-12 w-full max-w-md flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-300 dark:text-zinc-600">
            Products
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
        </div>

        {/* Product cards */}
        <ul className="mt-4 w-full max-w-md flex flex-col gap-3">
          {products.map((product) => (
            <li key={product.name}>
              <a
                href={product.url}
                className="group relative flex items-center gap-4 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm hover:border-violet-300/60 dark:hover:border-violet-700/40 hover:shadow-xl hover:shadow-violet-500/10 dark:hover:shadow-violet-500/5 transition-all duration-300 overflow-hidden"
              >
                {/* bg image */}
                {product.bg && (
                  <div
                    className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                    style={{
                      backgroundImage: `url('${product.bg}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                )}

                {/* Icon */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md shrink-0 ring-1 ring-black/5 dark:ring-white/10">
                  <img src={product.icon} alt={product.name} className="w-full h-full object-cover" />
                </div>

                {/* Text */}
                <div className="relative flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{product.name}</p>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 leading-none">
                      {product.tag}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">{product.description}</p>
                </div>

                {/* Arrow */}
                <div className="relative shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/50 transition-colors duration-200">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-violet-500 dark:group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all duration-200"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </a>
            </li>
          ))}
        </ul>

        {/* Social links */}
        <div className="mt-10 flex items-center gap-3">
          <a
            href="https://x.com/karifol133027"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-200 hover:shadow-md transition-all duration-200 text-xs font-medium"
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
