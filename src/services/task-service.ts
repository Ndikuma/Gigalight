'use client';

import { api } from '@/lib/api-client';
import { TaskMini, PaginatedList, Category, Submission } from '@/lib/types';

/**
 * @fileOverview Micro-task and Technical Proof Auditing Services.
 * Synchronized with Django TaskViewSet and Submission endpoints.
 */

export const TaskService = {
  async getTasks(params?: any) {
    const query = new URLSearchParams(params).toString();
    return api.get<PaginatedList<TaskMini>>(`/tasks/${query ? '?' + query : ''}`);
  },

  async getTask(id: string) {
    return api.get<any>(`/tasks/${id}/`);
  },

  async createTask(data: any) {
    return api.post<TaskMini>('/tasks/', data);
  },

  async updateTask(id: string, data: any) {
    return api.patch<TaskMini>(`/tasks/${id}/`, data);
  },

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

  // Specialized Views
  async getTaskManagement(taskId: string) {
    // Matches: path("<str:pk>/management/", TaskViewSet.as_view({"get": "management"}), name="task-management")
    return api.get<any>(`/tasks/${taskId}/management/`);
  },

  async getTaskWorkbench(taskId: string) {
    // Matches: path("<str:pk>/workbench/", TaskViewSet.as_view({"get": "workbench"}), name="task-workbench")
    return api.get<any>(`/tasks/${taskId}/workbench/`);
  },

  // Submissions & Audits
  async submitProof(taskId: string, data: any) {
    // Matches: path("<str:pk>/submit/", TaskViewSet.as_view({"post": "submit"}), name="task-submit")
    return api.post<Submission>(`/tasks/${taskId}/submit/`, data);
  },

  async getSubmissionsForTask(taskId: string) {
    return api.get<Submission[]>(`/tasks/${taskId}/submissions/`);
  },

  async approveSubmission(taskId: string, submissionId: string, notes: string) {
    return api.post(`/tasks/${taskId}/submissions/${submissionId}/review/`, { 
      status: 'approved',
      validator_notes: notes 
    });
  },

  async rejectSubmission(taskId: string, submissionId: string, notes: string) {
    return api.post(`/tasks/${taskId}/submissions/${submissionId}/review/`, { 
      status: 'rejected',
      validator_notes: notes 
    });
  },

  async getAuditQueue() {
    return api.get<any>('/tasks/dashboard/').then(res => ({
      ...res,
      data: res.data?.review_queue || []
    }));
  }
};
