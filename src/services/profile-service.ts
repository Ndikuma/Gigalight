
'use client';

import { api } from '@/lib/api-client';
import { Profile, Wallet } from '@/lib/types';

/**
 * @fileOverview Node Identity and Financial Ledger Services.
 */

export const ProfileService = {
  async getProfile() {
    return api.get<Profile>('/profile/');
  },

  async updateProfile(data: any) {
    return api.put<Profile>('/profile/update/', data);
  },

  async getWallet() {
    return api.get<Wallet>('/wallet/balance/');
  },

  async generateDepositInvoice(amount: number) {
    return api.post<{ invoice: string }>('/wallet/deposit/', { amount });
  },

  async initiateWithdrawal(invoice: string) {
    return api.post('/wallet/withdraw/', { invoice });
  },

  async upgradeTier(tier: string) {
    return api.post('/profile/upgrade-tier/', { tier });
  }
};
