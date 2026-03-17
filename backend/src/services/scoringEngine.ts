/**
 * Thin wrapper around the scoring/scoring-engine so the rest of the backend
 * imports from a single, stable path.
 */
export {
  calculateReputationScore,
  type ScoringResult,
  type ScoreFactor,
} from "../../scoring/scoring-engine";
