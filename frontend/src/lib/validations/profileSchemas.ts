import { z } from 'zod';

// Vietnamese phone number regex
const vietnamesePhoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

// URL validation
const urlSchema = z.string().url('URL không hợp lệ').optional().or(z.literal(''));

// Personal Info Schema
export const personalInfoSchema = z.object({
    firstName: z.string().min(1, 'Họ không được để trống').max(50, 'Họ tối đa 50 ký tự'),
    lastName: z.string().min(1, 'Tên không được để trống').max(50, 'Tên tối đa 50 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().regex(vietnamesePhoneRegex, 'Số điện thoại không hợp lệ'),
    address: z.string().min(1, 'Địa chỉ không được để trống').max(200, 'Địa chỉ tối đa 200 ký tự'),
    dateOfBirth: z.string().min(1, 'Ngày sinh không được để trống'),
    gender: z.enum(['male', 'female', 'other'], {
        errorMap: () => ({ message: 'Vui lòng chọn giới tính' }),
    }),
    bio: z.string().max(500, 'Giới thiệu tối đa 500 ký tự').optional().or(z.literal('')),
    linkedIn: urlSchema,
    github: urlSchema,
    portfolio: urlSchema,
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// Experience Schema
export const experienceSchema = z.object({
    jobTitle: z.string().min(1, 'Chức danh không được để trống').max(100, 'Chức danh tối đa 100 ký tự'),
    companyName: z.string().min(1, 'Tên công ty không được để trống').max(100, 'Tên công ty tối đa 100 ký tự'),
    startDate: z.string().min(1, 'Ngày bắt đầu không được để trống'),
    endDate: z.string().nullable(),
    isCurrent: z.boolean().default(false),
    description: z.string().max(1000, 'Mô tả tối đa 1000 ký tự').optional().or(z.literal('')),
}).refine(
    (data) => {
        if (!data.isCurrent && !data.endDate) {
            return false;
        }
        if (data.endDate && data.startDate) {
            return new Date(data.endDate) >= new Date(data.startDate);
        }
        return true;
    },
    {
        message: 'Ngày kết thúc phải sau ngày bắt đầu',
        path: ['endDate'],
    }
);

export type ExperienceFormData = z.infer<typeof experienceSchema>;

// Education Schema
export const educationSchema = z.object({
    degree: z.string().min(1, 'Bằng cấp không được để trống').max(100, 'Bằng cấp tối đa 100 ký tự'),
    school: z.string().min(1, 'Trường học không được để trống').max(100, 'Trường học tối đa 100 ký tự'),
    fieldOfStudy: z.string().min(1, 'Chuyên ngành không được để trống').max(100, 'Chuyên ngành tối đa 100 ký tự'),
    startDate: z.string().min(1, 'Ngày bắt đầu không được để trống'),
    endDate: z.string().min(1, 'Ngày kết thúc không được để trống'),
    gpa: z.string().max(10, 'GPA tối đa 10 ký tự').optional().or(z.literal('')),
    description: z.string().max(1000, 'Mô tả tối đa 1000 ký tự').optional().or(z.literal('')),
}).refine(
    (data) => {
        if (data.endDate && data.startDate) {
            return new Date(data.endDate) >= new Date(data.startDate);
        }
        return true;
    },
    {
        message: 'Ngày kết thúc phải sau ngày bắt đầu',
        path: ['endDate'],
    }
);

export type EducationFormData = z.infer<typeof educationSchema>;

// Skill Schema
export const skillSchema = z.object({
    name: z.string().min(1, 'Tên kỹ năng không được để trống').max(50, 'Tên kỹ năng tối đa 50 ký tự'),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert'], {
        errorMap: () => ({ message: 'Vui lòng chọn trình độ' }),
    }),
    category: z.enum(['technical', 'soft', 'language', 'tool'], {
        errorMap: () => ({ message: 'Vui lòng chọn danh mục' }),
    }),
});

export type SkillFormData = z.infer<typeof skillSchema>;

// File Validation Helpers
export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.some(type => {
        if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type === type;
    });
};

export const ALLOWED_DOCUMENT_TYPES = ['.pdf', '.doc', '.docx', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const ALLOWED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', 'image/jpeg', 'image/png'];
export const MAX_DOCUMENT_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_MB = 5;
