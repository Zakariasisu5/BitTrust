"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = require("express-rate-limit");
const reputationRoutes_1 = __importDefault(require("./routes/reputationRoutes"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, helmet_1.default)());
const corsOptions = {
    origin: env_1.env.frontendUrl ?? "*",
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, compression_1.default)());
app.use(express_1.default.json());
// Logging
app.use((0, morgan_1.default)(env_1.env.nodeEnv === "production" ? "combined" : "dev", {
    stream: {
        write: (msg) => logger_1.logger.info(msg.trim()),
    },
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// Health check
app.get("/health", (_req, res) => {
    res.json({ status: "ok", env: env_1.env.nodeEnv });
});
// Mount BitTrust reputation routes
app.use("/api", reputationRoutes_1.default);
// 🔹 Temporary POST test for debugging
app.post("/api/test-post", (req, res) => {
    logger_1.logger.info("POST /api/test-post hit", { body: req.body });
    res.json({
        message: "POST route works!",
        received: req.body,
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: { message: "Not Found", path: req.path },
    });
});
// Global error handler
app.use((err, _req, res, _next) => {
    logger_1.logger.error("Unhandled error", { error: String(err) });
    const status = err?.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
    res.status(status).json({
        error: {
            message: err?.message ?? "Internal Server Error",
        },
    });
});
// Start server
const server = app.listen(env_1.env.port, () => {
    logger_1.logger.info(`BitTrust backend listening on port ${env_1.env.port}`);
});
// Handle port errors
server.on("error", (err) => {
    if (err?.code === "EADDRINUSE") {
        logger_1.logger.error(`Port ${env_1.env.port} is already in use.`, {
            hint: "Stop the existing process using the port or change PORT in backend/.env (e.g. 5001).",
        });
        process.exit(1);
    }
});
// Graceful shutdown
const shutdown = (signal) => {
    logger_1.logger.info(`Received ${signal}, shutting down gracefully...`);
    server.close(() => {
        logger_1.logger.info("HTTP server closed");
        process.exit(0);
    });
    setTimeout(() => {
        logger_1.logger.error("Forcing shutdown after timeout");
        process.exit(1);
    }, 10000).unref();
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
