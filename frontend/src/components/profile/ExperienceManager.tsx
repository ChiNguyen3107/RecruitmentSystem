import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase, Building, Calendar, Edit, Trash2 } from 'lucide-react';
import { ExperienceModal } from './ExperienceModal';
import type { Experience } from '@/types/profile.types';
import { format } from 'date-fns';

interface ExperienceManagerProps {
    experiences: Experience[];
    onSave: (experience: Experience) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    isLoading?: boolean;
}

export function ExperienceManager({ experiences, onSave, onDelete, isLoading = false }: ExperienceManagerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience | undefined>();

    const handleAdd = () => {
        setEditingExperience(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (experience: Experience) => {
        setEditingExperience(experience);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, jobTitle: string) => {
        if (confirm(`Bạn có chắc muốn xóa kinh nghiệm "${jobTitle}"?`)) {
            await onDelete(id);
        }
    };

    const formatDate = (dateString: string | null, isCurrent: boolean): string => {
        if (isCurrent) return 'Hiện tại';
        if (!dateString) return '';
        return format(new Date(dateString), 'MM/yyyy');
    };

    // Sort experiences by start date (newest first)
    const sortedExperiences = [...experiences].sort((a, b) => {
        if (a.isCurrent) return -1;
        if (b.isCurrent) return 1;
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Kinh nghiệm làm việc</h3>
                    <p className="text-sm text-muted-foreground">
                        Thêm kinh nghiệm làm việc của bạn để tăng cơ hội tìm việc
                    </p>
                </div>
                <Button onClick={handleAdd} disabled={isLoading}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm kinh nghiệm
                </Button>
            </div>

            {/* Experiences List */}
            {sortedExperiences.length > 0 ? (
                <div className="space-y-4">
                    {sortedExperiences.map((exp) => (
                        <div
                            key={exp.id}
                            className="relative pl-8 pb-8 border-l-2 border-border last:pb-0 last:border-l-0"
                        >
                            {/* Timeline Dot */}
                            <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-primary border-4 border-background" />

                            {/* Content Card */}
                            <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-3">
                                        {/* Job Title */}
                                        <div>
                                            <h4 className="text-lg font-semibold flex items-center gap-2">
                                                <Briefcase className="w-5 h-5 text-primary" />
                                                {exp.jobTitle}
                                                {exp.isCurrent && (
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                                                        Hiện tại
                                                    </span>
                                                )}
                                            </h4>
                                        </div>

                                        {/* Company */}
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Building className="w-4 h-4" />
                                            <span className="font-medium">{exp.companyName}</span>
                                        </div>

                                        {/* Duration */}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {formatDate(exp.startDate, false)} - {formatDate(exp.endDate, exp.isCurrent)}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        {exp.description && (
                                            <p className="text-sm text-muted-foreground whitespace-pre-line mt-3">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(exp)}
                                            disabled={isLoading}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(exp.id, exp.jobTitle)}
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
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Chưa có kinh nghiệm làm việc nào</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Thêm kinh nghiệm làm việc để nhà tuyển dụng hiểu rõ hơn về bạn
                    </p>
                </div>
            )}

            {/* Modal */}
            <ExperienceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSave}
                initialData={editingExperience}
                isLoading={isLoading}
            />
        </div>
    );
}
