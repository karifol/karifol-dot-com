# karifol.com

karifolの個人ウェブサイト。プロフィールとプロダクト一覧を掲載し、各プロダクトの紹介ページも提供する。

## プロダクト

- **じょぶにゃはAI** — VRChatのフレンド「じょぶにゃは」をモデルにしたAIチャット

## 技術スタック

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [next-themes](https://github.com/pacocoursey/next-themes) — ダーク/ライトモード切り替え
- [react-markdown](https://github.com/remarkjs/react-markdown) — チャット内Markdownレンダリング

## セットアップ

```bash
npm install
```

`.env.local` を作成して環境変数を設定：

```
STREAMING_API_URL=https://xxxx.execute-api.ap-northeast-1.amazonaws.com/Prod
STREAMING_API_KEY=your-api-key
```

```bash
npm run dev   # http://localhost:3000
```

## コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run lint     # ESLint実行
```

## ディレクトリ構成

```
app/
├── layout.tsx          # ルートレイアウト
├── providers.tsx        # ThemeProvider (next-themes)
├── theme-toggle.tsx     # ダーク/ライト切り替えボタン
├── site-header.tsx      # サイト共通ヘッダー (ホーム以外で使用)
├── page.tsx            # トップページ
├── globals.css         # グローバルスタイル
├── api/
│   └── chat/
│       └── route.ts    # AIチャットプロキシ (APIキーをサーバーサイドで隠蔽)
└── jobnyaha_ai/
    └── page.tsx        # じょぶにゃはAI チャットページ
public/
├── karifol.png         # プロフィールアイコン
└── jobnyaha.jpg        # じょぶにゃはAIアイコン
```
