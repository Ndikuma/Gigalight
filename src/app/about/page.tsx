
"use client"

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  Network,
  Activity,
  Layers,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[140px] rounded-full -z-10 pointer-events-none"></div>

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
          <Link href="/jobs" className="hover:text-primary transition-colors">Roadmap</Link>
          <Button asChild className="rounded-xl bg-primary hover:brightness-110 neon-glow-primary px-8 h-11 font-bold">
            <Link href="/login">Initialize Node</Link>
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-20 space-y-24 animate-in fade-in duration-700">
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Activity className="w-3 h-3 mr-2" /> Protocol Mission v2.1
          </Badge>
          <h1 className="text-5xl md:text-8xl font-headline font-bold tracking-tighter leading-[0.9] max-w-4xl mx-auto">
            Architecting the <span className="text-gradient">Satoshi Workforce.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            GigaLight is a high-velocity workforce protocol built on Bitcoin Layer-2. We are redefining professional engagement by enabling instant, borderless, and verified technical value exchange.
          </p>
        </section>

        {/* Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="glass-card border-none p-10 rounded-[3rem] space-y-6 hover:border-primary/20 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Network className="w-7 h-7" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-headline font-bold">Decentralized Trust</h3>
              <p className="text-muted-foreground leading-relaxed">
                By leveraging L2 multi-sig escrow and our global Validator Network, we eliminate the need for centralized intermediaries. Every technical mission is secured by code, not just promises.
              </p>
            </div>
          </Card>

          <Card className="glass-card border-none p-10 rounded-[3rem] space-y-6 hover:border-secondary/20 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <Layers className="w-7 h-7" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-headline font-bold">High-Velocity Yield</h3>
              <p className="text-muted-foreground leading-relaxed">
                Complex objectives are decomposed into rapid, billable installments. Node operators receive SAT yields instantly upon verified technical delivery, ensuring constant liquidity flow.
              </p>
            </div>
          </Card>
        </div>

        {/* Roadmap Section */}
        <section id="roadmap" className="space-y-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" /> Protocol Evolution
            </div>
            <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">The Technical <span className="text-emerald-400">Roadmap.</span></h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are scaling from a micro-gig engine into a full-scale sovereign workforce protocol for the Bitcoin era.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               {
                 title: "v2.1 Workforce",
                 status: "Active",
                 desc: "Micro-gigs, strategic projects, and manual L2 validator audits for technical proof.",
                 icon: Zap,
                 color: "primary"
               },
               {
                 title: "v2.5 Automation",
                 status: "Q4 2023",
                 desc: "AI-integrated validator assistants and automated multi-sig release cycles for high-volume nodes.",
                 icon: Cpu,
                 color: "secondary"
               },
               {
                 title: "v3.0 Sovereign",
                 status: "2024",
                 desc: "Enterprise career nodes, decentralized payroll integration, and protocol-level governance.",
                 icon: Globe,
                 color: "emerald"
               }
             ].map((milestone, i) => (
               <Card key={i} className="glass-card border-none p-8 rounded-[2rem] space-y-6 relative overflow-hidden">
                  <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl -z-10", milestone.color === 'primary' ? 'bg-primary/20' : milestone.color === 'secondary' ? 'bg-secondary/20' : 'bg-emerald-500/20')} />
                  <div className="flex justify-between items-start">
                     <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", milestone.color === 'primary' ? 'bg-primary/10 border-primary/20 text-primary' : milestone.color === 'secondary' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400')}>
                        <milestone.icon className="w-6 h-6" />
                     </div>
                     <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest">{milestone.status}</Badge>
                  </div>
                  <div className="space-y-2">
                     <h4 className="font-headline font-bold text-xl">{milestone.title}</h4>
                     <p className="text-xs text-muted-foreground leading-relaxed">{milestone.desc}</p>
                  </div>
               </Card>
             ))}
          </div>
        </section>

        {/* Stats Pulse */}
        <section className="py-20 border-y border-white/5 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
           {[
            { label: "Protocol Uptime", val: "99.99%", icon: Activity },
            { label: "Nodes Enabled", val: "150+", icon: Network },
            { label: "Mission Velocity", val: "High", icon: Zap },
            { label: "Trust Index", val: "Verified", icon: ShieldCheck },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <stat.icon className="w-5 h-5 text-primary mx-auto opacity-50" />
              <p className="text-3xl font-headline font-bold">{stat.val}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 text-center space-y-6">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
          GigaLight Protocol Identity Node • Satoshi Standard v2.1.0
        </p>
        <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-white/40">
           <Link href="/" className="hover:text-white transition-colors">Home Hub</Link>
           <Link href="/market" className="hover:text-white transition-colors">Discovery</Link>
           <Link href="/jobs" className="hover:text-white transition-colors">Careers</Link>
        </div>
      </footer>
    </div>
  );
}
