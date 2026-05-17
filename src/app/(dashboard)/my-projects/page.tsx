"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Briefcase, 
  Settings2, 
  Users, 
  AlertCircle, 
  Layers,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProjectService } from '@/services/project-service';
import { TaskService } from '@/services/task-service';
import { ProjectDetail, Submission } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export default function ManagementHubPage() {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [projRes, subRes] = await Promise.all([
          ProjectService.getMyProjects(),
          TaskService.getMySubmissions()
        ]);
        if (projRes.data) setProjects(Array.isArray(projRes.data) ? projRes.data : []);
        if (subRes.data) setSubmissions(Array.isArray(subRes.data) ? subRes.data : []);
      } catch (e) {
        toast({ variant: "destructive", title: "Synchronization Lost", description: "Could not fetch your professional history." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatBudget = (budget: any) => {
    if (!budget) return 'TBD';
    if (typeof budget === 'string') return budget;
    if (typeof budget === 'object' && budget !== null) {
      if ('min' in budget && 'max' in budget) {
        return `${(budget.min || 0).toLocaleString()} - ${(budget.max || 0).toLocaleString()} SAT`;
      }
    }
    return 'TBD';
  };

  if (isLoading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold">Management Hub</h1>
          <p className="text-muted-foreground">Complete oversight of your global professional operations.</p>
        </div>
        <Button 
          asChild
          className="rounded-xl bg-secondary hover:brightness-110 gap-2 neon-glow-secondary font-bold h-12 px-6 shadow-lg shadow-secondary/20"
        >
          <Link href="/my-projects/create">
            <PlusCircle className="w-4 h-4" /> Post a Listing
          </Link>
        </Button>
      </header>

      <Tabs defaultValue="hiring" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <TabsList className="bg-card border border-white/5 p-1 h-auto rounded-2xl w-fit">
            <TabsTrigger value="hiring" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-secondary transition-all">
              <Layers className="w-4 h-4 mr-2" /> Hiring ({projects.length})
            </TabsTrigger>
            <TabsTrigger value="working" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-primary transition-all">
              <Briefcase className="w-4 h-4 mr-2" /> Working ({submissions.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="hiring" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <ProjectManagementCard key={project.id} item={project} type="project" onFormatBudget={formatBudget} />
            ))}
            {projects.length === 0 && (
              <EmptyState title="No active listings" desc="You haven't initiated any objectives yet." />
            )}
          </div>
        </TabsContent>

        <TabsContent value="working" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 gap-4">
            {submissions.map((sub) => (
              <Card key={sub.id} className="glass-card border-none overflow-hidden group hover:border-primary/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Briefcase className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xl">{sub.task_title}</h4>
                          <Badge className="bg-emerald-400/10 text-emerald-400 border-none text-[9px] uppercase tracking-widest font-bold">
                            {sub.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Submitted {new Date(sub.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button asChild className="rounded-xl bg-primary neon-glow-primary font-bold h-12 px-8">
                      <Link href={`/market/${sub.task}`}>View Mission</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {submissions.length === 0 && (
              <EmptyState title="No active contracts" desc="Browse the market to find professional opportunities to perform." />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjectManagementCard({ item, type, onFormatBudget }: { item: any, type: 'project' | 'task', onFormatBudget: (b: any) => string }) {
  const isProject = type === 'project';
  const stats = isProject 
    ? { label: 'Proposals', value: item.bids_count || 0, icon: Users } 
    : { label: 'Proof', value: item.submissions_count || 0, icon: CheckCircle };

  return (
    <Card className="glass-card border-none overflow-hidden group hover:border-secondary/30 transition-all">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={cn(
                "border-none uppercase text-[9px] tracking-widest font-bold",
                isProject ? "bg-secondary/10 text-secondary" : "bg-emerald-400/10 text-emerald-400"
              )}>
                {item.status?.replace('_', ' ') || 'OPEN'}
              </Badge>
              <Badge variant="outline" className="border-white/10 text-muted-foreground capitalize text-[9px] font-bold">
                {item.experience_level || item.difficulty || 'Intermediate'}
              </Badge>
            </div>
            <div>
              <h3 className="text-xl font-headline font-bold group-hover:text-secondary transition-colors">{item.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{item.description || item.short_description}</p>
            </div>
          </div>

          <div className="lg:w-80 bg-white/5 border-l border-white/5 p-6 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <stats.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{stats.label}</span>
              </div>
              <span className="text-lg font-bold">{stats.value}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Protocol Yield</span>
              </div>
              <span className="text-sm font-bold text-secondary">
                {isProject ? onFormatBudget(item.budget) : `${(item.reward_amount || 0).toLocaleString()} SAT`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button variant="outline" size="sm" className="rounded-lg border-white/10 hover:bg-white/5 h-9">
                <Settings2 className="w-3.5 h-3.5" />
              </Button>
              <Button asChild size="sm" className="rounded-lg bg-secondary hover:brightness-110 font-bold h-9 shadow-sm shadow-secondary/20">
                <Link href={isProject ? `/my-projects/${item.id}` : `/audits`}>Manage</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="text-center py-20 glass-card rounded-3xl border-dashed bg-white/[0.02]">
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-muted-foreground/30" />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground max-w-sm mx-auto mt-2">{desc}</p>
    </div>
  );
}
