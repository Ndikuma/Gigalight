'use client';

import { api } from '@/lib/api-client';
import { Bid, PaginatedList } from '@/lib/types';

/**
 * @fileOverview Project Bidding and Proposal Services.
 */

export const BidService = {
  async listBids(params?: any) {
    const query = new URLSearchParams(params).toString();
    return api.get<PaginatedList<Bid>>(`/bids/${query ? '?' + query : ''}`);
  },

  async submitBid(data: any) {
    return api.post<Bid>('/bids/', data);
  },

  async getBid(id: string) {
    return api.get<Bid>(`/bids/${id}/`);
  },

  async boostBid(id: string) {
    return api.post(`/bids/${id}/boost/`);
  },

  async cancelBid(id: string) {
    return api.post(`/bids/${id}/cancel/`);
  },

  async getMyBids() {
    return api.get<Bid[]>('/bids/my-bids/');
  }
};
