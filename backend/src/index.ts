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

const corsOptions: cors.CorsOptions = {
  origin: env.frontendUrl ?? "*",
};
app.use(cors(corsOptions));

app.use(compression());
app.use(express.json());

app.use(
  morgan(env.nodeEnv === "production" ? "combined" : "dev", {
    stream: {
      write: (msg: string) => logger.info(msg.trim()),
    },
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", env: env.nodeEnv });
});

app.use("/api", reputationRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: { message: "Not Found", path: req.path },
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error("Unhandled error", { error: String(err) });
  const status = err?.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  res.status(status).json({
    error: {
      message: err?.message ?? "Internal Server Error",
    },
  });
});

const server = app.listen(env.port, () => {
  logger.info(`BitTrust backend listening on port ${env.port}`);
});

server.on("error", (err: any) => {
  if (err?.code === "EADDRINUSE") {
    logger.error(`Port ${env.port} is already in use.`, {
      hint:
        "Stop the existing process using the port or change PORT in backend/.env (e.g. 5001).",
    });
    process.exit(1);
  }
});

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

