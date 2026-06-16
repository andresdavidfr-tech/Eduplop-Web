/**
 * Helper to resolve API endpoints.
 * Supports VITE_API_URL environment variable for cross-origin deployments (like Vercel).
 */
export const getApiUrl = (path: string): string => {
  let baseUrl = (import.meta as any).env?.VITE_API_URL || "";
  
  if (!baseUrl && typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // If we are currently on an external domain like eduplop-web.vercel.app, github.io, netlify, etc.
    // and not running on localhost or on the run.app Cloud Run server itself,
    // we default to the production backend of our Cloud Run container.
    if (
      hostname && 
      hostname !== "localhost" && 
      hostname !== "127.0.0.1" && 
      !hostname.includes("run.app")
    ) {
      baseUrl = "https://ais-pre-fg44b3dxcwxqmp7bab4izd-62756717314.us-east5.run.app";
    }
  }

  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBaseUrl}${cleanPath}`;
};
