/**
 * Thin wrapper around the scoring/stacks-fetcher so the rest of the backend
 * imports from a single, stable path.
 */
export {
  fetchWalletActivity,
  type WalletActivity,
  type NetworkMode,
} from "../../scoring/stacks-fetcher";
