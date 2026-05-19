
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Layers, 
  ArrowRight,
  Target,
  Loader2,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TaskService } from '@/services/task-service';
import { TaskMini } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<TaskMini[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      setIsLoading(true);
      try {
        const res = await TaskService.getMyTasks();
        if (res.data) setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        toast({ 
          variant: "destructive", 
          title: "Synchronization Lost", 
          description: "Could not fetch your gig history." 
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchTasks();
  }, []);

  if (isLoading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-white">Micro Gigs</h1>
          <p className="text-muted-foreground">Manage your high-volume proof audit channels.</p>
        </div>
        <Button asChild className="rounded-xl bg-primary hover:brightness-110 gap-2 neon-glow-primary font-bold h-12 px-6">
          <Link href="/my-tasks/create"><PlusCircle className="w-4 h-4" /> Deploy Gig</Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="glass-card border-none overflow-hidden group hover:border-primary/30 transition-all">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-none uppercase text-[9px] tracking-widest font-bold">Created Gig</Badge>
                    <Badge variant="outline" className="border-white/10 text-muted-foreground uppercase text-[9px] font-bold">{task.difficulty} Class</Badge>
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
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-20 glass-card rounded-3xl border-dashed bg-white/[0.02] border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold text-white">No active gigs</h3>
            <p className="text-muted-foreground max-sm mx-auto mt-2 text-sm">Deploy high-volume tasks for rapid technical scaling.</p>
          </div>
        )}
      </div>
    </div>
  );
}
