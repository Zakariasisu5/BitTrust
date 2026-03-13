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
        <h1 className="text-3xl font-bold tracking-tight">Identity Verification</h1>
        <p className="text-slate-500">Link external accounts to boost your reputation tier and prove humanity.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {providers.map((provider) => {
          const state = states[provider.id];
          
          return (
            <Card key={provider.id} className="matte-card flex flex-col justify-between">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-800">
                    <provider.icon className="h-5 w-5 text-slate-300" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-1">
                      {provider.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm font-medium text-emerald-500">
                    <ShieldCheck className="h-4 w-4" />
                    +{provider.bonus} Score Bonus
                  </div>
                  
                  {state === "unverified" && (
                    <Button 
                      variant="outline" 
                      className="secondary-btn border-slate-700 bg-slate-800 text-xs h-8"
                      onClick={() => handleVerify(provider.id, provider.name)}
                    >
                      Connect
                    </Button>
                  )}
                  
                  {state === "verifying" && (
                    <Button disabled variant="outline" className="border-slate-800 bg-slate-900 text-slate-400 text-xs h-8">
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Verifying
                    </Button>
                  )}
                  
                  {state === "verified" && (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-1.5 px-3">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="matte-card mt-8 bg-amber-500/5 border-amber-500/20">
        <CardContent className="flex items-start gap-4 p-6">
          <ShieldCheck className="h-8 w-8 text-amber-500 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-amber-500">Privacy Notice</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              BitTrust uses Zero-Knowledge (ZK) proofs to verify your identity. Your social media handles and private data are never stored on-chain or shared with querying AI agents. Only the cryptographic proof of verification is recorded to compute your trust score.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
