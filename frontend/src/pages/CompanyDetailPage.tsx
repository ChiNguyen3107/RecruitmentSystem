import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { JobCard } from '@/components/home/JobCard';
import { Pagination } from '@/components/common/Pagination';
import { useToast } from '@/hooks/useToast';
import { companyService } from '@/services/api';
import {
  Building2,
  MapPin,
  Globe,
  Phone,
  Mail,
  Clock,
  Users,
  Briefcase,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  Image as ImageIcon,
  Star,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobsPage, setJobsPage] = useState(1);
  const pageSize = 12;

  const companyId = id ? parseInt(id, 10) : 0;

  // Fetch company detail
  const {
    data: companyData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['companyDetail', companyId],
    queryFn: () => companyService.getCompanyDetail(companyId),
    enabled: !!companyId && companyId > 0,
  });

  // Fetch company jobs with pagination
  const {
    data: jobsData,
    isLoading: jobsLoading,
  } = useQuery({
    queryKey: ['companyJobs', companyId, jobsPage],
    queryFn: () => companyService.getCompanyJobs(companyId, jobsPage - 1, pageSize),
    enabled: !!companyId && companyId > 0,
  });

  const company = companyData?.company;
  const initialJobs = companyData?.jobs || [];

  // Loading state
  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-2 h-96" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Error state
  if (error || !company) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            icon={Building2}
            title="Không tìm thấy công ty"
            description="Công ty không tồn tại hoặc đã bị xóa"
          />
          <div className="mt-6 text-center">
            <Button onClick={() => navigate('/companies')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách công ty
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/companies')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách công ty
        </Button>

        {/* Company Header */}
        <div className="bg-card border rounded-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover border"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-primary/10 flex items-center justify-center border">
                  <Building2 className="w-16 h-16 md:w-20 md:h-20 text-primary" />
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <h1 className="text-3xl font-bold">{company.name}</h1>
                {company.isVerified && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã xác thực</span>
                  </div>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                {company.industry && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{company.industry}</span>
                  </div>
                )}
                {(company.city || company.address) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{company.city || company.address}</span>
                  </div>
                )}
                {company.companySize && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{company.companySize}</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary flex items-center gap-1"
                    >
                      Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {company.activeJobsCount !== undefined && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-2xl font-bold">{company.activeJobsCount}</div>
                    <div className="text-xs text-muted-foreground">Việc làm đang tuyển</div>
                  </div>
                )}
                {company.employeeCount !== undefined && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-2xl font-bold">{company.employeeCount}</div>
                    <div className="text-xs text-muted-foreground">Nhân viên</div>
                  </div>
                )}
                {company.averageResponseTime !== undefined && company.averageResponseTime > 0 && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-2xl font-bold">{company.averageResponseTime.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">Ngày phản hồi TB</div>
                  </div>
                )}
                {company.hiringSuccessRate !== undefined && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-2xl font-bold">{(company.hiringSuccessRate * 100).toFixed(0)}%</div>
                    <div className="text-xs text-muted-foreground">Tỷ lệ tuyển thành công</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {company.description && (
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Về công ty</h2>
                <div
                  className="prose max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: company.description }}
                />
              </div>
            )}

            {/* Benefits */}
            {company.benefits && company.benefits.length > 0 && (
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Phúc lợi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {company.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company Photos */}
            {company.companyPhotos && company.companyPhotos.length > 0 && (
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Hình ảnh công ty</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {company.companyPhotos.map((photo, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
                      <img
                        src={photo}
                        alt={`${company.name} - Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                            target.parentElement.innerHTML = '<div class="text-muted-foreground"><ImageIcon class="w-8 h-8" /></div>';
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company Jobs */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Việc làm đang tuyển</h2>
                {jobsData && jobsData.totalElements > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {jobsData.totalElements} việc làm
                  </span>
                )}
              </div>

              {jobsLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
              ) : jobsData && jobsData.content.length > 0 ? (
                <>
                  <div className="space-y-4 mb-6">
                    {jobsData.content.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>

                  {jobsData.totalPages > 1 && (
                    <Pagination
                      currentPage={jobsPage}
                      totalPages={jobsData.totalPages}
                      onPageChange={setJobsPage}
                    />
                  )}
                </>
              ) : (
                <EmptyState
                  icon={Briefcase}
                  title="Chưa có việc làm đang tuyển"
                  description="Công ty này hiện chưa có vị trí tuyển dụng nào"
                />
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Thông tin liên hệ</h3>
              <div className="space-y-3 text-sm">
                {company.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{company.address}</span>
                  </div>
                )}
                {company.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${company.phoneNumber}`} className="text-muted-foreground hover:text-primary">
                      {company.phoneNumber}
                    </a>
                  </div>
                )}
                {company.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={`mailto:${company.contactEmail}`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {company.contactEmail}
                    </a>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      {company.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {company.workingHours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{company.workingHours}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Thông tin bổ sung</h3>
              <div className="space-y-3 text-sm">
                {company.country && (
                  <div>
                    <span className="text-muted-foreground">Quốc gia:</span>
                    <p className="font-medium">{company.country}</p>
                  </div>
                )}
                {company.companySize && (
                  <div>
                    <span className="text-muted-foreground">Quy mô:</span>
                    <p className="font-medium">{company.companySize}</p>
                  </div>
                )}
                {company.createdAt && (
                  <div>
                    <span className="text-muted-foreground">Thành lập:</span>
                    <p className="font-medium">
                      {format(new Date(company.createdAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {company.socialLinks && Object.keys(company.socialLinks).length > 0 && (
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Mạng xã hội</h3>
                <div className="space-y-2">
                  {Object.entries(company.socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="capitalize">{platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

