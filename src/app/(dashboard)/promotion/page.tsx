"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Share2, 
  Sparkles, 
  Twitter, 
  Linkedin, 
  Copy, 
  Check, 
  Zap, 
  Briefcase, 
  Wrench, 
  Loader2, 
  ExternalLink,
  ChevronRight,
  Eye,
  Rocket,
  ShieldCheck,
  Download,
  Image as ImageIcon,
  RefreshCw as RefreshCwIcon
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { TaskService } from '@/services/task-service';
import { ProjectService } from '@/services/project-service';
import { ServiceService } from '@/services/service-service';
import { generateSocialPromotion, SocialPromotionOutput } from '@/ai/flows/social-promotion-generator';
import { Badge } from '@/components/ui/badge';

export default function PromotionHubPage() {
  const [activeTab, setActiveTab] = useState('assets');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [assetType, setAssetType] = useState<'task' | 'project' | 'service' | null>(null);
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [promoContent, setPromoContent] = useState<SocialPromotionOutput | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssets() {
      setIsLoading(true);
      try {
        const [tRes, pRes, sRes] = await Promise.all([
          TaskService.getMyTasks(),
          ProjectService.getMyProjects(),
          ServiceService.getMyServices()
        ]);
        if (tRes.data) setTasks(tRes.data);
        if (pRes.data) setProjects(pRes.data);
        if (sRes.data) setServices(sRes.data);
      } catch (e) {
        toast({ variant: "destructive", title: "Sync Error", description: "Could not fetch assets for promotion." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchAssets();
  }, []);

  const handleSelectAsset = (asset: any, type: 'task' | 'project' | 'service') => {
    setSelectedAsset(asset);
    setAssetType(type);
    setPromoContent(null);
    setActiveTab('editor');
  };

  const handleGenerate = async () => {
    if (!selectedAsset || !assetType) return;
    setIsGenerating(true);
    try {
      const url = `${window.location.origin}/${assetType === 'service' ? 'services' : assetType === 'task' ? 'market' : 'my-projects'}/${selectedAsset.id}`;
      
      const result = await generateSocialPromotion({
        type: assetType,
        title: selectedAsset.title,
        description: selectedAsset.short_description || selectedAsset.description,
        reward: assetType === 'task' ? `${selectedAsset.reward_amount} SAT` : 
                assetType === 'project' ? `${selectedAsset.budget_min}-${selectedAsset.budget_max} SAT` : 
                `${selectedAsset.price_sats} SAT`,
        skills: selectedAsset.skills?.map((s: any) => typeof s === 'string' ? s : s.name),
        url: url
      });
      setPromoContent(result);
      toast({ title: "Signal Synthesized", description: "AI has generated your high-conversion social copy." });
    } catch (e) {
      toast({ variant: "destructive", title: "AI Node Error", description: "Could not propagate generation signal." });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast({ title: "Copied to Clipboard" });
  };

  if (isLoading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Social Propagation Node</h1>
          <p className="text-muted-foreground max-w-2xl">
            Amplify your professional presence. Generate high-fidelity social copy and visual signals to promote your protocol assets.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-2xl border border-primary/20 text-xs font-bold uppercase tracking-widest">
          <Rocket className="w-4 h-4" /> Growth Accelerated
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-card border border-white/5 p-1 h-auto rounded-2xl w-fit mb-8">
          <TabsTrigger value="assets" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary font-bold gap-2">
            <Share2 className="w-4 h-4" /> Select Asset
          </TabsTrigger>
          <TabsTrigger value="editor" disabled={!selectedAsset} className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary font-bold gap-2">
            <Sparkles className="w-4 h-4" /> Propagation Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tasks Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2 ml-2">
                <Zap className="w-4 h-4" /> Your Micro Gigs
              </h3>
              {tasks.length > 0 ? tasks.map(t => (
                <AssetCard key={t.id} asset={t} type="task" onSelect={() => handleSelectAsset(t, 'task')} />
              )) : <EmptyMini type="Gigs" />}
            </div>

            {/* Projects Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2 ml-2">
                <Briefcase className="w-4 h-4" /> Strategic Projects
              </h3>
              {projects.length > 0 ? projects.map(p => (
                <AssetCard key={p.id} asset={p} type="project" onSelect={() => handleSelectAsset(p, 'project')} />
              )) : <EmptyMini type="Projects" />}
            </div>

            {/* Services Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2 ml-2">
                <Wrench className="w-4 h-4" /> Expert Services
              </h3>
              {services.length > 0 ? services.map(s => (
                <AssetCard key={s.id} asset={s} type="service" onSelect={() => handleSelectAsset(s, 'service')} />
              )) : <EmptyMini type="Services" />}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="editor" className="mt-0 animate-in slide-in-from-right-4 duration-500">
          {selectedAsset && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* Editor Side */}
              <div className="lg:col-span-3 space-y-8">
                <Card className="glass-card border-none rounded-[2rem] overflow-hidden">
                  <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="font-headline text-2xl flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-primary" /> Signal Synthesis
                      </CardTitle>
                      <CardDescription>AI will architect compelling copy for your social rails.</CardDescription>
                    </div>
                    <Button 
                      onClick={handleGenerate} 
                      disabled={isGenerating}
                      className="rounded-xl bg-primary neon-glow-primary font-bold h-11 px-6 gap-2"
                    >
                      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCwIcon className="w-4 h-4" />}
                      {promoContent ? 'Regenerate' : 'Generate Signals'}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-6">
                    {!promoContent && !isGenerating ? (
                      <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-3xl space-y-4">
                        <Sparkles className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">Propagate an AI signal to create your promotional professional content.</p>
                      </div>
                    ) : isGenerating ? (
                      <div className="py-20 text-center space-y-4">
                        <div className="flex justify-center"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary animate-pulse">Synthesizing Network Signal...</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* X / Twitter */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                              <Twitter className="w-3.5 h-3.5" /> X Propagation (Short)
                            </label>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(promoContent.twitter, 'twitter')} className="h-7 text-[10px] font-bold gap-2">
                              {copiedField === 'twitter' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
                            </Button>
                          </div>
                          <div className="p-5 bg-black/40 border border-white/5 rounded-2xl text-sm leading-relaxed text-white/90 font-mono">
                            {promoContent.twitter}
                          </div>
                        </div>

                        {/* LinkedIn */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                              <Linkedin className="w-3.5 h-3.5" /> LinkedIn Protocol (Professional)
                            </label>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(promoContent.linkedin, 'linkedin')} className="h-7 text-[10px] font-bold gap-2">
                              {copiedField === 'linkedin' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
                            </Button>
                          </div>
                          <div className="p-5 bg-black/40 border border-white/5 rounded-2xl text-sm leading-relaxed text-white/90">
                            {promoContent.linkedin}
                          </div>
                        </div>

                        {/* Thread Hook */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                              <ChevronRight className="w-3.5 h-3.5" /> Strategic Thread Hook
                            </label>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(promoContent.threadHook, 'hook')} className="h-7 text-[10px] font-bold gap-2">
                              {copiedField === 'hook' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
                            </Button>
                          </div>
                          <div className="p-5 bg-black/40 border border-white/5 rounded-2xl text-sm italic text-muted-foreground">
                            "{promoContent.threadHook}"
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Visual Preview Side */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground ml-2">Visual Social Signal</h3>
                
                <div className="relative group">
                  {/* The "Social Card" Preview */}
                  <div id="promo-card" className={cn(
                    "aspect-[1.91/1] w-full rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl border-4",
                    assetType === 'task' ? "bg-gradient-to-br from-[#8457F1] to-[#3C62FF] border-[#8457F1]/30" :
                    assetType === 'project' ? "bg-gradient-to-br from-[#3C62FF] to-[#00D1FF] border-[#3C62FF]/30" :
                    "bg-gradient-to-br from-[#10B981] to-[#3C62FF] border-[#10B981]/30"
                  )}>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -z-0 rounded-full" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/20 blur-[100px] -z-0 rounded-full" />
                    
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-xl">
                        {assetType === 'task' ? <Zap className="w-8 h-8 text-white" /> : 
                         assetType === 'project' ? <Briefcase className="w-8 h-8 text-white" /> : 
                         <Wrench className="w-8 h-8 text-white" />}
                      </div>
                      <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">GIGALIGHT PROTOCOL</span>
                      </div>
                    </div>

                    <div className="relative z-10 space-y-4">
                      <h2 className="text-3xl sm:text-4xl font-headline font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                        {selectedAsset?.title}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                         {selectedAsset?.skills?.slice(0, 3).map((s: any, i: number) => (
                           <span key={i} className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-[10px] font-bold text-white uppercase tracking-widest backdrop-blur-sm">
                             {typeof s === 'string' ? s : s.name}
                           </span>
                         ))}
                      </div>
                    </div>

                    <div className="relative z-10 flex items-end justify-between">
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">POTENTIAL YIELD</p>
                          <p className="text-3xl font-headline font-bold text-white">
                            {assetType === 'task' ? `+${selectedAsset?.reward_amount?.toLocaleString()} SAT` : 
                             assetType === 'project' ? `${selectedAsset?.budget_min?.toLocaleString()} SAT` : 
                             `${selectedAsset?.price_sats?.toLocaleString()} SAT`}
                          </p>
                       </div>
                       <div className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-2xl font-bold text-sm shadow-xl">
                          JOIN NODE <ChevronRight className="w-4 h-4" />
                       </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                     <Button variant="secondary" className="rounded-xl font-bold h-12 gap-2 shadow-2xl">
                       <Download className="w-4 h-4" /> Download Visual
                     </Button>
                     <Button variant="outline" className="rounded-xl bg-white/10 border-white/20 text-white font-bold h-12 gap-2">
                       <Eye className="w-4 h-4" /> High-Res
                     </Button>
                  </div>
                </div>

                <Card className="glass-card border-none rounded-[2rem] p-8 space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold">Protocol Signal Link</h4>
                   </div>
                   <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
                      <p className="text-[10px] font-mono text-muted-foreground truncate flex-1">
                        {window.location.origin}/{assetType === 'service' ? 'services' : assetType === 'task' ? 'market' : 'my-projects'}/{selectedAsset?.id}
                      </p>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 rounded-lg text-[10px] font-bold"
                        onClick={() => copyToClipboard(`${window.location.origin}/${assetType === 'service' ? 'services' : assetType === 'task' ? 'market' : 'my-projects'}/${selectedAsset?.id}`, 'url')}
                      >
                         {copiedField === 'url' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                   </div>
                   <p className="text-xs text-muted-foreground leading-relaxed">
                     Use this unique technical identifier in your social propagation signals to allow the network to trace back to your node.
                   </p>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AssetCard({ asset, type, onSelect }: any) {
  const Icon = type === 'task' ? Zap : type === 'project' ? Briefcase : Wrench;
  const colorClass = type === 'task' ? 'text-primary' : type === 'project' ? 'text-secondary' : 'text-emerald-400';
  
  return (
    <Card 
      onClick={onSelect}
      className="glass-card border-none hover:border-white/20 transition-all cursor-pointer group relative overflow-hidden"
    >
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm truncate group-hover:text-white transition-colors">{asset.title}</h4>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
            {type === 'task' ? `${asset.reward_amount} SAT` : type === 'project' ? 'Strategic' : 'Service'}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
      </CardContent>
    </Card>
  );
}

function EmptyMini({ type }: { type: string }) {
  return (
    <div className="py-8 text-center border border-dashed border-white/5 rounded-2xl">
       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No {type} Propagated</p>
    </div>
  );
}
