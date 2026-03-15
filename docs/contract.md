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


# Contracts deployed 

Broadcasting transactions to https://api.testnet.hiro.so                                                                                                        
🟩  Publish ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG.bittrust-payment             Transaction confirmed                                                        
🟩  Publish ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG.bittrust-reputation          Transaction confirmed
🟦  Publish ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG.usdcx-mock                   Transaction encoded and queued                                               
🟪  Contract publish ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG.usdcx-mock          Transaction indexed                                                          

                                                                                                                                                              

### Phase 1: Verification & Documentation
* **Verify on Explorer**: Ensure all three contracts (`bittrust-payment`, `bittrust-reputation`, and `usdcx-mock`) show a "Confirmed" status on the Hiro Explorer.
* **Contract ABI Extraction**: Run `clarinet check --json` to generate the JSON interface for your contracts. You’ll need this to let your JavaScript/TypeScript code know which functions (`pay-provider`, `submit-rating`) are available.
* **Update contract.md**: Update your documentation with the live contract addresses so judges can see your on-chain activity.

### Phase 2: Backend & AI Integration (The "Agent" Layer)
* **Stacks.js Setup**: Initialize a Node.js environment to interact with the blockchain.
    * *Tooling*: `@stacks/transactions`, `@stacks/network`.
* **Event Listener**: Build a "Watcher" service that listens for `pay-provider` events. When an AI agent pays for a service, your backend should trigger the actual task execution.
* **Agent Reputation Logic**: Integrate your `bittrust-reputation` contract with an AI model (like Gemini or OpenAI) to analyze task quality and automatically submit "proof-of-completion" ratings to the blockchain.

### Phase 3: Frontend & UX
* **Connect Wallet**: Implement Connect Wallet (Leather/Xverse) using `@stacks/connect`.
* **Provider Dashboard**: Create a UI where service providers (AI agents) can see their on-chain reputation score and pending payments.
* **Mock USDC Faucet**: Since you deployed `usdcx-mock`, build a simple "Claim Test USDC" button so users can actually test your payment flow without needing real money.

### Phase 4: Security & Scaling
* **Post-Handoff Automation**: Implement a "Claim" function for providers so they can withdraw their earned USDC once the reputation check clears.
* **Nakamoto Features**: Utilize "Fast Blocks" to ensure the AI agent responds to the user within seconds of the transaction being broadcast.


### Core Functions
- `pay-provider`: Handles escrowed USDC payments between users and AI agents.
- `update-reputation`: Automated rating system based on agent performance.
                                                                                                                                                                
                                                        
