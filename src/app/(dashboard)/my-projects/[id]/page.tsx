
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
  Calendar,
  Send,
  Github,
  Globe,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Trophy,
  History,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProjectService } from '@/services/project-service';
import { ProfileService } from '@/services/profile-service';
import { ProjectDetail, Bid, Milestone, User } from '@/lib/types';
import { StarRating } from '@/components/ui/star-rating';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

export default function ProjectWorkspacePage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [me, setMe] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('workspace');
  const [isLoading, setIsLoading] = useState(true);
  const [isActioning, setIsActioning] = useState<string | null>(null);
  
  // Delivery Form State
  const [deliveryData, setDeliveryData] = useState({ message: '', github_url: '', live_url: '' });

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const [projRes, profRes] = await Promise.all([
          ProjectService.getProject(id as string),
          ProfileService.getMyProfile()
        ]);
        
        if (projRes.data) {
          setProject(projRes.data);
          if (projRes.data.status === 'in_progress' || projRes.data.status === 'completed') {
            setActiveTab('workspace');
          }
        }
        if (profRes.data) setMe(profRes.data);
      } catch (err) {
        toast({ variant: "destructive", title: "Protocol Link Severed", description: "Could not sync workspace data." });
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [id]);

  const refreshProject = async () => {
    const res = await ProjectService.getProject(id as string);
    if (res.data) setProject(res.data);
  };

  const isClient = me?.id.toString() === project?.creator?.toString() || me?.email === project?.creator;
  const isFreelancer = me?.id.toString() === project?.hired_freelancer?.toString() || me?.display_name === project?.hired_name;

  async function handleHire(candidateName: string, bidId: string) {
    if (!project) return;
    setIsActioning(bidId);
    try {
      const res = await ProjectService.hireNode(project.id, bidId);
      if (res.data) {
        toast({ title: "Node Commissioned", description: `${candidateName} selected for mission. Escrow locked.` });
        await refreshProject();
        setActiveTab('workspace');
      } else {
        toast({ variant: "destructive", title: "Escrow Error", description: res.error || "Failed to initialize multi-sig." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Network Error", description: "Gateway timeout." });
    } finally {
      setIsActioning(null);
    }
  }

  async function handleDeliver(milestoneId: string) {
    if (!project || !deliveryData.message) return;
    setIsActioning(milestoneId);
    try {
      const res = await ProjectService.deliverMilestone(project.id, {
        milestone_id: milestoneId,
        ...deliveryData
      });
      if (res.data) {
        toast({ title: "Proof Propagated", description: "Technical delivery sent to client for review." });
        setDeliveryData({ message: '', github_url: '', live_url: '' });
        await refreshProject();
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Delivery Error", description: "Failed to propagate proof signal." });
    } finally {
      setIsActioning(null);
    }
  }

  async function handleReview(deliveryId: string, action: 'approve' | 'revision') {
    if (!project) return;
    setIsActioning(deliveryId);
    try {
      const res = action === 'approve' 
        ? await ProjectService.approveDelivery(project.id, deliveryId)
        : await ProjectService.requestRevision(project.id, deliveryId);
      
      if (res.data) {
        toast({ 
          title: action === 'approve' ? "Delivery Verified" : "Revision Signal Sent", 
          description: action === 'approve' ? "Escrow funds authorized for release." : "Worker node notified of technical feedback."
        });
        await refreshProject();
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Review Error", description: "Gateway timeout during audit." });
    } finally {
      setIsActioning(null);
    }
  }

  async function handleFinalize() {
    if (!project) return;
    setIsActioning('finalize');
    try {
      const res = await ProjectService.completeProject(project.id);
      if (res.data) {
        toast({ title: "Protocol Finalized", description: "Project status updated to Completed across the network." });
        await refreshProject();
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Finalization Error", description: "Could not propagate completion signal." });
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
        <AlertCircle className="w-12 h-12 text-muted-foreground/20" />
        <h2 className="text-2xl font-bold">Project Signal Lost</h2>
        <Button asChild variant="outline" className="rounded-xl"><Link href="/my-projects">Management Hub</Link></Button>
      </div>
    );
  }

  const activeMilestone = project.milestones?.find(m => m.status === 'active' || m.status === 'submitted');
  const allMilestonesApproved = project.milestones?.every(m => m.status === 'approved' || m.status === 'paid');
  const totalAmount = project.milestones?.reduce((acc, m) => acc + (m.amount || 0), 0) || 0;
  const approvedAmount = project.milestones?.filter(m => m.status === 'approved' || m.status === 'paid').reduce((acc, m) => acc + (m.amount || 0), 0) || 0;
  const progressPercent = totalAmount > 0 ? (approvedAmount / totalAmount) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link href={isClient ? "/my-projects" : "/my-contributions"} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-bold uppercase tracking-widest">
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
          {isClient && project.status === 'in_progress' && allMilestonesApproved && (
            <Button 
              className="rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold h-10 px-6 gap-2"
              onClick={handleFinalize}
              disabled={isActioning === 'finalize'}
            >
              {isActioning === 'finalize' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} 
              Finalize Project
            </Button>
          )}
          <Button variant="outline" size="sm" className="rounded-xl border-white/5 gap-2 h-10 px-4 font-bold">
            <ExternalLink className="w-4 h-4" /> Public Trace
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-card border border-white/5 p-1 h-auto rounded-2xl w-fit mb-8">
              {isClient && project.status === 'open' && (
                <TabsTrigger value="applicants" className="rounded-xl px-6 py-2 data-[state=active]:bg-secondary font-bold gap-2">
                  <Users className="w-4 h-4" /> Node Signals ({project.bids?.length || 0})
                </TabsTrigger>
              )}
              <TabsTrigger value="workspace" className="rounded-xl px-6 py-2 data-[state=active]:bg-secondary font-bold gap-2">
                <Package className="w-4 h-4" /> Workforce Workbench
              </TabsTrigger>
              <TabsTrigger value="details" className="rounded-xl px-6 py-2 data-[state=active]:bg-secondary font-bold gap-2">
                <FileText className="w-4 h-4" /> Mission Specs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applicants" className="space-y-4 mt-0">
              {project.bids?.map((bid: Bid) => (
                <Card key={bid.id} className={cn(
                  "glass-card border-none transition-all relative overflow-hidden group",
                  bid.is_boosted ? "ring-2 ring-secondary/30" : ""
                )}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                      <div className="flex gap-4">
                        <Avatar className="w-14 h-14 border-2 border-white/10 rounded-2xl">
                          <AvatarImage src={`https://picsum.photos/seed/${bid.user}/100/100`} />
                          <AvatarFallback>{bid.user_display?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg">{bid.user_display}</h4>
                            <StarRating reputation={bid.user_reputation || 0} />
                          </div>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            <span className="text-secondary">{bid.amount?.toLocaleString()} SAT</span>
                            <span>{bid.timeline}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="rounded-xl bg-emerald-500 hover:bg-emerald-600 h-11 px-8 font-bold"
                        onClick={() => handleHire(bid.user_display, bid.id)}
                        disabled={isActioning === bid.id}
                      >
                        {isActioning === bid.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Commission Node'}
                      </Button>
                    </div>
                    <div className="mt-6 p-4 bg-background/40 rounded-2xl border border-white/5">
                      <p className="text-sm text-muted-foreground leading-relaxed italic">"{bid.proposal_text}"</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="workspace" className="space-y-8 mt-0">
              {/* Workforce side: Delivery Submission */}
              {isFreelancer && activeMilestone && activeMilestone.status === 'active' && (
                <Card className="glass-card border-none rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent">
                  <CardHeader className="p-8 pb-0">
                    <CardTitle className="font-headline text-xl flex items-center gap-2">
                      <Send className="w-5 h-5 text-primary" /> Technical Delivery Signal
                    </CardTitle>
                    <CardDescription>Submit proof of completion for: <strong>{activeMilestone.title}</strong></CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Work Log / Documentation</Label>
                        <Textarea 
                          placeholder="Detail your technical implementation..." 
                          className="bg-black/40 border-white/5 rounded-2xl min-h-[120px]"
                          value={deliveryData.message}
                          onChange={(e) => setDeliveryData({...deliveryData, message: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">GitHub Propagation (URL)</Label>
                          <div className="relative">
                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              placeholder="https://github.com/..." 
                              className="bg-black/40 border-white/5 pl-10 h-12 rounded-xl" 
                              value={deliveryData.github_url}
                              onChange={(e) => setDeliveryData({...deliveryData, github_url: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Live Interface (URL)</Label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              placeholder="https://..." 
                              className="bg-black/40 border-white/5 pl-10 h-12 rounded-xl" 
                              value={deliveryData.live_url}
                              onChange={(e) => setDeliveryData({...deliveryData, live_url: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full h-12 rounded-xl bg-primary neon-glow-primary font-bold"
                      onClick={() => handleDeliver(activeMilestone.id)}
                      disabled={isActioning === activeMilestone.id || !deliveryData.message}
                    >
                      {isActioning === activeMilestone.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Propagate Technical Proof
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Client side: Review Submission */}
              {isClient && activeMilestone && activeMilestone.status === 'submitted' && (
                <Card className="glass-card border-none rounded-[2rem] bg-gradient-to-br from-secondary/10 to-transparent">
                  <CardHeader className="p-8 pb-0">
                    <CardTitle className="font-headline text-xl flex items-center gap-2">
                      <Target className="w-5 h-5 text-secondary" /> Technical Review Cycle
                    </CardTitle>
                    <CardDescription>Verify proof for milestone: <strong>{activeMilestone.title}</strong></CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                       <p className="text-sm text-white/90 leading-relaxed font-mono">"{activeMilestone.description}"</p>
                       <div className="flex gap-4">
                          <Button variant="outline" size="sm" className="h-8 rounded-lg border-white/10 gap-2"><Github className="w-3 h-3" /> View Code</Button>
                          <Button variant="outline" size="sm" className="h-8 rounded-lg border-white/10 gap-2"><Globe className="w-3 h-3" /> View Live</Button>
                       </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="ghost" className="flex-1 rounded-xl text-destructive hover:bg-destructive/10 font-bold h-12 gap-2" onClick={() => handleReview('pending_id', 'revision')}>
                         <XCircle className="w-4 h-4" /> Request Revision
                      </Button>
                      <Button className="flex-[2] rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold h-12 gap-2" onClick={() => handleReview('pending_id', 'approve')}>
                         <CheckCircle2 className="w-4 h-4" /> Authorize Settlement
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-headline font-bold flex items-center gap-2">
                    <Package className="w-6 h-6 text-secondary" /> Protocol Roadmap
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-bold border-white/10">{project.milestones?.length || 0} Objective Signals</Badge>
                </div>
                <div className="space-y-3">
                  {project.milestones?.map((m: Milestone, i: number) => (
                    <div key={m.id} className="p-6 glass-card rounded-2xl flex items-center justify-between group hover:border-secondary/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm border",
                          m.status === 'paid' || m.status === 'approved' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          m.status === 'submitted' ? "bg-secondary/10 text-secondary border-secondary/20 animate-pulse" :
                          m.status === 'active' ? "bg-primary/10 text-primary border-primary/20" :
                          "bg-white/5 text-muted-foreground border-white/5"
                        )}>
                          {m.status === 'paid' || m.status === 'approved' ? <CheckCircle className="w-6 h-6" /> : i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg">{m.title}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{m.amount?.toLocaleString()} SAT Signal</p>
                        </div>
                      </div>
                      <Badge className={cn(
                        "uppercase text-[9px] font-bold tracking-widest border-none px-3",
                        m.status === 'active' ? "bg-primary/10 text-primary" :
                        m.status === 'submitted' ? "bg-secondary/20 text-secondary" :
                        m.status === 'approved' || m.status === 'paid' ? "bg-emerald-400/10 text-emerald-400" :
                        "bg-white/5 text-muted-foreground"
                      )}>
                        {m.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-0">
              <Card className="glass-card border-none p-10 rounded-[2rem]">
                 <div className="space-y-10">
                    <div className="space-y-4">
                       <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary flex items-center gap-2"><FileText className="w-4 h-4" /> Technical Scope</h3>
                       <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{project.description}</p>
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary flex items-center gap-2"><Shield className="w-4 h-4" /> Strategic Requirements</h3>
                       <div className="bg-black/40 border border-white/5 rounded-3xl p-8 font-mono text-sm leading-relaxed text-white/70">
                          {project.requirements}
                       </div>
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">Node Expertise</h3>
                       <div className="flex flex-wrap gap-2">
                          {project.skills?.map((s: any) => (
                            <Badge key={s.id || s.name} variant="secondary" className="bg-white/5 text-white border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                               {s.name}
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
          <Card className="glass-card border-none rounded-[2.5rem] bg-gradient-to-br from-card to-background overflow-hidden border-secondary/20">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Escrow Protocol</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-8">
              <div className="text-center space-y-1">
                 <h2 className="text-4xl font-headline font-bold text-emerald-400">{approvedAmount.toLocaleString()} / {totalAmount.toLocaleString()}</h2>
                 <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.3em]">SAT Settled on L2</p>
              </div>
              
              <div className="space-y-2">
                 <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">Verification Path</span>
                    <span className="text-emerald-400">{Math.round(progressPercent)}% Confirmed</span>
                 </div>
                 <Progress value={progressPercent} className="h-1.5 bg-white/5" />
              </div>

              <div className="space-y-5 border-t border-white/5 pt-8">
                 <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Deadline</span>
                    <span className="text-white">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</span>
                 </div>
                 <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground flex items-center gap-2"><Trophy className="w-3.5 h-3.5" /> Experience</span>
                    <span className="text-white capitalize">{project.experience_level} Class</span>
                 </div>
              </div>

              <div className="h-px bg-white/5" />
              
              <div className="space-y-4">
                 <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.2em]">Platform Entities</p>
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                       <p className="text-[8px] text-muted-foreground uppercase font-bold">Employer Node</p>
                       <p className="text-xs font-bold text-white truncate max-w-[120px]">{project.client_name}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] text-muted-foreground uppercase font-bold">Specialist Node</p>
                       <p className="text-xs font-bold text-secondary truncate max-w-[120px]">{project.hired_name || 'Pending'}</p>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none p-8 rounded-[2rem] text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="font-headline font-bold">Escrow Safety</h4>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
              SAT yields are settled instantly on L2 upon verified milestone approval.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
