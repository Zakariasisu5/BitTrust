## BitTrust - Project Breakdown

### **Core Concept**
BitTrust is a **decentralized reputation oracle for AI agents** built on Stacks (Bitcoin L2). It solves the trust problem when autonomous AI agents transact with each other—how does Agent A know Agent B won't rug or fail execution?


### **Problem → Solution**
**Problem**: AI agents hiring/paying each other via crypto have no way to verify counterparty reliability. DeFi requires over-collateralization because there's no reputation system.

**Solution**: An on-chain credit score derived from wallet behavior (tx history, smart contract execution success, loan repayment, DeFi participation). Agents query this score before transacting.


### **Key Innovation: x402 Protocol Integration**
This is the monetization layer:
- When Agent A requests Agent B's score, BitTrust issues **HTTP 402 (Payment Required)**
- Agent A autonomously pays a micro-fee (0.01 USDCx) via Stacks
- Score data unlocks and is delivered as JSON
- **Machine-to-machine paid API** — no human subscriptions, fully automated revenue


### **Tech Architecture**

#### **1. Smart Contract Layer (Clarity on Stacks)**
- Stores reputation scores on-chain
- Key functions:
  - `register-user()` — Wallet enrolls with score = 0
  - `update-score(user, new-score)` — Admin-only, updates from backend
  - `get-score(user)` — Read reputation data
  - `is-eligible-for-loan(user, min-score)` — Loan qualification check
- Security: Only admin can write scores, reads are gas-free

#### **2. Backend Reputation Engine**
- **Tech**: Node.js/Express or Python/FastAPI
- **DB**: PostgreSQL/MongoDB + Redis caching
- **Data sources**: Stacks Blockchain API
- **Scoring logic**:
  ```
  score = (wallet_age × 0.2) + (tx_count × 0.25) +
          (repayment_history × 0.35) + (trusted_protocols × 0.2)
  ```
- **Workflow**:
  1. Fetch wallet on-chain activity
  2. Calculate score
  3. Store in DB
  4. Push to smart contract
  5. Serve via API

- **API Endpoints**:
  - `GET /reputation/{wallet}` — Get score
  - `POST /reputation/update` — Update & sync to chain
  - `GET /reputation/history/{wallet}` — Historical data
  - `GET /leaderboard` — Top wallets

- **Stack**: Next.js, Tailwind, stacks.js, Hiro Wallet
- **Pages**:
  - Home — Wallet connection
  - Dashboard — Score display, charts, loan eligibility
  - Profile — Reputation history
- **Key Components**:
  - WalletConnect
  - ReputationCard
  - ScoreChart (Chart.js/Recharts)
  - LoanStatus


### **Reputation Scoring Factors**
- Wallet age
- Transaction frequency & volume
- Smart contract execution success rate
- Loan repayment history
- DeFi protocol participation
- DAO governance voting
- Security flags (scam reports, sybil detection)


### **Use Cases**
1. **DeFi Lending** — Lower collateral for high-rep wallets
2. **AI Agent Marketplaces** — Bots hire bots based on trust scores
3. **DAO Governance** — Reputation-weighted voting
4. **Freelance Platforms** — Client evaluates contractor wallet
5. **Risk Management** — Automated counterparty verification


### **MVP Scope (Hackathon Build)**
**Smart Contract**:
- Wallet registration
- On-chain score storage
- Score query functions
- Loan eligibility check

**Backend**:
- Basic reputation algorithm
- API for score retrieval
- On-chain sync via Clarity

**Frontend**:
- Wallet connection (Hiro/Stacks wallet)
- Dashboard showing score
- Score history chart
- Simple loan eligibility demo


### **Business Model**
- **x402 micro-payments** — Every score query costs 0.01 USDCx
- Revenue scales with agent-to-agent transaction volume
- No human gatekeeping — fully automated B2B2B (bot-to-bot-to-bot)


### **Strategic Positioning**
BitTrust is positioning itself as **infrastructure for the agentic economy**:
- As AI agents become economic actors, they need a trust layer
- Traditional credit bureaus don't work for wallets
- This becomes the **on-chain Experian/TransUnion** for bots


### **What Makes This Interesting**
1. **x402 is clever** — Monetizing APIs via payment-gated HTTP responses is elegant for autonomous agents
2. **Stacks angle** — Bitcoin security + smart contract programmability
3. **Agentic narrative** — Early positioning in AI × crypto intersection
4. **Composable** — Other protocols can plug in (lending, marketplaces, DAOs)
