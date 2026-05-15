
"use client"

import React, { useState, useMemo } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { draftApplicationProposal } from '@/ai/flows/application-proposal-assistant-flow';
import Link from 'next/link';

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [step, setStep] = useState<'view' | 'active' | 'success'>('view');
  
  // Local form states
  const [proofText, setProofText] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [proposalText, setProposalText] = useState('');

  const opportunity = useMemo(() => {
    const task = mockTasks.find(t => t.id === id);
    if (task) return { ...task, type: 'task' as const };
    const project = mockProjects.find(p => p.id === id);
    if (project) return { ...project, type: 'project' as const };
    return null;
  }, [id]);

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

  async function handleAIAssist() {
    if (opportunity.type !== 'project') return;
    setIsDrafting(true);
    try {
      const result = await draftApplicationProposal({
        userProfile: {
          title: "Senior Developer",
          bio: "Expert in decentralized systems and modern web architecture.",
          skills: ["React", "TypeScript", "Node.js"],
          completedProjects: 12,
          totalEarned: 125000,
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
        description: "Your proposal has been personalized for this project.",
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
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      toast({
        title: isTask ? "Proof Submitted" : "Bid Placed",
        description: isTask 
          ? "The validator network will review your work soon." 
          : "The client has been notified of your proposal.",
      });
    }, 1500);
  }

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-headline font-bold">Excellent Work!</h1>
        <p className="text-muted-foreground">
          {isTask 
            ? "Your submission has been queued for verification. You'll receive your SATs once it's approved." 
            : "Your proposal is now in the client's inbox. They'll reach out if it's a good fit."}
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button asChild variant="outline" className="rounded-xl px-8">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild className="rounded-xl px-8 bg-primary">
            <Link href="/market">Find More Gigs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Button asChild variant="ghost" className="mb-4 hover:bg-white/5 gap-2">
        <Link href="/market"><ArrowLeft className="w-4 h-4" /> Back to Market</Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <header className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={isTask ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"}>
                {isTask ? <Zap className="w-3 h-3 mr-1" /> : <Briefcase className="w-3 h-3 mr-1" />}
                {isTask ? "Micro Gig" : "Project"}
              </Badge>
              <Badge variant="outline" className="border-white/10 text-muted-foreground uppercase text-[10px]">
                {isTask ? (opportunity as any).category : (opportunity as any).clientName}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">
              {opportunity.title}
            </h1>
          </header>

          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="font-headline">Description & Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-muted-foreground leading-relaxed">
                {isTask ? (opportunity as any).shortDescription : (opportunity as any).description}
              </div>

              {!isTask && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-secondary">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(opportunity as any).skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 bg-white/5 rounded-full text-xs text-muted-foreground border border-white/5">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {isTask && (
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> Verification Method
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    This task requires a <strong>{(opportunity as any).proofMethod}</strong> as proof of completion. 
                    AI and peer validators will review your submission.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {step === 'active' && (
            <Card className="glass-card border-none ring-2 ring-primary/20 animate-in slide-in-from-bottom-4">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" /> 
                  {isTask ? "Submit Your Proof" : "Draft Your Proposal"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isTask ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Submission Details</Label>
                      <Textarea 
                        placeholder="Explain how you completed the task or paste the required info here..."
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
                        <Label>Your Bid (SATs)</Label>
                        <Input 
                          type="number" 
                          placeholder="Amount in SAT" 
                          className="bg-background/50"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Est. Timeline</Label>
                        <Input placeholder="e.g. 2 weeks" className="bg-background/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Cover Letter / Proposal</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary gap-2 h-7 px-2 hover:bg-primary/10"
                          onClick={handleAIAssist}
                          disabled={isDrafting}
                        >
                          <Sparkles className="w-3.5 h-3.5" /> {isDrafting ? "Drafting..." : "AI Assist"}
                        </Button>
                      </div>
                      <Textarea 
                        placeholder="Pitch yourself to the client..."
                        className="min-h-[200px] bg-background/50"
                        value={proposalText}
                        onChange={(e) => setProposalText(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep('view')} className="flex-1">Cancel</Button>
                  <Button 
                    className={cn(
                      "flex-1 font-bold h-12",
                      isTask ? "bg-primary neon-glow-primary" : "bg-secondary neon-glow-secondary"
                    )}
                    onClick={handleSubmit}
                    disabled={isSubmitting || (isTask ? !proofText : !proposalText || !bidAmount)}
                  >
                    {isSubmitting ? "Processing..." : (isTask ? "Submit Task" : "Send Proposal")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="glass-card border-none bg-gradient-to-br from-card to-background">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Reward</p>
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
                  <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> Time Limit</span>
                  <span className="font-bold">{isTask ? "~15 mins" : "Ongoing"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><Shield className="w-4 h-4" /> Difficulty</span>
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
                  {isTask ? "Start Task Now" : "Apply for Project"}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-none overflow-hidden">
            <CardHeader className="bg-white/5">
              <CardTitle className="text-sm font-headline">Safety & Escrow</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-xs text-muted-foreground space-y-4 leading-relaxed">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                <p>Funds are held in a secure multisig escrow. Payout is automated upon validation.</p>
              </div>
              <div className="flex gap-3">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <p>All work is recorded on the Layer 2 network for permanent reputation building.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
