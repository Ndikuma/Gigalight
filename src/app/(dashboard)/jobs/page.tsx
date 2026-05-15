
"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Rocket, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  CheckCircle,
  Briefcase,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function ProfessionalRolesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 py-10">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
          <Sparkles className="w-3 h-3" /> Coming Soon: Enterprise Tier
        </div>
        <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter">
          Long-Term <span className="text-gradient">Career Nodes.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Gigalight is expanding. Soon, you'll be able to secure full-time, professional roles with global entities, settled with L2 multi-sig payroll.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            title: "Decentralized Payroll", 
            desc: "Automatic SAT settlement every 10 minutes based on verifiable output.",
            icon: Zap 
          },
          { 
            title: "Identity Portability", 
            desc: "Take your reputation node from one project to another with ease.",
            icon: ShieldCheck 
          },
          { 
            title: "Global Compliance", 
            desc: "Built-in tax and regulatory tools for a borderless workforce.",
            icon: Globe 
          }
        ].map((feat, i) => (
          <Card key={i} className="glass-card border-none p-8 space-y-4 hover:border-primary/20 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">{feat.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-none bg-gradient-to-br from-primary/5 via-card to-secondary/5 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            <div className="p-12 space-y-6 flex-1">
              <h2 className="text-3xl font-headline font-bold">Priority Access Program</h2>
              <p className="text-muted-foreground">
                Nodes with a Reputation Score > 90 will receive priority selection for the first batch of Enterprise roles. 
                Complete more micro-tasks to boost your standing.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm font-bold text-primary">
                  <CheckCircle className="w-4 h-4" /> Multi-sig Payroll Integration
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-primary">
                  <CheckCircle className="w-4 h-4" /> Verification-as-a-Service
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground opacity-50">
                  <Lock className="w-4 h-4" /> Enterprise Node Dashboard (Internal Beta)
                </div>
              </div>
              <div className="pt-6">
                <Button className="rounded-xl h-14 px-8 font-bold bg-primary neon-glow-primary gap-2">
                  Join the Waitlist <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="lg:w-1/3 bg-white/5 border-l border-white/5 p-12 flex flex-col justify-center items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse">
                <Rocket className="w-10 h-10" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Expected Release</p>
                <p className="text-2xl font-headline font-bold">Q4 2023</p>
              </div>
              <Button asChild variant="outline" className="w-full rounded-xl border-white/10 text-xs font-bold uppercase tracking-widest">
                <Link href="/dashboard">Return to Hub</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
