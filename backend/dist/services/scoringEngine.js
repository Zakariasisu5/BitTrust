"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateReputationScore = void 0;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const normalize = (value, max) => {
    if (!Number.isFinite(value) || value <= 0)
        return 0;
    if (value >= max)
        return 100;
    return (value / max) * 100;
};
const calculateReputationScore = (stats) => {
    const walletAgeScore = normalize(stats.walletAgeDays, 365); // cap at 1 year
    const txCountScore = normalize(stats.transactionCount, 500); // cap at 500 txs
    const volumeScore = normalize(stats.transactionVolumeStx, 10000); // cap at 10k STX
    const protocolScore = normalize(stats.protocolInteractions, 50); // cap at 50 protocols
    const finalScoreRaw = walletAgeScore * 0.2 +
        txCountScore * 0.25 +
        volumeScore * 0.25 +
        protocolScore * 0.3;
    const finalScore = clamp(Math.round(finalScoreRaw), 0, 100);
    return {
        walletAgeScore,
        txCountScore,
        volumeScore,
        protocolScore,
        finalScore,
    };
};
exports.calculateReputationScore = calculateReputationScore;
