
"use client"

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Globe, 
  Rocket, 
  ShieldCheck, 
  Network,
  Activity,
  Briefcase,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Cpu,
  Target,
  Layers,
  CheckCircle2,
  Calendar,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function PublicJobsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-secondary/10 blur-[140px] rounded-full -z-10 pointer-events-none"></div>

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
          <Link href="/jobs" className="text-primary">Career Nodes</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About Protocol</Link>
          <Button asChild className="rounded-xl bg-primary hover:brightness-110 neon-glow-primary px-8 h-11 font-bold">
            <Link href="/login">Initialize Node</Link>
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-20 space-y-32 animate-in fade-in duration-700">
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <Badge className="bg-secondary/10 text-secondary border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Rocket className="w-3.5 h-3.5 mr-2" /> Enterprise Tier v3.0 Roadmap
          </Badge>
          <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-[0.9] max-w-4xl mx-auto">
            Long-Term <span className="text-gradient">Career Nodes.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            GigaLight is evolving beyond micro-gigs. Soon, elite specialists will secure full-time, sovereign roles within global enterprise squads, settled via automated L2 multi-sig payroll.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
             <Button asChild size="lg" className="rounded-2xl bg-secondary hover:brightness-110 text-lg font-bold px-10 h-16 neon-glow-secondary">
               <Link href="/signup">Join the Waitlist</Link>
             </Button>
             <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/10 px-10 h-16 font-bold">
               <Link href="#specs">View Protocol Specs</Link>
             </Button>
          </div>
        </section>

        {/* Core Pillars */}
        <section id="specs" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "L2 Multi-sig Payroll", 
              desc: "Automatic SAT settlement every 10 minutes based on verifiable technical output and protocol milestones.",
              icon: Zap,
              color: "text-primary bg-primary/10"
            },
            { 
              title: "Identity Portability", 
              desc: "Take your reputation node, verification history, and trust index from one enterprise squad to another.",
              icon: ShieldCheck,
              color: "text-secondary bg-secondary/10"
            },
            { 
              title: "Global Compliance", 
              desc: "Built-in technical tools for tax reporting and regulatory compliance in a borderless, sovereign workforce.",
              icon: Globe,
              color: "text-emerald-400 bg-emerald-400/10"
            }
          ].map((feat, i) => (
            <Card key={i} className="glass-card border-none p-10 space-y-6 hover:border-white/10 transition-all group">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xl", feat.color)}>
                <feat.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-headline font-bold">{feat.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {feat.desc}
              </p>
            </Card>
          ))}
        </section>

        {/* Career Progression Roadmap */}
        <section className="space-y-16 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl font-headline font-bold">Scaling the <span className="text-secondary">Workforce.</span></h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Career Nodes represent the ultimate evolution of the GigaLight protocol. We are moving from single-task execution to sustained professional alignment.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Elite Squad Formation", desc: "Form dedicated technical squads to tackle massive institutional objectives with shared multi-sig yields.", icon: Target },
                  { title: "Protocol-Native Benefits", desc: "Decentralized insurance and specialized node-lending protocols for long-term career node operators.", icon: Layers }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 p-6 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center shrink-0 border border-white/5 text-primary">
                        <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-lg">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full">
              <Card className="glass-card border-none p-1 rounded-[3rem] shadow-2xl relative overflow-hidden bg-gradient-to-br from-secondary/10 to-transparent">
                 <div className="bg-black/40 rounded-[2.8rem] p-12 space-y-8">
                    <div className="text-center space-y-2">
                       <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Launch Timeline</p>
                       <h3 className="text-5xl font-headline font-bold">Q4 2023</h3>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest px-2">
                          <span className="text-muted-foreground">Internal Beta</span>
                          <span className="text-emerald-400">100% COMPLETE</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full w-[85%] bg-secondary shadow-[0_0_15px_rgba(60,98,255,0.5)]"></div>
                       </div>
                       <p className="text-center text-[10px] text-muted-foreground uppercase font-bold tracking-widest pt-2">
                         Phase 2: Reputation Index Hardening
                       </p>
                    </div>

                    <div className="pt-4 space-y-4">
                       <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[10px] font-bold uppercase tracking-widest text-white">Active Requirement</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Nodes must maintain a **Trust Index &gt; 90** and at least 50 finalized micro-missions to qualify for the first batch of Enterprise squad invites.
                          </p>
                       </div>
                       <Button asChild className="w-full h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10">
                          <Link href="/market">Start Building Reputation</Link>
                       </Button>
                    </div>
                 </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits & Perks */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
             <h2 className="text-4xl font-headline font-bold">Protocol Perks.</h2>
             <p className="text-muted-foreground">The advantages of operating an elite Enterprise Node.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Fixed Settlement", desc: "Guaranteed monthly SAT minimums.", icon: Calendar },
              { title: "Elite Badge", desc: "Verified Enterprise Node status.", icon: Star },
              { title: "Priority Support", desc: "Direct rail to protocol admins.", icon: Activity },
              { title: "Lower Fees", desc: "Platform cut reduced to 2.5%.", icon: Zap }
            ].map((perk, i) => (
              <div key={i} className="p-8 glass-card rounded-3xl space-y-4 text-center group hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto text-primary group-hover:scale-110 transition-transform">
                  <perk.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white">{perk.title}</h4>
                <p className="text-xs text-muted-foreground">{perk.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Node */}
        <section className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
             <h2 className="text-4xl font-headline font-bold">Protocol FAQ.</h2>
             <p className="text-muted-foreground">Common queries regarding the Enterprise Career Node transition.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {[
               { q: "Is this limited to technical roles?", a: "Initially, yes. We are focusing on engineering, security, and protocol design squads for the v3.0 launch." },
               { q: "How is payroll handled?", a: "Through automated L2 Lightning settlements, triggered by verifiable technical proof and peer node audits." },
               { q: "Can I remain anonymous?", a: "Yes. GigaLight is an identity-agnostic protocol. Your reputation index is tied to your public key node, not your physical identity." },
               { q: "What is the fee structure?", a: "Enterprise tier nodes enjoy a reduced platform fee of 2.5%, settled directly from the L2 payroll rail." }
             ].map((item, i) => (
               <div key={i} className="space-y-3 p-8 glass-card rounded-[2rem] border-white/5">
                  <h4 className="font-bold text-lg text-secondary">? {item.q}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
               </div>
             ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 text-center bg-card/30">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
          GigaLight Protocol Career Node Specification • Satoshi Standard v2.1.0
        </p>
      </footer>
    </div>
  );
}
