# 🛡️ BitTrust - Decentralized Reputation Protocol for Bitcoin

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Stacks](https://img.shields.io/badge/Built%20on-Stacks-5546FF)](https://www.stacks.co/)
[![Bitcoin](https://img.shields.io/badge/Secured%20by-Bitcoin-F7931A)](https://bitcoin.org/)
[![Live Demo](https://img.shields.io/badge/Demo-Live-success)](https://bittrust-five.vercel.app)

> **Bringing Credit Scores to Bitcoin** - A decentralized reputation oracle that enables AI agents and DeFi protocols to make risk-aware decisions on the Bitcoin ecosystem.

🔗 **[Live Demo](https://bittrust-five.vercel.app)** | 📚 **[Documentation](docs/)** | 🎥 **[Video Demo](#)** | 🏗️ **[Architecture](#architecture)**

---

## 🎯 The Problem

The Bitcoin and Stacks ecosystems are growing rapidly, but they lack a fundamental primitive: **reputation**. This creates critical challenges:

- 🤖 **AI Agents** can't assess counterparty risk before executing transactions
- 💸 **DeFi Protocols** struggle with under-collateralized lending due to no credit history
- 🎭 **Sybil Attacks** plague governance and airdrops without identity verification
- 🔒 **Trust Barriers** prevent mainstream adoption of decentralized finance
- 📊 **No Credit History** means every wallet starts from zero, regardless of past behavior

**The Result?** Over-collateralization, limited capital efficiency, and barriers to entry for legitimate users.

---

## 💡 Our Solution

**BitTrust** is a decentralized reputation protocol that brings credit scores to Bitcoin. We analyze on-chain behavior, verify off-chain identity, and produce verifiable reputation scores (0-1000) that enable:

✅ **AI agents** to select trusted counterparties automatically  
✅ **DeFi protocols** to offer under-collateralized loans based on reputation  
✅ **Governance systems** to implement sybil-resistant voting  
✅ **Users** to build portable reputation across the Bitcoin ecosystem  

### 🌟 Key Features

- **🔍 On-Chain Analysis**: Real-time scoring based on wallet age, transaction quality, DeFi activity, and community engagement
- **🎭 Identity Verification**: Link GitHub, Twitter, Discord, and BNS domains to boost reputation (+250 pts max)
- **🤖 AI-Powered Explanations**: Natural language explanations for every score component
- **⚡ x402 Payment Protocol**: Pay-per-query API access for AI agents (1 USDCx per query)
- **🏆 Network-Specific Leaderboards**: Separate mainnet and testnet rankings
- **📈 Historical Tracking**: Full reputation history with tier change detection
- **🔐 Privacy-First**: Zero-knowledge proofs for identity verification (no PII on-chain)
- **⚙️ Production-Ready**: Full mainnet/testnet support, Redis caching, rate limiting

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BitTrust Ecosystem                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │◄───────►│   Backend    │◄───────►│  Hiro API    │
│  (Next.js)   │  REST   │  (Express)   │  HTTP   │  (Stacks)    │
│              │         │              │         │              │
│ • Dashboard  │         │ • Scoring    │         │ • Mainnet    │
│ • Profile    │         │ • Caching    │         │ • Testnet    │
│ • Leaderboard│         │ • x402 API   │         │ • Tx Data    │
│ • Verify ID  │         │ • Identity   │         │ • Balances   │
└──────┬───────┘         └──────┬───────┘         └──────────────┘
       │                        │
       │                        │
       ▼                        ▼
┌──────────────┐         ┌──────────────┐
│ Stacks Wallet│         │    Redis     │
│              │         │   (Cache)    │
│ • Xverse     │         │              │
│ • Leather    │         │ • 5min TTL   │
│ • Hiro       │         │ • Scores     │
└──────────────┘         └──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Smart Contracts (Stacks)                      │
├─────────────────────────────────────────────────────────────────┤
│  bittrust-reputation  │  bittrust-payment  │  usdcx-mock        │
│  • Store scores       │  • x402 protocol   │  • Test token      │
│  • On-chain stamping  │  • Credit system   │  • Faucet          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Bitcoin L1      │
                    │  (Settlement)    │
                    └──────────────────┘
```
---

## 🧮 Reputation Scoring Model

Our AI-powered scoring engine analyzes **4 key dimensions** to produce a normalized 0-100 score (displayed as 0-1000):

### 📊 Score Breakdown

| Factor | Weight | Max Points | Description |
|--------|--------|------------|-------------|
| **Wallet Age & Stability** | 20% | 200 pts | Time since first transaction, consistent activity |
| **Transaction Quality** | 25% | 250 pts | Success rate, volume, gas efficiency |
| **DeFi Activity** | 35% | 350 pts | Protocol interactions, contract diversity, DeFi participation |
| **Community Engagement** | 20% | 200 pts | STX holdings, governance participation, long-term commitment |
| **Identity Verification** | Bonus | +250 pts | GitHub, BNS, Twitter, Discord verification |

### 🏅 Trust Tiers

| Score | Tier | Label | Loan Eligibility |
|-------|------|-------|------------------|
| 810-1000 | A+ | Highly Trusted | Premium (up to 10,000 USDCx) |
| 610-809 | A | Trusted / Low Risk | Standard (up to 5,000 USDCx) |
| 310-609 | B | Medium Risk | Basic (up to 1,000 USDCx) |
| 0-309 | C | High Risk | Not Eligible |

### 🤖 AI Explanations

Every score includes natural language explanations:
> "Wallet has 2 year(s) of on-chain history. High transaction volume (150+ txs analyzed). DeFi protocol interactions detected — positive signal. Strong transaction success rate. Overall: reliable wallet with established on-chain presence."

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Stacks wallet (Xverse, Leather, or Hiro)

### 1. Clone & Install
```bash
git clone https://github.com/Zakariasisu5/BitTrust.git
cd BitTrust

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```bash
PORT=5001
STACKS_API_TESTNET=https://api.testnet.hiro.so
STACKS_API_MAINNET=https://api.hiro.so
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### 3. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Open Browser
Navigate to `http://localhost:3000` and connect your Stacks wallet!

---

## 🎮 Try It Live

### 🌐 Production Deployment
- **Frontend**: [https://bittrust-five.vercel.app](https://bittrust-five.vercel.app)
- **Backend API**: [https://bittrust-backend.onrender.com](https://bittrust-backend.onrender.com)
- **Health Check**: [https://bittrust-backend.onrender.com/health](https://bittrust-backend.onrender.com/health)

### 🧪 Test Wallet
Use this testnet wallet to explore features:
```
SPW435DHYWC9VCCP13BQ4EJRCVDYRA5FDNFV1GXT
```

### 📝 Test Flow
1. Connect your Stacks wallet (mainnet or testnet)
2. Click "Refresh Data" to calculate your reputation score
3. Navigate to "Verification" to link identity providers
4. Visit "Profile" to see detailed score breakdown
5. Check "Leaderboard" to see network rankings
6. View "Activity" for your reputation history

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router) + React 18
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Wallet**: Stacks Connect (@stacks/connect)
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js 20 + Express
- **Language**: TypeScript
- **Caching**: Redis (optional)
- **Logging**: Winston + Morgan
- **Security**: Helmet.js, CORS, Rate Limiting
- **Deployment**: Render

### Smart Contracts
- **Language**: Clarity
- **Network**: Stacks (testnet/mainnet)
- **Testing**: Vitest + @hirosystems/clarinet-sdk

### Infrastructure
- **CI/CD**: GitHub Actions
- **Monitoring**: Winston structured logging
- **Caching**: Redis (5min TTL)
- **Rate Limiting**: 300 requests per 15 minutes

---

## 📡 API Documentation

### Base URL
```
Production: https://bittrust-backend.onrender.com/api
Local: http://localhost:5001/api
```

### Endpoints

#### Get Reputation Score
```http
GET /reputation/:wallet?network=mainnet|testnet
```

**Response:**
```json
{
  "wallet": "SP2...",
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
      "contribution": 18,
      "max": 20,
      "raw": "730 days"
    }
  ],
  "metadata": {
    "network": "mainnet",
    "totalTxsAnalyzed": 150
  }
}
```

#### Update Reputation
```http
POST /reputation/update?network=mainnet|testnet
Body: { "wallet": "SP2..." }
```

#### Get Leaderboard
```http
GET /leaderboard?network=mainnet|testnet&limit=50
```

#### Identity Verification
```http
GET /verification/:wallet
POST /verification/link
DELETE /verification/unlink
```

---

## 🎯 Use Cases

### 1. 🤖 AI Agent Risk Assessment
```typescript
// AI agent checks counterparty reputation before transaction
const reputation = await fetch(`${API}/reputation/${wallet}?network=mainnet`);
if (reputation.reputationScore >= 600) {
  // Proceed with transaction
  await executeTransaction();
} else {
  // Request additional collateral or decline
  await requestCollateral();
}
```

### 2. 💰 Under-Collateralized Lending
```clarity
;; DeFi protocol checks on-chain reputation for loan approval
(define-public (request-loan (amount uint))
  (let ((score (contract-call? .bittrust-reputation get-score tx-sender)))
    (if (>= score u600)
      (ok (approve-loan amount))
      (err u403))))
```

### 3. 🗳️ Sybil-Resistant Governance
```typescript
// DAO weights votes by reputation score
const votingPower = baseVote * (reputation.reputationScore / 1000);
await castWeightedVote(proposal, votingPower);
```

### 4. 🎁 Targeted Airdrops
```typescript
// Airdrop to high-reputation wallets only
const eligibleWallets = leaderboard
  .filter(w => w.reputationScore >= 700)
  .map(w => w.wallet);
await distributeAirdrop(eligibleWallets);
```

---

## 🏆 Hackathon Highlights

### ✨ Innovation
- **First** reputation protocol native to Bitcoin via Stacks
- **Novel** x402 payment protocol for AI agent API access
- **Unique** identity verification with ZK-proof architecture
- **Advanced** AI-powered score explanations

### 🎨 Design & UX
- Cyberpunk-themed dashboard with HUD aesthetics
- Real-time score updates with smooth animations
- Mobile-responsive design with hamburger menu
- Network badge (mainnet/testnet) with color coding
- Comprehensive error handling and loading states

### 🔧 Technical Excellence
- **Production-ready** code with full TypeScript coverage
- **Zero diagnostics** - all code passes strict type checking
- **Security-first** - Helmet.js, CORS, rate limiting, input validation
- **Performance** - Redis caching, React Query, compression
- **Scalable** - Modular architecture, clean separation of concerns

### 📚 Documentation
- Comprehensive README with architecture diagrams
- Detailed API documentation
- Smart contract documentation
- Deployment guides
- Production audit report

### 🚀 Deployment
- **Live demo** on Vercel (frontend) + Render (backend)
- **CI/CD** with auto-deployment from GitHub
- **Monitoring** with structured logging
- **Health checks** and graceful shutdown

---

## 🗺️ Roadmap

### Phase 1: MVP (Current) ✅
- [x] On-chain reputation scoring
- [x] Identity verification system
- [x] x402 payment protocol
- [x] Mainnet/testnet support
- [x] Production deployment

### Phase 2: Enhanced Features (Q2 2026)
- [ ] OAuth integration for GitHub/Twitter
- [ ] BNS domain on-chain verification
- [ ] Mainnet contract deployment
- [ ] Redis persistence for verifications
- [ ] Email notifications for score changes

### Phase 3: Ecosystem Integration (Q3 2026)
- [ ] API key system for AI agents
- [ ] Webhook support for score updates
- [ ] SDK for easy integration (JS, Python, Rust)
- [ ] Governance token for protocol decisions
- [ ] DAO for scoring model upgrades

### Phase 4: Multi-Chain (Q4 2026)
- [ ] Bitcoin L2 support (Lightning, Liquid)
- [ ] Cross-chain reputation portability
- [ ] Advanced analytics dashboard
- [ ] Machine learning model improvements

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Quality
- All code must pass TypeScript strict mode
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Stacks Foundation** for the amazing Bitcoin L2 platform
- **Hiro Systems** for the Stacks API and developer tools
- **Bitcoin Community** for inspiring decentralized innovation
- **Hackathon Organizers** for the opportunity to build

---

## 📞 Contact & Links

- **Live Demo**: [https://bittrust-five.vercel.app](https://bittrust-five.vercel.app)
- **GitHub**: [https://github.com/Zakariasisu5/BitTrust](https://github.com/Zakariasisu5/BitTrust)
- **Documentation**: [docs/](docs/)
- **Twitter**: [@BitTrustProtocol](#)
- **Discord**: [Join our community](#)

---

<div align="center">

**Built with ❤️ for the Bitcoin ecosystem**

⭐ Star us on GitHub if you find this project interesting!

[Live Demo](https://bittrust-five.vercel.app) • [Documentation](docs/) • [API Docs](#api-documentation) • [Roadmap](#roadmap)

</div>
