import type { WalletScore } from "../models/walletScore";
import { logger } from "../utils/logger";
import { env } from "../config/env";
import { createClient, type RedisClientType } from "redis";

type WalletHistoryEntry = WalletScore;

class InMemoryStore {
  private scores = new Map<string, WalletScore>();
  private history = new Map<string, WalletHistoryEntry[]>();

  upsertScore(score: WalletScore): void {
    this.scores.set(score.wallet, score);
    const entries = this.history.get(score.wallet) ?? [];
    entries.push(score);
    this.history.set(score.wallet, entries.slice(-100));
  }

  getScore(wallet: string): WalletScore | undefined {
    return this.scores.get(wallet);
  }

  getHistory(wallet: string): WalletHistoryEntry[] {
    return this.history.get(wallet) ?? [];
  }

  getAllScores(): WalletScore[] {
    return Array.from(this.scores.values());
  }
}

export const store = new InMemoryStore();

let redisClient: RedisClientType | null = null;

export const getRedisClient = async (): Promise<RedisClientType | null> => {
  if (!env.enableRedis || !env.redisUrl) return null;
  if (redisClient) return redisClient;

  try {
    redisClient = createClient({ url: env.redisUrl });
    redisClient.on("error", (err) => {
      logger.error("Redis client error", { err: String(err) });
    });
    await redisClient.connect();
    logger.info("Connected to Redis");
    return redisClient;
  } catch (error) {
    logger.warn("Failed to connect to Redis. Falling back to in-memory cache.", {
      error: String(error),
    });
    redisClient = null;
    return null;
  }
};

