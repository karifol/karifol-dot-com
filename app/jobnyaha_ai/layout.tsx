import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "じょぶにゃは AI",
  description: "かつてのフレンドを取り戻すプロジェクト（嘘）",
  openGraph: {
    title: "じょぶにゃは AI",
    description: "かつてのフレンドを取り戻すプロジェクト（嘘）",
    siteName: "karifol.com",
    images: [
      {
        url: "https://karifol.com/jobnyaha-logo.png",
        width: 1200,
        height: 300,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "じょぶにゃは AI",
    description: "かつてのフレンドを取り戻すプロジェクト（嘘）",
    images: ["https://karifol.com/jobnyaha-x.png"],
  },
};

export default function JobnyahaAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
