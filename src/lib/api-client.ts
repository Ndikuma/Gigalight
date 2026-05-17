'use client';

/**
 * @fileOverview Professional API client for GigaLight Django Backend.
 * Handles JWT authentication, Bearer tokens, and standardized error propagation.
 */

const BASE_URL = 'https://broader-yeah-axis-secretariat.trycloudflare.com/api';

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('gigalight_access');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;
    const headers = { ...this.getHeaders(), ...options.headers };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          // Attempting to refresh would happen here
          // For now, clear tokens to prompt re-login if session is dead
          localStorage.removeItem('gigalight_access');
          localStorage.removeItem('gigalight_refresh');
        }
      }

      let data = null;
      if (response.status !== 204) {
        try {
          data = await response.json();
        } catch (e) {
          data = null;
        }
      }

      if (!response.ok) {
        return {
          data: null,
          error: data?.message || data?.detail || `Protocol Error: ${response.status}`,
          status: response.status,
        };
      }

      return { data, error: null, status: response.status };
    } catch (err) {
      return {
        data: null,
        error: 'Network connection failed. Interface timeout.',
        status: 500,
      };
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
