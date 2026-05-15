
"use client"

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Briefcase, 
  Settings2, 
  Users, 
  Search, 
  Sparkles, 
  AlertCircle, 
  Layers,
  Zap,
  CheckCircle,
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react';
import { mockProjects, mockTasks, mockProfile } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ManagementHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Hiring: Listings created by me
  const myHiringProjects = mockProjects.filter(p => p.creatorId === mockProfile.id);
  const myHiringTasks = mockTasks.filter(t => t.creatorId === mockProfile.id);

  // Working: Projects I'm involved in as a worker/contractor
  const myWorkingProjects = mockProjects.filter(p => p.status === 'in_progress' && p.creatorId !== mockProfile.id);

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
              <Layers className="w-4 h-4 mr-2" /> Hiring ({myHiringProjects.length + myHiringTasks.length})
            </TabsTrigger>
            <TabsTrigger value="working" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-primary transition-all">
              <Briefcase className="w-4 h-4 mr-2" /> Working ({myWorkingProjects.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Filter listings..." 
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-2 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-xl border-white/5 bg-white/5"><Filter className="w-4 h-4" /></Button>
          </div>
        </div>

        <TabsContent value="hiring" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 gap-4">
            {myHiringProjects.map((project) => (
              <ProjectManagementCard key={project.id} item={project} type="project" />
            ))}
            {myHiringTasks.map((task) => (
              <ProjectManagementCard key={task.id} item={task} type="task" />
            ))}
            {myHiringProjects.length === 0 && myHiringTasks.length === 0 && (
              <EmptyState title="No active listings" desc="You haven't initiated any objectives yet." />
            )}
          </div>
        </TabsContent>

        <TabsContent value="working" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 gap-4">
            {myWorkingProjects.map((project) => (
              <Card key={project.id} className="glass-card border-none overflow-hidden group hover:border-primary/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                        <Briefcase className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xl">{project.title}</h4>
                          <Badge className="bg-emerald-400/10 text-emerald-400 border-none text-[9px] uppercase tracking-widest font-bold">
                            Active Contract
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Client: {project.clientName} • Strategic Partner</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Locked Yield</p>
                        <p className="text-lg font-bold text-primary">{project.budgetMin.toLocaleString()} SAT</p>
                      </div>
                      <Button asChild size="lg" className="rounded-xl bg-primary neon-glow-primary font-bold h-12 px-8">
                        <Link href={`/my-projects/${project.id}`}>Enter Workspace</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {myWorkingProjects.length === 0 && (
              <EmptyState title="No active contracts" desc="Browse the market to find professional opportunities to perform." />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjectManagementCard({ item, type }: { item: any, type: 'project' | 'task' }) {
  const isProject = type === 'project';
  const stats = isProject 
    ? { label: 'Bids', value: item.bids?.length || 0, icon: Users } 
    : { label: 'Proof', value: item.submissionsCount || 0, icon: CheckCircle };

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
                {item.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className="border-white/10 text-muted-foreground capitalize text-[9px] font-bold">
                {item.experienceLevel || item.difficulty}
              </Badge>
            </div>
            <div>
              <h3 className="text-xl font-headline font-bold group-hover:text-secondary transition-colors">{item.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{item.description || item.shortDescription}</p>
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
                {isProject ? `${item.budgetMin.toLocaleString()} SAT` : `${item.rewardAmount.toLocaleString()} SAT`}
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
