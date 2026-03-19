"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Server, FileCode, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs text-amber-500 mb-2">{"// DOCUMENTATION"}</div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Developer Documentation</h1>
          <p className="text-slate-500">Complete guides for integrating with BitTrust</p>
        </div>
        <Button asChild variant="outline" size="sm" className="secondary-btn border-slate-700">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="overview" className="font-mono text-xs">
            <BookOpen className="mr-2 h-3 w-3" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="backend" className="font-mono text-xs">
            <Server className="mr-2 h-3 w-3" />
            Backend API
          </TabsTrigger>
          <TabsTrigger value="frontend" className="font-mono text-xs">
            <Code className="mr-2 h-3 w-3" />
            Frontend
          </TabsTrigger>
          <TabsTrigger value="contracts" className="font-mono text-xs">
            <FileCode className="mr-2 h-3 w-3" />
            Smart Contracts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card className="matte-card">
            <CardHeader>
              <CardTitle className="font-mono text-sm text-amber-500">Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2">What is BitTrust?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  BitTrust is a decentralized reputation protocol that brings credit scores to Bitcoin via Stacks. 
                  It enables AI agents and DeFi protocols to make risk-aware decisions based on on-chain behavior.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="pt-6">
                    <Server className="h-8 w-8 text-amber-500 mb-3" />
                    <h4 className="font-bold mb-2">Backend API</h4>
                    <p className="text-sm text-slate-400 mb-4">
                      RESTful API for reputation scoring, identity verification, and leaderboards.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full font-mono text-xs">
                      <Link href="#backend">View Backend Docs →</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="pt-6">
                    <Code className="h-8 w-8 text-amber-500 mb-3" />
                    <h4 className="font-bold mb-2">Frontend SDK</h4>
                    <p className="text-sm text-slate-400 mb-4">
                      React components and hooks for building reputation-aware applications.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full font-mono text-xs">
                      <Link href="#frontend">View Frontend Docs →</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="pt-6">
                    <FileCode className="h-8 w-8 text-amber-500 mb-3" />
                    <h4 className="font-bold mb-2">Smart Contracts</h4>
                    <p className="text-sm text-slate-400 mb-4">
                      Clarity contracts for on-chain reputation storage and x402 payments.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full font-mono text-xs">
                      <Link href="#contracts">View Contract Docs →</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="pt-6">
                    <ExternalLink className="h-8 w-8 text-amber-500 mb-3" />
                    <h4 className="font-bold mb-2">GitHub Repository</h4>
                    <p className="text-sm text-slate-400 mb-4">
                      Full source code, examples, and contribution guidelines.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full font-mono text-xs">
                      <a href="https://github.com/Zakariasisu5/BitTrust" target="_blank" rel="noopener noreferrer">
                        View on GitHub →
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
                <p className="text-slate-500 mb-2">{"//"} Quick Start Example</p>
                <pre className="text-slate-300 overflow-x-auto">
{`// Fetch reputation score
const response = await fetch(
  'https://bittrust-backend.onrender.com/api/reputation/SP2...?network=testnet'
);
const data = await response.json();
console.log(data.reputationScore); // 0-100`}
                </pre>
              </div>

              <div className="flex gap-4">
                <Button asChild className="primary-btn font-mono text-xs">
                  <a href="https://bittrust-backend.onrender.com/health" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    API Health Check
                  </a>
                </Button>
                <Button asChild variant="outline" className="secondary-btn border-slate-700 font-mono text-xs">
                  <a href="https://github.com/Zakariasisu5/BitTrust" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    View Source Code
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backend" className="mt-6">
          <Card className="matte-card">
            <CardHeader>
              <CardTitle className="font-mono text-sm text-amber-500 flex items-center gap-2">
                <Server className="h-4 w-4" />
                Backend API Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-slate max-w-none">
                <p className="text-slate-400 mb-4">
                  Complete backend API documentation including endpoints, authentication, and examples.
                </p>
                <Button asChild className="primary-btn font-mono text-xs mb-6">
                  <a href="https://github.com/Zakariasisu5/BitTrust/blob/main/docs/backend.md" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Open Full Backend Documentation
                  </a>
                </Button>

                <div className="space-y-4 text-sm">
                  <div className="rounded border border-slate-800 bg-slate-950 p-4">
                    <h4 className="font-bold text-amber-500 mb-2">Base URL</h4>
                    <code className="text-slate-300">https://bittrust-backend.onrender.com/api</code>
                  </div>

                  <div className="rounded border border-slate-800 bg-slate-950 p-4">
                    <h4 className="font-bold text-amber-500 mb-2">Key Endpoints</h4>
                    <ul className="space-y-2 text-slate-300 font-mono text-xs">
                      <li>GET /reputation/:wallet?network=testnet|mainnet</li>
                      <li>POST /reputation/update?network=testnet|mainnet</li>
                      <li>GET /reputation/history/:wallet?network=testnet|mainnet</li>
                      <li>GET /leaderboard?network=testnet|mainnet&limit=50</li>
                      <li>GET /verification/:wallet</li>
                      <li>POST /verification/link</li>
                      <li>DELETE /verification/unlink</li>
                    </ul>
                  </div>

                  <div className="rounded border border-slate-800 bg-slate-950 p-4">
                    <h4 className="font-bold text-amber-500 mb-2">Example Request</h4>
                    <pre className="text-slate-300 overflow-x-auto font-mono text-xs">
{`curl https://bittrust-backend.onrender.com/api/reputation/\\
  SPW435DHYWC9VCCP13BQ4EJRCVDYRA5FDNFV1GXT?network=testnet`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frontend" className="mt-6">
          <Card className="matte-card">
            <CardHeader>
              <CardTitle className="font-mono text-sm text-amber-500 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Frontend Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-slate max-w-none">
                <p className="text-slate-400 mb-4">
                  Complete frontend documentation including components, hooks, and integration guides.
                </p>
                <Button asChild className="primary-btn font-mono text-xs mb-6">
                  <a href="https://github.com/Zakariasisu5/BitTrust/blob/main/docs/frontend.md" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Open Full Frontend Documentation
                  </a>
                </Button>

                <div className="space-y-4 text-sm">
                  <div className="rounded border border-slate-800 bg-slate-950 p-4">
                    <h4 className="font-bold text-amber-500 mb-2">Key Components</h4>
                    <ul className="space-y-2 text-slate-300 font-mono text-xs">
                      <li>ReputationCard - Display reputation score</li>
                      <li>ScoreChart - Historical score visualization</li>
                      <li>FactorBreakdown - Score component breakdown</li>
                      <li>LoanStatus - Loan eligibility display</li>
                      <li>CreditsCard - x402 credit management</li>
                      <li>ActivityTable - Transaction history</li>
                    </ul>
                  </div>

                  <div className="rounded border border-slate-800 bg-slate-950 p-4">
                    <h4 className="font-bold text-amber-500 mb-2">React Hooks</h4>
                    <ul className="space-y-2 text-slate-300 font-mono text-xs">
                      <li>useReputationQuery(address, network)</li>
                      <li>useReputationHistoryQuery(address, network)</li>
                      <li>useLeaderboardQuery(network, limit)</li>
                      <li>useVerificationQuery(address)</li>
                      <li>useUpdateReputationMutation()</li>
                      <li>useCreditsBalance(address, refreshKey)</li>
                      <li>useUsdcBalance(address, refreshKey)</li>
                    </ul>
                  </div>

                  <div className="rounded border border-slate-800 bg-slate-950 p-4">
                    <h4 className="font-bold text-amber-500 mb-2">Example Usage</h4>
                    <pre className="text-slate-300 overflow-x-auto font-mono text-xs">
{`import { useReputationQuery } from "@/hooks/useReputationQuery";

function MyComponent() {
  const { data, isLoading } = useReputationQuery(address, "testnet");
  
  return (
    <div>Score: {data?.reputationScore}</div>
  );
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="mt-6">
          <Card className="matte-card">
            <CardHeader>
              <CardTitle className="font-mono text-sm text-amber-500 flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                Smart Contract Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-slate max-w-none">
                <p className="text-slate-400 mb-4">
                  Clarity smart contracts for on-chain reputation and payment protocol.
                </p>
                <Button asChild className="primary-btn font-mono text-xs mb-6">
                  <a href="https://github.com/Zakariasisu5/BitTrust/blob/main/docs/contract.md" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Open Full Contract Documentation
                  </a>
                </Button>

                <div className="space-y-4 text-sm">
                  <div className="rounded border border-slate-800 bg-slate-950 p-4">
                    <h4 className="font-bold text-amber-500 mb-2">Contracts</h4>
                    <ul className="space-y-2 text-slate-300">
                      <li>
                        <span className="font-mono text-xs">bittrust-reputation.clar</span>
                        <p className="text-slate-500 text-xs mt-1">On-chain reputation score storage</p>
                      </li>
                      <li>
                        <span className="font-mono text-xs">bittrust-payment.clar</span>
                        <p className="text-slate-500 text-xs mt-1">x402 payment protocol for API credits</p>
                      </li>
                      <li>
                        <span className="font-mono text-xs">usdcx-mock.clar</span>
                        <p className="text-slate-500 text-xs mt-1">Test token for development (SIP-010)</p>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded border border-slate-800 bg-slate-950 p-4">
                    <h4 className="font-bold text-amber-500 mb-2">Key Functions</h4>
                    <pre className="text-slate-300 overflow-x-auto font-mono text-xs">
{`;; bittrust-reputation
(define-public (update-score (wallet principal) (score uint)))
(define-read-only (get-score (wallet principal)))

;; bittrust-payment
(define-public (buy-credits (amount uint) (payment-token <ft-trait>)))
(define-public (consume-credit (agent principal)))
(define-read-only (get-balance (agent principal)))`}
                    </pre>
                  </div>

                  <div className="rounded border border-slate-800 bg-slate-950 p-4">
                    <h4 className="font-bold text-amber-500 mb-2">Contract Addresses (Testnet)</h4>
                    <code className="text-slate-300 text-xs">ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
