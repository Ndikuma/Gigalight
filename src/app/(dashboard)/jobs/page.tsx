
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @fileOverview Strategic redirect to de-conflict public /jobs and dashboard routes.
 * The public path /jobs is now exclusively for informational content.
 * Dashboard users are redirected to the unique /enterprise endpoint.
 */
export default function JobsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/enterprise');
  }, [router]);

  return (
    <div className="h-[60vh] flex items-center justify-center bg-background">
       <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center animate-pulse">
             <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Redirecting to Enterprise Node...</p>
       </div>
    </div>
  );
}
