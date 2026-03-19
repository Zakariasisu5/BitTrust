"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateReputationScore = void 0;
/**
 * Thin wrapper around the scoring/scoring-engine so the rest of the backend
 * imports from a single, stable path.
 */
var scoring_engine_1 = require("../../scoring/scoring-engine");
Object.defineProperty(exports, "calculateReputationScore", { enumerable: true, get: function () { return scoring_engine_1.calculateReputationScore; } });
