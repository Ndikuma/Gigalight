"use client"

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { mockProjects, mockSubmissions } from '@/lib/mock-data';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  Shield, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Trophy,
  ExternalLink,
  Zap,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ProjectWorkspacePage() {
  const { id } = useParams();
  
  const project = useMemo(() => {
    return mockProjects.find(p => p.id === id);
  }, [id]);

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

  function handleHire(candidateName: string) {
    toast({
      title: "Hiring Successful",
      description: `${candidateName} has been selected for this project. Funds moved to escrow.`,
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link href="/my-projects" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-bold uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3" /> Management Hub
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-headline font-bold">{project.title}</h1>
            <Badge className="bg-secondary/20 text-secondary border-none uppercase text-[10px]">
              {project.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-white/10">Edit Listing</Button>
          <Button variant="destructive" className="rounded-xl">Cancel Project</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="applicants" className="w-full">
            <TabsList className="bg-card border border-white/5 p-1 h-auto rounded-2xl w-fit mb-6">
              <TabsTrigger value="applicants" className="rounded-xl px-6 py-2 data-[state=active]:bg-secondary">
                Candidates ({project.bids?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="milestones" className="rounded-xl px-6 py-2 data-[state=active]:bg-secondary">
                Workspaces
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-xl px-6 py-2 data-[state=active]:bg-secondary">
                Details
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

            <TabsContent value="milestones">
              <Card className="glass-card border-none p-12 text-center">
                <Clock className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                <h3 className="font-bold text-lg">No active workspace</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">Hire a candidate first to unlock multi-sig escrow and milestone tracking.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="glass-card border-none bg-gradient-to-br from-card to-background">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Project Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Views</p>
                  <p className="text-2xl font-bold">842</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Watchers</p>
                  <p className="text-2xl font-bold">12</p>
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

          <div className="p-6 glass-card rounded-3xl border-primary/20 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Escrow Protection</h4>
                <p className="text-[10px] text-muted-foreground">Secured by Satoshi-Layer 2</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Funds are held in a decentralized multi-sig address. Payouts are released incrementally as you approve milestones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
