
"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle, 
  ShieldCheck, 
  Plus, 
  X,
  BadgeDollarSign,
  Lock,
  Wallet,
  Loader2,
  Cpu,
  Layers,
  Target,
  Trash2,
  ChevronRight,
  GripVertical
} from 'lucide-react';
import { generateJobProjectDescription } from '@/ai/flows/job-project-description-generator';
import { suggestSkillsAndCategories } from '@/ai/flows/automated-skill-category-suggestion';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ProofMethod, Category } from '@/lib/types';
import { TaskService } from '@/services/task-service';

export default function CreateGigPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    validatorGuidelines: '',
    category_id: '',
    reward_amount: '500',
    difficulty: 'medium',
    proof_method: 'text' as ProofMethod,
    target_completions: '10',
    skills: [] as string[],
    subtasks: [] as { title: string, description: string, reward_amount: string }[]
  });

  const [newSubtask, setNewSubtask] = useState({ title: '', description: '', reward_amount: '100' });

  useEffect(() => {
    async function fetchTaxonomy() {
      try {
        const catRes = await TaskService.getCategories();
        if (catRes.data?.results) {
          setCategories(catRes.data.results);
        }
      } catch (e) {
        console.error("Failed to fetch protocol taxonomy");
      }
    }
    fetchTaxonomy();
  }, []);

  const totalRewardPerNode = useMemo(() => {
    if (formData.subtasks.length > 0) {
      return formData.subtasks.reduce((acc, st) => acc + (parseInt(st.reward_amount) || 0), 0);
    }
    return parseInt(formData.reward_amount) || 0;
  }, [formData.reward_amount, formData.subtasks]);

  const totalEscrow = useMemo(() => {
    const slots = parseInt(formData.target_completions) || 0;
    return totalRewardPerNode * slots;
  }, [totalRewardPerNode, formData.target_completions]);

  async function handleAIAssist() {
    if (!formData.title && !formData.description) {
      toast({ variant: "destructive", title: "Input Required", description: "Provide a basic title or intent first." });
      return;
    }
    setIsGenerating(true);
    try {
      const genResult = await generateJobProjectDescription({ prompt: formData.title || formData.description });
      const skillResult = await suggestSkillsAndCategories({ text: genResult.description });
      
      setFormData(prev => ({
        ...prev,
        title: genResult.title,
        description: genResult.description,
        instructions: `Key Responsibilities:\n${genResult.responsibilities.map(r => `• ${r}`).join('\n')}`,
        validatorGuidelines: "Ensure all technical requirements are explicitly met in the submitted proof.",
        skills: [...new Set([...prev.skills, ...skillResult.suggestedSkills])],
      }));
      
      toast({ title: "Intelligence Applied", description: "Listing professionalized by AI node." });
    } catch (e) {
      toast({ variant: "destructive", title: "Interface Error", description: "AI node interface timeout." });
    } finally {
      setIsGenerating(false);
    }
  }

  function addSubtask() {
    if (!newSubtask.title) {
      toast({ variant: "destructive", title: "Incomplete Protocol", description: "Milestone title is mandatory." });
      return;
    }
    setFormData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, { ...newSubtask }]
    }));
    setNewSubtask({ title: '', description: '', reward_amount: '100' });
  }

  function removeSubtask(index: number) {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const response = await TaskService.createTask({
        title: formData.title,
        description: formData.description,
        short_description: formData.description.substring(0, 200),
        reward_amount: totalRewardPerNode,
        target_completions: parseInt(formData.target_completions),
        proof_method: formData.proof_method,
        difficulty: formData.difficulty as any,
        validator_guidelines: formData.validatorGuidelines,
        category: formData.category_id,
        // Backend usually handles subtasks as a separate update or via nested serializer
        // We'll pass them in the initial create payload
        subtasks: formData.subtasks
      });

      if (response.data) {
        toast({ title: "Gig Propagated", description: `"${formData.title}" is live on the L2 protocol.` });
        router.push('/my-tasks');
      } else {
        toast({ variant: "destructive", title: "Deployment Error", description: response.error || "Sync failed." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Network Error", description: "Critical gateway timeout." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] mb-1">
             <Zap className="w-3 h-3" /> Micro Gig Deployment
          </div>
          <h1 className="text-4xl font-headline font-bold">Initiate Mission</h1>
          <p className="text-muted-foreground">Define and fund high-volume proof audit channels.</p>
        </div>
      </header>

      <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all",
              step === s ? "bg-primary text-white neon-glow-primary shadow-lg shadow-primary/20" : 
              step > s ? "bg-emerald-500 text-white" : "bg-white/5 text-muted-foreground"
            )}>
              {step > s ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
            {s < 4 && <div className={cn("w-12 h-px", step > s ? "bg-emerald-500" : "bg-white/10")} />}
          </div>
        ))}
      </div>

      <Card className="glass-card border-none overflow-hidden rounded-[2.5rem]">
        <CardContent className="p-10">
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="space-y-2">
                <h3 className="text-3xl font-headline font-bold">1. Objective Scope</h3>
                <p className="text-sm text-muted-foreground">Describe the technical intent and core mission parameters.</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Gig Title</Label>
                  <Input placeholder="e.g. Audit L2 Bridge Documentation" className="h-14 bg-black/40 border-white/5 text-lg rounded-2xl" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Mission Documentation</Label>
                  <Textarea placeholder="Describe the technical requirements for node completion..." className="min-h-[200px] bg-black/40 border-white/5 rounded-3xl p-6 leading-relaxed" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button className="rounded-2xl h-14 px-10 font-bold bg-primary neon-glow-primary shadow-xl shadow-primary/20 text-lg" onClick={() => setStep(2)}>Configure Parameters <ChevronRight className="w-5 h-5 ml-2" /></Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-3xl font-headline font-bold">2. Configuration</h3>
                  <p className="text-sm text-muted-foreground">Categorize your mission and define verification standards.</p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary gap-2 h-10 px-4 rounded-xl hover:bg-primary/10 font-bold text-xs uppercase tracking-widest" onClick={handleAIAssist} disabled={isGenerating}>
                  <Sparkles className="w-4 h-4" /> {isGenerating ? "Synthesizing..." : "AI Intelligence Assist"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Protocol Taxonomy</Label>
                    <Select value={formData.category_id} onValueChange={(val) => setFormData({...formData, category_id: val})}>
                       <SelectTrigger className="bg-black/40 border-white/5 h-14 rounded-2xl"><SelectValue placeholder="Select Category" /></SelectTrigger>
                       <SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Difficulty Class</Label>
                    <Select value={formData.difficulty} onValueChange={(val) => setFormData({...formData, difficulty: val})}>
                       <SelectTrigger className="bg-black/40 border-white/5 h-14 rounded-2xl"><SelectValue /></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="easy">Easy (Low Intensity)</SelectItem>
                          <SelectItem value="medium">Medium (Standard)</SelectItem>
                          <SelectItem value="hard">Hard (Elite Node)</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Proof Verification Guidelines</Label>
                <Textarea placeholder="Tell validators exactly how to verify technical proof..." className="min-h-[120px] bg-black/40 border-white/5 rounded-2xl p-6 italic" value={formData.validatorGuidelines} onChange={(e) => setFormData({...formData, validatorGuidelines: e.target.value})} />
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(1)} className="font-bold text-xs uppercase tracking-widest">Previous</Button>
                <Button className="rounded-2xl h-14 px-10 font-bold bg-primary neon-glow-primary shadow-xl shadow-primary/20 text-lg" onClick={() => setStep(3)}>Define Milestones <ChevronRight className="w-5 h-5 ml-2" /></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="space-y-2">
                <h3 className="text-3xl font-headline font-bold">3. Milestone Protocol</h3>
                <p className="text-sm text-muted-foreground">Decompose your mission into sequential, milestone-based objectives (Optional).</p>
              </div>

              <div className="space-y-6">
                {formData.subtasks.map((st, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl group animate-in zoom-in-95">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">{i + 1}</div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-bold text-white">{st.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{st.reward_amount} SAT Yield</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeSubtask(i)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Card className="bg-black/40 border border-white/10 border-dashed rounded-3xl p-6 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Milestone Objective</Label>
                        <Input placeholder="Objective title..." value={newSubtask.title} onChange={(e) => setNewSubtask({...newSubtask, title: e.target.value})} className="h-12 bg-white/5 border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Milestone Yield (SAT)</Label>
                        <Input type="number" value={newSubtask.reward_amount} onChange={(e) => setNewSubtask({...newSubtask, reward_amount: e.target.value})} className="h-12 bg-white/5 border-white/10 font-bold" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Execution Parameters</Label>
                      <Textarea placeholder="Specific instructions for this milestone..." value={newSubtask.description} onChange={(e) => setNewSubtask({...newSubtask, description: e.target.value})} className="min-h-[80px] bg-white/5 border-white/10 text-xs" />
                   </div>
                   <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10 font-bold h-12 rounded-xl gap-2" onClick={addSubtask}>
                      <Plus className="w-4 h-4" /> Add Protocol Milestone
                   </Button>
                </Card>
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(2)} className="font-bold text-xs uppercase tracking-widest">Previous</Button>
                <Button className="rounded-2xl h-14 px-10 font-bold bg-primary neon-glow-primary shadow-xl shadow-primary/20 text-lg" onClick={() => setStep(4)}>Financial Escrow <ChevronRight className="w-5 h-5 ml-2" /></Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="space-y-2">
                <h3 className="text-3xl font-headline font-bold">4. Financial Escrow</h3>
                <p className="text-sm text-muted-foreground">Authorize L2 settlement and deploy your objective to the network.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-black/40 border border-white/5 p-8 space-y-6 rounded-[2rem]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary"><BadgeDollarSign className="w-7 h-7" /></div>
                    <div><h4 className="font-bold text-lg">Reward Signal</h4><p className="text-[10px] text-muted-foreground uppercase tracking-widest">Multi-sig Performance Payout</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Reward (SAT)</Label>
                      <Input 
                        type="number" 
                        className="h-14 bg-background border-white/10 font-bold text-xl rounded-xl" 
                        value={formData.reward_amount} 
                        onChange={(e) => setFormData({...formData, reward_amount: e.target.value})}
                        disabled={formData.subtasks.length > 0}
                      />
                      {formData.subtasks.length > 0 && <p className="text-[8px] text-emerald-400 font-bold uppercase">Locked to Milestones</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Worker Slots</Label>
                      <Input type="number" className="h-14 bg-background border-white/10 text-lg rounded-xl" value={formData.target_completions} onChange={(e) => setFormData({...formData, target_completions: e.target.value})} />
                    </div>
                  </div>
                  <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between shadow-inner">
                     <span className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest"><Lock className="w-4 h-4 text-emerald-500" /> Escrow Total</span>
                     <span className="text-2xl font-headline font-bold text-emerald-400">{totalEscrow.toLocaleString()} SAT</span>
                  </div>
                </Card>

                <Card className="bg-black/40 border border-white/5 p-8 space-y-6 rounded-[2rem]">
                   <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><ShieldCheck className="w-7 h-7" /></div>
                    <div><h4 className="font-bold text-lg">Proof Method</h4><p className="text-[10px] text-muted-foreground uppercase tracking-widest">Verification Signal Class</p></div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Signal Modality</Label>
                    <Select value={formData.proof_method} onValueChange={(val: ProofMethod) => setFormData({...formData, proof_method: val})}>
                      <SelectTrigger className="bg-background border-white/10 h-14 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Narrative Keywords</SelectItem>
                        <SelectItem value="code_snippet">Code Snippet Audit</SelectItem>
                        <SelectItem value="file">Technical File Propagation</SelectItem>
                        <SelectItem value="link">URL Protocol Signal</SelectItem>
                        <SelectItem value="image">Screenshot Proof</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                      Signal class ensures protocol compatibility for network validators and AI auditing agents.
                    </p>
                  </div>
                </Card>
              </div>

              <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Escrow Authorization Required</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Finalizing propagation will debit <strong className="text-white">{totalEscrow.toLocaleString()} SAT</strong> from your liquid balance to fund the platform multi-sig escrow node. Yields are released to workers only after verified proof audit.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(3)} className="font-bold text-xs uppercase tracking-widest">Previous</Button>
                <Button className="rounded-2xl h-16 px-12 font-bold bg-primary neon-glow-primary shadow-xl shadow-primary/20 text-xl" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Propagating Objective...
                    </div>
                  ) : 'Authorize & Deploy Gig'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

