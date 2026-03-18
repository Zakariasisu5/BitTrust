"use client";

import { useQuery } from "@tanstack/react-query";
import { reputationKeys } from "@/lib/query-keys";
import { fetchReputationHistory } from "@/lib/api-client";

export function useReputationHistoryQuery(wallet: string | null, network: string) {
  return useQuery({
    queryKey: [...reputationKeys.history(wallet ?? ""), network],
    queryFn: () => fetchReputationHistory(wallet!, network),
    enabled: !!wallet,
    staleTime: 30_000,
  });
}
