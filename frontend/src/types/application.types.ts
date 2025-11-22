import type { JobPostingResponse, CompanyResponse } from '@/services/api';

// Application Status Enum
export type ApplicationStatus =
    | 'RECEIVED'      // Đã nộp
    | 'REVIEWED'      // Đang xem xét
    | 'INTERVIEW'     // Phỏng vấn
    | 'OFFER'         // Nhận offer
    | 'HIRED'         // Đã tuyển
    | 'REJECTED'      // Từ chối
    | 'WITHDRAWN';    // Đã rút đơn

// Timeline Event
export interface TimelineEvent {
    status: ApplicationStatus;
    timestamp: string;
    note?: string;
}

// Interview Schedule
export interface InterviewSchedule {
    id: number;
    scheduledAt: string;
    location?: string;
    interviewType?: 'PHONE' | 'VIDEO' | 'ONSITE';
    interviewerName?: string;
    notes?: string;
    meetingLink?: string;
}

// Application Document
export interface ApplicationDocument {
    id: number;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    uploadedAt: string;
}

// Application Response
export interface Application {
    id: number;
    jobPosting: JobPostingResponse;
    company: CompanyResponse;
    applicantId: number;
    status: ApplicationStatus;
    appliedAt: string;
    coverLetter?: string;
    resumeUrl?: string;
    timeline: TimelineEvent[];
    documents: ApplicationDocument[];
    interviewSchedule?: InterviewSchedule;
    employerNotes?: string;
    updatedAt: string;
}

// Filter Params
export interface ApplicationFilterParams {
    status?: ApplicationStatus | 'ALL';
    dateRange?: '7_DAYS' | '30_DAYS' | '3_MONTHS' | 'ALL';
    searchQuery?: string;
    sortBy?: 'appliedAt' | 'companyName';
    sortDir?: 'asc' | 'desc';
    page?: number;
    size?: number;
}

// Status Badge Config
export interface StatusBadgeConfig {
    label: string;
    className: string;
}

export const STATUS_CONFIGS: Record<ApplicationStatus, StatusBadgeConfig> = {
    RECEIVED: {
        label: 'Đã nộp',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    REVIEWED: {
        label: 'Đang xem xét',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    INTERVIEW: {
        label: 'Phỏng vấn',
        className: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    OFFER: {
        label: 'Nhận offer',
        className: 'bg-green-100 text-green-800 border-green-200',
    },
    HIRED: {
        label: 'Đã tuyển',
        className: 'bg-green-600 text-white border-green-700',
    },
    REJECTED: {
        label: 'Từ chối',
        className: 'bg-red-100 text-red-800 border-red-200',
    },
    WITHDRAWN: {
        label: 'Đã rút đơn',
        className: 'bg-gray-100 text-gray-800 border-gray-200',
    },
};
