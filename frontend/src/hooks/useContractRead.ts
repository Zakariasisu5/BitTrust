"use client";

import { useEffect, useState } from "react";
import {
  fetchCallReadOnlyFunction,
  cvToValue,
  principalCV,
  type ClarityValue,
  type ResponseOkCV,
  type ResponseErrorCV,
} from "@stacks/transactions";
import { CONTRACTS, NETWORK, USDCX_DECIMALS } from "@/lib/contracts";
import type { ReputationScore } from "@/types/contracts";

const SENDER_FALLBACK = "ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG";

function safeNum(v: unknown): number {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function parseReputationResult(cv: ClarityValue): ReputationScore | null {
  if (cv.type !== "ok") return null;
  const inner = (cv as ResponseOkCV).value;
  const val = cvToValue(inner);
  if (!val || typeof val !== "object") return null;
  const raw = val as Record<string, unknown>;
  const score = safeNum(raw.score ?? raw.Score ?? 0);
  const lastUpdated = safeNum(raw["last-updated"] ?? raw.lastUpdated ?? raw.last_updated ?? 0);
  const txCount = safeNum(raw["tx-count"] ?? raw.txCount ?? raw.tx_count ?? 0);
  return { score, lastUpdated, txCount };
}

export function useReputationScore(address: string | null) {
  const [data, setData] = useState<ReputationScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || typeof window === "undefined") {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setError(null);
    setIsLoading(true);
    fetchCallReadOnlyFunction({
      contractAddress: CONTRACTS.reputation.address,
      contractName: CONTRACTS.reputation.name,
      functionName: "get-score",
      functionArgs: [principalCV(address)],
      senderAddress: SENDER_FALLBACK,
      network: NETWORK,
    })
      .then((cv) => {
        if (cancelled) return;
        const parsed = parseReputationResult(cv);
        setData(parsed);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "Failed to fetch score");
        setData(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [address]);

  const displayScore = data ? (Number.isFinite(data.score) ? data.score * 10 : 0) : 0;
  return {
    score: data?.score ?? 0,
    displayScore,
    lastUpdated: data?.lastUpdated ?? 0,
    txCount: data?.txCount ?? 0,
    isLoading,
    error,
  };
}

export function useCreditsBalance(address: string | null, refreshTrigger?: number) {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || typeof window === "undefined") {
      setBalance(0);
      setIsLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setError(null);
    setIsLoading(true);
    fetchCallReadOnlyFunction({
      contractAddress: CONTRACTS.payment.address,
      contractName: CONTRACTS.payment.name,
      functionName: "get-balance",
      functionArgs: [principalCV(address)],
      senderAddress: SENDER_FALLBACK,
      network: NETWORK,
    })
      .then((cv) => {
        if (cancelled) return;
        // Handle response - payment contract returns plain uint
        let finalValue = 0;
        
        if (cv.type === "ok") {
          const innerValue = cvToValue((cv as ResponseOkCV).value);
          finalValue = typeof innerValue === "bigint" ? Number(innerValue) : Number(innerValue ?? 0);
        } else if (cv.type === "err") {
          console.error("Contract returned error:", cvToValue((cv as ResponseErrorCV).value));
        } else {
          const val = cvToValue(cv);
          finalValue = typeof val === "bigint" ? Number(val) : Number(val ?? 0);
        }
        
        setBalance(finalValue);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "Failed to fetch credits");
        setBalance(0);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [address, refreshTrigger]);

  return { balance, isLoading, error };
}

export function useUsdcBalance(address: string | null, refreshTrigger?: number) {
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || typeof window === "undefined") {
      setBalance(BigInt(0));
      setIsLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setError(null);
    setIsLoading(true);
    fetchCallReadOnlyFunction({
      contractAddress: CONTRACTS.usdcxMock.address,
      contractName: CONTRACTS.usdcxMock.name,
      functionName: "get-balance",
      functionArgs: [principalCV(address)],
      senderAddress: SENDER_FALLBACK,
      network: NETWORK,
    })
      .then((cv) => {
        if (cancelled) return;
        // Handle (ok uint) response from SIP-010 get-balance
        let finalValue: bigint = BigInt(0);
        
        if (cv.type === "ok") {
          const innerValue = cvToValue((cv as ResponseOkCV).value);
          if (typeof innerValue === "bigint") {
            finalValue = innerValue;
          }
        } else if (cv.type === "err") {
          console.error("Contract returned error:", cvToValue((cv as ResponseErrorCV).value));
        } else {
          const val = cvToValue(cv);
          if (typeof val === "bigint") {
            finalValue = val;
          }
        }
        
        setBalance(finalValue);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "Failed to fetch USDCx balance");
        setBalance(BigInt(0));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [address, refreshTrigger]);

  const displayBalance = Number(balance) / Math.pow(10, USDCX_DECIMALS);
  return { balance, displayBalance, isLoading, error };
}
