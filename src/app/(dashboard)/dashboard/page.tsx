
"use client"

import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Wallet, Briefcase, Zap, ShieldCheck, ArrowRight, PlusCircle, Rocket, Sparkles, UserPlus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTasks, mockWallet } from '@/lib/mock-data';
import Link from 'next/link';

export default function DashboardHome() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-card to-secondary/10 border border-white/5 p-12">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Unified Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-headline font-bold leading-[1.1]">
              Empowering the <span className="text-gradient">Gig Economy.</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Find instant micro-tasks to earn Satoshis, or hire elite talent for your next big project. All in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-2xl bg-primary hover:brightness-110 px-8 neon-glow-primary font-bold h-14">
                <Link href="/market" className="flex items-center gap-2">
                  <Zap className="w-5 h-5" /> Browse Jobs
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 px-8 font-bold h-14">
                <Link href="/my-projects" className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" /> Hire Talent
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="glass-card p-6 rounded-3xl space-y-2 border-primary/20">
              <Zap className="w-8 h-8 text-primary" />
              <h4 className="font-bold">Earn</h4>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">342 New Tasks</p>
            </div>
            <div className="glass-card p-6 rounded-3xl space-y-2 border-secondary/20">
              <Briefcase className="w-8 h-8 text-secondary" />
              <h4 className="font-bold">Hire</h4>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">12 Active Leads</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Wallet Balance" 
            value={`${mockWallet.availableBalance.toLocaleString()} SAT`} 
            icon={Wallet} 
            subValue="≈ $18.42 USD"
            color="primary"
          />
          <StatCard 
            label="Pending Audit" 
            value={`${mockWallet.pendingBalance.toLocaleString()} SAT`} 
            icon={ShieldCheck} 
            color="emerald"
          />
          <StatCard 
            label="Total Earnings" 
            value={`${mockWallet.totalRewarded.toLocaleString()} SAT`} 
            icon={Zap} 
            subValue="Lifetime Achievement"
            color="secondary"
          />
          <StatCard 
            label="Network Status" 
            value="Active" 
            icon={Rocket} 
            subValue="High Throughput"
            color="primary"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-lg">Top Opportunities</CardTitle>
              <Link href="/market" className="text-sm text-primary hover:underline flex items-center gap-1">
                Explore Market <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTasks.slice(0, 3).map((task) => (
                <Link key={task.id} href={`/market/${task.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors text-sm">{task.title}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{task.category} • {task.difficulty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-headline font-bold text-emerald-400">+{task.rewardAmount} SAT</p>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Micro Gig</p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none overflow-hidden bg-emerald-400/5">
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Validator Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-background/40 border border-emerald-400/10">
                <p className="text-[10px] text-emerald-400 mb-1 uppercase tracking-widest font-bold">New Audit Task</p>
                <p className="text-xs font-medium">Verify submission for "Smart Contract Audit".</p>
                <Button asChild variant="ghost" className="w-full mt-3 h-8 text-[10px] uppercase font-bold tracking-widest text-emerald-400 hover:bg-emerald-400/10">
                  <Link href="/audits">Go to Queue</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="glass-card p-6 rounded-3xl border-primary/20 text-center space-y-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
            <UserPlus className="w-8 h-8 text-primary mx-auto relative z-10" />
            <div className="relative z-10">
              <h4 className="font-headline font-bold">Hiring?</h4>
              <p className="text-xs text-muted-foreground mt-1">Need something specific? Post your project and set your own budget in SATs.</p>
            </div>
            <Button asChild className="w-full rounded-xl bg-primary hover:brightness-110 font-bold relative z-10">
              <Link href="/my-projects">Create New Listing</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
