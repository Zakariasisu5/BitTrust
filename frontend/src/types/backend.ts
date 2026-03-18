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

export type ProviderType = "github" | "twitter" | "discord" | "bns";

export interface VerifiedProvider {
  provider: ProviderType;
  handle: string;
  verifiedAt: string;
  bonus: number;
}

export interface WalletVerification {
  wallet: string;
  providers: VerifiedProvider[];
  totalBonus: number;
}
