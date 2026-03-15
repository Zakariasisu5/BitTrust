export function getTierFromScore(score: number): { tier: string; label: string } {
  if (score >= 801) return { tier: "A+", label: "Highly Trusted" };
  if (score >= 601) return { tier: "A", label: "Trusted / Low Risk" };
  if (score >= 301) return { tier: "B", label: "Medium Risk" };
  return { tier: "C", label: "High Risk" };
}

export function formatLastUpdated(blockHeight: number): string {
  const h = Number.isFinite(blockHeight) ? blockHeight : 0;
  if (h === 0) return "Never";
  return `Block #${h}`;
}
