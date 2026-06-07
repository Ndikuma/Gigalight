
"use client"

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Rocket, 
  Network, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  ArrowRight,
  Target,
  Database,
  Globe,
  CheckCircle2,
  Lock,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-secondary/10 blur-[140px] rounded-full -z-10 pointer-events-none"></div>

      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-8 max-w-7xl mx-auto w-full sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center neon-glow-primary transition-transform group-hover:scale-110">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tight hidden sm:block">Giga<span className="text-primary">light</span></span>
        </Link>
        <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Link href="/market" className="hover:text-primary transition-colors">Marketplace</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About Protocol</Link>
          <Button asChild className="rounded-xl bg-secondary hover:brightness-110 neon-glow-secondary px-8 h-11 font-bold">
            <Link href="/signup">Join Workforce</Link>
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-20 space-y-32 animate-in fade-in duration-700">
        <section className="text-center space-y-8">
          <Badge className="bg-secondary/10 text-secondary border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Rocket className="w-3.5 h-3.5 mr-2" /> Protocol Career Nodes v3.0
          </Badge>
          <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-[0.9] max-w-4xl mx-auto">
            The Sovereign <span className="text-gradient">Workforce.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We are moving beyond micro-gigs. GigaLight v3.0 introduces high-intensity Career Nodes—long-term professional engagements settled with automated L2 multi-sig payroll.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="glass-card border-none p-10 rounded-[3rem] space-y-6 group">
            <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform shadow-xl">
              <Network className="w-7 h-7" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-headline font-bold">Automated Payroll</h3>
              <p className="text-muted-foreground leading-relaxed">
                Direct integration with Bitcoin L2 settlement rails ensures that your professional yields are paid out every 10 minutes based on verifiable output. No invoices, no delays.
              </p>
            </div>
          </Card>

          <Card className="glass-card border-none p-10 rounded-[3rem] space-y-6 group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-xl">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-headline font-bold">Identity Portability</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your professional standing, Trust Index, and technical achievements are tied to your decentralized node. Your reputation is your property, portable across the entire Satoshi network.
              </p>
            </div>
          </Card>
        </div>

        <section className="space-y-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-headline font-bold">Workforce Scaling.</h2>
            <p className="text-lg text-muted-foreground">The evolution of specialized node engagement.</p>
          </div>

          <div className="space-y-4">
             {[
               { stage: "Stage 1", title: "Micro-Gigs (Active)", desc: "Build reputation through high-volume, rapid-cycle technical audits.", icon: Zap },
               { stage: "Stage 2", title: "Strategic Projects", desc: "Collaborate on milestone-based objectives with multi-sig escrow protection.", icon: Target },
               { stage: "Stage 3", title: "Enterprise Squads", desc: "Institutional-grade career nodes with full payroll automation.", icon: Rocket }
             ].map((node, i) => (
               <div key={i} className="flex flex-col md:flex-row items-center gap-8 p-8 glass-card rounded-3xl border border-white/5 hover:border-secondary/30 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-black/40 flex items-center justify-center shrink-0 border border-white/5">
                    <node.icon className="w-8 h-8 text-secondary" />
                  </div>
                  <div className="flex-1 space-y-1 text-center md:text-left">
                     <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">{node.stage}</p>
                     <h4 className="text-2xl font-headline font-bold">{node.title}</h4>
                     <p className="text-muted-foreground text-sm">{node.desc}</p>
                  </div>
                  <div className="shrink-0">
                    <Button variant="outline" className="rounded-xl border-white/10 font-bold h-11">Learn More</Button>
                  </div>
               </div>
             ))}
          </div>
        </section>

        <section className="text-center py-20 bg-secondary/5 rounded-[4rem] border border-secondary/10 p-12">
           <h2 className="text-4xl font-headline font-bold mb-6">Built for Elite Specialists</h2>
           <p className="text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-lg">
             The v3.0 Career Node protocol is currently in priority rollout for nodes with a Trust Index &gt; 90. Initialize your standing on the network today.
           </p>
           <Button asChild size="lg" className="rounded-2xl bg-secondary neon-glow-secondary font-bold px-12 h-16 text-lg">
             <Link href="/signup">Initialize Professional Node</Link>
           </Button>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 text-center bg-card/30">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
          GigaLight Protocol Careers • Satoshi Standard v3.0.0-Beta
        </p>
      </footer>
    </div>
  );
}
