"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboardHandler = exports.getReputationHistory = exports.postUpdateReputation = exports.getReputation = void 0;
const blockchainService_1 = require("../services/blockchainService");
const scoringEngine_1 = require("../services/scoringEngine");
const trustLevel_1 = require("../utils/trustLevel");
const leaderboardService_1 = require("../services/leaderboardService");
const logger_1 = require("../utils/logger");
const buildWalletResponse = (score) => ({
    wallet: score.wallet,
    reputationScore: score.reputationScore,
    trustLevel: score.trustLevel,
    loanEligibility: score.loanEligibility,
    lastUpdated: score.lastUpdated,
});
const getReputation = async (req, res, next) => {
    try {
        const wallet = req.params.wallet;
        const existing = (0, leaderboardService_1.getWalletScore)(wallet);
        if (existing) {
            return res.json(buildWalletResponse(existing));
        }
        const stats = await (0, blockchainService_1.fetchWalletStats)(wallet);
        const breakdown = (0, scoringEngine_1.calculateReputationScore)(stats);
        const { trustLevel, loanEligibility } = (0, trustLevel_1.assessTrust)(breakdown.finalScore);
        const nowIso = new Date().toISOString();
        const score = {
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
        (0, leaderboardService_1.updateWalletScore)(score);
        logger_1.logger.info("Reputation calculated", { wallet, score: score.reputationScore });
        return res.json(buildWalletResponse(score));
    }
    catch (error) {
        return next(error);
    }
};
exports.getReputation = getReputation;
const postUpdateReputation = async (req, res, next) => {
    try {
        const wallet = req.body?.wallet?.trim();
        if (!wallet) {
            return res.status(400).json({
                error: { message: "wallet is required" },
            });
        }
        const stats = await (0, blockchainService_1.fetchWalletStats)(wallet);
        const breakdown = (0, scoringEngine_1.calculateReputationScore)(stats);
        const { trustLevel, loanEligibility } = (0, trustLevel_1.assessTrust)(breakdown.finalScore);
        const nowIso = new Date().toISOString();
        const score = {
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
        (0, leaderboardService_1.updateWalletScore)(score);
        logger_1.logger.info("Reputation updated via POST", {
            wallet,
            score: score.reputationScore,
        });
        return res.json(buildWalletResponse(score));
    }
    catch (error) {
        return next(error);
    }
};
exports.postUpdateReputation = postUpdateReputation;
const getReputationHistory = async (req, res, next) => {
    try {
        const wallet = req.params.wallet;
        const history = (0, leaderboardService_1.getWalletHistory)(wallet);
        return res.json(history.map((entry) => ({
            wallet: entry.wallet,
            reputationScore: entry.reputationScore,
            trustLevel: entry.trustLevel,
            loanEligibility: entry.loanEligibility,
            lastUpdated: entry.lastUpdated,
            metrics: entry.metrics,
        })));
    }
    catch (error) {
        return next(error);
    }
};
exports.getReputationHistory = getReputationHistory;
const getLeaderboardHandler = async (_req, res, next) => {
    try {
        const scores = (0, leaderboardService_1.getLeaderboard)();
        return res.json(scores.map((entry) => ({
            wallet: entry.wallet,
            reputationScore: entry.reputationScore,
            trustLevel: entry.trustLevel,
            loanEligibility: entry.loanEligibility,
            lastUpdated: entry.lastUpdated,
        })));
    }
    catch (error) {
        return next(error);
    }
};
exports.getLeaderboardHandler = getLeaderboardHandler;
