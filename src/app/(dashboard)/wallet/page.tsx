"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
  AlertCircle,
  Loader2,
  X,
  Clock
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

  // Polling logic
  useEffect(() => {
    if (isPolling && paymentHash) {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const res = await WalletService.pollDepositStatus(paymentHash);
          if (res.data) {
            const tx = res.data.transactions?.find(t => t.lnd_payment_hash === paymentHash);
            if (tx?.status === 'confirmed') {
              clearInterval(pollingIntervalRef.current!);
              setIsPolling(false);
              setWallet(res.data);
              setInvoice(null);
              setPaymentHash(null);
              setIsDepositOpen(false);
              toast({ title: "Settlement Confirmed", description: "SATs have been added to your liquid balance." });
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
        const newTx = walletData.transactions?.[0];
        if (newTx && newTx.lnd_invoice) {
          setInvoice(newTx.lnd_invoice);
          setPaymentHash(newTx.lnd_payment_hash);
          setIsPolling(true);
        }
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Gateway Error", description: "Could not initialize deposit signal." });
    } finally {
      setIsGeneratingInvoice(false);
    }
  }

  async function handleDecodeInvoice() {
    if (!withdrawInvoice.startsWith('lnbc')) {
      toast({ variant: "destructive", title: "Invalid Invoice", description: "Please provide a valid Lightning Network invoice." });
      return;
    }
    setIsDecoding(true);
    await new Promise(r => setTimeout(r, 1200));
    setDecodedData({
      amount: 12500,
      description: "External Professional Settlement"
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
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Settlement Error", description: "Network connection lost." });
    } finally {
      setIsProcessingWithdraw(false);
    }
  }

  if (isLoading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold">Financials</h1>
          <p className="text-muted-foreground">Manage your platform revenue and deposit SATs for professional hires.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl bg-card border-white/5 gap-2 px-6 h-12 font-bold"
            onClick={() => setIsWithdrawOpen(true)}
          >
            <ArrowUpRight className="w-4 h-4" /> Withdraw
          </Button>
          <Button 
            className="rounded-xl bg-primary hover:brightness-110 gap-2 px-6 h-12 font-bold neon-glow-primary"
            onClick={() => setIsDepositOpen(true)}
          >
            <ArrowDownLeft className="w-4 h-4" /> Deposit
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
              icon={History} 
              subValue="Total revenue finalized on-chain"
              color="emerald"
            />
          </div>

          <Card className="glass-card border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-lg">Recent Ledger</CardTitle>
            </CardHeader>
            <CardContent>
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
                  <div className="text-center py-20 text-muted-foreground font-bold">No ledger activity propagated.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Network Channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/40 transition-all text-left flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                  <Zap className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Lightning Network</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Instant Settlement</p>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDepositOpen} onOpenChange={(open) => {
        setIsDepositOpen(open);
        if (!open) {
          setInvoice(null);
          setPaymentHash(null);
          setIsPolling(false);
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        }
      }}>
        <DialogContent className="glass-card border-white/10 sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" /> Deposit SATs
            </DialogTitle>
          </DialogHeader>

          {!invoice ? (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount (SAT)</Label>
                <Input 
                  type="number" 
                  value={depositAmount} 
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="h-14 bg-white/5 border-white/5 text-xl font-bold"
                />
              </div>
              <Button 
                className="w-full h-14 rounded-xl bg-secondary font-bold text-lg neon-glow-secondary"
                onClick={handleGenerateInvoice}
                disabled={isGeneratingInvoice}
              >
                {isGeneratingInvoice ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Generating...
                  </>
                ) : 'Generate Protocol Invoice'}
              </Button>
            </div>
          ) : (
            <div className="space-y-8 py-6 text-center animate-in zoom-in-95 duration-300">
              <div className="mx-auto bg-white p-4 rounded-3xl w-fit shadow-2xl shadow-secondary/20 border-4 border-secondary/20 relative">
                <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <QrCode className="w-40 h-40 text-black opacity-90" />
                  {isPolling && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-4 border-secondary border-t-transparent animate-spin mb-3"></div>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Listening...</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-black/40 p-4 border border-white/5 rounded-2xl flex items-center gap-2 overflow-hidden">
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
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Expires in 60 Minutes</span>
                </div>
              </div>
              <Button variant="ghost" className="w-full font-bold text-muted-foreground" onClick={() => {
                setInvoice(null);
                setPaymentHash(null);
                setIsPolling(false);
                if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
              }}>
                Abort Mission
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
