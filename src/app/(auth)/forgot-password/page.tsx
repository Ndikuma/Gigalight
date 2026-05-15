
"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RotateCcw, ArrowRight, Mail, Loader2, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      toast({
        title: "Recovery Signal Sent",
        description: "Check your Satoshi Protocol Mail.",
      });
    }, 1500);
  };

  return (
    <Card className="glass-card border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
      <CardHeader className="p-10 pb-4 text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-2">
          <RotateCcw className="w-7 h-7" />
        </div>
        <CardTitle className="text-3xl font-headline font-bold tracking-tight">Identity Recovery</CardTitle>
        <CardDescription className="text-muted-foreground font-medium">
          Recover access to your professional node.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-10 pt-6">
        {!isSent ? (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Protocol Mail</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="email"
                  placeholder="alex@satoshi.mail" 
                  className="h-12 bg-black/40 border-white/5 rounded-xl pl-11 focus:ring-primary/40"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit"
              className="w-full h-14 rounded-2xl bg-primary neon-glow-primary font-bold text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Requesting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Request Recovery Signal <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-sm font-medium leading-relaxed">
                A recovery signal has been propagated to your mailbox. Follow the instructions to re-initialize your access key.
              </p>
            </div>
            <Button asChild variant="outline" className="w-full h-12 rounded-xl border-white/10 font-bold">
              <Link href="/login">Return to Login</Link>
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-10 pt-0 flex justify-center border-t border-white/5 bg-white/[0.02]">
        <p className="text-xs text-muted-foreground font-medium">
          Remembered your key? <Link href="/login" className="text-primary font-bold hover:underline">Access Identity</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
