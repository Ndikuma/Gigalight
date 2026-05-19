
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Activity, 
  ArrowRight,
  Target,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TaskService } from '@/services/task-service';
import { Submission } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export default function MyContributionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContributions() {
      setIsLoading(true);
      try {
        const res = await TaskService.getMySubmissions();
        if (res.data) setSubmissions(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        toast({ 
          variant: "destructive", 
          title: "Synchronization Lost", 
          description: "Could not fetch your contribution history." 
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchContributions();
  }, []);

  if (isLoading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-white">Workforce Yield</h1>
          <p className="text-muted-foreground">Oversight of your personal technical contributions and SAT yields.</p>
        </div>
        <Button asChild className="rounded-xl bg-emerald-500 hover:bg-emerald-600 gap-2 font-bold h-12 px-6 shadow-lg shadow-emerald-500/20">
          <Link href="/market"><Zap className="w-4 h-4" /> Discovery Market</Link>
        </Button>
      </header>

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
                      <p className="text-sm text-muted-foreground font-medium">Propagated: {new Date(sub.created_at).toLocaleDateString()}</p>
                      {sub.is_paid && (
                         <Badge variant="outline" className="text-[8px] border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-tighter">Settled on L2</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-right hidden sm:block">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Yield Potential</p>
                      <p className="text-lg font-bold text-emerald-400">+{sub.reward_amount?.toLocaleString()} SAT</p>
                   </div>
                   <Button asChild variant="outline" className="rounded-xl border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 font-bold h-12 px-8 gap-2">
                    <Link href={`/market/${sub.task}`}>View Workbench <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {submissions.length === 0 && (
          <div className="text-center py-20 glass-card rounded-3xl border-dashed bg-white/[0.02] border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold text-white">No active contributions</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2 text-sm">Execute micro-tasks or strategic projects to grow your node yield.</p>
          </div>
        )}
      </div>
    </div>
  );
}
