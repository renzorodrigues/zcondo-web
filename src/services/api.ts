import axios from 'axios';
import { tokenService } from './auth/token.service';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  async (config) => {
    // Get the token from tokenService
    const token = tokenService.getAccessToken();
    
    // If the token exists, add it to the headers
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const newToken = await tokenService.refreshAccessToken();
        
        if (newToken) {
          // Update the authorization header
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        tokenService.clearTokens();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Auth
  login: (email: string, password: string) => 
    api.post<{ token: string; user: Record<string, unknown> }>('/Authentication/login', { email, password }),
  
  register: (userData: Record<string, unknown>) => 
    api.post<{ token: string; user: Record<string, unknown> }>('/Authentication/register', userData),
  
  // User
  getProfile: () => 
    api.get<Record<string, unknown>>('/User/profile'),
  
  updateProfile: (userData: Record<string, unknown>) => 
    api.put<Record<string, unknown>>('/User/profile', userData),
  
  // Add more API methods as needed
};

export { api }; 