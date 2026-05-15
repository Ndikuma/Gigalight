
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Shield, Wallet, Bell, Moon, Globe, Zap, Sparkles, MapPin, ExternalLink, Trophy, Rocket, CheckCircle } from 'lucide-react';
import { mockProfile } from '@/lib/mock-data';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [profile, setProfile] = useState(mockProfile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  function handleSave() {
    toast({
      title: "Identity Synced",
      description: "Profile metadata has been propagated across the L2 nodes.",
    });
  }

  function handleUpgrade(tier: 'pro' | 'elite') {
    toast({
      title: `${tier.toUpperCase()} Node Activated`,
      description: `Protocol fee adjusted. Reputation bonus applied.`,
    });
    setProfile(prev => ({ ...prev, membershipTier: tier }));
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-headline font-bold">Configuration</h1>
        <p className="text-muted-foreground">Manage your decentralized node identity and platform parameters.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <nav className="space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20">
            <User className="w-4 h-4" /> Identity
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:bg-white/5">
            <Trophy className="w-4 h-4" /> Node Tiers
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:bg-white/5">
            <Shield className="w-4 h-4" /> Security
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:bg-white/5">
            <Wallet className="w-4 h-4" /> Wallet API
          </Button>
        </nav>

        <div className="lg:col-span-3 space-y-8">
          {/* Membership Section */}
          <Card className="glass-card border-none bg-gradient-to-br from-secondary/10 to-transparent">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Rocket className="w-5 h-5 text-secondary" /> Node Membership
              </CardTitle>
              <CardDescription>Upgrade your tier to reduce signal fees and increase mission visibility.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'basic', name: 'Basic Node', fee: 'Free', color: 'bg-muted' },
                  { id: 'pro', name: 'Pro Node', fee: '50k SAT/yr', color: 'bg-primary' },
                  { id: 'elite', name: 'Elite Node', fee: '250k SAT/yr', color: 'bg-amber-500' }
                ].map((tier) => (
                  <div key={tier.id} className={cn(
                    "p-4 rounded-2xl border transition-all flex flex-col justify-between h-40",
                    profile.membershipTier === tier.id ? "border-white/20 bg-white/5 ring-2 ring-secondary/50" : "border-white/5 bg-black/20"
                  )}>
                    <div>
                      <Badge className={cn("text-[9px] uppercase mb-2", tier.color)}>{tier.name}</Badge>
                      <p className="text-lg font-headline font-bold">{tier.fee}</p>
                    </div>
                    {profile.membershipTier === tier.id ? (
                      <div className="text-[10px] font-bold text-secondary uppercase flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Active Node
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-[10px] font-bold h-8 uppercase tracking-widest text-muted-foreground hover:text-white"
                        onClick={() => handleUpgrade(tier.id as any)}
                      >
                        Select Tier
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="font-headline">Identity & Bio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                      <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <button className="absolute -bottom-1 -right-1 bg-primary p-1.5 rounded-full border-2 border-card shadow-xl">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="rounded-xl border-white/10 text-xs font-bold h-9">Update Identity Avatar</Button>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Satoshi-compliant assets only</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Full Node Name</Label>
                  <Input defaultValue={profile.fullName} className="bg-white/5 border-white/5 rounded-xl h-12 font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Jurisdiction</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input defaultValue={profile.location} className="bg-white/5 border-white/5 rounded-xl h-12 pl-11" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Professional Bio</Label>
                <textarea 
                  className="w-full min-h-[120px] bg-white/5 border-white/5 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 leading-relaxed"
                  defaultValue={profile.bio}
                />
              </div>

              <Button onClick={handleSave} className="rounded-xl bg-primary hover:brightness-110 neon-glow-primary px-8 font-bold h-12">
                Propagate Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
