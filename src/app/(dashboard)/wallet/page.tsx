"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { WalletService, WithdrawDecodeResponse, WithdrawFeesResponse } from '@/services/wallet-service';
import { Wallet as WalletType, WalletTransaction, DepositInvoiceResponse, DepositStatusResponse } from '@/lib/types';
import { 
  Wallet as WalletIcon, 
  ArrowDownLeft, 
  ArrowUpRight, 
  History, 
  Zap, 
  Copy, 
  Check, 
  QrCode, 
  Loader2,
  Clock,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  RefreshCcw,
  AlertCircle,
  Activity,
  Layers,
  Network,
  Database,
  Bitcoin,
  CheckCircle2,
  ChevronRight,
  Info
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
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  
  // Deposit States
  const [depositMethod, setDepositMethod] = useState<'lightning' | 'onchain'>('lightning');
  const [depositAmount, setDepositAmount] = useState('5000');
  const [invoiceData, setInvoiceData] = useState<DepositInvoiceResponse | null>(null);
  const [onchainData, setOnchainData] = useState<{ bitcoin_address: string, qr_code: string } | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [isLoadingOnchain, setIsLoadingOnchain] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [isDepositConfirmed, setIsDepositConfirmed] = useState(false);
  const [confirmedTx, setConfirmedTx] = useState<DepositStatusResponse | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Withdrawal Workflow States
  const [withdrawTarget, setWithdrawTarget] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMemo, setWithdrawMemo] = useState('GigaLight Yield Payout');
  
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodeData, setDecodeData] = useState<WithdrawDecodeResponse | null>(null);
  
  const [isCalculatingFees, setIsCalculatingFees] = useState(false);
  const [feeData, setFeeData] = useState<WithdrawFeesResponse | null>(null);
  
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isPolling && invoiceData?.payment_hash) {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const res = await WalletService.pollDepositStatus(invoiceData.payment_hash);
          if (res.data && res.data.status === 'confirmed') {
            setIsPolling(false);
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            
            setConfirmedTx(res.data);
            setIsDepositConfirmed(true);
            
            toast({ 
              title: "Settlement Confirmed", 
              description: `${res.data.amount_sats.toLocaleString()} SAT added to your liquid balance.` 
            });
            
            fetchWalletData(true);
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 3000);
    }

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [isPolling, invoiceData]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !isDepositConfirmed) {
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0 && !isDepositConfirmed) {
      cleanupDeposit();
      toast({ variant: "destructive", title: "Invoice Expired", description: "The L2 settlement path has timed out." });
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [timeLeft, isDepositConfirmed]);

  const cleanupDeposit = () => {
    setInvoiceData(null);
    setOnchainData(null);
    setIsPolling(false);
    setIsDepositConfirmed(false);
    setConfirmedTx(null);
    setTimeLeft(null);
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  const cleanupWithdraw = () => {
    setWithdrawTarget('');
    setWithdrawAmount('');
    setDecodeData(null);
    setFeeData(null);
    setIsDecoding(false);
    setIsCalculatingFees(false);
    setIsProcessingWithdraw(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Withdrawal logic
  async function handleTargetBlur() {
    if (!withdrawTarget) return;
    setIsDecoding(true);
    setFeeData(null);
    setDecodeData(null);
    
    try {
      const res = await WalletService.withdrawDecode(withdrawTarget);
      if (res.data) {
        setDecodeData(res.data);
        if (res.data.amount_sats) {
          setWithdrawAmount(res.data.amount_sats.toString());
          // Auto-calculate fees if amount is known from invoice
          calculateFees(withdrawTarget, res.data.amount_sats);
        }
      } else {
        toast({ variant: "destructive", title: "Decoding Error", description: res.error || "Invalid settlement target." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Network Error", description: "Protocol gateway timeout." });
    } finally {
      setIsDecoding(false);
    }
  }

  async function calculateFees(target: string, amount?: number) {
    setIsCalculatingFees(true);
    try {
      const res = await WalletService.withdrawFees(target, amount);
      if (res.data) {
        setFeeData(res.data);
      }
    } catch (e) {
      console.error("Fee calc error", e);
    } finally {
      setIsCalculatingFees(false);
    }
  }

  async function handleConfirmWithdraw() {
    setIsProcessingWithdraw(true);
    try {
      const res = await WalletService.initiateWithdrawal(
        withdrawTarget, 
        withdrawAmount ? parseInt(withdrawAmount) : undefined,
        withdrawMemo
      );
      if (res.data) {
        toast({ title: "Settlement Propagated", description: "Yields are being released to the specified node." });
        setIsWithdrawOpen(false);
        cleanupWithdraw();
        fetchWalletData(true);
      } else {
        toast({ variant: "destructive", title: "Settlement Rejected", description: res.error || "Verification failed." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Network Error", description: "L2 path propagation failed." });
    } finally {
      setIsProcessingWithdraw(false);
    }
  }

  async function handleGenerateInvoice() {
    setIsGeneratingInvoice(true);
    try {
      const res = await WalletService.generateDepositInvoice(parseInt(depositAmount), "Gigalight deposit", 3600);
      if (res.data) {
        setInvoiceData(res.data);
        setIsPolling(true);
        const expiresAt = new Date(res.data.expires_at).getTime();
        const now = new Date().getTime();
        const initialSeconds = Math.floor((expiresAt - now) / 1000);
        setTimeLeft(initialSeconds > 0 ? initialSeconds : 0);
        toast({ title: "Invoice Propagated", description: "Waiting for L2 signal." });
      } else {
        toast({ variant: "destructive", title: "Gateway Error", description: res.error || "Could not generate invoice." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Network Error", description: "The protocol node is unreachable." });
    } finally {
      setIsGeneratingInvoice(false);
    }
  }

  async function handleGetOnchainAddress() {
    setIsLoadingOnchain(true);
    try {
      const res = await WalletService.getBitcoinAddress();
      if (res.data) {
        setOnchainData(res.data);
        toast({ title: "Address Propagated", description: "Settlement path established via Bitcoin L1." });
      } else {
        toast({ variant: "destructive", title: "Gateway Error", description: res.error || "Could not retrieve address." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Network Error", description: "The L1 bridge node is unreachable." });
    } finally {
      setIsLoadingOnchain(false);
    }
  }

  if (isLoading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold">Financial Control</h1>
          <p className="text-muted-foreground">Manage your decentralized liquidity, technical yields, and L2 settlements.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("rounded-xl border border-white/5", isRefreshing && "animate-spin")}
            onClick={() => fetchWalletData()}
            disabled={isRefreshing}
          >
            <RefreshCcw className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            className="rounded-2xl bg-card border-white/5 gap-2 px-8 h-14 font-bold hover:bg-white/5"
            onClick={() => setIsWithdrawOpen(true)}
          >
            <ArrowUpRight className="w-4 h-4 text-primary" /> Payout
          </Button>
          <Button 
            className="rounded-2xl bg-primary hover:brightness-110 gap-2 px-8 h-14 font-bold neon-glow-primary shadow-lg shadow-primary/20"
            onClick={() => setIsDepositOpen(true)}
          >
            <ArrowDownLeft className="w-4 h-4" /> Fund Node
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard 
              label="Liquid Balance" 
              value={`${(wallet?.available_balance || 0).toLocaleString()} SAT`} 
              icon={WalletIcon} 
              subValue="Settled and available for release"
              color="primary"
            />
            <StatCard 
              label="Pending Verification" 
              value={`${(wallet?.pending_balance || 0).toLocaleString()} SAT`} 
              icon={Clock} 
              subValue="Incoming L2 signals"
              color="secondary"
            />
          </div>

          <Card className="glass-card border-none rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline text-2xl">Protocol Ledger</CardTitle>
                <CardDescription>A real-time record of your node's financial activity.</CardDescription>
              </div>
              <History className="w-6 h-6 text-muted-foreground/20" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {Array.isArray(wallet?.transactions) && wallet.transactions.length > 0 ? (
                  wallet.transactions.map((tx: WalletTransaction, i: number) => (
                    <div key={tx.id || i} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all group">
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors",
                          tx.amount > 0 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-primary/10 text-primary border-primary/20"
                        )}>
                          {tx.amount > 0 ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm group-hover:text-white transition-colors">{tx.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <Badge variant="ghost" className={cn(
                               "text-[9px] uppercase font-bold tracking-widest px-0 h-auto",
                               tx.status === 'confirmed' ? "text-emerald-400" : tx.status === 'pending' ? "text-amber-500" : "text-destructive"
                             )}>
                               {tx.status_display || tx.status}
                             </Badge>
                             <span className="text-white/10">•</span>
                             <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                               {new Date(tx.created_at).toLocaleDateString()}
                             </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "font-headline font-bold text-xl",
                          tx.amount > 0 ? "text-emerald-400" : "text-foreground"
                        )}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                        </p>
                        <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">SATOSHIS</p>
                      </div>
                    </div>
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

        <div className="space-y-6">
          <Card className="glass-card border-none bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20 rounded-[2rem]">
            <CardHeader className="p-8">
              <CardTitle className="font-headline text-xl flex items-center gap-3">
                <Zap className="w-5 h-5 text-secondary" />
                Network Channels
              </CardTitle>
              <CardDescription>Active settlement paths for your node.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group cursor-default transition-all hover:bg-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 blur-2xl -z-10" />
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/20">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">Lightning Network</p>
                    <Badge variant="outline" className="text-[8px] h-4 px-1.5 border-secondary/30 text-secondary uppercase font-bold tracking-tighter">L2</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Instant Settlement</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group cursor-default transition-all hover:bg-white/10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl -z-10" />
                 <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                  <Database className="w-6 h-6" />
                </div>
                <div className="flex-1">
                   <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">Bitcoin On-Chain</p>
                    <Badge variant="outline" className="text-[8px] h-4 px-1.5 border-primary/30 text-primary uppercase font-bold tracking-tighter">L1</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Final Settlement</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                   <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                   <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Linked</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Deposit Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={(open) => {
        setIsDepositOpen(open);
        if (!open) cleanupDeposit();
      }}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[450px] rounded-[2.5rem] overflow-hidden p-0">
          <div className="p-8 space-y-6">
            <DialogHeader className="p-0">
              <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <ArrowDownLeft className="w-6 h-6" />
                </div>
                {isDepositConfirmed ? 'Settlement Finalized' : 'Fund Node'}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {isDepositConfirmed 
                  ? 'Your L2 deposit has been verified and settled.' 
                  : 'Select your preferred settlement path to fund your protocol node.'}
              </DialogDescription>
            </DialogHeader>

            {isDepositConfirmed ? (
              <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
                <div className="mx-auto bg-emerald-500/10 p-10 rounded-[2.5rem] w-fit shadow-2xl shadow-emerald-500/10 border-4 border-emerald-500/20">
                  <CheckCircle2 className="w-24 h-24 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-headline font-bold text-white">+{confirmedTx?.amount_sats.toLocaleString()} SAT</p>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em]">Protocol Yield Settled</p>
                </div>
                <Button className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-bold text-lg" onClick={cleanupDeposit}>
                  Session Finalized
                </Button>
              </div>
            ) : !invoiceData && !onchainData ? (
              <Tabs defaultValue="lightning" onValueChange={(v) => setDepositMethod(v as any)} className="w-full">
                <TabsList className="grid grid-cols-2 bg-white/5 p-1 rounded-xl h-auto mb-6">
                  <TabsTrigger value="lightning" className="rounded-lg py-2.5 font-bold text-xs gap-2 data-[state=active]:bg-secondary data-[state=active]:text-white">
                    <Zap className="w-3.5 h-3.5" /> Lightning
                  </TabsTrigger>
                  <TabsTrigger value="onchain" className="rounded-lg py-2.5 font-bold text-xs gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Bitcoin className="w-3.5 h-3.5" /> On-Chain
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="lightning" className="space-y-6 mt-0 animate-in fade-in duration-300">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Liquidity Amount (SAT)</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={depositAmount} 
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="h-16 bg-white/5 border-white/10 rounded-2xl text-2xl font-headline font-bold pl-6 focus:ring-secondary/40"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">SATOSHIS</div>
                    </div>
                  </div>
                  <Button 
                    className="w-full h-16 rounded-2xl bg-secondary hover:brightness-110 font-bold text-lg neon-glow-secondary shadow-lg shadow-secondary/20"
                    onClick={handleGenerateInvoice}
                    disabled={isGeneratingInvoice}
                  >
                    {isGeneratingInvoice ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate L2 Invoice'}
                  </Button>
                </TabsContent>
                <TabsContent value="onchain" className="space-y-6 mt-0 animate-in fade-in duration-300">
                   <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Database className="w-4 h-4" /></div>
                        <p className="text-xs font-bold text-white">L1 Settlement Node</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Generate a unique Bitcoin address for on-chain funding. Settlements finalized after 3 confirmations.
                      </p>
                   </div>
                   <Button 
                    className="w-full h-16 rounded-2xl bg-primary hover:brightness-110 font-bold text-lg neon-glow-primary shadow-lg shadow-primary/20"
                    onClick={handleGetOnchainAddress}
                    disabled={isLoadingOnchain}
                  >
                    {isLoadingOnchain ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Initialize L1 Path'}
                  </Button>
                </TabsContent>
              </Tabs>
            ) : invoiceData ? (
              <div className="space-y-8 text-center animate-in zoom-in-95 duration-300">
                <div className="mx-auto bg-white p-5 rounded-[2.5rem] w-fit shadow-2xl shadow-secondary/20 border-8 border-secondary/10 relative overflow-hidden bg-white">
                  <img src={invoiceData.qr_code} alt="Invoice QR" className="w-48 h-48 object-contain" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
                    <Activity className="w-3 h-3 text-secondary animate-pulse" />
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Awaiting L2 Signal</span>
                  </div>
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
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Signal Trace</p>
                      <p className="text-[11px] font-mono text-white/70 truncate">{invoiceData.payment_request}</p>
                    </div>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-10 w-10 shrink-0 rounded-xl neon-glow-secondary"
                      onClick={() => {
                         navigator.clipboard.writeText(invoiceData.payment_request);
                         setHasCopied(true);
                         setTimeout(() => setHasCopied(false), 2000);
                         toast({ title: "Signal Copied" });
                      }}
                    >
                      {hasCopied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" className="w-full font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-white" onClick={cleanupDeposit}>Abort Path</Button>
              </div>
            ) : onchainData ? (
               <div className="space-y-8 text-center animate-in zoom-in-95 duration-300">
                <div className="mx-auto bg-white p-5 rounded-[2.5rem] w-fit shadow-2xl shadow-primary/20 border-8 border-primary/10 relative overflow-hidden bg-white">
                  <img src={onchainData.qr_code} alt="Onchain Address QR" className="w-48 h-48 object-contain" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <Database className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Live L1 Settlement Node</span>
                  </div>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-2xl p-4 overflow-hidden group/addr">
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex-1 text-left overflow-hidden">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Bitcoin Address</p>
                      <p className="text-[11px] font-mono text-white/70 truncate">{onchainData.bitcoin_address}</p>
                    </div>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-10 w-10 shrink-0 rounded-xl border-primary/20 text-primary"
                      onClick={() => {
                         navigator.clipboard.writeText(onchainData.bitcoin_address);
                         setHasCopied(true);
                         setTimeout(() => setHasCopied(false), 2000);
                         toast({ title: "Address Copied" });
                      }}
                    >
                      {hasCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" className="w-full font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-white" onClick={cleanupDeposit}>Return</Button>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdrawal Dialog - Re-engineered for new workflow */}
      <Dialog open={isWithdrawOpen} onOpenChange={(open) => {
        setIsWithdrawOpen(open);
        if (!open) cleanupWithdraw();
      }}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[480px] rounded-[2.5rem] overflow-hidden p-0">
          <div className="p-8 space-y-6">
            <DialogHeader className="p-0">
              <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                Yield Payout
              </DialogTitle>
              <DialogDescription className="text-sm">
                Settlement propagation for external L2 nodes or L1 addresses.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Settlement Target</Label>
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      {isDecoding ? <Loader2 className="w-4 h-4 text-primary animate-spin" /> : <Network className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />}
                   </div>
                   <Input 
                    placeholder="lnbc..., user@address.com, or bc1..." 
                    value={withdrawTarget}
                    onChange={(e) => setWithdrawTarget(e.target.value)}
                    onBlur={handleTargetBlur}
                    className="h-14 bg-white/5 border-white/10 text-xs font-mono pl-12 rounded-2xl focus:ring-primary/40"
                  />
                  {decodeData && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[8px] font-bold uppercase tracking-tighter">
                          {decodeData.target_type.replace('_', ' ')}
                       </Badge>
                    </div>
                  )}
                </div>
              </div>

              {decodeData && (
                <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                  {decodeData.requires_amount && (
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Liquidity to Release (SAT)</Label>
                      <div className="relative">
                        <Input 
                          type="number"
                          placeholder="Amount in SAT"
                          value={withdrawAmount}
                          onChange={(e) => {
                            setWithdrawAmount(e.target.value);
                            if (e.target.value) calculateFees(withdrawTarget, parseInt(e.target.value));
                          }}
                          className="h-16 bg-white/5 border-white/10 text-2xl font-headline font-bold rounded-2xl focus:ring-primary/40"
                        />
                         <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">SATOSHIS</div>
                      </div>
                    </div>
                  )}

                  {feeData && (
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4 shadow-inner">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <span>Propagation Breakdown</span>
                        <span className="text-primary flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> VERIFIED</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-muted-foreground">Recipient Release</span>
                          <span className="text-white font-bold">{feeData.amount_sats.toLocaleString()} SAT</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-muted-foreground">Protocol/Network Fee</span>
                          <span className="text-white font-bold">{feeData.estimated_fee_sats.toLocaleString()} SAT</span>
                        </div>
                        <div className="h-px bg-white/5" />
                        <div className="flex justify-between items-end">
                           <span className="text-xs font-bold text-primary uppercase tracking-widest">Total Wallet Debit</span>
                           <div className="text-right">
                              <span className="text-2xl font-headline font-bold text-white">{feeData.wallet_debit_sats.toLocaleString()}</span>
                              <span className="text-[10px] font-bold text-white/40 ml-1.5">SAT</span>
                           </div>
                        </div>
                      </div>
                      {!feeData.can_withdraw && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-[10px] font-bold uppercase border border-destructive/20 mt-2">
                           <AlertCircle className="w-3.5 h-3.5" /> Insufficient Liquid Balance
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Protocol Memo (Optional)</Label>
                    <Input 
                      value={withdrawMemo}
                      onChange={(e) => setWithdrawMemo(e.target.value)}
                      className="h-12 bg-white/5 border-white/10 rounded-xl text-sm"
                    />
                  </div>

                  <Button 
                    className="w-full h-16 rounded-2xl bg-primary hover:brightness-110 font-bold text-lg neon-glow-primary shadow-lg shadow-primary/20"
                    disabled={!feeData?.can_withdraw || isProcessingWithdraw || isCalculatingFees}
                    onClick={handleConfirmWithdraw}
                  >
                    {isProcessingWithdraw ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Finalizing Release...
                      </div>
                    ) : 'Propagate Settlement'}
                  </Button>
                </div>
              )}

              {!decodeData && !isDecoding && (
                <div className="p-6 bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center gap-3 text-center">
                  <Info className="w-8 h-8 text-muted-foreground/20" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                    Input a valid settlement target to begin the propagation protocol.
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
