
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
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
  ChevronRight,
  Eye,
  Rocket,
  ShieldCheck,
  Download,
  RefreshCw as RefreshCwIcon,
  ArrowRight,
  Network
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { TaskService } from '@/services/task-service';
import { ProjectService } from '@/services/project-service';
import { ServiceService } from '@/services/service-service';
import { generateSocialPromotion, SocialPromotionOutput } from '@/ai/flows/social-promotion-generator';
import { Badge } from '@/components/ui/badge';
import { toPng } from 'html-to-image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PromotionHubPage() {
  const [activeTab, setActiveTab] = useState('assets');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [assetType, setAssetType] = useState<'task' | 'project' | 'service' | null>(null);
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [promoContent, setPromoContent] = useState<SocialPromotionOutput | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `gigalight-signal-${selectedAsset?.id || 'export'}.png`;
      link.href = dataUrl;
      link.click();
      toast({ title: "Signal Exported", description: "PNG payload saved to your local terminal." });
    } catch (err) {
      toast({ variant: "destructive", title: "Export Error", description: "The visual signal could not be captured." });
    } finally {
      setIsExporting(false);
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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 sm:px-0">
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
        <div className="px-4 sm:px-0">
          <TabsList className="bg-card border border-white/5 p-1 h-auto rounded-2xl w-fit mb-8">
            <TabsTrigger value="assets" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary font-bold gap-2">
              <Share2 className="w-4 h-4" /> Select Asset
            </TabsTrigger>
            <TabsTrigger value="editor" disabled={!selectedAsset} className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary font-bold gap-2">
              <Sparkles className="w-4 h-4" /> Propagation Editor
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="assets" className="mt-0 px-4 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2 ml-2">
                <Zap className="w-4 h-4" /> Your Micro Gigs
              </h3>
              {tasks.length > 0 ? tasks.map(t => (
                <AssetCard key={t.id} asset={t} type="task" onSelect={() => handleSelectAsset(t, 'task')} />
              )) : <EmptyMini type="Gigs" />}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2 ml-2">
                <Briefcase className="w-4 h-4" /> Strategic Projects
              </h3>
              {projects.length > 0 ? projects.map(p => (
                <AssetCard key={p.id} asset={p} type="project" onSelect={() => handleSelectAsset(p, 'project')} />
              )) : <EmptyMini type="Projects" />}
            </div>

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

        <TabsContent value="editor" className="mt-0 px-4 sm:px-0 animate-in slide-in-from-right-4 duration-500">
          {selectedAsset && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 space-y-8">
                <Card className="glass-card border-none rounded-[2rem] overflow-hidden">
                  <CardHeader className="p-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle className="font-headline text-2xl flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-primary" /> Signal Synthesis
                      </CardTitle>
                      <CardDescription>AI will architect compelling copy for your social rails.</CardDescription>
                    </div>
                    <Button 
                      onClick={handleGenerate} 
                      disabled={isGenerating}
                      className="w-full md:w-auto rounded-xl bg-primary neon-glow-primary font-bold h-11 px-6 gap-2"
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

              <div className="lg:col-span-5 space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground ml-2">Visual Social Signal</h3>
                
                <div className="relative group perspective-1000">
                  <SocialCard asset={selectedAsset} type={assetType} cardRef={cardRef} />

                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-6 z-20">
                     <div className="text-center space-y-2 mb-4 px-8">
                       <h4 className="text-xl font-headline font-bold text-white">Visual Signal Ready</h4>
                       <p className="text-xs text-white/60">Export high-resolution template for social cover.</p>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-4 px-8 w-full justify-center">
                       <Button 
                        variant="secondary" 
                        className="rounded-2xl font-bold h-14 px-8 gap-3 shadow-2xl hover:scale-105 transition-transform"
                        onClick={handleDownload}
                        disabled={isExporting}
                       >
                         {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                         Download Signal
                       </Button>
                       <Button 
                        variant="outline" 
                        className="rounded-2xl bg-white/10 border-white/20 text-white font-bold h-14 px-8 gap-3 hover:bg-white/20"
                        onClick={() => setIsPreviewOpen(true)}
                       >
                         <Eye className="w-5 h-5" /> 4K Preview
                       </Button>
                     </div>
                  </div>
                </div>

                <Card className="glass-card border-none rounded-[2rem] p-8 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold">Protocol Identifier</h4>
                      </div>
                      <Badge variant="outline" className="border-white/10 uppercase text-[8px] font-bold tracking-widest px-2">Unique Node Link</Badge>
                   </div>
                   
                   <div className="bg-black/60 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 group/addr relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-xl -z-10" />
                      <p className="text-[11px] font-mono text-muted-foreground truncate flex-1 leading-none">
                        {window.location.origin}/{assetType === 'service' ? 'services' : assetType === 'task' ? 'market' : 'my-projects'}/${selectedAsset?.id}
                      </p>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-10 w-10 shrink-0 rounded-xl text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => copyToClipboard(`${window.location.origin}/${assetType === 'service' ? 'services' : assetType === 'task' ? 'market' : 'my-projects'}/${selectedAsset?.id}`, 'url')}
                      >
                         {copiedField === 'url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                         <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Visibility Potential</p>
                         <p className="text-sm font-bold text-white flex items-center gap-2"><Eye className="w-3.5 h-3.5 text-primary" /> High Impact</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                         <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Propagation Rail</p>
                         <p className="text-sm font-bold text-white flex items-center gap-2"><Network className="w-3.5 h-3.5 text-secondary" /> L2 Satoshi</p>
                      </div>
                   </div>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl bg-background border-white/10 p-0 overflow-hidden rounded-[2.5rem]">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-headline font-bold">4K Signal Preview</DialogTitle>
          </DialogHeader>
          <div className="p-8 pt-0">
             <div className="scale-110 origin-top transform my-12">
               <SocialCard asset={selectedAsset} type={assetType} />
             </div>
             <div className="flex justify-center mt-12 pt-8 border-t border-white/5">
                <Button className="rounded-2xl bg-primary neon-glow-primary font-bold h-14 px-12 gap-3" onClick={handleDownload}>
                   <Download className="w-5 h-5" /> Download Professional PNG
                </Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SocialCard({ asset, type, cardRef }: { asset: any, type: any, cardRef?: React.RefObject<HTMLDivElement | null> }) {
  if (!asset) return null;
  
  return (
    <div ref={cardRef} className={cn(
      "aspect-[1.91/1] w-full rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl border-4 transition-all duration-700",
      type === 'task' ? "bg-gradient-to-br from-[#8457F1] via-[#6366F1] to-[#3C62FF] border-[#8457F1]/30" :
      type === 'project' ? "bg-gradient-to-br from-[#3C62FF] via-[#0EA5E9] to-[#00D1FF] border-[#3C62FF]/30" :
      "bg-gradient-to-br from-[#10B981] via-[#059669] to-[#3C62FF] border-[#10B981]/30"
    )}>
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] -z-0 rounded-full animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-black/30 blur-[120px] -z-0 rounded-full" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-2xl flex items-center justify-center border border-white/40 shadow-2xl">
            {type === 'task' ? <Zap className="w-8 h-8 text-white fill-white" /> : 
             type === 'project' ? <Briefcase className="w-8 h-8 text-white fill-white" /> : 
             <Wrench className="w-8 h-8 text-white fill-white" />}
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-white uppercase tracking-[0.3em] drop-shadow-md">GigaLight Protocol</p>
            <Badge className="bg-black/30 border border-white/20 text-[8px] font-bold uppercase tracking-widest text-white/90">
              {type === 'task' ? 'MICRO GIG' : type === 'project' ? 'STRATEGIC PROJECT' : 'EXPERT SERVICE'}
            </Badge>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">LIVE SIGNAL</span>
        </div>
      </div>

      <div className="relative z-10 space-y-6">
        <h2 className="text-4xl sm:text-5xl font-headline font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl">
          {asset.title}
        </h2>
        <div className="flex flex-wrap gap-2.5">
           {(asset.skills || []).slice(0, 4).map((s: any, i: number) => (
             <span key={i} className="px-4 py-1.5 rounded-xl bg-black/20 border border-white/20 text-[10px] font-bold text-white uppercase tracking-widest backdrop-blur-xl">
               {typeof s === 'string' ? s : s.name}
             </span>
           ))}
        </div>
      </div>

      <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-8 mt-2">
         <div className="space-y-1">
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em]">TECHNICAL YIELD</p>
            <p className="text-4xl font-headline font-bold text-white tracking-tighter">
              {type === 'task' ? `+${asset.reward_amount?.toLocaleString()} SAT` : 
               type === 'project' ? `${asset.budget?.min ? asset.budget.min.toLocaleString() : asset.budget_min?.toLocaleString() || 'TBD'} SAT` : 
               `${asset.price_sats?.toLocaleString()} SAT`}
            </p>
         </div>
         <div className="flex items-center gap-3 bg-white text-black px-8 py-3.5 rounded-[1.5rem] font-bold text-sm shadow-2xl hover:scale-105 transition-transform cursor-default">
            JOIN NODE <ArrowRight className="w-5 h-5" />
         </div>
      </div>
    </div>
  );
}

function AssetCard({ asset, type, onSelect }: any) {
  const Icon = type === 'task' ? Zap : type === 'project' ? Briefcase : Wrench;
  const colorClass = type === 'task' ? 'text-primary' : type === 'project' ? 'text-secondary' : 'text-emerald-400';
  const bgClass = type === 'task' ? 'bg-primary/5' : type === 'project' ? 'bg-secondary/5' : 'bg-emerald-500/5';
  
  return (
    <Card 
      onClick={onSelect}
      className={cn(
        "glass-card border-none hover:border-white/20 transition-all cursor-pointer group relative overflow-hidden",
        bgClass
      )}
    >
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500", colorClass)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm truncate group-hover:text-white transition-colors">{asset.title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
              {type === 'task' ? `${asset.reward_amount?.toLocaleString()} SAT` : 
               type === 'project' ? 'Strategic Yield' : 'Service Offering'}
            </p>
            <span className="text-white/10">•</span>
            <span className="text-[9px] text-muted-foreground font-bold uppercase">{asset.status || 'Active'}</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          <ChevronRight className="w-4 h-4 text-white" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyMini({ type }: { type: string }) {
  return (
    <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">No {type} Propagated</p>
    </div>
  );
}
