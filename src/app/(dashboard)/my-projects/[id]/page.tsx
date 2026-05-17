
"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Users, 
  Shield, 
  CheckCircle, 
  MessageSquare, 
  Trophy,
  Zap,
  Briefcase,
  AlertCircle,
  Plus,
  FileText,
  Rocket,
  Sparkles,
  Activity,
  Settings2,
  Loader2
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
import { ProjectDetail } from '@/lib/types';

export default function ProjectWorkspacePage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [activeTab, setActiveTab] = useState('applicants');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchProject() {
      setIsLoading(true);
      try {
        const res = await ProjectService.getProject(id as string);
        if (res.data) setProject(res.data);
      } catch (err) {
        toast({ variant: "destructive", title: "Objective Lost", description: "Protocol link severed." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  async function handleHire(candidateName: string, bidId: string) {
    if (!project) return;
    try {
      const res = await ProjectService.hireNode(project.id, bidId);
      if (res.data) {
        toast({
          title: "Node Selected",
          description: `${candidateName} has been commissioned. Payout locked in escrow.`,
        });
        // Refresh project data
        const refresh = await ProjectService.getProject(project.id);
        if (refresh.data) setProject(refresh.data);
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Hire Error", description: "Escrow initialization failed." });
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
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-card border border-white/5 p-1 h-auto rounded-2xl w-fit mb-6">
              <TabsTrigger value="applicants" className="rounded-xl px-6 py-2 data-[state=active]:bg-secondary font-bold">
                Nodes ({project.bids?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="workspace" className="rounded-xl px-6 py-2 data-[state=active]:bg-secondary font-bold">
                Workspace
              </TabsTrigger>
              <TabsTrigger value="details" className="rounded-xl px-6 py-2 data-[state=active]:bg-secondary font-bold">
                Technical Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applicants" className="space-y-4 mt-0">
              {Array.isArray(project.bids) && project.bids.length > 0 ? (
                project.bids.map((bid) => (
                  <Card key={bid.id} className={cn(
                    "glass-card border-none transition-all relative overflow-hidden",
                    bid.is_boosted ? "ring-2 ring-secondary/30" : ""
                  )}>
                    <CardContent className="p-6 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <Avatar className="w-14 h-14 border-2 border-white/10 rounded-2xl">
                            <AvatarFallback>{bid.user_display?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-lg">{bid.user_display}</h4>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-[10px] text-muted-foreground font-bold">Bid: <span className="text-secondary">{(bid.amount || 0).toLocaleString()} SAT</span></p>
                              <p className="text-[10px] text-muted-foreground font-bold">Timeline: {bid.timeline}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button 
                            size="sm" 
                            className="rounded-xl bg-emerald-500 hover:bg-emerald-600 h-10 px-6 font-bold"
                            onClick={() => handleHire(bid.user_display, bid.id)}
                          >
                            Commission Node
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic leading-relaxed">"{bid.proposal_text}"</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-20 text-center glass-card rounded-3xl border-dashed">
                  <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground font-bold">No proposal signals detected yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="workspace" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card border-none bg-gradient-to-br from-emerald-500/5 to-transparent">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Settlement Escrow</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-emerald-400">{project.budget}</h3>
                    </div>
                    <div className="space-y-2">
                      <Progress value={progressPercent} className="h-2 bg-white/5" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-headline font-bold">Mission Milestones</h3>
                <div className="space-y-3">
                  {Array.isArray(project.milestones) && project.milestones.map((m, i) => (
                    <div key={m.id} className="flex items-center justify-between p-5 glass-card rounded-2xl border-white/5 group">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs",
                          m.status === 'paid' ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-muted-foreground"
                        )}>
                          {m.status === 'paid' ? <CheckCircle className="w-5 h-5" /> : i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{m.title}</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{(m.amount || 0).toLocaleString()} SAT</p>
                        <Badge variant="ghost" className="text-[9px] uppercase font-bold">{m.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card className="glass-card border-none p-8">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-headline font-bold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" /> Technical Description
                    </h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {project.description}
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none bg-gradient-to-br from-card to-background">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Mission Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2 font-bold"><Zap className="w-4 h-4" /> Budget</span>
                  <span className="font-bold text-secondary">{project.budget}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2 font-bold"><Briefcase className="w-4 h-4" /> Class</span>
                  <span className="font-bold capitalize">{project.budget_type}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
