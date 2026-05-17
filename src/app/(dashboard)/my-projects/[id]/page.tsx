
"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Users, 
  CheckCircle, 
  Zap, 
  Briefcase, 
  AlertCircle, 
  FileText, 
  Loader2,
  Clock,
  Shield,
  TrendingUp,
  ExternalLink,
  Package,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProjectService } from '@/services/project-service';
import { ProjectDetail, Bid } from '@/lib/types';
import { StarRating } from '@/components/ui/star-rating';

export default function ProjectWorkspacePage() {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [activeTab, setActiveTab] = useState('applicants');
  const [isLoading, setIsLoading] = useState(true);
  const [isActioning, setIsActioning] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchProject() {
      setIsLoading(true);
      try {
        const res = await ProjectService.getProject(id as string);
        if (res.data) {
          setProject(res.data);
          if (res.data.status === 'in_progress') setActiveTab('workspace');
        }
      } catch (err) {
        toast({ variant: "destructive", title: "Objective Lost", description: "Protocol link severed." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  const formatBudget = (budget: any) => {
    if (!budget) return 'TBD';
    if (typeof budget === 'string') return budget;
    if (typeof budget === 'object' && 'min' in budget) {
      return `${budget.min.toLocaleString()} - ${budget.max.toLocaleString()} SAT`;
    }
    return 'TBD';
  };

  async function handleHire(candidateName: string, bidId: string) {
    if (!project) return;
    setIsActioning(bidId);
    try {
      const res = await ProjectService.hireNode(project.id, bidId);
      if (res.data) {
        toast({
          title: "Node Selected",
          description: `${candidateName} has been commissioned. Payout locked in escrow.`,
        });
        const refresh = await ProjectService.getProject(project.id);
        if (refresh.data) {
          setProject(refresh.data);
          setActiveTab('workspace');
        }
      } else {
        toast({ variant: "destructive", title: "Hire Error", description: "Escrow initialization failed." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Network Error", description: "Communication with protocol gateway timed out." });
    } finally {
      setIsActioning(null);
    }
  }

  if (isLoading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Project Not Found</h2>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/my-projects">Management Hub</Link>
        </Button>
      </div>
    );
  }

  const totalMilestoneAmount = project.milestones?.reduce((acc, m) => acc + (m.amount || 0), 0) || 0;
  const completedMilestoneAmount = project.milestones?.filter(m => m.status === 'paid').reduce((acc, m) => acc + (m.amount || 0), 0) || 0;
  const progressPercent = totalMilestoneAmount > 0 ? (completedMilestoneAmount / totalMilestoneAmount) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link href="/my-projects" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-bold uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3" /> Mission Hub
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-headline font-bold">{project.title}</h1>
            <Badge className={cn(
              "border-none uppercase text-[10px] tracking-widest font-bold",
              project.status === 'in_progress' ? "bg-emerald-400/10 text-emerald-400" : 
              project.status === 'open' ? "bg-primary/10 text-primary" : "bg-secondary/20 text-secondary"
            )}>
              {project.status?.replace('_', ' ') || 'OPEN'}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl border-white/5 gap-2 h-10 px-4 font-bold">
            <ExternalLink className="w-4 h-4" /> View Public
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-card border border-white/5 p-1 h-auto rounded-2xl w-fit mb-6">
              <TabsTrigger value="applicants" className="rounded-xl px-6 py-2 data-[state=active]:bg-secondary font-bold gap-2">
                <Users className="w-4 h-4" /> Node Signals ({project.total_bids || project.bids?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="workspace" className="rounded-xl px-6 py-2 data-[state=active]:bg-secondary font-bold gap-2">
                <Package className="w-4 h-4" /> Workspace
              </TabsTrigger>
              <TabsTrigger value="details" className="rounded-xl px-6 py-2 data-[state=active]:bg-secondary font-bold gap-2">
                <FileText className="w-4 h-4" /> Technical Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applicants" className="space-y-4 mt-0">
              {Array.isArray(project.bids) && project.bids.length > 0 ? (
                project.bids.map((bid: Bid) => (
                  <Card key={bid.id} className={cn(
                    "glass-card border-none transition-all relative overflow-hidden",
                    bid.is_boosted ? "ring-2 ring-secondary/30" : ""
                  )}>
                    {bid.is_boosted && (
                      <div className="absolute top-0 right-0 p-2 bg-secondary text-[8px] font-bold uppercase tracking-widest text-white rounded-bl-xl flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Priority Signal
                      </div>
                    )}
                    <CardContent className="p-6 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <Avatar className="w-14 h-14 border-2 border-white/10 rounded-2xl">
                            <AvatarImage src={`https://picsum.photos/seed/${bid.user}/100/100`} />
                            <AvatarFallback>{bid.user_display?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-lg">{bid.user_display}</h4>
                              <StarRating reputation={bid.user_reputation || 0} />
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Signal: <span className="text-secondary">{(bid.amount || 0).toLocaleString()} SAT</span></p>
                              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Time: {bid.timeline}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {project.status === 'open' && (
                            <Button 
                              size="sm" 
                              className="rounded-xl bg-emerald-500 hover:bg-emerald-600 h-10 px-6 font-bold shadow-lg shadow-emerald-500/20"
                              onClick={() => handleHire(bid.user_display, bid.id)}
                              disabled={isActioning === bid.id}
                            >
                              {isActioning === bid.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Commission Node'}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="bg-background/40 p-4 rounded-xl border border-white/5">
                        <p className="text-sm text-muted-foreground italic leading-relaxed">"{bid.proposal_text}"</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-20 text-center glass-card rounded-3xl border-dashed">
                  <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No active node signals detected.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="workspace" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card border-none bg-gradient-to-br from-emerald-500/5 to-transparent">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5" /> L2 Settlement Escrow
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-headline font-bold text-emerald-400">{formatBudget(project.budget)}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest">
                        <span className="text-muted-foreground">Verification Path</span>
                        <span className="text-emerald-400">{Math.round(progressPercent)}% Confirmed</span>
                      </div>
                      <Progress value={progressPercent} className="h-1.5 bg-white/5" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> Objective Deadline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold text-white">
                      {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">Multi-sig Expiry Protocol</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                    <Package className="w-5 h-5 text-secondary" /> Mission Milestones
                  </h3>
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest text-muted-foreground">{project.delivery_count} technical deliveries</Badge>
                </div>
                <div className="space-y-3">
                  {Array.isArray(project.milestones) && project.milestones.length > 0 ? project.milestones.map((m, i) => (
                    <div key={m.id} className="flex items-center justify-between p-5 glass-card rounded-2xl border-white/5 group hover:border-secondary/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border transition-colors",
                          m.status === 'paid' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                          m.status === 'submitted' ? "bg-secondary/10 text-secondary border-secondary/20 animate-pulse" :
                          "bg-white/5 text-muted-foreground border-white/5"
                        )}>
                          {m.status === 'paid' ? <CheckCircle className="w-5 h-5" /> : i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{m.title}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{m.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-headline font-bold text-sm">{(m.amount || 0).toLocaleString()} SAT</p>
                        <Badge variant="ghost" className={cn(
                          "text-[9px] uppercase font-bold tracking-widest px-0 h-auto",
                          m.status === 'paid' ? "text-emerald-400" : m.status === 'submitted' ? "text-secondary" : "text-muted-foreground"
                        )}>{m.status}</Badge>
                      </div>
                    </div>
                  )) : (
                    <div className="p-10 text-center glass-card rounded-2xl border-dashed">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">No technical milestones propagated.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card className="glass-card border-none p-8">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-headline font-bold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" /> Mission Documentation
                    </h3>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {project.requirements && (
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Verification Parameters
                      </h3>
                      <div className="bg-background/60 p-6 rounded-2xl border border-white/5">
                        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {project.requirements}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Required Node Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {(project.skills || []).map(skill => (
                        <Badge key={skill.id} variant="secondary" className="bg-white/5 text-muted-foreground border-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none bg-gradient-to-br from-card to-background rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mission Control</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground flex items-center gap-2"><Zap className="w-4 h-4 text-secondary" /> Yield Range</span>
                  <span className="text-white text-right">{formatBudget(project.budget)}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> Class</span>
                  <span className="text-white capitalize">{project.experience_level} Level</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400" /> Cycle</span>
                  <span className="text-white">{project.estimated_duration_days || '--'} Days</span>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-2">
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.2em]">Client Node</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-bold text-sm text-white">{project.client_name}</span>
                </div>
              </div>

              {project.status === 'open' && (
                <div className="pt-4 space-y-3">
                  <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/20">
                    <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                      Evaluating node signals. High-reputation nodes preferred.
                    </p>
                  </div>
                  <Button className="w-full h-12 rounded-xl bg-secondary neon-glow-secondary font-bold uppercase tracking-widest text-xs">
                    Broadcast Node Query
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-none p-8 rounded-[2rem] text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mx-auto">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="font-headline font-bold">Node Yield</h4>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
              Technical yields are settled instantly on L2 upon milestone verification.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
