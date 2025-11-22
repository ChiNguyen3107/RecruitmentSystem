import api, { type ApiResponse, type PageResponse } from './api';
import type {
    Application,
    ApplicationFilterParams,
    ApplicationStatus
} from '@/types/application.types';

export const applicationApi = {
    /**
     * Lấy danh sách đơn ứng tuyển của user hiện tại
     */
    getMyApplications: async (
        params: ApplicationFilterParams = {}
    ): Promise<PageResponse<Application>> => {
        const queryParams = new URLSearchParams();

        // Pagination
        queryParams.append('page', (params.page ?? 0).toString());
        queryParams.append('size', (params.size ?? 10).toString());

        // Filters
        if (params.status && params.status !== 'ALL') {
            queryParams.append('status', params.status);
        }

        if (params.dateRange && params.dateRange !== 'ALL') {
            queryParams.append('dateRange', params.dateRange);
        }

        if (params.searchQuery) {
            queryParams.append('search', params.searchQuery);
        }

        // Sorting
        queryParams.append('sortBy', params.sortBy ?? 'appliedAt');
        queryParams.append('sortDir', params.sortDir ?? 'desc');

        const response = await api.get<ApiResponse<PageResponse<Application>>>(
            `/applications/my?${queryParams.toString()}`
        );

        if (response.data.success && response.data.data) {
            return response.data.data;
        }

        throw new Error(response.data.message || 'Không thể lấy danh sách đơn ứng tuyển');
    },

    /**
     * Lấy chi tiết đơn ứng tuyển
     */
    getApplicationDetail: async (id: number): Promise<Application> => {
        const response = await api.get<ApiResponse<Application>>(
            `/applications/${id}`
        );

        if (response.data.success && response.data.data) {
            return response.data.data;
        }

        throw new Error(response.data.message || 'Không thể lấy chi tiết đơn ứng tuyển');
    },

    /**
     * Rút đơn ứng tuyển
     */
    withdrawApplication: async (id: number): Promise<Application> => {
        const response = await api.put<ApiResponse<Application>>(
            `/applications/${id}/withdraw`
        );

        if (response.data.success && response.data.data) {
            return response.data.data;
        }

        throw new Error(response.data.message || 'Không thể rút đơn ứng tuyển');
    },

    /**
     * Kiểm tra xem có thể rút đơn không
     */
    canWithdraw: (status: ApplicationStatus): boolean => {
        return status === 'RECEIVED' || status === 'REVIEWED';
    },
};

export default applicationApi;
