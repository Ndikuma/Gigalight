
"use client"

import React, { useEffect, useState, useRef } from 'react';
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
  Info,
  Network,
  Copy,
  Check,
  Clock,
  Activity as PulseIcon
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
import { PaymentSession } from '@/components/wallet/PaymentSession';

export default function DashboardHome() {
  const [profile, setProfile] = useState<User | null>(null);
  const [tasks, setTasks] = useState<TaskMini[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nodeStatus, setNodeStatus] = useState<'active' | 'syncing'>('active');

  // Validator Activation States
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
        if (taskRes.data && Array.isArray(taskRes.data.results)) {
          setTasks(taskRes.data.results);
        } else {
          setTasks([]);
        }
      } catch (e) {
        toast({
          variant: "destructive",
          title: "Synchronization Error",
          description: "Could not propagate data from the GigaLight node.",
        });
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
        toast({ title: "Activation Signal Sent", description: "Waiting for Lightning stake settlement." });
      } else {
        toast({ variant: "destructive", title: "Signal Error", description: res.error || "Could not initialize activation path." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Network Error", description: "Protocol gateway timeout." });
    } finally {
      setIsGeneratingInvoice(false);
    }
  }

  const handleSuccess = async () => {
    toast({ 
      title: "Validator Activated", 
      description: "Your node identity has been upgraded with network audit permissions." 
    });
    // Refresh profile
    const profRes = await ProfileService.getMyProfile();
    if (profRes.data) setProfile(profRes.data);
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Initializing Node...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Profile Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 glass-card border-none bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                <img 
                  src={profile?.profile?.avatar_url || 'https://picsum.photos/seed/node/200/200'} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            <div className={cn(
              "absolute -bottom-2 -right-2 rounded-full p-1.5 border-4 border-card",
              profile?.is_validator ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
            )}>
              {profile?.is_validator ? <UserCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h2 className="text-3xl font-headline font-bold">{profile?.display_name || 'Protocol Node'}</h2>
                <StarRating reputation={profile?.reputation || 0} showScore className="justify-center md:justify-start" />
              </div>
              <p className="text-muted-foreground text-sm max-w-xl">
                {profile?.profile?.bio || 'Strategic node waiting for mission initialization.'}
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 text-xs font-bold">
                <Trophy className="w-3.5 h-3.5 text-primary" /> Reputation: {profile?.reputation || 0}/100
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 text-xs font-bold">
                <Activity className="w-3.5 h-3.5 text-secondary" /> {profile?.tasks_completed || 0} Objectives Finalized
              </div>
              {profile?.is_validator && (
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 text-xs font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Validator
                </div>
              )}
            </div>
          </div>
          <div className="hidden xl:block w-48 space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span>Expertise Progression</span>
              <span className="text-primary">{(profile?.reputation || 0)}%</span>
            </div>
            <Progress value={profile?.reputation || 0} className="h-2 bg-white/5" />
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
          <Button asChild size="sm" className="w-full rounded-xl bg-primary neon-glow-primary font-bold">
            <Link href="/my-projects/create">Deploy Now</Link>
          </Button>
        </Card>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Available Liquidity" 
          value={`${(profile?.wallet?.available_balance || 0).toLocaleString()} SAT`} 
          icon={Wallet} 
          subValue="Ready for Release"
          color="primary"
        />
        <StatCard 
          label="Pending Verification" 
          value={`${(profile?.wallet?.pending_balance || 0).toLocaleString()} SAT`} 
          icon={ShieldCheck} 
          color="emerald"
        />
        <StatCard 
          label="Lifetime Revenue" 
          value={`${(profile?.wallet?.total_rewarded || 0).toLocaleString()} SAT`} 
          icon={Zap} 
          subValue="Platform Yield"
          color="secondary"
        />
        <StatCard 
          label="Network Trust Index" 
          value={`${profile?.reputation || 0}%`} 
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
              {Array.isArray(tasks) && tasks.length > 0 ? tasks.map((task) => (
                <Link key={task.id} href={`/market/${task.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group mb-2">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors text-sm">{task.title}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                          {task.category?.name || 'General'} • {task.difficulty}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-headline font-bold text-emerald-400">+{task.reward_amount?.toLocaleString() || 0} SAT</p>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Multi-sig Ready</p>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground text-sm">No missions propagated in your sector.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none overflow-hidden group">
             <CardContent className="p-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        nodeStatus === 'active' ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      )}>
                        <Network className={cn("w-5 h-5", nodeStatus === 'active' && "animate-pulse")} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Protocol Signal</p>
                        <h4 className="font-bold text-sm">Node Status: {nodeStatus === 'active' ? 'Active' : 'Syncing'}</h4>
                      </div>
                   </div>
                   <div className={cn(
                     "px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-tighter border",
                     nodeStatus === 'active' ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20" : "bg-amber-500/5 text-amber-400 border-amber-500/20"
                   )}>
                     Synchronized
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card className="glass-card border-none overflow-hidden border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
            <CardHeader className="pb-4">
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-secondary" />
                Network Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4 relative group hover:border-secondary/30 transition-all">
                <div className="absolute top-4 right-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                      <Zap className="w-4 h-4" />
                   </div>
                   <h5 className="text-xs font-bold uppercase tracking-widest text-secondary">Upcoming: Career Nodes</h5>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  We are integrating long-term career opportunities with borderless Bitcoin L2 payroll systems for enterprise squads.
                </p>
                <Button asChild variant="ghost" className="w-full text-[10px] h-9 font-bold text-primary hover:bg-primary/5 gap-2 rounded-xl">
                  <Link href="/enterprise">LEARN MORE <ArrowRight className="w-3 h-3" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Validator Activation / Status Card */}
          <div className="glass-card p-6 rounded-[2.5rem] border-emerald-500/20 text-center space-y-5 relative overflow-hidden group">
            <div className={cn(
              "absolute inset-0 transition-colors",
              profile?.is_validator ? "bg-emerald-500/5 group-hover:bg-emerald-500/10" : "bg-primary/5 group-hover:bg-primary/10"
            )}></div>
            
            <div className="relative z-10">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl",
                profile?.is_validator ? "bg-emerald-500/10 text-emerald-400" : "bg-primary/10 text-primary"
              )}>
                {profile?.is_validator ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
              </div>
              
              <div className="space-y-1">
                <h4 className="font-headline font-bold text-lg">
                  {profile?.is_validator ? "Validator Mode Active" : "Validator Activation"}
                </h4>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">
                  {profile?.is_validator ? "Network Integrity Node" : "Audit & Validation Access"}
                </p>
              </div>
              
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 mt-4 text-left space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {profile?.is_validator 
                    ? "Your node is verified. Receive a 10% yield on referral validation fees and maintain network integrity." 
                    : "Become a Network Validator to audit task proofs and earn high-intensity validation yields."}
                </p>
                {!profile?.is_validator && (
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Activation Stake</span>
                    <span className="text-sm font-bold text-primary">30,000 SAT</span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 space-y-3">
                {profile?.is_validator ? (
                  <Button asChild className="w-full rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-bold h-12 shadow-lg shadow-emerald-500/20 gap-2">
                    <Link href="/audits">
                      Access Audit Queue <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button 
                      className="w-full rounded-2xl bg-primary neon-glow-primary font-bold h-12 shadow-lg shadow-primary/20 gap-2"
                      onClick={handleActivateValidator}
                      disabled={isGeneratingInvoice}
                    >
                      {isGeneratingInvoice ? <Loader2 className="w-4 h-4 animate-spin" /> : "Activate Validator Mode"} <ArrowRight className="w-4 h-4" />
                    </Button>
                    <button className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-1.5 mx-auto">
                      <Info className="w-3 h-3" /> Technical Prerequisites
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Validator Payment Dialog */}
      <Dialog open={isValidatorOpen} onOpenChange={(open) => {
        setIsValidatorOpen(open);
        if (!open) cleanupValidatorPath();
      }}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[450px] rounded-[2.5rem] overflow-hidden p-0 shadow-2xl">
          <div className="p-8 space-y-6">
            <DialogHeader className="p-0">
              <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-inner">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                Validator Stake
              </DialogTitle>
              <DialogDescription className="text-sm">
                Propagate 30,000 SAT via Lightning to activate network audit permissions.
              </DialogDescription>
            </DialogHeader>

            {paymentData && (
              <PaymentSession 
                paymentData={paymentData}
                title="Validator Activation"
                type="validator"
                onSuccess={handleSuccess}
                onCancel={cleanupValidatorPath}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
