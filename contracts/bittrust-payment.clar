;; BitTrust x402 Payment Gateway 
;; Handles micro-payments in USDCx for API access

(use-trait ft-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-constant ERR-NOT-AUTHORIZED (err u101))
(define-constant ERR-INSUFFICIENT-FUNDS (err u201))
(define-constant ERR-INVALID-TOKEN (err u202))

(define-constant CONTRACT-OWNER tx-sender)
(define-constant PROTOCOL-TREASURY tx-sender) ;; Where the fees go
(define-constant QUERY-PRICE u1000000) ;; 1.00 Token (assuming 6 decimals)

;; [SECURITY]: Hardcode the exact token contract - accept to prevent Trait Spoofing.
;; Must match the deployed usdcx-mock contract (same deployer as this contract).
(define-constant ACCEPTED-TOKEN 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx-mock)

;; Maps
(define-map agent-credits principal uint)
(define-map authorized-engines principal bool)

;; --- Authorization Logic ---

(define-read-only (is-authorized (engine principal))
    (default-to false (map-get? authorized-engines engine))
)

(define-public (add-engine (engine principal))
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (ok (map-set authorized-engines engine true))
    )
)

(define-public (remove-engine (engine principal))
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (ok (map-delete authorized-engines engine))
    )
)

;; --- Core Functions ---

;; AI Agent calls this to "Top Up" their API credits using USDCx
(define-public (buy-credits (amount uint) (payment-token <ft-trait>))
    (let (
        (current-credits (default-to u0 (map-get? agent-credits tx-sender)))
        (credits-to-add (/ amount QUERY-PRICE))
    )
        ;; [SECURITY]: Ensure the provided token is exactly the one we trust
        (asserts! (is-eq (contract-of payment-token) ACCEPTED-TOKEN) ERR-INVALID-TOKEN)

        ;; 1. Transfer USDCx to the protocol treasury
        (try! (contract-call? payment-token transfer amount tx-sender PROTOCOL-TREASURY none))
        
        ;; 2. Update their credits
        (ok (map-set agent-credits tx-sender (+ current-credits credits-to-add)))
    )
)

;; Backend calls this to "Burn" a credit just before delivering the x402 score payload
(define-public (consume-credit (agent principal))
    (let (
        (current-credits (default-to u0 (map-get? agent-credits agent)))
    )
        ;; [SECURITY]: Only the backend can deduct credits
        (asserts! (is-authorized tx-sender) ERR-NOT-AUTHORIZED)
        
        ;; Ensure they have a credit to burn
        (asserts! (>= current-credits u1) ERR-INSUFFICIENT-FUNDS)
        
        (ok (map-set agent-credits agent (- current-credits u1)))
    )
)

;; --- Read Only ---

(define-read-only (get-balance (agent principal))
    (default-to u0 (map-get? agent-credits agent))
)