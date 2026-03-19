"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const formatMessage = (level, message, meta) => {
    const ts = new Date().toISOString();
    const base = `[${ts}] [${level.toUpperCase()}] ${message}`;
    if (meta === undefined)
        return base;
    try {
        return `${base} ${JSON.stringify(meta)}`;
    }
    catch {
        return base;
    }
};
exports.logger = {
    debug(message, meta) {
        if (process.env.NODE_ENV === "production")
            return;
        // eslint-disable-next-line no-console
        console.debug(formatMessage("debug", message, meta));
    },
    info(message, meta) {
        // eslint-disable-next-line no-console
        console.info(formatMessage("info", message, meta));
    },
    warn(message, meta) {
        // eslint-disable-next-line no-console
        console.warn(formatMessage("warn", message, meta));
    },
    error(message, meta) {
        // eslint-disable-next-line no-console
        console.error(formatMessage("error", message, meta));
    },
};
