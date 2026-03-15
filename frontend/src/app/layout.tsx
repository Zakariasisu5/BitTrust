import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

const Providers = dynamic(
  () => import("./Providers").then((m) => ({ default: m.Providers })),
  { ssr: false }
);

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BitTrust | Decentralized Reputation Protocol",
  description: "On-chain reputation and credit scoring for AI agents and Bitcoin wallets.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.className} bg-slate-950 text-slate-100 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
