
"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Users, 
  ShieldCheck, 
  Clock, 
  Target, 
  Layers, 
  Download,
  Filter,
  Loader2,
  PieChart as PieIcon,
  Activity,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TaskService } from '@/services/task-service';
import { TaskManagement, SubTask } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

export default function TaskAnalyticsPage() {
  const { id } = useParams();
  const [mgmt, setMgmt] = useState<TaskManagement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await TaskService.getTaskManagement(id as string);
        if (res.data) setMgmt(res.data);
      } catch (err) {
        toast({ variant: "destructive", title: "Analytics Link Failed", description: "Could not fetch protocol intelligence." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const statusData = useMemo(() => {
    if (!mgmt) return [];
    return [
      { name: 'Approved', value: mgmt.submission_counts.approved, color: 'hsl(var(--primary))' },
      { name: 'Pending', value: mgmt.submission_counts.submitted, color: 'hsl(var(--secondary))' },
      { name: 'Needs Revision', value: mgmt.submission_counts.needs_revision, color: '#f59e0b' },
      { name: 'Rejected', value: mgmt.submission_counts.rejected, color: 'hsl(var(--destructive))' },
    ].filter(item => item.value > 0);
  }, [mgmt]);

  const installmentData = useMemo(() => {
    if (!mgmt?.subtasks) return [];
    return mgmt.subtasks.map(st => ({
      name: st.title,
      submissions: st.submissions_count,
      approved: st.approved_count
    }));
  }, [mgmt]);

  if (isLoading) {
    return <div className="h-[80vh] flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  }

  if (!mgmt) return null;

  const totalSubmissions = Object.values(mgmt.submission_counts).reduce((a, b) => a + b, 0);
  const conversionRate = totalSubmissions > 0 ? (mgmt.submission_counts.approved / totalSubmissions) * 100 : 0;
  const escrowUtilization = (mgmt.paid_sats / mgmt.potential_total_reward) * 100;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link href={`/my-tasks/${id}`} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-bold uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3" /> Management Node
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-headline font-bold">Mission Intelligence</h1>
            <Badge variant="outline" className="border-primary/30 text-primary uppercase font-bold tracking-widest px-3">Full Analytics</Badge>
          </div>
          <p className="text-muted-foreground">{mgmt.task.title}</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-xl border-white/5 gap-2 h-11 font-bold">
            <Download className="w-4 h-4" /> Export Signal
          </Button>
          <Button className="rounded-xl bg-primary neon-glow-primary gap-2 h-11 font-bold">
            <Filter className="w-4 h-4" /> Audit Parameters
          </Button>
        </div>
      </header>

      {/* High Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Total Propagations" 
          value={totalSubmissions} 
          subValue="Inbound Technical Signals"
          icon={Activity} 
          color="primary"
        />
        <MetricCard 
          label="Conversion Index" 
          value={`${Math.round(conversionRate)}%`} 
          subValue="Submission Approval Rate"
          icon={ShieldCheck} 
          color="emerald"
        />
        <MetricCard 
          label="Escrow Utilization" 
          value={`${Math.round(escrowUtilization)}%`} 
          subValue={`${mgmt.paid_sats.toLocaleString()} / ${mgmt.potential_total_reward.toLocaleString()} SAT`}
          icon={Zap} 
          color="secondary"
        />
        <MetricCard 
          label="Worker Density" 
          value={`${mgmt.completed_workers}/${mgmt.target_completions}`} 
          subValue="Target Completion Velocity"
          icon={Users} 
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Distribution */}
        <Card className="glass-card border-none lg:col-span-1 rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-primary" /> Propagation Funnel
            </CardTitle>
            <CardDescription>Visual audit of submission states.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Awaiting Initial Signals...</p>
            )}
          </CardContent>
        </Card>

        {/* Installment Progression */}
        <Card className="glass-card border-none lg:col-span-2 rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Layers className="w-5 h-5 text-secondary" /> Phase Performance
              </CardTitle>
              <CardDescription>Verified completion rate per billable installment.</CardDescription>
            </div>
            <Badge variant="outline" className="border-white/10 uppercase text-[9px] font-bold tracking-widest">{mgmt.subtasks.length} PHASES</Badge>
          </CardHeader>
          <CardContent className="h-[300px]">
            {installmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={installmentData}>
                  <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                  />
                  <Legend verticalAlign="top" align="right" />
                  <Bar dataKey="submissions" name="Signals" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="approved" name="Verified" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-2xl">
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Single Phase Protocol</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Financial Timeline */}
         <Card className="glass-card border-none rounded-[2rem]">
            <CardHeader>
               <CardTitle className="text-lg font-headline flex items-center gap-2">
                 <Zap className="w-5 h-5 text-emerald-400" /> Yield Settlement Audit
               </CardTitle>
               <CardDescription>Real-time SAT release tracking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex items-center justify-between">
                  <div className="space-y-1">
                     <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Total Settled Yield</p>
                     <h3 className="text-3xl font-headline font-bold text-emerald-400">{mgmt.paid_sats.toLocaleString()} SAT</h3>
                  </div>
                  <div className="text-right space-y-1">
                     <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Avg Yield / Node</p>
                     <h3 className="text-xl font-headline font-bold text-white">{(mgmt.paid_sats / (mgmt.completed_workers || 1)).toFixed(0)} SAT</h3>
                  </div>
               </div>
               
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Protocol Escrow Capacity</span>
                    <span>{Math.round(escrowUtilization)}% Utilized</span>
                  </div>
                  <Progress value={escrowUtilization} className="h-2 bg-white/5" />
                  <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-muted-foreground pt-1">
                    <span>0 SAT</span>
                    <span>{mgmt.potential_total_reward.toLocaleString()} SAT Limit</span>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Mission Health */}
         <Card className="glass-card border-none rounded-[2rem]">
            <CardHeader>
               <CardTitle className="text-lg font-headline flex items-center gap-2">
                 <Target className="w-5 h-5 text-primary" /> Strategy Health
               </CardTitle>
               <CardDescription>Overall mission lifecycle integrity.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-2 gap-4">
                  <HealthStat label="Audit Velocity" value="High" icon={TrendingUp} color="emerald" />
                  <HealthStat label="Signal Quality" value="98%" icon={ShieldCheck} color="primary" />
                  <HealthStat label="Remaining Capacity" value={`${mgmt.remaining_slots} Slots`} icon={Users} color="secondary" />
                  <HealthStat label="Time to Finalize" value="Est. 4d" icon={Clock} color="primary" />
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

function MetricCard({ label, value, subValue, icon: Icon, color }: any) {
  const colors: any = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    emerald: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  };
  return (
    <Card className="glass-card border-none overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500", colors[color])}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{label}</p>
            <h3 className="text-2xl font-headline font-bold">{value}</h3>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-70">{subValue}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HealthStat({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    emerald: 'text-emerald-400',
  };
  return (
    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2">
       <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4", colors[color])} />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
       </div>
       <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
