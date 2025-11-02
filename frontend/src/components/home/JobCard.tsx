import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Calendar, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import type { JobPostingResponse, JobType } from '@/services/api';
import { cn } from '@/lib/utils';

interface JobCardProps {
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

export function JobCard({ job, className }: JobCardProps) {
  const formattedDate = job.createdAt 
    ? format(new Date(job.createdAt), 'dd/MM/yyyy')
    : '';

  return (
    <Link
      to={`/jobs/${job.id}`}
      className={cn(
        'block bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200',
        'hover:border-primary/50',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        {job.company?.logoUrl ? (
          <img
            src={job.company.logoUrl}
            alt={job.company.name}
            className="w-16 h-16 rounded-lg object-cover border flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
        )}

        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                {job.company?.name && (
                  <>
                    <Building2 className="w-4 h-4" />
                    <span className="truncate">{job.company.name}</span>
                    {job.company.isVerified && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                        Đã xác thực
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
            {job.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{job.location}</span>
              </div>
            )}
            {job.jobType && (
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{jobTypeLabels[job.jobType]}</span>
              </div>
            )}
            {(job.salaryMin || job.salaryMax) && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
              </div>
            )}
          </div>

          {/* Description Preview */}
          {job.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {job.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {formattedDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Đăng {formattedDate}</span>
              </div>
            )}
            {job.applicationsCount !== undefined && job.applicationsCount > 0 && (
              <span>{job.applicationsCount} ứng viên đã ứng tuyển</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

