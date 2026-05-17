'use client';

import { api } from '@/lib/api-client';

/**
 * @fileOverview Identity Propagation Services.
 */

export const AuthService = {
  async login(credentials: any) {
    const response = await api.post<{ access: string; refresh: string; user: any }>('/auth/login/', credentials);
    if (response.data?.access) {
      localStorage.setItem('gigalight_access', response.data.access);
      localStorage.setItem('gigalight_refresh', response.data.refresh);
    }
    return response;
  },

  async signup(data: any) {
    return api.post('/auth/signup/', data);
  },

  async logout() {
    const refresh = localStorage.getItem('gigalight_refresh');
    const response = await api.post('/auth/logout/', { refresh });
    localStorage.removeItem('gigalight_access');
    localStorage.removeItem('gigalight_refresh');
    return response;
  },

  async refreshToken() {
    const refresh = localStorage.getItem('gigalight_refresh');
    const response = await api.post<{ access: string }>('/auth/refresh/', { refresh });
    if (response.data?.access) {
      localStorage.setItem('gigalight_access', response.data.access);
    }
    return response;
  }
};
