'use client';

import { api } from '@/lib/api-client';
import { Notification, PaginatedList } from '@/lib/types';

/**
 * @fileOverview Protocol Activity and Notification Services.
 */

export const NotificationService = {
  async getNotifications(params?: any) {
    const query = new URLSearchParams(params).toString();
    return api.get<PaginatedList<Notification>>(`/notifications/${query ? '?' + query : ''}`);
  },

  async markAsRead(id: string) {
    return api.post<Notification>(`/notifications/${id}/read/`);
  },

  async markAllRead() {
    return api.post<Notification>('/notifications/mark-all-read/');
  },

  async getUnreadCount() {
    return api.get<{ count: number }>('/notifications/unread-count/');
  }
};
