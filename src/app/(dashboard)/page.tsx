
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @fileOverview Strategic redirect to consolidate internal landing traffic.
 * Clears the parallel route conflict with the public landing page.
 */
export default function DashboardRootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null;
}
