"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = exports.getWalletHistory = exports.getWalletScore = exports.updateWalletScore = void 0;
const store_1 = require("../database/store");
const DEFAULT_LIMIT = 50;
const updateWalletScore = (score) => {
    store_1.store.upsertScore(score);
};
exports.updateWalletScore = updateWalletScore;
const getWalletScore = (wallet) => {
    return store_1.store.getScore(wallet);
};
exports.getWalletScore = getWalletScore;
const getWalletHistory = (wallet) => {
    return store_1.store.getHistory(wallet);
};
exports.getWalletHistory = getWalletHistory;
const getLeaderboard = (limit = DEFAULT_LIMIT) => {
    const scores = store_1.store.getAllScores();
    return scores
        .slice()
        .sort((a, b) => b.reputationScore - a.reputationScore)
        .slice(0, limit);
};
exports.getLeaderboard = getLeaderboard;
