# Backend Documentation

## Overview

The BitTrust backend is a production-ready Express.js application that provides reputation scoring, identity verification, and x402 payment protocol APIs for the Bitcoin ecosystem via Stacks.

**Key Features:**
- Real-time reputation scoring based on on-chain activity
- Identity verification with GitHub, Twitter, Discord, and BNS
- Redis caching for high performance
- Mainnet and testnet support
- Rate limiting and security hardening
- Structured logging with Winston

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Backend Architecture                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Express    │
│   Server     │
└──────┬───────┘
       │
       ├─────► Middleware Layer
       │       ├─ Helmet (Security)
       │       ├─ CORS (Origin validation)
       │       ├─ Compression
       │       ├─ Rate Limiting (300 req/15min)
       │       └─ Morgan (HTTP logging)
       │
       ├─────► Routes Layer
       │       ├─ /api/reputation/*
       │       ├─ /api/verification/*
       │       └─ /health
       │
       ├─────► Controllers Layer
       │       ├─ reputationController.ts
       │       └─ verificationController.ts
       │
       ├─────► Services Layer
       │       ├─ blockchainService.ts (Hiro API)
       │       ├─ scoringEngine.ts (Score calculation)
       │       ├─ verificationService.ts (Identity)
       │       └─ leaderboardService.ts (Rankings)
       │
       └─────► Data Layer
               ├─ In-Memory Store (scores, history)
               └─ Redis Cache (optional, 5min TTL)

External Dependencies:
├─ Hiro API (Stacks blockchain data)
│  ├─ Mainnet: https://api.hiro.so
│  └─ Testnet: https://api.testnet.hiro.so
└─ Redis (optional caching)
```

---

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── env.ts                    # Environment configuration
│   ├── controllers/
│   │   ├── reputationController.ts   # Reputation API endpoints
│   │   └── verificationController.ts # Identity verification endpoints
│   ├── database/
│   │   └── store.ts                  # In-memory + Redis storage
│   ├── models/
│   │   ├── walletScore.ts            # WalletScore type definition
│   │   └── verification.ts           # Verification types
│   ├── routes/
│   │   └── reputationRoutes.ts       # API route definitions
│   ├── services/
│   │   ├── blockchainService.ts      # Stacks API integration
│   │   ├── scoringEngine.ts          # Score calculation wrapper
│   │   ├── verificationService.ts    # Identity verification logic
│   │   └── leaderboardService.ts     # Leaderboard logic
│   ├── utils/
│   │   ├── logger.ts                 # Winston logger
│   │   └── trustLevel.ts             # Trust tier assessment
│   └── index.ts                      # Server entry point
├── scoring/
│   ├── scoring-engine.ts             # Core scoring algorithm
│   └── stacks-fetcher.ts             # Blockchain data fetcher
├── package.json
├── tsconfig.json
└── .env
```

---

## Reputation Scoring Engine

### Overview

The scoring engine analyzes on-chain wallet activity and produces a normalized reputation score from 0-100 (displayed as 0-1000 in the UI).

### Scoring Model

The model evaluates **4 key dimensions** with specific weights:

#### 1. Wallet Age & Stability (20 points max)

**Purpose**: Measure wallet maturity and consistent activity over time.

**Calculation**:
```typescript
function scoreWalletAge(ageDays: number): number {
  if (ageDays <= 0) return 0;
  if (ageDays < 30) return Math.round((ageDays / 30) * 5);        // 0-5 pts
  if (ageDays < 180) return 5 + Math.round(((ageDays - 30) / 150) * 7);  // 5-12 pts
  if (ageDays < 365) return 12 + Math.round(((ageDays - 180) / 185) * 5); // 12-17 pts
  return Math.min(20, 17 + Math.round(((ageDays - 365) / 730) * 3));      // 17-20 pts
}
```

**Tiers**:
- 0-30 days: Low (0-5 pts) - New wallet
- 30-180 days: Growing (5-12 pts) - Establishing presence
- 180-365 days: Established (12-17 pts) - Proven track record
- 365+ days: Veteran (17-20 pts) - Long-term participant

**Data Source**: `firstTxTimestamp` from Hiro API

---

#### 2. Transaction Quality (25 points max)

**Purpose**: Evaluate transaction success rate and volume.

**Calculation**:
```typescript
function scoreTxQuality(totalTx: number, successfulTx: number, failedTx: number): number {
  if (totalTx === 0) return 0;
  
  // Volume component (0-15 pts, capped at 200 txs)
  const volumePts = Math.min(15, Math.round((Math.min(totalTx, 200) / 200) * 15));
  
  // Success rate component (0-10 pts)
  const successRate = successfulTx / (successfulTx + failedTx + 1);
  const qualityPts = Math.round(successRate * 10);
  
  return volumePts + qualityPts;
}
```

**Components**:
- **Volume Score** (0-15 pts): Rewards transaction activity, capped at 200 transactions
- **Quality Score** (0-10 pts): Based on success rate (successful / total)

**Example**:
- 150 successful txs, 10 failed → Volume: 11 pts, Quality: 9 pts → Total: 20 pts
- 50 successful txs, 50 failed → Volume: 4 pts, Quality: 5 pts → Total: 9 pts

**Data Source**: Transaction history from Hiro API (`/extended/v1/address/:wallet/transactions`)

---

#### 3. DeFi & Contract Activity (35 points max)

**Purpose**: Measure smart contract engagement and DeFi participation.

**Calculation**:
```typescript
function scoreDefiActivity(
  totalTx: number,
  contractCallCount: number,
  hasDefiActivity: boolean,
  uniqueContracts: number
): number {
  if (totalTx === 0) return 0;
  
  // Contract call ratio (0-15 pts)
  const ratio = contractCallCount / Math.max(totalTx, 1);
  const ratioPts = Math.round(Math.min(ratio, 1) * 15);
  
  // DeFi participation bonus (0-15 pts)
  const defiPts = hasDefiActivity ? 15 : 0;
  
  // Contract diversity (0-5 pts)
  const diversityPts = Math.min(5, uniqueContracts);
  
  return ratioPts + defiPts + diversityPts;
}
```

**Components**:
- **Contract Call Ratio** (0-15 pts): Percentage of transactions that are contract calls
- **DeFi Participation** (0-15 pts): Binary bonus for interacting with known DeFi protocols
- **Contract Diversity** (0-5 pts): Number of unique contracts interacted with (capped at 5)

**DeFi Detection**: Identifies interactions with known protocols (DEXs, lending, staking)

**Example**:
- 100 txs, 80 contract calls, DeFi active, 5 unique contracts → 15 + 15 + 5 = 35 pts (max)
- 100 txs, 20 contract calls, no DeFi, 2 unique contracts → 3 + 0 + 2 = 5 pts

**Data Source**: Transaction types and contract addresses from Hiro API

---

#### 4. Community Engagement (20 points max)

**Purpose**: Assess long-term commitment and skin in the game.

**Calculation**:
```typescript
function scoreCommunityEngagement(
  stxBalance: bigint,
  walletAgeDays: number,
  totalTx: number
): number {
  // Balance tier (0-10 pts) - skin in the game
  const stx = Number(stxBalance) / 1_000_000;
  let balancePts = 0;
  if (stx >= 10000) balancePts = 10;
  else if (stx >= 1000) balancePts = 7;
  else if (stx >= 100) balancePts = 4;
  else if (stx >= 10) balancePts = 2;
  else if (stx > 0) balancePts = 1;
  
  // Consistent activity (0-10 pts)
  const activityPts = (walletAgeDays > 90 && totalTx > 20)
    ? Math.min(10, Math.round((Math.min(totalTx, 100) / 100) * 10))
    : 0;
  
  return balancePts + activityPts;
}
```

**Components**:
- **STX Balance Tier** (0-10 pts): Rewards holding STX (skin in the game)
  - 10,000+ STX: 10 pts
  - 1,000-9,999 STX: 7 pts
  - 100-999 STX: 4 pts
  - 10-99 STX: 2 pts
  - 1-9 STX: 1 pt
- **Consistent Activity** (0-10 pts): Rewards long-term participation (age > 90 days AND txs > 20)

**Example**:
- 5,000 STX, 200 days old, 50 txs → 7 + 5 = 12 pts
- 50 STX, 30 days old, 10 txs → 2 + 0 = 2 pts

**Data Source**: STX balance from Hiro API (`/extended/v1/address/:wallet/balances`)

---

### Identity Verification Bonus

**Purpose**: Reward users who verify their off-chain identity.

**Providers & Bonuses** (on 0-100 scale):
- **GitHub**: +8 pts (+80 display pts) - Developer identity
- **BNS Domain**: +10 pts (+100 display pts) - On-chain identity (strongest proof)
- **Twitter/X**: +4 pts (+40 display pts) - Social presence
- **Discord**: +3 pts (+30 display pts) - Community identity

**Maximum Bonus**: +25 pts (+250 display pts)

**Implementation**:
```typescript
const verificationBonus = getVerificationBonus(wallet);
const finalScore = Math.min(100, baseScore + verificationBonus);
```

**Storage**: In-memory store (resets on redeploy). Migrate to Redis/DB for persistence.

---

### Trust Tiers

Scores are mapped to trust tiers for easier integration:

| Score (0-100) | Display (0-1000) | Tier | Label | Loan Eligibility |
|---------------|------------------|------|-------|------------------|
| 81-100 | 810-1000 | A+ | Highly Trusted | Premium (10,000 USDCx) |
| 61-80 | 610-809 | A | Trusted / Low Risk | Standard (5,000 USDCx) |
| 31-60 | 310-609 | B | Medium Risk | Basic (1,000 USDCx) |
| 0-30 | 0-309 | C | High Risk | Not Eligible |

**Implementation** (`utils/trustLevel.ts`):
```typescript
export function assessTrust(score: number): {
  trustLevel: string;
  loanEligibility: boolean;
} {
  if (score >= 81) return { trustLevel: "Elite", loanEligibility: true };
  if (score >= 61) return { trustLevel: "Trusted", loanEligibility: true };
  if (score >= 31) return { trustLevel: "Basic", loanEligibility: true };
  return { trustLevel: "High Risk", loanEligibility: false };
}
```

---

### AI-Powered Explanations

Every score includes a natural language explanation generated by analyzing the score components:

**Example Output**:
> "Wallet has 2 year(s) of on-chain history. High transaction volume (150+ txs analyzed). DeFi protocol interactions detected — positive signal. Strong transaction success rate. Overall: reliable wallet with established on-chain presence."

**Generation Logic** (`scoring/scoring-engine.ts`):
```typescript
function generateExplanation(
  score: number,
  activity: WalletActivity,
  breakdown: ScoreBreakdown
): string {
  const parts: string[] = [];
  
  if (activity.walletAgeDays < 30) {
    parts.push("This wallet is relatively new (under 30 days old).");
  } else if (activity.walletAgeDays > 365) {
    parts.push(`Wallet has ${Math.floor(activity.walletAgeDays / 365)} year(s) of on-chain history.`);
  }
  
  if (activity.totalTxCount > 50) {
    parts.push(`High transaction volume (${activity.totalTxCount}+ txs analyzed).`);
  }
  
  if (activity.hasDefiActivity) {
    parts.push("DeFi protocol interactions detected — positive signal.");
  }
  
  if (breakdown.txQuality >= 20) {
    parts.push("Strong transaction success rate.");
  }
  
  if (score >= 70) {
    parts.push("Overall: reliable wallet with established on-chain presence.");
  } else if (score >= 40) {
    parts.push("Overall: moderate on-chain activity. Continued participation will improve score.");
  } else {
    parts.push("Overall: limited on-chain history detected on this network.");
  }
  
  return parts.join(" ");
}
```

---

## API Endpoints

### Base URL
```
Production: https://bittrust-backend.onrender.com/api
Local: http://localhost:5001/api
```

### Reputation Endpoints

#### GET /reputation/:wallet

Get reputation score for a wallet.

**Parameters**:
- `wallet` (path): Stacks wallet address
- `network` (query): `mainnet` or `testnet`

**Response**:
```json
{
  "wallet": "SP2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG",
  "reputationScore": 75,
  "tier": "A",
  "tierLabel": "Trusted / Low Risk",
  "trustLevel": "Trusted",
  "loanEligibility": true,
  "explanation": "Wallet has 2 year(s) of on-chain history...",
  "factors": [
    {
      "name": "WALLET_AGE_STABILITY",
      "label": "Wallet Age & Stability",
      "raw": "730 days",
      "contribution": 18,
      "max": 20,
      "description": "Time elapsed since first on-chain transaction."
    },
    {
      "name": "TX_SUCCESS_VELOCITY",
      "label": "Transaction Quality",
      "raw": "150 txs (145 success)",
      "contribution": 23,
      "max": 25,
      "description": "Ratio of successful vs failed transactions + volume."
    },
    {
      "name": "DEFI_CONTRACT_ACTIVITY",
      "label": "DeFi & Contract Activity",
      "raw": "120 contract calls + DeFi",
      "contribution": 32,
      "max": 35,
      "description": "Smart contract interactions, DeFi participation, protocol diversity."
    },
    {
      "name": "COMMUNITY_ENGAGEMENT",
      "label": "Community Engagement",
      "raw": "5000.00 STX balance",
      "contribution": 12,
      "max": 20,
      "description": "STX holdings and consistent long-term participation."
    }
  ],
  "breakdown": {
    "walletAge": 18,
    "txQuality": 23,
    "defiActivity": 32,
    "communityEngagement": 12
  },
  "metadata": {
    "network": "mainnet",
    "totalTxsAnalyzed": 150
  },
  "lastUpdated": "2026-03-18T10:30:00.000Z"
}
```

**Caching**:
1. Redis cache (5min TTL) - checked first
2. In-memory store - checked second
3. Fresh computation - if not cached

---

#### POST /reputation/update

Recalculate reputation score (bypasses cache).

**Parameters**:
- `network` (query): `mainnet` or `testnet`

**Body**:
```json
{
  "wallet": "SP2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG"
}
```

**Response**: Same as GET /reputation/:wallet

**Side Effects**:
- Invalidates Redis cache
- Updates in-memory store
- Adds entry to wallet history

---

#### GET /reputation/history/:wallet

Get historical reputation scores for a wallet.

**Parameters**:
- `wallet` (path): Stacks wallet address
- `network` (query): `mainnet` or `testnet`

**Response**:
```json
[
  {
    "wallet": "SP2...",
    "reputationScore": 75,
    "tier": "A",
    "lastUpdated": "2026-03-18T10:30:00.000Z"
  },
  {
    "wallet": "SP2...",
    "reputationScore": 72,
    "tier": "A",
    "lastUpdated": "2026-03-17T15:20:00.000Z"
  }
]
```

**Storage**: In-memory (last 100 entries per wallet)

---

#### GET /leaderboard

Get top wallets by reputation score.

**Parameters**:
- `network` (query): `mainnet` or `testnet`
- `limit` (query, optional): Max results (default: 50, max: 100)

**Response**:
```json
[
  {
    "wallet": "SP2...",
    "reputationScore": 95,
    "tier": "A+",
    "tierLabel": "Highly Trusted",
    "trustLevel": "Elite",
    "loanEligibility": true,
    "lastUpdated": "2026-03-18T10:30:00.000Z"
  }
]
```

**Sorting**: Descending by `reputationScore`

---

### Verification Endpoints

#### GET /verification/:wallet

Get linked identity providers for a wallet.

**Response**:
```json
{
  "wallet": "SP2...",
  "providers": [
    {
      "provider": "github",
      "handle": "username",
      "verifiedAt": "2026-03-18T10:00:00.000Z",
      "bonus": 8
    },
    {
      "provider": "bns",
      "handle": "username.btc",
      "verifiedAt": "2026-03-18T10:05:00.000Z",
      "bonus": 10
    }
  ],
  "totalBonus": 18
}
```

---

#### POST /verification/link

Link an identity provider.

**Body**:
```json
{
  "wallet": "SP2...",
  "provider": "github",
  "handle": "username"
}
```

**Response**:
```json
{
  "success": true,
  "verification": {
    "provider": "github",
    "handle": "username",
    "verifiedAt": "2026-03-18T10:00:00.000Z",
    "bonus": 8
  },
  "bonus": 8
}
```

**Valid Providers**: `github`, `twitter`, `discord`, `bns`

---

#### DELETE /verification/unlink

Unlink an identity provider.

**Body**:
```json
{
  "wallet": "SP2...",
  "provider": "github"
}
```

**Response**:
```json
{
  "success": true
}
```

---

### System Endpoints

#### GET /health

Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "env": "production"
}
```

---

## Environment Variables

### Required

```bash
PORT=5001
STACKS_API_TESTNET=https://api.testnet.hiro.so
STACKS_API_MAINNET=https://api.hiro.so
FRONTEND_URL=https://bittrust-five.vercel.app,http://localhost:3000
NODE_ENV=production
```

### Optional

```bash
# Redis caching (recommended for production)
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=true
```

---

## Running the Backend

### Development

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5001`

### Production Build

```bash
npm install
npm run build
npm start
```

### Docker (Optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5001
CMD ["node", "dist/index.js"]
```

---

## Security

### Implemented Measures

- **Helmet.js**: Security headers (XSS, clickjacking, etc.)
- **CORS**: Origin validation with whitelist
- **Rate Limiting**: 300 requests per 15 minutes
- **Input Validation**: All endpoints validate and sanitize input
- **Error Handling**: No stack traces in production
- **Logging**: Structured logging (no sensitive data)

### Best Practices

- Use HTTPS in production
- Keep dependencies updated
- Monitor error logs
- Implement API key authentication for production
- Add per-wallet rate limiting
- Use Redis for session management

---

## Performance

### Caching Strategy

1. **Redis Cache** (5min TTL)
   - Stores computed scores
   - Reduces Hiro API calls
   - Improves response time (<50ms)

2. **In-Memory Store**
   - Fallback when Redis unavailable
   - Stores last 100 history entries per wallet
   - O(1) lookups with Map data structure

### Optimization Tips

- Enable Redis in production
- Use connection pooling for Redis
- Implement request coalescing for duplicate requests
- Add CDN for static assets
- Monitor Hiro API rate limits

---

## Monitoring & Logging

### Winston Logger

Structured logging with levels:
- `info`: Normal operations
- `warn`: Non-critical issues (Redis failures, etc.)
- `error`: Critical errors

**Example**:
```typescript
logger.info("Reputation computed", { 
  wallet, 
  score: score.reputationScore, 
  tier: score.tier 
});
```

### Morgan HTTP Logging

Logs all HTTP requests:
- Development: `dev` format (colored, concise)
- Production: `combined` format (Apache-style)

### Recommended Monitoring

- **Sentry**: Error tracking
- **Datadog/New Relic**: APM
- **Logtail/Papertrail**: Log aggregation
- **UptimeRobot**: Uptime monitoring

---

## Testing

### Manual Testing

```bash
# Health check
curl https://bittrust-backend.onrender.com/health

# Get reputation (testnet)
curl "https://bittrust-backend.onrender.com/api/reputation/SPW435DHYWC9VCCP13BQ4EJRCVDYRA5FDNFV1GXT?network=testnet"

# Update reputation
curl -X POST "https://bittrust-backend.onrender.com/api/reputation/update?network=testnet" \
  -H "Content-Type: application/json" \
  -d '{"wallet":"SPW435DHYWC9VCCP13BQ4EJRCVDYRA5FDNFV1GXT"}'

# Get leaderboard
curl "https://bittrust-backend.onrender.com/api/leaderboard?network=testnet&limit=10"
```

### Automated Testing

```bash
# Run tests (when implemented)
npm test

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

---

## Troubleshooting

### Common Issues

**Port already in use**:
```bash
# Change PORT in .env
PORT=5002
```

**Redis connection failed**:
- Check REDIS_URL is correct
- Verify Redis server is running
- Backend will fallback to in-memory cache

**CORS errors**:
- Add frontend URL to FRONTEND_URL env var
- Use comma-separated list for multiple origins

**Hiro API rate limits**:
- Implement request caching
- Add exponential backoff
- Consider running your own Stacks node

---

## Additional Resources

- [Stacks API Documentation](https://docs.hiro.so/api)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Redis Caching Strategies](https://redis.io/docs/manual/patterns/)
- [Winston Logging](https://github.com/winstonjs/winston)

---

For more details, refer to the inline code documentation or contact the maintainers.
