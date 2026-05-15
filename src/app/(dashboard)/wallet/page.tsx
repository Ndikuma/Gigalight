import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { mockWallet } from '@/lib/mock-data';
import { Wallet, ArrowDownLeft, ArrowUpRight, History, CreditCard, Landmark, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function WalletPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold">Wallet</h1>
          <p className="text-muted-foreground">Manage your earnings and deposit SATs for payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl bg-card border-white/5 gap-2 px-6">
            <ArrowUpRight className="w-4 h-4" /> Withdraw
          </Button>
          <Button className="rounded-xl bg-primary hover:brightness-110 gap-2 px-6 neon-glow-primary">
            <ArrowDownLeft className="w-4 h-4" /> Deposit
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard 
              label="Available Balance" 
              value={`${mockWallet.availableBalance.toLocaleString()} SAT`} 
              icon={Wallet} 
              subValue="Ready for immediate withdrawal"
              color="primary"
            />
            <StatCard 
              label="Total Earned" 
              value={`${mockWallet.totalRewarded.toLocaleString()} SAT`} 
              icon={History} 
              subValue="Cumulative career earnings"
              color="emerald"
            />
          </div>

          <Card className="glass-card border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Recent Transactions</CardTitle>
              <Button variant="ghost" className="text-xs text-primary">View Full Ledger</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {[
                  { type: 'income', label: 'Gig Reward: Translation', amount: 1200, date: 'Today, 2:30 PM', status: 'completed' },
                  { type: 'expense', label: 'Withdrawal to Blink', amount: 15000, date: 'Yesterday, 11:15 AM', status: 'completed' },
                  { type: 'income', label: 'Referral Bonus: user_abc', amount: 50, date: 'Oct 24, 2023', status: 'completed' },
                  { type: 'pending', label: 'Project Milestone 1: SaaS Build', amount: 25000, date: 'Processing', status: 'pending' },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        tx.type === 'income' ? "bg-emerald-400/10 text-emerald-400" : 
                        tx.type === 'expense' ? "bg-primary/10 text-primary" : "bg-yellow-400/10 text-yellow-400"
                      )}>
                        {tx.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : 
                         tx.type === 'expense' ? <ArrowUpRight className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{tx.label}</p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-headline font-bold",
                        tx.type === 'income' ? "text-emerald-400" : "text-foreground"
                      )}>
                        {tx.type === 'expense' ? '-' : '+'}{tx.amount.toLocaleString()} SAT
                      </p>
                      <Badge variant="outline" className={cn(
                        "text-[10px] px-2 py-0 border-none capitalize",
                        tx.status === 'completed' ? "text-muted-foreground" : "text-yellow-400 bg-yellow-400/5"
                      )}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none bg-secondary/10 border-secondary/20">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Top Up Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/40 transition-all text-left flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Lightning Network</p>
                  <p className="text-xs text-muted-foreground">Instant deposit via Blink/LN</p>
                </div>
              </button>
              <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/40 transition-all text-left flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Landmark className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Bank / Manual</p>
                  <p className="text-xs text-muted-foreground">Settlement in 1-2 business days</p>
                </div>
              </button>
              <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/40 transition-all text-left flex items-center gap-4 opacity-50 cursor-not-allowed">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold">Fiat Cards</p>
                  <p className="text-xs text-muted-foreground">Coming Soon</p>
                </div>
              </button>
            </CardContent>
          </Card>

          <div className="glass-card p-6 rounded-3xl border-primary/20 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-headline font-bold">Refer & Earn</h4>
              <p className="text-sm text-muted-foreground">Invite a business and earn 5% of their first 10 job deposits.</p>
            </div>
            <Button variant="outline" className="w-full rounded-xl border-primary/20 hover:bg-primary/5 text-primary font-bold">
              Copy Invite Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');