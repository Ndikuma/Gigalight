
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
  ExternalLink
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
  
  // Local form states
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
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Opportunity Not Found</h2>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/market">Return to Market</Link>
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
          description: opportunity.description,
          requirements: "Must be reliable and deliver high quality code.",
          skills: opportunity.skills,
          experienceLevel: opportunity.experienceLevel,
        }
      });
      setProposalText(result.proposalText);
      toast({
        title: "AI Draft Ready",
        description: "Your proposal has been personalized based on your Node Reputation.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "AI Helper Offline",
        description: "Could not generate a proposal at this time.",
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
        title: isTask ? "Proof Submitted" : "Bid Propagated",
        description: `${totalUpfront} SAT signal fee deducted from liquid balance.`,
      });
    }, 1500);
  }

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-headline font-bold">Proposal Propagated</h1>
        <p className="text-muted-foreground">
          {isTask 
            ? "Your submission has been queued for verification. AI nodes and peer validators are reviewing your output." 
            : `Your proposal is now visible to the client. ${isBoosted ? "Your bid has been boosted for priority visibility." : ""}`}
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button asChild variant="outline" className="rounded-xl px-8">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild className="rounded-xl px-8 bg-primary">
            <Link href="/market">Browse More Missions</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Button asChild variant="ghost" className="mb-4 hover:bg-white/5 gap-2">
        <Link href="/market"><ArrowLeft className="w-4 h-4" /> Market Interface</Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <header className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={isTask ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"}>
                {isTask ? <Zap className="w-3 h-3 mr-1" /> : <Briefcase className="w-3 h-3 mr-1" />}
                {isTask ? "Micro Mission" : "Professional Project"}
              </Badge>
              <Badge variant="outline" className="border-white/10 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                {isTask ? (opportunity as any).category : (opportunity as any).clientName}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">
              {opportunity.title}
            </h1>
          </header>

          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="font-headline">Objective Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {isTask ? (opportunity as any).shortDescription : (opportunity as any).description}
                </p>
                {isTask && (opportunity as any).instructions && (
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      <Send className="w-4 h-4" /> Instructions
                    </h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {(opportunity as any).instructions}
                    </p>
                    {(opportunity as any).externalUrl && (
                      <div className="pt-2">
                        <Button asChild size="sm" className="rounded-xl gap-2 font-bold">
                          <a href={(opportunity as any).externalUrl} target="_blank" rel="noopener noreferrer">
                            {(opportunity as any).externalUrlLabel || 'Open Mission Link'} <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!isTask && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-secondary">Expertise Nodes Required</h4>
                  <div className="flex flex-wrap gap-2">
                    {(opportunity as any).skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 bg-white/5 rounded-full text-xs text-muted-foreground border border-white/5 font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {step === 'active' && (
            <Card className="glass-card border-none ring-2 ring-primary/20 animate-in slide-in-from-bottom-4">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" /> 
                  {isTask ? "Submit Task Proof" : "Initiate Proposal"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isTask ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Proof Documentation</Label>
                      <Textarea 
                        placeholder={opportunity.proofMethod === 'code_snippet' ? "Paste verified code snippet here..." : "Detail your methodology or provide the required technical output..."}
                        className="min-h-[150px] bg-background/50"
                        value={proofText}
                        onChange={(e) => setProofText(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Compensation Bid (SAT)</Label>
                        <Input 
                          type="number" 
                          placeholder="Amount in SAT" 
                          className="bg-background/50 font-bold"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Timeline (Protocol Days)</Label>
                        <Input placeholder="e.g. 14 Days" className="bg-background/50" />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-bold flex items-center gap-2">
                            <Rocket className="w-4 h-4 text-secondary" /> Node Boost
                          </Label>
                          <p className="text-[10px] text-muted-foreground">Priority visibility in the client's proposal stream.</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-secondary">+500 SAT</span>
                          <Switch checked={isBoosted} onCheckedChange={setIsBoosted} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Professional Pitch</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary gap-2 h-7 px-2 hover:bg-primary/10"
                          onClick={handleAIAssist}
                          disabled={isDrafting}
                        >
                          <Sparkles className="w-3.5 h-3.5" /> {isDrafting ? "Synthesizing..." : "AI Intelligence Assist"}
                        </Button>
                      </div>
                      <Textarea 
                        placeholder="Detail your approach and technical capability..."
                        className="min-h-[200px] bg-background/50 leading-relaxed"
                        value={proposalText}
                        onChange={(e) => setProposalText(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="bg-muted/30 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Network Signal Fee</span>
                    <span>{signalFee} SAT</span>
                  </div>
                  {isBoosted && (
                    <div className="flex justify-between text-xs font-bold text-secondary">
                      <span>Node Boost Fee</span>
                      <span>+500 SAT</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-headline font-bold border-t border-white/5 pt-2">
                    <span>Total Upfront Signal</span>
                    <span className="text-primary">{totalUpfront} SAT</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep('view')} className="flex-1">Abort</Button>
                  <Button 
                    className={cn(
                      "flex-1 font-bold h-12",
                      isTask ? "bg-primary neon-glow-primary" : "bg-secondary neon-glow-secondary"
                    )}
                    onClick={handleSubmit}
                    disabled={isSubmitting || (isTask ? !proofText : !proposalText || !bidAmount)}
                  >
                    {isSubmitting ? "Propagating..." : (isTask ? "Submit Proof" : "Deploy Proposal")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none bg-gradient-to-br from-card to-background">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Yield Potential</p>
                <h2 className={cn(
                  "text-4xl font-headline font-bold",
                  isTask ? "text-emerald-400" : "text-secondary"
                )}>
                  {isTask 
                    ? `+${(opportunity as any).rewardAmount.toLocaleString()}` 
                    : `${(opportunity as any).budgetMin.toLocaleString()} - ${(opportunity as any).budgetMax.toLocaleString()}`}
                </h2>
                <p className="text-xs text-muted-foreground font-bold">SATOSHIS</p>
              </div>

              <div className="space-y-4 border-t border-white/5 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2 font-bold"><Clock className="w-4 h-4" /> Protocol Limit</span>
                  <span className="font-bold">{isTask ? "~15 mins" : "Ongoing"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2 font-bold"><Trophy className="w-4 h-4" /> Tier Level</span>
                  <span className="font-bold capitalize">{opportunity.difficulty || (opportunity as any).experienceLevel}</span>
                </div>
              </div>

              {step === 'view' && (
                <Button 
                  className={cn(
                    "w-full h-14 rounded-2xl font-bold text-lg",
                    isTask ? "bg-primary neon-glow-primary" : "bg-secondary neon-glow-secondary"
                  )}
                  onClick={() => setStep('active')}
                >
                  {isTask ? "Initiate Task" : "Apply for Project"}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-none">
            <CardHeader className="bg-white/5">
              <CardTitle className="text-sm font-headline">L2 Protocol Rules</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-xs text-muted-foreground space-y-4 leading-relaxed">
              <p>Applications require a <strong>{signalFee} SAT</strong> non-refundable Signal Fee to ensure high-quality node interactions.</p>
              <p>Project budgets are secured in a 2-of-3 multi-sig escrow before work starts.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
