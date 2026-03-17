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
