
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowDownLeft, 
  Clock, 
  Copy, 
  Check, 
  Loader2, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { WalletService } from '@/services/wallet-service';
import { DepositStatusResponse } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DepositSessionProps {
  paymentData: {
    payment_request: string;
    payment_hash: string;
    amount_sats: number;
    expires_at: string;
    qr_code?: string;
  };
  onSuccess: (data: DepositStatusResponse) => void;
  onCancel: () => void;
}

export function DepositSession({ paymentData, onSuccess, onCancel }: DepositSessionProps) {
  const [isPolling, setIsPolling] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [imgError, setImgError] = useState(false);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      if (!paymentData.expires_at) return;
      const expiresAt = new Date(paymentData.expires_at).getTime();
      const now = new Date().getTime();
      const diff = Math.floor((expiresAt - now) / 1000);
      
      if (isNaN(diff) || diff <= 0) {
        setTimeLeft(0);
        setIsPolling(false);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      } else {
        setTimeLeft(diff);
      }
    };
    
    updateTimer();
    countdownIntervalRef.current = setInterval(updateTimer, 1000);

    pollingIntervalRef.current = setInterval(async () => {
      if (!isPolling) return;
      try {
        const res = await WalletService.pollDepositStatus(paymentData.payment_hash);
        if (res.data && res.data.status === 'confirmed') {
          setIsPolling(false);
          setIsConfirmed(true);
          onSuccess(res.data);
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        }
      } catch (e) {
        console.warn("Liquidity signal check failed, retrying...");
      }
    }, 3000);

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [paymentData.payment_hash, paymentData.expires_at, isPolling, onSuccess]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const qrUrl = (!imgError && paymentData.qr_code && paymentData.qr_code.startsWith('data:')) 
    ? paymentData.qr_code 
    : `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(paymentData.payment_request)}`;

  if (isConfirmed) {
    return (
      <div className="space-y-8 text-center animate-in zoom-in-95 duration-500 py-10 px-4">
        <div className="mx-auto bg-emerald-500/10 p-8 sm:p-10 rounded-[2.5rem] w-fit shadow-2xl shadow-emerald-500/10 border-4 border-emerald-500/20">
          <CheckCircle2 className="w-16 h-16 sm:w-24 sm:h-24 text-emerald-400" />
        </div>
        <div className="space-y-2">
          <p className="text-3xl sm:text-4xl font-headline font-bold text-white">
            +{paymentData.amount_sats.toLocaleString()} SAT
          </p>
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em]">Node Liquidity Confirmed</p>
        </div>
        <Button className="w-full h-14 sm:h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-bold text-lg shadow-lg shadow-emerald-500/20" onClick={onCancel}>
          Finalize Session
        </Button>
      </div>
    );
  }

  if (timeLeft === 0) {
    return (
      <div className="space-y-8 text-center animate-in zoom-in-95 duration-500 py-10 px-4">
        <div className="mx-auto bg-destructive/10 p-8 sm:p-10 rounded-[2.5rem] w-fit border-4 border-destructive/20">
          <AlertCircle className="w-16 h-16 sm:w-24 sm:h-24 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-headline font-bold">Signal Expired</h3>
          <p className="text-sm text-muted-foreground">The liquidity path has timed out. Please re-initialize.</p>
        </div>
        <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 font-bold" onClick={onCancel}>
          Return to Interface
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-center animate-in zoom-in-30 duration-300">
      <div className="mx-auto bg-white p-4 sm:p-6 rounded-[2.5rem] w-full max-w-[280px] aspect-square shadow-2xl shadow-secondary/20 border-8 border-secondary/10 relative overflow-hidden">
        <div className="w-full h-full rounded-2xl flex items-center justify-center relative bg-white overflow-hidden">
          <img 
            src={qrUrl} 
            alt="Deposit QR" 
            className="w-full h-full object-contain transition-opacity duration-500"
            onLoad={(e) => (e.currentTarget.style.opacity = '1')}
            onError={() => setImgError(true)}
            style={{ opacity: 0 }}
          />
          <div className="absolute inset-0 flex items-center justify-center -z-10">
             <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/20 bg-secondary/10">
          <ArrowDownLeft className="w-3.5 h-3.5 text-secondary" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Node Liquidity</span>
        </div>
        <div className="space-y-1">
           <p className="text-3xl font-headline font-bold text-white">{paymentData.amount_sats.toLocaleString()} SAT</p>
           <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Awaiting Settlement Signal</p>
        </div>
      </div>

      <div className="space-y-4 px-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest px-2">
          <span className="text-muted-foreground">Session Expiry</span>
          <span className={cn("flex items-center gap-1.5", timeLeft && timeLeft < 300 ? "text-destructive" : "text-primary")}>
            <Clock className="w-3 h-3" />
            {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
          </span>
        </div>

        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl p-4 overflow-hidden text-left relative">
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Signal Trace (BOLT11)</p>
            <p className="text-[11px] font-mono text-white/70 break-all leading-relaxed line-clamp-2 select-all">{paymentData.payment_request}</p>
          </div>
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-10 w-10 shrink-0 rounded-xl neon-glow-secondary"
            onClick={() => {
              navigator.clipboard.writeText(paymentData.payment_request);
              setHasCopied(true);
              setTimeout(() => setHasCopied(false), 2000);
              toast({ title: "Signal Copied" });
            }}
          >
            {hasCopied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <Button variant="ghost" className="w-full font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-white" onClick={onCancel}>
        Abort Deposit
      </Button>
    </div>
  );
}
