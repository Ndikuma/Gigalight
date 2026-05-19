'use client';

import { api } from '@/lib/api-client';
import { ProfessionalService, PaginatedList } from '@/lib/types';

/**
 * @fileOverview Professional Service Propagation and Management Services.
 */

export const ServiceService = {
  async listServices(params?: any) {
    const query = new URLSearchParams(params).toString();
    return api.get<PaginatedList<ProfessionalService>>(`/services/${query ? '?' + query : ''}`);
  },

  async getMyServices() {
    return api.get<ProfessionalService[]>('/services/my/');
  },

  async getService(id: string) {
    return api.get<ProfessionalService>(`/services/${id}/`);
  },

  async createService(data: any) {
    return api.post<ProfessionalService>('/services/', data);
  },

  async updateService(id: string, data: any) {
    return api.patch<ProfessionalService>(`/services/${id}/`, data);
  },

  async deleteService(id: string) {
    return api.delete(`/services/${id}/`);
  }
};
