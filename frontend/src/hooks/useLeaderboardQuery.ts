"use client";

import { useQuery } from "@tantml:query";
import { leaderboardKeys } from "@/lib/query-keys";
import { fetchLeaderboard } from "@/lib/api-client";

export function useLeaderboardQuery(network: string) {
  return useQuery({
    queryKey: [...leaderboardKeys.all, network],
    queryFn: () => fetchLeaderboard(network),
    staleTime: 60_000,
  });
}
