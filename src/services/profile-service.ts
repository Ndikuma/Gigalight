'use client';

import { api } from '@/lib/api-client';
import { User } from '@/lib/types';

/**
 * @fileOverview Node Identity and Profile Services.
 */

export const ProfileService = {
  async getMyProfile() {
    return api.get<User>('/profile/');
  },

  async updateProfile(data: any) {
    return api.patch<User>('/profile/', data);
  },

  async getPublicProfile(id: string) {
    return api.get<User>(`/profile/${id}/`);
  }
};
