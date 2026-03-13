"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Mail, Send, Loader2 } from "lucide-react";

export default function SupportPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubject("");
      setMessage("");
      toast({
        title: "Message Sent",
        description: "Our support team will get back to you shortly.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <div className="font-mono text-xs text-amber-500 mb-2">{'// HELPDESK_NODE'}</div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Support & FAQ</h1>
        <p className="text-slate-500">Get help with your BitTrust account and integrations.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact Form */}
        <Card className="matte-card h-fit relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
          <CardHeader className="relative z-10 border-b border-slate-800/50 bg-slate-900/30">
            <CardTitle className="text-sm font-mono flex items-center gap-2 text-slate-400">
              <Mail className="h-4 w-4 text-amber-500" /> [{'>'} OPEN_TICKET]
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs font-mono">
              Direct connection to sys.admin
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-xs font-mono text-slate-400">SUBJECT_LINE:</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-amber-500 font-mono text-sm">{'>'}</span>
                  <Input 
                    id="subject" 
                    placeholder="Issue with wallet connection..." 
                    className="bg-[#050816] border-slate-800 text-slate-200 placeholder:text-slate-700 focus-visible:ring-amber-500 font-mono text-xs pl-8"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs font-mono text-slate-400">TICKET_PAYLOAD:</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-amber-500 font-mono text-sm">{'>'}</span>
                  <Textarea 
                    id="message" 
                    placeholder="Describe your issue..." 
                    className="min-h-[120px] bg-[#050816] border-slate-800 text-slate-200 placeholder:text-slate-700 focus-visible:ring-amber-500 font-mono text-xs pl-8"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full primary-btn mt-2 font-mono text-xs" 
                disabled={isSubmitting || !subject || !message}
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> TRANSMITTING_</>
                ) : (
                  <><Send className="mr-2 h-3 w-3" /> TRANSMIT_TICKET</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="matte-card relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
          <CardHeader className="relative z-10 border-b border-slate-800/50 bg-slate-900/30">
            <CardTitle className="text-sm font-mono flex items-center gap-2 text-slate-400">
              <HelpCircle className="h-4 w-4 text-amber-500" /> [{'>'} SYSTEM_FAQ]
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 relative z-10">
            <div className="border-l-2 border-slate-800 hover:border-amber-500 pl-4 transition-colors pb-4 border-b">
              <h3 className="text-xs font-mono font-bold text-slate-200">{"//"} HOW_IS_SCORE_CALCULATED</h3>
              <p className="mt-2 text-[11px] text-slate-400 leading-relaxed font-mono">
                Your score is dynamically calculated using an on-chain indexing engine. We analyze your wallet age, transaction frequency, successful smart contract interactions, and DeFi loan repayment history.
              </p>
            </div>
            <div className="border-l-2 border-slate-800 hover:border-amber-500 pl-4 transition-colors pb-4 border-b">
              <h3 className="text-xs font-mono font-bold text-slate-200">{"//"} WHAT_IS_X402</h3>
              <p className="mt-2 text-[11px] text-slate-400 leading-relaxed font-mono">
                x402 is a micro-payment standard allowing HTTP APIs to be monetized natively. When an AI agent queries your trust score, they receive an HTTP 402 code, pay a micro-fee via Stacks, and then receive the data.
              </p>
            </div>
            <div className="border-l-2 border-slate-800 hover:border-amber-500 pl-4 transition-colors pb-4 border-b">
              <h3 className="text-xs font-mono font-bold text-slate-200">{"//"} SCORE_LOWER_THAN_EXPECTED</h3>
              <p className="mt-2 text-[11px] text-slate-400 leading-relaxed font-mono">
                If your wallet is relatively new or has minimal interaction with verified DeFi protocols, your score will start in the "Medium Risk" tier. Participate in Stacks ecosystem governance or DeFi to boost your score.
              </p>
            </div>
            <div className="border-l-2 border-slate-800 hover:border-amber-500 pl-4 transition-colors">
              <h3 className="text-xs font-mono font-bold text-slate-200">{"//"} CAN_I_RESET_SCORE</h3>
              <p className="mt-2 text-[11px] text-slate-400 leading-relaxed font-mono">
                Because BitTrust indexes immutable blockchain data, scores cannot be manually reset or erased. However, consistent positive behavior will rapidly improve your score over time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
