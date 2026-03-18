import { apiFetch } from "./api";
import type { ReputationResponse, WalletVerification } from "@/types/backend";

export async function fetchReputation(wallet: string, network: string): Promise<ReputationResponse> {
  return apiFetch<ReputationResponse>(`/api/reputation/${encodeURIComponent(wallet)}?network=${network}`);
}

export async function fetchReputationHistory(
  wallet: string,
  network: string
): Promise<ReputationResponse[]> {
  return apiFetch<ReputationResponse[]>(
    `/api/reputation/history/${encodeURIComponent(wallet)}?network=${network}`
  );
}

export async function fetchLeaderboard(network: string): Promise<ReputationResponse[]> {
  return apiFetch<ReputationResponse[]>(`/api/leaderboard?network=${network}`);
}

export async function postUpdateReputation(
  wallet: string,
  network: string
): Promise<ReputationResponse> {
  return apiFetch<ReputationResponse>(`/api/reputation/update?network=${network}`, {
    method: "POST",
    body: JSON.stringify({ wallet }),
  });
}

export async function fetchVerification(wallet: string): Promise<WalletVerification> {
  return apiFetch<WalletVerification>(`/api/verification/${encodeURIComponent(wallet)}`);
}

export async function postLinkProvider(
  wallet: string,
  provider: string,
  handle: string,
): Promise<{ success: boolean; verification: WalletVerification["providers"][0]; bonus: number }> {
  return apiFetch("/api/verification/link", {
    method: "POST",
    body: JSON.stringify({ wallet, provider, handle }),
  });
}

export async function deleteLinkProvider(
  wallet: string,
  provider: string,
): Promise<{ success: boolean }> {
  return apiFetch("/api/verification/unlink", {
    method: "DELETE",
    body: JSON.stringify({ wallet, provider }),
  });
}
