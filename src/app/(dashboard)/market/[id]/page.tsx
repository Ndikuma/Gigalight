"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Zap, 
  Clock, 
  Shield, 
  ArrowLeft, 
  CheckCircle, 
  Sparkles, 
  Send,
  AlertCircle,
  Trophy,
  Cpu,
  Loader2,
  Code,
  Link as LinkIcon,
  Activity,
  Layers,
  Target,
  CheckCircle2,
  Coins,
  History,
  ChevronRight,
  Info,
  ListTodo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TaskService } from '@/services/task-service';
import { ProjectService } from '@/services/project-service';
import { BidService } from '@/services/bid-service';
import { ProfileService } from '@/services/profile-service';
import { User, TaskWorkbench, SubTask } from '@/lib/types';
import { StarRating } from '@/components/ui/star-rating';
import { Progress } from '@/components/ui/progress';

export default function OpportunityDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'view' | 'active' | 'success'>('view');
  const [isLoading, setIsLoading] = useState(true);
  
  const [opportunity, setOpportunity] = useState<{ data: any, type: 'task' | 'project' } | null>(null);
  const [workbench, setWorkbench] = useState<TaskWorkbench | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Form States
  const [proofText, setProofText] = useState('');
  const [proofLink, setProofLink] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [proposalText, setProposalText] = useState('');
  const [isBoosted, setIsBoosted] = useState(false);
  const [feeMethod, setFeeMethod] = useState<'upfront' | 'payout'>('payout');

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const [taskRes, projectRes, profRes] = await Promise.all([
          TaskService.getTask(id),
          ProjectService.getProject(id),
          ProfileService.getMyProfile()
        ]);

        if (profRes.data) setUser(profRes.data);
        
        if (taskRes.data) {
          setOpportunity({ data: taskRes.data, type: 'task' });
          // If it's a task, try to load worker workbench
          if (profRes.data && taskRes.data.creator.toString() !== profRes.data.id.toString()) {
             const wb = await TaskService.getTaskWorkbench(id);
             if (wb.data) setWorkbench(wb.data);
          }
        } else if (projectRes.data) {
          setOpportunity({ data: projectRes.data, type: 'project' });
        }
      } catch (err) {
        console.error("Propagation error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-headline font-bold">Objective Not Found</h2>
          <p className="text-muted-foreground">This mission may have been finalized or relocated.</p>
        </div>
        <Button asChild variant="outline" className="rounded-2xl px-10 h-12 font-bold">
          <Link href="/market">Return to Interface</Link>
        </Button>
      </div>
    );
  }

  const isTask = opportunity.type === 'task';
  const task = isTask ? opportunity.data : null;
  
  // Dynamic Fee Calculation
  const signalFee = isTask 
    ? (workbench?.next_subtask?.effective_submission_fee_sats ?? task?.submission_fee_sats ?? 0) 
    : (user?.current_tier?.fee_project ?? 250);

  const activeSignalFee = feeMethod === 'upfront' ? signalFee : 0;
  const totalUpfront = activeSignalFee + (isBoosted ? 500 : 0);

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      let res;
      if (isTask) {
        res = await TaskService.submitProof(task.id, {
          subtask_id: workbench?.next_subtask?.id,
          proof_text: proofText,
          proof_link: proofLink,
        });
      } else {
        res = await BidService.submitBid({
          project: opportunity.data.id,
          amount: parseInt(bidAmount),
          proposal_text: proposalText,
          is_boosted: isBoosted,
        });
      }

      if (res.data) {
        toast({
          title: isTask ? "Proof Propagated" : "Proposal Synthesized",
          description: feeMethod === 'upfront' 
            ? `${totalUpfront.toLocaleString()} SAT processed via direct signal.`
            : `Fee scheduled for yield deduction.`,
        });
        setStep('success');
      } else {
        toast({
          variant: "destructive",
          title: "Propagation Failed",
          description: res.error || "Check your node liquidity and parameters.",
        });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Network Error", description: "Critical interface timeout." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/10 border border-emerald-500/30">
          <CheckCircle className="w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-headline font-bold tracking-tight">Protocol Propagated</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {isTask 
              ? "Your technical submission has been queued for verification. Yield will be credited upon verified audit." 
              : `Your strategic proposal node is now active. The client has been notified.`}
          </p>
        </div>
        <div className="flex justify-center gap-4 pt-8">
          <Button asChild variant="outline" className="rounded-2xl px-12 h-14 font-bold text-lg">
            <Link href="/dashboard">Return to Hub</Link>
          </Button>
          <Button asChild className="rounded-2xl px-12 h-14 font-bold text-lg bg-primary neon-glow-primary">
            <Link href="/market">Browse Marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" className="hover:bg-white/5 gap-2 rounded-2xl h-12 px-6 font-bold text-muted-foreground hover:text-white">
          <Link href="/market"><ArrowLeft className="w-4 h-4" /> Market Interface</Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <StarRating reputation={user?.reputation || 0} showScore />
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Node Reputation</span>
          </div>
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Trophy className="w-3.5 h-3.5 mr-2" /> Tier: {user?.current_tier?.display_label || 'Standard'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={cn(
                "border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg",
                isTask ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
              )}>
                {isTask ? <Zap className="w-3 h-3 mr-2" /> : <Briefcase className="w-3 h-3 mr-2" />}
                {isTask ? "Micro Gig" : "Strategic Project"}
              </Badge>
              <Badge variant="outline" className="border-white/10 text-muted-foreground uppercase text-[10px] font-bold tracking-widest px-4 py-1.5 bg-white/5">
                {isTask ? task.category?.name : opportunity.data.client_name}
              </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-headline font-bold tracking-tight leading-[0.95]">
              {opportunity.data.title}
            </h1>
          </header>

          {isTask && workbench && (
            <Card className="glass-card border-none bg-gradient-to-br from-primary/5 to-transparent rounded-[2.5rem] overflow-hidden">
               <CardHeader className="p-8 pb-4">
                  <div className="flex items-center justify-between">
                     <h3 className="font-headline font-bold text-xl flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" /> Worker Workbench
                     </h3>
                     <Badge className="bg-emerald-400/10 text-emerald-400 border-none uppercase text-[8px] font-bold tracking-widest">
                        {workbench.approved_steps} / {workbench.total_steps} Installments Settled
                     </Badge>
                  </div>
               </CardHeader>
               <CardContent className="p-8 pt-0 space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <span>Mission Progression</span>
                        <span className="text-emerald-400">{Math.round((workbench.approved_steps / workbench.total_steps) * 100)}%</span>
                     </div>
                     <Progress value={(workbench.approved_steps / workbench.total_steps) * 100} className="h-2 bg-white/5" />
                  </div>

                  {workbench.next_subtask ? (
                    <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4 animate-in slide-in-from-bottom-2">
                       <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                            <Target className="w-3.5 h-3.5" /> Active Objective: {workbench.next_subtask.title}
                          </h5>
                          <span className="text-[10px] font-bold text-emerald-400">+{workbench.next_subtask.reward_amount} SAT Yield</span>
                       </div>
                       <p className="text-sm text-muted-foreground leading-relaxed">{workbench.next_subtask.description}</p>
                    </div>
                  ) : workbench.total_steps > 0 && workbench.approved_steps === workbench.total_steps ? (
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                       <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                       <div>
                          <p className="text-sm font-bold text-white uppercase tracking-widest">Protocol Finalized</p>
                          <p className="text-xs text-muted-foreground">All installments for this mission have been verified and paid.</p>
                       </div>
                    </div>
                  ) : null}
               </CardContent>
            </Card>
          )}

          <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-10 pb-0">
              <h3 className="font-headline text-2xl font-bold flex items-center gap-3">
                <Info className="w-6 h-6 text-primary" />
                Mission Parameters
              </h3>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {opportunity.data.description}
                </p>
              </div>

              {isTask && task.instructions && (
                <div className="space-y-6">
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                    <ListTodo className="w-4 h-4" /> Execution Steps
                  </h4>
                  <div className="space-y-4">
                     {task.instructions.steps?.map((step: any, i: number) => (
                       <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                          <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center font-bold text-xs text-primary shrink-0">{i+1}</div>
                          <div>
                             <p className="font-bold text-sm text-white">{step.title}</p>
                             <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                          </div>
                       </div>
                     ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {step === 'active' && (
            <Card className="glass-card border-none rounded-[2.5rem] ring-4 ring-primary/20 animate-in slide-in-from-bottom-8 duration-700 shadow-2xl relative overflow-hidden">
              <CardHeader className="p-10 pb-0">
                <h3 className="font-headline text-2xl flex items-center gap-3 font-bold">
                  <Send className="w-6 h-6 text-primary" /> 
                  {isTask ? (workbench?.next_subtask ? `Submit Proof: ${workbench.next_subtask.title}` : "Submit Technical Proof") : "Synthesize Proposal"}
                </h3>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                
                {/* Fee Strategy */}
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Protocol Fee Settlement</Label>
                  <Tabs value={feeMethod} onValueChange={(val: any) => setFeeMethod(val)} className="w-full">
                    <TabsList className="grid grid-cols-2 bg-black/40 border border-white/5 p-1 h-14 rounded-2xl">
                      <TabsTrigger value="payout" className="rounded-xl font-bold gap-2 data-[state=active]:bg-primary">
                        <History className="w-4 h-4" /> Deduct from Payout
                      </TabsTrigger>
                      <TabsTrigger value="upfront" className="rounded-xl font-bold gap-2 data-[state=active]:bg-primary">
                        <Coins className="w-4 h-4" /> Direct Upfront
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {isTask ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                       <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Technical Proof Narrative</Label>
                       <Textarea 
                        placeholder="Detail your execution and findings..."
                        className="min-h-[200px] bg-black/40 border-white/5 rounded-2xl p-6 text-sm focus:ring-primary/40"
                        value={proofText}
                        onChange={(e) => setProofText(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                       <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Signal URL (Optional)</Label>
                       <div className="relative">
                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            placeholder="https://..."
                            className="h-14 bg-black/40 border-white/5 rounded-xl pl-12 focus:ring-primary/40"
                            value={proofLink}
                            onChange={(e) => setProofLink(e.target.value)}
                          />
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Strategic Bid (SAT)</Label>
                        <Input 
                          type="number" 
                          placeholder="Amount in SAT" 
                          className="h-14 bg-black/40 border-white/5 rounded-2xl font-headline font-bold text-xl px-6 focus:ring-secondary/40"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Timeline (Protocol Days)</Label>
                        <Input placeholder="e.g. 14 Days" className="h-14 bg-black/40 border-white/5 rounded-2xl px-6 focus:ring-secondary/40" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                       <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Strategic Proposal</Label>
                       <Textarea 
                        placeholder="Detail your methodology..."
                        className="min-h-[250px] bg-black/40 border-white/5 rounded-2xl p-6 text-sm focus:ring-secondary/40"
                        value={proposalText}
                        onChange={(e) => setProposalText(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="bg-black/60 p-8 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    <span>Protocol Parameters</span>
                    <span>{isTask ? "MICRO SIGNAL" : "STRATEGIC PROPOSAL"}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                         <span className="text-muted-foreground">Mission Signal Fee</span>
                         {feeMethod === 'payout' && <Badge className="h-4 px-1 text-[8px] bg-amber-500/10 text-amber-500 border-none uppercase">Deferred</Badge>}
                      </div>
                      <span className={cn(feeMethod === 'payout' ? "text-muted-foreground line-through" : "text-foreground")}>
                        {signalFee.toLocaleString()} SAT
                      </span>
                    </div>
                    <div className="flex justify-between items-end border-t border-white/10 pt-4">
                      <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Upfront Signal</span>
                      <div className="text-right">
                        <span className="text-3xl font-headline font-bold text-primary">{totalUpfront.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-primary/50 ml-2 uppercase tracking-widest">SAT</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="ghost" onClick={() => setStep('view')} className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-xs">Abort Session</Button>
                  <Button 
                    className={cn(
                      "flex-[2] font-bold h-14 rounded-2xl text-lg transition-all",
                      isTask ? "bg-primary neon-glow-primary" : "bg-secondary neon-glow-secondary shadow-lg shadow-secondary/20"
                    )}
                    onClick={handleSubmit}
                    disabled={isSubmitting || (isTask ? !proofText : !proposalText || !bidAmount)}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Finalizing Signal...
                      </div>
                    ) : (isTask ? "Propagate Technical Proof" : "Deploy Strategic Proposal")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card className="glass-card border-none rounded-[2.5rem] bg-gradient-to-br from-card via-card to-background p-10 overflow-hidden relative">
            <CardContent className="p-0 space-y-8 relative z-10">
              <div className="text-center space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Potential Yield</p>
                <h2 className={cn(
                  "text-5xl font-headline font-bold tracking-tight",
                  isTask ? "text-emerald-400" : "text-secondary"
                )}>
                  +{isTask ? (task.reward_amount?.toLocaleString() || 0) : (opportunity.data.budget_min?.toLocaleString() || 'TBD')}
                </h2>
                <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">SATOSHIS</p>
              </div>

              <div className="space-y-5 border-t border-white/5 pt-8">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4 text-secondary" /> Mission Effort</span>
                  <span className="text-white">{isTask ? `${task.instructions?.estimated_minutes || 15} MINS` : "LONG-TERM"}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Expertise Class</span>
                  <span className="text-foreground capitalize">{opportunity.data.difficulty || opportunity.data.experience_level}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /> Slots</span>
                  <span className="text-foreground">{isTask ? (task.target_completions - task.submissions_count) : 'UNLIMITED'}</span>
                </div>
              </div>

              {step === 'view' && (
                <Button 
                  className={cn(
                    "w-full h-16 rounded-[1.5rem] font-bold text-xl transition-all hover:scale-[1.02] active:scale-[0.98]",
                    isTask ? "bg-primary neon-glow-primary" : "bg-secondary neon-glow-secondary shadow-lg shadow-secondary/20"
                  )}
                  onClick={() => setStep('active')}
                  disabled={isTask && workbench?.approved_steps === workbench?.total_steps && workbench?.total_steps > 0}
                >
                  {isTask ? (workbench?.approved_steps === workbench?.total_steps && workbench?.total_steps > 0 ? "Mission Finalized" : "Initiate workbench") : "Initiate Proposal"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
