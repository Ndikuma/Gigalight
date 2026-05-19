'use client';

import { api } from '@/lib/api-client';
import { User, TierPaymentResponse } from '@/lib/types';

/**
 * @fileOverview Node Identity and Profile Services.
 * Includes specialized validator activation protocols.
 */

export const ProfileService = {
  async getMyProfile() {
    return api.get<User>('/profile/');
  },

  async updateProfile(data: any) {
    return api.patch<User>('/profile/', data);
  },

  async getPublicProfile(id: string) {
    return api.get<User>(`/profile/${id}/`);
  },

  /**
   * Propagates a signal to generate a Validator stake invoice.
   * Path: POST /api/profile/validator/payment-request/
   */
  async getValidatorInvoice() {
    return api.post<TierPaymentResponse>('/profile/validator/payment-request/');
  },

  /**
   * Tracks the settlement status of a Validator activation stake.
   * Path: GET /api/profile/validator/payment-status/
   */
  async checkValidatorStatus() {
    return api.get<{ status: string; is_complete: boolean }>('/profile/validator/payment-status/');
  }
};
