"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, CheckCircle2, Loader2, Github, Twitter, MessageSquare, AtSign, AlertCircle } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

type VerificationState = "unverified" | "verifying" | "verified";

interface Provider {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  bonus: number;
}

const providers: Provider[] = [
  { id: "github", name: "GitHub", description: "Verify your developer identity and repository history.", icon: Github, bonus: 50 },
  { id: "twitter", name: "X (Twitter)", description: "Link your social presence to prove you are human.", icon: Twitter, bonus: 30 },
  { id: "discord", name: "Discord", description: "Connect your DAO/Community identity.", icon: MessageSquare, bonus: 20 },
  { id: "bns", name: "BNS Domain", description: "Link a .btc domain on Stacks.", icon: AtSign, bonus: 75 },
];

export default function VerificationPage() {
  const { isConnected } = useWallet();
  const { toast } = useToast();
  const [states, setStates] = useState<Record<string, VerificationState>>({
    github: "unverified",
    twitter: "unverified",
    discord: "unverified",
    bns: "unverified",
  });

  const handleVerify = (id: string, name: string) => {
    setStates(prev => ({ ...prev, [id]: "verifying" }));
    
    setTimeout(() => {
      setStates(prev => ({ ...prev, [id]: "verified" }));
      toast({
        title: "Verification Successful",
        description: `Your ${name} account has been verified. Score updated!`,
      });
    }, 2000);
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 rounded-full bg-slate-900 p-6 border border-slate-800">
          <AlertCircle className="h-12 w-12 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold">Wallet Disconnected</h1>
        <p className="mt-2 text-slate-400">Please connect your wallet to access verification.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <div className="font-mono text-xs text-amber-500 mb-2">{'// KYC_MODULE_INITIALIZED'}</div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Identity Verification</h1>
        <p className="text-slate-500">Link external accounts to boost your reputation tier and prove humanity.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {providers.map((provider) => {
          const state = states[provider.id];
          
          return (
            <Card key={provider.id} className="matte-card flex flex-col justify-between hover:border-l-4 hover:border-amber-500 transition-all">
              <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
              <CardHeader className="flex flex-row items-start justify-between pb-2 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-800">
                    <provider.icon className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-mono text-slate-200">[{provider.name.toUpperCase()}]</CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-1">
                      {provider.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm font-bold font-mono text-emerald-500">
                    <ShieldCheck className="h-4 w-4" />
                    +{provider.bonus} SCORE
                  </div>
                  
                  {state === "unverified" && (
                    <Button 
                      variant="outline" 
                      className="secondary-btn border-slate-700 bg-slate-800 text-xs h-8 font-mono"
                      onClick={() => handleVerify(provider.id, provider.name)}
                    >
                      CONNECT
                    </Button>
                  )}
                  
                  {state === "verifying" && (
                    <Button disabled variant="outline" className="border-slate-800 bg-slate-900 text-amber-500 text-xs h-8 font-mono border-amber-500/30">
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      VERIFYING_
                    </Button>
                  )}
                  
                  {state === "verified" && (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-1.5 px-3 font-mono">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> VERIFIED
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="matte-card mt-8 bg-[#050816] border-amber-500/20 glow-amber relative overflow-hidden">
        <div className="scanline" />
        <CardContent className="flex items-start gap-4 p-6 relative z-10">
          <ShieldCheck className="h-8 w-8 text-amber-500 shrink-0" />
          <div>
            <h3 className="text-sm font-mono font-bold text-amber-500">[{'>'} PRIVACY_ENCLAVE_NOTICE]</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400 font-mono">
              BitTrust uses Zero-Knowledge (ZK) proofs to verify your identity. Your social media handles and private data are never stored on-chain or shared with querying AI agents. Only the cryptographic proof of verification is recorded to compute your trust score.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
