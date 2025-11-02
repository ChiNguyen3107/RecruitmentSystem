import { Link } from 'react-router-dom';
import { Building2, MapPin, Briefcase, CheckCircle2 } from 'lucide-react';
import type { CompanyResponse } from '@/services/api';
import { cn } from '@/lib/utils';

interface CompanyCardProps {
  company: CompanyResponse;
  className?: string;
}

export function CompanyCard({ company, className }: CompanyCardProps) {
  return (
    <Link
      to={`/companies/${company.id}`}
      className={cn(
        'block bg-card border rounded-lg p-6 hover:shadow-lg transition-all duration-200',
        'hover:border-primary/50 hover:-translate-y-1',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={company.name}
            className="w-16 h-16 rounded-lg object-cover border flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
        )}

        {/* Company Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground flex-1">
              {company.name}
            </h3>
            {company.isVerified && (
              <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
            )}
          </div>

          {/* Industry & Location */}
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
            {company.industry && (
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{company.industry}</span>
              </div>
            )}
            {(company.city || company.address) && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{company.city || company.address}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {company.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {company.description.substring(0, 120)}...
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {company.activeJobsCount !== undefined && company.activeJobsCount > 0 && (
              <span>{company.activeJobsCount} việc làm đang tuyển</span>
            )}
            {company.employeeCount && (
              <span>{company.employeeCount} nhân viên</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

