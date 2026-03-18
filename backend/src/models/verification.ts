export type ProviderType = "github" | "twitter" | "discord" | "bns";

export interface VerifiedProvider {
  provider: ProviderType;
  handle: string;       // e.g. "@user", "user.btc", "github.com/user"
  verifiedAt: string;   // ISO timestamp
  bonus: number;        // score points added (0–100 scale contribution)
}

export interface WalletVerification {
  wallet: string;
  providers: VerifiedProvider[];
  totalBonus: number;   // sum of all provider bonuses
}

// Provider bonus values (on 0–100 score scale)
export const PROVIDER_BONUS: Record<ProviderType, number> = {
  github:  8,   // +80 display pts
  bns:     10,  // +100 display pts (strongest — on-chain provable)
  twitter: 4,   // +40 display pts
  discord: 3,   // +30 display pts
};
