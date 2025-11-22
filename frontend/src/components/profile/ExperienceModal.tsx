import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experienceSchema, type ExperienceFormData } from '@/lib/validations/profileSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Briefcase, Building, Calendar } from 'lucide-react';
import type { Experience } from '@/types/profile.types';

interface ExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Experience) => Promise<void>;
    initialData?: Experience;
    isLoading?: boolean;
}

export function ExperienceModal({ isOpen, onClose, onSave, initialData, isLoading = false }: ExperienceModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm<ExperienceFormData>({
        resolver: zodResolver(experienceSchema),
        defaultValues: initialData || {
            jobTitle: '',
            companyName: '',
            startDate: '',
            endDate: null,
            isCurrent: false,
            description: '',
        },
    });

    const isCurrent = watch('isCurrent');

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    useEffect(() => {
        if (isCurrent) {
            setValue('endDate', null);
        }
    }, [isCurrent, setValue]);

    const onSubmit = async (data: ExperienceFormData) => {
        const experience: Experience = {
            id: initialData?.id || '',
            ...data,
        };
        await onSave(experience);
        reset();
        onClose();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200" onClick={handleClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-background rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-background z-10">
                        <h2 className="text-2xl font-bold">
                            {initialData ? 'Chỉnh sửa kinh nghiệm' : 'Thêm kinh nghiệm'}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                        {/* Job Title */}
                        <div className="space-y-2">
                            <Label htmlFor="jobTitle">
                                Chức danh <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="jobTitle"
                                {...register('jobTitle')}
                                leftIcon={<Briefcase className="w-4 h-4" />}
                                placeholder="Senior Frontend Developer"
                                error={!!errors.jobTitle}
                                helperText={errors.jobTitle?.message}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Company Name */}
                        <div className="space-y-2">
                            <Label htmlFor="companyName">
                                Công ty <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="companyName"
                                {...register('companyName')}
                                leftIcon={<Building className="w-4 h-4" />}
                                placeholder="Tech Company A"
                                error={!!errors.companyName}
                                helperText={errors.companyName?.message}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">
                                    Ngày bắt đầu <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    {...register('startDate')}
                                    leftIcon={<Calendar className="w-4 h-4" />}
                                    error={!!errors.startDate}
                                    helperText={errors.startDate?.message}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endDate">Ngày kết thúc</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    {...register('endDate')}
                                    leftIcon={<Calendar className="w-4 h-4" />}
                                    error={!!errors.endDate}
                                    helperText={errors.endDate?.message}
                                    disabled={isLoading || isCurrent}
                                />
                            </div>
                        </div>

                        {/* Is Current */}
                        <div className="flex items-center gap-2">
                            <input
                                id="isCurrent"
                                type="checkbox"
                                {...register('isCurrent')}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                disabled={isLoading}
                            />
                            <Label htmlFor="isCurrent" className="cursor-pointer">
                                Hiện tại tôi đang làm việc ở đây
                            </Label>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả công việc</Label>
                            <Textarea
                                id="description"
                                {...register('description')}
                                placeholder="Mô tả chi tiết về công việc, trách nhiệm, thành tựu..."
                                rows={5}
                                maxLength={1000}
                                showCharCount
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t">
                            <Button type="submit" disabled={isLoading} className="min-w-32">
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Đang lưu...</span>
                                    </div>
                                ) : (
                                    'Lưu'
                                )}
                            </Button>
                            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                                Hủy
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
