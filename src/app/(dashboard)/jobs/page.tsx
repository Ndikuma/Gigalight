
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @fileOverview Strategic redirect to de-conflict public /jobs and dashboard routes.
 * This file is being phased out in favor of the unique /enterprise dashboard path.
 */
export default function JobsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Hand over /jobs to the public informational page and redirect dashboard users to enterprise specs
    router.replace('/enterprise');
  }, [router]);

  return null;
}
