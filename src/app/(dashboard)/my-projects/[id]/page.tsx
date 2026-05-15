"use client"

import React, { useMemo, useState } from 'react';
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
  FileText
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
  
  const project = useMemo(() => {
    return mockProjects.find(p => p.id === id);
  }, [id]);

  const isOwner = project?.creatorId === mockProfile.id;

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Project Not Found</h2>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/my-projects">Back to Hub</Link>
        </Button>
      </div>
    );
  }

  const milestones = [
    { id: 1, title: 'UI Wireframes & Architecture', status: 'completed', amount: '15,000 SAT' },
    { id: 2, title: 'Core API Integration', status: 'in_progress', amount: '25,000 SAT' },
    { id: 3, title: 'Final QA & Deployment', status: 'locked', amount: '10,000 SAT' },
  ];

  function handleHire(candidateName: string) {
    toast({
      title: "Hiring Successful",
      description: `${candidateName} has been selected for this project. Funds moved to escrow.`,
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link href="/my-projects" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-bold uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3" /> Management Hub
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-headline font-bold">{project.title}</h1>
            <Badge className={cn(
              "border-none uppercase text-[10px] tracking-widest font-bold",
              project.status === 'in_progress' ? "bg-emerald-400/10 text-emerald-400" : "bg-secondary/20 text-secondary"
            )}>
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        {isOwner && (
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-white/10 h-11">Edit Listing</Button>
            <Button variant="destructive" className="rounded-xl h-11">Cancel Project</Button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-card border border-white/5 p-1 h-auto rounded-2xl w-fit mb-6">
              <TabsTrigger value="applicants" className="rounded-xl px-6 py-2 data-[state=active]:bg-secondary">
                Candidates ({project.bids?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="workspace" className="rounded-xl px-6 py-2 data-[state=active]:bg-secondary">
                Workspace
              </TabsTrigger>
              <TabsTrigger value="details" className="rounded-xl px-6 py-2 data-[state=active]:bg-secondary">
                Listing Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applicants" className="space-y-4 mt-0">
              {project.bids?.map((bid) => (
                <Card key={bid.id} className="glass-card border-none hover:border-secondary/20 transition-all">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <Avatar className="w-12 h-12 border-2 border-secondary/20">
                          <AvatarImage src={`https://picsum.photos/seed/${bid.userId}/100/100`} />
                          <AvatarFallback>{bid.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg">{bid.userName}</h4>
                            <div className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                              <Trophy className="w-3 h-3" /> {bid.userReputation} REP
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Bid: <span className="text-secondary font-bold">{bid.amount.toLocaleString()} SAT</span> • Delivery: <span className="font-bold">{bid.timeline}</span></p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-lg h-9 border-white/5">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="rounded-lg bg-emerald-500 hover:bg-emerald-600 h-9 font-bold"
                          onClick={() => handleHire(bid.userName)}
                        >
                          Hire Candidate
                        </Button>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                      <p className="text-sm text-muted-foreground italic leading-relaxed">
                        "{bid.proposalText}"
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-t border-white/5 pt-4">
                      <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-emerald-400" /> Identity Verified</span>
                      <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-primary" /> Multi-sig Ready</span>
                      <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-secondary" /> L2 Native</span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(!project.bids || project.bids.length === 0) && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground font-bold">Waiting for applicants...</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Your listing is live on the Gig Market.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="workspace" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card border-none bg-gradient-to-br from-emerald-500/5 to-transparent">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Escrow Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-emerald-400">40,000 SAT</h3>
                      <Badge variant="outline" className="border-emerald-400/20 text-emerald-400">LOCKED</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Milestone Progress</span>
                        <span className="text-emerald-400">33%</span>
                      </div>
                      <Progress value={33} className="h-2 bg-white/5" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Hired Talent</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={`https://picsum.photos/seed/hired/100/100`} />
                      <AvatarFallback>W</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-bold">JungleNode</h4>
                      <p className="text-xs text-muted-foreground">Senior Fullstack Dev</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MessageSquare className="w-4 h-4" /></Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-headline font-bold">Project Milestones</h3>
                  <Button variant="ghost" size="sm" className="text-primary gap-2 h-8">
                    <Plus className="w-3.5 h-3.5" /> Add Milestone
                  </Button>
                </div>
                <div className="space-y-2">
                  {milestones.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          m.status === 'completed' ? "bg-emerald-500/10 text-emerald-400" :
                          m.status === 'in_progress' ? "bg-primary/10 text-primary" : "bg-white/5 text-muted-foreground"
                        )}>
                          {m.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                           m.status === 'in_progress' ? <PlayCircle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{m.title}</p>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">{m.status.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-xs font-bold font-mono">{m.amount}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <Card className="glass-card border-none">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-headline font-bold">Detailed Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Experience</p>
                      <p className="font-bold capitalize">{project.experienceLevel}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Budget Type</p>
                      <p className="font-bold capitalize">{project.budgetType}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Network</p>
                      <p className="font-bold">Bitcoin L2</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Created</p>
                      <p className="font-bold">{new Date(project.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="glass-card border-none bg-gradient-to-br from-card to-background">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Listing Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Total Views</p>
                  <p className="text-2xl font-bold">1,245</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Proposals</p>
                  <p className="text-2xl font-bold">{project.bids?.length || 0}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><Zap className="w-4 h-4" /> Locked Budget</span>
                  <span className="font-bold text-secondary">{project.budgetMin.toLocaleString()} SAT</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><Briefcase className="w-4 h-4" /> Escrow Status</span>
                  <Badge variant="outline" className="border-emerald-400/20 text-emerald-400 text-[9px] font-bold">FUNDED</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none overflow-hidden">
            <CardHeader className="bg-white/5">
              <CardTitle className="text-sm font-headline flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button variant="outline" className="w-full justify-start gap-3 rounded-xl border-white/10 h-10">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Technical Specs.pdf
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 rounded-xl border-white/10 h-10">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Style Guide.zip
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
