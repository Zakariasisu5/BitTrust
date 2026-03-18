"use client";

import { useQuery } from "@tanstack/react-query";
import { reputationKeys } from "@/lib/query-keys";
import { fetchReputation } from "@/lib/api-client";

export function useReputationQuery(wallet: string | null, network: string) {
  return useQuery({
    queryKey: [...reputationKeys.detail(wallet ?? ""), network],
    queryFn: () => fetchReputation(wallet!, network),
    enabled: !!wallet,
    staleTime: 30_000,
  });
}
