
"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Info,
  Link as LinkIcon,
  ShieldAlert
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
  const [onchainData, setOnchainData] = useState<{ bitcoin_address: string, qr_code?: string } | null>(null);
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
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
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
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const calculateFees = useCallback(async (target: string, amount?: number) => {
    if (!target) return;
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
  }, []);

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

  const handleAmountChange = (val: string) => {
    setWithdrawAmount(val);
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    
    if (val && !isNaN(parseInt(val)) && withdrawTarget) {
      debounceTimeoutRef.current = setTimeout(() => {
        calculateFees(withdrawTarget, parseInt(val));
      }, 500);
    } else {
      setFeeData(null);
    }
  };

  async function handleConfirmWithdraw() {
    if (!withdrawAmount || isNaN(parseInt(withdrawAmount))) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Provide a valid Satoshi quantity." });
      return;
    }

    setIsProcessingWithdraw(true);
    try {
      const res = await WalletService.initiateWithdrawal(
        withdrawTarget, 
        parseInt(withdrawAmount),
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
    const amountNum = parseInt(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Deposit must be a positive integer." });
      return;
    }

    setIsGeneratingInvoice(true);
    try {
      const res = await WalletService.generateDepositInvoice(amountNum, "Gigalight deposit", 3600);
      if (res.data) {
        setInvoiceData(res.data);
        setIsPolling(true);
        const expiresAt = new Date(res.data.expires_at).getTime();
        now = new Date().getTime();
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
                             <Badge variant="outline" className={cn(
                               "text-[9px] uppercase font-bold tracking-widest px-1.5 h-4 border-none",
                               tx.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-400" : tx.status === 'pending' ? "bg-amber-500/10 text-amber-500" : "bg-destructive/10 text-destructive"
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
                        step="1"
                        min="1"
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
                    className="w-full h-16 rounded-2xl bg-primary hover:brightness-110 font-bold text-lg neon-glow-primary shadow-lg shadow-secondary/20"
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
                  <img 
                    src={invoiceData.qr_code || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(invoiceData.payment_request)}`} 
                    alt="Invoice QR" 
                    className="w-48 h-48 object-contain" 
                  />
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
                      <p className="text-[11px] font-mono text-white/70 truncate leading-none">{invoiceData.payment_request}</p>
                    </div>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-10 w-10 shrink-0 rounded-xl neon-glow-secondary hover:scale-105 transition-transform"
                      onClick={() => {
                         navigator.clipboard.writeText(invoiceData.payment_request);
                         setHasCopied(true);
                         setTimeout(() => setHasCopied(false), 2000);
                         toast({ title: "Signal Copied to Node" });
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
                  <img 
                    src={onchainData.qr_code || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(onchainData.bitcoin_address)}`} 
                    alt="Onchain Address QR" 
                    className="w-48 h-48 object-contain" 
                  />
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
                      className="h-10 w-10 shrink-0 rounded-xl border-primary/20 text-primary hover:scale-105 transition-transform"
                      onClick={() => {
                         navigator.clipboard.writeText(onchainData.bitcoin_address);
                         setHasCopied(true);
                         setTimeout(() => setHasCopied(false), 2000);
                         toast({ title: "L1 Address Copied" });
                      }}
                    >
                      {hasCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" className="w-full font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-white" onClick={cleanupDeposit}>Return to Interface</Button>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdrawal Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={(open) => {
        setIsWithdrawOpen(open);
        if (!open) cleanupWithdraw();
      }}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[500px] rounded-[2.5rem] overflow-hidden p-0 shadow-2xl">
          <div className="p-8 space-y-6">
            <DialogHeader className="p-0">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                    <DialogTitle className="text-2xl font-headline font-bold">Yield Payout</DialogTitle>
                 </div>
                 {decodeData && (
                    <Badge className={cn(
                      "uppercase text-[8px] font-bold tracking-[0.2em] px-3 py-1 border-none shadow-sm",
                      decodeData.rail === 'lightning' ? "bg-secondary text-white" : "bg-primary text-white"
                    )}>
                      {decodeData.rail === 'lightning' ? <Zap className="w-2.5 h-2.5 mr-1.5" /> : <Database className="w-2.5 h-2.5 mr-1.5" />}
                      {decodeData.rail} Protocol
                    </Badge>
                 )}
              </div>
              <DialogDescription className="text-sm">
                Propagate decentralized yields to external technical nodes or on-chain addresses.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* STEP 1: DECODE TARGET */}
              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Settlement Target</Label>
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      {isDecoding ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      ) : (
                        <LinkIcon className={cn(
                          "w-4 h-4 transition-colors",
                          decodeData ? "text-primary" : "text-muted-foreground group-focus-within:text-primary"
                        )} />
                      )}
                   </div>
                   <Input 
                    placeholder="lnbc..., user@addr, lnurl..., or bc1..." 
                    value={withdrawTarget}
                    onChange={(e) => setWithdrawTarget(e.target.value)}
                    onBlur={handleTargetBlur}
                    className="h-14 bg-white/5 border-white/10 text-xs font-mono pl-12 rounded-2xl focus:ring-primary/40 focus:bg-white/10 transition-all"
                  />
                  {decodeData && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                       <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                          <Check className="w-3 h-3" />
                       </div>
                    </div>
                  )}
                </div>
                {decodeData && (
                  <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] ml-1 animate-in slide-in-from-left-2">
                    IDENTIFIED: {decodeData.target_type.replace('_', ' ')}
                  </p>
                )}
              </div>

              {/* STEP 2: QUANTITY SELECTION */}
              {decodeData && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                  {decodeData.requires_amount && (
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Liquidity to Release (SAT)</Label>
                      <div className="relative group">
                        <Input 
                          type="number"
                          step="1"
                          min="1"
                          placeholder="Amount in Satoshis"
                          value={withdrawAmount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                          className="h-20 bg-white/5 border-white/10 text-4xl font-headline font-bold rounded-2xl focus:ring-primary/40 text-center focus:bg-white/10 transition-all"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest pointer-events-none opacity-50">SATOSHIS</div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: AUDIT & BREAKDOWN */}
                  {feeData ? (
                    <div className="bg-black/40 border border-white/10 rounded-3xl p-6 space-y-4 shadow-inner relative overflow-hidden group/audit">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover/audit:opacity-10 transition-opacity">
                         <ShieldCheck className="w-20 h-20" />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Settlement Audit</span>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[8px] font-bold uppercase tracking-widest h-5">
                          <TrendingUp className="w-2.5 h-2.5 mr-1" /> Estimated
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-muted-foreground">Recipient Yield</span>
                          <span className="text-white font-bold">{feeData.amount_sats.toLocaleString()} SAT</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-muted-foreground">Protocol/Network Fee</span>
                          <span className="text-white font-bold">+{feeData.estimated_fee_sats.toLocaleString()} SAT</span>
                        </div>
                        <div className="h-px bg-white/5 my-2" />
                        <div className="flex justify-between items-end pt-1">
                           <div className="space-y-0.5">
                              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Total Wallet Debit</span>
                              <p className="text-[8px] text-muted-foreground uppercase">SAT Settled on L2/L1</p>
                           </div>
                           <div className="text-right">
                              <span className="text-3xl font-headline font-bold text-white">{feeData.wallet_debit_sats.toLocaleString()}</span>
                              <span className="text-[10px] font-bold text-white/40 ml-2">SAT</span>
                           </div>
                        </div>
                      </div>

                      {!feeData.can_withdraw && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive text-[10px] font-bold uppercase border border-destructive/20 mt-4 animate-pulse">
                           <ShieldAlert className="w-4 h-4" /> 
                           <span>{feeData.message || "Insufficient liquid balance for this propagation"}</span>
                        </div>
                      )}
                    </div>
                  ) : isCalculatingFees ? (
                    <div className="h-40 bg-white/5 border border-white/5 rounded-3xl flex flex-col items-center justify-center gap-3 animate-pulse">
                       <Loader2 className="w-6 h-6 text-primary animate-spin" />
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Auditing Path Fees...</p>
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Protocol Memo (Verification Note)</Label>
                    <Input 
                      value={withdrawMemo}
                      onChange={(e) => setWithdrawMemo(e.target.value)}
                      placeholder="Reference identifier..."
                      className="h-12 bg-white/5 border-white/10 rounded-xl text-sm focus:ring-primary/40"
                    />
                  </div>

                  <Button 
                    className="w-full h-18 rounded-[2rem] bg-primary hover:brightness-110 font-bold text-xl neon-glow-primary shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100"
                    disabled={!feeData?.can_withdraw || isProcessingWithdraw || isCalculatingFees || !withdrawAmount}
                    onClick={handleConfirmWithdraw}
                  >
                    {isProcessingWithdraw ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Propagating Release...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        Propagate Settlement <ArrowUpRight className="w-6 h-6" />
                      </div>
                    )}
                  </Button>
                </div>
              )}

              {/* EMPTY STATE / INITIAL VIEW */}
              {!decodeData && !isDecoding && (
                <div className="py-20 bg-white/5 border border-dashed border-white/10 rounded-[2rem] flex flex-col items-center gap-4 text-center px-10 group/initial">
                  <div className="w-16 h-16 rounded-2xl bg-card border border-white/5 flex items-center justify-center group-hover/initial:border-primary/30 transition-colors shadow-inner">
                    <Info className="w-8 h-8 text-muted-foreground/30 group-hover/initial:text-primary/50 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Awaiting Verification Signal</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed uppercase tracking-widest font-medium">
                      Input a Lightning Invoice, LNURL Pay, or Bitcoin Address to establish a settlement path.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
