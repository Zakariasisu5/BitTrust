"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/context/WalletContext";
import {
  useVerificationQuery,
  useLinkProviderMutation,
  useUnlinkProviderMutation,
} from "@/hooks/useVerificationQuery";
import { toDisplayScore } from "@/lib/score-utils";
import {
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Github,
  Twitter,
  MessageSquare,
  AtSign,
  AlertCircle,
  Unlink,
  ExternalLink,
  TrendingUp,
  Lock,
} from "lucide-react";
import type { ProviderType } from "@/types/backend";

interface ProviderDef {
  id: ProviderType;
  name: string;
  description: string;
  icon: React.ElementType;
  bonus: number;
  displayBonus: number;
  placeholder: string;
  hint: string;
  color: string;
}

const PROVIDERS: ProviderDef[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Verify your developer identity and open-source contribution history.",
    icon: Github,
    bonus: 8,
    displayBonus: 80,
    placeholder: "your-github-username",
    hint: "Enter your GitHub username exactly as it appears on github.com",
    color: "border-t-slate-400/50",
  },
  {
    id: "bns",
    name: "BNS Domain",
    description: "Link a .btc domain on Stacks - the strongest on-chain proof of identity.",
    icon: AtSign,
    bonus: 10,
    displayBonus: 100,
    placeholder: "yourname.btc",
    hint: "Enter your .btc domain registered on the Stacks blockchain",
    color: "border-t-amber-500/50",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    description: "Link your social presence to prove you are a real human.",
    icon: Twitter,
    bonus: 4,
    displayBonus: 40,
    placeholder: "@yourhandle",
    hint: "Enter your X/Twitter handle including the @ symbol",
    color: "border-t-sky-500/50",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Connect your DAO or community identity on Discord.",
    icon: MessageSquare,
    bonus: 3,
    displayBonus: 30,
    placeholder: "username#0000",
    hint: "Enter your Discord username (e.g. username or username#1234)",
    color: "border-t-indigo-500/50",
  },
];

const MAX_BONUS_DISPLAY = toDisplayScore(PROVIDERS.reduce((s, p) => s + p.bonus, 0));


