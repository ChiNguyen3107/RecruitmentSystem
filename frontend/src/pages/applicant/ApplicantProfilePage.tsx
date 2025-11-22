import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApplicantLayout } from '@/layouts/ApplicantLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm';
import { DocumentsManager } from '@/components/profile/DocumentsManager';
import { SkillsManager } from '@/components/profile/SkillsManager';
import { ExperienceManager } from '@/components/profile/ExperienceManager';
import { EducationManager } from '@/components/profile/EducationManager';
import { profileApi } from '@/services/profileApi';
import { useToast } from '@/hooks/useToast';
import { User, FileText, Code, Briefcase, GraduationCap, Loader2 } from 'lucide-react';
import type { Document, Skill, Experience, Education } from '@/types/profile.types';
import type { PersonalInfoFormData } from '@/lib/validations/profileSchemas';

export function ApplicantProfilePage() {
    const [activeTab, setActiveTab] = useState('personal');
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch profile data
    const { data: profile, isLoading, error } = useQuery({
        queryKey: ['profile'],
        queryFn: profileApi.getProfile,
    });

    // Personal Info Mutation
    const updatePersonalInfoMutation = useMutation({
        mutationFn: async (data: PersonalInfoFormData & { avatarFile?: File }) => {
            const { avatarFile, ...personalInfo } = data;

            // Upload avatar if changed
            let avatarUrl = profile?.personalInfo.avatarUrl;
            if (avatarFile) {
                avatarUrl = await profileApi.uploadAvatar(avatarFile);
            }

            // Update personal info
            return await profileApi.updatePersonalInfo({ ...personalInfo, avatarUrl });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Cập nhật thông tin thành công!', 'Thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Cập nhật thất bại', 'Lỗi');
        },
    });

    // Document Mutations
    const uploadDocumentMutation = useMutation({
        mutationFn: profileApi.uploadDocument,
        onMutate: async () => {
            // Optimistic update could be added here
        },
        onSuccess: (newDoc) => {
            queryClient.setQueryData(['profile'], (old: any) => ({
                ...old,
                documents: [...(old?.documents || []), newDoc],
            }));
            toast.success('Upload tài liệu thành công!', 'Thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Upload thất bại', 'Lỗi');
        },
    });

    const deleteDocumentMutation = useMutation({
        mutationFn: profileApi.deleteDocument,
        onMutate: async (id) => {
            // Optimistic update
            const previousProfile = queryClient.getQueryData(['profile']);
            queryClient.setQueryData(['profile'], (old: any) => ({
                ...old,
                documents: old?.documents.filter((doc: Document) => doc.id !== id) || [],
            }));
            return { previousProfile };
        },
        onSuccess: () => {
            toast.success('Xóa tài liệu thành công!', 'Thành công');
        },
        onError: (error: any, id, context) => {
            // Rollback on error
            if (context?.previousProfile) {
                queryClient.setQueryData(['profile'], context.previousProfile);
            }
            toast.error(error.message || 'Xóa thất bại', 'Lỗi');
        },
    });

    const setPrimaryDocumentMutation = useMutation({
        mutationFn: profileApi.setPrimaryDocument,
        onMutate: async (id) => {
            const previousProfile = queryClient.getQueryData(['profile']);
            queryClient.setQueryData(['profile'], (old: any) => ({
                ...old,
                documents: old?.documents.map((doc: Document) => ({
                    ...doc,
                    isPrimary: doc.id === id,
                })) || [],
            }));
            return { previousProfile };
        },
        onSuccess: () => {
            toast.success('Đặt CV chính thành công!', 'Thành công');
        },
        onError: (error: any, id, context) => {
            if (context?.previousProfile) {
                queryClient.setQueryData(['profile'], context.previousProfile);
            }
            toast.error(error.message || 'Cập nhật thất bại', 'Lỗi');
        },
    });

    // Skill Mutations
    const addSkillMutation = useMutation({
        mutationFn: async (skill: Omit<Skill, 'id'>) => {
            // In real app, this would call API
            return { ...skill, id: Date.now().toString() };
        },
        onSuccess: (newSkill) => {
            queryClient.setQueryData(['profile'], (old: any) => ({
                ...old,
                skills: [...(old?.skills || []), newSkill],
            }));
            toast.success('Thêm kỹ năng thành công!', 'Thành công');
        },
    });

    const removeSkillMutation = useMutation({
        mutationFn: async (id: string) => {
            // In real app, this would call API
            return id;
        },
        onMutate: async (id) => {
            const previousProfile = queryClient.getQueryData(['profile']);
            queryClient.setQueryData(['profile'], (old: any) => ({
                ...old,
                skills: old?.skills.filter((skill: Skill) => skill.id !== id) || [],
            }));
            return { previousProfile };
        },
        onSuccess: () => {
            toast.success('Xóa kỹ năng thành công!', 'Thành công');
        },
    });

    // Experience Mutations
    const saveExperienceMutation = useMutation({
        mutationFn: profileApi.saveExperience,
        onSuccess: (savedExp) => {
            queryClient.setQueryData(['profile'], (old: any) => {
                const experiences = old?.experiences || [];
                const existingIndex = experiences.findIndex((exp: Experience) => exp.id === savedExp.id);

                if (existingIndex >= 0) {
                    // Update existing
                    const newExperiences = [...experiences];
                    newExperiences[existingIndex] = savedExp;
                    return { ...old, experiences: newExperiences };
                } else {
                    // Add new
                    return { ...old, experiences: [...experiences, savedExp] };
                }
            });
            toast.success('Lưu kinh nghiệm thành công!', 'Thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Lưu thất bại', 'Lỗi');
        },
    });

    const deleteExperienceMutation = useMutation({
        mutationFn: profileApi.deleteExperience,
        onMutate: async (id) => {
            const previousProfile = queryClient.getQueryData(['profile']);
            queryClient.setQueryData(['profile'], (old: any) => ({
                ...old,
                experiences: old?.experiences.filter((exp: Experience) => exp.id !== id) || [],
            }));
            return { previousProfile };
        },
        onSuccess: () => {
            toast.success('Xóa kinh nghiệm thành công!', 'Thành công');
        },
        onError: (error: any, id, context) => {
            if (context?.previousProfile) {
                queryClient.setQueryData(['profile'], context.previousProfile);
            }
            toast.error(error.message || 'Xóa thất bại', 'Lỗi');
        },
    });

    // Education Mutations
    const saveEducationMutation = useMutation({
        mutationFn: profileApi.saveEducation,
        onSuccess: (savedEdu) => {
            queryClient.setQueryData(['profile'], (old: any) => {
                const education = old?.education || [];
                const existingIndex = education.findIndex((edu: Education) => edu.id === savedEdu.id);

                if (existingIndex >= 0) {
                    // Update existing
                    const newEducation = [...education];
                    newEducation[existingIndex] = savedEdu;
                    return { ...old, education: newEducation };
                } else {
                    // Add new
                    return { ...old, education: [...education, savedEdu] };
                }
            });
            toast.success('Lưu học vấn thành công!', 'Thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Lưu thất bại', 'Lỗi');
        },
    });

    const deleteEducationMutation = useMutation({
        mutationFn: profileApi.deleteEducation,
        onMutate: async (id) => {
            const previousProfile = queryClient.getQueryData(['profile']);
            queryClient.setQueryData(['profile'], (old: any) => ({
                ...old,
                education: old?.education.filter((edu: Education) => edu.id !== id) || [],
            }));
            return { previousProfile };
        },
        onSuccess: () => {
            toast.success('Xóa học vấn thành công!', 'Thành công');
        },
        onError: (error: any, id, context) => {
            if (context?.previousProfile) {
                queryClient.setQueryData(['profile'], context.previousProfile);
            }
            toast.error(error.message || 'Xóa thất bại', 'Lỗi');
        },
    });

    // Loading State
    if (isLoading) {
        return (
            <ApplicantLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                        <p className="text-muted-foreground">Đang tải hồ sơ...</p>
                    </div>
                </div>
            </ApplicantLayout>
        );
    }

    // Error State
    if (error) {
        return (
            <ApplicantLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                            <User className="w-8 h-8 text-destructive" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Không thể tải hồ sơ</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {(error as any)?.message || 'Đã có lỗi xảy ra'}
                            </p>
                        </div>
                    </div>
                </div>
            </ApplicantLayout>
        );
    }

    return (
        <ApplicantLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Hồ sơ của tôi</h1>
                    <p className="text-muted-foreground mt-2">
                        Quản lý thông tin cá nhân, CV, kỹ năng và kinh nghiệm của bạn
                    </p>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="personal">
                    <TabsList className="w-full justify-start">
                        <TabsTrigger value="personal">
                            <User className="w-4 h-4 mr-2" />
                            Thông tin cá nhân
                        </TabsTrigger>
                        <TabsTrigger value="documents">
                            <FileText className="w-4 h-4 mr-2" />
                            CV & Tài liệu
                        </TabsTrigger>
                        <TabsTrigger value="skills">
                            <Code className="w-4 h-4 mr-2" />
                            Kỹ năng
                        </TabsTrigger>
                        <TabsTrigger value="experience">
                            <Briefcase className="w-4 h-4 mr-2" />
                            Kinh nghiệm
                        </TabsTrigger>
                        <TabsTrigger value="education">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Học vấn
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal">
                        <PersonalInfoForm
                            initialData={profile?.personalInfo}
                            onSave={async (data) => {
                                await updatePersonalInfoMutation.mutateAsync(data);
                            }}
                            isLoading={updatePersonalInfoMutation.isPending}
                        />
                    </TabsContent>

                    <TabsContent value="documents">
                        <DocumentsManager
                            documents={profile?.documents || []}
                            onUpload={async (file) => {
                                await uploadDocumentMutation.mutateAsync(file);
                            }}
                            onDelete={async (id) => {
                                await deleteDocumentMutation.mutateAsync(id);
                            }}
                            onSetPrimary={async (id) => {
                                await setPrimaryDocumentMutation.mutateAsync(id);
                            }}
                            isLoading={uploadDocumentMutation.isPending || deleteDocumentMutation.isPending || setPrimaryDocumentMutation.isPending}
                        />
                    </TabsContent>

                    <TabsContent value="skills">
                        <SkillsManager
                            skills={profile?.skills || []}
                            onAdd={(skill) => addSkillMutation.mutate(skill)}
                            onRemove={(id) => removeSkillMutation.mutate(id)}
                            isLoading={addSkillMutation.isPending || removeSkillMutation.isPending}
                        />
                    </TabsContent>

                    <TabsContent value="experience">
                        <ExperienceManager
                            experiences={profile?.experiences || []}
                            onSave={async (exp) => {
                                await saveExperienceMutation.mutateAsync(exp);
                            }}
                            onDelete={async (id) => {
                                await deleteExperienceMutation.mutateAsync(id);
                            }}
                            isLoading={saveExperienceMutation.isPending || deleteExperienceMutation.isPending}
                        />
                    </TabsContent>

                    <TabsContent value="education">
                        <EducationManager
                            education={profile?.education || []}
                            onSave={async (edu) => {
                                await saveEducationMutation.mutateAsync(edu);
                            }}
                            onDelete={async (id) => {
                                await deleteEducationMutation.mutateAsync(id);
                            }}
                            isLoading={saveEducationMutation.isPending || deleteEducationMutation.isPending}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </ApplicantLayout>
    );
}
