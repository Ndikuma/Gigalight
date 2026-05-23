'use client';

import { api } from '@/lib/api-client';
import { Wallet, DepositInvoiceResponse, DepositStatusResponse } from '@/lib/types';

/**
 * @fileOverview Bitcoin Lightning and On-Chain Wallet Services.
 */

export interface BitcoinAddressResponse {
  bitcoin_address: string;
  qr_code: string;
}

export const WalletService = {
  async getWallet() {
    return api.get<Wallet>('/wallet/');
  },

  async checkBlinkHealth() {
    return api.get('/wallet/blink/');
  },

  async generateDepositInvoice(amount: number, memo = "Wallet deposit", expiresIn = 3600) {
    return api.post<DepositInvoiceResponse>('/wallet/deposit/', { 
      amount, 
      memo, 
      expires_in: expiresIn 
    });
  },

  async getBitcoinAddress() {
    return api.get<BitcoinAddressResponse>('/wallet/bitcoin/');
  },

  async pollDepositStatus(paymentHash: string) {
    return api.get<DepositStatusResponse>(`/wallet/deposit_status/?payment_hash=${paymentHash}`);
  },

  async initiateWithdrawal(invoice: string) {
    return api.post<Wallet>('/wallet/withdraw/', { lnd_invoice: invoice });
  },

  async getTransactions() {
    return api.get<Wallet>('/wallet/transactions/');
  }
};
