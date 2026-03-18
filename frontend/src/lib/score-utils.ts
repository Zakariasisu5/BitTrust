// Backend returns reputationScore as 0–100.
// We display it as 0–1000 (multiply by 10) for user-facing UI.

export function toDisplayScore(score: number): number {
  return Math.round(score * 10);
}

export function getTierFromScore(score: number): { tier: string; label: string } {
  // score is 0–100 (backend scale)
  if (score >= 81) return { tier: "A+", label: "Highly Trusted" };
  if (score >= 61) return { tier: "A", label: "Trusted / Low Risk" };
  if (score >= 31) return { tier: "B", label: "Medium Risk" };
  return { tier: "C", label: "High Risk" };
}

export function getTierFromTrustLevel(
  trustLevel: string
): { tier: string; label: string } {
  switch (trustLevel) {
    case "Elite":
      return { tier: "A+", label: "Highly Trusted" };
    case "Trusted":
      return { tier: "A", label: "Trusted / Low Risk" };
    case "Basic":
      return { tier: "B", label: "Medium Risk" };
    case "High Risk":
      return { tier: "C", label: "High Risk" };
    default:
      return { tier: "C", label: "High Risk" };
  }
}

export function formatLastUpdated(blockHeight: number): string {
  const h = Number.isFinite(blockHeight) ? blockHeight : 0;
  if (h === 0) return "Never";
  return `Block #${h}`;
}

export function formatLastUpdatedIso(iso: string): string {
  if (!iso) return "Never";
  try {
    const d = new Date(iso);
    return Number.isFinite(d.getTime())
      ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "Never";
  } catch {
    return "Never";
  }
}
