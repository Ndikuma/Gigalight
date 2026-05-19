
"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Wrench, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle, 
  Sparkles, 
  Send,
  Loader2,
  Cpu,
  Trophy,
  Activity,
  Globe,
  Star,
  Zap,
  Mail,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ServiceService } from '@/services/service-service';
import { ProfessionalService } from '@/lib/types';
import { StarRating } from '@/components/ui/star-rating';

export default function PublicServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState<ProfessionalService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommissioning, setIsCommissioning] = useState(false);

  useEffect(() => {
    async function fetchService() {
      setIsLoading(true);
      try {
        const res = await ServiceService.getService(id as string);
        if (res.data) setService(res.data);
      } catch (err) {
        toast({ variant: "destructive", title: "Signal Lost", description: "This service offering is unreachable." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchService();
  }, [id]);

  async function handleCommission() {
    setIsCommissioning(true);
    // Commission protocol logic...
    setTimeout(() => {
      setIsCommissioning(false);
      toast({ title: "Commission Protocol Initiated", description: "Node operator has been notified of your intent." });
    }, 1500);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Synthesizing Public View...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
          <Globe className="w-10 h-10 text-muted-foreground/30" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold">Service Not Found</h2>
          <p className="text-muted-foreground">The expertise signal you are following has been terminated or relocated.</p>
        </div>
        <Button asChild variant="outline" className="rounded-2xl px-10 h-14 font-bold">
          <Link href="/market">Browse Directory</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-8 max-w-7xl mx-auto w-full sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center neon-glow-primary">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tight hidden sm:block">Giga<span className="text-primary">light</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5"><Share2 className="w-5 h-5" /></Button>
          <Button asChild className="rounded-xl bg-primary neon-glow-primary px-8 font-bold">
            <Link href="/signup">Join Network</Link>
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-12 space-y-12 animate-in fade-in duration-700">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-12">
          <div className="space-y-6 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
                <Wrench className="w-3 h-3 mr-2" /> Verified Offering
              </Badge>
              <Badge variant="outline" className="border-white/10 text-muted-foreground uppercase text-[10px] font-bold tracking-widest px-4 py-1.5 bg-white/5">
                {service.category}
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight leading-[0.9]">
              {service.title}
            </h1>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-white/10">
                    <AvatarImage src={`https://picsum.photos/seed/${service.creator}/100/100`} />
                    <AvatarFallback>{service.creator_display?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-white">{service.creator_display}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Node Operator</p>
                  </div>
               </div>
               <div className="h-10 w-px bg-white/10"></div>
               <div className="space-y-1">
                 <StarRating reputation={95} showScore />
                 <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Trust Index</p>
               </div>
            </div>
          </div>
          
          <Card className="lg:w-96 glass-card border-none rounded-[2.5rem] bg-gradient-to-br from-card via-card to-background p-10 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Zap className="w-32 h-32 text-primary" />
            </div>
            <CardContent className="p-0 space-y-8 relative z-10">
              <div className="text-center space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Protocol Base Rate</p>
                <h2 className="text-5xl font-headline font-bold text-emerald-400">
                  {service.price_sats.toLocaleString()}
                </h2>
                <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">SATOSHIS</p>
              </div>

              <div className="space-y-4 border-t border-white/5 pt-8">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4 text-secondary" /> Delivery Cycle</span>
                  <span className="text-white">{service.delivery_days} Days</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Escrow Status</span>
                  <span className="text-emerald-400">L2 Multi-sig</span>
                </div>
              </div>

              <Button 
                className="w-full h-16 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 font-bold text-xl transition-all hover:scale-[1.02] active:scale-[0.98] neon-glow-emerald"
                onClick={handleCommission}
                disabled={isCommissioning}
              >
                {isCommissioning ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Commission Node'}
              </Button>
              <p className="text-[8px] text-center text-muted-foreground uppercase font-bold tracking-[0.2em]">
                Verified Satoshi Standard Settlement
              </p>
            </CardContent>
          </Card>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
             <section className="space-y-6">
                <h3 className="text-2xl font-headline font-bold flex items-center gap-3">
                  <Activity className="w-6 h-6 text-primary" />
                  Service Parameters
                </h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {service.description}
                  </p>
                </div>
             </section>

             <section className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Technical Expertise Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {service.skills?.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-white/5 text-white border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl">
                      <Cpu className="w-3.5 h-3.5 mr-2 text-primary" />
                      {typeof skill === 'string' ? skill : skill.name}
                    </Badge>
                  ))}
                </div>
             </section>
          </div>

          <div className="space-y-8">
             <Card className="glass-card border-none p-8 rounded-[2rem] space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Node Reputation</h4>
                <div className="space-y-6">
                   <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Trophy className="w-5 h-5" /></div>
                         <p className="text-sm font-bold">Objectives Finalized</p>
                      </div>
                      <p className="text-xl font-bold">48+</p>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary"><CheckCircle className="w-5 h-5" /></div>
                         <p className="text-sm font-bold">Verified Deliveries</p>
                      </div>
                      <p className="text-xl font-bold">100%</p>
                   </div>
                </div>
             </Card>

             <Card className="glass-card border-none p-8 rounded-[2rem] text-center space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary shadow-xl">
                  <Mail className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-headline font-bold text-xl">Technical Inquiry</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Request specific technical parameters or custom objectives from this node operator.
                  </p>
                </div>
                <Button variant="outline" className="w-full rounded-xl border-white/10 h-12 font-bold uppercase tracking-widest text-xs">
                  Request Propagation
                </Button>
             </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 text-center">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
          GigaLight Professional Offering • Satoshi Standard v2.1.0 • {id}
        </p>
      </footer>
    </div>
  );
}
