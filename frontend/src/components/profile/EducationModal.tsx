import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { educationSchema, type EducationFormData } from '@/lib/validations/profileSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, GraduationCap, School, BookOpen, Calendar, Award } from 'lucide-react';
import type { Education } from '@/types/profile.types';

interface EducationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Education) => Promise<void>;
    initialData?: Education;
    isLoading?: boolean;
}

export function EducationModal({ isOpen, onClose, onSave, initialData, isLoading = false }: EducationModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<EducationFormData>({
        resolver: zodResolver(educationSchema),
        defaultValues: initialData || {
            degree: '',
            school: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            gpa: '',
            description: '',
        },
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const onSubmit = async (data: EducationFormData) => {
        const education: Education = {
            id: initialData?.id || '',
            ...data,
        };
        await onSave(education);
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
                            {initialData ? 'Chỉnh sửa học vấn' : 'Thêm học vấn'}
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
                        {/* Degree */}
                        <div className="space-y-2">
                            <Label htmlFor="degree">
                                Bằng cấp <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="degree"
                                {...register('degree')}
                                leftIcon={<GraduationCap className="w-4 h-4" />}
                                placeholder="Cử nhân, Thạc sĩ, Tiến sĩ..."
                                error={!!errors.degree}
                                helperText={errors.degree?.message}
                                disabled={isLoading}
                            />
                        </div>

                        {/* School */}
                        <div className="space-y-2">
                            <Label htmlFor="school">
                                Trường học <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="school"
                                {...register('school')}
                                leftIcon={<School className="w-4 h-4" />}
                                placeholder="Đại học Bách Khoa TP.HCM"
                                error={!!errors.school}
                                helperText={errors.school?.message}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Field of Study */}
                        <div className="space-y-2">
                            <Label htmlFor="fieldOfStudy">
                                Chuyên ngành <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="fieldOfStudy"
                                {...register('fieldOfStudy')}
                                leftIcon={<BookOpen className="w-4 h-4" />}
                                placeholder="Khoa học Máy tính"
                                error={!!errors.fieldOfStudy}
                                helperText={errors.fieldOfStudy?.message}
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
                                <Label htmlFor="endDate">
                                    Ngày kết thúc <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    {...register('endDate')}
                                    leftIcon={<Calendar className="w-4 h-4" />}
                                    error={!!errors.endDate}
                                    helperText={errors.endDate?.message}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* GPA (Optional) */}
                        <div className="space-y-2">
                            <Label htmlFor="gpa">GPA (Tùy chọn)</Label>
                            <Input
                                id="gpa"
                                {...register('gpa')}
                                leftIcon={<Award className="w-4 h-4" />}
                                placeholder="3.5/4.0"
                                error={!!errors.gpa}
                                helperText={errors.gpa?.message}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                {...register('description')}
                                placeholder="Thành tích, hoạt động, dự án trong thời gian học..."
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
