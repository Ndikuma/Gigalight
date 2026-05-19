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
  Loader2,
  Zap,
  Activity,
  ArrowRight,
  Package,
  TrendingUp,
  Target
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProjectService } from '@/services/project-service';
import { TaskService } from '@/services/task-service';
import { ProjectDetail, Submission, TaskMini } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { StarRating } from '@/components/ui/star-rating';

export default function ManagementHubPage() {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [tasks, setTasks] = useState<TaskMini[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [projRes, taskRes, subRes] = await Promise.all([
          ProjectService.getMyProjects(),
          TaskService.getMyTasks(),
          TaskService.getMySubmissions()
        ]);
        
        if (projRes.data) setProjects(Array.isArray(projRes.data) ? projRes.data : []);
        if (taskRes.data) setTasks(Array.isArray(taskRes.data) ? taskRes.data : []);
        if (subRes.data) setSubmissions(Array.isArray(subRes.data) ? subRes.data : []);
        
      } catch (e) {
        toast({ 
          variant: "destructive", 
          title: "Synchronization Lost", 
          description: "Could not fetch your professional history from the node." 
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatBudget = (budget: any) => {
    if (!budget) return 'TBD';
    if (typeof budget === 'object' && budget !== null) {
      return `${(budget.min || 0).toLocaleString()} - ${(budget.max || 0).toLocaleString()} SAT`;
    }
    return budget;
  };

  if (isLoading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-white">Management Hub</h1>
          <p className="text-muted-foreground">Strategic oversight of your decentralized node operations.</p>
        </div>
        <Button 
          asChild
          className="rounded-xl bg-secondary hover:brightness-110 gap-2 neon-glow-secondary font-bold h-12 px-6 shadow-lg shadow-secondary/20"
        >
          <Link href="/my-projects/create">
            <PlusCircle className="w-4 h-4" /> Initiate Objective
          </Link>
        </Button>
      </header>

      <Tabs defaultValue="projects" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <TabsList className="bg-card border border-white/5 p-1 h-auto rounded-2xl w-fit">
            <TabsTrigger value="projects" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-secondary transition-all font-bold gap-2">
              <Briefcase className="w-4 h-4" /> Created Projects ({projects.length})
            </TabsTrigger>
            <TabsTrigger value="tasks" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-primary transition-all font-bold gap-2">
              <Zap className="w-4 h-4" /> Created Gigs ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="contributions" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-emerald-500 transition-all font-bold gap-2">
              <Activity className="w-4 h-4" /> My Contributions ({submissions.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="projects" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <ProjectManagementCard key={project.id} item={project} onFormatBudget={formatBudget} />
            ))}
            {projects.length === 0 && (
              <EmptyState title="No strategic projects created" desc="Initiate high-value objectives for specialized network nodes." />
            )}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 gap-4">
            {tasks.map((task) => (
              <TaskManagementCard key={task.id} task={task} />
            ))}
            {tasks.length === 0 && (
              <EmptyState title="No micro gigs created" desc="Deploy high-volume tasks for rapid technical scaling." />
            )}
          </div>
        </TabsContent>

        <TabsContent value="contributions" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 gap-4">
            {submissions.map((sub) => (
              <Card key={sub.id} className="glass-card border-none overflow-hidden group hover:border-emerald-500/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Activity className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xl text-white">{sub.task_title}</h4>
                          <Badge className={cn(
                            "border-none text-[9px] uppercase tracking-widest font-bold",
                            sub.status === 'approved' ? "bg-emerald-400/10 text-emerald-400" :
                            sub.status === 'rejected' ? "bg-destructive/10 text-destructive" :
                            "bg-amber-400/10 text-amber-400"
                          )}>
                            {sub.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-muted-foreground font-medium">Received: {new Date(sub.created_at).toLocaleDateString()}</p>
                          {sub.is_paid && (
                             <Badge variant="outline" className="text-[8px] border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-tighter">Settled on L2</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button asChild variant="outline" className="rounded-xl border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 font-bold h-12 px-8 gap-2">
                      <Link href={`/market/${sub.task}`}>View Workbench <ArrowRight className="w-4 h-4" /></Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {submissions.length === 0 && (
              <EmptyState title="No active contributions" desc="Execute micro-tasks or strategic projects to grow your node yield." />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjectManagementCard({ item, onFormatBudget }: { item: any, onFormatBudget: (b: any) => string }) {
  return (
    <Card className="glass-card border-none overflow-hidden group hover:border-secondary/30 transition-all">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={cn(
                "border-none uppercase text-[9px] tracking-widest font-bold",
                item.status === 'in_progress' ? "bg-emerald-400/10 text-emerald-400" : 
                item.status === 'open' ? "bg-primary/10 text-primary" : "bg-white/10 text-muted-foreground"
              )}>
                {item.status?.replace('_', ' ') || 'OPEN'}
              </Badge>
              <Badge variant="outline" className="border-white/10 text-muted-foreground capitalize text-[9px] font-bold">
                {item.experience_level} Class
              </Badge>
            </div>
            <div>
              <h3 className="text-xl font-headline font-bold text-white group-hover:text-secondary transition-colors">{item.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{item.short_description}</p>
            </div>
          </div>

          <div className="lg:w-80 bg-white/5 border-l border-white/5 p-6 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Node Signals</span>
                <span className="text-sm font-bold text-white">{item.bids_count || 0} Propositions</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Yield Range</span>
                <span className="text-sm font-bold text-secondary">{onFormatBudget(item.budget)}</span>
              </div>
            </div>
            <Button asChild className="w-full rounded-xl bg-secondary hover:brightness-110 font-bold h-11 gap-2">
              <Link href={`/my-projects/${item.id}`}>Workspace <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskManagementCard({ task }: { task: TaskMini }) {
  return (
    <Card className="glass-card border-none overflow-hidden group hover:border-primary/30 transition-all">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-none uppercase text-[9px] tracking-widest font-bold">
                Created Gig
              </Badge>
              <Badge variant="outline" className="border-white/10 text-muted-foreground uppercase text-[9px] font-bold">
                {task.difficulty} Class
              </Badge>
            </div>
            <div>
              <h3 className="text-xl font-headline font-bold text-white group-hover:text-primary transition-colors">{task.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{task.short_description}</p>
            </div>
          </div>

          <div className="lg:w-80 bg-white/5 border-l border-white/5 p-6 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Audit Queue</span>
                <span className="text-lg font-bold text-white">{task.submissions_count || 0} Proofs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Yield / Node</span>
                <span className="text-sm font-bold text-primary">{task.reward_amount?.toLocaleString()} SAT</span>
              </div>
            </div>
            <Button asChild className="w-full rounded-xl bg-primary hover:brightness-110 font-bold h-11 gap-2 shadow-lg shadow-primary/20">
              <Link href={`/my-tasks/${task.id}`}>Review Center <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="text-center py-20 glass-card rounded-3xl border-dashed bg-white/[0.02] border-white/10">
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
        <Target className="w-8 h-8 text-muted-foreground/30" />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-muted-foreground max-w-sm mx-auto mt-2 text-sm">{desc}</p>
    </div>
  );
}
