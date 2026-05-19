
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
  Users,
  Clock,
  ExternalLink,
  Sparkles,
  AlertCircle,
  FileText,
  TrendingUp,
  BarChart3,
  Layers,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MoreVertical,
  Plus,
  Settings2,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { TaskService } from '@/services/task-service';
import { Submission } from '@/lib/types';
import { aiSubmissionAuditor } from '@/ai/flows/ai-submission-auditor';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function TaskManagementWorkspace() {
  const { id } = useParams();
  const [mgmt, setMgmt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuditing, setIsAuditing] = useState<string | null>(null);
  const [isActioning, setIsActioning] = useState<string | null>(null);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  
  // New Milestone State
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', reward_amount: '100' });

  useEffect(() => {
    async function fetchTaskMgmt() {
      setIsLoading(true);
      try {
        const res = await TaskService.getTaskManagement(id as string);
        if (res.data) setMgmt(res.data);
      } catch (err) {
        toast({ variant: "destructive", title: "Sync Error", description: "Could not establish mission management link." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchTaskMgmt();
  }, [id]);

  async function handleAction(submissionId: string, action: 'approve' | 'reject' | 'needs_revision') {
    if (!mgmt?.task) return;
    setIsActioning(submissionId);
    try {
      const notes = action === 'approve' 
        ? "Verified by mission creator." 
        : action === 'reject' 
          ? "Proof rejected by mission creator."
          : "Revision requested by mission creator.";
          
      const res = await TaskService.approveSubmission(mgmt.task.id, submissionId, notes);
      
      if (res.data) {
        toast({ title: `Proof ${action.replace('_', ' ')}d`, description: `L2 yield release status updated.` });
        // Local refresh
        const refresh = await TaskService.getTaskManagement(id as string);
        if (refresh.data) setMgmt(refresh.data);
      } else {
        toast({ variant: "destructive", title: "Action Failed", description: res.error || "Protocol error." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Network Error", description: "Gateway timeout." });
    } finally {
      setIsActioning(null);
    }
  }

  async function handleAddMilestone() {
    if (!newMilestone.title) return;
    setIsAddingSubtask(true);
    try {
      // Logic for adding a subtask to an existing task
      // In this proto, we'll simulate the update if the service isn't explicit
      toast({ title: "Milestone Propagated", description: "New technical objective added to protocol." });
      
      // Re-fetch management data
      const refresh = await TaskService.getTaskManagement(id as string);
      if (refresh.data) setMgmt(refresh.data);
      setNewMilestone({ title: '', description: '', reward_amount: '100' });
    } catch (e) {
      toast({ variant: "destructive", title: "Propagation Error", description: "Could not update mission architecture." });
    } finally {
      setIsAddingSubtask(false);
    }
  }

  async function runAiAudit(sub: any) {
    setIsAuditing(sub.id);
    try {
      const result = await aiSubmissionAuditor({
        taskInstructions: mgmt.task.description,
        proofRequirements: mgmt.task.validator_guidelines || "Audit technical proof integrity.",
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

  if (!mgmt?.task) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground/30" />
        <h2 className="text-2xl font-bold">Mission Node Not Found</h2>
        <Button asChild variant="outline" className="rounded-xl"><Link href="/my-projects">Return to Hub</Link></Button>
      </div>
    );
  }

  const completionRate = (mgmt.completed_workers / mgmt.target_completions) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link href="/my-tasks" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-bold uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3" /> Management Hub
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-headline font-bold">{mgmt.task.title}</h1>
            <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase tracking-widest font-bold px-3">Review Center</Badge>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="rounded-xl border-white/5 gap-2 h-10 px-4 font-bold">
            <BarChart3 className="w-4 h-4" /> Full Analytics
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-xl border-white/5 gap-2 h-10 px-4 font-bold">
            <Link href={`/market/${mgmt.task.id}`}><ExternalLink className="w-4 h-4" /> Public Interface</Link>
          </Button>
        </div>
      </header>

      {/* Aggregated Mission Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard label="Target Nodes" value={mgmt.target_completions} icon={Users} color="primary" />
         <StatCard label="Active Proofs" value={mgmt.submission_counts.submitted} icon={Activity} color="secondary" />
         <StatCard label="Paid Yield" value={`${(mgmt.paid_sats || 0).toLocaleString()} SAT`} icon={Zap} color="emerald" />
         <StatCard label="Remaining Cap" value={mgmt.remaining_slots} icon={Layers} color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="glass-card border-none bg-gradient-to-br from-primary/5 to-transparent rounded-[2rem]">
            <CardHeader className="p-8">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-xl flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> Propagation Overview
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{mgmt.completed_workers} / {mgmt.target_completions} Verified Nodes</span>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
               <div className="space-y-2">
                  <Progress value={completionRate} className="h-2 bg-white/5" />
                  <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                     <span>Mission Lifecycle</span>
                     <span>{Math.round(completionRate)}% Propagation</span>
                  </div>
               </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mt-8 mb-2">
            <h2 className="text-2xl font-headline font-bold">Audit Queue ({mgmt.review_queue.length})</h2>
            <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
               <input placeholder="Filter signals..." className="h-9 bg-white/5 border-none rounded-xl pl-9 text-xs focus:ring-primary/40 w-48" />
            </div>
          </div>

          {mgmt.review_queue.length > 0 ? mgmt.review_queue.map((sub: any) => (
            <Card key={sub.id} className="glass-card border-none overflow-hidden group hover:border-primary/20 transition-all">
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <Avatar className="w-12 h-12 border-2 border-white/10 rounded-xl">
                      <AvatarImage src={`https://picsum.photos/seed/${sub.user}/100/100`} />
                      <AvatarFallback><User className="w-6 h-6" /></AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white">{sub.worker_name || 'Node Operator'}</h4>
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                          <Clock className="w-3 h-3" /> Received: {new Date(sub.created_at).toLocaleString()}
                        </p>
                        {sub.subtask_title && (
                          <Badge variant="outline" className="text-[8px] font-bold uppercase h-4 px-1.5 border-white/10 text-primary">
                            Subtask: {sub.subtask_title}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge className={cn(
                    "uppercase text-[9px] font-bold tracking-widest border-none px-3",
                    sub.status === 'submitted' ? "bg-amber-500/10 text-amber-500" :
                    sub.status === 'approved' ? "bg-emerald-500/10 text-emerald-400" : "bg-destructive/10 text-destructive"
                  )}>
                    {sub.status}
                  </Badge>
                </div>

                <div className="bg-background/60 p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                   <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed relative z-10 font-mono">
                     {sub.proof_text}
                   </p>
                   {sub.proof_link && (
                     <div className="mt-4 pt-4 border-t border-white/5">
                        <a href={sub.proof_link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-primary flex items-center gap-2 hover:underline">
                          <ExternalLink className="w-3 h-3" /> Protocol URL Propagation
                        </a>
                     </div>
                   )}
                </div>

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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="rounded-xl text-muted-foreground hover:bg-white/5 h-10 w-10 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border-white/10">
                        <DropdownMenuItem onClick={() => handleAction(sub.id, 'needs_revision')} className="gap-2 cursor-pointer">
                          <HelpCircle className="w-4 h-4 text-amber-500" /> Request Revision
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(sub.id, 'reject')} className="gap-2 text-destructive cursor-pointer">
                          <XCircle className="w-4 h-4" /> Reject Proof
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button 
                      className="flex-1 sm:flex-none rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold h-10 px-8 gap-2"
                      onClick={() => handleAction(sub.id, 'approve')}
                      disabled={isActioning === sub.id}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Release SATs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="py-20 text-center glass-card rounded-3xl border-dashed flex flex-col items-center gap-4">
              <Activity className="w-12 h-12 text-muted-foreground/20" />
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No pending technical proofs in this channel.</p>
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
                  <span className="text-muted-foreground">Reward Rate</span>
                  <span className="text-white">+{mgmt.task.reward_amount.toLocaleString()} SAT / Node</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground">Potential Release</span>
                  <span className="text-white">{mgmt.potential_total_reward.toLocaleString()} SAT</span>
                </div>
              </div>
              <div className="h-px bg-white/5" />
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                {mgmt.task.short_description}
              </p>
            </CardContent>
          </Card>

          {/* Milestone / Subtask Management */}
          <Card className="glass-card border-none p-8 rounded-[2rem] space-y-6">
             <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Protocol Milestones</h4>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 text-primary">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-white/10 sm:max-w-[425px] rounded-[2rem]">
                    <DialogHeader>
                      <DialogTitle className="font-headline font-bold text-xl flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" /> New Milestone
                      </DialogTitle>
                      <DialogDescription className="text-xs">Add a technical objective to the mission architecture.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold tracking-widest">Objective Title</Label>
                        <Input placeholder="e.g. Protocol Audit Step 2" className="bg-black/40 border-white/5" value={newMilestone.title} onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold tracking-widest">SAT Yield</Label>
                        <Input type="number" className="bg-black/40 border-white/5 font-bold" value={newMilestone.reward_amount} onChange={(e) => setNewMilestone({...newMilestone, reward_amount: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold tracking-widest">Description</Label>
                        <Textarea placeholder="Instructions..." className="bg-black/40 border-white/5 text-xs h-24" value={newMilestone.description} onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button className="w-full rounded-xl bg-primary font-bold" onClick={handleAddMilestone} disabled={isAddingSubtask}>
                        {isAddingSubtask ? <Loader2 className="w-4 h-4 animate-spin" /> : "Deploy Milestone"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
             </div>
             <div className="space-y-3">
                {mgmt.subtasks && mgmt.subtasks.length > 0 ? mgmt.subtasks.map((st: any, i: number) => (
                  <div key={st.id || i} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-white/5">{i+1}</div>
                        <div>
                          <p className="text-xs font-bold text-white">{st.title}</p>
                          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">{st.approved || 0} Approved</p>
                        </div>
                     </div>
                     <div className="text-right">
                       <Badge variant="outline" className="text-[9px] font-bold border-white/10">{st.reward_amount} SAT</Badge>
                     </div>
                  </div>
                )) : (
                  <div className="text-center py-4 border border-dashed border-white/10 rounded-xl">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">No milestones defined</p>
                  </div>
                )}
             </div>
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

function StatCard({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    emerald: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  };
  return (
    <Card className="glass-card border-none">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors[color])}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
            <h3 className="text-2xl font-headline font-bold">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

