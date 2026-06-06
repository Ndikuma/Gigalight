"use client"

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Shield, 
  Briefcase, 
  ArrowRight, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Users, 
  Database,
  Lock,
  CheckCircle,
  Sparkles,
  Search,
  Network,
  Activity,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Navigation */}
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-8 max-w-7xl mx-auto w-full sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center neon-glow-primary">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tight">Giga<span className="text-primary">light</span></span>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Link href="/market" className="hover:text-primary transition-colors">Marketplace</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link href="/about#support" className="hover:text-primary transition-colors">Support</Link>
          <div className="h-4 w-px bg-white/10"></div>
          <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          <Button asChild className="rounded-xl bg-primary hover:brightness-110 neon-glow-primary px-8 h-11 font-bold">
            <Link href="/signup">Initialize Node</Link>
          </Button>
        </div>
        <div className="lg:hidden">
           <Link href="/dashboard"><Button variant="ghost" size="icon"><Zap className="w-6 h-6 text-primary" /></Button></Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-8 max-w-7xl mx-auto text-center space-y-12 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[140px] rounded-full -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[140px] rounded-full -z-10"></div>
        
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Activity className="w-3.5 h-3.5" /> Omni-Gig Protocol v2.1 • Live on L2 Satoshi Network
        </div>
        
        <h1 className="text-6xl md:text-9xl font-headline font-bold tracking-tighter max-w-5xl mx-auto leading-[0.85] animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Accelerate your <span className="text-gradient">Workforce Yield.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          The global electronic job protocol for elite specialists. Deploy strategic projects, execute micro-missions, and settle instantly in Satoshis via borderless L2 rails.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
          <Button asChild size="lg" className="rounded-2xl bg-primary text-xl font-bold px-12 h-20 neon-glow-primary group shadow-2xl shadow-primary/20">
            <Link href="/dashboard" className="flex items-center gap-3">
              Deploy Mission <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/10 bg-white/5 text-xl font-bold px-12 h-20 hover:bg-white/10 transition-all border-2">
            <Link href="/market">Market Discovery</Link>
          </Button>
        </div>

        {/* Network Pulse */}
        <div className="pt-24 grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto opacity-70">
          {[
            { label: "Active Nodes", val: "12,450+", icon: Network },
            { label: "Missions Verified", val: "1.2M", icon: ShieldCheck },
            { label: "Settlement Volume", val: "148 BTC", icon: Database },
            { label: "Avg. Cycle Time", val: "12 Mins", icon: Clock },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <stat.icon className="w-6 h-6 text-primary/50" />
              <div className="text-center">
                <p className="text-2xl font-headline font-bold">{stat.val}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dual Engine Marketplace */}
      <section id="missions" className="py-32 px-8 max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-headline font-bold">The E-Job Engine</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">GigaLight powers three distinct mission classes to maximize node utilization and professional yield potential.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Micro Gigs */}
          <div className="glass-card p-10 rounded-[3rem] space-y-8 hover:border-primary/40 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
              <Zap className="w-32 h-32 text-primary" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-xl">
              <Zap className="w-7 h-7" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-headline font-bold">Micro Missions</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                High-volume, technical electronic tasks for rapid scaling. Audit documentation or verify code in minutes.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                "Instant L2 SAT release",
                "AI Submission Audit",
                "Low barrier to entry",
                "Reputation-building path"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary/80">
                  <CheckCircle className="w-4 h-4 text-primary" /> {item}
                </li>
              ))}
            </ul>
            <Button asChild className="w-full h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all font-bold text-sm">
               <Link href="/market?tab=tasks">Discover Gigs</Link>
            </Button>
          </div>

          {/* Strategic Projects */}
          <div className="glass-card p-10 rounded-[3rem] space-y-8 hover:border-secondary/40 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
              <Briefcase className="w-32 h-32 text-secondary" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary shadow-xl">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-headline font-bold">Strategic Projects</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Long-term, milestone-based objectives for elite specialists. Architect L2 infrastructure and design protocols.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                "Multi-sig Escrow Security",
                "Milestone-based Settlement",
                "Direct Client Link",
                "High-intensity SAT yields"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-secondary/80">
                  <CheckCircle className="w-4 h-4 text-secondary" /> {item}
                </li>
              ))}
            </ul>
            <Button asChild className="w-full h-14 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary hover:bg-secondary hover:text-white transition-all font-bold text-sm">
               <Link href="/market?tab=projects">Discover Projects</Link>
            </Button>
          </div>

          {/* Expert Services */}
          <div className="glass-card p-10 rounded-[3rem] space-y-8 hover:border-emerald-500/40 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
              <Wrench className="w-32 h-32 text-emerald-400" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xl">
              <Wrench className="w-7 h-7" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-headline font-bold">Expert Services</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Propagate your specialized capability directly. Let clients commission your node for dedicated expertise.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                "Verified expertise signal",
                "Direct commission node",
                "Global technical visibility",
                "Trust-indexed reputation"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-emerald-400/80">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> {item}
                </li>
              ))}
            </ul>
            <Button asChild className="w-full h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all font-bold text-sm">
               <Link href="/market?tab=services">Discover Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Validator Network */}
      <section id="validator" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-right"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10 flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-8">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
              <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Network Integrity
            </Badge>
            <h2 className="text-5xl md:text-7xl font-headline font-bold tracking-tight">The Validator Network.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Maintain the protocol's high-security standards. Active nodes can stake 30,000 SAT to activate **Validator Mode**, gaining access to the Audit Queue for all platform submissions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="font-bold">Referral Yield</h4>
                <p className="text-sm text-muted-foreground">Receive a 10% yield on all validation fees for verified electronic job completions.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <h4 className="font-bold">AI Assistance</h4>
                <p className="text-sm text-muted-foreground">Leverage the AI Submission Auditor to accelerate your technical proof verification process.</p>
              </div>
            </div>
            <Button asChild className="rounded-2xl h-16 px-10 font-bold bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 text-lg">
              <Link href="/dashboard">Become a Validator</Link>
            </Button>
          </div>
          <div className="lg:w-1/2">
             <Card className="glass-card border-none rounded-[3rem] p-1 shadow-2xl rotate-2">
                <CardContent className="p-10 space-y-6 bg-black/40 rounded-[2.8rem]">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                           <ShieldCheck className="w-6 h-6" />
                         </div>
                         <h4 className="font-headline font-bold text-xl">Validator Queue</h4>
                      </div>
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">LIVE SYNC</Badge>
                   </div>
                   {[1, 2, 3].map((i) => (
                     <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-lg bg-white/5"></div>
                           <div className="space-y-1">
                              <div className="w-32 h-3 bg-white/10 rounded"></div>
                              <div className="w-20 h-2 bg-white/5 rounded"></div>
                           </div>
                        </div>
                        <div className="w-16 h-8 bg-emerald-500/20 rounded-lg"></div>
                     </div>
                   ))}
                </CardContent>
             </Card>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section id="infrastructure" className="py-32 px-8 max-w-7xl mx-auto text-center space-y-20">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-headline font-bold">Institutional Rails.</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Powered by custodial Bitcoin settlement infrastructure for global E-Job scaling.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <Card className="glass-card border-none p-10 space-y-6 hover:translate-y-[-8px] transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto text-primary shadow-lg">
                <Zap className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">L2 Lightning</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Instant SAT propagation. Milestone releases and gig yields are settled across the network in milliseconds.</p>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary">INSTANT</Badge>
           </Card>

           <Card className="glass-card border-none p-10 space-y-6 hover:translate-y-[-8px] transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto text-secondary shadow-lg">
                <Database className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">L1 Bitcoin</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Final on-chain settlement. Securely fund your professional node via layer-1 Bitcoin with verified propagation.</p>
              </div>
              <Badge variant="outline" className="border-secondary/30 text-secondary">SECURE</Badge>
           </Card>

           <Card className="glass-card border-none p-10 space-y-6 hover:translate-y-[-8px] transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Protocol Escrow</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Custodial multi-sig rails manage all objective funding, ensuring total safety for both clients and nodes.</p>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">VERIFIED</Badge>
           </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 pt-20 pb-10 bg-card/30">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center neon-glow-primary">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-headline font-bold text-xl tracking-tight">Giga<span className="text-primary">light</span></span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              The professional Omni-Gig protocol for the decentralized E-Job workforce. Secure your node, execute missions, and scale your technical standing on the Satoshi network.
            </p>
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"><Globe className="w-4 h-4 text-muted-foreground" /></div>
               <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"><Network className="w-4 h-4 text-muted-foreground" /></div>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary">Market Discovery</h5>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><Link href="/market?tab=tasks" className="hover:text-primary transition-colors">Micro Gigs</Link></li>
              <li><Link href="/market?tab=projects" className="hover:text-primary transition-colors">Strategic Projects</Link></li>
              <li><Link href="/market?tab=services" className="hover:text-primary transition-colors">Expert Services</Link></li>
              <li><Link href="/jobs" className="hover:text-primary transition-colors">Career Nodes</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Node Operations</h5>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><Link href="/dashboard" className="hover:text-secondary transition-colors">Dashboard Hub</Link></li>
              <li><Link href="/about" className="hover:text-secondary transition-colors">About Protocol</Link></li>
              <li><Link href="/wallet" className="hover:text-secondary transition-colors">Financial Control</Link></li>
              <li><Link href="/settings" className="hover:text-secondary transition-colors">Identity Config</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Protocol Support</h5>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><Link href="/about#support" className="hover:text-emerald-400 transition-colors">Support Node</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Audit Guidelines</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Network Status</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Compliance Hub</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-white/5">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            © 2023 GigaLight Protocol • Satoshi Standard v2.1.0
          </p>
          <div className="flex gap-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
             <Link href="#" className="hover:text-white transition-colors">Privacy Node</Link>
             <Link href="#" className="hover:text-white transition-colors">Legal Framework</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
