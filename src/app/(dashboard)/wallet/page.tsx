"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { WalletService } from '@/services/wallet-service';
import { Wallet as WalletType } from '@/lib/types';
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
  CreditCard
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
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  
  const [depositAmount, setDepositAmount] = useState('10000');
  const [invoice, setInvoice] = useState<string | null>(null);
  const [paymentHash, setPaymentHash] = useState<string | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const [withdrawInvoice, setWithdrawInvoice] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedData, setDecodedData] = useState<{ amount: number; description: string } | null>(null);
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchWallet() {
      try {
        const res = await WalletService.getWallet();
        if (res.data) setWallet(res.data);
      } catch (err) {
        console.error("Wallet fetch error", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWallet();

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  // Polling logic for pending deposits
  useEffect(() => {
    if (isPolling && paymentHash) {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const res = await WalletService.pollDepositStatus(paymentHash);
          if (res.data) {
            // Find the specific transaction by hash to check if confirmed
            const tx = res.data.transactions?.find(t => t.lnd_payment_hash === paymentHash);
            if (tx?.status === 'confirmed') {
              clearInterval(pollingIntervalRef.current!);
              setIsPolling(false);
              setWallet(res.data);
              setInvoice(null);
              setPaymentHash(null);
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
  }, [isPolling, paymentHash]);

  async function handleGenerateInvoice() {
    setIsGeneratingInvoice(true);
    try {
      const res = await WalletService.generateDepositInvoice(parseInt(depositAmount), "Professional Node Deposit", 3600);
      if (res.data) {
        const walletData = res.data as WalletType;
        // In the Django backend, generating a deposit returns the wallet with the new pending tx
        const newTx = walletData.transactions?.find(t => t.status === 'pending' && t.type === 'deposit');
        if (newTx && newTx.lnd_invoice) {
          setInvoice(newTx.lnd_invoice);
          setPaymentHash(newTx.lnd_payment_hash);
          setIsPolling(true);
          toast({ title: "Invoice Propagated", description: "Waiting for payment signal on Bitcoin L2." });
        }
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
    // Simulate decoding logic until real decode endpoint is ready
    await new Promise(r => setTimeout(r, 1200));
    setDecodedData({
      amount: 12500,
      description: "External Professional Payout"
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
        const wRes = await WalletService.getWallet();
        if (wRes.data) setWallet(wRes.data);
      } else {
        toast({ variant: "destructive", title: "Settlement Rejected", description: res.error || "Insufficient node liquidity." });
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
        <div>
          <h1 className="text-4xl font-headline font-bold">Financial Control</h1>
          <p className="text-muted-foreground">Manage your decentralized liquidity, technical yields, and L2 settlements.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-2xl bg-card border-white/5 gap-2 px-8 h-14 font-bold hover:bg-white/5"
            onClick={() => setIsWithdrawOpen(true)}
          >
            <ArrowUpRight className="w-4 h-4 text-primary" /> Payout Yield
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
              label="Platform Yield" 
              value={`${(wallet?.total_rewarded || 0).toLocaleString()} SAT`} 
              icon={TrendingUp} 
              subValue="Total lifetime revenue finalized"
              color="emerald"
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
                {Array.isArray(wallet?.transactions) && wallet.transactions.length > 0 ? wallet.transactions.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all group">
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
                             tx.status === 'confirmed' ? "text-emerald-400" : "text-amber-500"
                           )}>
                             {tx.status}
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
                )) : (
                  <div className="text-center py-24 text-muted-foreground font-bold">
                    <History className="w-12 h-12 text-white/5 mx-auto mb-4" />
                    No ledger activity propagated.
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
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Instant Multi-sig Settlement</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
              </div>

              <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/10 space-y-3">
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> Security Protocol
                </h5>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  All withdrawals require technical validation. High-value payouts may enter a 24-hour verification queue for node integrity.
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
                Elite Nodes receive a <span className="text-primary font-bold">12% boost</span> on micro-mission yields. Upgrade your protocol standing today.
              </p>
            </div>
            <Button variant="outline" className="w-full rounded-xl border-white/10 font-bold relative z-10 h-12 text-xs uppercase tracking-widest">
              View Membership Tiers
            </Button>
          </div>
        </div>
      </div>

      {/* Deposit Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={(open) => {
        setIsDepositOpen(open);
        if (!open) {
          setInvoice(null);
          setPaymentHash(null);
          setIsPolling(false);
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        }
      }}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[450px] rounded-[2rem]">
          <DialogHeader className="p-2">
            <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Zap className="w-6 h-6" />
              </div>
              Initialize Deposit
            </DialogTitle>
            <DialogDescription className="text-sm">
              Generate a secure Lightning Network invoice to fund your node identity.
            </DialogDescription>
          </DialogHeader>

          {!invoice ? (
            <div className="space-y-6 py-6">
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
                    Propagating Node...
                  </div>
                ) : 'Propagate L2 Invoice'}
              </Button>
            </div>
          ) : (
            <div className="space-y-8 py-6 text-center animate-in zoom-in-95 duration-300">
              <div className="mx-auto bg-white p-5 rounded-[2.5rem] w-fit shadow-2xl shadow-secondary/20 border-8 border-secondary/10 relative">
                <div className="w-48 h-48 bg-gray-50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <QrCode className="w-40 h-40 text-black opacity-90" />
                  {isPolling && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-full border-4 border-secondary border-t-transparent animate-spin mb-3"></div>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] animate-pulse">Monitoring Signal</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4 px-2">
                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl p-5 overflow-hidden group">
                  <p className="text-[10px] font-mono text-muted-foreground truncate flex-1 text-left leading-none">{invoice}</p>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-10 w-10 hover:bg-white/10 shrink-0 rounded-xl"
                    onClick={() => {
                       navigator.clipboard.writeText(invoice!);
                       setHasCopied(true);
                       setTimeout(() => setHasCopied(false), 2000);
                       toast({ title: "Signal Copied" });
                    }}
                  >
                    {hasCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-[0.2em]">Expires in 60 Minutes</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed px-4">
                  Settlement will finalize automatically once the protocol detects the payment signal on the network.
                </p>
              </div>
              <Button variant="ghost" className="w-full font-bold text-muted-foreground hover:text-white" onClick={() => {
                setInvoice(null);
                setPaymentHash(null);
                setIsPolling(false);
                if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
              }}>
                Abort & Abort Signal
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[450px] rounded-[2rem]">
          <DialogHeader className="p-2">
            <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              Yield Withdrawal
            </DialogTitle>
            <DialogDescription className="text-sm">
              Payout your platform technical yields to an external L2 node.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-3">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">LND Invoice (BOLT11)</Label>
              <div className="relative">
                <Input 
                  placeholder="lnbc1..." 
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
                  Finalizing Settlement...
                </div>
              ) : 'Confirm Protocol Withdrawal'}
            </Button>
            
            <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest opacity-50">
              Instant Settlement via GigaLight L2 Protocol
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
