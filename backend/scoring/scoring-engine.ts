/**
 * BitTrust – Reputation Scoring Engine
 *
 * Converts raw WalletActivity into a normalized 0–100 score.
 *
 * Weight breakdown (matches docs/bittrust.md):
 *   Wallet Age & Stability     → 20%
 *   Transaction Quality        → 25%
 *   DeFi / Contract Activity   → 35%
 *   Governance & Community     → 20%  (proxied via contract diversity + balance signals)
 *
 * Each factor is independently capped and normalized to [0, 1] before
 * applying its weight. This prevents any single signal from dominating.
 */

import type { WalletActivity } from "./stacks-fetcher";

export interface ScoreFactor {
  name: string;
  label: string;
  raw: string; // human-readable raw value
  contribution: number; // points added to final score (0–weighted_max)
  max: number; // max possible contribution from this factor
  description: string;
}

export interface ScoringResult {
  score: number; // 0–100, integer
  tier: string; // A+, A, B, C
  tierLabel: string;
  factors: ScoreFactor[];
  explanation: string; // plain-language summary
  breakdown: {
    walletAge: number;
    txQuality: number;
    defiActivity: number;
    communityEngagement: number;
  };
  metadata: {
    address: string;
    network: string;
    totalTxsAnalyzed: number;
    scoredAt: number;
  };
}

// ── Per-factor scoring helpers ────────────────────────────────────────────────

/**
 * Wallet Age & Stability (weight: 20 pts)
 * - 0–30 days:   low (0–5 pts)
 * - 30–180 days: growing (5–12 pts)
 * - 180–365 days: established (12–17 pts)
 * - 365+ days:  veteran (17–20 pts)
 */
function scoreWalletAge(ageDays: number): number {
  if (ageDays <= 0) return 0;
  if (ageDays < 30) return Math.round((ageDays / 30) * 5);
  if (ageDays < 180) return 5 + Math.round(((ageDays - 30) / 150) * 7);
  if (ageDays < 365) return 12 + Math.round(((ageDays - 180) / 185) * 5);
  // Veteran: scale up to 1095 days (3 years) for full 20 pts
  return Math.min(20, 17 + Math.round(((ageDays - 365) / 730) * 3));
}

/**
 * Transaction Quality (weight: 25 pts)
 * Based on: total tx count + success rate
 *   - Volume score:  up to 15 pts (capped at 200 txs)
 *   - Quality score: up to 10 pts (success rate)
 */
function scoreTxQuality(
  totalTx: number,
  successfulTx: number,
  failedTx: number,
): number {
  if (totalTx === 0) return 0;

  // Volume component (0–15)
  const volumePts = Math.min(
    15,
    Math.round((Math.min(totalTx, 200) / 200) * 15),
  );

  // Success rate component (0–10)
  const successRate = successfulTx / (successfulTx + failedTx + 1);
  const qualityPts = Math.round(successRate * 10);

  return volumePts + qualityPts;
}

/**
 * DeFi & Contract Activity (weight: 35 pts)
 * - Contract call ratio (contract calls / total txs): up to 15 pts
 * - DeFi participation bonus: +15 pts
 * - Contract diversity (unique contracts): up to 5 pts
 */
function scoreDefiActivity(
  totalTx: number,
  contractCallCount: number,
  hasDefiActivity: boolean,
  uniqueContracts: number,
): number {
  if (totalTx === 0) return 0;

  // Contract call ratio (0–15)
  const ratio = contractCallCount / Math.max(totalTx, 1);
  const ratioPts = Math.round(Math.min(ratio, 1) * 15);

  // DeFi participation (0–15)
  const defiPts = hasDefiActivity ? 15 : 0;

  // Contract diversity (0–5)
  const diversityPts = Math.min(5, uniqueContracts);

  return ratioPts + defiPts + diversityPts;
}

/**
 * Community Engagement (weight: 20 pts)
 * Proxied signals (governance data not available via basic Stacks API):
 * - STX balance tier: up to 10 pts (skin in the game)
 * - Account longevity bonus (consistent activity): up to 10 pts
 */
function scoreCommunityEngagement(
  stxBalance: bigint,
  walletAgeDays: number,
  totalTx: number,
): number {
  // Balance tier (in STX: 1 STX = 1_000_000 microSTX)
  const stx = Number(stxBalance) / 1_000_000;
  let balancePts = 0;
  if (stx >= 10000) balancePts = 10;
  else if (stx >= 1000) balancePts = 7;
  else if (stx >= 100) balancePts = 4;
  else if (stx >= 10) balancePts = 2;
  else if (stx > 0) balancePts = 1;

  // Consistent activity: age > 90 days AND tx count > 20
  const activityPts =
    walletAgeDays > 90 && totalTx > 20
      ? Math.min(10, Math.round((Math.min(totalTx, 100) / 100) * 10))
      : 0;

  return balancePts + activityPts;
}

