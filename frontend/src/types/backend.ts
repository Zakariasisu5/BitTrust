export interface WalletMetrics {
  walletAgeDays: number;
  transactionCount: number;
  transactionVolumeStx: number;
  protocolInteractions: number;
}

export interface ReputationResponse {
  wallet: string;
  reputationScore: number;
  trustLevel: string;
  loanEligibility: boolean;
  lastUpdated: string;
  metrics?: WalletMetrics;
}
