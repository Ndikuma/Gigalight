
'use client';

import { api } from '@/lib/api-client';
import { Tier, PaginatedList, TierPaymentResponse } from '@/lib/types';

/**
 * @fileOverview Node Membership Tier Services.
 */

export const TierService = {
  async listTiers() {
    return api.get<PaginatedList<Tier>>('/tiers/');
  },

  async generateTierInvoice(tierId: string) {
    // Matches: POST /api/tiers/{tier_id}/payment-request/
    return api.post<TierPaymentResponse>(`/tiers/${tierId}/payment-request/`);
  },

  async checkPaymentStatus(transactionId: string) {
    // Matches: GET /api/tiers/{transaction_id}/payment-status/
    return api.get<{ status: string; is_complete: boolean }>(`/tiers/${transactionId}/payment-status/`);
  }
};
