
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { mockWallet } from '@/lib/mock-data';
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
  Scan
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function WalletPage() {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  
  // Deposit State
  const [depositAmount, setDepositAmount] = useState('10000');
  const [invoice, setInvoice] = useState<string | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  // Withdraw State
  const [withdrawInvoice, setWithdrawInvoice] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedData, setDecodedData] = useState<{ amount: number; description: string } | null>(null);
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);

  // Mock Invoice Generation
  async function handleGenerateInvoice() {
    setIsGeneratingInvoice(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1500));
    setInvoice(`lnbc${depositAmount}n1p3uxls...v${Math.random().toString(36).substring(7)}`);
    setIsGeneratingInvoice(false);
  }

  // Mock Invoice Decoding
  async function handleDecodeInvoice() {
    if (!withdrawInvoice.startsWith('lnbc')) {
      toast({ variant: "destructive", title: "Invalid Invoice", description: "Please provide a valid Lightning Network (BOLT11) invoice." });
      return;
    }
    setIsDecoding(true);
    await new Promise(r => setTimeout(r, 1200));
    // Simulated decode logic
    setDecodedData({
      amount: Math.floor(Math.random() * 50000) + 1000,
      description: "External Settlement"
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
      toast({ title: "Withdrawal Initiated", description: "SATs are propagating across the Lightning Network." });
    }, 2000);
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-lg">Recent Ledger</CardTitle>
              <Button variant="ghost" className="text-xs text-primary font-bold">VIEW ALL ACTIVITY</Button>
            </CardHeader>
            <CardContent>
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
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
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
                      <Badge variant="outline" className={cn(
                        "text-[9px] px-2 py-0 border-none capitalize font-bold",
                        tx.status === 'finalized' ? "text-muted-foreground" : "text-yellow-400 bg-yellow-400/5"
                      )}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
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
              <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/40 transition-all text-left flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                  <ArrowDownLeft className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-bold">On-Chain Deposit</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">3 Confirmations</p>
                </div>
              </button>
            </CardContent>
          </Card>

          <div className="glass-card p-8 rounded-3xl border-primary/20 text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl rounded-full"></div>
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative z-10">
              <History className="w-7 h-7" />
            </div>
            <div className="relative z-10">
              <h4 className="font-headline font-bold text-lg">Settlement History</h4>
              <p className="text-xs text-muted-foreground mt-2">Export your professional revenue ledger for tax or accounting purposes.</p>
            </div>
            <Button variant="outline" className="w-full rounded-xl border-white/10 hover:bg-white/5 font-bold h-11 text-xs uppercase tracking-widest">
              Export CSV
            </Button>
          </div>
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
                  {/* Mock QR Code */}
                  <QrCode className="w-40 h-40 text-black opacity-90" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary" className="gap-2 rounded-xl">
                      <Scan className="w-4 h-4" /> Scan App
                    </Button>
                  </div>
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
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <AlertCircle className="w-3 h-3 text-secondary" />
                  Expires in 14:59
                </div>
              </div>

              <Button variant="ghost" className="w-full font-bold text-muted-foreground" onClick={() => setInvoice(null)}>
                Back to Settings
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
                    onClick={handleDecodeInvoice}
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
                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Description</span>
                  <span className="text-xs font-bold">{decodedData.description}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">L2 Network Fee</span>
                  <span className="text-xs font-bold text-emerald-400">~ 1 SAT</span>
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
