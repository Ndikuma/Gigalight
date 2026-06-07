
"use client"

import React, { useEffect, useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { 
  Wallet, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Trophy,
  Activity,
  UserCheck,
  Globe,
  Lock,
  Loader2,
  ShieldAlert,
  Network
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { ProfileService } from '@/services/profile-service';
import { TaskService } from '@/services/task-service';
import { User, TaskMini, TierPaymentResponse } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { StarRating } from '@/components/ui/star-rating';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
import { ValidatorActivationSession } from '@/components/wallet/ValidatorActivationSession';

export default function DashboardHome() {
  const [profile, setProfile] = useState<User | null>(null);
  const [tasks, setTasks] = useState<TaskMini[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isValidatorOpen, setIsValidatorOpen] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [paymentData, setPaymentData] = useState<TierPaymentResponse | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [profRes, taskRes] = await Promise.all([
          ProfileService.getMyProfile(),
          TaskService.getTasks({ page_size: 3 })
        ]);
        if (profRes.data) setProfile(profRes.data);
        if (taskRes.data) setTasks(taskRes.data.results || []);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const cleanupValidatorPath = () => {
    setPaymentData(null);
    setIsValidatorOpen(false);
  };

  const handleActivateValidator = async () => {
    setIsGeneratingInvoice(true);
    try {
      const res = await ProfileService.getValidatorInvoice();
      if (res.data) {
        setPaymentData(res.data);
        setIsValidatorOpen(true);
      }
    } finally {
      setIsGeneratingInvoice(false);
    }
  }

  const handleSuccess = async () => {
    toast({ title: "Validator Activated", description: "Node upgraded with network audit permissions." });
    const profRes = await ProfileService.getMyProfile();
    if (profRes.data) setProfile(profRes.data);
  };

  if (isLoading) {
    return <div className="h-[80vh] flex items-center justify-center"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 glass-card border-none bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
              <div className="w-full h-full rounded-full bg-card overflow-hidden">
                <img src={profile?.profile?.avatar_url || 'https://picsum.photos/seed/node/200/200'} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className={cn("absolute -bottom-2 -right-2 rounded-full p-1.5 border-4 border-card", profile?.is_validator ? "bg-emerald-500" : "bg-amber-500")}>
              {profile?.is_validator ? <UserCheck className="w-4 h-4 text-white" /> : <ShieldAlert className="w-4 h-4 text-white" />}
            </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h2 className="text-3xl font-headline font-bold">{profile?.display_name || 'Protocol Node'}</h2>
                <StarRating reputation={profile?.reputation || 0} showScore />
              </div>
              <p className="text-muted-foreground text-sm max-w-xl">{profile?.profile?.bio || 'Strategic node waiting for mission initialization.'}</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card border-none flex flex-col justify-center items-center text-center p-6 space-y-4">
          <Sparkles className="w-12 h-12 text-primary" />
          <h4 className="font-headline font-bold">Initiate Objective</h4>
          <Button asChild size="sm" className="w-full rounded-xl bg-primary neon-glow-primary font-bold"><Link href="/my-projects/create">Deploy Now</Link></Button>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Liquid Balance" value={`${(profile?.wallet?.available_balance || 0).toLocaleString()} SAT`} icon={Wallet} color="primary" />
        <StatCard label="Pending Audit" value={`${(profile?.wallet?.pending_balance || 0).toLocaleString()} SAT`} icon={ShieldCheck} color="emerald" />
        <StatCard label="Lifetime Revenue" value={`${(profile?.wallet?.total_rewarded || 0).toLocaleString()} SAT`} icon={Zap} color="secondary" />
        <StatCard label="Trust Index" value={`${profile?.reputation || 0}%`} icon={Trophy} color="primary" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="glass-card border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-lg">Curated Opportunities</CardTitle>
              <Link href="/market" className="text-xs text-primary font-bold uppercase tracking-widest hover:underline">Marketplace <ArrowRight className="inline w-4 h-4 ml-1" /></Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.map((task) => (
                <Link key={task.id} href={`/market/${task.id}`} className="block">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all mb-2">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center"><Zap className="w-5 h-5 text-primary" /></div>
                      <div><h4 className="font-semibold text-sm">{task.title}</h4><p className="text-[10px] text-muted-foreground uppercase">{task.category?.name} • {task.difficulty}</p></div>
                    </div>
                    <div className="text-right"><p className="font-headline font-bold text-emerald-400">+{task.reward_amount?.toLocaleString()} SAT</p></div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-[2.5rem] border-emerald-500/20 text-center space-y-5 relative overflow-hidden group">
            <div className={cn("absolute inset-0 transition-colors", profile?.is_validator ? "bg-emerald-500/5" : "bg-primary/5")}></div>
            <div className="relative z-10">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl", profile?.is_validator ? "bg-emerald-500/10 text-emerald-400" : "bg-primary/10 text-primary")}>
                {profile?.is_validator ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
              </div>
              <h4 className="font-headline font-bold text-lg">{profile?.is_validator ? "Validator Mode Active" : "Validator Activation"}</h4>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mb-4">{profile?.is_validator ? "Network Integrity Node" : "Audit Access"}</p>
              
              {profile?.is_validator ? (
                <Button asChild className="w-full rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-bold h-12"><Link href="/audits">Access Audit Queue <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
              ) : (
                <Button className="w-full rounded-2xl bg-primary neon-glow-primary font-bold h-12" onClick={handleActivateValidator} disabled={isGeneratingInvoice}>
                  {isGeneratingInvoice ? <Loader2 className="w-4 h-4 animate-spin" /> : "Activate Validator Mode"} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isValidatorOpen} onOpenChange={(open) => { if (!open) cleanupValidatorPath(); }}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[450px] rounded-[2.5rem] overflow-hidden p-0 shadow-2xl">
          <div className="p-8 space-y-6">
            <DialogHeader className="p-0">
              <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-inner"><ShieldCheck className="w-6 h-6" /></div>
                Validator Stake
              </DialogTitle>
              <DialogDescription className="text-sm">Propagate 30,000 SAT via Lightning to activate audit permissions.</DialogDescription>
            </DialogHeader>

            {paymentData && (
              <ValidatorActivationSession paymentData={paymentData} onSuccess={handleSuccess} onCancel={cleanupValidatorPath} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
