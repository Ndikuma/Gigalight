"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Shield, 
  Globe, 
  Sparkles, 
  MapPin, 
  Trophy, 
  Rocket, 
  CheckCircle,
  Lock,
  Smartphone,
  ShieldCheck,
  LogOut,
  Camera
} from 'lucide-react';
import { mockProfile } from '@/lib/mock-data';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type SettingsSection = 'identity' | 'tiers' | 'security';

export default function SettingsPage() {
  const [profile, setProfile] = useState(mockProfile);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>('identity');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  function handleSave() {
    toast({
      title: "Protocol Synced",
      description: "Settings metadata has been propagated across your node identity.",
    });
  }

  function handleUpgrade(tier: 'basic' | 'pro' | 'elite') {
    toast({
      title: `${tier.toUpperCase()} Node Activated`,
      description: `Protocol fee adjusted. Reputation bonus applied.`,
    });
    setProfile(prev => ({ ...prev, membershipTier: tier }));
  }

  const navItems = [
    { id: 'identity', label: 'Identity', icon: User, desc: 'Profile & Bio' },
    { id: 'tiers', label: 'Node Tiers', icon: Trophy, desc: 'Signal & Rewards' },
    { id: 'security', label: 'Security', icon: Shield, desc: 'Access Control' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="space-y-1">
        <h1 className="text-4xl font-headline font-bold">Configuration</h1>
        <p className="text-muted-foreground">Manage your decentralized node identity and platform parameters.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as SettingsSection)}
              className={cn(
                "w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-1 group",
                activeSection === item.id 
                  ? "bg-primary/10 border-primary/20 text-primary" 
                  : "bg-transparent border-transparent text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-4 h-4", activeSection === item.id ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                <span className="font-bold text-sm uppercase tracking-widest">{item.label}</span>
              </div>
              <span className="text-[10px] ml-7 opacity-70">{item.desc}</span>
            </button>
          ))}
        </nav>

        {/* Content Panel */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'identity' && (
            <Card className="glass-card border-none animate-in slide-in-from-right-4 duration-500">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="font-headline text-2xl">Identity & Bio</CardTitle>
                <CardDescription>Update your public node data for professional discovery.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-tr from-primary to-secondary p-1 shadow-2xl transition-transform group-hover:scale-105">
                      <div className="w-full h-full rounded-[1.8rem] bg-card flex items-center justify-center overflow-hidden">
                        <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-xl border-4 border-card shadow-xl hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="space-y-3 flex-1 text-center sm:text-left">
                    <h4 className="font-bold">Protocol Avatar</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                      Use a professional identifier. Avatars are propagated across all technical missions and strategic proposals.
                    </p>
                    <div className="flex gap-2 justify-center sm:justify-start">
                      <Button variant="outline" size="sm" className="rounded-xl border-white/10 font-bold h-9">Update Signal</Button>
                      <Button variant="ghost" size="sm" className="rounded-xl text-destructive hover:bg-destructive/10 h-9">Remove</Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Full Node Name</Label>
                    <Input defaultValue={profile.fullName} className="h-12 bg-black/40 border-white/5 rounded-xl font-bold focus:ring-primary/40" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Technical Jurisdiction</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input defaultValue={profile.location} className="h-12 bg-black/40 border-white/5 rounded-xl pl-11 focus:ring-primary/40" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Professional Mission Bio</Label>
                  <textarea 
                    className="w-full min-h-[140px] bg-black/40 border-white/5 rounded-2xl p-6 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/40"
                    defaultValue={profile.bio}
                    placeholder="Describe your technical expertise and node history..."
                  />
                </div>

                <div className="pt-4 border-t border-white/5">
                  <Button onClick={handleSave} className="rounded-xl bg-primary hover:brightness-110 neon-glow-primary px-10 font-bold h-12">
                    Propagate Identity Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'tiers' && (
            <Card className="glass-card border-none bg-gradient-to-br from-secondary/10 via-transparent to-transparent animate-in slide-in-from-right-4 duration-500">
              <CardHeader className="p-8 pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-2xl">Node Membership</CardTitle>
                    <CardDescription>Optimize your network standing for lower fees and priority discovery.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 'basic', name: 'Basic Node', fee: 'Free', color: 'bg-muted', perks: ['Standard Yield', 'Public Discovery'] },
                    { id: 'pro', name: 'Pro Node', fee: '50k SAT/yr', color: 'bg-primary', perks: ['Reduced Signal Fees', 'Priority Discovery', 'Pro Badge'] },
                    { id: 'elite', name: 'Elite Node', fee: '250k SAT/yr', color: 'bg-amber-500', perks: ['Zero Signal Fees', 'Expert Only Gigs', 'Enterprise Tier'] }
                  ].map((tier) => (
                    <div key={tier.id} className={cn(
                      "p-6 rounded-[2rem] border transition-all flex flex-col justify-between h-[300px] relative overflow-hidden group",
                      profile.membershipTier === tier.id 
                        ? "border-secondary/40 bg-secondary/5 ring-1 ring-secondary/20 shadow-2xl" 
                        : "border-white/5 bg-black/40 hover:border-white/10"
                    )}>
                      {profile.membershipTier === tier.id && (
                        <div className="absolute top-0 right-0 p-3">
                          <CheckCircle className="w-5 h-5 text-secondary" />
                        </div>
                      )}
                      <div className="space-y-4">
                        <div>
                          <Badge className={cn("text-[9px] uppercase font-bold tracking-widest px-3", tier.color)}>{tier.name}</Badge>
                          <p className="text-2xl font-headline font-bold mt-2">{tier.fee}</p>
                        </div>
                        <ul className="space-y-2">
                          {tier.perks.map((perk, i) => (
                            <li key={i} className="text-[10px] text-muted-foreground flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-muted-foreground/50" /> {perk}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {profile.membershipTier === tier.id ? (
                        <div className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                          Active Protocol Level
                        </div>
                      ) : (
                        <Button 
                          className="w-full rounded-xl h-12 font-bold uppercase tracking-widest text-[10px] bg-white/5 hover:bg-white/10 border border-white/10"
                          onClick={() => handleUpgrade(tier.id as any)}
                        >
                          Select Tier
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-start gap-4">
                  <Globe className="w-5 h-5 text-secondary shrink-0 mt-1" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Tiers are renewed annually using the L2 Satoshi settlement. Moving to a higher tier instantly updates your Reputation Index.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card className="glass-card border-none animate-in slide-in-from-right-4 duration-500">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="font-headline text-2xl">Access Control & Security</CardTitle>
                <CardDescription>Secure your node identity and manage active sessions.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Password Protocol
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-muted-foreground">Current Access Key</Label>
                      <Input type="password" placeholder="••••••••" className="h-12 bg-black/40 border-white/5 rounded-xl focus:ring-primary/40" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-muted-foreground">New Access Key</Label>
                      <Input type="password" placeholder="••••••••" className="h-12 bg-black/40 border-white/5 rounded-xl focus:ring-primary/40" />
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-xl border-white/10 font-bold h-11 px-8">Update Keys</Button>
                </div>

                <Separator className="bg-white/5" />

                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" /> Multi-factor Authentication
                  </h4>
                  <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="space-y-1">
                      <p className="font-bold text-sm">Hardware Token / App Signal</p>
                      <p className="text-xs text-muted-foreground">Require a professional verification code for sensitive actions.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator className="bg-white/5" />

                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Professional Sessions
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold">Node Satoshi-01 (Current)</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Active Now • San Salvador, SV</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 text-[9px] font-bold">STABLE</Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive gap-2 font-bold text-[10px] uppercase tracking-widest hover:bg-destructive/10">
                      <LogOut className="w-3.5 h-3.5" /> Terminate All External Sessions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
