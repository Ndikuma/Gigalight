
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

export interface WithdrawDecodeResponse {
  target_type: 'lightning_invoice' | 'lightning_address' | 'lnurl' | 'bitcoin_address';
  rail: 'lightning' | 'bitcoin';
  amount_sats: number | null;
  requires_amount: boolean;
  amount_source: 'invoice' | 'user_input';
}

export interface WithdrawFeesResponse {
  amount_sats: number;
  estimated_fee_sats: number;
  wallet_debit_sats: number;
  fee_charged_to_user: boolean;
  can_withdraw: boolean;
  available_balance: number;
  balance_after: number;
  fee_policy: any;
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

  async withdrawDecode(target: string) {
    return api.post<WithdrawDecodeResponse>('/wallet/withdraw/decode/', { target });
  },

  async withdrawFees(target: string, amount?: number) {
    return api.post<WithdrawFeesResponse>('/wallet/withdraw/fees/', { target, amount });
  },

  async initiateWithdrawal(target: string, amount?: number, memo = "Withdrawal") {
    return api.post<any>('/wallet/withdraw/', { target, amount, memo });
  },

  async getTransactions() {
    return api.get<Wallet>('/wallet/transactions/');
  }
};
