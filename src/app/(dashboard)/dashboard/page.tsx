
"use client"

import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Wallet, Briefcase, Zap, ShieldCheck, ArrowRight, Star, PlusCircle, LayoutGrid } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockTasks, mockProjects, mockWallet } from '@/lib/mock-data';
import Link from 'next/link';

export default function DashboardHome() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Quick Actions / Start Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-colors"></div>
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Find Work</h2>
              <p className="text-muted-foreground mb-6 max-w-xs">Browse micro-gigs and start earning SATs instantly with AI-verified proofs.</p>
              <Button asChild size="lg" className="rounded-xl bg-primary hover:brightness-110 px-8 neon-glow-primary font-bold">
                <Link href="/market">Discover Gigs</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-secondary/30 via-secondary/5 to-transparent border border-secondary/20 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary/20 blur-3xl rounded-full group-hover:bg-secondary/30 transition-colors"></div>
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center shadow-2xl shadow-secondary/40">
              <PlusCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Post a Job</h2>
              <p className="text-muted-foreground mb-6 max-w-xs">Leverage global talent for your projects. Set milestones and pay only for results.</p>
              <Button asChild size="lg" className="rounded-xl bg-secondary hover:brightness-110 px-8 neon-glow-secondary font-bold">
                <Link href="/my-projects">Create Listing</Link>
              </Button>
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
        </div>
      </div>
    </div>
  );
}
