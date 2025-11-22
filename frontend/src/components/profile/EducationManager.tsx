import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, GraduationCap, School, BookOpen, Calendar, Award, Edit, Trash2 } from 'lucide-react';
import { EducationModal } from './EducationModal';
import type { Education } from '@/types/profile.types';
import { format } from 'date-fns';

interface EducationManagerProps {
    education: Education[];
    onSave: (education: Education) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    isLoading?: boolean;
}

export function EducationManager({ education, onSave, onDelete, isLoading = false }: EducationManagerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEducation, setEditingEducation] = useState<Education | undefined>();

    const handleAdd = () => {
        setEditingEducation(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (edu: Education) => {
        setEditingEducation(edu);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, degree: string) => {
        if (confirm(`Bạn có chắc muốn xóa học vấn "${degree}"?`)) {
            await onDelete(id);
        }
    };

    const formatDate = (dateString: string): string => {
        return format(new Date(dateString), 'MM/yyyy');
    };

    // Sort education by end date (newest first)
    const sortedEducation = [...education].sort((a, b) => {
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Học vấn</h3>
                    <p className="text-sm text-muted-foreground">
                        Thêm thông tin học vấn của bạn
                    </p>
                </div>
                <Button onClick={handleAdd} disabled={isLoading}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm học vấn
                </Button>
            </div>

            {/* Education List */}
            {sortedEducation.length > 0 ? (
                <div className="space-y-4">
                    {sortedEducation.map((edu) => (
                        <div
                            key={edu.id}
                            className="relative pl-8 pb-8 border-l-2 border-border last:pb-0 last:border-l-0"
                        >
                            {/* Timeline Dot */}
                            <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-primary border-4 border-background" />

                            {/* Content Card */}
                            <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-3">
                                        {/* Degree */}
                                        <div>
                                            <h4 className="text-lg font-semibold flex items-center gap-2">
                                                <GraduationCap className="w-5 h-5 text-primary" />
                                                {edu.degree}
                                            </h4>
                                        </div>

                                        {/* School */}
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <School className="w-4 h-4" />
                                            <span className="font-medium">{edu.school}</span>
                                        </div>

                                        {/* Field of Study */}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{edu.fieldOfStudy}</span>
                                        </div>

                                        {/* Duration & GPA */}
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                                </span>
                                            </div>
                                            {edu.gpa && (
                                                <>
                                                    <span>•</span>
                                                    <div className="flex items-center gap-2">
                                                        <Award className="w-4 h-4" />
                                                        <span>GPA: {edu.gpa}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Description */}
                                        {edu.description && (
                                            <p className="text-sm text-muted-foreground whitespace-pre-line mt-3">
                                                {edu.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(edu)}
                                            disabled={isLoading}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(edu.id, edu.degree)}
                                            disabled={isLoading}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/30">
                    <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Chưa có thông tin học vấn nào</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Thêm thông tin học vấn để nhà tuyển dụng hiểu rõ hơn về trình độ của bạn
                    </p>
                </div>
            )}

            {/* Modal */}
            <EducationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSave}
                initialData={editingEducation}
                isLoading={isLoading}
            />
        </div>
    );
}
