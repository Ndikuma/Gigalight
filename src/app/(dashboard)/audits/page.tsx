
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Eye, CheckCircle, XCircle, Clock, AlertTriangle, Sparkles, Filter, MoreHorizontal } from 'lucide-react';
import { mockSubmissions, mockTasks } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { aiSubmissionAuditor } from '@/ai/flows/ai-submission-auditor';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AuditsPage() {
  const [isAuditing, setIsAuditing] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function runAiAudit(submissionId: string) {
    setIsAuditing(submissionId);
    try {
      const sub = mockSubmissions.find(s => s.id === submissionId);
      const task = mockTasks.find(t => t.id === sub?.taskId);

      if (!sub || !task) return;

      const result = await aiSubmissionAuditor({
        taskInstructions: task.shortDescription,
        proofRequirements: task.proofMethod,
        proofText: sub.proofText,
        proofDescription: "Peer audit requested via validator network."
      });

      toast({
        title: `AI Analysis: ${result.suggestedStatus.toUpperCase()}`,
        description: result.rationale,
      });
    } catch (e) {
      toast({ variant: "destructive", title: "Audit Error", description: "The AI node encountered an interface timeout." });
    } finally {
      setIsAuditing(null);
    }
  }

  function handleAction(id: string, action: 'Approve' | 'Reject') {
    toast({
      title: `Submission ${action}d`,
      description: `Validation yield has been credited to your node.`,
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold">Validator Queue</h1>
          <p className="text-muted-foreground">Meticulously review proof to maintain network integrity.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl bg-card border-white/5 gap-2">
            <Filter className="w-4 h-4" /> Parameters
          </Button>
          <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-600 gap-2 font-bold px-6">
            <ShieldCheck className="w-4 h-4" /> High Intensity
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Network Reputation" value="Tier 8" icon={ShieldCheck} color="emerald" />
        <StatCard label="Pending Audits" value={`${mockSubmissions.length} Documents`} icon={Clock} color="primary" />
        <StatCard label="Validation Yield" value="2,450 SAT" icon={Sparkles} color="secondary" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-headline font-bold">Awaiting Verification</h2>
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Queue Density: {mockSubmissions.length} Items</span>
        </div>
        
        {mockSubmissions.map((sub) => {
          const task = mockTasks.find(t => t.id === sub.taskId);
          return (
            <Card key={sub.id} className="glass-card border-none overflow-hidden hover:border-emerald-400/30 transition-all group">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex gap-5 flex-1">
                    <Avatar className="w-14 h-14 rounded-2xl">
                      <AvatarImage src={`https://picsum.photos/seed/${sub.userId}/100/100`} />
                      <AvatarFallback>{sub.userName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg">{task?.title || 'Unknown Objective'}</h4>
                        <Badge className="bg-emerald-400/10 text-emerald-400 border-none text-[9px] uppercase tracking-widest font-bold">
                          {sub.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Contributor: <span className="text-foreground">{sub.userName || sub.userId}</span> 
                        {mounted && <span> • {new Date(sub.createdAt).toLocaleDateString()}</span>}
                      </p>
                      
                      <div className="bg-background/80 p-4 rounded-xl border border-white/5 mt-3 relative overflow-hidden group/proof">
                        <p className="text-sm italic text-muted-foreground relative z-10 leading-relaxed">"{sub.proofText}"</p>
                        <div className="absolute right-2 top-2 opacity-0 group-hover/proof:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/10 gap-2 h-10 px-4 font-bold"
                        onClick={() => runAiAudit(sub.id)}
                        disabled={isAuditing === sub.id}
                      >
                        <Sparkles className="w-4 h-4" /> {isAuditing === sub.id ? 'Analyzing...' : 'AI Validation'}
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex-1 rounded-xl text-destructive hover:bg-destructive/10 h-10 px-4 font-bold"
                          onClick={() => handleAction(sub.id, 'Reject')}
                        >
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 h-10 px-6 font-bold"
                          onClick={() => handleAction(sub.id, 'Approve')}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    emerald: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  };
  return (
    <Card className="glass-card border-none">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors[color])}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
            <h3 className="text-2xl font-headline font-bold">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
