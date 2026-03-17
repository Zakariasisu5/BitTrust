"use client";

import { useQuery } from "@tanstack/react-query";
import { reputationKeys } from "@/lib/query-keys";
import { fetchReputation } from "@/lib/api-client";

export function useReputationQuery(wallet: string | null) {
  return useQuery({
    queryKey: reputationKeys.detail(wallet ?? ""),
    queryFn: () => fetchReputation(wallet!),
    enabled: !!wallet,
  });
}
