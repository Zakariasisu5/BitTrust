"use client";

import { useQuery } from "@tanstack/react-query";
import { reputationKeys } from "@/lib/query-keys";
import { fetchReputationHistory } from "@/lib/api-client";

export function useReputationHistoryQuery(wallet: string | null) {
  return useQuery({
    queryKey: reputationKeys.history(wallet ?? ""),
    queryFn: () => fetchReputationHistory(wallet!),
    enabled: !!wallet,
  });
}
