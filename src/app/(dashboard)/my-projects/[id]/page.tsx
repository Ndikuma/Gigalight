
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
  Sparkles
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

  const milestones = [
    { id: 1, title: 'UI Wireframes & Architecture', status: 'completed', amount: '15,000 SAT' },
    { id: 2, title: 'Core API Integration', status: 'in_progress', amount: '25,000 SAT' },
    { id: 3, title: 'Final QA & Deployment', status: 'locked', amount: '10,000 SAT' },
  ];

  function handleHire(candidateName: string) {
    toast({
      title: "Node Selected",
      description: `${candidateName} has been commissioned. Payout locked in escrow.`,
    });
  }

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
              project.status === 'in_progress' ? "bg-emerald-400/10 text-emerald-400" : "bg-secondary/20 text-secondary"
            )}>
              {project.status.replace('_', ' ')}
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
              {project.bids?.sort((a, b) => (b.isBoosted ? 1 : 0) - (a.isBoosted ? 1 : 0)).map((bid) => (
                <Card key={bid.id} className={cn(
                  "glass-card border-none transition-all relative overflow-hidden",
                  bid.isBoosted ? "ring-2 ring-secondary/30" : "hover:border-secondary/20"
                )}>
                  {bid.isBoosted && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-secondary text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                        <Rocket className="w-2.5 h-2.5" /> BOOSTED PROPOSAL
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <Avatar className="w-12 h-12 border-2 border-white/10">
                          <AvatarImage src={`https://picsum.photos/seed/${bid.userId}/100/100`} />
                          <AvatarFallback>{bid.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg">{bid.userName}</h4>
                            <Badge className={cn(
                              "text-[9px] font-bold uppercase",
                              bid.membershipTier === 'elite' ? "bg-amber-500/10 text-amber-500" :
                              bid.membershipTier === 'pro' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                            )}>
                              {bid.membershipTier} Node
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                             <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                              <Trophy className="w-3 h-3" /> {bid.userReputation} REP
                            </div>
                            <p className="text-[10px] text-muted-foreground font-bold">Bid: <span className="text-secondary">{bid.amount.toLocaleString()} SAT</span></p>
                            <p className="text-[10px] text-muted-foreground font-bold">Delivery: {bid.timeline}</p>
                          </div>
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
                          Commission Node
                        </Button>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-xl p-4 border border-white/5 relative">
                      <p className="text-sm text-muted-foreground italic leading-relaxed">
                        "{bid.proposalText}"
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-widest text-muted-foreground border-t border-white/5 pt-4">
                      <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-emerald-400" /> Identity Verified</span>
                      <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-secondary" /> L2 Settlement</span>
                      <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-primary" /> Premium Signal</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="workspace" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card border-none bg-gradient-to-br from-emerald-500/5 to-transparent">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Settlement Escrow</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-emerald-400">40,000 SAT</h3>
                      <Badge variant="outline" className="border-emerald-400/20 text-emerald-400">FUNDED</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Milestone Progress</span>
                        <span className="text-emerald-400">33%</span>
                      </div>
                      <Progress value={33} className="h-2 bg-white/5" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Active Node</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={`https://picsum.photos/seed/hired/100/100`} />
                      <AvatarFallback>W</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-bold">JungleNode</h4>
                      <Badge className="text-[9px] bg-primary/10 text-primary">Pro Node</Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MessageSquare className="w-4 h-4" /></Button>
                  </CardContent>
                </Card>
              </div>
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
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Total Signals</p>
                  <p className="text-2xl font-bold">{project.bids?.length || 0}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Reputation Pool</p>
                  <p className="text-2xl font-bold">Avg 92</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2 font-bold"><Zap className="w-4 h-4" /> Locked Budget</span>
                  <span className="font-bold text-secondary">{project.budgetMin.toLocaleString()} SAT</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2 font-bold"><Shield className="w-4 h-4" /> Network Status</span>
                  <Badge variant="outline" className="border-emerald-400/20 text-emerald-400 text-[9px] font-bold">SECURE</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
