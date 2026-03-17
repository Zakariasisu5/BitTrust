"use client";

import { useQuery } from "@tanstack/react-query";
import { leaderboardKeys } from "@/lib/query-keys";
import { fetchLeaderboard } from "@/lib/api-client";

export function useLeaderboardQuery() {
  return useQuery({
    queryKey: leaderboardKeys.all,
    queryFn: fetchLeaderboard,
  });
}
