
"use client"

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Briefcase, 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  Rocket, 
  Lock, 
  CheckCircle, 
  Sparkles,
  Layers,
  Activity,
  Cpu,
  Network
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function PublicCareersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Navigation */}
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
          <Button asChild className="rounded-xl bg-primary hover:brightness-110 neon-glow-primary px-8 h-11 font-bold">
            <Link href="/signup">Join Protocol</Link>
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-20 space-y-24 animate-in fade-in duration-700">
        <header className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest border border-secondary/20">
            <Sparkles className="w-3 h-3" /> Upcoming: Enterprise Tier v3.0
          </div>
          <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-[0.85]">
            Long-Term <span className="text-gradient">Career Nodes.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            GigaLight is redefining the career lifecycle. Soon, we'll bridge the gap between micro-tasks and full-time professional roles with global entities, settled via borderless L2 multi-sig payroll.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "L2 Payroll", 
              desc: "Automatic SAT settlement every 10 minutes based on verifiable technical output signals.",
              icon: Zap,
              color: "primary"
            },
            { 
              title: "Identity Portability", 
              desc: "Take your professional reputation node from one project to another without gatekeepers.",
              icon: ShieldCheck,
              color: "secondary"
            },
            { 
              title: "Global Compliance", 
              desc: "Built-in tax and regulatory technical tools for a truly borderless workforce protocol.",
              icon: Globe,
              color: "emerald"
            }
          ].map((feat, i) => (
            <Card key={i} className="glass-card border-none p-10 rounded-[3rem] space-y-6 hover:border-white/20 transition-all group">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform", feat.color === 'primary' ? 'bg-primary/20 text-primary' : feat.color === 'secondary' ? 'bg-secondary/20 text-secondary' : 'bg-emerald-500/20 text-emerald-400')}>
                <feat.icon className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-headline font-bold">{feat.title}</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        <section className="relative overflow-hidden rounded-[4rem] border border-white/5 bg-card/30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] -z-10 rounded-full" />
          <div className="flex flex-col lg:flex-row">
            <div className="p-16 space-y-8 flex-1">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">Priority Access Program</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nodes with a Trust Index (Reputation Score) > 90 will receive priority selection for the first batch of Enterprise roles. Build your reputation through high-fidelity micro-missions today.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Multi-sig Payroll Native",
                  "Verified-as-a-Service",
                  "Enterprise Node Dashboard",
                  "Sovereign Benefit Pools"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-bold text-primary">
                    <CheckCircle className="w-5 h-5" /> {item}
                  </div>
                ))}
              </div>
              <div className="pt-8">
                <Button asChild className="rounded-2xl h-16 px-10 font-bold bg-primary neon-glow-primary gap-3 text-lg">
                  <Link href="/signup">Initialize Node Identity <ArrowRight className="w-5 h-5" /></Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/3 bg-white/5 border-l border-white/5 p-16 flex flex-col justify-center items-center text-center space-y-8">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse shadow-2xl shadow-primary/20">
                <Network className="w-12 h-12" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Expected Deployment</p>
                <p className="text-3xl font-headline font-bold text-white">Q4 2023</p>
              </div>
              <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-1">
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Protocol Signal</p>
                 <p className="text-xs font-bold text-emerald-400 flex items-center gap-2 justify-center"><Activity className="w-3.5 h-3.5" /> Stable Build</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 text-center bg-card/30">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
          GigaLight Institutional Roadmap • Satoshi Standard v2.1.0
        </p>
      </footer>
    </div>
  );
}
