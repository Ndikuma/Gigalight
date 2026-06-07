
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Rocket, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Zap, 
  Trophy, 
  Loader2, 
  Users, 
  Target 
} from 'lucide-react';
import Link from 'next/link';
import { ProfileService } from '@/services/profile-service';
import { User } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ProfessionalRolesPage() {
  const [me, setMe] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const res = await ProfileService.getMyProfile();
        if (res.data) setMe(res.data);
      } catch (err) {
        console.error("Profile sync failed");
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const trustIndex = me?.reputation || 0;
  const isEligible = trustIndex >= 90;

  async function handleJoinWaitlist() {
    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      toast({
        title: "Waitlist Propagation Confirmed",
        description: "Your node identity has been added to the Enterprise Tier queue.",
      });
    }, 1500);
  }

  if (isLoading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 py-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-2">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest border border-secondary/20">
            <Sparkles className="w-3 h-3" /> v3.0 Career Node Protocol
          </div>
          <h1 className="text-5xl font-headline font-bold tracking-tight">Enterprise Squads</h1>
          <p className="text-muted-foreground max-w-xl">
            Long-term, high-intensity professional objectives settled with L2 multi-sig payroll automation.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-xl border-white/10 font-bold h-11 px-6 gap-2">
           <Link href="/market">Public Roadmap <ArrowRight className="w-4 h-4" /></Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 px-4 md:px-0">
          <Card className="glass-card border-none bg-gradient-to-br from-secondary/5 to-transparent rounded-[2.5rem] p-10 space-y-8 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Rocket className="w-40 h-40 text-secondary" />
             </div>
             <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                   <h2 className="text-3xl font-headline font-bold">Priority Access Program</h2>
                   <p className="text-muted-foreground leading-relaxed">
                     Nodes with a Trust Index (Reputation Score) &gt; 90 will receive priority selection for the first batch of Enterprise roles. 
                     Maintain high-fidelity output on micro-missions to build your standing.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                        <Zap className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold">L2 Multi-sig Payroll</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">Automated settlement protocols release SATs every 10 minutes based on verifiable output.</p>
                   </div>
                   <div className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold">Identity Portability</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">Your professional standing and Trust Index are owned by your node, not the enterprise.</p>
                   </div>
                </div>

                <div className="pt-4">
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6">Program Prerequisites</h3>
                   <div className="space-y-8">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                           <span className="text-muted-foreground flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Trust Index (Reputation)</span>
                           <span className={cn(isEligible ? "text-emerald-400" : "text-amber-500")}>
                             {trustIndex} / 90 REQUIRED
                           </span>
                        </div>
                        <Progress value={Math.min(100, (trustIndex / 90) * 100)} className="h-1.5 bg-white/5" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                           <span className="text-muted-foreground flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Micro-missions Finalized</span>
                           <span className={cn((me?.tasks_completed || 0) >= 50 ? "text-emerald-400" : "text-amber-500")}>
                             {me?.tasks_completed || 0} / 50 REQUIRED
                           </span>
                        </div>
                        <Progress value={Math.min(100, ((me?.tasks_completed || 0) / 50) * 100)} className="h-1.5 bg-white/5" />
                      </div>
                   </div>
                </div>
             </div>
          </Card>
        </div>

        <div className="space-y-6 px-4 md:px-0">
           <Card className="glass-card border-none rounded-[2.5rem] p-10 bg-gradient-to-b from-card to-background text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />
              
              <div className="w-16 h-16 rounded-3xl bg-secondary/20 flex items-center justify-center mx-auto text-secondary shadow-2xl">
                 <Target className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                 <h3 className="text-2xl font-headline font-bold">Priority Access</h3>
                 <p className="text-xs text-muted-foreground leading-relaxed uppercase font-bold tracking-widest">
                   ENTERPRISE NODE PROGRAM
                 </p>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-left space-y-4">
                 <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase text-white">Reduced Platform Fee (2.5%)</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase text-white">Priority Mission Discovery</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase text-white">Enterprise Node Badge</span>
                 </div>
              </div>

              <Button 
                className="w-full h-16 rounded-2xl bg-secondary neon-glow-secondary font-bold text-xl transition-all hover:scale-105 active:scale-95"
                onClick={handleJoinWaitlist}
                disabled={isJoining}
              >
                {isJoining ? <Loader2 className="w-6 h-6 animate-spin" /> : "Propagate Signal"}
              </Button>
              
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.2em] leading-relaxed">
                Nodes with a Trust Index &gt; 90 will receive priority selection for the first batch of Enterprise roles.
              </p>
           </Card>

           <Card className="glass-card border-none p-8 rounded-[2rem] flex items-center gap-5 group hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                 <Users className="w-6 h-6" />
              </div>
              <div>
                 <h4 className="font-bold text-sm">Squad Directory</h4>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Launch Q4 2023</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
