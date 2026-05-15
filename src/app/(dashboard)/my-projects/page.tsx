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
  ArrowRight
} from 'lucide-react';
import { mockProjects, mockTasks, mockProfile } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { generateJobProjectDescription } from '@/ai/flows/job-project-description-generator';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ManagementHubPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Form State
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    budget: '',
    type: 'project' as 'project' | 'task'
  });

  async function handleAIGenerate() {
    if (!newProject.title && !newProject.description) {
      toast({ variant: "destructive", title: "Missing input", description: "Please provide a basic title or goal first." });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateJobProjectDescription({ prompt: newProject.title || newProject.description });
      setNewProject({
        ...newProject,
        title: result.title,
        description: `${result.description}\n\nResponsibilities:\n${result.responsibilities.join('\n')}\n\nRequirements:\n${result.requirements.join('\n')}`
      });
      toast({ title: "AI Draft Ready", description: "I've polished your description and requirements." });
    } catch (e) {
      toast({ variant: "destructive", title: "Generation failed", description: "AI Helper is currently busy." });
    } finally {
      setIsGenerating(false);
    }
  }

  // Filter items created by the current user
  const myPostedProjects = mockProjects.filter(p => p.creatorId === mockProfile.id);
  const myPostedTasks = mockTasks.filter(t => t.creatorId === mockProfile.id);

  // Filter items the user is working on (mock logic)
  const myActiveWorking = [
    { ...mockProjects[1], role: 'worker', status: 'In Progress' },
    { ...mockTasks[0], role: 'worker', status: 'Submitted' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold">Management Hub</h1>
          <p className="text-muted-foreground">Oversee everything you've hired for and the work you're currently doing.</p>
        </div>
        <Button 
          className="rounded-xl bg-secondary hover:brightness-110 gap-2 neon-glow-secondary font-bold h-12 px-6"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircle className="w-4 h-4" /> New Listing
        </Button>
      </header>

      <Tabs defaultValue="hiring" className="w-full">
        <TabsList className="bg-card border border-white/5 p-1 h-auto rounded-2xl w-fit mb-8">
          <TabsTrigger value="hiring" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-secondary">
            <Layers className="w-4 h-4 mr-2" /> Hiring
          </TabsTrigger>
          <TabsTrigger value="working" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-primary">
            <Briefcase className="w-4 h-4 mr-2" /> Working
          </TabsTrigger>
        </TabsList>

        {/* Hiring Tab Content */}
        <TabsContent value="hiring" className="space-y-6 mt-0">
          <div className="flex items-center gap-4 bg-card border border-white/5 rounded-2xl p-2 px-4 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search your listings..." 
              className="bg-transparent text-sm outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Projects Section */}
            {myPostedProjects.map((project) => (
              <ProjectManagementCard key={project.id} item={project} type="project" />
            ))}

            {/* Tasks Section */}
            {myPostedTasks.map((task) => (
              <ProjectManagementCard key={task.id} item={task} type="task" />
            ))}

            {myPostedProjects.length === 0 && myPostedTasks.length === 0 && (
              <div className="text-center py-20 glass-card rounded-3xl border-dashed">
                <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold">No hiring listings</h3>
                <p className="text-muted-foreground">You haven't posted any jobs or micro-tasks yet.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Working Tab Content */}
        <TabsContent value="working" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 gap-4">
            {myActiveWorking.map((item: any, i) => (
              <Card key={i} className="glass-card border-none overflow-hidden hover:border-primary/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        item.role === 'worker' ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                      )}>
                        {item.budgetMin ? <Briefcase className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-lg">{item.title}</h4>
                          <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/20">
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.clientName || 'Gigalight Network'} • {item.budgetMin ? 'Fixed Project' : 'Micro Gig'}</p>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="rounded-lg gap-2">
                      <Link href={`/market/${item.id}`}>Workspace <ArrowRight className="w-4 h-4" /></Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Listing Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold">Create New Listing</DialogTitle>
            <DialogDescription>Describe what you need. AI will help professionalize your requirements.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Listing Type</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={newProject.type === 'project' ? 'secondary' : 'outline'}
                    className="flex-1 rounded-xl h-11"
                    onClick={() => setNewProject({...newProject, type: 'project'})}
                  >
                    Project
                  </Button>
                  <Button 
                    variant={newProject.type === 'task' ? 'secondary' : 'outline'}
                    className="flex-1 rounded-xl h-11"
                    onClick={() => setNewProject({...newProject, type: 'task'})}
                  >
                    Micro Task
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Listing Title</Label>
                <Input 
                  placeholder="e.g. Logo Design" 
                  className="bg-background/50 border-white/5 h-11"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Detailed Requirements</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary gap-2 h-7 px-2 hover:bg-primary/10"
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                >
                  <Sparkles className="w-3.5 h-3.5" /> {isGenerating ? "Polish with AI..." : "AI Draft Helper"}
                </Button>
              </div>
              <Textarea 
                placeholder="What exactly needs to be done?"
                className="min-h-[180px] bg-background/50 border-white/5 leading-relaxed"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Locked Budget (SATs)</Label>
                <Input type="number" placeholder="50000" className="bg-background/50 border-white/5 h-11" />
              </div>
              <div className="space-y-2">
                <Label>Target Experience</Label>
                <Input placeholder="Intermediate" className="bg-background/50 border-white/5 h-11" />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
              <Button className="flex-1 bg-secondary neon-glow-secondary font-bold rounded-xl" onClick={() => {
                toast({ title: "Listing Published", description: "Your listing is now live." });
                setIsCreateModalOpen(false);
              }}>
                Publish Listing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.description || item.shortDescription}</p>
            </div>
          </div>

          <div className="lg:w-80 bg-white/5 border-l border-white/5 p-6 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <stats.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{stats.label}</span>
              </div>
              <span className="text-lg font-bold">{stats.value}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Budget</span>
              </div>
              <span className="text-sm font-bold text-secondary">
                {isProject ? `${item.budgetMin.toLocaleString()} SAT` : `${item.rewardAmount.toLocaleString()} SAT`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button variant="outline" size="sm" className="rounded-lg border-white/10 hover:bg-white/5 h-9">
                <Settings2 className="w-3.5 h-3.5" />
              </Button>
              <Button asChild size="sm" className="rounded-lg bg-secondary hover:brightness-110 font-bold h-9">
                <Link href={isProject ? `/my-projects/${item.id}` : `/audits`}>Manage</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
