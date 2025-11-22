import api from './api';
import type { Profile, PersonalInfo, Document, Experience, Education, ApiResponse } from '@/types/profile.types';

// Mock data cho development
const mockProfile: Profile = {
    personalInfo: {
        id: '1',
        firstName: 'Nguyễn',
        lastName: 'Văn A',
        email: 'nguyenvana@example.com',
        phone: '0912345678',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        dateOfBirth: '1995-01-15',
        gender: 'male',
        bio: 'Tôi là một lập trình viên Full-stack với 5 năm kinh nghiệm trong phát triển web và mobile applications.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenVanA',
        linkedIn: 'https://linkedin.com/in/nguyenvana',
        github: 'https://github.com/nguyenvana',
        portfolio: 'https://nguyenvana.dev',
    },
    documents: [
        {
            id: '1',
            fileName: 'CV_NguyenVanA_2024.pdf',
            fileSize: 2048576,
            fileType: 'application/pdf',
            uploadDate: '2024-01-15T10:00:00Z',
            downloadUrl: '#',
            isPrimary: true,
        },
        {
            id: '2',
            fileName: 'Portfolio_NguyenVanA.pdf',
            fileSize: 5242880,
            fileType: 'application/pdf',
            uploadDate: '2024-01-10T14:30:00Z',
            downloadUrl: '#',
            isPrimary: false,
        },
    ],
    skills: [
        { id: '1', name: 'React', level: 'expert', category: 'technical' },
        { id: '2', name: 'TypeScript', level: 'advanced', category: 'technical' },
        { id: '3', name: 'Node.js', level: 'advanced', category: 'technical' },
        { id: '4', name: 'Communication', level: 'expert', category: 'soft' },
        { id: '5', name: 'English', level: 'intermediate', category: 'language' },
        { id: '6', name: 'Git', level: 'expert', category: 'tool' },
    ],
    experiences: [
        {
            id: '1',
            jobTitle: 'Senior Frontend Developer',
            companyName: 'Tech Company A',
            startDate: '2022-01-01',
            endDate: null,
            isCurrent: true,
            description: 'Phát triển và maintain các ứng dụng web sử dụng React, TypeScript. Lead team 5 developers.',
        },
        {
            id: '2',
            jobTitle: 'Frontend Developer',
            companyName: 'Startup B',
            startDate: '2019-06-01',
            endDate: '2021-12-31',
            isCurrent: false,
            description: 'Xây dựng UI/UX cho các sản phẩm web và mobile. Làm việc với React Native.',
        },
    ],
    education: [
        {
            id: '1',
            degree: 'Cử nhân',
            school: 'Đại học Bách Khoa TP.HCM',
            fieldOfStudy: 'Khoa học Máy tính',
            startDate: '2013-09-01',
            endDate: '2017-06-30',
            gpa: '3.5/4.0',
            description: 'Tốt nghiệp loại Giỏi. Tham gia nhiều dự án nghiên cứu về AI và Machine Learning.',
        },
    ],
};

// API Functions
export const profileApi = {
    // Get complete profile
    getProfile: async (): Promise<Profile> => {
        try {
            // TODO: Replace with actual API call when backend is ready
            // const response = await api.get<ApiResponse<Profile>>('/api/profile');
            // return response.data.data!;

            // Mock delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return mockProfile;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    },

    // Update personal info
    updatePersonalInfo: async (data: Partial<PersonalInfo>): Promise<PersonalInfo> => {
        try {
            // TODO: Replace with actual API call
            // const response = await api.put<ApiResponse<PersonalInfo>>('/api/profile', data);
            // return response.data.data!;

            await new Promise(resolve => setTimeout(resolve, 500));
            return { ...mockProfile.personalInfo, ...data };
        } catch (error) {
            console.error('Error updating personal info:', error);
            throw error;
        }
    },

    // Upload avatar
    uploadAvatar: async (file: File): Promise<string> => {
        try {
            // TODO: Replace with actual API call
            // const formData = new FormData();
            // formData.append('avatar', file);
            // const response = await api.post<ApiResponse<{ url: string }>>('/api/profile/avatar', formData);
            // return response.data.data!.url;

            await new Promise(resolve => setTimeout(resolve, 1000));
            // Return a mock URL (in real app, this would be the uploaded image URL)
            return URL.createObjectURL(file);
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw error;
        }
    },

    // Upload document
    uploadDocument: async (file: File): Promise<Document> => {
        try {
            // TODO: Replace with actual API call
            // const formData = new FormData();
            // formData.append('document', file);
            // const response = await api.post<ApiResponse<Document>>('/api/profile/documents', formData);
            // return response.data.data!;

            await new Promise(resolve => setTimeout(resolve, 1500));
            return {
                id: Date.now().toString(),
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                uploadDate: new Date().toISOString(),
                downloadUrl: '#',
                isPrimary: false,
            };
        } catch (error) {
            console.error('Error uploading document:', error);
            throw error;
        }
    },

    // Delete document
    deleteDocument: async (id: string): Promise<void> => {
        try {
            // TODO: Replace with actual API call
            // await api.delete(`/api/profile/documents/${id}`);

            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    },

    // Set primary document
    setPrimaryDocument: async (id: string): Promise<void> => {
        try {
            // TODO: Replace with actual API call
            // await api.put(`/api/profile/documents/${id}/primary`);

            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
            console.error('Error setting primary document:', error);
            throw error;
        }
    },

    // Add/Update experience
    saveExperience: async (data: Experience): Promise<Experience> => {
        try {
            // TODO: Replace with actual API call
            // if (data.id) {
            //   const response = await api.put<ApiResponse<Experience>>(`/api/profile/experiences/${data.id}`, data);
            //   return response.data.data!;
            // } else {
            //   const response = await api.post<ApiResponse<Experience>>('/api/profile/experiences', data);
            //   return response.data.data!;
            // }

            await new Promise(resolve => setTimeout(resolve, 500));
            return data.id ? data : { ...data, id: Date.now().toString() };
        } catch (error) {
            console.error('Error saving experience:', error);
            throw error;
        }
    },

    // Delete experience
    deleteExperience: async (id: string): Promise<void> => {
        try {
            // TODO: Replace with actual API call
            // await api.delete(`/api/profile/experiences/${id}`);

            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Error deleting experience:', error);
            throw error;
        }
    },

    // Add/Update education
    saveEducation: async (data: Education): Promise<Education> => {
        try {
            // TODO: Replace with actual API call
            // if (data.id) {
            //   const response = await api.put<ApiResponse<Education>>(`/api/profile/education/${data.id}`, data);
            //   return response.data.data!;
            // } else {
            //   const response = await api.post<ApiResponse<Education>>('/api/profile/education', data);
            //   return response.data.data!;
            // }

            await new Promise(resolve => setTimeout(resolve, 500));
            return data.id ? data : { ...data, id: Date.now().toString() };
        } catch (error) {
            console.error('Error saving education:', error);
            throw error;
        }
    },

    // Delete education
    deleteEducation: async (id: string): Promise<void> => {
        try {
            // TODO: Replace with actual API call
            // await api.delete(`/api/profile/education/${id}`);

            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Error deleting education:', error);
            throw error;
        }
    },
};
