
"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Eye, CheckCircle, XCircle, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { mockSubmissions, mockTasks } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { aiSubmissionAuditor } from '@/ai/flows/ai-submission-auditor';
import { toast } from '@/hooks/use-toast';

export default function AuditsPage() {
  const [isAuditing, setIsAuditing] = useState<string | null>(null);

  async function runAiAudit(submissionId: string) {
    setIsAuditing(submissionId);
    try {
      // Find submission and task for context
      const sub = mockSubmissions.find(s => s.id === submissionId);
      const task = mockTasks.find(t => t.id === sub?.taskId);

      if (!sub || !task) return;

      const result = await aiSubmissionAuditor({
        taskInstructions: task.shortDescription,
        proofRequirements: task.proofMethod,
        proofText: sub.proofText,
        proofDescription: "Submitted by user via automated flow."
      });

      toast({
        title: `AI Recommendation: ${result.suggestedStatus}`,
        description: result.rationale,
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Audit failed",
        description: "AI auditor encountered an error.",
      });
    } finally {
      setIsAuditing(null);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-headline font-bold">Audit Queue</h1>
        <p className="text-muted-foreground">Review and verify task submissions to release SAT rewards.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-none bg-emerald-400/5 border-emerald-400/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Global Rep</p>
                <h3 className="text-2xl font-headline font-bold">Level 8</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-none">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Pending</p>
                <h3 className="text-2xl font-headline font-bold">{mockSubmissions.length} Tasks</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-none">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Alerts</p>
                <h3 className="text-2xl font-headline font-bold">2 High Risk</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-headline font-bold flex items-center gap-2">
          Submissions Needing Review
        </h2>
        
        {mockSubmissions.map((sub) => {
          const task = mockTasks.find(t => t.id === sub.taskId);
          return (
            <Card key={sub.id} className="glass-card border-none overflow-hidden hover:border-emerald-400/30 transition-all group">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                      <Eye className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold">{task?.title || 'Unknown Task'}</h4>
                        <Badge variant="secondary" className="bg-white/5 border-none text-[10px] uppercase tracking-widest">
                          {sub.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Worker: {sub.userId} • Submitted: {new Date(sub.createdAt).toLocaleDateString()}</p>
                      <div className="bg-black/20 p-3 rounded-lg border border-white/5 mt-2">
                        <p className="text-xs italic text-muted-foreground">"{sub.proofText}"</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/10 gap-2"
                      onClick={() => runAiAudit(sub.id)}
                      disabled={isAuditing === sub.id}
                    >
                      <Sparkles className="w-4 h-4" /> {isAuditing === sub.id ? 'Auditing...' : 'AI Audit'}
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-xl text-destructive hover:bg-destructive/10">
                      <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                    <Button size="sm" className="rounded-xl bg-emerald-500 hover:bg-emerald-600">
                      <CheckCircle className="w-4 h-4 mr-2" /> Approve
                    </Button>
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
