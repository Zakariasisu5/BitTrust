# Smart Contract Documentation

## Overview

BitTrust uses three Clarity smart contracts deployed on the Stacks blockchain to manage reputation scores, API credits, and test tokens.

**Deployed Contracts (Testnet):**
- `ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG.bittrust-reputation`
- `ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG.bittrust-payment`
- `ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG.usdcx-mock`

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Smart Contract Layer                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  bittrust-       │         │  bittrust-       │         │  usdcx-mock      │
│  reputation      │◄────────┤  payment         │◄────────┤  (SIP-010)       │
│                  │         │                  │         │                  │
│ • Store scores   │         │ • Buy credits    │         │ • Mint tokens    │
│ • Update scores  │         │ • Consume credit │         │ • Transfer       │
│ • Get scores     │         │ • Get balance    │         │ • Get balance    │
└──────────────────┘         └──────────────────┘         └──────────────────┘
        │                            │                            │
        └────────────────────────────┴────────────────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │  Backend API     │
                            │  (Off-chain)     │
                            └──────────────────┘
```

---

## 1. bittrust-reputation.clar

### Purpose
Stores and manages on-chain reputation scores for wallet addresses.

### Data Structures

```clarity
(define-map wallet-scores 
  principal 
  {
    score: uint,
    last-updated: uint,
    tx-count: uint
  }
)
```

### Public Functions

#### update-score
Updates the reputation score for a wallet address.

```clarity
(define-public (update-score (wallet principal) (new-score uint) (tx-count uint))
  (begin
    (asserts! (is-authorized tx-sender) ERR-NOT-AUTHORIZED)
    (ok (map-set wallet-scores wallet {
      score: new-score,
      last-updated: block-height,
      tx-count: tx-count
    }))
  )
)
```

**Parameters:**
- `wallet` (principal): The wallet address to update
- `new-score` (uint): New reputation score (0-100)
- `tx-count` (uint): Number of transactions analyzed

**Returns:** `(ok bool)` on success

**Authorization:** Only authorized backend engines can call this

---

#### get-score
Retrieves the reputation score for a wallet.

```clarity
(define-read-only (get-score (wallet principal))
  (ok (default-to 
    { score: u0, last-updated: u0, tx-count: u0 }
    (map-get? wallet-scores wallet)
  ))
)
```

**Parameters:**
- `wallet` (principal): The wallet address to query

**Returns:** `(ok { score: uint, last-updated: uint, tx-count: uint })`

---

### Authorization

```clarity
(define-public (add-authorized-engine (engine principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (ok (map-set authorized-engines engine true))
  )
)
```

Only the contract owner can authorize backend engines to update scores.

---

## 2. bittrust-payment.clar

### Purpose
Implements the x402 payment protocol for API credits using USDCx tokens.

### Constants

```clarity
(define-constant QUERY-PRICE u1000000) ;; 1 USDCx (6 decimals)
(define-constant PROTOCOL-TREASURY tx-sender)
```

### Data Structures

```clarity
(define-map agent-credits principal uint)
(define-map authorized-engines principal bool)
```

### Public Functions

#### buy-credits
Allows users to purchase API credits using USDCx.

```clarity
(define-public (buy-credits (amount uint) (payment-token <ft-trait>))
  (let (
    (current-credits (default-to u0 (map-get? agent-credits tx-sender)))
    (credits-to-add (/ amount QUERY-PRICE))
  )
    ;; Transfer USDCx to protocol treasury
    (try! (contract-call? payment-token transfer amount tx-sender PROTOCOL-TREASURY none))
    
    ;; Update credits
    (ok (map-set agent-credits tx-sender (+ current-credits credits-to-add)))
  )
)
```

**Parameters:**
- `amount` (uint): Amount of USDCx to spend (in micro-units)
- `payment-token` (<ft-trait>): The SIP-010 token contract

**Returns:** `(ok bool)` on success

**Example:**
```clarity
;; Buy 1 credit (1 USDCx = 1,000,000 micro-units)
(contract-call? .bittrust-payment buy-credits u1000000 .usdcx-mock)

;; Buy 10 credits
(contract-call? .bittrust-payment buy-credits u10000000 .usdcx-mock)
```

---

#### consume-credit
Backend calls this to deduct a credit when serving an API query.

```clarity
(define-public (consume-credit (agent principal))
  (let (
    (current-credits (default-to u0 (map-get? agent-credits agent)))
  )
    (asserts! (is-authorized tx-sender) ERR-NOT-AUTHORIZED)
    (asserts! (>= current-credits u1) ERR-INSUFFICIENT-FUNDS)
    (ok (map-set agent-credits agent (- current-credits u1)))
  )
)
```

**Parameters:**
- `agent` (principal): The wallet address to deduct credit from

**Returns:** `(ok bool)` on success

**Authorization:** Only authorized backend engines can call this

---

#### get-balance
Retrieves the credit balance for a wallet.

```clarity
(define-read-only (get-balance (agent principal))
  (default-to u0 (map-get? agent-credits agent))
)
```

**Parameters:**
- `agent` (principal): The wallet address to query

**Returns:** `uint` - Number of credits

---

### Error Codes

```clarity
(define-constant ERR-NOT-AUTHORIZED (err u101))
(define-constant ERR-INSUFFICIENT-FUNDS (err u201))
```

---

## 3. usdcx-mock.clar

### Purpose
A mock SIP-010 fungible token for testing. DO NOT DEPLOY TO MAINNET.

### Token Details

- **Name:** Mock USDCx
- **Symbol:** mUSDCx
- **Decimals:** 6
- **Standard:** SIP-010

### Public Functions

#### mint
Allows anyone to mint test tokens (testnet only).

```clarity
(define-public (mint (amount uint) (recipient principal))
  (begin
    (ok (try! (ft-mint? usdcx amount recipient)))
  )
)
```

**Parameters:**
- `amount` (uint): Amount to mint (in micro-units)
- `recipient` (principal): Address to receive tokens

**Returns:** `(ok bool)` on success

**Example:**
```clarity
;; Mint 100 USDCx (100,000,000 micro-units)
(contract-call? .usdcx-mock mint u100000000 'ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG)
```

---

#### transfer
Transfers tokens between addresses.

```clarity
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-OWNER)
    (try! (ft-transfer? usdcx amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)
```

**Parameters:**
- `amount` (uint): Amount to transfer
- `sender` (principal): Sender address (must be tx-sender)
- `recipient` (principal): Recipient address
- `memo` (optional buff): Optional transfer memo

**Returns:** `(ok bool)` on success

---

#### get-balance
Retrieves token balance for an address.

```clarity
(define-public (get-balance (who principal))
  (ok (ft-get-balance usdcx who))
)
```

**Parameters:**
- `who` (principal): Address to query

**Returns:** `(ok uint)` - Balance in micro-units

---

## Integration Flow

### 1. User Buys Credits

```
User Wallet → USDCx Transfer → bittrust-payment → Credits Added
```

**Steps:**
1. User calls `buy-credits` with USDCx amount
2. Contract transfers USDCx to protocol treasury
3. Contract calculates credits (amount / QUERY_PRICE)
4. Contract updates user's credit balance

---

### 2. Backend Serves API Query

```
API Request → Check Credits → Consume Credit → Return Data
```

**Steps:**
1. Backend receives API request from user
2. Backend checks credit balance via `get-balance`
3. Backend calls `consume-credit` to deduct 1 credit
4. Backend returns reputation data

---

### 3. Backend Updates Reputation

```
Score Calculation → Update Contract → On-Chain Storage
```

**Steps:**
1. Backend calculates reputation score off-chain
2. Backend calls `update-score` on reputation contract
3. Score is stored on-chain with timestamp
4. Frontend can query score via `get-score`

---

## Testing with Clarinet

### Setup

```bash
cd BitTrust
clarinet console
```

### Test Commands

```clarity
;; Mint test USDCx
(contract-call? .usdcx-mock mint u100000000 'ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG)

;; Check USDCx balance
(contract-call? .usdcx-mock get-balance 'ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG)

;; Buy 1 credit
(contract-call? .bittrust-payment buy-credits u1000000 .usdcx-mock)

;; Check credit balance
(contract-call? .bittrust-payment get-balance 'ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG)

;; Update reputation score (requires authorization)
(contract-call? .bittrust-reputation update-score 'ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG u75 u150)

;; Get reputation score
(contract-call? .bittrust-reputation get-score 'ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG)
```

---

## Deployment

### Testnet Deployment

```bash
clarinet deployments apply --devnet
```

### Verify Deployment

Check contracts on Stacks Explorer:
- https://explorer.hiro.so/txid/[transaction-id]?chain=testnet

---

## Security Considerations

### 1. Authorization
- Only authorized backend engines can update scores
- Only authorized engines can consume credits
- Contract owner manages authorization list

### 2. Payment Validation
- USDCx transfers are atomic (fail if insufficient balance)
- Credits are calculated before transfer
- No partial credit purchases

### 3. Reentrancy Protection
- Clarity prevents reentrancy by design
- All state changes happen after external calls

### 4. Integer Overflow
- Clarity uses checked arithmetic
- Overflow causes transaction to fail

---

## Mainnet Considerations

### Before Mainnet Deployment:

1. **Replace usdcx-mock with real USDC**
   - Use actual USDC contract on Stacks mainnet
   - Update contract addresses in frontend

2. **Add token validation**
   - Whitelist only trusted SIP-010 tokens
   - Prevent malicious token contracts

3. **Implement governance**
   - Multi-sig for contract owner
   - Timelock for critical updates
   - Community voting for parameter changes

4. **Audit contracts**
   - Professional security audit
   - Bug bounty program
   - Formal verification

5. **Set real pricing**
   - Market-based query pricing
   - Dynamic pricing based on demand
   - Volume discounts

---

## API Integration

### JavaScript/TypeScript Example

```typescript
import { openContractCall } from "@stacks/connect";
import { Cl } from "@stacks/transactions";

// Buy 10 credits
await openContractCall({
  contractAddress: "ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG",
  contractName: "bittrust-payment",
  functionName: "buy-credits",
  functionArgs: [
    Cl.uint(10000000), // 10 USDCx
    Cl.contractPrincipal(
      "ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG",
      "usdcx-mock"
    ),
  ],
  network: "testnet",
  onFinish: (data) => console.log("Success:", data.txId),
  onCancel: () => console.log("Cancelled"),
});
```

---

## Future Enhancements

- [ ] Subscription model (monthly credits)
- [ ] Credit expiration dates
- [ ] Credit transfer between wallets
- [ ] Multi-token support (STX, BTC)
- [ ] Reputation NFTs
- [ ] Governance token
- [ ] DAO for protocol upgrades

---

For more details, see:
- [Backend Documentation](backend.md)
- [Frontend Documentation](frontend.md)
- [GitHub Repository](https://github.com/Zakariasisu5/BitTrust)
