"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboardHandler = exports.getReputationHistory = exports.postUpdateReputation = exports.getReputation = void 0;
const blockchainService_1 = require("../services/blockchainService");
const scoringEngine_1 = require("../services/scoringEngine");
const trustLevel_1 = require("../utils/trustLevel");
const leaderboardService_1 = require("../services/leaderboardService");
const store_1 = require("../database/store");
const logger_1 = require("../utils/logger");
const verificationService_1 = require("../services/verificationService");
const CACHE_TTL_SECONDS = 300;
const cacheKey = (wallet) => `score:${wallet}`;
function resolveNetwork(query) {
    return query === "mainnet" ? "mainnet" : "testnet";
}
async function computeScore(wallet, network) {
    const activity = await (0, blockchainService_1.fetchWalletActivity)(wallet, network);
    const result = (0, scoringEngine_1.calculateReputationScore)(activity);
    const { trustLevel, loanEligibility } = (0, trustLevel_1.assessTrust)(result.score);
    const verificationBonus = (0, verificationService_1.getVerificationBonus)(wallet);
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
function buildResponse(score) {
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
const getReputation = async (req, res, next) => {
    try {
        const wallet = req.params.wallet.trim();
        const network = resolveNetwork(req.query.network);
        const redis = await (0, store_1.getRedisClient)();
        if (redis) {
            try {
                const cached = await redis.get(cacheKey(wallet));
                if (cached) {
                    return res.json(JSON.parse(cached));
                }
            }
            catch (e) {
                logger_1.logger.warn("Redis read failed", { error: String(e) });
            }
        }
        const existing = (0, leaderboardService_1.getWalletScore)(wallet);
        if (existing) {
            return res.json(buildResponse(existing));
        }
        const score = await computeScore(wallet, network);
        (0, leaderboardService_1.updateWalletScore)(score);
        const response = buildResponse(score);
        if (redis) {
            try {
                await redis.set(cacheKey(wallet), JSON.stringify(response), {
                    EX: CACHE_TTL_SECONDS,
                });
            }
            catch (e) {
                logger_1.logger.warn("Redis write failed", { error: String(e) });
            }
        }
        logger_1.logger.info("Reputation computed", { wallet, score: score.reputationScore, tier: score.tier });
        return res.json(response);
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
            return res.status(400).json({ error: { message: "wallet is required" } });
        }
        const network = resolveNetwork(req.query.network);
        const score = await computeScore(wallet, network);
        (0, leaderboardService_1.updateWalletScore)(score);
        const redis = await (0, store_1.getRedisClient)();
        if (redis) {
            try {
                await redis.del(cacheKey(wallet));
            }
            catch (e) {
                logger_1.logger.warn("Redis del failed", { error: String(e) });
            }
        }
        logger_1.logger.info("Reputation updated", { wallet, score: score.reputationScore, tier: score.tier });
        return res.json(buildResponse(score));
    }
    catch (error) {
        return next(error);
    }
};
exports.postUpdateReputation = postUpdateReputation;
const getReputationHistory = async (req, res, next) => {
    try {
        const wallet = req.params.wallet.trim();
        const history = (0, leaderboardService_1.getWalletHistory)(wallet);
        return res.json(history.map(buildResponse));
    }
    catch (error) {
        return next(error);
    }
};
exports.getReputationHistory = getReputationHistory;
const getLeaderboardHandler = async (req, res, next) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 50, 100);
        const scores = (0, leaderboardService_1.getLeaderboard)(limit);
        return res.json(scores.map((s) => ({
            wallet: s.wallet,
            reputationScore: s.reputationScore,
            tier: s.tier,
            tierLabel: s.tierLabel,
            trustLevel: s.trustLevel,
            loanEligibility: s.loanEligibility,
            lastUpdated: s.lastUpdated,
        })));
    }
    catch (error) {
        return next(error);
    }
};
exports.getLeaderboardHandler = getLeaderboardHandler;
