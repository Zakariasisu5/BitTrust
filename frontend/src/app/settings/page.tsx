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
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-500">Manage your profile visibility and protocol preferences.</p>
      </div>

      <Card className="matte-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-amber-500" /> Public Profile
          </CardTitle>
          <CardDescription className="text-slate-400">
            Control who can view your reputation score.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <Label className="text-base text-slate-200">Make Profile Public</Label>
              <p className="text-xs text-slate-500">Allow anyone to view your trust score via the web dashboard.</p>
            </div>
            <Switch 
              checked={isPublic} 
              onCheckedChange={setIsPublic} 
              className="data-[state=checked]:bg-amber-500"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="matte-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" /> x402 Protocol Settings
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage your autonomous machine-to-machine interactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <Label className="text-base text-slate-200">Auto-Approve Micro-payments</Label>
              <p className="text-xs text-slate-500">Automatically accept x402 payments to reveal your score to requesting agents.</p>
            </div>
            <Switch 
              checked={x402Auto} 
              onCheckedChange={setX402Auto} 
              className="data-[state=checked]:bg-amber-500"
            />
          </div>
          
          <div className={`space-y-2 transition-opacity duration-200 ${x402Auto ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <Label htmlFor="amount" className="text-slate-300">Minimum Query Fee (USDCx)</Label>
            <Input 
              id="amount" 
              type="number"
              step="0.01"
              className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-amber-500 w-full sm:w-1/2"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
            <p className="text-[10px] text-slate-500">The minimum amount an agent must pay to access your reputation data.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="matte-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-500" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <Label className="text-base text-slate-200">Score Updates</Label>
              <p className="text-xs text-slate-500">Receive alerts when your reputation score changes by more than 10 points.</p>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={setNotifications} 
              className="data-[state=checked]:bg-amber-500"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving} className="primary-btn px-8">
          {isSaving ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            <><Save className="mr-2 h-4 w-4" /> Save Changes</>
          )}
        </Button>
      </div>
    </div>
  );
}
