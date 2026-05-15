
'use client';

import { api } from '@/lib/api-client';

/**
 * @fileOverview Identity Propagation Services.
 */

export const AuthService = {
  async login(credentials: any) {
    const response = await api.post<{ token: string; user: any }>('/auth/login/', credentials);
    if (response.data?.token) {
      localStorage.setItem('gigalight_token', response.data.token);
    }
    return response;
  },

  async signup(data: any) {
    return api.post('/auth/register/', data);
  },

  async logout() {
    localStorage.removeItem('gigalight_token');
    return api.post('/auth/logout/', {});
  },

  async verifyNode() {
    return api.get('/auth/verify/');
  }
};
