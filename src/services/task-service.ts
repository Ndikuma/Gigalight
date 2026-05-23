'use client';

import { api } from '@/lib/api-client';
import { TaskMini, PaginatedList, Category, Submission, TaskWorkbench, TaskManagement } from '@/lib/types';

/**
 * @fileOverview Micro-task and Technical Proof Auditing Services.
 * Synchronized with Task Workflow 2.1 specification.
 */

export const TaskService = {
  // Public Listing
  async getTasks(params?: any) {
    const query = new URLSearchParams(params).toString();
    return api.get<PaginatedList<TaskMini>>(`/tasks/${query ? '?' + query : ''}`);
  },

  async getActiveTasks() {
    return api.get<PaginatedList<TaskMini>>('/tasks/active/');
  },

  async getPendingTasks() {
    return api.get<PaginatedList<TaskMini>>('/tasks/pending/');
  },

  async getTask(id: string) {
    return api.get<TaskMini>(`/tasks/${id}/`);
  },

  // Task Creation & Management (Creator)
  async createTask(data: any) {
    return api.post<TaskMini>('/tasks/', data);
  },

  async updateTask(id: string, data: any) {
    return api.patch<TaskMini>(`/tasks/${id}/`, data);
  },

  async pauseTask(id: string) {
    return api.post(`/tasks/${id}/pause/`);
  },

  async resumeTask(id: string) {
    return api.post(`/tasks/${id}/resume/`);
  },

  async boostTask(id: string, data: { duration_hours: number, multiplier: number }) {
    return api.post(`/tasks/${id}/boost/`, data);
  },

  async unboostTask(id: string) {
    return api.post(`/tasks/${id}/unboost/`);
  },

  // Specialized Views
  async getTaskDashboard() {
    return api.get<any>('/tasks/dashboard/');
  },

  async getTaskManagement(taskId: string) {
    return api.get<TaskManagement>(`/tasks/${taskId}/management/`);
  },

  async getTaskWorkbench(taskId: string) {
    return api.get<TaskWorkbench>(`/tasks/${taskId}/workbench/`);
  },

  // Categories
  async getCategories() {
    return api.get<PaginatedList<Category>>('/tasks/categories/');
  },

  // My Actions
  async getMyTasks() {
    return api.get<TaskMini[]>('/tasks/my/');
  },

  async getMySubmissions() {
    return api.get<Submission[]>('/tasks/my/submissions/');
  },

  // Submissions & Audits
  async submitProof(taskId: string, data: { 
    subtask_id?: string | number, 
    proof_text?: string, 
    proof_link?: string, 
    proof_image_uri?: string, 
    proof_file_uri?: string,
    proof_metadata?: any,
    ai_score?: number
  }) {
    if (data.subtask_id) {
      const { subtask_id, ...payload } = data;
      return api.post<Submission>(`/tasks/${taskId}/subtasks/${subtask_id}/submit/`, payload);
    }
    return api.post<Submission>(`/tasks/${taskId}/submit/`, data);
  },

  async reviewSubmission(taskId: string, submissionId: string, data: { status: 'approved' | 'rejected' | 'needs_revision', validator_notes: string }) {
    return api.post(`/tasks/${taskId}/submissions/${submissionId}/review/`, data);
  },

  async getAuditQueue() {
    return api.get<any>('/tasks/dashboard/').then(res => ({
      ...res,
      data: res.data?.review_queue || []
    }));
  }
};
