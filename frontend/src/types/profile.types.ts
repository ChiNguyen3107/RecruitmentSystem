// Profile Types
export interface PersonalInfo {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    bio: string;
    avatarUrl?: string;
    linkedIn?: string;
    github?: string;
    portfolio?: string;
}

// Document Types
export interface Document {
    id: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadDate: string;
    downloadUrl: string;
    isPrimary: boolean;
}

// Skill Types
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillCategory = 'technical' | 'soft' | 'language' | 'tool';

export interface Skill {
    id: string;
    name: string;
    level: SkillLevel;
    category: SkillCategory;
}

// Experience Types
export interface Experience {
    id: string;
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    description?: string;
}

// Education Types
export interface Education {
    id: string;
    degree: string;
    school: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    description?: string;
}

// Complete Profile
export interface Profile {
    personalInfo: PersonalInfo;
    documents: Document[];
    skills: Skill[];
    experiences: Experience[];
    education: Education[];
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// File Upload Types
export interface FileUploadProgress {
    fileName: string;
    progress: number;
    status: 'uploading' | 'success' | 'error';
}
