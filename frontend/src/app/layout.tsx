import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import { AppLayout } from "@/components/layout/AppLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BitTrust | Decentralized Reputation Protocol",
  description: "On-chain reputation and credit scoring for AI agents and Bitcoin wallets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        <WalletProvider>
          <AppLayout>{children}</AppLayout>
        </WalletProvider>
      </body>
    </html>
  );
}
