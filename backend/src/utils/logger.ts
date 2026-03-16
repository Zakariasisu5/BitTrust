export type LogLevel = "debug" | "info" | "warn" | "error";

const formatMessage = (level: LogLevel, message: string, meta?: unknown): string => {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level.toUpperCase()}] ${message}`;
  if (meta === undefined) return base;
  try {
    return `${base} ${JSON.stringify(meta)}`;
  } catch {
    return base;
  }
};

export const logger = {
  debug(message: string, meta?: unknown): void {
    if (process.env.NODE_ENV === "production") return;
    // eslint-disable-next-line no-console
    console.debug(formatMessage("debug", message, meta));
  },
  info(message: string, meta?: unknown): void {
    // eslint-disable-next-line no-console
    console.info(formatMessage("info", message, meta));
  },
  warn(message: string, meta?: unknown): void {
    // eslint-disable-next-line no-console
    console.warn(formatMessage("warn", message, meta));
  },
  error(message: string, meta?: unknown): void {
    // eslint-disable-next-line no-console
    console.error(formatMessage("error", message, meta));
  },
};

