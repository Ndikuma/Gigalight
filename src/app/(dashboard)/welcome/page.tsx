
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Zap } from 'lucide-react';

export default function WelcomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Strategic redirect to node dashboard
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center neon-glow-primary animate-pulse">
        <Zap className="w-10 h-10 text-primary" />
      </div>
      <div className="flex items-center gap-2 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
        <Loader2 className="w-3 h-3 animate-spin" /> Synchronizing Identity...
      </div>
    </div>
  );
}
