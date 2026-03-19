"use strict";
/**
 * BitTrust – Stacks Blockchain Data Fetcher
 * Fetches real wallet data from the Hiro Stacks API (testnet + mainnet).
 * Used by the scoring engine to calculate a wallet's reputation score.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWalletActivity = fetchWalletActivity;
const TESTNET_API = "https://api.testnet.hiro.so";
const MAINNET_API = "https://api.hiro.so";
/**
 * Fetch paginated transaction list for a Stacks address.
 * We cap at 3 pages (150 txs) to keep latency reasonable for a real-time API.
 */
async function fetchTransactions(address, baseUrl, maxPages = 3) {
    const limit = 50;
    const allTxs = [];
    for (let page = 0; page < maxPages; page++) {
        const offset = page * limit;
        const url = `${baseUrl}/extended/v1/address/${address}/transactions?limit=${limit}&offset=${offset}`;
        const res = await fetch(url, {
            headers: { Accept: "application/json" },
        });
        if (!res.ok)
            break;
        const data = await res.json();
        allTxs.push(...data.results);
        // Stop early if we've received all transactions
        if (allTxs.length >= data.total || data.results.length < limit)
            break;
    }
    return allTxs;
}
/**
 * Fetch STX balance for the address.
 */
async function fetchBalance(address, baseUrl) {
    try {
        const url = `${baseUrl}/extended/v1/address/${address}/balances`;
        const res = await fetch(url, {
            headers: { Accept: "application/json" },
        });
        if (!res.ok)
            return BigInt(0);
        const data = await res.json();
        return BigInt(data.stx?.balance ?? "0");
    }
    catch {
        return BigInt(0);
    }
}
/**
 * Main entry point: fetch all wallet activity needed for scoring.
 */
async function fetchWalletActivity(address, network = "testnet") {
    const baseUrl = network === "mainnet" ? MAINNET_API : TESTNET_API;
    // Parallel fetches – balance + transactions
    const [txList, stxBalance] = await Promise.all([
        fetchTransactions(address, baseUrl),
        fetchBalance(address, baseUrl),
    ]);
    // ── Derive signals from raw tx list ──────────────────────────────────────
    let successfulTxCount = 0;
    let failedTxCount = 0;
    let contractCallCount = 0;
    const contractsInteracted = new Set();
    let firstTxTimestamp = null;
    let lastTxTimestamp = null;
    let hasDefiActivity = false;
    // Known DeFi protocol contract identifiers (partial matches)
    const DEFI_SIGNALS = [
        "arkadiko",
        "alex",
        "stackingdao",
        "zest",
        "bitflow",
        "velar",
        "wrapped",
        "pool",
        "loan",
        "swap",
        "yield",
    ];
    for (const tx of txList) {
        // Success / failure
        if (tx.tx_status === "success") {
            successfulTxCount++;
        }
        else {
            failedTxCount++;
        }
        // Contract calls
        if (tx.tx_type === "contract_call") {
            contractCallCount++;
        }
        // Timestamps
        const ts = tx.block_time ?? tx.burn_block_time ?? null;
        if (ts) {
            if (firstTxTimestamp === null || ts < firstTxTimestamp) {
                firstTxTimestamp = ts;
            }
            if (lastTxTimestamp === null || ts > lastTxTimestamp) {
                lastTxTimestamp = ts;
            }
        }
        // DeFi detection via contract identifier strings in the tx object
        const txStr = JSON.stringify(tx).toLowerCase();
        if (!hasDefiActivity && DEFI_SIGNALS.some((sig) => txStr.includes(sig))) {
            hasDefiActivity = true;
        }
    }
    // Wallet age in days
    const nowSeconds = Math.floor(Date.now() / 1000);
    const walletAgeDays = firstTxTimestamp !== null
        ? Math.floor((nowSeconds - firstTxTimestamp) / 86400)
        : 0;
    return {
        address,
        network,
        totalTxCount: txList.length,
        successfulTxCount,
        failedTxCount,
        contractCallCount,
        walletAgeDays,
        firstTxTimestamp,
        lastTxTimestamp,
        stxBalance,
        uniqueContractsInteracted: contractsInteracted.size,
        hasDefiActivity,
        fetchedAt: Date.now(),
    };
}
