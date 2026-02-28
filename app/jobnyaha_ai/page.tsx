import { SiteHeader } from "../site-header";

const modes = [
  {
    href: "/jobnyaha_ai/chat",
    label: "会話する",
    description: "じょぶにゃはとおしゃべりする",
    iconColor: "text-blue-500 dark:text-blue-400",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
  },
  {
    href: "/jobnyaha_ai/train",
    label: "育てる",
    description: "AIにじょぶにゃはを教えてください",
    iconColor: "text-purple-500 dark:text-purple-400",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
];

export default function JobnyahaAITop() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      <SiteHeader />

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="flex w-full max-w-sm flex-col items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-6">
            <img src="/jobnyaha.jpg" alt="じょぶにゃは えーあい" className="w-full h-full object-cover" />
          </div>
          <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            じょぶにゃは<span className="ml-2 text-blue-400 dark:text-zinc-500">えーあい</span>
          </h1>

          <ul className="w-full flex flex-col gap-3">
            {modes.map((mode) => (
              <li key={mode.href}>
                <a
                  href={mode.href}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 transition-colors ${mode.iconColor}`}>
                    {mode.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{mode.label}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{mode.description}</p>
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
      </div>
    </div>
  );
}
