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

// Types cho Job và Company
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
export type JobStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'EXPIRED';

export interface CompanyResponse {
  id: number;
  name: string;
  description?: string;
  businessLicense?: string;
  taxCode?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  address?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  contactEmail?: string;
  logoUrl?: string;
  isVerified?: boolean;
  createdAt?: string;
  employeeCount?: number;
  jobPostingCount?: number;
  benefits?: string[];
  workingHours?: string;
  companyPhotos?: string[];
  socialLinks?: Record<string, string>;
  activeJobsCount?: number;
  averageResponseTime?: number;
  hiringSuccessRate?: number;
}

export interface JobPostingResponse {
  id: number;
  title: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  jobType: JobType;
  status: JobStatus;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  experienceRequired?: string;
  educationRequired?: string;
  skillsRequired?: string;
  numberOfPositions?: number;
  applicationDeadline?: string;
  publishedAt?: string;
  viewsCount?: number;
  applicationsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  company?: CompanyResponse;
  createdBy?: UserResponse;
  canApply?: boolean;
  isExpired?: boolean;
  matchScore?: number;
  isSaved?: boolean | null;
  savedAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Service functions
export const jobService = {
  // Lấy danh sách việc làm mới nhất
  getLatestJobs: async (page: number = 0, size: number = 10): Promise<PageResponse<JobPostingResponse>> => {
    const response = await api.get<ApiResponse<PageResponse<JobPostingResponse>>>(
      `/public/jobs/latest?page=${page}&size=${size}`
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Không thể lấy danh sách việc làm');
  },

  // Tìm kiếm việc làm
  searchJobs: async (
    params: {
      keyword?: string;
      location?: string;
      jobType?: JobType;
      minSalary?: number;
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: string;
    }
  ): Promise<PageResponse<JobPostingResponse>> => {
    const queryParams = new URLSearchParams();
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.location) queryParams.append('location', params.location);
    if (params.jobType) queryParams.append('jobType', params.jobType);
    if (params.minSalary) queryParams.append('minSalary', params.minSalary.toString());
    queryParams.append('page', (params.page ?? 0).toString());
    queryParams.append('size', (params.size ?? 10).toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDir) queryParams.append('sortDir', params.sortDir);

    const response = await api.get<ApiResponse<PageResponse<JobPostingResponse>>>(
      `/public/jobs/search?${queryParams.toString()}`
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Không thể tìm kiếm việc làm');
  },
};

export const companyService = {
  // Lấy danh sách công ty (có thể filter featured nếu backend hỗ trợ)
  // Nếu không có endpoint featured, sẽ lấy danh sách rỗng (không throw error)
  getCompanies: async (params?: {
    featured?: boolean;
    page?: number;
    size?: number;
  }): Promise<PageResponse<CompanyResponse>> => {
    // Nếu request featured nhưng backend không hỗ trợ, return empty
    // Frontend sẽ xử lý để không hiển thị section này nếu không có data
    try {
      const queryParams = new URLSearchParams();
      if (params?.featured) queryParams.append('featured', 'true');
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());

      const url = `/companies${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<ApiResponse<PageResponse<CompanyResponse>>>(url);
      
      // Nếu backend trả về list trực tiếp (không có PageResponse)
      if (response.data.success && response.data.data) {
        // Kiểm tra xem data có phải là PageResponse không
        if (Array.isArray(response.data.data)) {
          // Nếu là array, wrap vào PageResponse
          return {
            content: response.data.data,
            page: 0,
            size: response.data.data.length,
            totalElements: response.data.data.length,
            totalPages: 1,
            first: true,
            last: true,
            hasNext: false,
            hasPrevious: false,
          };
        }
        return response.data.data;
      }
      
      // Nếu không có data, return empty PageResponse
      return {
        content: [],
        page: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        hasNext: false,
        hasPrevious: false,
      };
    } catch (error: any) {
      // Nếu endpoint không tồn tại hoặc lỗi (404, 500), return empty để không break UI
      // Chỉ log error trong development mode
      if (import.meta.env.DEV && error.response?.status !== 404 && error.response?.status !== 500) {
        console.warn('Featured companies endpoint error:', error.message);
      }
      return {
        content: [],
        page: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        hasNext: false,
        hasPrevious: false,
      };
    }
  },
};

export default api;

