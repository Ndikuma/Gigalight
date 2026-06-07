
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @fileOverview Strategic redirect to de-conflict public /jobs and dashboard routes.
 * This path is now exclusively managed by the public informational page.
 */
export default function JobsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Hand over /jobs to the public informational page and redirect dashboard users to enterprise specs
    router.replace('/enterprise');
  }, [router]);

  return null;
}
