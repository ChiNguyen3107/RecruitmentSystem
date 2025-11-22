import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Building2, Calendar, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Application } from '@/types/application.types';
import { STATUS_CONFIGS } from '@/types/application.types';

interface ApplicationCardProps {
    application: Application;
    onWithdraw?: (id: number) => void;
    isWithdrawing?: boolean;
}

export function ApplicationCard({
    application,
    onWithdraw,
    isWithdrawing = false
}: ApplicationCardProps) {
    const { id, jobPosting, company, status, appliedAt } = application;

    // Defensive checks for missing data
    if (!jobPosting || !company) {
        return null;
    }

    const statusConfig = STATUS_CONFIGS[status];
    const canWithdraw = status === 'RECEIVED' || status === 'REVIEWED';

    // Safe date parsing with fallback
    const formattedDate = appliedAt
        ? (() => {
            try {
                return format(new Date(appliedAt), 'dd/MM/yyyy', { locale: vi });
            } catch {
                return 'N/A';
            }
        })()
        : 'N/A';

    return (
        <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* Job Title */}
                    <Link
                        to={`/jobs/${jobPosting.id}`}
                        className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                        {jobPosting.title}
                    </Link>

                    {/* Company Info */}
                    <Link
                        to={`/companies/${company.id}`}
                        className="flex items-center gap-2 mt-2 text-muted-foreground hover:text-primary transition-colors group"
                    >
                        {company.logoUrl ? (
                            <img
                                src={company.logoUrl}
                                alt={company.name}
                                className="w-5 h-5 rounded object-cover"
                            />
                        ) : (
                            <Building2 className="w-5 h-5" />
                        )}
                        <span className="text-sm group-hover:underline">{company.name}</span>
                    </Link>

                    {/* Applied Date */}
                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Nộp đơn: {formattedDate}</span>
                    </div>
                </div>

                {/* Status Badge */}
                <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.className}`}>
                        {statusConfig.label}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                <Link to={`/applicant/applications/${id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Xem chi tiết
                    </Button>
                </Link>

                {canWithdraw && onWithdraw && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onWithdraw(id)}
                        disabled={isWithdrawing}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <X className="w-4 h-4 mr-2" />
                        {isWithdrawing ? 'Đang rút...' : 'Rút đơn'}
                    </Button>
                )}
            </div>
        </div>
    );
}
