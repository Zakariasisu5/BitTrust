import type { Request, Response, NextFunction } from "express";
import { fetchWalletActivity, type NetworkMode } from "../services/blockchainService";
import { calculateReputationScore } from "../services/scoringEngine";
import { assessTrust } from "../utils/trustLevel";
import {
  getLeaderboard,
  getWalletHistory,
  getWalletScore,
  updateWalletScore,
} from "../services/leaderboardService";
import { getRedisClient } from "../database/store";
import type { WalletScore } from "../models/walletScore";
import { logger } from "../utils/logger";
import { getVerificationBonus } from "../services/verificationService";

const CACHE_TTL_SECONDS = 300;
const cacheKey = (wallet: string) => `score:${wallet}`;

function resolveNetwork(query: unknown): NetworkMode {
  return query === "mainnet" ? "mainnet" : "testnet";
}

async function computeScore(wallet: string, network: NetworkMode): Promise<WalletScore> {
  const activity = await fetchWalletActivity(wallet, network);
  const result = calculateReputationScore(activity);
  const { trustLevel, loanEligibility } = assessTrust(result.score);

  const verificationBonus = getVerificationBonus(wallet);
  const finalScore = Math.min(100, result.score + verificationBonus);

  return {
    wallet,
    reputationScore: finalScore,
    tier: result.tier,
    tierLabel: result.tierLabel,
    trustLevel,
    loanEligibility,
    explanation: result.explanation,
    factors: result.factors,
    breakdown: result.breakdown,
    metadata: result.metadata,
    lastUpdated: new Date().toISOString(),
  };
}

function buildResponse(score: WalletScore) {
  return {
    wallet: score.wallet,
    reputationScore: score.reputationScore,
    tier: score.tier,
    tierLabel: score.tierLabel,
    trustLevel: score.trustLevel,
    loanEligibility: score.loanEligibility,
    explanation: score.explanation,
    factors: score.factors,
    breakdown: score.breakdown,
    metadata: score.metadata,
    lastUpdated: score.lastUpdated,
  };
}

export const getReputation = async (
  req: Request<{ wallet: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const wallet = req.params.wallet.trim();
    const network = resolveNetwork(req.query.network);

    const redis = await getRedisClient();
    if (redis) {
      try {
        const cached = await redis.get(cacheKey(wallet));
        if (cached) {
          return res.json(JSON.parse(cached));
        }
      } catch (e) {
        logger.warn("Redis read failed", { error: String(e) });
      }
    }

    const existing = getWalletScore(wallet);
    if (existing) {
      return res.json(buildResponse(existing));
    }

    const score = await computeScore(wallet, network);
    updateWalletScore(score);

    const response = buildResponse(score);

    if (redis) {
      try {
        await redis.set(cacheKey(wallet), JSON.stringify(response), {
          EX: CACHE_TTL_SECONDS,
        });
      } catch (e) {
        logger.warn("Redis write failed", { error: String(e) });
      }
    }

    logger.info("Reputation computed", { wallet, score: score.reputationScore, tier: score.tier });
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

export const postUpdateReputation = async (
  req: Request<unknown, unknown, { wallet?: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const wallet = req.body?.wallet?.trim();
    if (!wallet) {
      return res.status(400).json({ error: { message: "wallet is required" } });
    }
    const network = resolveNetwork(req.query.network);

    const score = await computeScore(wallet, network);
    updateWalletScore(score);

    const redis = await getRedisClient();
    if (redis) {
      try {
        await redis.del(cacheKey(wallet));
      } catch (e) {
        logger.warn("Redis del failed", { error: String(e) });
      }
    }

    logger.info("Reputation updated", { wallet, score: score.reputationScore, tier: score.tier });
    return res.json(buildResponse(score));
  } catch (error) {
    return next(error);
  }
};

export const getReputationHistory = async (
  req: Request<{ wallet: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const wallet = req.params.wallet.trim();
    const history = getWalletHistory(wallet);
    return res.json(history.map(buildResponse));
  } catch (error) {
    return next(error);
  }
};

export const getLeaderboardHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const scores = getLeaderboard(limit);
    return res.json(
      scores.map((s) => ({
        wallet: s.wallet,
        reputationScore: s.reputationScore,
        tier: s.tier,
        tierLabel: s.tierLabel,
        trustLevel: s.trustLevel,
        loanEligibility: s.loanEligibility,
        lastUpdated: s.lastUpdated,
      })),
    );
  } catch (error) {
    return next(error);
  }
};
