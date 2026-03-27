// Lightweight fetch-based API client to replace axios
// Reduces bundle size and improves performance

interface FetchOptions extends RequestInit {
  timeout?: number;
}

class FetchError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

const createFetchApi = (baseURL: string, defaultTimeout = 10000) => {
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const request = async <T = any>(
    endpoint: string,
    options: FetchOptions = {},
    retries = 5
  ): Promise<T> => {
    const { timeout = defaultTimeout, ...fetchOptions } = options;
    
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${baseURL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle 429 rate limit with retry and jitter
        if (response.status === 429 && retries > 0) {
          const attempt = 6 - retries; // 1, 2, 3, 4, 5
          const baseDelay = Math.min(Math.pow(2, attempt) * 500, 8000); // 1s, 2s, 4s, 8s, 8s
          const jitter = Math.random() * 500; // 0-500ms random jitter
          const delay = baseDelay + jitter;
          console.warn(`Rate limited (429), retrying in ${Math.round(delay)}ms... (${retries} retries left)`);
          await sleep(delay);
          return request<T>(endpoint, options, retries - 1);
        }
        throw new FetchError(
          `HTTP error! status: ${response.status}`,
          response.status,
          response
        );
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return (await response.text()) as unknown as T;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new FetchError('Request timeout');
        }
        throw new FetchError(error.message);
      }
      
      throw new FetchError('Unknown error occurred');
    }
  };

  return {
    get: <T = any>(endpoint: string, options?: FetchOptions) => 
      request<T>(endpoint, { ...options, method: 'GET' }),
    
    post: <T = any>(endpoint: string, data?: any, options?: FetchOptions) => 
      request<T>(endpoint, {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),
    
    put: <T = any>(endpoint: string, data?: any, options?: FetchOptions) => 
      request<T>(endpoint, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),
    
    patch: <T = any>(endpoint: string, data?: any, options?: FetchOptions) => 
      request<T>(endpoint, {
        ...options,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      }),
    
    delete: <T = any>(endpoint: string, options?: FetchOptions) => 
      request<T>(endpoint, { ...options, method: 'DELETE' }),
  };
};

// Create API instance
const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

const isLocalRaw = /^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?\b/i.test(rawBaseUrl);
const API_BASE_URL = rawBaseUrl.startsWith('http://') && !isLocalRaw
  ? rawBaseUrl.replace(/^http:\/\//i, 'https://')
  : rawBaseUrl;

export const api = createFetchApi(API_BASE_URL);

// Export for testing or custom instances
export { createFetchApi, FetchError };
export default api;
