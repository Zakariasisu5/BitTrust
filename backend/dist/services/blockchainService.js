"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWalletStats = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const store_1 = require("../database/store");
const STACKS_API = env_1.env.stacksApi.replace(/\/+$/, "");
const CACHE_TTL_SECONDS = 300;
const cacheKey = (wallet) => `wallet-stats:${wallet}`;
const parseBigIntString = (value) => {
    if (typeof value === "string") {
        try {
            return BigInt(value);
        }
        catch {
            return BigInt(0);
        }
    }
    return BigInt(0);
};
const fetchWalletStats = async (wallet) => {
    const trimmed = wallet.trim();
    if (!trimmed) {
        throw new Error("Wallet address is required");
    }
    const redis = await (0, store_1.getRedisClient)();
    if (redis) {
        try {
            const cached = await redis.get(cacheKey(trimmed));
            if (cached) {
                return JSON.parse(cached);
            }
        }
        catch (error) {
            logger_1.logger.warn("Failed to read wallet stats from Redis", { error: String(error) });
        }
    }
    const limit = 100;
    const [txsRes, balancesRes] = await Promise.all([
        axios_1.default.get(`${STACKS_API}/extended/v2/addresses/${trimmed}/transactions`, {
            params: { limit, offset: 0 },
            timeout: 8000,
            validateStatus: (s) => (s >= 200 && s < 300) || s === 400 || s === 404,
        }),
        axios_1.default.get(`${STACKS_API}/extended/v2/addresses/${trimmed}/balances/stx`, {
            timeout: 8000,
            validateStatus: (s) => (s >= 200 && s < 300) || s === 400 || s === 404,
        }),
    ]);
    const txData = txsRes.status >= 200 && txsRes.status < 300 ? txsRes.data : null;
    const txResults = Array.isArray(txData?.results) ? txData.results : [];
    const totalCount = Number(txData?.total ?? txResults.length) || txResults.length;
    let firstBlockTimeIso = null;
    for (let i = txResults.length - 1; i >= 0; i -= 1) {
        const iso = txResults[i]?.block_time_iso;
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
    const transactionVolumeStx = Number(volumeMicro) / 1000000;
    const protocols = new Set();
    for (const tx of txResults) {
        if (tx?.tx_type === "contract_call" && tx?.contract_call) {
            const addr = tx.contract_call.contract_id;
            if (addr)
                protocols.add(addr);
        }
    }
    const stats = {
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
        }
        catch (error) {
            logger_1.logger.warn("Failed to write wallet stats to Redis", { error: String(error) });
        }
    }
    return stats;
};
exports.fetchWalletStats = fetchWalletStats;
