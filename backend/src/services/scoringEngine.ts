import type { RawWalletStats } from "./blockchainService";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const normalize = (value: number, max: number): number => {
  if (!Number.isFinite(value) || value <= 0) return 0;
  if (value >= max) return 100;
  return (value / max) * 100;
};

export interface ScoreBreakdown {
  walletAgeScore: number;
  txCountScore: number;
  volumeScore: number;
  protocolScore: number;
  finalScore: number;
}

export const calculateReputationScore = (stats: RawWalletStats): ScoreBreakdown => {
  const walletAgeScore = normalize(stats.walletAgeDays, 365); // cap at 1 year
  const txCountScore = normalize(stats.transactionCount, 500); // cap at 500 txs
  const volumeScore = normalize(stats.transactionVolumeStx, 10_000); // cap at 10k STX
  const protocolScore = normalize(stats.protocolInteractions, 50); // cap at 50 protocols

  const finalScoreRaw =
    walletAgeScore * 0.2 +
    txCountScore * 0.25 +
    volumeScore * 0.25 +
    protocolScore * 0.3;

  const finalScore = clamp(Math.round(finalScoreRaw), 0, 100);

  return {
    walletAgeScore,
    txCountScore,
    volumeScore,
    protocolScore,
    finalScore,
  };
};

