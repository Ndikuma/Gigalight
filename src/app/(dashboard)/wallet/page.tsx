
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { WalletService } from '@/services/wallet-service';
import { Wallet as WalletType, WalletTransaction, DepositInvoiceResponse } from '@/lib/types';
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
  Activity
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
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  
  const [depositAmount, setDepositAmount] = useState('5000');
  const [invoiceData, setInvoiceData] = useState<DepositInvoiceResponse | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const [withdrawInvoice, setWithdrawInvoice] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedData, setDecodedData] = useState<{ amount: number; description: string } | null>(null);
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
          if (res.data) {
            const tx = res.data.transactions?.find(t => t.lnd_payment_hash === invoiceData.payment_hash);
            if (tx?.status === 'confirmed') {
              cleanupDeposit();
              setWallet(res.data);
              setIsDepositOpen(false);
              toast({ 
                title: "Settlement Confirmed", 
                description: `${tx.amount.toLocaleString()} SAT added to your liquid balance.` 
              });
            }
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
    if (timeLeft !== null && timeLeft > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0) {
      cleanupDeposit();
      toast({ variant: "destructive", title: "Invoice Expired", description: "The L2 settlement path has timed out." });
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [timeLeft]);

  const cleanupDeposit = () => {
    setInvoiceData(null);
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

        toast({ title: "Invoice Propagated", description: "Waiting for payment signal on Bitcoin L2." });
      } else {
        toast({ variant: "destructive", title: "Gateway Error", description: res.error || "Could not generate invoice." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Network Error", description: "The protocol node is unreachable." });
    } finally {
      setIsGeneratingInvoice(false);
    }
  }

  async function handleDecodeInvoice() {
    if (!withdrawInvoice.startsWith('lnbc')) {
      toast({ variant: "destructive", title: "Invalid Invoice", description: "Please provide a valid Lightning BOLT11 invoice." });
      return;
    }
    setIsDecoding(true);
    await new Promise(r => setTimeout(r, 1000));
    setDecodedData({
      amount: 5000,
      description: "Yield Withdrawal"
    });
    setIsDecoding(false);
  }

  async function handleConfirmWithdraw() {
    setIsProcessingWithdraw(true);
    try {
      const res = await WalletService.initiateWithdrawal(withdrawInvoice);
      if (res.data) {
        toast({ title: "Withdrawal Propagated", description: "SATs are settling across the network." });
        setIsWithdrawOpen(false);
        setWithdrawInvoice('');
        setDecodedData(null);
        fetchWalletData(true);
      } else {
        toast({ variant: "destructive", title: "Settlement Rejected", description: res.error || "Check node liquidity." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Settlement Error", description: "L2 settlement path not found." });
    } finally {
      setIsProcessingWithdraw(false);
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
              <CardDescription>Active L2 settlement paths for your node.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group cursor-default transition-all hover:bg-white/10">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">Lightning Network</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Instant Settlement</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
              </div>

              <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/10 space-y-3">
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> Protocol Node
                </h5>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  GigaLight uses non-custodial L2 rails for all technical yields and strategic escrows.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="glass-card p-8 rounded-[2rem] border-white/5 text-center space-y-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-all"></div>
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto relative z-10">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div className="relative z-10">
              <h4 className="font-headline font-bold text-xl">Yield Optimization</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Elite Nodes receive a <span className="text-primary font-bold">12% boost</span> on mission yields.
              </p>
            </div>
            <Button asChild variant="outline" className="w-full rounded-xl border-white/10 font-bold relative z-10 h-12 text-xs uppercase tracking-widest">
              <a href="/settings?tab=tiers">Membership Tiers</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Deposit Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={(open) => {
        setIsDepositOpen(open);
        if (!open) cleanupDeposit();
      }}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[450px] rounded-[2.5rem] overflow-hidden">
          <DialogHeader className="p-4">
            <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Zap className="w-6 h-6" />
              </div>
              Fund Node
            </DialogTitle>
            <DialogDescription className="text-sm">
              Generate a Lightning invoice to fund your protocol node.
            </DialogDescription>
          </DialogHeader>

          {!invoiceData ? (
            <div className="space-y-6 p-4">
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
                {isGeneratingInvoice ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Propagating...
                  </div>
                ) : 'Generate L2 Invoice'}
              </Button>
            </div>
          ) : (
            <div className="space-y-8 p-4 text-center animate-in zoom-in-95 duration-300">
              <div className="mx-auto bg-white p-5 rounded-[2.5rem] w-fit shadow-2xl shadow-secondary/20 border-8 border-secondary/10 relative overflow-hidden group">
                <div className="w-48 h-48 rounded-2xl flex items-center justify-center relative bg-white">
                  <img src={invoiceData.qr_code} alt="Invoice QR" className="w-full h-full object-contain" />
                </div>
              </div>

              {isPolling && (
                <div className="flex flex-col items-center gap-2 py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
                    <Activity className="w-3 h-3 text-secondary animate-pulse" />
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Awaiting Network Signal</span>
                  </div>
                </div>
              )}

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
                    <p className="text-[11px] font-mono text-white/70 truncate leading-none">
                      {invoiceData.payment_request.substring(0, 12)}...{invoiceData.payment_request.substring(invoiceData.payment_request.length - 12)}
                    </p>
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

              <Button variant="ghost" className="w-full font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-white" onClick={cleanupDeposit}>
                Abort Settlement Path
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[450px] rounded-[2.5rem]">
          <DialogHeader className="p-4">
            <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              Yield Payout
            </DialogTitle>
            <DialogDescription className="text-sm">
              Payout your platform technical yields to an external L2 node.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 p-4">
            <div className="space-y-3">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">LND Invoice (BOLT11)</Label>
              <div className="relative">
                <Input 
                  placeholder="lnbc..." 
                  value={withdrawInvoice}
                  onChange={(e) => setWithdrawInvoice(e.target.value)}
                  className="h-16 bg-white/5 border-white/10 text-xs font-mono pr-28 rounded-2xl focus:ring-primary/40"
                />
                {!decodedData && (
                  <Button 
                    size="sm" 
                    className="absolute right-2 top-2 h-12 rounded-xl font-bold px-4"
                    onClick={handleDecodeInvoice}
                    disabled={isDecoding || !withdrawInvoice}
                  >
                    {isDecoding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'DECODE'}
                  </Button>
                )}
              </div>
            </div>

            {decodedData && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4 animate-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Settlement Amount</span>
                  <div className="text-right">
                    <span className="text-3xl font-headline font-bold text-primary">{decodedData.amount.toLocaleString()}</span>
                    <p className="text-[9px] font-bold text-primary/50 tracking-widest uppercase">SATOSHIS</p>
                  </div>
                </div>
              </div>
            )}

            <Button 
              className="w-full h-16 rounded-2xl bg-primary hover:brightness-110 font-bold text-lg neon-glow-primary shadow-lg shadow-primary/20"
              disabled={!decodedData || isProcessingWithdraw}
              onClick={handleConfirmWithdraw}
            >
              {isProcessingWithdraw ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Finalizing...
                </div>
              ) : 'Confirm Payout'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
