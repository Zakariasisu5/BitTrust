import "dotenv/config";

export interface EnvConfig {
  nodeEnv: string;
  port: number;
  stacksApiTestnet: string;
  stacksApiMainnet: string;
  frontendUrl: string | undefined;
  redisUrl: string | undefined;
  enableRedis: boolean;
}

const toNumber = (value: string | undefined, fallback: number): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const getBoolean = (value: string | undefined, fallback = false): boolean => {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};

export const env: EnvConfig = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: toNumber(process.env.PORT, 5000),
  stacksApiTestnet: process.env.STACKS_API_TESTNET ?? "https://api.testnet.hiro.so",
  stacksApiMainnet: process.env.STACKS_API_MAINNET ?? "https://api.hiro.so",
  frontendUrl: process.env.FRONTEND_URL,
  redisUrl: process.env.REDIS_URL,
  enableRedis: getBoolean(process.env.REDIS_ENABLED, !!process.env.REDIS_URL),
};
