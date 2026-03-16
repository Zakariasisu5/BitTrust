export type TrustLevel = "High Risk" | "Basic" | "Trusted" | "Elite";

export interface TrustAssessment {
  trustLevel: TrustLevel;
  loanEligibility: boolean;
}

export const assessTrust = (score: number): TrustAssessment => {
  let trustLevel: TrustLevel = "High Risk";
  if (score >= 80) trustLevel = "Elite";
  else if (score >= 60) trustLevel = "Trusted";
  else if (score >= 40) trustLevel = "Basic";

  const loanEligibility = score > 70;

  return { trustLevel, loanEligibility };
};

