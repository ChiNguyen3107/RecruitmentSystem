import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Building2 } from 'lucide-react';
import type { JobPostingResponse, JobType } from '@/services/api';
import { cn } from '@/lib/utils';

interface SimilarJobCardProps {
    job: JobPostingResponse;
    className?: string;
}

const jobTypeLabels: Record<JobType, string> = {
    FULL_TIME: 'Toàn thời gian',
    PART_TIME: 'Bán thời gian',
    CONTRACT: 'Hợp đồng',
    INTERNSHIP: 'Thực tập',
    FREELANCE: 'Tự do',
};

function formatSalary(salaryMin?: number, salaryMax?: number, currency: string = 'VND'): string {
    if (!salaryMin && !salaryMax) return 'Thương lượng';

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    if (salaryMin && salaryMax) {
        return `${formatNumber(salaryMin)} - ${formatNumber(salaryMax)} ${currency}`;
    }
    if (salaryMin) {
        return `Từ ${formatNumber(salaryMin)} ${currency}`;
    }
    if (salaryMax) {
        return `Đến ${formatNumber(salaryMax)} ${currency}`;
    }
    return 'Thương lượng';
}

/**
 * SimilarJobCard - Compact version of JobCard for similar jobs section
 * Displays essential job information in a smaller, more condensed format
 */
export function SimilarJobCard({ job, className }: SimilarJobCardProps) {
    return (
        <Link
            to={`/jobs/${job.id}`}
            className={cn(
                'block bg-card border rounded-lg p-4 hover:shadow-md transition-all duration-200',
                'hover:border-primary/50 hover:-translate-y-1',
                'animate-fade-in-up',
                className
            )}
            aria-label={`Xem chi tiết việc làm ${job.title} tại ${job.company?.name || 'công ty'}`}
        >
            <div className="flex items-start gap-3">
                {/* Company Logo - Smaller size */}
                {job.company?.logoUrl ? (
                    <img
                        src={job.company.logoUrl}
                        alt={job.company.name}
                        className="w-12 h-12 rounded-lg object-cover border flex-shrink-0"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-primary" />
                    </div>
                )}

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                    {/* Job Title */}
                    <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-2 leading-tight">
                        {job.title}
                    </h3>

                    {/* Company Name */}
                    {job.company?.name && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                            <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{job.company.name}</span>
                            {job.company.isVerified && (
                                <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded flex-shrink-0">
                                    ✓
                                </span>
                            )}
                        </div>
                    )}

                    {/* Job Details - Compact */}
                    <div className="space-y-1 text-xs text-muted-foreground">
                        {job.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{job.location}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            {job.jobType && (
                                <div className="flex items-center gap-1">
                                    <Briefcase className="w-3 h-3 flex-shrink-0" />
                                    <span>{jobTypeLabels[job.jobType]}</span>
                                </div>
                            )}

                            {(job.salaryMin || job.salaryMax) && (
                                <div className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">
                                        {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
