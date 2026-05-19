"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle, 
  Zap, 
  ShieldCheck, 
  Loader2,
  Activity,
  User,
  Clock,
  ExternalLink,
  Sparkles,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { TaskService } from '@/services/task-service';
import { TaskMini, Submission } from '@/lib/types';
import { aiSubmissionAuditor } from '@/ai/flows/ai-submission-auditor';
import { cn } from '@/lib/utils';

export default function TaskManagementWorkspace() {
  const { id } = useParams();
  const [task, setTask] = useState<TaskMini | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuditing, setIsAuditing] = useState<string | null>(null);
  const [isActioning, setIsActioning] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTaskData() {
      setIsLoading(true);
      try {
        const [taskRes, subRes] = await Promise.all([
          TaskService.getTask(id as string),
          TaskService.getSubmissionsForTask(id as string)
        ]);
        if (taskRes.data) setTask(taskRes.data);
        if (subRes.data) setSubmissions(subRes.data);
      } catch (err) {
        toast({ variant: "destructive", title: "Sync Error", description: "Could not establish mission link." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchTaskData();
  }, [id]);

  async function handleAction(submissionId: string, action: 'approve' | 'reject') {
    if (!task) return;
    setIsActioning(submissionId);
    try {
      const res = action === 'approve' 
        ? await TaskService.approveSubmission(task.id, submissionId, "Verified by mission creator.")
        : await TaskService.rejectSubmission(task.id, submissionId, "Proof rejected by mission creator.");
      
      if (res.data) {
        toast({ title: `Proof ${action}d`, description: `L2 yield release status updated.` });
        setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: action === 'approve' ? 'approved' : 'rejected' } : s));
      } else {
        toast({ variant: "destructive", title: "Action Failed", description: res.error || "Protocol error." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Network Error", description: "Gateway timeout." });
    } finally {
      setIsActioning(null);
    }
  }

  async function runAiAudit(sub: Submission) {
    setIsAuditing(sub.id);
    try {
      const result = await aiSubmissionAuditor({
        taskInstructions: task?.description || "Verify proof integrity.",
        proofRequirements: "Audit code and logic against mission parameters.",
        proofText: sub.proof_text,
        proofDescription: "Mission creator requested AI secondary audit."
      });

      toast({
        title: `AI Analysis: ${result.suggestedStatus.toUpperCase()}`,
        description: result.rationale,
      });
    } catch (e) {
      toast({ variant: "destructive", title: "AI Node Error", description: "The intelligence node is currently offline." });
    } finally {
      setIsAuditing(null);
    }
  }

  if (isLoading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground/30" />
        <h2 className="text-2xl font-bold">Mission Node Not Found</h2>
        <Button asChild variant="outline" className="rounded-xl"><Link href="/my-projects">Return to Hub</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link href="/my-projects" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-bold uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3" /> Management Hub
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-headline font-bold">{task.title}</h1>
            <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase tracking-widest font-bold">Micro Gig</Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl border-white/5 gap-2 h-10 px-4 font-bold">
          <ExternalLink className="w-4 h-4" /> View Mission
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-headline font-bold">Proof Signals ({submissions.length})</h2>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Queue Status</span>
          </div>

          {submissions.length > 0 ? submissions.map((sub) => (
            <Card key={sub.id} className="glass-card border-none overflow-hidden group hover:border-primary/20 transition-all">
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <Avatar className="w-12 h-12 border-2 border-white/10 rounded-xl">
                      <AvatarImage src={`https://picsum.photos/seed/${sub.user}/100/100`} />
                      <AvatarFallback><User className="w-6 h-6" /></AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white">{sub.user_name || 'Node Operator'}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Received: {new Date(sub.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "uppercase text-[9px] font-bold tracking-widest border-none px-3",
                    sub.status === 'pending' || sub.status === 'submitted' ? "bg-amber-500/10 text-amber-500" :
                    sub.status === 'approved' ? "bg-emerald-500/10 text-emerald-400" : "bg-destructive/10 text-destructive"
                  )}>
                    {sub.status}
                  </Badge>
                </div>

                <div className="bg-background/60 p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                   <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed relative z-10 font-mono">
                     {sub.proof_text}
                   </p>
                </div>

                {(sub.status === 'pending' || sub.status === 'submitted') && (
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto rounded-xl border-primary/20 text-primary hover:bg-primary/10 font-bold gap-2 h-10 px-6"
                      onClick={() => runAiAudit(sub)}
                      disabled={isAuditing === sub.id}
                    >
                      <Sparkles className="w-4 h-4" /> AI Audit
                    </Button>
                    <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto">
                      <Button 
                        variant="ghost" 
                        className="flex-1 sm:flex-none rounded-xl text-destructive hover:bg-destructive/10 font-bold h-10 px-6"
                        onClick={() => handleAction(sub.id, 'reject')}
                        disabled={isActioning === sub.id}
                      >
                        Reject
                      </Button>
                      <Button 
                        className="flex-1 sm:flex-none rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold h-10 px-8"
                        onClick={() => handleAction(sub.id, 'approve')}
                        disabled={isActioning === sub.id}
                      >
                        Release SATs
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )) : (
            <div className="py-20 text-center glass-card rounded-3xl border-dashed flex flex-col items-center gap-4">
              <Activity className="w-12 h-12 text-muted-foreground/20" />
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No technical proofs detected in this channel.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none bg-gradient-to-br from-primary/10 to-transparent p-8 rounded-[2rem]">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mission Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground">Reward</span>
                  <span className="text-white">+{task.reward_amount?.toLocaleString()} SAT</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground">Density</span>
                  <span className="text-white">{task.submissions_count} Proofs</span>
                </div>
              </div>
              <div className="h-px bg-white/5" />
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                {task.short_description}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-none p-8 rounded-[2rem] text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-headline font-bold">Protocol Safety</h4>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
              Verify proofs carefully. SAT releases are non-reversible on the L2 protocol.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
