##  BitTrust Integration Flow

BitTrust bridges the gap between off-chain AI decision-making and on-chain financial settlement using the **x402 (Payment Required)** protocol.

| Phase | Action | Technology Used |
| :--- | :--- | :--- |
| **Request** | AI Agent asks for a Reputation Score. | HTTP / x402 Protocol |
| **Rejection** | API returns `402 Payment Required` because no credits exist. | Node.js Backend |
| **Settlement** | AI Agent sends **USDCx** to the BitTrust contract. | Clarity / Stacks L2 |
| **Verification** | Backend detects the transaction and unlocks the score data. | Stacks.js / Hiro API |
| **Delivery** | API returns the score; Contract "stamps" the record on-chain. | JSON / Clarity |

###  Technical Architecture
1. **Clarity Smart Contracts**: Manage the "Cash Register" and "Reputation Registry."
2. **x402 Gateway**: A Node.js middleware that enforces micro-payments.
3. **Scoring Engine**: A Rust/TypeScript service that indices Stacks history.
