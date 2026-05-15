
'use client';

import { api } from '@/lib/api-client';
import { Project, Bid } from '@/lib/types';

/**
 * @fileOverview Strategic Project Management and Bidding Services.
 */

export const ProjectService = {
  async getProjects() {
    return api.get<Project[]>('/projects/');
  },

  async getProject(id: string) {
    return api.get<Project>(`/projects/${id}/`);
  },

  async createProject(data: any) {
    return api.post<Project>('/projects/create/', data);
  },

  async submitBid(projectId: string, bidData: any) {
    return api.post<Bid>(`/projects/${projectId}/bid/`, bidData);
  },

  async updateMilestone(milestoneId: string, status: string) {
    return api.put(`/milestones/${milestoneId}/status/`, { status });
  },

  async commissionNode(projectId: string, bidId: string) {
    return api.post(`/projects/${projectId}/hire/`, { bid_id: bidId });
  }
};
