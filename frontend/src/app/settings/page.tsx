"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Globe, Shield, Bell, AlertCircle } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

export default function SettingsPage() {
  const { isConnected } = useWallet();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Dummy state
  const [isPublic, setIsPublic] = useState(true);
  const [x402Auto, setX402Auto] = useState(false);
  const [maxAmount, setMaxAmount] = useState("0.05");
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    }, 1000);
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 rounded-full bg-slate-900 p-6 border border-slate-800">
          <AlertCircle className="h-12 w-12 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold">Wallet Disconnected</h1>
        <p className="mt-2 text-slate-400">Please connect your wallet to access settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-3xl">
      <div>
        <div className="font-mono text-xs text-amber-500 mb-2">{'// SYSTEM_CONFIG'}</div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Settings</h1>
        <p className="text-slate-500">Manage your profile visibility and protocol preferences.</p>
      </div>

      <Card className="matte-card relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
        <CardHeader className="relative z-10 border-b border-slate-800/50 bg-slate-900/30">
          <CardTitle className="text-sm font-mono flex items-center gap-2 text-slate-400">
            <Globe className="h-4 w-4 text-amber-500" /> [{'>'} CONFIG::PUBLIC_PROFILE]
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs font-mono">
            Control who can view your reputation score.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <Label className="text-sm font-mono text-slate-200">MAKE_PROFILE_PUBLIC</Label>
              <p className="text-xs font-mono text-slate-500 mt-1">Allow anyone to view your trust score via the web dashboard.</p>
            </div>
            <Switch 
              checked={isPublic} 
              onCheckedChange={setIsPublic} 
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="matte-card relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
        <CardHeader className="relative z-10 border-b border-slate-800/50 bg-slate-900/30">
          <CardTitle className="text-sm font-mono flex items-center gap-2 text-slate-400">
            <Shield className="h-4 w-4 text-amber-500" /> [{'>'} CONFIG::X402_PROTOCOL]
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs font-mono">
            Manage your autonomous machine-to-machine interactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <Label className="text-sm font-mono text-slate-200">AUTO_APPROVE_PAYMENTS</Label>
              <p className="text-xs font-mono text-slate-500 mt-1">Automatically accept x402 payments to reveal your score to requesting agents.</p>
            </div>
            <Switch 
              checked={x402Auto} 
              onCheckedChange={setX402Auto} 
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
          
          <div className={`space-y-2 transition-opacity duration-200 border-l-2 border-slate-800 pl-4 py-2 ${x402Auto ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <Label htmlFor="amount" className="text-xs font-mono text-slate-400">MIN_QUERY_FEE (USDCx)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-amber-500 font-mono text-sm">{'>'}</span>
              <Input 
                id="amount" 
                type="number"
                step="0.01"
                className="bg-[#050816] border-slate-800 text-slate-100 focus-visible:ring-amber-500 w-full sm:w-1/2 font-mono text-xs pl-8"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
            <p className="text-[10px] font-mono text-slate-500 mt-2">The minimum amount an agent must pay to access your reputation data.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="matte-card relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
        <CardHeader className="relative z-10 border-b border-slate-800/50 bg-slate-900/30">
          <CardTitle className="text-sm font-mono flex items-center gap-2 text-slate-400">
            <Bell className="h-4 w-4 text-amber-500" /> [{'>'} CONFIG::NOTIFICATIONS]
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <Label className="text-sm font-mono text-slate-200">SCORE_UPDATE_ALERTS</Label>
              <p className="text-xs font-mono text-slate-500 mt-1">Receive alerts when your reputation score changes by more than 10 points.</p>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={setNotifications} 
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving} className="primary-btn px-8 font-mono text-xs">
          {isSaving ? (
            <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> SAVING_CONFIG_</>
          ) : (
            <><Save className="mr-2 h-3 w-3" /> SAVE_CONFIG</>
          )}
        </Button>
      </div>
    </div>
  );
}
