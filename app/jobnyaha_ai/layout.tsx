import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "じょぶにゃは AI",
  description: "じょぶにゃは AI — かつてのフレンドを取り戻すための AI",
  openGraph: {
    title: "じょぶにゃは AI",
    description: "じょぶにゃは AI — かつてのフレンドを取り戻すための AI",
    siteName: "karifol.com",
    images: [
      {
        url: "https://karifol.com/jobnyaha-logo.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "じょぶにゃは AI",
    description: "じょぶにゃは AI — かつてのフレンドを取り戻すための AI",
    images: ["https://karifol.com/jobnyaha-logo.png"],
  },
};

export default function JobnyahaAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
