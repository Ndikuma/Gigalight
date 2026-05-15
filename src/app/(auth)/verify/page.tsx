
"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight, Mail, Loader2, Smartphone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function VerifyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Node Validated",
        description: "Your session is now active on the L2 protocol.",
      });
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <Card className="glass-card border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
      <CardHeader className="p-10 pb-4 text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <CardTitle className="text-3xl font-headline font-bold tracking-tight">Node Validation</CardTitle>
        <CardDescription className="text-muted-foreground font-medium">
          Confirm your signal to activate your node.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-10 pt-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <Mail className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We've sent a validation signal to <span className="text-foreground font-bold">alex@satoshi.mail</span>. 
            Confirm the signal to finalize your identity registration.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Button 
            className="w-full h-14 rounded-2xl bg-primary neon-glow-primary font-bold text-lg"
            onClick={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Validating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Simulate Validation <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
          <Button variant="ghost" className="h-12 rounded-xl text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Resend Signal
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-10 pt-0 flex flex-col items-center gap-4 border-t border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <Smartphone className="w-3 h-3" /> SMS Validation Optional
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          Wrong email? <Link href="/signup" className="text-primary font-bold hover:underline">Change Identity Details</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
