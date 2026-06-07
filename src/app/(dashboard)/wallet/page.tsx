"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { WalletService, WithdrawDecodeResponse } from '@/services/wallet-service';
import { Wallet as WalletType, WalletTransaction, DepositInvoiceResponse } from '@/lib/types';
import { 
  Wallet as WalletIcon, 
  ArrowDownLeft, 
  ArrowUpRight, 
  History, 
  Zap, 
  Copy, 
  Check, 
  Loader2, 
  Clock, 
  RefreshCw, 
  Activity, 
  Bitcoin, 
  CheckCircle2, 
  ShieldAlert, 
  Network,
  Shield,
  Layers,
  ArrowRightLeft,
  ExternalLink,
  Search,
  Eye,
  Info,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { DepositSession } from '@/components/wallet/DepositSession';
import { StarRating } from '@/components/ui/star-rating';

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Dialog States
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isFullLedgerOpen, setIsFullLedgerOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);
  
  const [depositMethod, setDepositMethod] = useState<'lightning' | 'onchain'>('lightning');
  const [depositAmount, setDepositAmount] = useState('5000');
  const [invoiceData, setInvoiceData] = useState<DepositInvoiceResponse | null>(null);
  const [onchainData, setOnchainData] = useState<{ bitcoin_address: string, qr_code?: string } | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [isLoadingOnchain, setIsLoadingOnchain] = useState(false);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchWalletData = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await WalletService.getWallet();
      if (res.data) setWallet(res.data);
    } catch (err) {
      console.error("Wallet fetch error", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  const cleanupDeposit = () => {
    setInvoiceData(null);
    setOnchainData(null);
    setIsDepositOpen(false);
    fetchWalletData(true);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Signal Captured", description: `${label} copied to terminal.` });
  };

  async function handleGenerateInvoice() {
    setIsGeneratingInvoice(true);
    try {
      const res = await WalletService.generateDepositInvoice(parseInt(depositAmount));
      if (res.data) setInvoiceData(res.data);
    } finally {
      setIsGeneratingInvoice(false);
    }
  }

  async function handleGetOnchainAddress() {
    setIsLoadingOnchain(true);
    try {
      const res = await WalletService.getBitcoinAddress();
      if (res.data) setOnchainData(res.data);
    } finally {
      setIsLoadingOnchain(false);
    }
  }

  const recentTransactions = (wallet?.transactions || []).slice(0, 10);

  if (isLoading) {
    return <div className="h-[80vh] flex items-center justify-center"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 sm:px-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold">Financial Control</h1>
          <p className="text-muted-foreground">Manage your decentralized liquidity, technical yields, and L2 settlements.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className={cn("rounded-xl border border-white/5", isRefreshing && "animate-spin")} onClick={() => fetchWalletData()} disabled={isRefreshing}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="rounded-2xl bg-card border-white/5 gap-2 px-6 sm:px-8 h-12 sm:h-14 font-bold" onClick={() => setIsWithdrawOpen(true)}>
            <ArrowUpRight className="w-4 h-4 text-primary" /> Payout
          </Button>
          <Button className="rounded-2xl bg-primary hover:brightness-110 gap-2 px-6 sm:px-8 h-12 sm:h-14 font-bold neon-glow-primary shadow-lg shadow-primary/20" onClick={() => setIsDepositOpen(true)}>
            <ArrowDownLeft className="w-4 h-4" /> Fund Node
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <StatCard label="Liquid Balance" value={`${(wallet?.available_balance || 0).toLocaleString()} SAT`} icon={WalletIcon} subValue="L2 Available" color="primary" />
        <StatCard label="Pending Audit" value={`${(wallet?.pending_balance || 0).toLocaleString()} SAT`} icon={Clock} subValue="Incoming signals" color="secondary" />
        <StatCard label="Locked Escrow" value={`${(wallet?.locked_balance || 0).toLocaleString()} SAT`} icon={Shield} subValue="Contractual custody" color="emerald" />
        <StatCard label="Total Revenue" value={`${(wallet?.total_rewarded || 0).toLocaleString()} SAT`} icon={Zap} subValue="Lifetime earnings" color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 px-4 sm:px-0">
          <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden">
             <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-2xl flex items-center gap-3">
                  <ArrowRightLeft className="w-6 h-6 text-primary" /> Liquidity Bridge
                </CardTitle>
                <Badge variant="outline" className="border-primary/20 text-primary uppercase text-[10px] font-bold tracking-widest px-3">
                  <Network className="w-3 h-3 mr-2" /> Live Rails
                </Badge>
             </CardHeader>
             <CardContent className="p-8 pt-0 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                   <div className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between">
                         <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Bitcoin className="w-6 h-6" /></div>
                         <Badge className="bg-emerald-500/10 text-emerald-400 border-none uppercase text-[8px] font-bold">L1 Finality</Badge>
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Bitcoin Mainnet</p>
                         <h4 className="text-xl font-bold">Vault Storage</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">Cold-reserve liquidity for institutional project escrow funding.</p>
                   </div>

                   <div className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between">
                         <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary"><Zap className="w-6 h-6" /></div>
                         <Badge className="bg-emerald-500/10 text-emerald-400 border-none uppercase text-[8px] font-bold">L2 Instant</Badge>
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Lightning Network</p>
                         <h4 className="text-xl font-bold">Velocity Terminal</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">Instant propagation of micro-mission yields and technical signals.</p>
                   </div>
                </div>

                <div className="relative">
                   <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dashed border-white/10" /></div>
                   <div className="relative flex justify-center">
                      <div className="bg-card px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Protocol Bridge Status: Synchronized
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="font-headline text-2xl">Protocol Ledger</CardTitle>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent Technical Signals</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-xl border border-white/5 h-9 font-bold text-[10px] uppercase tracking-widest gap-2" onClick={() => setIsFullLedgerOpen(true)}>
                Audit Full Ledger <ChevronRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx, i) => (
                    <button 
                      key={tx.id || i} 
                      className="w-full flex items-center justify-between p-6 hover:bg-white/[0.04] transition-all text-left group"
                      onClick={() => setSelectedTx(tx)}
                    >
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-105", 
                          tx.amount > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20"
                        )}>
                          {tx.amount > 0 ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm group-hover:text-white transition-colors">{tx.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                             <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{new Date(tx.created_at).toLocaleDateString()}</p>
                             <span className="text-white/10">•</span>
                             <Badge className="bg-white/5 text-[8px] border-none text-muted-foreground uppercase h-4">{tx.status_display}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn("font-headline font-bold text-xl", tx.amount > 0 ? "text-emerald-400" : "text-foreground")}>{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} SAT</p>
                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{tx.type_display}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-24 text-muted-foreground font-bold flex flex-col items-center gap-4">
                    <History className="w-12 h-12 opacity-10" />
                    <p className="text-xs uppercase tracking-widest">No ledger activity propagated.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 px-4 sm:px-0">
          <Card className="glass-card border-none bg-gradient-to-br from-secondary/10 border-secondary/20 rounded-[2rem]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="font-headline text-xl flex items-center gap-3">
                <Network className="w-5 h-5 text-secondary" /> Rail Integrity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="space-y-4">
                 <HealthItem label="L1 Bitcoin Core" status="Operational" icon={Bitcoin} color="emerald" />
                 <HealthItem label="L2 Lightning Node" status="Operational" icon={Zap} color="emerald" />
                 <HealthItem label="Multi-sig Escrow" status="Active" icon={Shield} color="emerald" />
                 <HealthItem label="Oracle Feed" status="Synced" icon={Activity} color="emerald" />
              </div>

              <div className="h-px bg-white/5" />

              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reputation Multiplier</h4>
                 <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">1.2x Yield</p>
                    <StarRating reputation={85} />
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none p-8 rounded-[2rem] text-center space-y-4 border-dashed">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm">Node Standing</h4>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
              Maintain a trust index &gt; 90 to qualify for Enterprise L1 payroll squads.
            </p>
          </Card>
        </div>
      </div>

      {/* Deposit Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={(open) => { if (!open) cleanupDeposit(); }}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[450px] w-[95vw] sm:w-full rounded-[2.5rem] overflow-hidden p-0 shadow-2xl">
          <div className="p-6 sm:p-8 space-y-6">
            <DialogHeader className="p-0 text-left">
              <DialogTitle className="text-xl sm:text-2xl font-headline font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shadow-inner">
                  <ArrowDownLeft className="w-6 h-6" />
                </div>
                Fund Node
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">Select preferred settlement path.</DialogDescription>
            </DialogHeader>

            {invoiceData ? (
              <DepositSession paymentData={invoiceData} onSuccess={() => fetchWalletData(true)} onCancel={cleanupDeposit} />
            ) : (
              <Tabs defaultValue="lightning" onValueChange={(v) => setDepositMethod(v as any)} className="w-full">
                <TabsList className="grid grid-cols-2 bg-white/5 p-1 rounded-xl h-auto mb-6">
                  <TabsTrigger value="lightning" className="rounded-lg py-2.5 font-bold text-xs gap-2 data-[state=active]:bg-secondary">
                    <Zap className="w-3.5 h-3.5" /> Lightning
                  </TabsTrigger>
                  <TabsTrigger value="onchain" className="rounded-lg py-2.5 font-bold text-xs gap-2 data-[state=active]:bg-primary">
                    <Bitcoin className="w-3.5 h-3.5" /> On-Chain
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="lightning" className="space-y-6 mt-0 animate-in fade-in">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Liquidity Amount (SAT)</Label>
                    <Input 
                      type="number" 
                      value={depositAmount} 
                      onChange={(e) => setDepositAmount(e.target.value.replace(/[^0-9]/g, ''))} 
                      className="h-16 bg-white/5 border-white/10 rounded-2xl text-2xl font-headline font-bold pl-6 focus:ring-secondary/40" 
                    />
                  </div>
                  <Button 
                    className="w-full h-16 rounded-2xl bg-secondary hover:brightness-110 font-bold text-lg neon-glow-secondary" 
                    onClick={handleGenerateInvoice} 
                    disabled={isGeneratingInvoice}
                  >
                    {isGeneratingInvoice ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate L2 Invoice'}
                  </Button>
                </TabsContent>
                <TabsContent value="onchain" className="py-10 text-center space-y-6">
                   {!onchainData ? (
                     <div className="space-y-6">
                        <Bitcoin className="w-12 h-12 text-primary/20 mx-auto" />
                        <p className="text-sm text-muted-foreground">Propagate a permanent L1 deposit address for large-scale node funding.</p>
                        <Button variant="outline" className="w-full border-primary/20 text-primary font-bold h-12 rounded-xl" onClick={handleGetOnchainAddress} disabled={isLoadingOnchain}>
                          {isLoadingOnchain ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate L1 Address'}
                        </Button>
                     </div>
                   ) : (
                     <div className="space-y-6 animate-in zoom-in-95">
                        <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto shadow-2xl">
                           <img src={onchainData.qr_code} alt="Onchain QR" className="w-full h-full" />
                        </div>
                        <div className="p-4 bg-black/40 border border-white/10 rounded-xl text-left">
                           <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">L1 Bitcoin Address</p>
                           <p className="text-[10px] font-mono break-all text-white/90">{onchainData.bitcoin_address}</p>
                        </div>
                     </div>
                   )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Ledger Dialog */}
      <Dialog open={isFullLedgerOpen} onOpenChange={setIsFullLedgerOpen}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[700px] rounded-[2.5rem] p-0 shadow-2xl overflow-hidden">
           <DialogHeader className="p-8 border-b border-white/5">
              <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-3">
                 <History className="w-6 h-6 text-primary" /> Full Technical Ledger
              </DialogTitle>
              <DialogDescription>A complete chronological audit of all node signal activity.</DialogDescription>
           </DialogHeader>
           <ScrollArea className="h-[60vh]">
              <div className="divide-y divide-white/5">
                 {wallet?.transactions.map((tx, i) => (
                    <button 
                      key={tx.id || i} 
                      className="w-full flex items-center justify-between p-6 hover:bg-white/[0.04] transition-all text-left group"
                      onClick={() => {
                        setIsFullLedgerOpen(false);
                        setSelectedTx(tx);
                      }}
                    >
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border", 
                          tx.amount > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20"
                        )}>
                          {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{tx.description}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">{new Date(tx.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn("font-headline font-bold text-lg", tx.amount > 0 ? "text-emerald-400" : "text-foreground")}>{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} SAT</p>
                        <Badge className="bg-white/5 text-[7px] border-none text-muted-foreground uppercase h-3.5">{tx.status_display}</Badge>
                      </div>
                    </button>
                 ))}
              </div>
           </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[500px] rounded-[2.5rem] p-0 shadow-2xl overflow-hidden">
          {selectedTx && (
            <>
              <DialogHeader className="p-8 pb-0 text-center">
                <div className={cn(
                  "w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-4",
                  selectedTx.amount > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20"
                )}>
                  {selectedTx.amount > 0 ? <ArrowDownLeft className="w-10 h-10" /> : <ArrowUpRight className="w-10 h-10" />}
                </div>
                <DialogTitle className="text-3xl font-headline font-bold mb-1">
                  {selectedTx.amount > 0 ? '+' : ''}{selectedTx.amount.toLocaleString()} SAT
                </DialogTitle>
                <div className="flex items-center justify-center gap-2">
                   <Badge className="bg-white/5 text-[9px] font-bold border-none uppercase tracking-widest px-3 py-1">
                     {selectedTx.status_display}
                   </Badge>
                   <Badge variant="outline" className="border-white/10 text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                     {selectedTx.type_display}
                   </Badge>
                </div>
              </DialogHeader>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                   <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Protocol Narration</p>
                      <p className="text-sm font-medium">{selectedTx.description}</p>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-1">
                         <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Propagation Node</p>
                         <p className="text-xs font-bold text-white flex items-center gap-2"><Clock className="w-3 h-3 text-primary" /> {new Date(selectedTx.created_at).toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-1">
                         <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Settlement Rails</p>
                         <p className="text-xs font-bold text-white flex items-center gap-2"><Zap className="w-3 h-3 text-secondary" /> Lightning L2</p>
                      </div>
                   </div>

                   {selectedTx.lnd_payment_hash && (
                      <div className="space-y-2">
                        <Label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">L2 Signal Hash (SHA-256)</Label>
                        <div className="flex items-center gap-3 p-4 bg-black/60 border border-white/5 rounded-2xl overflow-hidden group/hash">
                           <p className="text-[10px] font-mono text-muted-foreground truncate flex-1 leading-none">{selectedTx.lnd_payment_hash}</p>
                           <button onClick={() => copyToClipboard(selectedTx.lnd_payment_hash, "Payment Hash")} className="text-primary hover:text-white transition-colors opacity-0 group-hover/hash:opacity-100">
                             <Copy className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                   )}

                   {selectedTx.linked_object_id && (
                     <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Info className="w-4 h-4 text-primary" />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Linked Objective</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="h-7 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/10">
                           <a href={`/${selectedTx.linked_object_type === 'task' ? 'market' : 'my-projects'}/${selectedTx.linked_object_id}`}>
                             Audit Trace <ExternalLink className="w-3 h-3 ml-2" />
                           </a>
                        </Button>
                     </div>
                   )}
                </div>

                <div className="pt-4 border-t border-white/5">
                   <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 font-bold uppercase tracking-widest text-[10px]" onClick={() => setSelectedTx(null)}>
                      Close Signal Trace
                   </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function HealthItem({ label, status, icon: Icon, color }: any) {
  const colors: any = {
    emerald: 'text-emerald-400 bg-emerald-400/10',
    primary: 'text-primary bg-primary/10',
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn("p-1.5 rounded-lg", colors[color])}><Icon className="w-3.5 h-3.5" /></div>
        <span className="text-xs font-medium text-white/80">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{status}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>
    </div>
  );
}
