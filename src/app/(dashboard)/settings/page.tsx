
"use client"

import React, { useState, useEffect } from 'react';
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
  Wallet as WalletIcon,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  QrCode,
  Copy,
  Check,
  Zap,
  X,
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { StatCard } from '@/components/dashboard/StatCard';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
import { ProfileService } from '@/services/profile-service';
import { WalletService } from '@/services/wallet-service';
import { User as UserType, Wallet as WalletType } from '@/lib/types';

type SettingsSection = 'identity' | 'wallet' | 'tiers' | 'security';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as SettingsSection || 'identity';
  
  const [user, setUser] = useState<UserType | null>(null);
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>(initialTab);
  const [isLoading, setIsLoading] = useState(true);

  // Wallet State
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('10000');
  const [invoice, setInvoice] = useState<string | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [withdrawInvoice, setWithdrawInvoice] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedData, setDecodedData] = useState<{ amount: number; description: string } | null>(null);
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (initialTab) setActiveSection(initialTab);

    async function fetchData() {
      setIsLoading(true);
      try {
        const [profRes, walletRes] = await Promise.all([
          ProfileService.getMyProfile(),
          WalletService.getWallet()
        ]);
        if (profRes.data) setUser(profRes.data);
        if (walletRes.data) setWallet(walletRes.data);
      } catch (err) {
        toast({ variant: "destructive", title: "Protocol Signal Lost", description: "Could not fetch configuration data." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [initialTab]);

  if (!mounted) return null;

  async function handleSave() {
    if (!user) return;
    try {
      const res = await ProfileService.updateProfile({
        display_name: user.display_name,
        // Profile fields might be nested or on a different object depending on backend implementation
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

  async function handleUpgrade(tierId: string, cost: number) {
    if (!wallet || (wallet.available_balance || 0) < cost) {
      toast({
        variant: "destructive",
        title: "Insufficient Liquidity",
        description: `Upgrade requires ${cost.toLocaleString()} SAT. Please deposit funds.`,
      });
      setIsDepositOpen(true);
      return;
    }

    try {
      toast({
        title: "Activation Propagated",
        description: `Your ${tierId.toUpperCase()} Node tier has been queued for settlement.`,
      });
      const profRes = await ProfileService.getMyProfile();
      if (profRes.data) setUser(profRes.data);
    } catch (e) {
      toast({ variant: "destructive", title: "Settlement Error", description: "Critical error during tier activation." });
    }
  }

  async function handleGenerateInvoice() {
    setIsGeneratingInvoice(true);
    try {
      const res = await WalletService.generateDepositInvoice(parseInt(depositAmount));
      if (res.data) {
        setInvoice((res.data as any).lnd_invoice || `lnbc${depositAmount}demo...`);
        toast({ title: "Invoice Generated", description: "Scan or copy to propagate SATs." });
      } else {
        toast({ variant: "destructive", title: "Gateway Error", description: res.error || "Could not generate invoice." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Network Error", description: "The Blink node is unreachable." });
    } finally {
      setIsGeneratingInvoice(false);
    }
  }

  async function handleConfirmWithdraw() {
    if (!decodedData) return;
    setIsProcessingWithdraw(true);
    try {
      const res = await WalletService.initiateWithdrawal(withdrawInvoice);
      if (res.data) {
        toast({ title: "Withdrawal Propagated", description: "SATs are settling across the protocol." });
        setIsWithdrawOpen(false);
        setWithdrawInvoice('');
        setDecodedData(null);
        const wRes = await WalletService.getWallet();
        if (wRes.data) setWallet(wRes.data);
      } else {
        toast({ variant: "destructive", title: "Settlement Rejected", description: res.error || "Insufficient node liquidity." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Protocol Error", description: "L2 settlement path not found." });
    } finally {
      setIsProcessingWithdraw(false);
    }
  }

  const navItems = [
    { id: 'identity', label: 'Identity', icon: User, desc: 'Profile & Bio' },
    { id: 'wallet', label: 'Financials', icon: WalletIcon, desc: 'Yield & Escrow' },
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
                        {user.tier || 'Standard'} Node
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

          {activeSection === 'wallet' && wallet && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                  label="Liquid Balance" 
                  value={`${(wallet?.available_balance || 0).toLocaleString()} SAT`} 
                  icon={WalletIcon} 
                  subValue="Settled and available for release"
                  color="primary"
                />
                <StatCard 
                  label="Platform Yield" 
                  value={`${(wallet?.total_rewarded || 0).toLocaleString()} SAT`} 
                  icon={History} 
                  subValue="Total revenue finalized on-chain"
                  color="emerald"
                />
              </div>

              <Card className="glass-card border-none">
                <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-headline text-2xl">Ledger Activity</CardTitle>
                    <CardDescription>Comprehensive record of technical yields and settlements.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl h-10 border-white/5 font-bold" onClick={() => setIsWithdrawOpen(true)}>Withdraw</Button>
                    <Button className="rounded-xl h-10 bg-primary font-bold" onClick={() => setIsDepositOpen(true)}>Deposit</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-1">
                    {Array.isArray(wallet?.transactions) && wallet.transactions.length > 0 ? wallet.transactions.map((tx, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            tx.amount > 0 ? "bg-emerald-400/10 text-emerald-400" : "bg-primary/10 text-primary"
                          )}>
                            {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{tx.description}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{new Date(tx.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "font-headline font-bold text-lg",
                            tx.amount > 0 ? "text-emerald-400" : "text-foreground"
                          )}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-10 text-muted-foreground font-bold">No ledger activity detected.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
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
                    { id: 'basic', name: 'Basic Node', fee: 'Free', rawFee: 0, color: 'bg-muted', perks: ['Standard Yield', 'Public Discovery'] },
                    { id: 'pro', name: 'Pro Node', fee: '50k SAT/yr', rawFee: 50000, color: 'bg-primary', perks: ['Reduced Signal Fees', 'Priority Discovery', 'Pro Badge'] },
                    { id: 'elite', name: 'Elite Node', fee: '250k SAT/yr', rawFee: 250000, color: 'bg-amber-500', perks: ['Zero Signal Fees', 'Expert Only Gigs', 'Enterprise Tier'] }
                  ].map((tier) => (
                    <div key={tier.id} className={cn(
                      "p-6 rounded-[2rem] border transition-all flex flex-col justify-between h-[300px] relative overflow-hidden group",
                      user?.tier === tier.id 
                        ? "border-secondary/40 bg-secondary/5 ring-1 ring-secondary/20 shadow-2xl" 
                        : "border-white/5 bg-black/40 hover:border-white/10"
                    )}>
                      {user?.tier === tier.id && (
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
                      
                      {user?.tier === tier.id ? (
                        <div className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                          <CheckCircle className="w-3 h-3" /> Active Protocol Level
                        </div>
                      ) : (
                        <button 
                          className="w-full rounded-xl h-12 font-bold uppercase tracking-widest text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                          onClick={() => handleUpgrade(tier.id, tier.rawFee)}
                        >
                          Select Tier
                        </button>
                      )}
                    </div>
                  ))}
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

      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" /> Deposit SATs
            </DialogTitle>
            <DialogDescription>
              Generate a Lightning Network invoice to fund your project escrow.
            </DialogDescription>
          </DialogHeader>

          {!invoice ? (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount (SAT)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={depositAmount} 
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="h-14 bg-white/5 border-white/5 text-xl font-bold pl-4"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">SATOSHIS</div>
                </div>
              </div>
              <Button 
                className="w-full h-14 rounded-xl bg-secondary hover:brightness-110 font-bold text-lg neon-glow-secondary"
                onClick={handleGenerateInvoice}
                disabled={isGeneratingInvoice}
              >
                {isGeneratingInvoice ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Generating...
                  </>
                ) : 'Generate Invoice'}
              </Button>
            </div>
          ) : (
            <div className="space-y-8 py-6 text-center animate-in zoom-in-95 duration-300">
              <div className="mx-auto bg-white p-4 rounded-3xl w-fit shadow-2xl shadow-secondary/20 border-4 border-secondary/20">
                <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <QrCode className="w-40 h-40 text-black opacity-90" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-2xl p-4 overflow-hidden">
                  <p className="text-[10px] font-mono text-muted-foreground truncate flex-1 text-left">{invoice}</p>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 hover:bg-white/10 shrink-0"
                    onClick={() => {
                       navigator.clipboard.writeText(invoice!);
                       setHasCopied(true);
                       setTimeout(() => setHasCopied(false), 2000);
                       toast({ title: "Invoice Copied" });
                    }}
                  >
                    {hasCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <Button 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 font-bold rounded-xl h-12"
                  onClick={() => setIsDepositOpen(false)}
                >
                  Confirm Simulation Payment
                </Button>
              </div>
              <Button variant="ghost" className="w-full font-bold text-muted-foreground" onClick={() => setInvoice(null)}>
                Modify Parameters
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-primary" /> Professional Withdrawal
            </DialogTitle>
            <DialogDescription>
              Payout your platform yield to an external Lightning Network node.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">LND Invoice (BOLT11)</Label>
              <div className="relative">
                <Input 
                  placeholder="lnbc1..." 
                  value={withdrawInvoice}
                  onChange={(e) => setWithdrawInvoice(e.target.value)}
                  className="h-14 bg-white/5 border-white/5 text-sm font-mono pr-24"
                />
                {!decodedData && (
                  <Button 
                    size="sm" 
                    className="absolute right-2 top-2 h-10 rounded-lg font-bold"
                    onClick={async () => {
                      if (!withdrawInvoice.startsWith('lnbc')) return;
                      setIsDecoding(true);
                      await new Promise(r => setTimeout(r, 1000));
                      setDecodedData({ amount: 15000, description: "External Payout" });
                      setIsDecoding(false);
                    }}
                    disabled={isDecoding || !withdrawInvoice}
                  >
                    {isDecoding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'DECODE'}
                  </Button>
                )}
              </div>
            </div>

            {decodedData && (
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 space-y-4 animate-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Settlement Amount</span>
                  <span className="text-2xl font-headline font-bold text-primary">{decodedData.amount.toLocaleString()} SAT</span>
                </div>
              </div>
            )}

            <Button 
              className="w-full h-14 rounded-xl bg-primary hover:brightness-110 font-bold text-lg neon-glow-primary"
              disabled={!decodedData || isProcessingWithdraw}
              onClick={handleConfirmWithdraw}
            >
              {isProcessingWithdraw ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing Yield...
                </>
              ) : 'Confirm Withdrawal'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
