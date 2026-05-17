"use client"

import React, { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockTasks, mockProjects } from '@/lib/mock-data';
import { Search, Filter, Zap, Briefcase, Globe, Clock, Shield, Sparkles, ArrowRight, SlidersHorizontal, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function MarketPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const categories = useMemo(() => {
    const all = activeTab === 'tasks' 
      ? mockTasks.map(t => t.category.name)
      : mockProjects.map(p => p.skills.map(s => s.name)).flat();
    return Array.from(new Set(all));
  }, [activeTab]);

  const filteredTasks = useMemo(() => {
    return mockTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           task.short_description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || task.category.name === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || task.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const filteredProjects = useMemo(() => {
    return mockProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || project.skills.some(s => s.name === selectedCategory);
      const matchesDifficulty = !selectedDifficulty || project.experience_level === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSearchQuery('');
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">Discovery Interface</h1>
          <p className="text-muted-foreground max-w-2xl">
            Synthesize and deploy into high-value professional objectives across the L2 Satoshi network.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="hidden lg:flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-2xl border border-emerald-500/20 text-xs font-bold uppercase tracking-widest">
            <CheckCircle2 className="w-3.5 h-3.5" /> 1,245 Nodes Active
          </div>
        </div>
      </header>

      <div className="sticky top-20 z-40 space-y-4">
        <div className="glass-card p-2 rounded-3xl border-white/10 flex flex-col md:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search missions, protocols, or node skills..." 
              className="w-full bg-transparent border-none pl-11 h-12 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-2xl border-white/5 bg-white/5 gap-2 h-12 px-6 font-bold flex-1 md:flex-none">
                  <SlidersHorizontal className="w-4 h-4" /> Parameters
                  {(selectedCategory || selectedDifficulty) && (
                    <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-primary">!</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-card border-white/10 p-2 shadow-2xl">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Technical Field</DropdownMenuLabel>
                <div className="space-y-1 mb-2">
                  {categories.slice(0, 5).map(cat => (
                    <DropdownMenuCheckboxItem 
                      key={cat} 
                      checked={selectedCategory === cat}
                      onCheckedChange={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className="rounded-lg"
                    >
                      {cat}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Expertise Class</DropdownMenuLabel>
                <div className="space-y-1">
                  {['entry', 'intermediate', 'expert', 'easy', 'medium', 'hard'].map(level => (
                    <DropdownMenuCheckboxItem 
                      key={level} 
                      checked={selectedDifficulty === level}
                      onCheckedChange={() => setSelectedDifficulty(selectedDifficulty === level ? null : level)}
                      className="rounded-lg capitalize"
                    >
                      {level}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
                <DropdownMenuSeparator className="bg-white/5" />
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-xs font-bold text-destructive hover:bg-destructive/10"
                  onClick={resetFilters}
                >
                  Clear Parameters
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button className="rounded-2xl bg-primary neon-glow-primary h-12 px-8 font-bold hidden sm:flex">
              Search Nodes
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="tasks" onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <TabsList className="bg-card border border-white/5 p-1 h-auto rounded-3xl w-fit">
            <TabsTrigger value="tasks" className="rounded-2xl px-8 py-3 data-[state=active]:bg-primary transition-all font-bold gap-2">
              <Zap className="w-4 h-4" /> Micro Gigs
            </TabsTrigger>
            <TabsTrigger value="projects" className="rounded-2xl px-8 py-3 data-[state=active]:bg-secondary transition-all font-bold gap-2">
              <Briefcase className="w-4 h-4" /> Strategic Projects
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            Sort Nodes: 
            <DropdownMenu>
              <DropdownMenuTrigger className="text-foreground font-bold flex items-center gap-1 hover:text-primary transition-colors">
                Newest Propagated <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-white/10">
                <DropdownMenuItem className="rounded-lg">Highest Revenue First</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg">Shortest Timeline</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg">Reputation Required</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="tasks" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.length > 0 ? filteredTasks.map((task) => (
              <div key={task.id} className="glass-card p-6 rounded-3xl hover:border-primary/40 transition-all flex flex-col h-full group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -z-10 rounded-full group-hover:bg-primary/10 transition-colors"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <Badge variant="secondary" className="bg-white/5 text-muted-foreground border-white/5 px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
                    {task.category.name}
                  </Badge>
                  <div className="text-right">
                    <p className="font-headline font-bold text-2xl text-emerald-400">+{task.reward_amount.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">SATOSHIS</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">{task.title}</h3>
                <p className="text-sm text-muted-foreground flex-1 line-clamp-3 mb-8 leading-relaxed">
                  {task.short_description}
                </p>

                <div className="space-y-4 border-t border-white/5 pt-6 mt-auto">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="w-3.5 h-3.5 text-primary" /> {task.difficulty}
                    </span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-secondary" /> ~15 MIN
                    </span>
                  </div>
                  <Button asChild className="w-full bg-white/5 hover:bg-primary rounded-2xl transition-all font-bold h-12 shadow-sm">
                    <Link href={`/market/${task.id}`}>Initiate Mission</Link>
                  </Button>
                </div>
              </div>
            )) : (
              <EmptyState onReset={resetFilters} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            {filteredProjects.length > 0 ? filteredProjects.map((project) => (
              <div key={project.id} className="glass-card p-8 rounded-[2rem] hover:border-secondary/40 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[100px] -z-10 rounded-full group-hover:bg-secondary/10 transition-colors"></div>
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="space-y-6 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-none px-4 py-1.5 capitalize text-[10px] font-bold tracking-widest">
                        {project.experience_level} CLASS
                      </Badge>
                      <Badge className="bg-white/5 text-muted-foreground border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest">
                        {project.budget_type} SETTLEMENT
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="text-3xl font-headline font-bold mb-3 group-hover:text-secondary transition-colors tracking-tight">{project.title}</h3>
                      <p className="text-muted-foreground max-w-3xl leading-relaxed text-sm lg:text-base">{project.short_description}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {project.skills.map(skill => (
                        <span key={skill.id} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-white/5 rounded-xl text-muted-foreground border border-white/5">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="lg:w-80 space-y-6 p-8 rounded-[2rem] bg-black/40 border border-white/5 backdrop-blur-sm">
                    <div className="text-center space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mb-2">Technical Budget</p>
                      <p className="text-3xl font-headline font-bold text-secondary">
                        {project.budget}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">SATOSHIS • MULTI-SIG</p>
                    </div>
                    <div className="space-y-3 pt-2">
                       <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase">
                        <span>Signal Density</span>
                        <span className="text-white">{project.total_bids}</span>
                      </div>
                      <Button asChild className="w-full bg-secondary hover:brightness-110 rounded-2xl transition-all font-bold h-14 neon-glow-secondary text-lg">
                        <Link href={`/market/${project.id}`}>Initiate Proposal</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <EmptyState onReset={resetFilters} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="col-span-full py-24 text-center glass-card rounded-[2rem] bg-white/[0.02] border-dashed">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
        <SlidersHorizontal className="w-10 h-10 text-muted-foreground/30" />
      </div>
      <h3 className="text-2xl font-bold mb-2">No missions propagated</h3>
      <p className="text-muted-foreground max-sm mx-auto mb-8 leading-relaxed">
        Adjust your technical parameters or search keywords to discover active network objectives.
      </p>
      <Button variant="outline" onClick={onReset} className="rounded-2xl border-white/10 px-8 font-bold h-12">
        Reset Interface
      </Button>
    </div>
  );
}
