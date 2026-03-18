import type { Request, Response, NextFunction } from "express";
import {
  linkProvider,
  unlinkProvider,
  getVerification,
} from "../services/verificationService";
import type { ProviderType } from "../models/verification";
import { PROVIDER_BONUS } from "../models/verification";
import { logger } from "../utils/logger";

const VALID_PROVIDERS: ProviderType[] = ["github", "twitter", "discord", "bns"];

export const postLinkProvider = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { wallet, provider, handle } = req.body as {
      wallet?: string;
      provider?: string;
      handle?: string;
    };

    if (!wallet || !provider || !handle) {
      return res.status(400).json({ error: { message: "wallet, provider, and handle are required" } });
    }

    if (!VALID_PROVIDERS.includes(provider as ProviderType)) {
      return res.status(400).json({ error: { message: `Invalid provider. Must be one of: ${VALID_PROVIDERS.join(", ")}` } });
    }

    const entry = linkProvider(wallet.trim(), provider as ProviderType, handle.trim());
    return res.json({
      success: true,
      verification: entry,
      bonus: PROVIDER_BONUS[provider as ProviderType],
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteUnlinkProvider = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { wallet, provider } = req.body as { wallet?: string; provider?: string };
    if (!wallet || !provider) {
      return res.status(400).json({ error: { message: "wallet and provider are required" } });
    }
    unlinkProvider(wallet.trim(), provider as ProviderType);
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const getWalletVerification = async (
  req: Request<{ wallet: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const wallet = req.params.wallet.trim();
    const verification = getVerification(wallet);
    return res.json(verification);
  } catch (error) {
    return next(error);
  }
};
