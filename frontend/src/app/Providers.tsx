"use client";

import { WalletProvider } from "@/context/WalletContext";
import { AppLayout } from "@/components/layout/AppLayout";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <AppLayout>{children}</AppLayout>
    </WalletProvider>
  );
}
