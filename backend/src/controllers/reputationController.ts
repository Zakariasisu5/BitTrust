import type { Request, Response, NextFunction } from "express";
import { fetchWalletStats } from "../services/blockchainService";
import { calculateReputationScore } from "../services/scoringEngine";
import { assessTrust } from "../utils/trustLevel";
import {
  getLeaderboard,
  getWalletHistory,
  getWalletScore,
  updateWalletScore,
} from "../services/leaderboardService";
import type { WalletScore } from "../models/walletScore";
import { logger } from "../utils/logger";

interface UpdateWalletBody {
  wallet: string;
}

const buildWalletResponse = (score: WalletScore) => ({
  wallet: score.wallet,
  reputationScore: score.reputationScore,
  trustLevel: score.trustLevel,
  loanEligibility: score.loanEligibility,
  lastUpdated: score.lastUpdated,
});

export const getReputation = async (
  req: Request<{ wallet: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const wallet = req.params.wallet;
    const existing = getWalletScore(wallet);
    if (existing) {
      return res.json(buildWalletResponse(existing));
    }

    const stats = await fetchWalletStats(wallet);
    const breakdown = calculateReputationScore(stats);
    const { trustLevel, loanEligibility } = assessTrust(breakdown.finalScore);

    const nowIso = new Date().toISOString();

    const score: WalletScore = {
      wallet,
      reputationScore: breakdown.finalScore,
      trustLevel,
      loanEligibility,
      lastUpdated: nowIso,
      metrics: {
        walletAgeDays: stats.walletAgeDays,
        transactionCount: stats.transactionCount,
        transactionVolumeStx: stats.transactionVolumeStx,
        protocolInteractions: stats.protocolInteractions,
      },
    };

    updateWalletScore(score);

    logger.info("Reputation calculated", { wallet, score: score.reputationScore });

    return res.json(buildWalletResponse(score));
  } catch (error) {
    return next(error);
  }
};

export const postUpdateReputation = async (
  req: Request<unknown, unknown, UpdateWalletBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const wallet = req.body?.wallet?.trim();
    if (!wallet) {
      return res.status(400).json({
        error: { message: "wallet is required" },
      });
    }

    const stats = await fetchWalletStats(wallet);
    const breakdown = calculateReputationScore(stats);
    const { trustLevel, loanEligibility } = assessTrust(breakdown.finalScore);

    const nowIso = new Date().toISOString();

    const score: WalletScore = {
      wallet,
      reputationScore: breakdown.finalScore,
      trustLevel,
      loanEligibility,
      lastUpdated: nowIso,
      metrics: {
        walletAgeDays: stats.walletAgeDays,
        transactionCount: stats.transactionCount,
        transactionVolumeStx: stats.transactionVolumeStx,
        protocolInteractions: stats.protocolInteractions,
      },
    };

    updateWalletScore(score);

    logger.info("Reputation updated via POST", {
      wallet,
      score: score.reputationScore,
    });

    return res.json(buildWalletResponse(score));
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
    const wallet = req.params.wallet;
    const history = getWalletHistory(wallet);
    return res.json(
      history.map((entry) => ({
        wallet: entry.wallet,
        reputationScore: entry.reputationScore,
        trustLevel: entry.trustLevel,
        loanEligibility: entry.loanEligibility,
        lastUpdated: entry.lastUpdated,
        metrics: entry.metrics,
      })),
    );
  } catch (error) {
    return next(error);
  }
};

export const getLeaderboardHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const scores = getLeaderboard();
    return res.json(
      scores.map((entry) => ({
        wallet: entry.wallet,
        reputationScore: entry.reputationScore,
        trustLevel: entry.trustLevel,
        loanEligibility: entry.loanEligibility,
        lastUpdated: entry.lastUpdated,
      })),
    );
  } catch (error) {
    return next(error);
  }
};

