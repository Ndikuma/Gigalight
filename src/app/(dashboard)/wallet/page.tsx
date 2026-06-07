
"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { WalletService, WithdrawDecodeResponse, WithdrawFeesResponse } from '@/services/wallet-service';
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
  Database, 
  Bitcoin, 
  CheckCircle2, 
  ShieldAlert, 
  Send 
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { DepositSession } from '@/components/wallet/DepositSession';

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  
  const [depositMethod, setDepositMethod] = useState<'lightning' | 'onchain'>('lightning');
  const [depositAmount, setDepositAmount] = useState('5000');
  const [invoiceData, setInvoiceData] = useState<DepositInvoiceResponse | null>(null);
  const [onchainData, setOnchainData] = useState<{ bitcoin_address: string, qr_code?: string } | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [isLoadingOnchain, setIsLoadingOnchain] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const [withdrawTarget, setWithdrawTarget] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodeData, setDecodeData] = useState<WithdrawDecodeResponse | null>(null);
  const [isCalculatingFees, setIsCalculatingFees] = useState(false);
  const [feeData, setFeeData] = useState<WithdrawFeesResponse | null>(null);
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false);
  
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

  const cleanupWithdraw = () => {
    setWithdrawTarget('');
    setWithdrawAmount('');
    setDecodeData(null);
    setFeeData(null);
    setIsWithdrawSuccess(false);
    setIsWithdrawOpen(false);
    fetchWalletData(true);
  };

  const handleTargetChange = async (val: string) => {
    setWithdrawTarget(val);
    if (!val) {
      setDecodeData(null);
      setFeeData(null);
      return;
    }
    setIsDecoding(true);
    try {
      const res = await WalletService.withdrawDecode(val);
      if (res.data) setDecodeData(res.data);
    } finally {
      setIsDecoding(false);
    }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 px-4 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard label="Liquid Balance" value={`${(wallet?.available_balance || 0).toLocaleString()} SAT`} icon={WalletIcon} subValue="Settled and available for release" color="primary" />
            <StatCard label="Pending Verification" value={`${(wallet?.pending_balance || 0).toLocaleString()} SAT`} icon={Clock} subValue="Incoming L2 signals" color="secondary" />
          </div>

          <Card className="glass-card border-none rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="font-headline text-2xl">Protocol Ledger</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {Array.isArray(wallet?.transactions) && wallet.transactions.length > 0 ? (
                  wallet.transactions.map((tx: WalletTransaction, i: number) => (
                    <div key={tx.id || i} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all">
                      <div className="flex items-center gap-5">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", tx.amount > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20")}>
                          {tx.amount > 0 ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{tx.description}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{new Date(tx.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn("font-headline font-bold text-xl", tx.amount > 0 ? "text-emerald-400" : "text-foreground")}>{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} SAT</p>
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

        <div className="space-y-6 px-4 sm:px-0">
          <Card className="glass-card border-none bg-gradient-to-br from-secondary/10 border-secondary/20 rounded-[2rem]">
            <CardHeader className="p-8"><CardTitle className="font-headline text-xl flex items-center gap-3"><Zap className="w-5 h-5 text-secondary" /> Network Channels</CardTitle></CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group transition-all hover:bg-white/10 relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/20"><Zap className="w-6 h-6" /></div>
                <div className="flex-1"><p className="text-sm font-bold text-white">Lightning Network</p><p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">L2 Rails</p></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </CardContent>
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
                    <Input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value.replace(/[^0-9]/g, ''))} className="h-16 bg-white/5 border-white/10 rounded-2xl text-2xl font-headline font-bold pl-6 focus:ring-secondary/40" />
                  </div>
                  <Button className="w-full h-16 rounded-2xl bg-secondary hover:brightness-110 font-bold text-lg neon-glow-secondary" onClick={handleGenerateInvoice} disabled={isGeneratingInvoice}>
                    {isGeneratingInvoice ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate L2 Invoice'}
                  </Button>
                </TabsContent>
                <TabsContent value="onchain" className="py-10 text-center space-y-4">
                   <Database className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                   <p className="text-sm text-muted-foreground">On-chain funding initializing...</p>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
