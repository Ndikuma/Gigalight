
"use client"

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ArrowRight, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle,
  Network,
  Activity,
  Rocket,
  Layers,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function PublicJobsPage() {
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
            <Link href="/signup">Initialize Node</Link>
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-20 space-y-32 animate-in fade-in duration-700">
        <section className="text-center space-y-8">
          <Badge className="bg-secondary/10 text-secondary border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Rocket className="w-3.5 h-3.5 mr-2" /> Protocol Career Roadmap
          </Badge>
          <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-[0.9] max-w-4xl mx-auto">
            The Future of <span className="text-gradient">Professional Yield.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join the GigaLight Protocol and operate your own professional node. We are architecting a decentralized workforce where technical value is exchanged instantly on L2 rails.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <FeatureCard 
            icon={Zap} 
            title="L2 Multi-sig Payroll" 
            desc="Automated settlement protocols release SATs every 10 minutes based on verifiable technical output. No manual invoicing required."
            color="primary"
           />
           <FeatureCard 
            icon={Layers} 
            title="Identity Portability" 
            desc="Your professional standing, Trust Index, and contribution history are owned by your node. Your reputation follows you across the entire network."
            color="secondary"
           />
           <FeatureCard 
            icon={ShieldCheck} 
            title="Sovereign Escrow" 
            desc="Every mission is secured by custodial multi-sig rails. Funds are locked at objective initiation and released upon verified technical delivery."
            color="emerald"
           />
           <FeatureCard 
            icon={Globe} 
            title="Global Compliance" 
            desc="Built on decentralized standards, GigaLight enables borderless technical engagement without the friction of traditional jurisdictional boundaries."
            color="primary"
           />
        </div>

        <section className="space-y-16 border-t border-white/5 pt-20">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">Institutional Adoption.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From micro-missions to enterprise squads, we are building the infrastructure for high-intensity remote operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <LevelCard tier="v2.1" label="Worker Mode" active />
             <LevelCard tier="v2.5" label="Validator Mode" />
             <LevelCard tier="v3.0" label="Enterprise Mode" />
          </div>
        </section>

        <section className="text-center py-20">
           <h2 className="text-4xl font-headline font-bold mb-8">Ready to operate?</h2>
           <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button asChild size="lg" className="rounded-2xl bg-primary text-lg font-bold px-12 h-16 neon-glow-primary">
                <Link href="/signup">Register Identity Node</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/10 px-12 h-16 font-bold">
                <Link href="/market">Browse Objectives</Link>
              </Button>
           </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 text-center bg-card/30">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
          GigaLight Protocol Identity Node • Satoshi Standard v2.1.0
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: any) {
  const colors: any = {
    primary: 'bg-primary/20 text-primary border-primary/20',
    secondary: 'bg-secondary/20 text-secondary border-secondary/20',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
  };
  return (
    <Card className="glass-card border-none p-10 rounded-[3rem] space-y-6 hover:border-white/20 transition-all group">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl", colors[color])}>
        <Icon className="w-7 h-7" />
      </div>
      <div className="space-y-4">
        <h3 className="text-3xl font-headline font-bold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </Card>
  );
}

function LevelCard({ tier, label, active }: any) {
  return (
    <Card className={cn(
      "glass-card border-none p-8 rounded-[2rem] text-center space-y-4 transition-all hover:scale-105",
      active ? "border-primary/20 bg-primary/5" : "opacity-50"
    )}>
       <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest">{tier} PROTOCOL</Badge>
       <h4 className="text-2xl font-headline font-bold">{label}</h4>
       <div className="flex justify-center pt-4">
          <CheckCircle className={cn("w-6 h-6", active ? "text-primary" : "text-muted-foreground/30")} />
       </div>
    </Card>
  );
}
