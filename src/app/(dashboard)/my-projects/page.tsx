"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Briefcase, Settings2, Users, ArrowUpRight, Search, Sparkles, AlertCircle, X } from 'lucide-react';
import { mockProjects } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateJobProjectDescription } from '@/ai/flows/job-project-description-generator';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function MyProjectsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Form State
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    budget: '',
    skills: ''
  });

  async function handleAIGenerate() {
    if (!newProject.title && !newProject.description) {
      toast({
        variant: "destructive",
        title: "Missing input",
        description: "Please provide a basic title or goal first.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateJobProjectDescription({ 
        prompt: newProject.title || newProject.description
      });
      setNewProject({
        ...newProject,
        title: result.title,
        description: `${result.description}\n\nResponsibilities:\n${result.responsibilities.join('\n')}\n\nRequirements:\n${result.requirements.join('\n')}`
      });
      toast({
        title: "AI Draft Ready",
        description: "I've polished your description and requirements.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "AI Draft Helper is busy. Please try manually.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const filteredProjects = mockProjects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold">My Listings</h1>
          <p className="text-muted-foreground">Manage your posted projects, hire talent, and release payments.</p>
        </div>
        <Button 
          className="rounded-xl bg-secondary hover:brightness-110 gap-2 neon-glow-secondary font-bold h-12 px-6"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircle className="w-4 h-4" /> Post a Listing
        </Button>
      </header>

      <div className="flex items-center gap-4 bg-card border border-white/5 rounded-2xl p-2 px-4 max-w-md">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search your projects..." 
          className="bg-transparent text-sm outline-none w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredProjects.length > 0 ? filteredProjects.map((project) => (
          <Card key={project.id} className="glass-card border-none overflow-hidden group">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-8 space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-secondary/10 text-secondary border-none uppercase text-[10px] tracking-widest font-bold">
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="border-white/10 text-muted-foreground capitalize text-[10px] font-bold">
                      {project.experienceLevel}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-2xl font-headline font-bold group-hover:text-secondary transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">{project.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map(skill => (
                      <span key={skill} className="text-[10px] px-2 py-1 bg-white/5 rounded-md text-muted-foreground uppercase tracking-wider font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:w-72 bg-white/5 border-l border-white/5 p-8 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Proposals</span>
                      <span className="font-bold">12</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2"><Briefcase className="w-4 h-4" /> Locked Budget</span>
                      <span className="font-bold text-secondary">{project.budgetMin.toLocaleString()} SAT</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg border-white/10 hover:bg-white/5">
                      <Settings2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="rounded-lg bg-secondary hover:brightness-110 font-bold">
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-20 glass-card rounded-3xl border-dashed">
            <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold">No projects found</h3>
            <p className="text-muted-foreground">You haven't posted any jobs or projects yet.</p>
          </div>
        )}
      </div>

      {/* Create Listing Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold">Create New Listing</DialogTitle>
            <DialogDescription>Describe what you need. Use the AI Draft Helper to professionalize your requirements.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Listing Title</Label>
              <Input 
                placeholder="e.g. Senior React Developer for Defi App" 
                className="bg-background/50 border-white/5"
                value={newProject.title}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Description & Requirements</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary gap-2 h-7 px-2 hover:bg-primary/10"
                  onClick={handleAIAssist}
                  disabled={isGenerating}
                >
                  <Sparkles className="w-3.5 h-3.5" /> {isGenerating ? "Drafting..." : "AI Draft Helper"}
                </Button>
              </div>
              <Textarea 
                placeholder="Detail what needs to be done..."
                className="min-h-[150px] bg-background/50 border-white/5"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Budget (SATs)</Label>
                <Input type="number" placeholder="50000" className="bg-background/50 border-white/5" />
              </div>
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Input placeholder="Expert" className="bg-background/50 border-white/5" />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="flex-1">Cancel</Button>
              <Button className="flex-1 bg-secondary neon-glow-secondary font-bold" onClick={() => {
                toast({ title: "Listing Published", description: "Your project is now live on the Gigs Market." });
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

  async function handleAIAssist() {
    handleAIGenerate();
  }
}
