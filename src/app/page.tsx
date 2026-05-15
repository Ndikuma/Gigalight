
import React from 'react';
import Link from 'next/link';
import { Zap, Shield, Briefcase, ArrowRight, Globe, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Navigation */}
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center neon-glow-primary">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tight">Giga<span className="text-primary">light</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
          <Link href="/market" className="hover:text-primary transition-colors">Marketplace</Link>
          <Button asChild className="rounded-full bg-primary hover:brightness-110 neon-glow-primary px-6">
            <Link href="/dashboard">Launch App</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-8 max-w-7xl mx-auto text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-primary animate-in fade-in slide-in-from-bottom-2 duration-700">
          <Zap className="w-3.5 h-3.5" /> Powered by Satoshi & Bitcoin L2
        </div>
        
        <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter max-w-4xl mx-auto leading-[0.9]">
          The Future of Work is <span className="text-gradient">Instant.</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Gigalight connects global talent with micro-tasks and high-value projects, settled instantly in Satoshis. No borders. No delays.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild size="lg" className="rounded-2xl bg-primary text-lg font-bold px-10 h-16 neon-glow-primary group">
            <Link href="/dashboard" className="flex items-center gap-2">
              Start Earning <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/10 bg-white/5 text-lg font-bold px-10 h-16 hover:bg-white/10 transition-all">
            <Link href="/market">Browse Market</Link>
          </Button>
        </div>

        <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="flex flex-col items-center gap-2">
            <Globe className="w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-widest">Global Reach</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Shield className="w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-widest">Smart Escrow</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Briefcase className="w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-widest">Verified Tasks</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Cpu className="w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-widest">L2 Settlement</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-10 rounded-3xl space-y-4 hover:border-primary/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-headline font-bold">Micro Gigs</h3>
            <p className="text-muted-foreground">Complete simple tasks in minutes. Get paid in Satoshis immediately upon verification.</p>
          </div>
          <div className="glass-card p-10 rounded-3xl space-y-4 hover:border-secondary/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-headline font-bold">Pro Projects</h3>
            <p className="text-muted-foreground">High-value freelance opportunities for developers, designers, and specialists.</p>
          </div>
          <div className="glass-card p-10 rounded-3xl space-y-4 hover:border-emerald-400/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 flex items-center justify-center text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-headline font-bold">AI Audits</h3>
            <p className="text-muted-foreground">Our AI Submission Auditor ensures work meets requirements before funds are released.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
