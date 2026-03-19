"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkProvider = linkProvider;
exports.unlinkProvider = unlinkProvider;
exports.getVerification = getVerification;
exports.getVerificationBonus = getVerificationBonus;
const verification_1 = require("../models/verification");
const logger_1 = require("../utils/logger");
const store = new Map();
function getOrCreate(wallet) {
    if (!store.has(wallet))
        store.set(wallet, new Map());
    return store.get(wallet);
}
function linkProvider(wallet, provider, handle) {
    const walletMap = getOrCreate(wallet);
    const entry = {
        provider,
        handle,
        verifiedAt: new Date().toISOString(),
        bonus: verification_1.PROVIDER_BONUS[provider],
    };
    walletMap.set(provider, entry);
    logger_1.logger.info("Provider linked", { wallet, provider, handle });
    return entry;
}
function unlinkProvider(wallet, provider) {
    store.get(wallet)?.delete(provider);
}
function getVerification(wallet) {
    const walletMap = store.get(wallet);
    const providers = walletMap ? Array.from(walletMap.values()) : [];
    return {
        wallet,
        providers,
        totalBonus: providers.reduce((sum, p) => sum + p.bonus, 0),
    };
}
function getVerificationBonus(wallet) {
    return getVerification(wallet).totalBonus;
}
