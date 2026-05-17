'use client';

import { api } from '@/lib/api-client';
import { Wallet } from '@/lib/types';

/**
 * @fileOverview Bitcoin Lightning Wallet and Settlement Services.
 */

export const WalletService = {
  async getWallet() {
    return api.get<Wallet>('/wallet/');
  },

  async checkBlinkHealth() {
    return api.get('/wallet/blink/');
  },

  async generateDepositInvoice(amount: number) {
    return api.post<Wallet>('/wallet/deposit/', { amount });
  },

  async pollDepositStatus(paymentHash: string) {
    return api.get<Wallet>(`/wallet/deposit_status/?payment_hash=${paymentHash}`);
  },

  async initiateWithdrawal(invoice: string) {
    return api.post<Wallet>('/wallet/withdraw/', { lnd_invoice: invoice });
  },

  async getTransactions() {
    return api.get<Wallet>('/wallet/transactions/');
  }
};
