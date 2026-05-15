import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Wallet, Briefcase, Zap, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockTasks, mockProjects, mockWallet } from '@/lib/mock-data';
import Link from 'next/link';

export default function DashboardHome() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-headline font-bold">Welcome back, Alex!</h2>
          <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary">
            Satoshi Pioneer Tier
          </Badge>
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
              <CardTitle className="font-headline">Recommended for You</CardTitle>
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
                      <h4 className="font-semibold group-hover:text-primary transition-colors">{task.title}</h4>
                      <p className="text-xs text-muted-foreground">{task.category} • {task.difficulty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-headline font-bold text-emerald-400">+{task.rewardAmount} SAT</p>
                    <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Immediate Reward</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="font-headline">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 pb-4 border-b border-white/5 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shadow-[0_0_8px_hsl(var(--primary))]"></div>
                    <div>
                      <p className="text-sm">Completed task <span className="font-semibold text-foreground">Translate UX strings</span></p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                Pro Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-bold">New Policy</p>
                <p className="text-sm font-medium">Validator fees reduced to 3% for Bitcoin L2 projects.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-bold">Featured Project</p>
                <p className="text-sm font-medium italic">"Building the first decentralized gig graph on Stacks."</p>
                <p className="text-xs text-primary mt-2">Earn up to 500k SAT</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none bg-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Top Up Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Add Satoshis to post tasks or projects. Instant settlement via Lightning.</p>
              <Link href="/wallet" className="inline-flex items-center justify-center w-full bg-primary py-3 rounded-xl font-bold hover:brightness-110 transition-all neon-glow-primary">
                Add Funds
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}