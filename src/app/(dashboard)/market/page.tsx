import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockTasks, mockProjects } from '@/lib/mock-data';
import { Search, Filter, Zap, Briefcase, Globe, Clock, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function MarketPage() {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-headline font-bold">Gig Discovery</h1>
        <p className="text-muted-foreground">Explore thousands of micro-tasks and high-value freelance projects.</p>
      </header>

      <Tabs defaultValue="tasks" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <TabsList className="bg-card border border-white/5 p-1 h-auto rounded-2xl w-fit">
            <TabsTrigger value="tasks" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary">
              <Zap className="w-4 h-4 mr-2" /> Micro Gigs
            </TabsTrigger>
            <TabsTrigger value="projects" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-secondary">
              <Briefcase className="w-4 h-4 mr-2" /> Projects
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl bg-card border-white/5 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Sort: <span className="text-foreground font-semibold">Newest</span>
            </div>
          </div>
        </div>

        <TabsContent value="tasks" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTasks.map((task) => (
              <div key={task.id} className="glass-card p-6 rounded-2xl hover:border-primary/40 transition-all flex flex-col h-full group">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary" className="bg-white/5 text-muted-foreground border-white/5 px-3">
                    {task.category}
                  </Badge>
                  <div className="text-right">
                    <p className="font-headline font-bold text-xl text-emerald-400">{task.rewardAmount} SAT</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Instant Payout</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{task.title}</h3>
                <p className="text-sm text-muted-foreground flex-1 line-clamp-3 mb-6">
                  {task.shortDescription}
                </p>

                <div className="space-y-4 border-t border-white/5 pt-4 mt-auto">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Shield className="w-3.5 h-3.5" /> {task.difficulty}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" /> ~15 min
                    </span>
                  </div>
                  <Button className="w-full bg-white/5 hover:bg-primary rounded-xl transition-all font-bold">
                    Start Gig
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            {mockProjects.map((project) => (
              <div key={project.id} className="glass-card p-8 rounded-3xl hover:border-secondary/40 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl -z-10 rounded-full group-hover:bg-secondary/10 transition-colors"></div>
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-none px-3">
                        {project.experienceLevel}
                      </Badge>
                      <Badge className="bg-white/5 text-muted-foreground border-none px-3">
                        {project.budgetType}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-headline font-bold mb-2 group-hover:text-secondary transition-colors">{project.title}</h3>
                      <p className="text-muted-foreground max-w-2xl">{project.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.skills.map(skill => (
                        <span key={skill} className="text-xs px-2 py-1 bg-white/5 rounded-md text-muted-foreground">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="lg:w-64 space-y-4 p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Proposed Budget</p>
                      <p className="text-2xl font-headline font-bold text-secondary">
                        {project.budgetMin.toLocaleString()} - {project.budgetMax.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">SATOSHIS</p>
                    </div>
                    <Button className="w-full bg-secondary hover:brightness-110 rounded-xl transition-all font-bold neon-glow-secondary">
                      Place Bid
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}