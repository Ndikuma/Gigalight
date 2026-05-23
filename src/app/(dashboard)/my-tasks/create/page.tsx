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
  Plus, 
  X,
  BadgeDollarSign,
  Lock,
  Wallet,
  Loader2,
  Trash2,
  ChevronRight,
  ListTodo,
  Layers,
  History,
  Target
} from 'lucide-react';
import { generateJobProjectDescription } from '@/ai/flows/job-project-description-generator';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ProofMethod, Category, Skill } from '@/lib/types';
import { TaskService } from '@/services/task-service';
import { SkillService } from '@/services/skill-service';

export default function CreateGigPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingTaxonomy, setIsLoadingTaxonomy] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    category_id: '',
    reward_amount: '500',
    difficulty: 'easy',
    proof_method: 'text' as ProofMethod,
    target_completions: '10',
    submission_fee_sats: '10',
    submitter_pays_fee_upfront: false,
    external_url: '',
    validator_guidelines: '',
    instructions: {
      summary: '',
      steps: [] as { title: string, description: string, required: boolean }[],
      proof_requirements: [] as string[]
    },
    subtasks: [] as { title: string, description: string, reward_amount: string, submission_fee_sats: string }[]
  });

  const [newStep, setNewStep] = useState({ title: '', description: '', required: true });
  const [newSubtask, setNewSubtask] = useState({ title: '', description: '', reward_amount: '0', submission_fee_sats: '0' });

  useEffect(() => {
    async function fetchTaxonomy() {
      try {
        const [catRes] = await Promise.all([
          TaskService.getCategories()
        ]);
        if (catRes.data?.results) setCategories(catRes.data.results);
      } catch (e) {
        console.error("Failed to fetch protocol taxonomy");
      } finally {
        setIsLoadingTaxonomy(false);
      }
    }
    fetchTaxonomy();
  }, []);

  const totalEscrow = useMemo(() => {
    const reward = parseInt(formData.reward_amount) || 0;
    const slots = parseInt(formData.target_completions) || 0;
    
    // If we have subtasks, reward_amount of the main task usually acts as the total if subtask rewards are 0,
    // but the spec says subtask rewards are separate installments. 
    // We'll calculate based on explicit rewards.
    const subtaskTotal = formData.subtasks.reduce((acc, st) => acc + (parseInt(st.reward_amount) || 0), 0);
    const baseReward = subtaskTotal > 0 ? subtaskTotal : reward;
    
    return baseReward * slots;
  }, [formData.reward_amount, formData.target_completions, formData.subtasks]);

  async function handleAIAssist() {
    if (!formData.title && !formData.description) {
      toast({ variant: "destructive", title: "Input Required", description: "Provide a basic title or intent first." });
      return;
    }
    setIsGenerating(true);
    try {
      const genResult = await generateJobProjectDescription({ prompt: formData.title || formData.description });
      
      setFormData(prev => ({
        ...prev,
        title: genResult.title,
        description: prev.description || genResult.description,
        short_description: genResult.description.substring(0, 160),
        instructions: {
          ...prev.instructions,
          summary: "Follow these technical steps for mission validation.",
          steps: genResult.responsibilities.map(r => ({ title: r, description: "Professional execution required.", required: true })),
          proof_requirements: ["Technical Summary", "Screenshot Proof"]
        },
        validator_guidelines: "Ensure all steps are explicitly documented in the technical proof."
      }));
      
      toast({ title: "Protocol Synthesized", description: "AI has professionalized your mission instructions." });
    } catch (e) {
      toast({ variant: "destructive", title: "Interface Error", description: "AI node interface timeout." });
    } finally {
      setIsGenerating(false);
    }
  }

  function addStep() {
    if (!newStep.title) return;
    setFormData(prev => ({
      ...prev,
      instructions: {
        ...prev.instructions,
        steps: [...prev.instructions.steps, { ...newStep }]
      }
    }));
    setNewStep({ title: '', description: '', required: true });
  }

  function removeStep(index: number) {
    setFormData(prev => ({
      ...prev,
      instructions: {
        ...prev.instructions,
        steps: prev.instructions.steps.filter((_, i) => i !== index)
      }
    }));
  }

  function addSubtask() {
    if (!newSubtask.title) return;
    setFormData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, { ...newSubtask }]
    }));
    setNewSubtask({ title: '', description: '', reward_amount: '0', submission_fee_sats: '0' });
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
      const payload = {
        ...formData,
        reward_amount: parseInt(formData.reward_amount),
        target_completions: parseInt(formData.target_completions),
        submission_fee_sats: parseInt(formData.submission_fee_sats),
        subtasks: formData.subtasks.map((st, i) => ({
          ...st,
          order: i + 1,
          reward_amount: parseInt(st.reward_amount),
          submission_fee_sats: parseInt(st.submission_fee_sats),
          is_installment: true
        }))
      };

      const response = await TaskService.createTask(payload);

      if (response.data) {
        toast({ title: "Objective Propagated", description: `"${formData.title}" is live for node signals.` });
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
             <Zap className="w-3 h-3" /> Micro Gig Initiation
          </div>
          <h1 className="text-4xl font-headline font-bold">Initiate Mission</h1>
          <p className="text-muted-foreground">Define structured electronic jobs for the decentralized workforce.</p>
        </div>
      </header>

      <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all",
              step === s ? "bg-primary text-white neon-glow-primary shadow-lg shadow-primary/20" : 
              step > s ? "bg-emerald-500 text-white" : "bg-white/5 text-muted-foreground"
            )}>
              {step > s ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
            {s < 5 && <div className={cn("w-12 h-px", step > s ? "bg-emerald-500" : "bg-white/10")} />}
          </div>
        ))}
      </div>

      <Card className="glass-card border-none overflow-hidden rounded-[2.5rem]">
        <CardContent className="p-10">
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <h3 className="text-3xl font-headline font-bold">1. Core Intent</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Gig Title</Label>
                  <Input placeholder="e.g. Audit Node Specification" className="h-14 bg-black/40 border-white/5 text-lg rounded-2xl" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Mission Narrative</Label>
                  <Textarea placeholder="Describe the technical mission scope..." className="min-h-[160px] bg-black/40 border-white/5 rounded-3xl p-6 leading-relaxed" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">External Protocol URL</Label>
                  <Input placeholder="https://..." className="h-12 bg-black/40 border-white/5 rounded-xl" value={formData.external_url} onChange={(e) => setFormData({...formData, external_url: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button className="rounded-2xl h-14 px-10 font-bold bg-primary neon-glow-primary shadow-xl shadow-primary/20 text-lg" onClick={() => setStep(2)}>Build Instructions</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-headline font-bold">2. Technical Instructions</h3>
                <Button variant="ghost" size="sm" className="text-primary gap-2 h-10 px-4 rounded-xl hover:bg-primary/10 font-bold text-xs uppercase tracking-widest" onClick={handleAIAssist} disabled={isGenerating}>
                  <Sparkles className="w-4 h-4" /> {isGenerating ? "Synthesizing..." : "AI Intelligence Assist"}
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                   <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Instruction Summary</Label>
                   <Input placeholder="Brief overview for the worker..." className="bg-black/40 border-white/5 rounded-xl h-12" value={formData.instructions.summary} onChange={(e) => setFormData({...formData, instructions: {...formData.instructions, summary: e.target.value}})} />
                </div>

                <div className="space-y-4">
                   <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Protocol Steps (Guide)</Label>
                   <div className="space-y-3">
                      {formData.instructions.steps.map((s, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl animate-in zoom-in-95">
                           <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{i+1}</div>
                           <div className="flex-1">
                              <p className="text-sm font-bold">{s.title}</p>
                              <p className="text-xs text-muted-foreground">{s.description}</p>
                           </div>
                           <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => removeStep(i)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      ))}
                      <div className="p-6 bg-black/40 border-2 border-dashed border-white/10 rounded-3xl space-y-4">
                         <Input placeholder="Step title..." className="bg-white/5 border-white/10 h-11" value={newStep.title} onChange={(e) => setNewStep({...newStep, title: e.target.value})} />
                         <Textarea placeholder="Detailed description..." className="bg-white/5 border-white/10 min-h-[80px]" value={newStep.description} onChange={(e) => setNewStep({...newStep, description: e.target.value})} />
                         <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10 font-bold gap-2" onClick={addStep}><Plus className="w-4 h-4" /> Add Step</Button>
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(1)} className="font-bold text-xs uppercase tracking-widest">Previous</Button>
                <Button className="rounded-2xl h-14 px-10 font-bold bg-primary neon-glow-primary shadow-xl shadow-primary/20 text-lg" onClick={() => setStep(3)}>Define Installments</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
               <div className="space-y-2">
                <h3 className="text-3xl font-headline font-bold">3. Protocol Installments</h3>
                <p className="text-sm text-muted-foreground">Decompose the mission into multiple billable installments. Yields are settled per verified proof.</p>
              </div>

              <div className="space-y-6">
                 {formData.subtasks.map((st, i) => (
                   <div key={i} className="p-6 glass-card rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all border border-white/5">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">{i+1}</div>
                         <div className="space-y-1">
                            <h4 className="font-bold text-white">{st.title}</h4>
                            <div className="flex items-center gap-3">
                               <Badge className="bg-emerald-500/10 text-emerald-400 border-none uppercase text-[8px] tracking-widest font-bold">{st.reward_amount} SAT Yield</Badge>
                               {parseInt(st.submission_fee_sats) > 0 && (
                                 <Badge variant="outline" className="text-[8px] border-white/10 text-muted-foreground uppercase">{st.submission_fee_sats} SAT Fee</Badge>
                               )}
                            </div>
                         </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive h-10 w-10" onClick={() => removeSubtask(i)}><Trash2 className="w-5 h-5" /></Button>
                   </div>
                 ))}

                 <div className="p-8 bg-black/40 border-2 border-dashed border-white/10 rounded-[2.5rem] space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Installment Title</Label>
                          <Input placeholder="e.g. Phase 1 Audit" className="bg-white/5 border-white/10 h-12" value={newSubtask.title} onChange={(e) => setNewSubtask({...newSubtask, title: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Installment Yield (SAT)</Label>
                          <Input type="number" className="bg-white/5 border-white/10 h-12 font-bold text-emerald-400" value={newSubtask.reward_amount} onChange={(e) => setNewSubtask({...newSubtask, reward_amount: e.target.value})} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Optional Specific Fee (SAT)</Label>
                       <Input type="number" placeholder="0 = inherit parent" className="bg-white/5 border-white/10 h-11 text-xs" value={newSubtask.submission_fee_sats} onChange={(e) => setNewSubtask({...newSubtask, submission_fee_sats: e.target.value})} />
                    </div>
                    <Textarea placeholder="Technical requirement for this installment..." className="bg-white/5 border-white/10 min-h-[80px] text-sm" value={newSubtask.description} onChange={(e) => setNewSubtask({...newSubtask, description: e.target.value})} />
                    <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10 font-bold h-12 gap-2 rounded-xl" onClick={addSubtask}><Plus className="w-4 h-4" /> Add billable installment</Button>
                 </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(2)} className="font-bold text-xs uppercase tracking-widest">Previous</Button>
                <Button className="rounded-2xl h-14 px-10 font-bold bg-primary neon-glow-primary shadow-xl shadow-primary/20 text-lg" onClick={() => setStep(4)}>Audit Parameters</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <h3 className="text-3xl font-headline font-bold">4. Verification Parameters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Proof Signal Class</Label>
                    <Select value={formData.proof_method} onValueChange={(val: ProofMethod) => setFormData({...formData, proof_method: val})}>
                       <SelectTrigger className="bg-black/40 border-white/5 h-14 rounded-2xl"><SelectValue /></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="text">Technical Narrative</SelectItem>
                          <SelectItem value="screenshot">Verified Screenshot</SelectItem>
                          <SelectItem value="code_snippet">Code Audit</SelectItem>
                          <SelectItem value="link">URL Protocol Signal</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Expertise Taxonomy</Label>
                    <Select value={formData.category_id} onValueChange={(val) => setFormData({...formData, category_id: val})}>
                       <SelectTrigger className="bg-black/40 border-white/5 h-14 rounded-2xl"><SelectValue placeholder="Select Category" /></SelectTrigger>
                       <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Audit Guidelines (For Validators)</Label>
                <Textarea placeholder="Tell validators exactly how to verify technical proof..." className="min-h-[140px] bg-black/40 border-white/5 rounded-2xl p-6 italic leading-relaxed" value={formData.validator_guidelines} onChange={(e) => setFormData({...formData, validator_guidelines: e.target.value})} />
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(3)} className="font-bold text-xs uppercase tracking-widest">Previous</Button>
                <Button className="rounded-2xl h-14 px-10 font-bold bg-primary neon-glow-primary shadow-xl shadow-primary/20 text-lg" onClick={() => setStep(5)}>Financial Parameters</Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <h3 className="text-3xl font-headline font-bold">5. Financial Escrow</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-black/40 border-white/5 p-8 space-y-6 rounded-[2rem]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary"><BadgeDollarSign className="w-7 h-7" /></div>
                    <div><h4 className="font-bold text-lg">Yield Reward</h4><p className="text-[10px] text-muted-foreground uppercase tracking-widest">Base Rate / Node</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Reward (SAT)</Label>
                      <Input 
                        type="number" 
                        disabled={formData.subtasks.length > 0}
                        className="h-14 bg-background border-white/10 font-bold text-xl rounded-xl disabled:opacity-50" 
                        value={formData.subtasks.length > 0 ? formData.subtasks.reduce((a, b) => a + parseInt(b.reward_amount), 0).toString() : formData.reward_amount} 
                        onChange={(e) => setFormData({...formData, reward_amount: e.target.value})} 
                      />
                      {formData.subtasks.length > 0 && <p className="text-[8px] text-muted-foreground uppercase tracking-tighter">Locked to installment sum</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Target Slots</Label>
                      <Input type="number" className="h-14 bg-background border-white/10 text-lg rounded-xl" value={formData.target_completions} onChange={(e) => setFormData({...formData, target_completions: e.target.value})} />
                    </div>
                  </div>
                  <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                     <span className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest"><Lock className="w-4 h-4 text-emerald-500" /> Escrow Fund</span>
                     <span className="text-2xl font-headline font-bold text-emerald-400">{totalEscrow.toLocaleString()} SAT</span>
                  </div>
                </Card>

                <Card className="bg-black/40 border-white/5 p-8 space-y-6 rounded-[2rem]">
                   <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary"><Layers className="w-7 h-7" /></div>
                    <div><h4 className="font-bold text-lg">Worker Parameters</h4><p className="text-[10px] text-muted-foreground uppercase tracking-widest">Signal Logistics</p></div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Submission Signal Fee (SAT)</Label>
                    <Input type="number" className="h-14 bg-background border-white/10 font-bold text-xl rounded-xl" value={formData.submission_fee_sats} onChange={(e) => setFormData({...formData, submission_fee_sats: e.target.value})} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                     <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Upfront Settlement</span>
                     <button 
                        onClick={() => setFormData({...formData, submitter_pays_fee_upfront: !formData.submitter_pays_fee_upfront})}
                        className={cn("h-8 px-4 rounded-lg font-bold text-[10px] uppercase transition-all", formData.submitter_pays_fee_upfront ? "bg-primary text-white" : "bg-white/10 text-muted-foreground")}
                     >
                        {formData.submitter_pays_fee_upfront ? 'ENABLED' : 'DEFERRED TO PAYOUT'}
                     </button>
                  </div>
                </Card>
              </div>

              <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Escrow Protocol Authorization</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By propagating this objective, you authorize the platform to debit <strong className="text-white">{totalEscrow.toLocaleString()} SAT</strong> from your liquid balance to fund the objective escrow. Yields are non-reversible once proof is verified.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(4)} className="font-bold text-xs uppercase tracking-widest">Previous</Button>
                <Button className="rounded-2xl h-16 px-12 font-bold bg-primary neon-glow-primary shadow-xl shadow-primary/20 text-xl" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Propagating Signal...
                    </div>
                  ) : 'Propagate Mission Objective'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
