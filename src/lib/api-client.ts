'use client';

/**
 * @fileOverview Professional API client for GigaLight Django Backend.
 * Handles JWT authentication, Bearer tokens, and standardized unwrapping of { success, data } envelopes.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sign-journals-scripting-hawaiian.trycloudflare.com/api';

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
          localStorage.removeItem('gigalight_access');
          localStorage.removeItem('gigalight_refresh');
        }
      }

      let rawData: any = null;
      if (response.status !== 204) {
        try {
          rawData = await response.json();
        } catch (e) {
          rawData = null;
        }
      }

      if (!response.ok) {
        return {
          data: null,
          error: rawData?.message || rawData?.detail || rawData?.error || `Protocol Error: ${response.status}`,
          status: response.status,
        };
      }

      /**
       * Handle the standard Gigalight wrapper: { success: boolean, data: T, message?: string }
       * If 'success' is present, we return the inner 'data'.
       */
      let finalData = rawData;
      if (rawData && typeof rawData === 'object' && 'success' in rawData) {
        if (rawData.success === false) {
          return {
            data: null,
            error: rawData.message || 'Operation failed on protocol node.',
            status: response.status,
          };
        }
        finalData = rawData.data;
      }

      return { data: finalData as T, error: null, status: response.status };
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
