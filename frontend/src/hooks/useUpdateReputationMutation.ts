"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reputationKeys } from "@/lib/query-keys";
import { leaderboardKeys } from "@/lib/query-keys";
import { postUpdateReputation } from "@/lib/api-client";

export function useUpdateReputationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (wallet: string) => postUpdateReputation(wallet),
    onSuccess: (_, wallet) => {
      queryClient.invalidateQueries({ queryKey: reputationKeys.detail(wallet) });
      queryClient.invalidateQueries({ queryKey: reputationKeys.history(wallet) });
      queryClient.invalidateQueries({ queryKey: leaderboardKeys.all });
    },
  });
}
