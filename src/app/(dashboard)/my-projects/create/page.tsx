
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle, 
  Plus, 
  X,
  BadgeDollarSign,
  Lock,
  Wallet,
  Loader2,
  Cpu,
  Shield
} from 'lucide-react';
import { generateJobProjectDescription } from '@/ai/flows/job-project-description-generator';
import { suggestSkillsAndCategories } from '@/ai/flows/automated-skill-category-suggestion';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ProjectService } from '@/services/project-service';
import { SkillService } from '@/services/skill-service';
import { Skill } from '@/lib/types';

export default function CreateProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    budget_min: '50000',
    budget_max: '150000',
    budget_type: 'fixed' as 'fixed' | 'hourly',
    experience_level: 'intermediate',
    skills: [] as string[],
    newSkill: ''
  });

  useEffect(() => {
    async function fetchSkills() {
      try {
        const skillRes = await SkillService.listSkills({ page_size: 20 });
        if (skillRes.data?.results) setAvailableSkills(skillRes.data.results);
      } catch (e) {
        console.error("Failed to fetch protocol taxonomy");
      }
    }
    fetchSkills();
  }, []);

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
        skills: [...new Set([...prev.skills, ...skillResult.suggestedSkills])],
      }));
      
      toast({ title: "Intelligence Applied", description: "AI has professionalized your project documentation." });
    } catch (e) {
      toast({ variant: "destructive", title: "Interface Error", description: "AI node interface timeout." });
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
      const response = await ProjectService.createProject({
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        budget_min: parseInt(formData.budget_min),
        budget_max: parseInt(formData.budget_max),
        budget_type: formData.budget_type,
        experience_level: formData.experience_level,
        skills: formData.skills,
      });

      if (response.data) {
        toast({ title: "Project Propagated", description: `"${formData.title}" is live for node signals.` });
        router.push('/my-projects');
      } else {
        toast({ variant: "destructive", title: "Deployment Error", description: response.error || "Could not sync project." });
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
           <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-[10px] mb-1">
             <Briefcase className="w-3 h-3" /> Strategic Project Initiation
          </div>
          <h1 className="text-4xl font-headline font-bold">Initiate Objective</h1>
          <p className="text-muted-foreground">Define milestone-based professional requirements for elite network nodes.</p>
        </div>
      </header>

      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all",
              step === s ? "bg-secondary text-white neon-glow-secondary" : 
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
              <h3 className="text-2xl font-headline font-bold">1. Strategic Scope</h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Project Title</Label>
                  <Input placeholder="e.g. Enterprise L2 Payroll Architecture" className="h-14 bg-background/50 border-white/5 text-lg" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Mission Documentation</Label>
                  <Textarea placeholder="Describe the scope, deliverables, and enterprise requirements..." className="min-h-[180px] bg-background/50 border-white/5" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button className="rounded-xl h-12 px-8 font-bold bg-secondary neon-glow-secondary" onClick={() => setStep(2)}>Define Requirements</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-headline font-bold">2. Technical Specification</h3>
                <Button variant="ghost" size="sm" className="text-secondary gap-2" onClick={handleAIAssist} disabled={isGenerating}>
                  <Sparkles className="w-4 h-4" /> {isGenerating ? "Synthesizing..." : "AI Intelligence"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Node Experience Class</Label>
                    <Select value={formData.experience_level} onValueChange={(val) => setFormData({...formData, experience_level: val})}>
                       <SelectTrigger className="bg-background/50 border-white/5 h-12"><SelectValue /></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="intermediate">Intermediate Node</SelectItem>
                          <SelectItem value="expert">Expert/Senior Node</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-4">
                    <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Expertise Node Taxonomy</Label>
                    <div className="flex gap-2">
                       <Input placeholder="Add skill..." className="bg-background/50 border-white/5" value={formData.newSkill} onChange={(e) => setFormData({...formData, newSkill: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
                       <Button variant="outline" size="icon" onClick={() => addSkill()} className="rounded-lg shrink-0"><Plus className="w-4 h-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                       {formData.skills.map(s => <Badge key={s} className="bg-secondary/10 text-secondary border-secondary/20 px-3 py-1 gap-1.5 font-bold uppercase text-[9px] tracking-widest"><Cpu className="w-2.5 h-2.5" />{s}<button onClick={() => removeSkill(s)}><X className="w-3 h-3" /></button></Badge>)}
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Strategic Requirements (Verified Parameters)</Label>
                <Textarea placeholder="• Rust/LND expertise required..." className="min-h-[120px] bg-background/50 border-white/5 italic" value={formData.requirements} onChange={(e) => setFormData({...formData, requirements: e.target.value})} />
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(1)}>Previous</Button>
                <Button className="rounded-xl h-12 px-8 font-bold" onClick={() => setStep(3)}>Settlement Logic</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <h3 className="text-2xl font-headline font-bold">3. Financial Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white/5 border-white/5 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary"><BadgeDollarSign className="w-6 h-6" /></div>
                    <div><h4 className="font-bold">Yield Range</h4><p className="text-[10px] text-muted-foreground uppercase tracking-widest">Settlement Scale</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Min Budget (SAT)</Label>
                      <Input type="number" className="h-12 bg-background border-white/5 font-bold" value={formData.budget_min} onChange={(e) => setFormData({...formData, budget_min: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Max Budget (SAT)</Label>
                      <Input type="number" className="h-12 bg-background border-white/5 font-bold" value={formData.budget_max} onChange={(e) => setFormData({...formData, budget_max: e.target.value})} />
                    </div>
                  </div>
                </Card>

                <Card className="bg-white/5 border-white/5 p-6 space-y-4">
                   <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Shield className="w-6 h-6" /></div>
                    <div><h4 className="font-bold">Protocol Safety</h4><p className="text-[10px] text-muted-foreground uppercase tracking-widest">Escrow Logic</p></div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-xs">Compensation Model</Label>
                    <Select value={formData.budget_type} onValueChange={(val: any) => setFormData({...formData, budget_type: val})}>
                      <SelectTrigger className="bg-background border-white/5 h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Price Milestone</SelectItem>
                        <SelectItem value="hourly">Hourly Strategic Node</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>
              </div>

              <div className="bg-secondary/5 p-6 rounded-3xl border border-secondary/10 flex items-start gap-4">
                <Lock className="w-6 h-6 text-secondary shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Escrow Protocol Enabled</h4>
                  <p className="text-xs text-muted-foreground">Milestone-based release is enabled by default. Funding will be locked in multi-sig custody once a node signal is accepted.</p>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(2)}>Previous</Button>
                <Button className="rounded-xl h-14 px-12 font-bold bg-secondary neon-glow-secondary" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Propagate Strategic Objective'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
