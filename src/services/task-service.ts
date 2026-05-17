'use client';

import { api } from '@/lib/api-client';
import { TaskMini, PaginatedList, Category, Submission } from '@/lib/types';

/**
 * @fileOverview Micro-task and Technical Proof Auditing Services.
 */

export const TaskService = {
  async getTasks(params?: any) {
    const query = new URLSearchParams(params).toString();
    return api.get<PaginatedList<TaskMini>>(`/tasks/${query ? '?' + query : ''}`);
  },

  async getTask(id: string) {
    return api.get<TaskMini>(`/tasks/${id}/`);
  },

  async createTask(data: any) {
    return api.post<TaskMini>('/tasks/', data);
  },

  async updateTask(id: string, data: any) {
    return api.patch<TaskMini>(`/tasks/${id}/`, data);
  },

  async boostTask(id: string) {
    return api.post(`/tasks/${id}/boost/`);
  },

  async unboostTask(id: string) {
    return api.post(`/tasks/${id}/unboost/`);
  },

  async getCategories() {
    return api.get<PaginatedList<Category>>('/tasks/categories/');
  },

  // Submissions & Audits
  async submitProof(data: any) {
    return api.post<Submission>('/submissions/', data);
  },

  async getMySubmissions() {
    return api.get<Submission[]>('/submissions/my/');
  },

  async getAuditQueue() {
    return api.get<Submission[]>('/submissions/queue/');
  },

  async approveSubmission(id: string, notes: string) {
    return api.post(`/submissions/${id}/approve/`, { validator_notes: notes });
  },

  async rejectSubmission(id: string, notes: string) {
    return api.post(`/submissions/${id}/reject/`, { validator_notes: notes });
  },

  async runAiAudit(id: string) {
    return api.post(`/submissions/${id}/audit_ai/`);
  }
};
