
"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'react-router-dom'; // Note: User code used next/navigation but the imports in the file were standard. I'll stick to the original structure.
import { 
  Zap, 
  Briefcase, 
  Clock, 
  Shield, 
  ArrowLeft, 
  CheckCircle, 
  Sparkles, 
  Send,
  AlertCircle,
  Trophy,
  Rocket,
  ShieldCheck,
  Cpu,
  Loader2,
  Code,
  Link as LinkIcon,
  FileText,
  Activity,
  Layers,
  ChevronRight,
  Target,
  CheckCircle2,
  History,
  Wrench,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { draftApplicationProposal } from '@/ai/flows/application-proposal-assistant-flow';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TaskService } from '@/services/task-service';
import { ProjectService } from '@/services/project-service';
import { BidService } from '@/services/bid-service';
import { ProfileService } from '@/services/profile-service';
import { ServiceService } from '@/services/service-service';
import { User, ProjectDetail, ProfessionalService } from '@/lib/types';
import { StarRating } from '@/components/ui/star-rating';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [step, setStep] = useState<'view' | 'active' | 'success'>('view');
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [opportunity, setOpportunity] = useState<{ data: any, type: 'task' | 'project' } | null>(null);
  const [workbench, setWorkbench] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [myServices, setMyServices] = useState<ProfessionalService[]>([]);
  const [selectedService, setSelectedService] = useState<ProfessionalService | null>(null);

  const [proofText, setProofText] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [proposalText, setProposalText] = useState('');
  const [isBoosted, setIsBoosted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      setIsLoading(true);
      try {
        const [taskRes, projectRes, profRes, servicesRes] = await Promise.all([
          TaskService.getTask(id as string),
          ProjectService.getProject(id as string),
          ProfileService.getMyProfile(),
          ServiceService.getMyServices()
        ]);

        if (profRes.data) setUser(profRes.data);
        if (servicesRes.data) setMyServices(servicesRes.data);
        
        if (taskRes.data) {
          setOpportunity({ data: taskRes.data, type: 'task' });
          if (profRes.data && taskRes.data.creator !== profRes.data.id) {
             const wb = await TaskService.getTaskWorkbench(id as string);
             if (wb.data) setWorkbench(wb.data);
          }
        } else if (projectRes.data) {
          setOpportunity({ data: projectRes.data, type: 'project' });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (!mounted) return null;

  if (isLoading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
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
  
  // Calculate fees based on current tier
  const tier = user?.current_tier;
  const baseSignalFee = isTask ? (tier?.fee_task ?? 50) : (tier?.fee_project ?? 250);
  const signalFee = baseSignalFee;
  const totalUpfront = signalFee + (isBoosted ? 500 : 0);

  const formatBudget = (budget: any) => {
    if (!budget) return 'TBD';
    if (typeof budget === 'string') return budget;
    if (typeof budget === 'object') {
      const min = (budget.min || 0).toLocaleString();
      const max = (budget.max || 0).toLocaleString();
      return `${min} - ${max} SAT`;
    }
    return 'TBD';
  };

  async function handleAIAssist() {
    if (opportunity.type !== 'project') return;
    setIsDrafting(true);
    try {
      const result = await draftApplicationProposal({
        userProfile: {
          title: user?.display_name || 'Node Operator',
          bio: user?.profile?.bio || "",
          skills: [],
          completedProjects: user?.projects_hired || 0,
          totalEarned: user?.total_earned || 0,
        },
        opportunity: {
          type: 'project',
          title: opportunity.data.title,
          description: opportunity.data.description,
          requirements: opportunity.data.requirements || "Professional execution required.",
          skills: [],
          experienceLevel: opportunity.data.experience_level,
        }
      });
      setProposalText(result.proposalText);
      toast({ title: "AI Synthesis Complete", description: "Your proposal has been personalized." });
    } catch (e) {
      toast({ variant: "destructive", title: "Synthesis Error", description: "AI agent encounter a timeout." });
    } finally {
      setIsDrafting(false);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      let res;
      if (isTask) {
        if (workbench?.next_subtask) {
          res = await TaskService.submitProof(opportunity.data.id, {
            subtask_id: workbench.next_subtask.id,
            proof_text: proofText,
            attached_service: selectedService?.id
          } as any);
        } else {
          res = await TaskService.submitProof(opportunity.data.id, {
            proof_text: proofText,
            attached_service: selectedService?.id
          } as any);
        }
      } else {
        res = await BidService.submitBid({
          project: opportunity.data.id,
          amount: parseInt(bidAmount),
          proposal_text: proposalText,
          signal_fee: signalFee,
          is_boosted: isBoosted,
          attached_service: selectedService?.id
        });
      }

      if (res.data) {
        toast({
          title: isTask ? "Proof Propagated" : "Proposal Synthesized",
          description: `${totalUpfront.toLocaleString()} SAT signal fee processed via L2.`,
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

  const renderProofInput = (method: string) => {
    switch (method) {
      case 'code_snippet':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Verified Code Snippet</Label>
              <Badge variant="outline" className="text-[9px] font-mono opacity-50"><Code className="w-3 h-3 mr-1" /> NODE_ENV: PRODUCTION</Badge>
            </div>
            <Textarea 
              placeholder="Paste your verified technical implementation or fix here..."
              className="min-h-[300px] bg-black/60 border-primary/20 rounded-[1.5rem] p-6 text-xs font-mono leading-relaxed focus:ring-primary/40 text-emerald-400"
              value={proofText}
              onChange={(e) => setProofText(e.target.value)}
            />
          </div>
        );
      case 'link':
      case 'social_link':
        return (
          <div className="space-y-4">
            <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Protocol URL Propagation</Label>
            <div className="relative group">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="https://..."
                className="h-16 bg-black/40 border-white/5 rounded-2xl pl-12 focus:ring-primary/40 font-bold"
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Technical Documentation</Label>
            <Textarea 
              placeholder="Provide detailed documentation of your technical output and mission methodology..."
              className="min-h-[200px] bg-black/40 border-white/5 rounded-[1.5rem] p-6 text-sm leading-relaxed focus:ring-primary/40"
              value={proofText}
              onChange={(e) => setProofText(e.target.value)}
            />
          </div>
        );
    }
  };

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
              ? "Your technical submission has been queued for verification. Network nodes are reviewing your technical output for SAT release." 
              : `Your strategic proposal node is now active. The client has been notified of your signal.`}
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
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Validated Performance</span>
          </div>
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Trophy className="w-3.5 h-3.5 mr-2" /> Protocol Tier: {user?.current_tier?.display_label || 'Standard'}
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
                {isTask ? "Micro Mission" : "Strategic Project"}
              </Badge>
              <Badge variant="outline" className="border-white/10 text-muted-foreground uppercase text-[10px] font-bold tracking-widest px-4 py-1.5 bg-white/5">
                {isTask ? opportunity.data.category?.name : opportunity.data.client_name}
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
                        <Activity className="w-5 h-5 text-primary" /> Node Workbench
                     </h3>
                     <Badge className="bg-emerald-400/10 text-emerald-400 border-none uppercase text-[8px] font-bold tracking-widest">
                        {workbench.approved_steps} / {workbench.total_steps} Milestones Verified
                     </Badge>
                  </div>
               </CardHeader>
               <CardContent className="p-8 pt-0 space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <span>Technical Progression</span>
                        <span className="text-emerald-400">{Math.round((workbench.approved_steps / workbench.total_steps) * 100)}%</span>
                     </div>
                     <Progress value={(workbench.approved_steps / workbench.total_steps) * 100} className="h-2 bg-white/5" />
                  </div>

                  {workbench.next_subtask ? (
                    <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4 animate-in slide-in-from-bottom-2">
                       <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                            <Target className="w-3.5 h-3.5" /> Next Objective: {workbench.next_subtask.title}
                          </h5>
                          <span className="text-[10px] font-bold text-emerald-400">+{workbench.next_subtask.reward_amount} SAT</span>
                       </div>
                       <p className="text-sm text-muted-foreground leading-relaxed">{workbench.next_subtask.description}</p>
                    </div>
                  ) : workbench.approved_steps === workbench.total_steps ? (
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                       <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                       <div>
                          <p className="text-sm font-bold text-white uppercase tracking-widest">Protocol Fully Propagated</p>
                          <p className="text-xs text-muted-foreground">All subtasks for this mission have been finalized and settled.</p>
                       </div>
                    </div>
                  ) : null}

                  {workbench.submissions && workbench.submissions.length > 0 && (
                    <div className="space-y-3 mt-4">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                         <History className="w-3 h-3" /> Technical Signal History
                       </p>
                       {workbench.submissions.map((sub: any, idx: number) => (
                         <div key={sub.id || idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                               <div className={cn(
                                 "w-8 h-8 rounded-lg flex items-center justify-center border",
                                 sub.status === 'approved' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                                 sub.status === 'rejected' ? "bg-destructive/10 text-destructive border-destructive/20" :
                                 "bg-amber-500/10 text-amber-500 border-amber-500/20"
                               )}>
                                 {sub.status === 'approved' ? <CheckCircle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                               </div>
                               <div>
                                 <p className="text-xs font-bold text-white">{sub.subtask_title || 'Main Protocol'}</p>
                                 <p className="text-[8px] text-muted-foreground uppercase tracking-tighter">{sub.status}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-xs font-bold">{sub.reward_amount} SAT</p>
                            </div>
                         </div>
                       ))}
                    </div>
                  )}
               </CardContent>
            </Card>
          )}

          <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-10 pb-0">
              <h3 className="font-headline text-2xl font-bold flex items-center gap-3">
                <Cpu className="w-6 h-6 text-primary" />
                Objective Parameters
              </h3>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {opportunity.data.description}
                </p>
              </div>

              {!isTask && opportunity.data.requirements && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Strategic Requirements
                  </h4>
                  <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {opportunity.data.requirements}
                    </p>
                  </div>
                </div>
              )}

              {isTask && opportunity.data.validator_guidelines && (
                <div className="space-y-4">
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Proof Standards
                  </h4>
                  <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {opportunity.data.validator_guidelines}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {step === 'active' && (
            <Card className="glass-card border-none rounded-[2.5rem] ring-4 ring-primary/20 animate-in slide-in-from-bottom-8 duration-700 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Activity className="w-32 h-32" />
              </div>
              <CardHeader className="p-10 pb-0">
                <h3 className="font-headline text-2xl flex items-center gap-3 font-bold">
                  <Send className="w-6 h-6 text-primary" /> 
                  {isTask ? (workbench?.next_subtask ? `Submit Proof: ${workbench.next_subtask.title}` : "Submit Proof Signal") : "Initiate Proposal Node"}
                </h3>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                {/* Expert Service Attachment */}
                {myServices.length > 0 && (
                   <div className="space-y-3">
                      <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Expertise Signal Attachment (Optional)</Label>
                      <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full h-14 bg-black/40 border-white/10 rounded-2xl justify-between px-6 hover:bg-white/5 font-bold transition-all group">
                               <div className="flex items-center gap-3">
                                  <Wrench className={cn("w-4 h-4", selectedService ? "text-emerald-400" : "text-muted-foreground")} />
                                  <span className={selectedService ? "text-white" : "text-muted-foreground"}>
                                     {selectedService ? selectedService.title : "Link Professional Offering..."}
                                  </span>
                               </div>
                               <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-white" />
                            </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-[500px] bg-card border-white/10 p-2 shadow-2xl max-h-80 overflow-y-auto">
                            <DropdownMenuItem onClick={() => setSelectedService(null)} className="rounded-xl p-3 cursor-pointer focus:bg-white/5 mb-1">
                               <div className="flex flex-col">
                                  <span className="font-bold text-sm">No Attachment</span>
                                  <span className="text-[10px] text-muted-foreground">Submit without a service link.</span>
                               </div>
                            </DropdownMenuItem>
                            {myServices.map((service) => (
                               <DropdownMenuItem key={service.id} onClick={() => setSelectedService(service)} className="rounded-xl p-3 cursor-pointer focus:bg-emerald-500/10 mb-1">
                                  <div className="flex flex-col">
                                     <span className="font-bold text-sm text-white">{service.title}</span>
                                     <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{service.category} • {service.price_sats.toLocaleString()} SAT Base</span>
                                  </div>
                               </DropdownMenuItem>
                            ))}
                         </DropdownMenuContent>
                      </DropdownMenu>
                      <p className="text-[9px] text-muted-foreground italic ml-2">Attach a service to provide a stronger expertise signal to the mission auditor.</p>
                   </div>
                )}

                {isTask ? (
                  renderProofInput(opportunity.data.proof_method)
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Compensation Bid (SAT)</Label>
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
                    
                    <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-[2rem] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-bold flex items-center gap-2">
                            <Rocket className="w-4 h-4 text-secondary" /> Node Reputation Boost
                          </Label>
                          <p className="text-[10px] text-muted-foreground font-medium">Priority visibility in the client's objective stream.</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-secondary tracking-widest">+500 SAT</span>
                          <Switch checked={isBoosted} onCheckedChange={setIsBoosted} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Strategic Pitch</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary gap-2 h-8 px-4 rounded-xl hover:bg-primary/10 font-bold text-[10px] uppercase tracking-widest"
                          onClick={handleAIAssist}
                          disabled={isDrafting}
                        >
                          <Sparkles className="w-4 h-4" /> {isDrafting ? "Synthesizing..." : "AI Intelligence Assist"}
                        </Button>
                      </div>
                      <Textarea 
                        placeholder="Detail your technical approach and expertise capability..."
                        className="min-h-[250px] bg-black/40 border-white/5 rounded-[1.5rem] p-6 text-sm leading-relaxed focus:ring-secondary/40"
                        value={proposalText}
                        onChange={(e) => setProposalText(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="bg-black/60 p-8 rounded-3xl border border-white/10 space-y-4 shadow-inner">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    <span>Protocol Parameters</span>
                    <span>L2 SIGNAL</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                         <span className="text-muted-foreground">Network Signal Fee</span>
                         <Badge variant="outline" className="h-4 px-1 text-[8px] border-white/10 text-muted-foreground uppercase">{user?.current_tier?.display_label || 'Standard'}</Badge>
                      </div>
                      <span className="text-foreground">{signalFee.toLocaleString()} SAT</span>
                    </div>
                    {isBoosted && (
                      <div className="flex justify-between text-xs font-bold text-secondary uppercase tracking-widest">
                        <span>Node Boost Fee</span>
                        <span>+500 SAT</span>
                      </div>
                    )}
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
                    ) : (isTask ? "Propagate Proof Signal" : "Deploy Strategic Proposal")}
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
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Node Yield Potential</p>
                <h2 className={cn(
                  "text-5xl font-headline font-bold tracking-tight",
                  isTask ? "text-emerald-400" : "text-secondary"
                )}>
                  {isTask 
                    ? `+${(opportunity.data.reward_amount || 0).toLocaleString()}` 
                    : formatBudget(opportunity.data.budget)}
                </h2>
                <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">SATOSHIS</p>
              </div>

              <div className="space-y-5 border-t border-white/5 pt-8">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4 text-secondary" /> Mission Limit</span>
                  <span className="text-white">{isTask ? "~15 MINS" : "LONG-TERM"}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Technical Class</span>
                  <span className="text-foreground capitalize">{opportunity.data.difficulty || opportunity.data.experience_level} CLASS</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /> Slots Remaining</span>
                  <span className="text-foreground">{isTask ? (opportunity.data.target_completions - opportunity.data.submissions_count) : (opportunity.data.available_slots || 1)} Nodes</span>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Skills Signal</p>
                <div className="flex flex-wrap gap-2">
                  {(opportunity.data.skills || []).map((skill: any, idx: number) => (
                    <Badge key={skill.id || `skill-det-${idx}`} variant="secondary" className="bg-white/5 text-muted-foreground border-white/5 px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest">
                      {skill.name}
                    </Badge>
                  ))}
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
                  {isTask ? (workbench?.approved_steps === workbench?.total_steps && workbench?.total_steps > 0 ? "Mission Finalized" : "Initiate Mission") : "Commission Node"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

