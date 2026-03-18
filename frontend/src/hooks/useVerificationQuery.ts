import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchVerification, postLinkProvider, deleteLinkProvider } from "@/lib/api-client";
import { verificationKeys, reputationKeys } from "@/lib/query-keys";

export function useVerificationQuery(wallet: string | null) {
  return useQuery({
    queryKey: verificationKeys.detail(wallet ?? ""),
    queryFn: () => fetchVerification(wallet!),
    enabled: !!wallet,
    staleTime: 30_000,
  });
}

export function useLinkProviderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ wallet, provider, handle }: { wallet: string; provider: string; handle: string }) =>
      postLinkProvider(wallet, provider, handle),
    onSuccess: (_data, { wallet }) => {
      qc.invalidateQueries({ queryKey: verificationKeys.detail(wallet) });
      // Invalidate reputation so score reflects new bonus
      qc.invalidateQueries({ queryKey: reputationKeys.detail(wallet) });
    },
  });
}

export function useUnlinkProviderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ wallet, provider }: { wallet: string; provider: string }) =>
      deleteLinkProvider(wallet, provider),
    onSuccess: (_data, { wallet }) => {
      qc.invalidateQueries({ queryKey: verificationKeys.detail(wallet) });
      qc.invalidateQueries({ queryKey: reputationKeys.detail(wallet) });
    },
  });
}
