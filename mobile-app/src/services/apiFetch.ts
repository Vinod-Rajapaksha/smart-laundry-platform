import { API_CONFIG } from '../constants/api';

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const url = `${API_CONFIG.BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
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
