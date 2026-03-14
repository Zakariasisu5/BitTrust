;; BitTrust Reputation Registry - Final
;; Stores and stamps wallet reputation scores on-chain

(define-constant ERR-NOT-AUTHORIZED (err u101))
(define-constant ERR-INVALID-SCORE (err u102))
(define-constant CONTRACT-OWNER tx-sender)

;; Cap the maximum score to prevent logic bugs (e.g., 0 to 100)
(define-constant MAX-SCORE u100) 

;; Data Map: Wallet -> { Score, Last Update, Tx Count }
(define-map reputation-scores
    principal
    { score: uint, last-updated: uint, tx-count: uint }
)

;; Authorized Scoring Engines (Your Backend)
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

;; [SECURITY]: Revoke a compromised backend key
(define-public (remove-engine (engine principal))
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (ok (map-delete authorized-engines engine))
    )
)

;; --- Core Functions ---

;; Called by the backend to "Stamp" a score on-chain after calculation
(define-public (update-score (user principal) (new-score uint) (new-tx-count uint))
    (begin
        (asserts! (is-authorized tx-sender) ERR-NOT-AUTHORIZED)
        
        ;; [SECURITY]: Prevent out-of-bounds scores from corrupting the protocol
        (asserts! (<= new-score MAX-SCORE) ERR-INVALID-SCORE)

        (map-set reputation-scores user {
            score: new-score,
            last-updated: block-height,
            tx-count: new-tx-count
        })
        
        ;; [SECURITY/DATA]: Emit an event so off-chain apps know the score changed instantly
        (print { action: "score-updated", user: user, new-score: new-score })
        
        (ok true)
    )
)

;; Read-only query for external DeFi apps or Agents
(define-read-only (get-score (user principal))
    (ok (default-to { score: u0, last-updated: u0, tx-count: u0 } (map-get? reputation-scores user)))
)