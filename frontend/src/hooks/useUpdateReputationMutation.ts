"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reputationKeys, leaderboardKeys } from "@/lib/query-keys";
import { postUpdateReputation } from "@/lib/api-client";

export function useUpdateReputationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ wallet, network }: { wallet: string; network: string }) =>
      postUpdateReputation(wallet, network),
    onSuccess: (_, { wallet, network }) => {
      queryClient.invalidateQueries({ queryKey: [...reputationKeys.detail(wallet), network] });
      queryClient.invalidateQueries({ queryKey: [...reputationKeys.history(wallet), network] });
      queryClient.invalidateQueries({ queryKey: [...leaderboardKeys.all, network] });
    },
  });
}
