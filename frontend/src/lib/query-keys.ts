export const reputationKeys = {
  all: ["reputation"] as const,
  detail: (wallet: string) => [...reputationKeys.all, "detail", wallet] as const,
  history: (wallet: string) => [...reputationKeys.all, "history", wallet] as const,
};

export const leaderboardKeys = {
  all: ["leaderboard"] as const,
};

export const verificationKeys = {
  all: ["verification"] as const,
  detail: (wallet: string) => [...verificationKeys.all, "detail", wallet] as const,
};
