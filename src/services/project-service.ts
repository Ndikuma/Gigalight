
'use client';

import { api } from '@/lib/api-client';
import { ProjectDetail, PaginatedList, Milestone } from '@/lib/types';

/**
 * @fileOverview Strategic Project Management and Bidding Services.
 * Synchronized with Django ProjectViewSet.
 */

export const ProjectService = {
  async getProjects(params?: any) {
    const query = new URLSearchParams(params).toString();
    return api.get<PaginatedList<ProjectDetail>>(`/projects/${query ? '?' + query : ''}`);
  },

  async getProject(id: string) {
    return api.get<ProjectDetail>(`/projects/${id}/`);
  },

  async createProject(data: any) {
    return api.post<any>('/projects/', data);
  },

  async updateProject(id: string, data: any) {
    return api.patch<any>(`/projects/${id}/`, data);
  },

  async hireNode(projectId: string, bidId: string) {
    // Matches: POST /api/projects/{id}/hire/
    return api.post(`/projects/${projectId}/hire/`, { bid_id: bidId });
  },

  async deliverMilestone(projectId: string, data: { milestone_id: string; message: string; github_url?: string; live_url?: string }) {
    // Matches: POST /api/projects/{id}/deliver/
    return api.post(`/projects/${projectId}/deliver/`, data);
  },

  async approveDelivery(projectId: string, deliveryId: string) {
    // Matches: POST /api/projects/{id}/approve-delivery/
    return api.post(`/projects/${projectId}/approve-delivery/`, { delivery_id: deliveryId });
  },

  async requestRevision(projectId: string, deliveryId: string) {
    // Matches: POST /api/projects/{id}/request-revision/
    return api.post(`/projects/${projectId}/request-revision/`, { delivery_id: deliveryId });
  },

  async completeProject(projectId: string) {
    // Matches: POST /api/projects/{id}/complete/
    return api.post(`/projects/${projectId}/complete/`);
  },

  async getEscrowStatus(projectId: string) {
    return api.get<{ escrow_balance_sats: number; milestones_total: number }>(`/projects/${projectId}/escrow/`);
  },

  async getMyProjects() {
    return api.get<ProjectDetail[]>('/projects/my-projects/');
  },

  async getStats() {
    return api.get('/projects/stats/');
  }
};
