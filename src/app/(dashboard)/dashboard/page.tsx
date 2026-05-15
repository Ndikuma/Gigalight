
"use client"

import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Wallet, Briefcase, Zap, ShieldCheck, ArrowRight, Star, PlusCircle, LayoutGrid, Rocket, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockTasks, mockProjects, mockWallet } from '@/lib/mock-data';
import Link from 'next/link';

export default function DashboardHome() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-primary/20 via-secondary/20 to-card border border-white/5 p-12">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/20 blur-[100px] rounded-full animate-pulse"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              <Rocket className="w-3 h-3" /> Quick Start
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold leading-tight">
              Ready to grow your <span className="text-gradient">Satoshi stack?</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore micro-tasks that pay instantly or post a high-value project to find elite global talent.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="rounded-2xl bg-primary hover:brightness-110 px-8 neon-glow-primary font-bold h-14">
                <Link href="/market">Find Work</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 px-8 font-bold h-14">
                <Link href="/my-projects">Hire Talent</Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:block p-8 bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-8">
                <span className="text-muted-foreground text-sm">Network Activity</span>
                <span className="text-emerald-400 text-sm font-bold">● High</span>
              </div>
              <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-emerald-400"></div>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Average payout: 120k SAT/hr</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-headline font-bold flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" /> Performance Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Wallet Balance" 
            value={`${mockWallet.availableBalance.toLocaleString()} SAT`} 
            icon={Wallet} 
            subValue="≈ $18.42 USD"
            trend="up"
          />
          <StatCard 
            label="Pending Rewards" 
            value={`${mockWallet.pendingBalance.toLocaleString()} SAT`} 
            icon={Zap} 
            color="secondary"
          />
          <StatCard 
            label="Active Gigs" 
            value={3} 
            icon={Briefcase} 
            subValue="2 Tasks, 1 Project"
            color="primary"
          />
          <StatCard 
            label="Trust Score" 
            value="98.5%" 
            icon={ShieldCheck} 
            color="emerald"
            subValue="Top 5% of Workers"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-lg">Recommended Gigs</CardTitle>
              <Link href="/market" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors text-sm">{task.title}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{task.category} • {task.difficulty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-headline font-bold text-emerald-400">+{task.rewardAmount} SAT</p>
                    <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Instant</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                Network News
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest font-bold">New Policy</p>
                <p className="text-xs font-medium">Validator fees reduced to 3% for Bitcoin L2 projects.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest font-bold">Featured</p>
                <p className="text-xs font-medium italic">"Building the first decentralized gig graph on Stacks."</p>
                <p className="text-[10px] text-primary mt-2 font-bold uppercase tracking-widest">500k SAT REWARD</p>
              </div>
            </CardContent>
          </Card>

          <div className="glass-card p-6 rounded-3xl border-primary/20 text-center space-y-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
            <Sparkles className="w-8 h-8 text-primary mx-auto relative z-10" />
            <div className="relative z-10">
              <h4 className="font-headline font-bold">AI Helper</h4>
              <p className="text-xs text-muted-foreground mt-1">Struggling to describe your project? Use our AI assistant to draft a professional listing in seconds.</p>
            </div>
            <Button asChild variant="outline" className="w-full rounded-xl border-primary/20 hover:bg-primary/5 text-primary font-bold relative z-10">
              <Link href="/my-projects">Try Draft Helper</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
