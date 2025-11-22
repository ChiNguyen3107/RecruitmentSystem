import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import { ApplicantLayout } from '@/layouts/ApplicantLayout';
import { ApplicationCard } from '@/components/application/ApplicationCard';
import { ApplicationFilters } from '@/components/application/ApplicationFilters';
import { WithdrawConfirmModal } from '@/components/application/WithdrawConfirmModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import applicationApi from '@/services/applicationApi';
import type { ApplicationFilterParams } from '@/types/application.types';

export function ApplicantApplicationsPage() {
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);

    // Parse filter params from URL
    const filterParams: ApplicationFilterParams = {
        status: (searchParams.get('status') as any) || 'ALL',
        dateRange: (searchParams.get('dateRange') as any) || 'ALL',
        searchQuery: searchParams.get('search') || undefined,
        page: parseInt(searchParams.get('page') || '0'),
        size: 10,
    };

    // Parse sort params
    const sortParam = searchParams.get('sort') || 'appliedAt_desc';
    const [sortBy, sortDir] = sortParam.split('_');
    filterParams.sortBy = sortBy as any;
    filterParams.sortDir = sortDir as any;

    // Fetch applications
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['applications', 'my', filterParams],
        queryFn: () => applicationApi.getMyApplications(filterParams),
    });

    // Withdraw mutation
    const withdrawMutation = useMutation({
        mutationFn: (id: number) => applicationApi.withdrawApplication(id),
        onSuccess: () => {
            toast({
                title: 'Thành công',
                description: 'Đã rút đơn ứng tuyển',
            });
            queryClient.invalidateQueries({ queryKey: ['applications', 'my'] });
            setWithdrawModalOpen(false);
            setSelectedApplicationId(null);
        },
        onError: (error: any) => {
            toast({
                title: 'Lỗi',
                description: error.message || 'Không thể rút đơn ứng tuyển',
                variant: 'destructive',
            });
        },
    });

    const handleWithdrawClick = (id: number) => {
        setSelectedApplicationId(id);
        setWithdrawModalOpen(true);
    };

    const handleWithdrawConfirm = () => {
        if (selectedApplicationId) {
            withdrawMutation.mutate(selectedApplicationId);
        }
    };

    const selectedApplication = data?.content.find(app => app.id === selectedApplicationId);

    // Pagination
    const currentPage = filterParams.page || 0;
    const totalPages = data?.totalPages || 0;

    const goToPage = (page: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', page.toString());
        window.history.pushState({}, '', `?${newParams.toString()}`);
        window.location.reload();
    };

    return (
        <ApplicantLayout>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Đơn ứng tuyển của tôi</h1>
                    <p className="text-muted-foreground mt-2">
                        Quản lý và theo dõi các đơn ứng tuyển của bạn
                    </p>
                </div>

                {/* Filters */}
                <ApplicationFilters />

                {/* Content */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}

                {isError && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-destructive">Có lỗi xảy ra</h3>
                                <p className="text-sm text-destructive/80 mt-1">
                                    {(error as any)?.message || 'Không thể tải danh sách đơn ứng tuyển'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {!isLoading && !isError && data && (
                    <>
                        {/* Applications Grid */}
                        {data.content.length > 0 ? (
                            <div className="grid gap-4">
                                {data.content.map((application) => (
                                    <ApplicationCard
                                        key={application.id}
                                        application={application}
                                        onWithdraw={handleWithdrawClick}
                                        isWithdrawing={
                                            withdrawMutation.isPending && selectedApplicationId === application.id
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            // Empty State
                            <div className="bg-card border rounded-lg p-12 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-muted rounded-full">
                                        <FileText className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">Bạn chưa nộp đơn ứng tuyển nào</h3>
                                        <p className="text-muted-foreground mt-1">
                                            Hãy tìm kiếm và ứng tuyển vào các vị trí phù hợp với bạn
                                        </p>
                                    </div>
                                    <Link to="/jobs">
                                        <Button size="lg" className="mt-2">
                                            Tìm việc làm
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {data.content.length > 0 && totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 0}
                                >
                                    Trước
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNum = i;
                                        if (totalPages > 5 && currentPage > 2) {
                                            pageNum = currentPage - 2 + i;
                                            if (pageNum >= totalPages) {
                                                pageNum = totalPages - 5 + i;
                                            }
                                        }
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => goToPage(pageNum)}
                                            >
                                                {pageNum + 1}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage >= totalPages - 1}
                                >
                                    Sau
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Withdraw Confirmation Modal */}
            <WithdrawConfirmModal
                open={withdrawModalOpen}
                onOpenChange={setWithdrawModalOpen}
                onConfirm={handleWithdrawConfirm}
                isLoading={withdrawMutation.isPending}
                jobTitle={selectedApplication?.jobPosting.title}
            />
        </ApplicantLayout>
    );
}
