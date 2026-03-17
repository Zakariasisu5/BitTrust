export type TrustLevel = "High Risk" | "Basic" | "Trusted" | "Elite";

export interface TrustAssessment {
  trustLevel: TrustLevel;
  loanEligibility: boolean;
}

export const assessTrust = (score: number): TrustAssessment => {
  let trustLevel: TrustLevel = "High Risk";
  if (score >= 81) trustLevel = "Elite";
  else if (score >= 61) trustLevel = "Trusted";
  else if (score >= 31) trustLevel = "Basic";

  // Loan eligibility requires Trusted tier or above
  const loanEligibility = score >= 61;

  return { trustLevel, loanEligibility };
};
