"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessTrust = void 0;
const assessTrust = (score) => {
    let trustLevel = "High Risk";
    if (score >= 81)
        trustLevel = "Elite";
    else if (score >= 61)
        trustLevel = "Trusted";
    else if (score >= 31)
        trustLevel = "Basic";
    // Loan eligibility requires Trusted tier or above
    const loanEligibility = score >= 61;
    return { trustLevel, loanEligibility };
};
exports.assessTrust = assessTrust;
