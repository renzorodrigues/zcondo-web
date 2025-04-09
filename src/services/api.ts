import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('auth-token');
    
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
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear the token and redirect to login
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Auth
  login: (email: string, password: string) => 
    api.post<{ token: string; user: Record<string, unknown> }>('/auth/login', { email, password }),
  
  register: (userData: Record<string, unknown>) => 
    api.post<{ token: string; user: Record<string, unknown> }>('/auth/register', userData),
  
  // User
  getProfile: () => 
    api.get<Record<string, unknown>>('/user/profile'),
  
  updateProfile: (userData: Record<string, unknown>) => 
    api.put<Record<string, unknown>>('/user/profile', userData),
  
  // Add more API methods as needed
};

export { api }; 