
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @fileOverview Strategic redirect to resolve the Next.js Parallel Route Conflict.
 * Handing over the /jobs path to the public authority.
 */
export default function JobsDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/enterprise');
  }, [router]);

  return null;
}
