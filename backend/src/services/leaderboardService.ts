import type { WalletScore } from "../models/walletScore";
import { store } from "../database/store";

const DEFAULT_LIMIT = 50;

export const updateWalletScore = (score: WalletScore): void => {
  store.upsertScore(score);
};

export const getWalletScore = (wallet: string): WalletScore | undefined => {
  return store.getScore(wallet);
};

export const getWalletHistory = (wallet: string): WalletScore[] => {
  return store.getHistory(wallet);
};

export const getLeaderboard = (limit = DEFAULT_LIMIT): WalletScore[] => {
  const scores = store.getAllScores();
  return scores
    .slice()
    .sort((a, b) => b.reputationScore - a.reputationScore)
    .slice(0, limit);
};

