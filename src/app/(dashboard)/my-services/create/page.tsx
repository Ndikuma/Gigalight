
"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle, 
  Plus, 
  X,
  BadgeDollarSign,
  Clock,
  Loader2,
  Cpu,
  Shield,
  ChevronRight,
  Search
} from 'lucide-react';
import { generateJobProjectDescription } from '@/ai/flows/job-project-description-generator';
import { suggestSkillsAndCategories } from '@/ai/flows/automated-skill-category-suggestion';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ServiceService } from '@/services/service-service';
import { TaskService } from '@/services/task-service';
import { SkillService } from '@/services/skill-service';
import { Category, Skill } from '@/lib/types';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function CreateServiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    category_id: '',
    price_sats: '10000',
    delivery_days: '3',
    skills: [] as string[],
  });

  useEffect(() => {
    async function init() {
      try {
        const [catRes, skillRes] = await Promise.all([
          TaskService.getCategories(),
          SkillService.listSkills({ page_size: 100 })
        ]);

        if (catRes.data?.results) setCategories(catRes.data.results);
        if (skillRes.data?.results) setAvailableSkills(skillRes.data.results);
        
        if (editId) {
          const res = await ServiceService.getService(editId);
          if (res.data) {
            setFormData({
              title: res.data.title,
              description: res.data.description,
              short_description: res.data.short_description || '',
              category_id: '', // Matching logic usually needed for IDs
              price_sats: res.data.price_sats.toString(),
              delivery_days: res.data.delivery_days.toString(),
              skills: res.data.skills?.map((s: any) => typeof s === 'string' ? s : s.name) || [],
            });
          }
        }
      } catch (e) {
        console.error("Init error");
      } finally {
        setIsLoadingSkills(false);
      }
    }
    init();
  }, [editId]);

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
        short_description: genResult.description.substring(0, 160),
        skills: [...new Set([...prev.skills, ...skillResult.suggestedSkills])],
      }));
      
      toast({ title: "Expertise Synthesized", description: "AI has refined your professional offering." });
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

  function removeSkill(s: string) {
    setFormData({ ...formData, skills: formData.skills.filter(skill => skill !== s) });
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        short_description: formData.short_description || formData.description.substring(0, 160),
        price_sats: parseInt(formData.price_sats),
        delivery_days: parseInt(formData.delivery_days),
        category: formData.category_id || categories[0]?.name || 'General',
        // Backend expects objects for nested serializers
        skills: formData.skills.map(name => ({ name })),
        is_active: true
      };

      const response = editId 
        ? await ServiceService.updateService(editId, payload)
        : await ServiceService.createService(payload);

      if (response.data) {
        toast({ title: "Offering Propagated", description: `"${formData.title}" is live in the public directory.` });
        router.push('/my-services');
      } else {
        toast({ variant: "destructive", title: "Protocol Error", description: response.error || "Deployment failed." });
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
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-[10px] mb-1">
             <Wrench className="w-3 h-3" /> Service Offering Propagation
          </div>
          <h1 className="text-4xl font-headline font-bold">{editId ? 'Modify Offering' : 'Propagate Expertise'}</h1>
          <p className="text-muted-foreground">Define your specialized capability for direct network commission.</p>
        </div>
      </header>

      <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all",
              step === s ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : 
              step > s ? "bg-emerald-500/50 text-white" : "bg-white/5 text-muted-foreground"
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
              <div className="space-y-2">
                <h3 className="text-3xl font-headline font-bold">1. Service Scope</h3>
                <p className="text-sm text-muted-foreground">Define the technical bounds and intent of your offering.</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Offering Title</Label>
                  <Input placeholder="e.g. Professional Smart Contract Audit" className="h-14 bg-black/40 border-white/5 text-lg rounded-2xl" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Technical Documentation</Label>
                  <Textarea placeholder="Detail your exact deliverables and methodology..." className="min-h-[220px] bg-black/40 border-white/5 rounded-3xl p-6 leading-relaxed" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button className="rounded-2xl h-14 px-10 font-bold bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 text-lg" onClick={() => setStep(2)}>Define Parameters <ChevronRight className="w-5 h-5 ml-2" /></Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-3xl font-headline font-bold">2. Expertise Taxonomy</h3>
                  <p className="text-sm text-muted-foreground">Categorize your offering for optimal network discovery.</p>
                </div>
                <Button variant="ghost" size="sm" className="text-emerald-400 gap-2 h-10 px-4 rounded-xl hover:bg-emerald-400/10 font-bold text-xs uppercase tracking-widest" onClick={handleAIAssist} disabled={isGenerating}>
                  <Sparkles className="w-4 h-4" /> {isGenerating ? "Synthesizing..." : "AI Assist"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Protocol Field</Label>
                    <Select value={formData.category_id} onValueChange={(val) => setFormData({...formData, category_id: val})}>
                       <SelectTrigger className="bg-black/40 border-white/5 h-14 rounded-2xl"><SelectValue placeholder="Select Category" /></SelectTrigger>
                       <SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Node Capability (Skills)</Label>
                    <div className="relative">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <div className="relative group cursor-pointer">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-400 transition-colors" />
                                <Input 
                                   placeholder="Search skill signal..." 
                                   className="h-14 bg-black/40 border-white/5 pl-11 rounded-2xl focus:ring-emerald-400/40"
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
                                      className="rounded-lg p-3 cursor-pointer focus:bg-emerald-500/20 flex items-center justify-between group"
                                   >
                                      <div className="flex items-center gap-3">
                                         <Cpu className="w-4 h-4 text-muted-foreground group-hover:text-emerald-400" />
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
                          <Badge key={s} className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1.5 gap-2 font-bold uppercase text-[9px] tracking-widest animate-in zoom-in-95">
                             <Cpu className="w-3 h-3" />
                             {s}
                             <button onClick={() => removeSkill(s)} className="hover:text-white transition-colors">
                                <X className="w-3 h-3" />
                             </button>
                          </Badge>
                       ))}
                       {formData.skills.length === 0 && !isLoadingSkills && (
                          <p className="text-[10px] text-muted-foreground italic ml-1">No skill signals propagated.</p>
                       )}
                       {isLoadingSkills && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-1" />}
                    </div>
                 </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(1)} className="font-bold text-xs uppercase tracking-widest">Previous</Button>
                <Button className="rounded-2xl h-14 px-10 font-bold bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 text-lg" onClick={() => setStep(3)}>Settlement Logic <ChevronRight className="w-5 h-5 ml-2" /></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="space-y-2">
                <h3 className="text-3xl font-headline font-bold">3. Financial Escrow</h3>
                <p className="text-sm text-muted-foreground">Authorize the settlement parameters for direct commissions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-black/40 border-white/5 p-8 space-y-6 rounded-[2rem]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500"><BadgeDollarSign className="w-7 h-7" /></div>
                    <div><h4 className="font-bold text-lg">Base Rate</h4><p className="text-[10px] text-muted-foreground uppercase tracking-widest">Minimum Signal</p></div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Commission Price (SAT)</Label>
                    <Input type="number" className="h-16 bg-background border-white/10 font-bold text-2xl rounded-2xl" value={formData.price_sats} onChange={(e) => setFormData({...formData, price_sats: e.target.value})} />
                  </div>
                </Card>

                <Card className="bg-black/40 border-white/5 p-8 space-y-6 rounded-[2rem]">
                   <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary"><Clock className="w-7 h-7" /></div>
                    <div><h4 className="font-bold text-lg">Delivery Cycle</h4><p className="text-[10px] text-muted-foreground uppercase tracking-widest">Protocol Velocity</p></div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Est. Days to Finalize</Label>
                    <Input type="number" className="h-16 bg-background border-white/10 font-bold text-2xl rounded-2xl" value={formData.delivery_days} onChange={(e) => setFormData({...formData, delivery_days: e.target.value})} />
                  </div>
                </Card>
              </div>

              <div className="bg-emerald-500/5 p-8 rounded-[2rem] border border-emerald-500/10 flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Automated Settlement Protocol</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By propagating this offering, you authorize the platform to initialize multi-sig escrow for incoming commission signals. SATs are released upon verified technical delivery.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(2)} className="font-bold text-xs uppercase tracking-widest">Previous</Button>
                <Button className="rounded-2xl h-16 px-12 font-bold bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 text-xl" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Propagating Signal...
                    </div>
                  ) : editId ? 'Modify Offering' : 'Authorize & Deploy Service'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function CreateServicePage() {
  return (
    <Suspense fallback={<div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
      <CreateServiceContent />
    </Suspense>
  );
}
