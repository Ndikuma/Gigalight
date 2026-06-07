
"use client"

import { useEffect } from 'react';

/**
 * @deprecated This component has been dismantled into specialized settlement terminals:
 * - DepositSession.tsx
 * - TierUpgradeSession.tsx
 * - ValidatorActivationSession.tsx
 */
export function PaymentSession() {
  useEffect(() => {
    console.warn("Shared PaymentSession is deprecated. Use specialized session components.");
  }, []);
  return null;
}
