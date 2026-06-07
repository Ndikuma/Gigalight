
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * @fileOverview Strategic redirect to resolve the Next.js Parallel Route Conflict.
 * This internal path is now uniquely propagated at /enterprise.
 */
export default function JobsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/enterprise');
  }, [router]);

  return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-widest">Handing over to Public Careers Hub...</p>
      </div>
    </div>
  );
}
