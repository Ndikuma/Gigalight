"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ShieldCheck, 
  Globe, 
  Database, 
  Cpu, 
  ArrowRight, 
  CheckCircle, 
  Copy, 
  Check, 
  Bitcoin, 
  Heart,
  Network,
  Activity,
  Layers,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

export default function AboutPage() {
  const [hasCopied, setHasCopied] = useState(false);
  const supportAddress = "bc1qgigalightprotocolsupportnode2023xyz"; // Placeholder support address

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(supportAddress);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
    toast({ title: "Signal Copied", description: "Protocol support address captured to clipboard." });
  };

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
          <Link href="/signup" className="hover:text-white transition-colors">Join Protocol</Link>
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
            GigaLight is an Omni-Gig protocol built on Bitcoin Layer-2. We are redefining the professional landscape by enabling instant, borderless, and verified technical value exchange.
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
                By leveraging L2 multi-sig escrow and the Validator Network, we remove the need for centralized oversight. Every mission is protected by technical protocols, not just promises.
              </p>
            </div>
          </Card>

          <Card className="glass-card border-none p-10 rounded-[3rem] space-y-6 hover:border-secondary/20 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <Layers className="w-7 h-7" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-headline font-bold">Hign-Velocity Yield</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our workforce engine decomposes complex projects into rapid installments. Workers receive SAT yields instantly upon verification, ensuring a continuous flow of technical capital.
              </p>
            </div>
          </Card>
        </div>

        {/* Support Section */}
        <section id="support" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
              <Heart className="w-3 h-3" /> Protocol Sustainability
            </div>
            <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">Fuel the <span className="text-emerald-400">Future.</span></h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              GigaLight is a community-driven protocol. Your support helps us maintain the network infrastructure, expand the Validator Network, and onboard the next million Bitcoin-native specialists.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Scaling L2 Infrastructure",
                "Advanced AI Auditing",
                "Educational Node Grants",
                "Global Compliance R&D"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/70">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <Card className="glass-card border-emerald-500/20 rounded-[3rem] p-1 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Bitcoin className="w-40 h-40 text-emerald-500" />
               </div>
               <CardContent className="p-10 space-y-8 bg-black/40 rounded-[2.8rem] relative z-10 text-center">
                  <div className="space-y-2">
                    <h4 className="font-headline font-bold text-2xl">Support Node</h4>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.3em]">Direct L1 Signal Propagation</p>
                  </div>

                  <div className="mx-auto bg-white p-5 rounded-[2.5rem] w-fit shadow-2xl shadow-emerald-500/20 border-8 border-emerald-500/10 transition-transform hover:scale-105">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(supportAddress)}`} 
                      alt="Support QR Signal" 
                      className="w-48 h-48 object-contain" 
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="bg-background/80 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
                       <p className="text-[10px] font-mono text-muted-foreground truncate flex-1">{supportAddress}</p>
                       <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-10 w-10 rounded-xl text-emerald-400 hover:bg-emerald-400/10"
                        onClick={handleCopyAddress}
                       >
                         {hasCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                       </Button>
                    </div>
                    <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">
                      Verified Satoshi Standard Address
                    </p>
                  </div>
               </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats Pulse */}
        <section className="py-20 border-y border-white/5 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
           {[
            { label: "Protocol Uptime", val: "99.99%", icon: Activity },
            { label: "Nodes Enabled", val: "150+", icon: Network },
            { label: "Mission Velocity", val: "Hign", icon: Zap },
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
        </div>
      </footer>
    </div>
  );
}
