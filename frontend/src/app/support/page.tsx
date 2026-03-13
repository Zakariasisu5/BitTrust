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
        <h1 className="text-3xl font-bold tracking-tight">Support & FAQ</h1>
        <p className="text-slate-500">Get help with your BitTrust account and integrations.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact Form */}
        <Card className="matte-card h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-amber-500" /> Contact Us
            </CardTitle>
            <CardDescription className="text-slate-400">
              Need assistance? Send us a message directly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-slate-300">Subject</Label>
                <Input 
                  id="subject" 
                  placeholder="e.g. Issue with wallet connection" 
                  className="bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-amber-500"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-300">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Describe your issue in detail..." 
                  className="min-h-[120px] bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-amber-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full primary-btn mt-2" 
                disabled={isSubmitting || !subject || !message}
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="mr-2 h-4 w-4" /> Send Message</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="matte-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-amber-500" /> Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-sm font-semibold text-slate-200">How is my reputation score calculated?</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Your score is dynamically calculated using an on-chain indexing engine. We analyze your wallet age, transaction frequency, successful smart contract interactions, and DeFi loan repayment history.
              </p>
            </div>
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-sm font-semibold text-slate-200">What is the x402 Protocol?</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                x402 is a micro-payment standard allowing HTTP APIs to be monetized natively. When an AI agent queries your trust score, they receive an HTTP 402 code, pay a micro-fee via Stacks, and then receive the data.
              </p>
            </div>
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-sm font-semibold text-slate-200">Why is my score lower than expected?</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                If your wallet is relatively new or has minimal interaction with verified DeFi protocols, your score will start in the "Medium Risk" tier. Participate in Stacks ecosystem governance or DeFi to boost your score.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Can I reset my score?</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Because BitTrust indexes immutable blockchain data, scores cannot be manually reset or erased. However, consistent positive behavior will rapidly improve your score over time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
