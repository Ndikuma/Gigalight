
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Briefcase, 
  ArrowRight,
  Target,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProjectService } from '@/services/project-service';
import { ProjectDetail } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true);
      try {
        const res = await ProjectService.getMyProjects();
        if (res.data) setProjects(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        toast({ 
          variant: "destructive", 
          title: "Synchronization Lost", 
          description: "Could not fetch your project history." 
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
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
          <h1 className="text-4xl font-headline font-bold text-white">Strategic Projects</h1>
          <p className="text-muted-foreground">Manage your milestone-based enterprise listings.</p>
        </div>
        <Button asChild className="rounded-xl bg-secondary hover:brightness-110 gap-2 neon-glow-secondary font-bold h-12 px-6">
          <Link href="/my-projects/create"><PlusCircle className="w-4 h-4" /> Initiate Project</Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="glass-card border-none overflow-hidden group hover:border-secondary/30 transition-all">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={cn(
                      "border-none uppercase text-[9px] tracking-widest font-bold",
                      project.status === 'in_progress' ? "bg-emerald-400/10 text-emerald-400" : 
                      project.status === 'open' ? "bg-primary/10 text-primary" : "bg-white/10 text-muted-foreground"
                    )}>
                      {project.status?.replace('_', ' ') || 'OPEN'}
                    </Badge>
                    <Badge variant="outline" className="border-white/10 text-muted-foreground capitalize text-[9px] font-bold">
                      {project.experience_level} Class
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-bold text-white group-hover:text-secondary transition-colors">{project.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{project.short_description}</p>
                  </div>
                </div>

                <div className="lg:w-80 bg-white/5 border-l border-white/5 p-6 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Node Signals</span>
                      <span className="text-sm font-bold text-white">{project.bids_count || 0} Proposals</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Yield Range</span>
                      <span className="text-sm font-bold text-secondary">{formatBudget(project.budget)}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full rounded-xl bg-secondary hover:brightness-110 font-bold h-11 gap-2">
                    <Link href={`/my-projects/${project.id}`}>Workspace <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-20 glass-card rounded-3xl border-dashed bg-white/[0.02] border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold text-white">No active projects</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2 text-sm">Initiate high-value objectives for specialized network nodes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
