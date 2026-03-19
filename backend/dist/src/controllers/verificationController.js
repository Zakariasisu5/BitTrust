"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletVerification = exports.deleteUnlinkProvider = exports.postLinkProvider = void 0;
const verificationService_1 = require("../services/verificationService");
const verification_1 = require("../models/verification");
const VALID_PROVIDERS = ["github", "twitter", "discord", "bns"];
const postLinkProvider = async (req, res, next) => {
    try {
        const { wallet, provider, handle } = req.body;
        if (!wallet || !provider || !handle) {
            return res.status(400).json({ error: { message: "wallet, provider, and handle are required" } });
        }
        if (!VALID_PROVIDERS.includes(provider)) {
            return res.status(400).json({ error: { message: `Invalid provider. Must be one of: ${VALID_PROVIDERS.join(", ")}` } });
        }
        const entry = (0, verificationService_1.linkProvider)(wallet.trim(), provider, handle.trim());
        return res.json({
            success: true,
            verification: entry,
            bonus: verification_1.PROVIDER_BONUS[provider],
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.postLinkProvider = postLinkProvider;
const deleteUnlinkProvider = async (req, res, next) => {
    try {
        const { wallet, provider } = req.body;
        if (!wallet || !provider) {
            return res.status(400).json({ error: { message: "wallet and provider are required" } });
        }
        (0, verificationService_1.unlinkProvider)(wallet.trim(), provider);
        return res.json({ success: true });
    }
    catch (error) {
        return next(error);
    }
};
exports.deleteUnlinkProvider = deleteUnlinkProvider;
const getWalletVerification = async (req, res, next) => {
    try {
        const wallet = req.params.wallet.trim();
        const verification = (0, verificationService_1.getVerification)(wallet);
        return res.json(verification);
    }
    catch (error) {
        return next(error);
    }
};
exports.getWalletVerification = getWalletVerification;
