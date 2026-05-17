"use client"

import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { mockProjects, mockProfile } from '@/lib/mock-data';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  Shield, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Trophy,
  Zap,
  Briefcase,
  AlertCircle,
  Plus,
  PlayCircle,
  Lock,
  MoreVertical,
  FileText,
  Rocket,
  Sparkles,
  DollarSign,
  Activity,
  Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProjectWorkspacePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('applicants');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const project = useMemo(() => {
    return mockProjects.find(p => p.id === id);
  }, [id]);

  if (!mounted) return null;

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

  function handleHire(candidateName: string) {
    toast({
      title: "Node Selected",
      description: `${candidateName} has been commissioned. Payout locked in escrow.`,
    });
  }

  const totalMilestoneAmount = project.milestones?.reduce((acc, m) => acc + m.amount, 0) || 0;
  const completedMilestoneAmount = project.milestones?.filter(m => m.status === 'paid').reduce((acc, m) => acc + m.amount, 0) || 0;
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
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-xl border-white/5 gap-2 h-11 font-bold">
            <Settings2 className="w-4 h-4" /> Management
          </Button>
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
              {project.bids?.length ? (
                project.bids?.sort((a, b) => (b.is_boosted ? 1 : 0) - (a.is_boosted ? 1 : 0)).map((bid) => (
                  <Card key={bid.id} className={cn(
                    "glass-card border-none transition-all relative overflow-hidden",
                    bid.is_boosted ? "ring-2 ring-secondary/30 shadow-[0_0_20px_rgba(60,98,255,0.15)]" : "hover:border-secondary/20"
                  )}>
                    {bid.is_boosted && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-secondary text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 uppercase tracking-widest">
                          <Rocket className="w-2.5 h-2.5" /> Boosted Proposal
                        </div>
                      </div>
                    )}
                    <CardContent className="p-6 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <Avatar className="w-14 h-14 border-2 border-white/10 rounded-2xl">
                            <AvatarImage src={`https://picsum.photos/seed/${bid.user}/100/100`} />
                            <AvatarFallback>{bid.user_display[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-lg">{bid.user_display}</h4>
                              <Badge className={cn(
                                "text-[9px] font-bold uppercase px-2",
                                bid.membership_tier === 'elite' ? "bg-amber-500/10 text-amber-500" :
                                bid.membership_tier === 'pro' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                              )}>
                                {bid.membership_tier} Node
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                               <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                                <Trophy className="w-3 h-3" /> {bid.user_reputation} REP
                              </div>
                              <p className="text-[10px] text-muted-foreground font-bold">Bid: <span className="text-secondary">{bid.amount.toLocaleString()} SAT</span></p>
                              <p className="text-[10px] text-muted-foreground font-bold">Delivery: {bid.timeline}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button variant="outline" size="sm" className="rounded-xl h-10 border-white/5 font-bold gap-2">
                            <MessageSquare className="w-4 h-4" /> Message
                          </Button>
                          <Button 
                            size="sm" 
                            className="rounded-xl bg-emerald-500 hover:bg-emerald-600 h-10 px-6 font-bold"
                            onClick={() => handleHire(bid.user_display)}
                          >
                            Commission Node
                          </Button>
                        </div>
                      </div>

                      <div className="bg-black/40 rounded-2xl p-4 border border-white/5 relative group">
                        <p className="text-sm text-muted-foreground italic leading-relaxed">
                          "{bid.proposal_text}"
                        </p>
                      </div>

                      <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-widest text-muted-foreground border-t border-white/5 pt-4">
                        <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-emerald-400" /> Identity Verified</span>
                        <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-secondary" /> L2 Settlement Ready</span>
                        <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-primary" /> Premium Signal</span>
                      </div>
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
                      <Badge variant="outline" className="border-emerald-400/20 text-emerald-400">FUNDED</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Milestone Progress</span>
                        <span className="text-emerald-400">{Math.round(progressPercent)}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2 bg-white/5" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Active Node</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 rounded-xl">
                      <AvatarImage src={`https://picsum.photos/seed/hired/100/100`} />
                      <AvatarFallback>W</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-bold">{project.hired_name}</h4>
                      <Badge className="text-[9px] bg-primary/10 text-primary">Hired Professional</Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white/5"><MessageSquare className="w-4 h-4" /></Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-headline font-bold">Mission Milestones</h3>
                  <Button variant="ghost" size="sm" className="text-primary font-bold gap-2">
                    <Plus className="w-4 h-4" /> Add Milestone
                  </Button>
                </div>
                <div className="space-y-3">
                  {project.milestones?.map((m, i) => (
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
                          <p className="text-[10px] text-muted-foreground line-clamp-1">{m.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{m.amount.toLocaleString()} SAT</p>
                        <Badge variant="ghost" className={cn(
                          "text-[9px] uppercase font-bold px-0",
                          m.status === 'paid' ? "text-emerald-400" : "text-muted-foreground"
                        )}>
                          {m.status}
                        </Badge>
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

                  <div className="space-y-4">
                    <h3 className="text-lg font-headline font-bold flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-400" /> Protocol Requirements
                    </h3>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap italic">
                      {project.requirements || "No specific technical requirements documented."}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-headline font-bold flex items-center gap-2">
                      <Activity className="w-5 h-5 text-secondary" /> Expertise Required
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map(skill => (
                        <Badge key={skill.id} className="bg-white/5 text-muted-foreground border-white/5 px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]">
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
          <Card className="glass-card border-none bg-gradient-to-br from-card to-background">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Mission Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Signal Density</p>
                  <p className="text-2xl font-bold">{project.bids_count}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Reputation Pool</p>
                  <p className="text-2xl font-bold">Avg {project.avg_bid > 0 ? 94 : 0}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2 font-bold"><Zap className="w-4 h-4" /> Locked Budget</span>
                  <span className="font-bold text-secondary">{project.budget}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2 font-bold"><Briefcase className="w-4 h-4" /> Budget Class</span>
                  <span className="font-bold capitalize">{project.budget_type} Price</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2 font-bold"><Trophy className="w-4 h-4" /> Expert Class</span>
                  <span className="font-bold capitalize">{project.experience_level}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="glass-card p-8 rounded-3xl border-primary/20 text-center space-y-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
            <Lock className="w-10 h-10 text-emerald-400 mx-auto relative z-10" />
            <div className="relative z-10">
              <h4 className="font-headline font-bold text-lg">Multi-sig Secure</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Project funds are held in a 2-of-3 multi-sig L2 escrow. Releases are triggered automatically upon milestone approval.
              </p>
            </div>
            <Button variant="outline" className="w-full rounded-xl border-white/10 font-bold relative z-10 h-12 text-xs uppercase tracking-widest">
              Review Protocol Rules
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
