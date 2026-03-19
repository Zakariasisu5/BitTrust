"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = exports.store = void 0;
const logger_1 = require("../utils/logger");
const env_1 = require("../config/env");
const redis_1 = require("redis");
class InMemoryStore {
    constructor() {
        this.scores = new Map();
        this.history = new Map();
    }
    upsertScore(score) {
        this.scores.set(score.wallet, score);
        const entries = this.history.get(score.wallet) ?? [];
        entries.push(score);
        this.history.set(score.wallet, entries.slice(-100));
    }
    getScore(wallet) {
        return this.scores.get(wallet);
    }
    getHistory(wallet) {
        return this.history.get(wallet) ?? [];
    }
    getAllScores() {
        return Array.from(this.scores.values());
    }
}
exports.store = new InMemoryStore();
let redisClient = null;
const getRedisClient = async () => {
    if (!env_1.env.enableRedis || !env_1.env.redisUrl)
        return null;
    if (redisClient)
        return redisClient;
    try {
        redisClient = (0, redis_1.createClient)({ url: env_1.env.redisUrl });
        redisClient.on("error", (err) => {
            logger_1.logger.error("Redis client error", { err: String(err) });
        });
        await redisClient.connect();
        logger_1.logger.info("Connected to Redis");
        return redisClient;
    }
    catch (error) {
        logger_1.logger.warn("Failed to connect to Redis. Falling back to in-memory cache.", {
            error: String(error),
        });
        redisClient = null;
        return null;
    }
};
exports.getRedisClient = getRedisClient;
