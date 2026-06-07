
"use client"

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Rocket, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle,
  Activity,
  Globe,
  Network
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function CareersPublicHub() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-8 max-w-7xl mx-auto w-full sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center neon-glow-primary">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tight">Giga<span className="text-primary">light</span></span>
        </Link>
        <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Link href="/market" className="hover:text-primary transition-colors">Marketplace</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About Protocol</Link>
          <Button asChild className="rounded-xl bg-primary hover:brightness-110 neon-glow-primary px-8 h-11 font-bold">
            <Link href="/signup">Join Protocol</Link>
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-20 space-y-32">
        <section className="text-center space-y-8 animate-in fade-in duration-700">
           <Badge className="bg-secondary/10 text-secondary border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Rocket className="w-3.5 h-3.5 mr-2" /> Sovereign Career Node v3.0
          </Badge>
          <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-[0.9] max-w-4xl mx-auto">
            The Future of <span className="text-gradient">Professional Yield.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Eliminate traditional corporate gatekeepers. GigaLight Enterprise Squads enable long-term, high-intensity professional objectives settled with L2 multi-sig payroll automation.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="glass-card border-none p-10 rounded-[3rem] space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                <Network className="w-32 h-32 text-primary" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-xl">
                 <Globe className="w-7 h-7" />
              </div>
              <div className="space-y-4">
                 <h3 className="text-3xl font-headline font-bold">Identity Portability</h3>
                 <p className="text-muted-foreground leading-relaxed">
                   Your professional standing and Trust Index are owned by your node identity. Move between enterprise squads without losing your reputation or technical history.
                 </p>
              </div>
              <ul className="space-y-3">
                 {["Self-sovereign Reputation", "Global Identity Node", "POW Verified History"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary/80">
                       <CheckCircle className="w-4 h-4 text-primary" /> {item}
                    </li>
                 ))}
              </ul>
           </Card>

           <Card className="glass-card border-none p-10 rounded-[3rem] space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                <Zap className="w-32 h-32 text-secondary" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary shadow-xl">
                 <Activity className="w-7 h-7" />
              </div>
              <div className="space-y-4">
                 <h3 className="text-3xl font-headline font-bold">Multi-sig Payroll</h3>
                 <p className="text-muted-foreground leading-relaxed">
                   Automated L2 settlement protocols release SATs based on verifiable technical output. No more monthly billing cycles—get paid as you contribute.
                 </p>
              </div>
              <ul className="space-y-3">
                 {["10-Minute Settlement Rails", "Non-custodial Escrow", "Zero Counterparty Risk"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-secondary/80">
                       <CheckCircle className="w-4 h-4 text-secondary" /> {item}
                    </li>
                 ))}
              </ul>
           </Card>
        </div>

        <section className="text-center py-20 border-t border-white/5">
           <h2 className="text-4xl font-headline font-bold mb-8">Ready to Scale your Standing?</h2>
           <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button asChild size="lg" className="rounded-2xl bg-primary text-lg font-bold px-12 h-16 neon-glow-primary shadow-2xl shadow-primary/20">
                <Link href="/signup">Join the Enterprise Waitlist</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/10 px-12 h-16 font-bold">
                <Link href="/market">Browse Active Missions</Link>
              </Button>
           </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 text-center bg-card/30">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
          GigaLight Protocol Careers • Satoshi Standard v2.1.0
        </p>
      </footer>
    </div>
  );
}
