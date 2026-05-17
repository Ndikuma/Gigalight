'use client';

import { api } from '@/lib/api-client';
import { ProjectDetail, PaginatedList, ProjectCreate } from '@/lib/types';

/**
 * @fileOverview Strategic Project Management and Bidding Services.
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
    return api.post<ProjectCreate>('/projects/', data);
  },

  async updateProject(id: string, data: any) {
    return api.patch<ProjectCreate>(`/projects/${id}/`, data);
  },

  async hireNode(projectId: string, bidId: string) {
    return api.post(`/projects/${projectId}/hire/`, { bid_id: bidId });
  },

  async deliverMilestone(projectId: string, data: any) {
    return api.post(`/projects/${projectId}/deliver/`, data);
  },

  async getEscrowStatus(projectId: string) {
    return api.get(`/projects/${projectId}/escrow/`);
  },

  async getMyProjects() {
    return api.get<ProjectCreate[]>('/projects/my-projects/');
  },

  async getStats() {
    return api.get('/projects/stats/');
  }
};
