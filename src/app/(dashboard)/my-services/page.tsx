
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Wrench, 
  ArrowRight,
  Eye,
  Loader2,
  Zap,
  Globe,
  Trash2,
  Settings2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ServiceService } from '@/services/service-service';
import { ProfessionalService } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export default function MyServicesPage() {
  const [services, setServices] = useState<ProfessionalService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      setIsLoading(true);
      try {
        const res = await ServiceService.getMyServices();
        if (res.data) setServices(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        toast({ 
          variant: "destructive", 
          title: "Synchronization Lost", 
          description: "Could not fetch your service offerings." 
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to terminate this service offering?")) return;
    setIsDeleting(id);
    try {
      await ServiceService.deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      toast({ title: "Service Terminated", description: "The offering has been removed from the public directory." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to remove service." });
    } finally {
      setIsDeleting(null);
    }
  }

  if (isLoading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-white">Professional Services</h1>
          <p className="text-muted-foreground">Manage your technical offerings and public node expertise.</p>
        </div>
        <Button asChild className="rounded-xl bg-emerald-500 hover:bg-emerald-600 gap-2 font-bold h-12 px-6 shadow-lg shadow-emerald-500/20">
          <Link href="/my-services/create"><PlusCircle className="w-4 h-4" /> Create Service Offering</Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="glass-card border-none overflow-hidden group hover:border-emerald-500/30 transition-all">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-headline font-bold text-white group-hover:text-emerald-400 transition-colors">{service.title}</h3>
                        <Badge className={cn(
                          "border-none uppercase text-[9px] tracking-widest font-bold",
                          service.is_active ? "bg-emerald-400/10 text-emerald-400" : "bg-white/10 text-muted-foreground"
                        )}>
                          {service.is_active ? 'ACTIVE SIGNAL' : 'INACTIVE'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{service.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{service.short_description}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {service.skills?.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-white/5 text-muted-foreground border-white/5 text-[9px] uppercase font-bold px-2 py-0.5">
                        {typeof skill === 'string' ? skill : skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="lg:w-96 bg-white/5 border-l border-white/5 p-8 flex flex-col justify-between gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Commission Rate</p>
                      <p className="text-xl font-bold text-white">{service.price_sats.toLocaleString()} SAT</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Delivery Cycle</p>
                      <p className="text-xl font-bold text-white">{service.delivery_days} Days</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Total Visibility</p>
                      <p className="text-xl font-bold text-white">{service.views_count || 0} Nodes</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1 rounded-xl border-white/10 text-xs font-bold uppercase tracking-widest h-11 hover:bg-white/5">
                      <Link href={`/services/${service.id}`} target="_blank"><Eye className="w-4 h-4 mr-2" /> Public View</Link>
                    </Button>
                    <div className="flex gap-1">
                      <Button asChild size="icon" variant="outline" className="rounded-xl border-white/10 h-11 w-11 hover:text-primary">
                        <Link href={`/my-services/create?id=${service.id}`}><Settings2 className="w-4 h-4" /></Link>
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="rounded-xl border-white/10 h-11 w-11 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(service.id)}
                        disabled={isDeleting === service.id}
                      >
                        {isDeleting === service.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {services.length === 0 && (
          <div className="text-center py-24 glass-card rounded-[2.5rem] border-dashed bg-white/[0.02] border-white/10 flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center">
              <Wrench className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">No active service signals</h3>
              <p className="text-muted-foreground max-w-sm mx-auto text-sm">Create a public service offering to allow network clients to commission your expertise directly.</p>
            </div>
            <Button asChild className="rounded-xl bg-emerald-500 font-bold h-12 px-10">
              <Link href="/my-services/create">Propagate Expertise</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
