import express, { type Request, type Response, type NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import reputationRoutes from "./routes/reputationRoutes";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

const rawOrigin = env.frontendUrl ?? "*";
const allowedOrigin =
  rawOrigin === "*"
    ? "*"
    : (() => {
        try {
          const u = new URL(rawOrigin);
          return u.origin; // strips any path, always just scheme+host+port
        } catch {
          return rawOrigin;
        }
      })();

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigin,
};
app.use(cors(corsOptions));

app.use(compression());
app.use(express.json());

// Logging
app.use(
  morgan(env.nodeEnv === "production" ? "combined" : "dev", {
    stream: {
      write: (msg: string) => logger.info(msg.trim()),
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", env: env.nodeEnv });
});

// Mount BitTrust reputation routes
app.use("/api", reputationRoutes);

// 🔹 Temporary POST test for debugging
app.post("/api/test-post", (req: Request, res: Response) => {
  logger.info("POST /api/test-post hit", { body: req.body });
  res.json({
    message: "POST route works!",
    received: req.body,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: { message: "Not Found", path: req.path },
  });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error("Unhandled error", { error: String(err) });
  const status = err?.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  res.status(status).json({
    error: {
      message: err?.message ?? "Internal Server Error",
    },
  });
});

// Start server
const server = app.listen(env.port, () => {
  logger.info(`BitTrust backend listening on port ${env.port}`);
});

// Handle port errors
server.on("error", (err: any) => {
  if (err?.code === "EADDRINUSE") {
    logger.error(`Port ${env.port} is already in use.`, {
      hint: "Stop the existing process using the port or change PORT in backend/.env (e.g. 5001).",
    });
    process.exit(1);
  }
});

// Graceful shutdown
const shutdown = (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
  setTimeout(() => {
    logger.error("Forcing shutdown after timeout");
    process.exit(1);
  }, 10_000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));