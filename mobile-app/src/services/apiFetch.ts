import { API_CONFIG } from '../constants/api';
import { getAccessToken } from './storage';

function normalizeHeaders(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {};
  if (headers instanceof Headers) {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return headers as Record<string, string>;
}

export async function apiFetch(
  path: string,
  options?: RequestInit
) {
  const url = `${API_CONFIG.BASE_URL}${path}`;
  const token = await getAccessToken();
  const baseHeaders = normalizeHeaders(options?.headers);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...baseHeaders,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    ...options,
    headers,
  });
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    throw new Error(data?.message || 'API request failed');
  }
  return data;
}