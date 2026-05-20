
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
  Shield,
  Search,
  Check
} from 'lucide-react';
import { generateJobProjectDescription } from '@/ai/flows/job-project-description-generator';
import { suggestSkillsAndCategories } from '@/ai/flows/automated-skill-category-suggestion';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ProjectService } from '@/services/project-service';
import { SkillService } from '@/services/skill-service';
import { Skill } from '@/lib/types';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function CreateProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    budget_min: '50000',
    budget_max: '150000',
    budget_type: 'fixed' as 'fixed' | 'hourly',
    experience_level: 'intermediate',
    skills: [] as string[],
  });

  useEffect(() => {
    async function fetchSkills() {
      setIsLoadingSkills(true);
      try {
        const skillRes = await SkillService.listSkills({ page_size: 100 });
        if (skillRes.data?.results) {
          setAvailableSkills(skillRes.data.results);
        }
      } catch (e) {
        console.error("Failed to fetch protocol taxonomy");
      } finally {
        setIsLoadingSkills(false);
      }
    }
    fetchSkills();
  }, []);

  const filteredAvailableSkills = availableSkills.filter(s => 
    s.name.toLowerCase().includes(skillSearch.toLowerCase()) && 
    !formData.skills.includes(s.name)
  );

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

  function addSkill(skillName: string) {
    if (skillName && !formData.skills.includes(skillName)) {
      setFormData({ ...formData, skills: [...formData.skills, skillName] });
      setSkillSearch('');
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

      <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all",
              step === s ? "bg-secondary text-white neon-glow-secondary shadow-lg shadow-secondary/20" : 
              step > s ? "bg-emerald-500 text-white" : "bg-white/5 text-muted-foreground"
            )}>
              {step > s ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
            {s < 3 && <div className={cn("w-12 h-px", step > s ? "bg-emerald-500" : "bg-white/10")} />}
          </div>
        ))}
      </div>

      <Card className="glass-card border-none overflow-hidden rounded-[2.5rem]">
        <CardContent className="p-10">
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <h3 className="text-3xl font-headline font-bold">1. Strategic Scope</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Project Title</Label>
                  <Input placeholder="e.g. Enterprise L2 Payroll Architecture" className="h-14 bg-black/40 border-white/5 text-lg rounded-2xl" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Mission Documentation</Label>
                  <Textarea placeholder="Describe the scope, deliverables, and enterprise requirements..." className="min-h-[220px] bg-black/40 border-white/5 rounded-3xl p-6 leading-relaxed" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button className="rounded-2xl h-14 px-10 font-bold bg-secondary neon-glow-secondary shadow-xl shadow-secondary/20 text-lg" onClick={() => setStep(2)}>Define Requirements</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-headline font-bold">2. Technical Specification</h3>
                <Button variant="ghost" size="sm" className="text-secondary gap-2 h-10 px-4 rounded-xl hover:bg-secondary/10 font-bold text-xs uppercase tracking-widest" onClick={handleAIAssist} disabled={isGenerating}>
                  <Sparkles className="w-4 h-4" /> {isGenerating ? "Synthesizing..." : "AI Intelligence Assist"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Node Experience Class</Label>
                    <Select value={formData.experience_level} onValueChange={(val) => setFormData({...formData, experience_level: val})}>
                       <SelectTrigger className="bg-black/40 border-white/5 h-14 rounded-2xl"><SelectValue /></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="intermediate">Intermediate Node</SelectItem>
                          <SelectItem value="expert">Expert/Senior Node</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Node Capability (Skills)</Label>
                    <div className="relative">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <div className="relative group cursor-pointer">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                                <Input 
                                   placeholder="Search skill signal..." 
                                   className="h-14 bg-black/40 border-white/5 pl-11 rounded-2xl focus:ring-secondary/40"
                                   value={skillSearch}
                                   onChange={(e) => setSkillSearch(e.target.value)}
                                />
                             </div>
                          </DropdownMenuTrigger>
                          {filteredAvailableSkills.length > 0 && (
                             <DropdownMenuContent className="w-[300px] bg-card border-white/10 max-h-[300px] overflow-y-auto shadow-2xl p-2" align="start">
                                {filteredAvailableSkills.map(skill => (
                                   <DropdownMenuItem 
                                      key={skill.id} 
                                      onClick={() => addSkill(skill.name)}
                                      className="rounded-lg p-3 cursor-pointer focus:bg-secondary/20 flex items-center justify-between group"
                                   >
                                      <div className="flex items-center gap-3">
                                         <Cpu className="w-4 h-4 text-muted-foreground group-hover:text-secondary" />
                                         <span className="font-bold text-sm">{skill.name}</span>
                                      </div>
                                      <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                   </DropdownMenuItem>
                                ))}
                             </DropdownMenuContent>
                          )}
                       </DropdownMenu>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3 min-h-[40px]">
                       {formData.skills.map(s => (
                          <Badge key={s} className="bg-secondary/10 text-secondary border-secondary/20 px-3 py-1.5 gap-2 font-bold uppercase text-[9px] tracking-widest animate-in zoom-in-95">
                             <Cpu className="w-3 h-3" />
                             {s}
                             <button onClick={() => removeSkill(s)} className="hover:text-white transition-colors">
                                <X className="w-3 h-3" />
                             </button>
                          </Badge>
                       ))}
                       {formData.skills.length === 0 && !isLoadingSkills && (
                          <p className="text-[10px] text-muted-foreground italic ml-1">No skill signals propagated yet.</p>
                       )}
                       {isLoadingSkills && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-1" />}
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Strategic Requirements (Verified Parameters)</Label>
                <Textarea placeholder="• Rust/LND expertise required..." className="min-h-[140px] bg-black/40 border-white/5 rounded-2xl p-6 italic leading-relaxed" value={formData.requirements} onChange={(e) => setFormData({...formData, requirements: e.target.value})} />
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(1)} className="font-bold text-xs uppercase tracking-widest">Previous</Button>
                <Button className="rounded-2xl h-14 px-10 font-bold bg-secondary neon-glow-secondary shadow-xl shadow-secondary/20 text-lg" onClick={() => setStep(3)}>Financial Parameters</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <h3 className="text-3xl font-headline font-bold">3. Financial Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-black/40 border-white/5 p-8 space-y-6 rounded-[2rem]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary"><BadgeDollarSign className="w-7 h-7" /></div>
                    <div><h4 className="font-bold text-lg">Yield Range</h4><p className="text-[10px] text-muted-foreground uppercase tracking-widest">Settlement Scale</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Min (SAT)</Label>
                      <Input type="number" className="h-14 bg-background border-white/10 font-bold text-xl rounded-xl" value={formData.budget_min} onChange={(e) => setFormData({...formData, budget_min: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Max (SAT)</Label>
                      <Input type="number" className="h-14 bg-background border-white/10 font-bold text-xl rounded-xl" value={formData.budget_max} onChange={(e) => setFormData({...formData, budget_max: e.target.value})} />
                    </div>
                  </div>
                </Card>

                <Card className="bg-black/40 border-white/5 p-8 space-y-6 rounded-[2rem]">
                   <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500"><Shield className="w-7 h-7" /></div>
                    <div><h4 className="font-bold text-lg">Protocol Safety</h4><p className="text-[10px] text-muted-foreground uppercase tracking-widest">Escrow Logic</p></div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Compensation Model</Label>
                    <Select value={formData.budget_type} onValueChange={(val: any) => setFormData({...formData, budget_type: val})}>
                      <SelectTrigger className="bg-background border-white/10 h-14 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Price Milestone</SelectItem>
                        <SelectItem value="hourly">Hourly Strategic Node</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>
              </div>

              <div className="bg-secondary/5 p-8 rounded-[2rem] border border-secondary/10 flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6 text-secondary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Escrow Protocol Enabled</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Milestone-based release is enabled by default. Funding will be locked in multi-sig custody once a node signal is accepted. SATs are released upon verified technical delivery.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(2)} className="font-bold text-xs uppercase tracking-widest">Previous</Button>
                <Button className="rounded-2xl h-16 px-12 font-bold bg-secondary neon-glow-secondary shadow-xl shadow-secondary/20 text-xl" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Propagating Signal...
                    </div>
                  ) : 'Propagate Strategic Objective'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
