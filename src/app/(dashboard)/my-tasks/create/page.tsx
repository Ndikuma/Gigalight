
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
  Link as LinkIcon,
  Calculator,
  Lock,
  Wallet,
  Loader2,
  Cpu,
  Layers
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
    external_url: '',
    target_completions: '10',
    skills: [] as string[],
    newSkill: ''
  });

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

  const totalEscrow = useMemo(() => {
    const reward = parseInt(formData.reward_amount) || 0;
    const slots = parseInt(formData.target_completions) || 0;
    return reward * slots;
  }, [formData.reward_amount, formData.target_completions]);

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
      
      toast({ title: "Intelligence Applied", description: "Your listing has been professionalized by the AI agent." });
    } catch (e) {
      toast({ variant: "destructive", title: "Interface Error", description: "The AI node is currently out of reach." });
    } finally {
      setIsGenerating(false);
    }
  }

  function addSkill(skillName?: string) {
    const skillToAdd = (skillName || formData.newSkill).trim();
    if (skillToAdd && !formData.skills.includes(skillToAdd)) {
      setFormData({ ...formData, skills: [...formData.skills, skillToAdd], newSkill: '' });
    }
  }

  function removeSkill(skill: string) {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const response = await TaskService.createTask({
        title: formData.title,
        description: formData.description,
        short_description: formData.description.substring(0, 200),
        reward_amount: parseInt(formData.reward_amount),
        target_completions: parseInt(formData.target_completions),
        proof_method: formData.proof_method,
        difficulty: formData.difficulty as any,
        validator_guidelines: formData.validatorGuidelines,
        category: formData.category_id,
      });

      if (response.data) {
        toast({ 
          title: "Gig Propagated", 
          description: `Objective "${formData.title}" is now live on the L2 protocol.` 
        });
        router.push('/my-tasks');
      } else {
        toast({
          variant: "destructive",
          title: "Deployment Error",
          description: response.error || "Could not synchronize objective with the network.",
        });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Network Error", description: "Critical interface timeout during propagation." });
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
          <p className="text-muted-foreground">Deploy high-volume, quick verification tasks for global network nodes.</p>
        </div>
      </header>

      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all",
              step === s ? "bg-primary text-white neon-glow-primary" : 
              step > s ? "bg-emerald-500 text-white" : "bg-white/5 text-muted-foreground"
            )}>
              {step > s ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
            {s < 3 && <div className={cn("w-12 h-px", step > s ? "bg-emerald-500" : "bg-white/10")} />}
          </div>
        ))}
      </div>

      <Card className="glass-card border-none overflow-hidden">
        <CardContent className="p-8">
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <h3 className="text-2xl font-headline font-bold">1. Objective Scope</h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Gig Title</Label>
                  <Input 
                    placeholder="e.g. Audit L2 Bridge Documentation"
                    className="h-14 bg-background/50 border-white/5 text-lg"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Technical Scope</Label>
                  <Textarea 
                    placeholder="Describe the technical requirements for node completion..."
                    className="min-h-[150px] bg-background/50 border-white/5"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button className="rounded-xl h-12 px-8 font-bold bg-primary neon-glow-primary" onClick={() => setStep(2)}>Configure Parameters</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-headline font-bold">2. Configuration</h3>
                <Button variant="ghost" size="sm" className="text-primary gap-2" onClick={handleAIAssist} disabled={isGenerating}>
                  <Sparkles className="w-4 h-4" /> {isGenerating ? "Synthesizing..." : "AI Assist"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Protocol Taxonomy</Label>
                    <Select value={formData.category_id} onValueChange={(val) => setFormData({...formData, category_id: val})}>
                       <SelectTrigger className="bg-background/50 border-white/5 h-12"><SelectValue placeholder="Select Category" /></SelectTrigger>
                       <SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-4">
                    <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Difficulty Class</Label>
                    <Select value={formData.difficulty} onValueChange={(val) => setFormData({...formData, difficulty: val})}>
                       <SelectTrigger className="bg-background/50 border-white/5 h-12"><SelectValue /></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Proof Guidelines</Label>
                <Textarea 
                  placeholder="Tell validators how to verify proof..."
                  className="min-h-[100px] bg-background/50 border-white/5"
                  value={formData.validatorGuidelines}
                  onChange={(e) => setFormData({...formData, validatorGuidelines: e.target.value})}
                />
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(1)}>Previous</Button>
                <Button className="rounded-xl h-12 px-8 font-bold" onClick={() => setStep(3)}>Financial Settlement</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <h3 className="text-2xl font-headline font-bold">3. Financial Escrow</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white/5 border-white/5 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><BadgeDollarSign className="w-6 h-6" /></div>
                    <div><h4 className="font-bold">Reward Signal</h4><p className="text-[10px] text-muted-foreground uppercase tracking-widest">Multi-sig Secure</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Reward (SAT)</Label>
                      <Input type="number" className="h-12 bg-background border-white/5 font-bold" value={formData.reward_amount} onChange={(e) => setFormData({...formData, reward_amount: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Slots</Label>
                      <Input type="number" className="h-12 bg-background border-white/5" value={formData.target_completions} onChange={(e) => setFormData({...formData, target_completions: e.target.value})} />
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                     <span className="text-sm font-bold flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-500" /> Escrow Total</span>
                     <span className="text-xl font-headline font-bold text-emerald-400">{totalEscrow.toLocaleString()} SAT</span>
                  </div>
                </Card>

                <Card className="bg-white/5 border-white/5 p-6 space-y-4">
                   <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><ShieldCheck className="w-6 h-6" /></div>
                    <div><h4 className="font-bold">Proof Method</h4><p className="text-[10px] text-muted-foreground uppercase tracking-widest">Verification Model</p></div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-xs">Verification Signal Method</Label>
                    <Select value={formData.proof_method} onValueChange={(val: ProofMethod) => setFormData({...formData, proof_method: val})}>
                      <SelectTrigger className="bg-background border-white/5 h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Narrative Keywords</SelectItem>
                        <SelectItem value="code_snippet">Code Snippet Audit</SelectItem>
                        <SelectItem value="file">Technical File</SelectItem>
                        <SelectItem value="link">URL Propagation</SelectItem>
                        <SelectItem value="image">Screenshot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>
              </div>

              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-start gap-4">
                <Wallet className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Escrow Authorization</h4>
                  <p className="text-xs text-muted-foreground">Authorizing deployment will debit <strong>{totalEscrow.toLocaleString()} SAT</strong> from your available liquidity to fund the secure multi-sig escrow node.</p>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(2)}>Previous</Button>
                <Button className="rounded-xl h-14 px-12 font-bold bg-primary neon-glow-primary" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Deploy & Fund Gig'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
