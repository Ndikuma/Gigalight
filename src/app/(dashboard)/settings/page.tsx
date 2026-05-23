
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Shield, 
  MapPin, 
  Trophy, 
  Rocket, 
  CheckCircle,
  Lock,
  Smartphone,
  Camera,
  Loader2,
  Zap,
  Activity,
  Clock,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ProfileService } from '@/services/profile-service';
import { TierService } from '@/services/tier-service';
import { User as UserType, Tier, TierPaymentResponse } from '@/lib/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';

type SettingsSection = 'identity' | 'tiers' | 'security';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as SettingsSection || 'identity';
  
  const [user, setUser] = useState<UserType | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>(initialTab);
  const [isLoading, setIsLoading] = useState(true);

  // Payment states
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<TierPaymentResponse | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    if (initialTab) {
      setActiveSection(initialTab);
    }

    async function fetchData() {
      setIsLoading(true);
      try {
        const [profRes, tierRes] = await Promise.all([
          ProfileService.getMyProfile(),
          TierService.listTiers()
        ]);
        if (profRes.data) setUser(profRes.data);
        if (tierRes.data) setTiers(tierRes.data.results || []);
      } catch (err) {
        toast({ variant: "destructive", title: "Protocol Signal Lost", description: "Could not fetch configuration data." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [initialTab]);

  useEffect(() => {
    if (isPolling && paymentData?.transaction_id) {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const res = await TierService.checkPaymentStatus(paymentData.transaction_id);
          if (res.data?.is_complete || res.data?.status === 'confirmed') {
            cleanupPayment();
            setIsPaymentOpen(false);
            toast({ 
              title: "Activation Confirmed", 
              description: `Your node has been upgraded to ${paymentData.tier?.display_label} Class.` 
            });
            // Refresh profile to update tier badge
            const profRes = await ProfileService.getMyProfile();
            if (profRes.data) setUser(profRes.data);
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 3000);
    }

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [isPolling, paymentData]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0) {
      cleanupPayment();
      toast({ variant: "destructive", title: "Invoice Expired", description: "The L2 activation path has timed out." });
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [timeLeft]);

  const cleanupPayment = () => {
    setPaymentData(null);
    setIsPolling(false);
    setTimeLeft(null);
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!mounted) return null;

  async function handleSave() {
    if (!user) return;
    try {
      const res = await ProfileService.updateProfile({
        display_name: user.display_name,
      });
      if (res.data) {
        toast({
          title: "Protocol Synced",
          description: "Settings metadata has been propagated across your node identity.",
        });
      } else {
        toast({ variant: "destructive", title: "Update Failed", description: res.error || "Could not sync identity changes." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Interface Error", description: "Failed to communicate with the gateway." });
    }
  }

  async function handleUpgrade(tier: Tier) {
    const isActive = user?.current_tier?.id === tier.id;
    if (isActive) {
       toast({ title: "Tier Active", description: "Your node is already operating at this protocol level." });
       return;
    }

    if (tier.cost_sats === 0) {
       toast({ title: "Base Protocol", description: "This is a default node standing." });
       return;
    }
    
    setIsGeneratingInvoice(true);
    try {
      const res = await TierService.generateTierInvoice(tier.id);
      if (res.data) {
        setPaymentData(res.data);
        setIsPaymentOpen(true);
        setIsPolling(true);
        
        const expiresAt = new Date(res.data.expires_at).getTime();
        const now = new Date().getTime();
        const initialSeconds = Math.floor((expiresAt - now) / 1000);
        setTimeLeft(initialSeconds > 0 ? initialSeconds : 0);

        toast({ title: "Invoice Propagated", description: `Waiting for ${tier.display_label} activation signal.` });
      } else {
        toast({ variant: "destructive", title: "Gateway Error", description: res.error || "Could not generate invoice." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Network Error", description: "The protocol node is unreachable." });
    } finally {
      setIsGeneratingInvoice(false);
    }
  }

  const navItems = [
    { id: 'identity', label: 'Identity', icon: User, desc: 'Profile & Bio' },
    { id: 'tiers', label: 'Node Tiers', icon: Trophy, desc: 'Signal & Rewards' },
    { id: 'security', label: 'Security', icon: Shield, desc: 'Access Control' },
  ];

  if (isLoading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="space-y-1">
        <h1 className="text-4xl font-headline font-bold">Configuration</h1>
        <p className="text-muted-foreground">Manage your decentralized node identity and platform parameters.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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

        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'identity' && user && (
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
                        <img src={user.profile?.avatar_url || 'https://picsum.photos/seed/node/200/200'} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-xl border-4 border-card shadow-xl hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="space-y-3 flex-1 text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <h4 className="font-bold">Protocol Avatar</h4>
                      <Badge className="bg-primary/10 text-primary border-none uppercase text-[9px] font-bold tracking-widest">
                        {user.current_tier?.display_label || 'Standard'} Node
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                      Use a professional identifier. Avatars are propagated across all technical missions and strategic proposals.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Full Node Name</Label>
                    <Input 
                      value={user.display_name} 
                      onChange={(e) => setUser({...user, display_name: e.target.value})}
                      className="h-12 bg-black/40 border-white/5 rounded-xl font-bold focus:ring-primary/40" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Technical Jurisdiction</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        value={user.profile?.location || ''} 
                        onChange={(e) => setUser({...user, profile: {...user.profile, location: e.target.value}})}
                        className="h-12 bg-black/40 border-white/5 rounded-xl pl-11 focus:ring-primary/40" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Professional Mission Bio</Label>
                  <textarea 
                    className="w-full min-h-[140px] bg-black/40 border-white/5 rounded-2xl p-6 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/40"
                    value={user.profile?.bio || ''}
                    onChange={(e) => setUser({...user, profile: {...user.profile, bio: e.target.value}})}
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
                  {tiers.map((tier) => {
                    const isActive = user?.current_tier?.id === tier.id;
                    return (
                      <div key={tier.id} className={cn(
                        "p-6 rounded-[2rem] border transition-all flex flex-col justify-between h-auto min-h-[320px] relative overflow-hidden group",
                        isActive 
                          ? "border-secondary/40 bg-secondary/5 ring-1 ring-secondary/20 shadow-2xl" 
                          : "border-white/5 bg-black/40 hover:border-white/10"
                      )}>
                        {isActive && (
                          <div className="absolute top-0 right-0 p-3">
                            <CheckCircle className="w-5 h-5 text-secondary" />
                          </div>
                        )}
                        <div className="space-y-4">
                          <div>
                            <Badge className={cn(
                              "text-[9px] uppercase font-bold tracking-widest px-3",
                              tier.name === 'elite' ? "bg-amber-500" : tier.name === 'pro' ? "bg-primary" : "bg-muted"
                            )}>
                               {tier.icon} {tier.display_label}
                            </Badge>
                            <p className="text-2xl font-headline font-bold mt-2">{tier.cost_sats > 0 ? `${tier.cost_sats.toLocaleString()} SAT` : 'Free'}</p>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed italic">{tier.description}</p>
                          <div className="space-y-2">
                             <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Benefits Signal</p>
                             <ul className="space-y-2">
                                {(tier.benefits || "").split('\n').map((benefit, i) => (
                                  <li key={i} className="text-[10px] text-white/70 flex items-start gap-2">
                                    <div className="w-1 h-1 rounded-full bg-secondary shrink-0 mt-1.5" /> {benefit.replace('- ', '')}
                                  </li>
                                ))}
                                <li className="text-[10px] text-white/70 flex items-start gap-2">
                                  <div className="w-1 h-1 rounded-full bg-secondary shrink-0 mt-1.5" /> {tier.fee_task}% Task Fee Signal
                                </li>
                                <li className="text-[10px] text-white/70 flex items-start gap-2">
                                  <div className="w-1 h-1 rounded-full bg-secondary shrink-0 mt-1.5" /> {tier.fee_project}% Project Fee Signal
                                </li>
                             </ul>
                          </div>
                        </div>
                        
                        {isActive ? (
                          <div className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] flex items-center gap-2 px-1 mt-6">
                            <CheckCircle className="w-3.5 h-3.5" /> Active Protocol Level
                          </div>
                        ) : (
                          <button 
                            className="w-full rounded-xl h-12 font-bold uppercase tracking-widest text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 transition-colors mt-6 disabled:opacity-50"
                            onClick={() => handleUpgrade(tier)}
                            disabled={isGeneratingInvoice}
                          >
                            {isGeneratingInvoice ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Select Tier'}
                          </button>
                        )}
                      </div>
                    );
                  })}
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={(open) => {
        setIsPaymentOpen(open);
        if (!open) cleanupPayment();
      }}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[450px] rounded-[2.5rem] overflow-hidden p-0">
          <div className="p-8 space-y-6">
            <DialogHeader className="p-0">
              <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Zap className="w-6 h-6" />
                </div>
                Activation Path
              </DialogTitle>
              <DialogDescription className="text-sm">
                Propagate SATs via Lightning to activate {paymentData?.tier?.display_label} Class status.
              </DialogDescription>
            </DialogHeader>

            {paymentData && (
              <div className="space-y-8 text-center animate-in zoom-in-95 duration-300">
                <div className="mx-auto bg-white p-5 rounded-[2.5rem] w-fit shadow-2xl shadow-secondary/20 border-8 border-secondary/10 relative overflow-hidden group">
                  <div className="w-48 h-48 rounded-2xl flex items-center justify-center relative bg-white">
                    <img 
                      src={paymentData.qr_code || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(paymentData.payment_request)}`} 
                      alt="Activation QR" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
                    <Activity className="w-3 h-3 text-secondary animate-pulse" />
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Awaiting Activation Signal</span>
                  </div>
                  <p className="text-2xl font-headline font-bold text-white">{paymentData.amount_sats.toLocaleString()} SAT</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest px-2">
                    <span className="text-muted-foreground">Session Expiry</span>
                    <span className={cn("flex items-center gap-1.5", timeLeft && timeLeft < 300 ? "text-destructive" : "text-secondary")}>
                      <Clock className="w-3 h-3" />
                      {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl p-4 overflow-hidden group/trace">
                    <div className="flex-1 text-left">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Signal Trace (BOLT11)</p>
                      <p className="text-[11px] font-mono text-white/70 truncate leading-none">
                        {paymentData.payment_request.substring(0, 12)}...{paymentData.payment_request.substring(paymentData.payment_request.length - 12)}
                      </p>
                    </div>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-10 w-10 shrink-0 rounded-xl neon-glow-secondary hover:scale-105 transition-transform"
                      onClick={() => {
                         navigator.clipboard.writeText(paymentData.payment_request);
                         setHasCopied(true);
                         setTimeout(() => setHasCopied(false), 2000);
                         toast({ title: "Signal Copied to Node" });
                      }}
                    >
                      {hasCopied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button variant="ghost" className="w-full font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-white" onClick={cleanupPayment}>
                  Abort Activation Path
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
