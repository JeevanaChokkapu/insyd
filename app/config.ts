// API Configuration
// Uses environment variable in production, localhost in development
export const API_BASE_URL = (() => {
  // Always use environment variable if set (for production)
  if (process.env.NEXT_PUBLIC_API_URL) {
    const url = process.env.NEXT_PUBLIC_API_URL.trim();
    // Remove trailing slash if present
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }
  
  // In browser, check if localhost
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3001';
    }
    // If on Render without env var, we can't know the backend URL
    // This should not happen - NEXT_PUBLIC_API_URL must be set!
    console.error('NEXT_PUBLIC_API_URL is not set! Please set it in Render environment variables.');
    // Try to construct from current hostname (won't work if backend is separate service)
    return `https://${window.location.hostname.replace('insyd-frontend', 'insyd-backend')}`;
  }
  
  // Server-side fallback
  return 'http://localhost:3001';
})();

// Debug helper (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('API_BASE_URL:', API_BASE_URL);
}