export default function VerificationPage() {
  const { isConnected, address } = useWallet();
  const { toast } = useToast();
  const { data: verification, isLoading } = useVerificationQuery(address ?? null);
  const linkMutation = useLinkProviderMutation();
  const unlinkMutation = useUnlinkProviderMutation();
  const [activeDialog, setActiveDialog] = useState<ProviderType | null>(null);
  const [handleInput, setHandleInput] = useState("");
  const verifiedMap = new Map((verification?.providers ?? []).map((p) => [p.provider, p]));
  const totalBonusDisplay = toDisplayScore(verification?.totalBonus ?? 0);
  const activeProvider = PROVIDERS.find((p) => p.id === activeDialog);

  const openDialog = (id: ProviderType) => {
    setHandleInput(verifiedMap.get(id)?.handle ?? "");
    setActiveDialog(id);
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setHandleInput("");
  };

  const handleLink = () => {
    if (!address || !activeDialog || !handleInput.trim()) return;
    linkMutation.mutate(
      { wallet: address, provider: activeDialog, handle: handleInput.trim() },
      {
        onSuccess: (data) => {
          toast({ title: "Verification Linked", description: `+${toDisplayScore(data.bonus)} pts added to your reputation score.` });
          closeDialog();
        },
        onError: (err: unknown) => {
          toast({ title: "Link Failed", description: String(err), variant: "destructive" });
        },
      }
    );
  };

  const handleUnlink = (provider: ProviderType) => {
    if (!address) return;
    unlinkMutation.mutate(
      { wallet: address, provider },
      {
        onSuccess: () => toast({ title: "Unlinked", description: `${provider} removed from your profile.` }),
        onError: (err: unknown) => toast({ title: "Unlink Failed", description: String(err), variant: "destructive" }),
      }
    );
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
        <div className="font-mono text-xs text-amber-500 mb-2">{"// KYC_MODULE_INITIALIZED"}</div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Identity Verification</h1>
        <p className="text-slate-500">Link external accounts to boost your reputation tier and prove humanity.</p>
      </div>
      <Card className="matte-card relative overflow-hidden border-t-2 border-t-amber-500/50">
        <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
        <CardContent className="relative z-10 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500">IDENTITY_BONUS_ACTIVE</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-mono text-amber-500">+{totalBonusDisplay}</span>
                <span className="text-slate-500 font-mono text-sm">/ {MAX_BONUS_DISPLAY} pts max</span>
              </div>
              <p className="text-xs text-slate-500 font-mono">{verifiedMap.size} of {PROVIDERS.length} providers linked</p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <div className="w-full sm:w-48 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500" style={{ width: `${MAX_BONUS_DISPLAY > 0 ? (totalBonusDisplay / MAX_BONUS_DISPLAY) * 100 : 0}%` }} />
              </div>
              <p className="text-[10px] font-mono text-slate-500">{MAX_BONUS_DISPLAY - totalBonusDisplay > 0 ? `+${MAX_BONUS_DISPLAY - totalBonusDisplay} pts still available` : "MAX BONUS REACHED"}</p>
            </div>
          </div>
        </CardContent>
      </Card>


      <div className="grid gap-6 md:grid-cols-2">
        {PROVIDERS.map((provider) => {
          const verified = verifiedMap.get(provider.id);
          const isVerified = !!verified;
          const isUnlinking = unlinkMutation.isPending && (unlinkMutation.variables as { provider: string } | undefined)?.provider === provider.id;
          return (
            <Card key={provider.id} className={`matte-card relative overflow-hidden border-t-2 ${provider.color} transition-all`}>
              <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
              <CardHeader className="flex flex-row items-start justify-between pb-2 relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border ${isVerified ? "border-emerald-500/40" : "border-slate-800"}`}>
                    <provider.icon className={`h-5 w-5 ${isVerified ? "text-emerald-400" : "text-amber-500"}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base font-mono text-slate-200">[{provider.name.toUpperCase()}]</CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">{provider.description}</CardDescription>
                  </div>
                </div>
                {isVerified && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-mono text-[10px] shrink-0"><CheckCircle2 className="mr-1 h-3 w-3" /> VERIFIED</Badge>}
              </CardHeader>
              <CardContent className="relative z-10 space-y-3">
                {isVerified && verified && (
                  <div className="rounded border border-slate-800 bg-slate-950/50 px-3 py-2 font-mono text-[10px] space-y-1">
                    <div className="flex justify-between text-slate-500"><span>HANDLE</span><span className="text-slate-300">{verified.handle}</span></div>
                    <div className="flex justify-between text-slate-500"><span>VERIFIED_AT</span><span className="text-slate-400">{new Date(verified.verifiedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-sm">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    <span className={isVerified ? "text-emerald-400 font-bold" : "text-slate-400"}>+{provider.displayBonus} pts</span>
                    {isVerified && <span className="text-[10px] text-emerald-500/60">[ACTIVE]</span>}
                  </div>
                  <div className="flex gap-2">
                    {isVerified ? (
                      <>
                        <Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 font-mono text-xs h-8" onClick={() => openDialog(provider.id)}>UPDATE</Button>
                        <Button variant="outline" size="sm" className="border-red-900/50 text-red-400 hover:bg-red-950/30 font-mono text-xs h-8" onClick={() => handleUnlink(provider.id)} disabled={isUnlinking}>{isUnlinking ? <Loader2 className="h-3 w-3 animate-spin" /> : <Unlink className="h-3 w-3" />}</Button>
                      </>
                    ) : (
                      <Button size="sm" className="primary-btn font-mono text-xs h-8" onClick={() => openDialog(provider.id)} disabled={isLoading}>CONNECT</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>


      <Card className="matte-card bg-[#050816] border-amber-500/20 glow-amber relative overflow-hidden">
        <div className="scanline" />
        <CardContent className="flex items-start gap-4 p-6 relative z-10">
          <Lock className="h-8 w-8 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-mono font-bold text-amber-500">{"[> PRIVACY_ENCLAVE_NOTICE]"}</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400 font-mono">BitTrust uses Zero-Knowledge (ZK) proofs to verify your identity. Your social handles and private data are never stored on-chain or shared with querying AI agents. Only the cryptographic proof of verification is recorded to compute your trust score. Unlinking a provider removes the bonus from future score computations.</p>
          </div>
        </CardContent>
      </Card>
      <Dialog open={!!activeDialog} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="bg-[#050816] border-slate-800 text-slate-100 font-mono max-w-md">
          <DialogHeader><DialogTitle className="text-amber-500 font-mono text-sm">{activeProvider ? `[LINK_${activeProvider.name.toUpperCase()}]` : ""}</DialogTitle></DialogHeader>
          {activeProvider && (
            <div className="space-y-4 pt-2">
              <div className="rounded border border-slate-800 bg-slate-950/50 px-3 py-2 text-[10px] space-y-1">
                <div className="flex justify-between text-slate-500"><span>SCORE_BONUS</span><span className="text-emerald-400 font-bold">+{activeProvider.displayBonus} pts</span></div>
                <div className="flex justify-between text-slate-500"><span>PROVIDER</span><span className="text-slate-300">{activeProvider.name}</span></div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-400 font-mono">HANDLE / USERNAME</Label>
                <Input value={handleInput} onChange={(e) => setHandleInput(e.target.value)} placeholder={activeProvider.placeholder} className="bg-slate-900 border-slate-700 text-slate-100 font-mono text-sm focus:border-amber-500/50" onKeyDown={(e) => { if (e.key === "Enter") handleLink(); }} />
                <p className="text-[10px] text-slate-600 font-mono">{activeProvider.hint}</p>
              </div>
              {activeProvider.id === "bns" && <a href="https://btc.us" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-amber-500/70 hover:text-amber-400 font-mono transition-colors"><ExternalLink className="h-3 w-3" /> Register a .btc domain at btc.us</a>}
              {activeProvider.id === "github" && <a href={`https://github.com/${handleInput || "your-username"}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-amber-500/70 hover:text-amber-400 font-mono transition-colors"><ExternalLink className="h-3 w-3" /> Preview github.com/{handleInput || "your-username"}</a>}
              <div className="flex gap-2 pt-2">
                <Button className="primary-btn flex-1 font-mono text-xs" onClick={handleLink} disabled={!handleInput.trim() || linkMutation.isPending}>{linkMutation.isPending ? <><Loader2 className="h-3 w-3 animate-spin mr-2" /> VERIFYING_</> : <><ShieldCheck className="h-3 w-3 mr-2" /> CONFIRM_LINK</>}</Button>
                <Button variant="outline" className="border-slate-700 text-slate-400 font-mono text-xs" onClick={closeDialog}>CANCEL</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