// ── Tier mapping ──────────────────────────────────────────────────────────────

function getTier(score: number): { tier: string; tierLabel: string } {
  if (score >= 81) return { tier: "A+", tierLabel: "Highly Trusted" };
  if (score >= 61) return { tier: "A", tierLabel: "Trusted / Low Risk" };
  if (score >= 31) return { tier: "B", tierLabel: "Medium Risk" };
  return { tier: "C", tierLabel: "High Risk" };
}

// ── Explanation generator ─────────────────────────────────────────────────────

function generateExplanation(
  score: number,
  activity: WalletActivity,
  breakdown: ScoringResult["breakdown"],
): string {
  const parts: string[] = [];

  if (activity.walletAgeDays < 30) {
    parts.push("This wallet is relatively new (under 30 days old).");
  } else if (activity.walletAgeDays > 365) {
    parts.push(
      `Wallet has ${Math.floor(activity.walletAgeDays / 365)} year(s) of on-chain history.`,
    );
  }

  if (activity.totalTxCount === 0) {
    parts.push("No transaction history detected on this network.");
  } else if (activity.totalTxCount > 50) {
    parts.push(
      `High transaction volume (${activity.totalTxCount}+ txs analyzed).`,
    );
  }

  if (activity.hasDefiActivity) {
    parts.push("DeFi protocol interactions detected — positive signal.");
  }

  if (breakdown.txQuality >= 20) {
    parts.push("Strong transaction success rate.");
  }

  if (score >= 70) {
    parts.push("Overall: reliable wallet with established on-chain presence.");
  } else if (score >= 40) {
    parts.push(
      "Overall: moderate on-chain activity. Continued participation will improve score.",
    );
  } else {
    parts.push("Overall: limited on-chain history detected on this network.");
  }

  return parts.join(" ");
}

// ── Main export ───────────────────────────────────────────────────────────────

export function calculateReputationScore(
  activity: WalletActivity,
): ScoringResult {
  const walletAge = scoreWalletAge(activity.walletAgeDays);
  const txQuality = scoreTxQuality(
    activity.totalTxCount,
    activity.successfulTxCount,
    activity.failedTxCount,
  );
  const defiActivity = scoreDefiActivity(
    activity.totalTxCount,
    activity.contractCallCount,
    activity.hasDefiActivity,
    activity.uniqueContractsInteracted,
  );
  const communityEngagement = scoreCommunityEngagement(
    activity.stxBalance,
    activity.walletAgeDays,
    activity.totalTxCount,
  );

  const rawScore = walletAge + txQuality + defiActivity + communityEngagement;
  // Final score is capped at 100 (shouldn't exceed, but safety clamp)
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  const { tier, tierLabel } = getTier(score);

  const breakdown = { walletAge, txQuality, defiActivity, communityEngagement };

  const factors: ScoreFactor[] = [
    {
      name: "WALLET_AGE_STABILITY",
      label: "Wallet Age & Stability",
      raw: `${activity.walletAgeDays} days`,
      contribution: walletAge,
      max: 20,
      description: "Time elapsed since first on-chain transaction.",
    },
    {
      name: "TX_SUCCESS_VELOCITY",
      label: "Transaction Quality",
      raw: `${activity.totalTxCount} txs (${activity.successfulTxCount} success)`,
      contribution: txQuality,
      max: 25,
      description: "Ratio of successful vs failed transactions + volume.",
    },
    {
      name: "DEFI_CONTRACT_ACTIVITY",
      label: "DeFi & Contract Activity",
      raw: `${activity.contractCallCount} contract calls${activity.hasDefiActivity ? " + DeFi" : ""}`,
      contribution: defiActivity,
      max: 35,
      description:
        "Smart contract interactions, DeFi participation, protocol diversity.",
    },
    {
      name: "COMMUNITY_ENGAGEMENT",
      label: "Community Engagement",
      raw: `${(Number(activity.stxBalance) / 1_000_000).toFixed(2)} STX balance`,
      contribution: communityEngagement,
      max: 20,
      description: "STX holdings and consistent long-term participation.",
    },
  ];

  return {
    score,
    tier,
    tierLabel,
    factors,
    explanation: generateExplanation(score, activity, breakdown),
    breakdown,
    metadata: {
      address: activity.address,
      network: activity.network,
      totalTxsAnalyzed: activity.totalTxCount,
      scoredAt: Date.now(),
    },
  };
}
