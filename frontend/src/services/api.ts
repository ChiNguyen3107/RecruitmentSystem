import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Tạo instance axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Interface cho response từ API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  code?: string;
  reason?: string;
  context?: any;
}

// Interface cho auth response
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
  user: UserResponse;
}

// Interface cho user
export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  status: string;
  emailVerified: boolean;
  avatarUrl?: string;
  lastLogin?: string;
  createdAt: string;
}

// Request interceptor: Thêm token vào header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Xử lý refresh token khi token hết hạn
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<any>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, thêm vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // Không có refresh token, logout
        processQueue(new Error('No refresh token'), null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh token
        const response = await axios.post<ApiResponse<AuthResponse>>(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api'}/auth/refresh?refresh_token=${refreshToken}`
        );

        const { data: newData } = response.data;
        if (newData && originalRequest.headers) {
          localStorage.setItem('accessToken', newData.accessToken);
          localStorage.setItem('refreshToken', newData.refreshToken);
          localStorage.setItem('user', JSON.stringify(newData.user));
          
          originalRequest.headers.Authorization = `Bearer ${newData.accessToken}`;
          
          processQueue(null, newData.accessToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token thất bại, logout
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

