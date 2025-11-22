import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ArrowLeft,
    Building2,
    MapPin,
    DollarSign,
    Calendar,
    FileText,
    Download,
    Loader2,
    AlertCircle,
    Clock,
    MapPinned,
    Video,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ApplicantLayout } from '@/layouts/ApplicantLayout';
import { ApplicationTimeline } from '@/components/application/ApplicationTimeline';
import { WithdrawConfirmModal } from '@/components/application/WithdrawConfirmModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import applicationApi from '@/services/applicationApi';
import { STATUS_CONFIGS } from '@/types/application.types';

export function ApplicationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

    // Fetch application detail
    const { data: application, isLoading, isError, error } = useQuery({
        queryKey: ['applications', id],
        queryFn: () => applicationApi.getApplicationDetail(Number(id)),
        enabled: !!id,
    });

    // Withdraw mutation
    const withdrawMutation = useMutation({
        mutationFn: () => applicationApi.withdrawApplication(Number(id)),
        onSuccess: () => {
            toast({
                title: 'Thành công',
                description: 'Đã rút đơn ứng tuyển',
            });
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            navigate('/applicant/applications');
        },
        onError: (error: any) => {
            toast({
                title: 'Lỗi',
                description: error.message || 'Không thể rút đơn ứng tuyển',
                variant: 'destructive',
            });
        },
    });

    if (isLoading) {
        return (
            <ApplicantLayout>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </ApplicantLayout>
        );
    }

    if (isError || !application) {
        return (
            <ApplicantLayout>
                <div className="max-w-4xl mx-auto">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-destructive">Có lỗi xảy ra</h3>
                                <p className="text-sm text-destructive/80 mt-1">
                                    {(error as any)?.message || 'Không thể tải chi tiết đơn ứng tuyển'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link to="/applicant/applications">
                        <Button variant="outline" className="mt-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại danh sách
                        </Button>
                    </Link>
                </div>
            </ApplicantLayout>
        );
    }

    const { jobPosting, company, status, appliedAt, coverLetter, documents, interviewSchedule, employerNotes, timeline } = application;
    const statusConfig = STATUS_CONFIGS[status];
    const canWithdraw = applicationApi.canWithdraw(status);

    return (
        <ApplicantLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Back Button */}
                <Link to="/applicant/applications">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại danh sách
                    </Button>
                </Link>

                {/* Header */}
                <div className="bg-card border rounded-lg p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-foreground">{jobPosting.title}</h1>

                            {/* Company */}
                            <Link
                                to={`/companies/${company.id}`}
                                className="flex items-center gap-2 mt-3 text-muted-foreground hover:text-primary transition-colors group"
                            >
                                {company.logoUrl ? (
                                    <img
                                        src={company.logoUrl}
                                        alt={company.name}
                                        className="w-6 h-6 rounded object-cover"
                                    />
                                ) : (
                                    <Building2 className="w-6 h-6" />
                                )}
                                <span className="font-medium group-hover:underline">{company.name}</span>
                            </Link>

                            {/* Job Info */}
                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                                {jobPosting.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{jobPosting.location}</span>
                                    </div>
                                )}
                                {(jobPosting.salaryMin || jobPosting.salaryMax) && (
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-4 h-4" />
                                        <span>
                                            {jobPosting.salaryMin?.toLocaleString()} - {jobPosting.salaryMax?.toLocaleString()} {jobPosting.salaryCurrency || 'VND'}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Nộp đơn: {format(new Date(appliedAt), 'dd/MM/yyyy', { locale: vi })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${statusConfig.className}`}>
                                {statusConfig.label}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-6 pt-6 border-t">
                        <Link to={`/jobs/${jobPosting.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                                Xem tin tuyển dụng
                            </Button>
                        </Link>
                        {canWithdraw && (
                            <Button
                                variant="destructive"
                                onClick={() => setWithdrawModalOpen(true)}
                                disabled={withdrawMutation.isPending}
                            >
                                {withdrawMutation.isPending ? 'Đang rút...' : 'Rút đơn ứng tuyển'}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Timeline */}
                <ApplicationTimeline timeline={timeline} currentStatus={status} />

                {/* Interview Schedule */}
                {interviewSchedule && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Lịch phỏng vấn</h3>
                        <div className="bg-card border rounded-lg p-6">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-medium">Thời gian</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(interviewSchedule.scheduledAt), 'EEEE, dd/MM/yyyy - HH:mm', { locale: vi })}
                                        </p>
                                    </div>
                                </div>
                                {interviewSchedule.location && (
                                    <div className="flex items-start gap-3">
                                        <MapPinned className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Địa điểm</p>
                                            <p className="text-sm text-muted-foreground">{interviewSchedule.location}</p>
                                        </div>
                                    </div>
                                )}
                                {interviewSchedule.meetingLink && (
                                    <div className="flex items-start gap-3">
                                        <Video className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Link phỏng vấn</p>
                                            <a
                                                href={interviewSchedule.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                {interviewSchedule.meetingLink}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {interviewSchedule.notes && (
                                    <div className="pt-3 border-t">
                                        <p className="font-medium mb-1">Ghi chú</p>
                                        <p className="text-sm text-muted-foreground">{interviewSchedule.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Cover Letter */}
                {coverLetter && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Thư xin việc</h3>
                        <div className="bg-card border rounded-lg p-6">
                            <p className="text-sm whitespace-pre-wrap">{coverLetter}</p>
                        </div>
                    </div>
                )}

                {/* Documents */}
                {documents && documents.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Tài liệu đính kèm</h3>
                        <div className="bg-card border rounded-lg divide-y">
                            {documents.map((doc) => (
                                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="font-medium text-sm">{doc.fileName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(doc.fileSize / 1024).toFixed(2)} KB • {format(new Date(doc.uploadedAt), 'dd/MM/yyyy', { locale: vi })}
                                            </p>
                                        </div>
                                    </div>
                                    <a href={doc.fileUrl} download target="_blank" rel="noopener noreferrer">
                                        <Button variant="ghost" size="sm">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Employer Notes */}
                {employerNotes && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Ghi chú từ nhà tuyển dụng</h3>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                            <p className="text-sm whitespace-pre-wrap">{employerNotes}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Withdraw Confirmation Modal */}
            <WithdrawConfirmModal
                open={withdrawModalOpen}
                onOpenChange={setWithdrawModalOpen}
                onConfirm={() => withdrawMutation.mutate()}
                isLoading={withdrawMutation.isPending}
                jobTitle={jobPosting.title}
            />
        </ApplicantLayout>
    );
}
