import type { ProviderType, VerifiedProvider, WalletVerification } from "../models/verification";
import { PROVIDER_BONUS } from "../models/verification";
import { logger } from "../utils/logger";

const store = new Map<string, Map<ProviderType, VerifiedProvider>>();

function getOrCreate(wallet: string): Map<ProviderType, VerifiedProvider> {
  if (!store.has(wallet)) store.set(wallet, new Map());
  return store.get(wallet)!;
}

export function linkProvider(
  wallet: string,
  provider: ProviderType,
  handle: string,
): VerifiedProvider {
  const walletMap = getOrCreate(wallet);
  const entry: VerifiedProvider = {
    provider,
    handle,
    verifiedAt: new Date().toISOString(),
    bonus: PROVIDER_BONUS[provider],
  };
  walletMap.set(provider, entry);
  logger.info("Provider linked", { wallet, provider, handle });
  return entry;
}

export function unlinkProvider(wallet: string, provider: ProviderType): void {
  store.get(wallet)?.delete(provider);
}

export function getVerification(wallet: string): WalletVerification {
  const walletMap = store.get(wallet);
  const providers = walletMap ? Array.from(walletMap.values()) : [];
  return {
    wallet,
    providers,
    totalBonus: providers.reduce((sum, p) => sum + p.bonus, 0),
  };
}

export function getVerificationBonus(wallet: string): number {
  return getVerification(wallet).totalBonus;
}
