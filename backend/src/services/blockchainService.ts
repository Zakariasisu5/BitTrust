import axios from "axios";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { getRedisClient } from "../database/store";

export interface RawWalletStats {
  walletAgeDays: number;
  transactionCount: number;
  transactionVolumeStx: number;
  protocolInteractions: number;
}

const STACKS_API = env.stacksApi.replace(/\/+$/, "");
const CACHE_TTL_SECONDS = 300;

const cacheKey = (wallet: string): string => `wallet-stats:${wallet}`;

const parseBigIntString = (value: unknown): bigint => {
  if (typeof value === "string") {
    try {
      return BigInt(value);
    } catch {
      return BigInt(0);
    }
  }
  return BigInt(0);
};

export const fetchWalletStats = async (wallet: string): Promise<RawWalletStats> => {
  const trimmed = wallet.trim();
  if (!trimmed) {
    throw new Error("Wallet address is required");
  }

  const redis = await getRedisClient();
  if (redis) {
    try {
      const cached = await redis.get(cacheKey(trimmed));
      if (cached) {
        return JSON.parse(cached) as RawWalletStats;
      }
    } catch (error) {
      logger.warn("Failed to read wallet stats from Redis", { error: String(error) });
    }
  }

  const limit = 100;

  const [txsRes, balancesRes] = await Promise.all([
    axios.get(`${STACKS_API}/extended/v2/addresses/${trimmed}/transactions`, {
      params: { limit, offset: 0 },
      timeout: 8000,
      validateStatus: (s: number) => (s >= 200 && s < 300) || s === 400 || s === 404,
    }),
    axios.get(`${STACKS_API}/extended/v2/addresses/${trimmed}/balances/stx`, {
      timeout: 8000,
      validateStatus: (s: number) => (s >= 200 && s < 300) || s === 400 || s === 404,
    }),
  ]);

  const txData = txsRes.status >= 200 && txsRes.status < 300 ? txsRes.data : null;
  const txResults: any[] = Array.isArray(txData?.results) ? txData.results : [];
  const totalCount: number = Number(txData?.total ?? txResults.length) || txResults.length;

  let firstBlockTimeIso: string | null = null;
  for (let i = txResults.length - 1; i >= 0; i -= 1) {
    const iso = txResults[i]?.block_time_iso as string | undefined;
    if (iso) {
      firstBlockTimeIso = iso;
    }
  }

  let walletAgeDays = 0;
  if (firstBlockTimeIso) {
    const first = new Date(firstBlockTimeIso).getTime();
    const now = Date.now();
    if (Number.isFinite(first)) {
      walletAgeDays = Math.max(0, Math.round((now - first) / (1000 * 60 * 60 * 24)));
    }
  }

  const stxTotals = balancesRes.status >= 200 && balancesRes.status < 300 ? balancesRes.data ?? {} : {};
  // `/balances/stx` sometimes doesn't include lifetime totals. Fall back to current balance.
  const totalSent = parseBigIntString(stxTotals.total_sent);
  const totalReceived = parseBigIntString(stxTotals.total_received);
  const balance = parseBigIntString(stxTotals.balance);
  const volumeMicro = totalSent + totalReceived || balance;
  const transactionVolumeStx = Number(volumeMicro) / 1_000_000;

  const protocols = new Set<string>();
  for (const tx of txResults) {
    if (tx?.tx_type === "contract_call" && tx?.contract_call) {
      const addr = tx.contract_call.contract_id as string | undefined;
      if (addr) protocols.add(addr);
    }
  }

  const stats: RawWalletStats = {
    walletAgeDays,
    transactionCount: totalCount,
    transactionVolumeStx: Number.isFinite(transactionVolumeStx) ? transactionVolumeStx : 0,
    protocolInteractions: protocols.size,
  };

  if (redis) {
    try {
      await redis.set(cacheKey(trimmed), JSON.stringify(stats), {
        EX: CACHE_TTL_SECONDS,
      });
    } catch (error) {
      logger.warn("Failed to write wallet stats to Redis", { error: String(error) });
    }
  }

  return stats;
};

