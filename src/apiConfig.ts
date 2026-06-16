/**
 * Helper to resolve API endpoints.
 * Supports VITE_API_URL environment variable for cross-origin deployments (like Vercel).
 */
export const getApiUrl = (path: string): string => {
  const baseUrl = (import.meta as any).env?.VITE_API_URL || "";
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBaseUrl}${cleanPath}`;
};
