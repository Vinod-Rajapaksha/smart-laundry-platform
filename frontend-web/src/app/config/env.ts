export const env = {
  API_URL:
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
    (import.meta.env.VITE_API_URL as string | undefined) ||
    'http://localhost:5000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_BASE_URL as string | undefined,
};
