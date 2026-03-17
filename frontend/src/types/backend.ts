export interface ScoreFactor {
  name: string;
  label: string;
  raw: string;
  contribution: number;
  max: number;
  description: string;
}

export interface ScoreBreakdown {
  walletAge: number;
  txQuality: number;
  defiActivity: number;
  communityEngagement: number;
}

export interface ReputationResponse {
  wallet: string;
  reputationScore: number;
  tier: string;
  tierLabel: string;
  trustLevel: string;
  loanEligibility: boolean;
  explanation: string;
  factors: ScoreFactor[];
  breakdown: ScoreBreakdown;
  metadata: {
    network: string;
    totalTxsAnalyzed: number;
  };
  lastUpdated: string;
}
