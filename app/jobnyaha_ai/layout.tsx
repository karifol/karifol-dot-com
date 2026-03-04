import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "じょぶにゃは AI",
  description: "じょぶにゃは えーあい — 会話したり育てたりできるAI",
  openGraph: {
    title: "じょぶにゃは AI",
    description: "じょぶにゃは えーあい — 会話したり育てたりできるAI",
    url: "https://karifol.com/jobnyaha_ai",
    siteName: "karifol.com",
    images: [
      {
        url: "https://karifol.com/jobnyaha.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "じょぶにゃは AI",
    description: "じょぶにゃは えーあい — 会話したり育てたりできるAI",
    images: ["https://karifol.com/jobnyaha.jpg"],
  },
};

export default function JobnyahaAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
