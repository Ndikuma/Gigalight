
"use client"

import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { 
  Wallet, 
  Briefcase, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  PlusCircle, 
  Rocket, 
  Sparkles, 
  Trophy,
  Activity,
  UserCheck,
  Globe,
  Lock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTasks, mockWallet, mockProfile } from '@/lib/mock-data';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export default function DashboardHome() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Profile Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 glass-card border-none bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                <img src={mockProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5 border-4 border-card">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-headline font-bold">{mockProfile.fullName}</h2>
              <p className="text-muted-foreground text-sm max-w-xl">{mockProfile.bio}</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 text-xs font-bold">
                <Trophy className="w-3.5 h-3.5 text-primary" /> Reputation: {mockProfile.reputation}/100
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 text-xs font-bold">
                <Activity className="w-3.5 h-3.5 text-secondary" /> {mockProfile.stats.tasksCompleted} Objectives Finalized
              </div>
            </div>
          </div>
          <div className="hidden xl:block w-48 space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span>Expertise Progression</span>
              <span className="text-primary">75%</span>
            </div>
            <Progress value={75} className="h-2 bg-white/5" />
          </div>
        </Card>
        
        <Card className="glass-card border-none flex flex-col justify-center items-center text-center p-6 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2">
            <Lock className="w-3 h-3 text-muted-foreground/30" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="font-headline font-bold">Initiate Objective</h4>
          <p className="text-xs text-muted-foreground">Secure professional talent for your next project.</p>
          <Button asChild size="sm" className="w-full rounded-xl bg-primary neon-glow-primary">
            <Link href="/my-projects/create">Deploy Now</Link>
          </Button>
        </Card>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Available Liquidity" 
          value={`${mockWallet.available_balance.toLocaleString()} SAT`} 
          icon={Wallet} 
          subValue="≈ $18.42 USD"
          color="primary"
        />
        <StatCard 
          label="Pending Verification" 
          value={`${mockWallet.pending_balance.toLocaleString()} SAT`} 
          icon={ShieldCheck} 
          color="emerald"
        />
        <StatCard 
          label="Lifetime Revenue" 
          value={`${mockWallet.total_rewarded.toLocaleString()} SAT`} 
          icon={Zap} 
          subValue="Platform Yield"
          color="secondary"
        />
        <StatCard 
          label="Network Trust Index" 
          value={`${mockProfile.reputation}%`} 
          icon={Trophy} 
          subValue="Validated Standing"
          color="primary"
        />
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-lg">Curated Opportunities</CardTitle>
              <Link href="/market" className="text-xs text-primary hover:underline flex items-center gap-1 font-bold">
                VIEW MARKETPLACE <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTasks.map((task) => (
                <Link key={task.id} href={`/market/${task.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group mb-2">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors text-sm">{task.title}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{task.category.name} • {task.difficulty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-headline font-bold text-emerald-400">+{task.reward_amount.toLocaleString()} SAT</p>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Multi-sig Ready</p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none overflow-hidden border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-secondary" />
                Network Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 relative group">
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h5 className="text-xs font-bold uppercase tracking-widest text-secondary">Upcoming: Career Nodes</h5>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  We are integrating long-term career opportunities with borderless L2 payroll systems.
                </p>
                <Button asChild variant="ghost" className="w-full text-[10px] h-7 font-bold text-primary gap-1">
                  <Link href="/jobs">LEARN MORE <ArrowRight className="w-3 h-3" /></Link>
                </Button>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-muted-foreground">Active Nodes</span>
                  <span className="text-emerald-400">12,450</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-muted-foreground">Total Settlement</span>
                  <span className="text-primary">124.5 BTC</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="glass-card p-6 rounded-3xl border-primary/20 text-center space-y-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
            <Rocket className="w-8 h-8 text-primary mx-auto relative z-10" />
            <div className="relative z-10">
              <h4 className="font-headline font-bold">Node Expansion</h4>
              <p className="text-xs text-muted-foreground mt-1">Receive 10% yield on referral validation fees for the first quarter.</p>
            </div>
            <Button variant="ghost" className="w-full rounded-xl border border-white/10 font-bold relative z-10 h-10 text-xs">
              Copy Invitation Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
