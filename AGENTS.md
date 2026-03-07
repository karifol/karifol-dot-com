# Repository Guidelines

## Project Structure & Module Organization

This repository is a small Next.js 16 App Router site written in TypeScript. Route files live under `app/`, including page UI in `app/page.tsx` and product-specific routes under `app/jobnyaha_ai/`. Server-side API proxies live in `app/api/`, with `app/api/chat/route.ts` for streaming chat and `app/api/train/[...path]/route.ts` for training endpoints. Shared helpers belong in `app/lib/`. Static images and icons live in `public/`.

## Build, Test, and Development Commands

Use npm with the existing lockfile:

```bash
npm install      # install dependencies
npm run dev      # start local dev server at http://localhost:3000
npm run build    # create a production build
npm run start    # serve the production build
npm run lint     # run ESLint across the repo
```

There is no dedicated test runner configured yet, so `npm run lint` and a successful `npm run build` are the current minimum checks before opening a PR.

## Coding Style & Naming Conventions

Follow the existing TypeScript and React style: 2-space indentation, semicolons, double quotes, and small functional components. Use `PascalCase` for exported React components, `camelCase` for variables and helpers, and kebab-free route folder names that match URLs such as `app/jobnyaha_ai/`. Keep browser-only logic in client components and keep secrets in server routes only; do not expose API keys through `NEXT_PUBLIC_*`.

## Testing Guidelines

When adding tests, place them beside the feature or in a local `__tests__/` folder and use descriptive names such as `site-header.test.tsx`. For now, verify UI changes in `npm run dev`, run `npm run lint`, and run `npm run build` when changing routing, environment-variable usage, or API code.

## Commit & Pull Request Guidelines

Recent history favors short, imperative commit subjects, often with Conventional Commit prefixes like `fix:` and `feat:`. Keep commits focused and specific, for example `fix: handle upstream chat errors`. PRs should include a brief summary, note any env var or API contract changes, link the related issue when available, and attach screenshots for visible UI updates.

## Security & Configuration Tips

Server integrations depend on `.env.local` values such as `STREAMING_API_URL`, `STREAMING_API_KEY`, `TRAIN_API_URL`, and `TRAIN_API_KEY`. Keep these server-side only, and route all external calls through `app/api/*` rather than calling upstream services directly from the client.
