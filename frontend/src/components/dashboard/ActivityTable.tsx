"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/context/WalletContext";

interface TxItem {
  tx_id: string;
  tx_type: string;
  tx_status: string;
  block_time_iso?: string;
  burn_block_time_iso?: string;
  contract_call?: { contract_id: string; function_name: string };
  token_transfer?: { amount: string };
}

interface TxListResponse {
  results: TxItem[];
}

function formatTxType(tx: TxItem): string {
  if (tx.tx_type === "contract_call") {
    const fn = tx.contract_call?.function_name ?? "call";
    return fn.length > 20 ? fn.slice(0, 20) + "…" : fn;
  }
  if (tx.tx_type === "token_transfer") return "Transfer";
  if (tx.tx_type === "smart_contract") return "Deploy";
  return tx.tx_type ?? "Unknown";
}

function formatDesc(tx: TxItem): string {
  if (tx.tx_type === "contract_call") {
    const id = tx.contract_call?.contract_id ?? "";
    const parts = id.split(".");
    return parts[1] ?? id;
  }
  if (tx.tx_type === "token_transfer") {
    const amt = tx.token_transfer?.amount;
    return amt ? `${(Number(amt) / 1_000_000).toFixed(2)} STX` : "STX transfer";
  }
  return tx.tx_type ?? "—";
}

function formatDate(tx: TxItem): string {
  const iso = tx.block_time_iso ?? tx.burn_block_time_iso;
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

const STACKS_API = "https://api.testnet.hiro.so";

export const ActivityTable = () => {
  const { address, network } = useWallet();
  const [txs, setTxs] = useState<TxItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    const base =
      network === "mainnet"
        ? "https://api.hiro.so"
        : STACKS_API;
    setIsLoading(true);
    fetch(`${base}/extended/v1/address/${address}/transactions?limit=10`, {
      headers: { Accept: "application/json" },
    })
      .then((r) => r.json() as Promise<TxListResponse>)
      .then((data) => setTxs(data.results ?? []))
      .catch(() => setTxs([]))
      .finally(() => setIsLoading(false));
  }, [address, network]);

  return (
    <Card className="matte-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-400 font-mono">
          [{">"} EVENT_LOGS]
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full bg-slate-800" />
            ))}
          </div>
        ) : txs.length === 0 ? (
          <p className="text-sm text-slate-500 font-mono py-4">
            {address ? "No transactions found." : "Connect wallet to view activity."}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-xs text-slate-500 font-mono">TIMESTAMP</TableHead>
                <TableHead className="text-xs text-slate-500 font-mono">TYPE</TableHead>
                <TableHead className="text-xs text-slate-500 font-mono">EVENT_DESC</TableHead>
                <TableHead className="text-xs text-slate-500 text-right font-mono">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txs.map((tx) => (
                <TableRow
                  key={tx.tx_id}
                  className="border-slate-800 hover:bg-slate-900/40 border-l-2 border-l-transparent hover:border-l-amber-500 transition-colors"
                >
                  <TableCell className="text-xs text-slate-400 font-mono">
                    {formatDate(tx)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-[10px] py-0 border-slate-700 text-slate-300 font-mono"
                    >
                      {formatTxType(tx)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-300">
                    {formatDesc(tx)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`text-xs font-mono font-bold ${
                        tx.tx_status === "success"
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {tx.tx_status === "success" ? "OK" : "FAIL"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
