
'use client';

import { api } from '@/lib/api-client';
import { Task, TaskSubmission } from '@/lib/types';

/**
 * @fileOverview Micro-task and Technical Proof Auditing Services.
 */

export const TaskService = {
  async getTasks() {
    return api.get<Task[]>('/tasks/');
  },

  async getTask(id: string) {
    return api.get<Task>(`/tasks/${id}/`);
  },

  async submitProof(taskId: string, proof: any) {
    return api.post<TaskSubmission>(`/tasks/${taskId}/submit/`, proof);
  },

  async getPendingAudits() {
    return api.get<TaskSubmission[]>('/audits/pending/');
  },

  async performAudit(submissionId: string, action: 'approve' | 'reject', notes: string) {
    return api.post(`/audits/${submissionId}/verify/`, { action, notes });
  }
};
