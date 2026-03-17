import { apiFetch } from "./api";
import type { ReputationResponse } from "@/types/backend";

export async function fetchReputation(wallet: string): Promise<ReputationResponse> {
  return apiFetch<ReputationResponse>(`/api/reputation/${encodeURIComponent(wallet)}`);
}

export async function fetchReputationHistory(
  wallet: string
): Promise<ReputationResponse[]> {
  return apiFetch<ReputationResponse[]>(
    `/api/reputation/history/${encodeURIComponent(wallet)}`
  );
}

export async function fetchLeaderboard(): Promise<ReputationResponse[]> {
  return apiFetch<ReputationResponse[]>("/api/leaderboard");
}

export async function postUpdateReputation(
  wallet: string
): Promise<ReputationResponse> {
  return apiFetch<ReputationResponse>("/api/reputation/update", {
    method: "POST",
    body: JSON.stringify({ wallet }),
  });
}
