
"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockTasks, mockProjects, mockProfile } from '@/lib/mock-data';
import { 
  Zap, 
  Briefcase, 
  Clock, 
  Shield, 
  ArrowLeft, 
  CheckCircle, 
  Sparkles, 
  Send,
  FileText,
  DollarSign,
  AlertCircle,
  Trophy,
  Rocket,
  ExternalLink,
  ShieldCheck,
  Target,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { draftApplicationProposal } from '@/ai/flows/application-proposal-assistant-flow';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [step, setStep] = useState<'view' | 'active' | 'success'>('view');
  const [mounted, setMounted] = useState(false);
  
  const [proofText, setProofText] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [proposalText, setProposalText] = useState('');
  const [isBoosted, setIsBoosted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const opportunity = useMemo(() => {
    const task = mockTasks.find(t => t.id === id);
    if (task) return { ...task, type: 'task' as const };
    const project = mockProjects.find(p => p.id === id);
    if (project) return { ...project, type: 'project' as const };
    return null;
  }, [id]);

  if (!mounted) return null;

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
  const signalFee = isTask ? 50 : 250;
  const boostFee = isBoosted ? 500 : 0;
  const totalUpfront = signalFee + boostFee;

  async function handleAIAssist() {
    if (opportunity.type !== 'project') return;
    setIsDrafting(true);
    try {
      const result = await draftApplicationProposal({
        userProfile: {
          title: mockProfile.fullName,
          bio: mockProfile.bio || "",
          skills: mockProfile.skills,
          completedProjects: mockProfile.stats.tasksCompleted,
          totalEarned: mockProfile.stats.totalEarned,
        },
        opportunity: {
          type: 'project',
          title: opportunity.title,
          description: (opportunity as any).description,
          requirements: (opportunity as any).requirements || "Professional execution required.",
          skills: (opportunity as any).skills,
          experienceLevel: (opportunity as any).experienceLevel,
        }
      });
      setProposalText(result.proposalText);
      toast({
        title: "AI Synthesis Complete",
        description: "Your proposal has been personalized based on your node standing.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Synthesis Error",
        description: "The AI agent encountered a network timeout.",
      });
    } finally {
      setIsDrafting(false);
    }
  }

  function handleSubmit() {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      toast({
        title: isTask ? "Proof Propagated" : "Proposal Synthesized",
        description: `${totalUpfront.toLocaleString()} SAT signal fee processed via L2.`,
      });
    }, 1800);
  }

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/10">
          <CheckCircle className="w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-headline font-bold tracking-tight">Protocol Propagated</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {isTask 
              ? "Your submission has been queued for verification. AI nodes and peer validators are reviewing your technical output." 
              : `Your strategic proposal is now visible to the client. ${isBoosted ? "Your bid has been boosted for priority visibility." : ""}`}
          </p>
        </div>
        <div className="flex justify-center gap-4 pt-8">
          <Button asChild variant="outline" className="rounded-2xl px-12 h-14 font-bold text-lg">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild className="rounded-2xl px-12 h-14 font-bold text-lg bg-primary neon-glow-primary">
            <Link href="/market">Next Mission</Link>
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
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
            <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Protocol Verified
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
                {isTask ? (opportunity as any).category : (opportunity as any).clientName}
              </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-headline font-bold tracking-tight leading-[0.95]">
              {opportunity.title}
            </h1>
          </header>

          <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-10 pb-0">
              <CardTitle className="font-headline text-2xl">Objective Parameters</CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {isTask ? (opportunity as any).shortDescription : (opportunity as any).description}
                </p>
                {isTask && (opportunity as any).instructions && (
                  <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                      <Target className="w-4 h-4" /> Execution Protocol
                    </h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {(opportunity as any).instructions}
                    </p>
                    {(opportunity as any).externalUrl && (
                      <div className="pt-4">
                        <Button asChild size="lg" className="rounded-2xl gap-3 font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                          <a href={(opportunity as any).externalUrl} target="_blank" rel="noopener noreferrer">
                            {(opportunity as any).externalUrlLabel || 'Open Technical Link'} <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!isTask && (opportunity as any).requirements && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> Technical Requirements
                  </h4>
                  <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {(opportunity as any).requirements}
                    </p>
                  </div>
                </div>
              )}

              {!isTask && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Required Expertise Nodes</h4>
                  <div className="flex flex-wrap gap-2">
                    {(opportunity as any).skills.map((skill: string) => (
                      <span key={skill} className="px-4 py-2 bg-white/5 rounded-2xl text-[10px] text-muted-foreground border border-white/5 font-bold uppercase tracking-widest">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {step === 'active' && (
            <Card className="glass-card border-none rounded-[2.5rem] ring-4 ring-primary/20 animate-in slide-in-from-bottom-8 duration-700 shadow-2xl">
              <CardHeader className="p-10 pb-0">
                <CardTitle className="font-headline text-2xl flex items-center gap-3">
                  <Send className="w-6 h-6 text-primary" /> 
                  {isTask ? "Submit Proof Signal" : "Initiate Proposal Node"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                {isTask ? (
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Technical Documentation</Label>
                    <Textarea 
                      placeholder={opportunity.proofMethod === 'code_snippet' ? "Paste verified code snippet here..." : "Detail your methodology or provide the required technical output..."}
                      className="min-h-[200px] bg-black/40 border-white/5 rounded-[1.5rem] p-6 text-sm leading-relaxed focus:ring-primary/40"
                      value={proofText}
                      onChange={(e) => setProofText(e.target.value)}
                    />
                  </div>
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

                <div className="bg-muted/10 p-6 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">Network Signal Fee</span>
                    <span>{signalFee.toLocaleString()} SAT</span>
                  </div>
                  {isBoosted && (
                    <div className="flex justify-between text-[10px] font-bold text-secondary uppercase tracking-widest">
                      <span>Node Boost Fee</span>
                      <span>+500 SAT</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-headline font-bold border-t border-white/5 pt-4">
                    <span className="flex items-center gap-2">Total Upfront Signal <Clock className="w-4 h-4 opacity-50" /></span>
                    <span className="text-primary">{totalUpfront.toLocaleString()} SAT</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="ghost" onClick={() => setStep('view')} className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-xs">Abort Mission</Button>
                  <Button 
                    className={cn(
                      "flex-1 font-bold h-14 rounded-2xl text-lg transition-all",
                      isTask ? "bg-primary neon-glow-primary" : "bg-secondary neon-glow-secondary shadow-lg shadow-secondary/20"
                    )}
                    onClick={handleSubmit}
                    disabled={isSubmitting || (isTask ? !proofText : !proposalText || !bidAmount)}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Propagating...
                      </div>
                    ) : (isTask ? "Propagate Proof" : "Deploy Proposal")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card className="glass-card border-none rounded-[2.5rem] bg-gradient-to-br from-card via-card to-background p-10 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full"></div>
            
            <CardContent className="p-0 space-y-8 relative z-10">
              <div className="text-center space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Yield Potential</p>
                <h2 className={cn(
                  "text-5xl font-headline font-bold tracking-tight",
                  isTask ? "text-emerald-400" : "text-secondary"
                )}>
                  {isTask 
                    ? `+${(opportunity as any).rewardAmount.toLocaleString()}` 
                    : `${(opportunity as any).budgetMin.toLocaleString()} - ${(opportunity as any).budgetMax.toLocaleString()}`}
                </h2>
                <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">SATOSHIS</p>
              </div>

              <div className="space-y-5 border-t border-white/5 pt-8">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4 text-secondary" /> Protocol Limit</span>
                  <span className="text-foreground">{isTask ? "~15 MINS" : "LONG-TERM"}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Tier Level</span>
                  <span className="text-foreground">{opportunity.difficulty || (opportunity as any).experienceLevel} CLASS</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Multi-sig Ready</span>
                  <span className="text-emerald-400">YES</span>
                </div>
              </div>

              {step === 'view' && (
                <Button 
                  className={cn(
                    "w-full h-16 rounded-[1.5rem] font-bold text-xl transition-all hover:scale-[1.02] active:scale-[0.98]",
                    isTask ? "bg-primary neon-glow-primary shadow-lg shadow-primary/20" : "bg-secondary neon-glow-secondary shadow-lg shadow-secondary/20"
                  )}
                  onClick={() => setStep('active')}
                >
                  {isTask ? "Initiate Mission" : "Apply for Project"}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-none rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-white/5 p-6">
              <CardTitle className="text-xs font-headline uppercase tracking-widest text-muted-foreground">L2 Protocol Governance</CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-xs text-muted-foreground space-y-4 leading-relaxed font-medium">
              <p>Missions require a non-refundable <strong>{signalFee} SAT</strong> Signal Fee to maintain high-density network integrity.</p>
              <p>Budget settlement is secured via a decentralized 2-of-3 multi-sig escrow node before objective execution.</p>
              <p className="text-[10px] italic border-t border-white/5 pt-4">GigaLight Protocol v2.1.0 • Satoshi Standard</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
