# BitTrust Scoring Engine

Fetches real wallet activity from the Stacks blockchain and computes a reputation score (0–100).

## Files

- `stacks-fetcher.ts` — fetches wallet data from Hiro Stacks API
- `scoring-engine.ts` — calculates reputation score from wallet data

## Usage

```typescript
import { fetchWalletActivity } from "./stacks-fetcher";
import { calculateReputationScore } from "./scoring-engine";

// 1. Fetch wallet data
const activity = await fetchWalletActivity(address, "testnet");

// 2. Calculate score
const result = calculateReputationScore(activity);

// result contains:
// {
//   score: 0–100,
//   tier: 'A+' | 'A' | 'B' | 'C',
//   tierLabel: 'Highly Trusted' | 'Trusted' | 'Medium Risk' | 'High Risk',
//   factors: [...],       // per-factor breakdown
//   explanation: string,  // plain English summary
//   breakdown: { walletAge, txQuality, defiActivity, communityEngagement }
// }
```

## Score Weights

| Factor                   | Weight |
| ------------------------ | ------ |
| Wallet Age & Stability   | 20%    |
| Transaction Quality      | 25%    |
| DeFi & Contract Activity | 35%    |
| Community Engagement     | 20%    |

## Exact API Response Format

### GET /api/reputation/:wallet

Call `fetchWalletActivity(wallet, 'testnet')` then `calculateReputationScore(activity)`.
Returns:
{
"wallet": "ST123...",
"score": 73,
"tier": "A",
"tierLabel": "Trusted / Low Risk",
"explanation": "...",
"factors": [
{ "name": "WALLET_AGE_STABILITY", "label": "Wallet Age", "contribution": 17, "max": 20, "raw": "365 days" },
{ "name": "TX_SUCCESS_VELOCITY", "label": "Transaction Quality", "contribution": 20, "max": 25, "raw": "142 txs" },
{ "name": "DEFI_CONTRACT_ACTIVITY", "label": "DeFi Activity", "contribution": 25, "max": 35, "raw": "42 contract calls" },
{ "name": "COMMUNITY_ENGAGEMENT", "label": "Community Engagement", "contribution": 11, "max": 20, "raw": "1200 STX" }
],
"breakdown": {
"walletAge": 17,
"txQuality": 20,
"defiActivity": 25,
"communityEngagement": 11
},
"metadata": {
"network": "testnet",
"totalTxsAnalyzed": 142
},
"scoredAt": 1742123456789
}

### POST /api/reputation/update

Body: { "wallet": "ST123..." }
Same flow — fetchWalletActivity + calculateReputationScore — return same shape above.

### GET /api/reputation/history/:wallet

Requires Selassie (backend) to store each score result in DB with timestamp.
Scoring engine returns one score per call — history is built by saving results over time.

### GET /api/leaderboard

Requires Selassie to query top wallets from stored DB results.
