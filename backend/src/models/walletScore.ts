export interface WalletMetrics {
  walletAgeDays: number;
  transactionCount: number;
  transactionVolumeStx: number;
  protocolInteractions: number;
}

export interface WalletScore {
  wallet: string;
  reputationScore: number;
  trustLevel: string;
  loanEligibility: boolean;
  lastUpdated: string;
  metrics: WalletMetrics;
}

