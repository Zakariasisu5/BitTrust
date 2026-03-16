"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessTrust = void 0;
const assessTrust = (score) => {
    let trustLevel = "High Risk";
    if (score >= 80)
        trustLevel = "Elite";
    else if (score >= 60)
        trustLevel = "Trusted";
    else if (score >= 40)
        trustLevel = "Basic";
    const loanEligibility = score > 70;
    return { trustLevel, loanEligibility };
};
exports.assessTrust = assessTrust;
