"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const toNumber = (value, fallback) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
};
const getBoolean = (value, fallback = false) => {
    if (value === undefined)
        return fallback;
    return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};
exports.env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: toNumber(process.env.PORT, 5000),
    stacksApi: process.env.STACKS_API ?? "https://api.testnet.hiro.so",
    frontendUrl: process.env.FRONTEND_URL,
    redisUrl: process.env.REDIS_URL,
    enableRedis: getBoolean(process.env.REDIS_ENABLED, !!process.env.REDIS_URL),
};
