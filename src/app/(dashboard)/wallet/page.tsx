
"use client"

import React, { useState, useEffect } from 'react';
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
  X
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
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const [withdrawInvoice, setWithdrawInvoice] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedData, setDecodedData] = useState<{ amount: number; description: string } | null>(null);
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);

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
  }, []);

  async function handleGenerateInvoice() {
    setIsGeneratingInvoice(true);
    try {
      const res = await WalletService.generateDepositInvoice(parseInt(depositAmount));
      if (res.data) {
        setInvoice((res.data as any).lnd_invoice || `lnbc${depositAmount}demo...`);
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

      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
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
                {isGeneratingInvoice ? <Loader2 className="animate-spin" /> : 'Generate Invoice'}
              </Button>
            </div>
          ) : (
            <div className="space-y-8 py-6 text-center">
              <QrCode className="w-48 h-48 mx-auto" />
              <div className="bg-black/40 p-4 rounded-2xl flex items-center gap-2">
                <p className="text-[10px] truncate flex-1">{invoice}</p>
                <Button size="icon" variant="ghost" onClick={() => navigator.clipboard.writeText(invoice!)}><Copy className="w-4 h-4" /></Button>
              </div>
              <Button className="w-full" onClick={() => setIsDepositOpen(false)}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
