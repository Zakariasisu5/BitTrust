"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWalletActivity = void 0;
/**
 * Thin wrapper around the scoring/stacks-fetcher so the rest of the backend
 * imports from a single, stable path.
 */
var stacks_fetcher_1 = require("../../scoring/stacks-fetcher");
Object.defineProperty(exports, "fetchWalletActivity", { enumerable: true, get: function () { return stacks_fetcher_1.fetchWalletActivity; } });
