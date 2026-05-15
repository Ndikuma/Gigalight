
"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Briefcase, Settings2, Users, ArrowUpRight, Search, Sparkles } from 'lucide-react';
import { mockProjects } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { generateJobProjectDescription } from '@/ai/flows/job-project-description-generator';
import { toast } from '@/hooks/use-toast';

export default function MyProjectsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  async function handleAIGenerate() {
    setIsGenerating(true);
    try {
      const result = await generateJobProjectDescription({ 
        prompt: "A high-end React developer to build a decentralized finance dashboard with real-time analytics" 
      });
      toast({
        title: "Draft Generated!",
        description: `Created: ${result.title}. Check your drafts.`,
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Could not use AI to generate project details right now.",
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
          <h1 className="text-4xl font-headline font-bold">My Projects</h1>
          <p className="text-muted-foreground">Manage your job listings, milestones, and active talent.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl border-primary/20 hover:bg-primary/5 text-primary gap-2"
            onClick={handleAIGenerate}
            disabled={isGenerating}
          >
            <Sparkles className="w-4 h-4" /> {isGenerating ? 'Drafting...' : 'AI Draft Helper'}
          </Button>
          <Button className="rounded-xl bg-secondary hover:brightness-110 gap-2 neon-glow-secondary">
            <PlusCircle className="w-4 h-4" /> Create Listing
          </Button>
        </div>
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
                    <Badge className="bg-secondary/10 text-secondary border-none">{project.status}</Badge>
                    <Badge variant="outline" className="border-white/10 text-muted-foreground capitalize">{project.experienceLevel}</Badge>
                  </div>
                  <div>
                    <h3 className="text-2xl font-headline font-bold group-hover:text-secondary transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{project.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map(skill => (
                      <span key={skill} className="text-[10px] px-2 py-1 bg-white/5 rounded-md text-muted-foreground uppercase tracking-wider">
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
                      <span className="text-muted-foreground flex items-center gap-2"><Briefcase className="w-4 h-4" /> Budget</span>
                      <span className="font-bold text-secondary">{project.budgetMin.toLocaleString()} SAT</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg border-white/10">
                      <Settings2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="rounded-lg bg-secondary hover:brightness-110">
                      Manage <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-20 glass-card rounded-3xl border-dashed">
            <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold">No projects found</h3>
            <p className="text-muted-foreground">You haven't posted any jobs or projects yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
