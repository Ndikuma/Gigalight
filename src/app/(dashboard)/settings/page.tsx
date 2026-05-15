
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
  Globe, 
  MapPin, 
  Trophy, 
  Rocket, 
  CheckCircle,
  Lock,
  Smartphone,
  ShieldCheck,
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
import { mockProfile, mockWallet } from '@/lib/mock-data';
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

type SettingsSection = 'identity' | 'wallet' | 'tiers' | 'security';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as SettingsSection || 'identity';
  
  const [profile, setProfile] = useState(mockProfile);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>(initialTab);

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
  }, [initialTab]);

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

  // Wallet Mock Handlers
  async function handleGenerateInvoice() {
    setIsGeneratingInvoice(true);
    await new Promise(r => setTimeout(r, 1500));
    setInvoice(`lnbc${depositAmount}n1p3uxls...v${Math.random().toString(36).substring(7)}`);
    setIsGeneratingInvoice(false);
  }

  async function handleDecodeInvoice(manualValue?: string) {
    const val = manualValue || withdrawInvoice;
    if (!val.startsWith('lnbc')) {
      toast({ variant: "destructive", title: "Invalid Invoice", description: "Please provide a valid Lightning Network (BOLT11) invoice." });
      return;
    }
    setIsDecoding(true);
    await new Promise(r => setTimeout(r, 1200));
    setDecodedData({
      amount: Math.floor(Math.random() * 50000) + 1000,
      description: "External Strategic Settlement"
    });
    setIsDecoding(false);
  }

  function handleCopy() {
    if (invoice) {
      navigator.clipboard.writeText(invoice);
      setHasCopied(true);
      toast({ title: "Invoice Copied", description: "Ready to be pasted in your external wallet." });
      setTimeout(() => setHasCopied(false), 2000);
    }
  }

  function handleConfirmWithdraw() {
    setIsProcessingWithdraw(true);
    setTimeout(() => {
      setIsProcessingWithdraw(false);
      setIsWithdrawOpen(false);
      setWithdrawInvoice('');
      setDecodedData(null);
      toast({ title: "Withdrawal Propagated", description: "SATs are settling across the GigaLight protocol." });
    }, 2000);
  }

  const navItems = [
    { id: 'identity', label: 'Identity', icon: User, desc: 'Profile & Bio' },
    { id: 'wallet', label: 'Financials', icon: WalletIcon, desc: 'Yield & Escrow' },
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

          {activeSection === 'wallet' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                  label="Liquid Balance" 
                  value={`${mockWallet.availableBalance.toLocaleString()} SAT`} 
                  icon={WalletIcon} 
                  subValue="Settled and available for release"
                  color="primary"
                />
                <StatCard 
                  label="Platform Yield" 
                  value={`${mockWallet.totalRewarded.toLocaleString()} SAT`} 
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
                    {[
                      { type: 'income', label: 'Technical Architecture Audit Yield', amount: 12000, date: 'Today, 2:30 PM', status: 'finalized' },
                      { type: 'expense', label: 'Withdrawal to External Node', amount: 50000, date: 'Yesterday, 11:15 AM', status: 'finalized' },
                      { type: 'income', label: 'Node Validator Tier Reward', amount: 500, date: 'Oct 24, 2023', status: 'finalized' },
                      { type: 'pending', label: 'Escrow Lock: L2 Bridge Implementation', amount: 25000, date: 'Awaiting Milestone', status: 'pending' },
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            tx.type === 'income' ? "bg-emerald-400/10 text-emerald-400" : 
                            tx.type === 'expense' ? "bg-primary/10 text-primary" : "bg-yellow-400/10 text-yellow-400"
                          )}>
                            {tx.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : 
                             tx.type === 'expense' ? <ArrowUpRight className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{tx.label}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "font-headline font-bold text-lg",
                            tx.type === 'income' ? "text-emerald-400" : "text-foreground"
                          )}>
                            {tx.type === 'expense' ? '-' : '+'}{tx.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
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
                          <CheckCircle className="w-3 h-3" /> Active Protocol Level
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
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
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
                    onClick={handleCopy}
                  >
                    {hasCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button variant="ghost" className="w-full font-bold text-muted-foreground" onClick={() => setInvoice(null)}>
                Modify Parameters
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Withdraw Modal */}
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
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">LND Invoice (BOLT11)</Label>
              </div>
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
                    onClick={() => handleDecodeInvoice()}
                    disabled={isDecoding || !withdrawInvoice}
                  >
                    {isDecoding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'DECODE'}
                  </Button>
                )}
                {decodedData && (
                  <button 
                    className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-white"
                    onClick={() => {
                      setWithdrawInvoice('');
                      setDecodedData(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {decodedData && (
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 space-y-4 animate-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Settlement Amount</span>
                  <span className="text-2xl font-headline font-bold text-primary">{decodedData.amount.toLocaleString()} SAT</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Description</span>
                  <span className="text-xs font-bold">{decodedData.description}</span>
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
            <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest">
              Instant Settlement via GigaLight L2 Protocol
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
