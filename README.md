## BitTrust

BitTrust is a decentralized reputation protocol built on Stacks that allows wallets and AI agents to verify trust before interacting in the Bitcoin ecosystem.

The protocol analyzes blockchain activity and generates dynamic trust scores that help users, AI agents, and decentralized applications make safer decisions before sending funds or executing transactions.


---

## Problem

As decentralized systems grow, trust becomes difficult to establish.

AI agents, DeFi platforms, and automated systems increasingly interact with unknown wallets.

Without a reliable reputation system:

malicious wallets can scam users

AI agents cannot verify trusted counterparts

DeFi protocols struggle with risk evaluation

sybil attacks become more common


A transparent trust layer is needed

<img width="1024" height="1536" alt="file_00000000b03871fd90c1a11fc795d20e" src="https://github.com/user-attachments/assets/a2394f61-dca4-4dc9-96f0-f6001e3a073f" />



---

## Solution

BitTrust provides a reputation scoring protocol that evaluates wallet behavior using blockchain data.

Before interacting with another wallet or AI agent, users can query BitTrust to retrieve a trust score.

This score helps determine whether the counterparty is:

high risk

moderately trusted

highly reliable


<p align="center">
	<img src="https://github.com/user-attachments/assets/a2394f61-dca4-4dc9-96f0-f6001e3a073f" width="400" alt="BitTrust Logo" />
</p>

# BitTrust

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Stacks](https://img.shields.io/badge/Built%20on-Stacks-blue)](https://www.stacks.co/)

**BitTrust** is a decentralized reputation protocol for the Bitcoin ecosystem, built on Stacks. It enables wallets and AI agents to verify trust before interacting, using on-chain reputation scores derived from blockchain activity.

---

## Table of Contents

- [Problem](#problem)
- [Solution](#solution)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Reputation Scoring Factors](#reputation-scoring-factors)
- [Trust Score Levels](#trust-score-levels)
- [Technology Stack](#technology-stack)
- [Demo Workflow](#demo-workflow)
- [Use Cases](#use-cases)
- [Quick Start](#quick-start)
- [Contracts](#contracts)
- [Contributing](#contributing)
- [License](#license)

---

## Problem

> As decentralized systems grow, trust becomes difficult to establish. AI agents, DeFi platforms, and automated systems increasingly interact with unknown wallets. Without a reliable reputation system:

- Malicious wallets can scam users
- AI agents cannot verify trusted counterparts
- DeFi protocols struggle with risk evaluation
- Sybil attacks become more common

A transparent, on-chain trust layer is needed.

---

## Solution

BitTrust provides a transparent, on-chain reputation scoring protocol that evaluates wallet behavior using blockchain data. Before interacting, users or agents can query BitTrust to retrieve a trust score, helping them determine if a counterparty is:

- High risk
- Moderately trusted
- Highly reliable

All reputation data is stored on-chain via smart contracts for transparency and auditability.

<p align="center">
	<img src="https://github.com/user-attachments/assets/9e473c01-fd61-4a26-ba02-34548b536c95" width="400" alt="BitTrust Solution" />
</p>

---

## Key Features

- **Wallet Reputation Scoring**: Analyze wallet behavior to generate trust scores.
- **AI Agent Trust Verification**: Allow automated agents to verify reputation before interacting.
- **On-Chain Reputation Registry**: Reputation scores stored using smart contracts.
- **Micro-Payment Reputation Queries**: Users or agents pay small fees to request trust data.
- **Leaderboard & Analytics**: Display trusted wallets and reputation history.

---

## Architecture

BitTrust consists of four major components:

- **Frontend**: User interface for wallet connection and reputation queries ([frontend/src/app](frontend/src/app)).
- **Backend Reputation Engine**: Processes blockchain data and calculates trust scores.
- **Smart Contracts**: Store reputation scores and verify payments ([contracts/](contracts/)).
- **Blockchain Layer**: Data anchored to Bitcoin through Stacks.

<p align="center">
	<img src="https://github.com/user-attachments/assets/834b407e-a759-4115-9a4d-6031373a46af" width="400" alt="BitTrust Architecture" />
</p>

---

## Reputation Scoring Factors

BitTrust evaluates wallets using several metrics:

- Wallet age
- Transaction frequency
- Smart contract interaction success rate
- DeFi activity and repayment behavior
- Interaction with trusted protocols
- Detection of suspicious or sybil-like behavior

These signals are used to produce a trust score between 0 and 100.

---

## Trust Score Levels

| Score      | Trust Level      |
|------------|-----------------|
| 0 – 30     | High Risk        |
| 31 – 60    | Medium Risk      |
| 61 – 80    | Trusted          |
| 81 – 100   | Highly Trusted   |

---

## Technology Stack

**Frontend:**
- React / Next.js
- Tailwind CSS
- Stacks wallet integration

**Backend:**
- Node.js / Python
- Reputation scoring engine
- Blockchain data indexing

**Smart Contracts:**
- Clarity smart contracts on Stacks

**AI Layer:**
- Anomaly detection
- Wallet behavior analysis
- Trust prediction models

---

## Demo Workflow

1. User connects wallet
2. BitTrust retrieves wallet activity
3. Reputation engine calculates trust score
4. Score stored on-chain
5. User or AI agent queries reputation
6. Micro-payment processed
7. Trust score returned

---

## Use Cases

BitTrust can be used in multiple ecosystems:

- DeFi lending risk analysis
- AI-to-AI economic interactions
- Decentralized freelance marketplaces
- DAO reputation systems
- Fraud detection systems

---

## MVP Goals

- Wallet reputation scoring
- Reputation query API
- On-chain score storage
- Simple dashboard interface
- AI behavior analysis

---

## Future Roadmap

- Reputation NFTs
- Decentralized scoring governance
- Cross-chain reputation
- AI-driven fraud detection
- Trust network graphs

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Clarinet](https://docs.stacks.co/docs/clarinet/overview/) for smart contract development

### Install & Run Frontend

```bash
cd frontend
npm install
npm run dev
```

### Run Smart Contract Tests

```bash
clarinet check
```

### Run All Tests

```bash
npm test
```

---

## Contracts

See [contracts/](contracts/) for Clarity smart contracts:

- `bittrust-payment.clar` — Handles payments for reputation queries
- `bittrust-reputation.clar` — Core reputation logic
- `usdcx-mock.clar` — Mock USDC contract for testing

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) (or open an issue/PR) for guidelines.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
