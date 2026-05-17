"use client"

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Briefcase, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  Plus, 
  X,
  Target,
  BadgeDollarSign,
  Link as LinkIcon,
  Calculator,
  Lock,
  Wallet,
  Settings,
  FileText,
  Loader2
} from 'lucide-react';
import { generateJobProjectDescription } from '@/ai/flows/job-project-description-generator';
import { suggestSkillsAndCategories } from '@/ai/flows/automated-skill-category-suggestion';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ProofMethod } from '@/lib/types';
import { ProjectService } from '@/services/project-service';
import { TaskService } from '@/services/task-service';

type ListingType = 'task' | 'project';

export default function CreateListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [listingType, setListingType] = useState<ListingType>('project');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    instructions: '',
    validatorGuidelines: '',
    category_id: '',
    reward_amount: '500',
    budget_min: '50000',
    budget_max: '150000',
    budget_type: 'fixed' as 'fixed' | 'hourly',
    difficulty: 'medium',
    experience_level: 'intermediate',
    proof_method: 'text' as ProofMethod,
    external_url: '',
    external_url_label: '',
    target_completions: '10',
    skills: [] as string[],
    newSkill: ''
  });

  const totalEscrow = useMemo(() => {
    if (listingType === 'project') return 0;
    const reward = parseInt(formData.reward_amount) || 0;
    const slots = parseInt(formData.target_completions) || 0;
    return reward * slots;
  }, [formData.reward_amount, formData.target_completions, listingType]);

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
        requirements: genResult.requirements.map(r => `• ${r}`).join('\n'),
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

  function addSkill() {
    if (formData.newSkill && !formData.skills.includes(formData.newSkill)) {
      setFormData({ ...formData, skills: [...formData.skills, formData.newSkill], newSkill: '' });
    }
  }

  function removeSkill(skill: string) {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      let response;
      if (listingType === 'project') {
        response = await ProjectService.createProject({
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          budget_min: parseInt(formData.budget_min),
          budget_max: parseInt(formData.budget_max),
          budget_type: formData.budget_type,
          experience_level: formData.experience_level,
        });
      } else {
        response = await TaskService.createTask({
          title: formData.title,
          description: formData.description,
          short_description: formData.description.substring(0, 200),
          reward_amount: parseInt(formData.reward_amount),
          target_completions: parseInt(formData.target_completions),
          proof_method: formData.proof_method,
          difficulty: formData.difficulty as any,
          validator_guidelines: formData.validatorGuidelines,
        });
      }

      if (response.data) {
        toast({ 
          title: "Listing Propagated", 
          description: `Objective "${formData.title}" is now live on the L2 protocol.` 
        });
        router.push('/my-projects');
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
          <h1 className="text-4xl font-headline font-bold">Initiate Objective</h1>
          <p className="text-muted-foreground">Define your professional requirements for global network nodes.</p>
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
              <div className="space-y-4">
                <h3 className="text-2xl font-headline font-bold">1. Select Objective Class</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setListingType('task')}
                    className={cn(
                      "p-6 rounded-2xl border-2 text-left transition-all group relative overflow-hidden h-40",
                      listingType === 'task' ? "border-primary bg-primary/5" : "border-white/5 bg-white/5 hover:border-white/10"
                    )}
                  >
                    <Zap className={cn("w-8 h-8 mb-4", listingType === 'task' ? "text-primary" : "text-muted-foreground")} />
                    <h4 className="font-bold text-lg">Micro Gig</h4>
                    <p className="text-xs text-muted-foreground mt-1">High-volume, quick verification tasks for rapid scaling.</p>
                    {listingType === 'task' && <div className="absolute top-4 right-4"><CheckCircle className="w-5 h-5 text-primary" /></div>}
                  </button>
                  <button 
                    onClick={() => setListingType('project')}
                    className={cn(
                      "p-6 rounded-2xl border-2 text-left transition-all group relative overflow-hidden h-40",
                      listingType === 'project' ? "border-secondary bg-secondary/5" : "border-white/5 bg-white/5 hover:border-white/10"
                    )}
                  >
                    <Briefcase className={cn("w-8 h-8 mb-4", listingType === 'project' ? "text-secondary" : "text-muted-foreground")} />
                    <h4 className="font-bold text-lg">Professional Project</h4>
                    <p className="text-xs text-muted-foreground mt-1">Complex, milestone-based objectives for specialists.</p>
                    {listingType === 'project' && <div className="absolute top-4 right-4"><CheckCircle className="w-5 h-5 text-secondary" /></div>}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Objective Title</Label>
                <Input 
                  placeholder="e.g. Audit L2 Bridge Architecture"
                  className="h-14 bg-background/50 border-white/5 text-lg"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button className="rounded-xl h-12 px-8 font-bold" onClick={() => setStep(2)}>Next Configuration</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-headline font-bold">2. Technical Configuration</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary gap-2 hover:bg-primary/10 h-8"
                  onClick={handleAIAssist}
                  disabled={isGenerating}
                >
                  <Sparkles className="w-4 h-4" /> {isGenerating ? "Synthesizing..." : "AI Enhancement"}
                </Button>
              </div>

              <div className="space-y-4">
                <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Technical Scope & Description</Label>
                <Textarea 
                  placeholder="Describe the scope, deliverables, and technical requirements..."
                  className="min-h-[120px] bg-background/50 border-white/5"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {listingType === 'project' && (
                <div className="space-y-4">
                  <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Technical Requirements (One per line)</Label>
                  <Textarea 
                    placeholder="• Rust/LND expertise required..."
                    className="min-h-[100px] bg-background/50 border-white/5 italic"
                    value={formData.requirements}
                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Execution Instructions</Label>
                  <Textarea 
                    placeholder="Step-by-step instructions for nodes..."
                    className="min-h-[100px] bg-background/50 border-white/5"
                    value={formData.instructions}
                    onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Skill Nodes Required</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. React" 
                      className="bg-background/50 border-white/5"
                      value={formData.newSkill}
                      onChange={(e) => setFormData({...formData, newSkill: e.target.value})}
                      onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button variant="outline" size="icon" onClick={addSkill} className="rounded-lg"><Plus className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map(skill => (
                      <Badge key={skill} className="bg-white/5 text-muted-foreground border-white/5 px-3 py-1 gap-1">
                        {skill}
                        <button onClick={() => removeSkill(skill)}><X className="w-3 h-3 hover:text-white" /></button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                 <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Experience Class</Label>
                  <Select value={listingType === 'task' ? formData.difficulty : formData.experience_level} onValueChange={(val) => {
                    if (listingType === 'task') setFormData({...formData, difficulty: val});
                    else setFormData({...formData, experience_level: val});
                  }}>
                    <SelectTrigger className="bg-background/50 border-white/5 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="intermediate">Intermediate Node</SelectItem>
                      <SelectItem value="expert">Expert / Senior Node</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Compensation Model</Label>
                  <Select value={formData.budget_type} onValueChange={(val: any) => setFormData({...formData, budget_type: val})}>
                    <SelectTrigger className="bg-background/50 border-white/5 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price Project</SelectItem>
                      <SelectItem value="hourly">Hourly Strategic Node</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(1)}>Previous</Button>
                <Button className="rounded-xl h-12 px-8 font-bold" onClick={() => setStep(3)}>Final Parameters</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <h3 className="text-2xl font-headline font-bold">3. Financials & Protocol Signal</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white/5 border-white/5 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <BadgeDollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold">Protocol Compensation</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Multi-sig Secure</p>
                    </div>
                  </div>
                  
                  {listingType === 'task' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Reward (SAT)</Label>
                          <Input 
                            type="number" 
                            className="h-12 bg-background border-white/5 font-bold"
                            value={formData.reward_amount}
                            onChange={(e) => setFormData({...formData, reward_amount: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Target Slots</Label>
                          <Input 
                            type="number" 
                            className="h-12 bg-background border-white/5"
                            value={formData.target_completions}
                            onChange={(e) => setFormData({...formData, target_completions: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                          <span className="flex items-center gap-1.5 uppercase tracking-widest"><Calculator className="w-3 h-3" /> Escrow Formula</span>
                          <span>{formData.reward_amount} × {formData.target_completions}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-500" /> Multi-sig Funding</span>
                          <span className="text-xl font-headline font-bold text-emerald-400">{(parseInt(formData.reward_amount) * parseInt(formData.target_completions)).toLocaleString()} SAT</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Min Budget (SAT)</Label>
                        <Input 
                          type="number" 
                          placeholder="50000" 
                          className="h-12 bg-background border-white/5"
                          value={formData.budget_min}
                          onChange={(e) => setFormData({...formData, budget_min: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Max Budget (SAT)</Label>
                        <Input 
                          type="number" 
                          placeholder="150000" 
                          className="h-12 bg-background border-white/5"
                          value={formData.budget_max}
                          onChange={(e) => setFormData({...formData, budget_max: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </Card>

                <Card className="bg-white/5 border-white/5 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold">Protocol Signal</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Verification Model</p>
                    </div>
                  </div>

                  {listingType === 'task' ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Verification Signal Method</Label>
                        <Select value={formData.proof_method} onValueChange={(val: ProofMethod) => setFormData({...formData, proof_method: val})}>
                          <SelectTrigger className="bg-background border-white/5 h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Narrative Keywords</SelectItem>
                            <SelectItem value="code_snippet">Code Snippet Audit</SelectItem>
                            <SelectItem value="file">Technical File Verification</SelectItem>
                            <SelectItem value="link">URL Propagation</SelectItem>
                            <SelectItem value="qr_scan">QR Protocol Scan</SelectItem>
                            <SelectItem value="gps">GPS Location Signal</SelectItem>
                            <SelectItem value="image">Visual Proof (Screenshot)</SelectItem>
                            <SelectItem value="video">Video Documentation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs flex items-center gap-2">External Mission Node <LinkIcon className="w-3 h-3" /></Label>
                        <Input 
                          placeholder="https://..." 
                          className="h-10 bg-background border-white/5"
                          value={formData.external_url}
                          onChange={(e) => setFormData({...formData, external_url: e.target.value})}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Expected Timeline</Label>
                        <Input placeholder="e.g. 4 Protocol Weeks" className="h-12 bg-background border-white/5" />
                      </div>
                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                          Milestone-based release is enabled by default for professional projects.
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
                <Wallet className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Escrow Authorization Required</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By initiating this objective, you authorize the GigaLight Protocol to debit <strong>{listingType === 'task' ? totalEscrow.toLocaleString() : 'the final accepted budget'} SAT</strong> from your available liquidity to fund the secure multi-sig escrow node.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(2)}>Previous</Button>
                <Button 
                  className="rounded-xl h-14 px-12 font-bold bg-primary neon-glow-primary" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Propagating...
                    </div>
                  ) : 'Deploy & Fund Objective'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
