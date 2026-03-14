;; title: usdcx-mock
;; version: 1.0
;; summary: A mock SIP-010 token for local testing of BitTrust x402 payments.
;; description: DO NOT DEPLOY TO MAINNET. This is purely for local devnet minting.

;; traits
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; token definitions
(define-fungible-token usdcx)

;; constants
(define-constant ERR-NOT-OWNER (err u401))
(define-constant CONTRACT-OWNER tx-sender)

;; --- SIP-010 Standard Public Functions ---

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-OWNER)
    (try! (ft-transfer? usdcx amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

(define-public (get-name)
  (ok "Mock USDCx")
)

(define-public (get-symbol)
  (ok "mUSDCx")
)

(define-public (get-decimals)
  (ok u6) ;; Standard 6 decimals for USDC
)

(define-public (get-balance (who principal))
  (ok (ft-get-balance usdcx who))
)

(define-public (get-total-supply)
  (ok (ft-get-supply usdcx))
)

(define-public (get-token-uri)
  (ok none)
)

;; --- Custom Testing Functions ---

;; Mint function for testing (Allows anyone to mint fake USDCx for local tests)
(define-public (mint (amount uint) (recipient principal))
  (begin
    (ok (try! (ft-mint? usdcx amount recipient)))
  )
)