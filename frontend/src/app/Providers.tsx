"use client";

import { QueryProvider } from "@/providers/QueryProvider";
import { WalletProvider } from "@/context/WalletContext";
import { AppLayout } from "@/components/layout/AppLayout";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <WalletProvider>
        <AppLayout>{children}</AppLayout>
      </WalletProvider>
    </QueryProvider>
  );
}
