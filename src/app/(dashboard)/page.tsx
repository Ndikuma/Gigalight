
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @fileOverview Strategic redirect to de-conflict root / landing and dashboard route groups.
 * Ensures the landing page remains the primary entry point for the network.
 */
export default function DashboardRootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null;
}
