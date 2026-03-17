import type { ScoreFactor } from "../services/scoringEngine";

export interface WalletScore {
  wallet: string;
  // 0–100 normalized score
  reputationScore: number;
  // Tier label from scoring engine (A+, A, B, C)
  tier: string;
  tierLabel: string;
  trustLevel: string;
  loanEligibility: boolean;
  explanation: string;
  factors: ScoreFactor[];
  breakdown: {
    walletAge: number;
    txQuality: number;
    defiActivity: number;
    communityEngagement: number;
  };
  metadata: {
    network: string;
    totalTxsAnalyzed: number;
  };
  lastUpdated: string;
}
