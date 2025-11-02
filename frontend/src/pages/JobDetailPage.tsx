import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { JobCard } from '@/components/home/JobCard';
import { useToast } from '@/hooks/useToast';
import { useAuthStore } from '@/store/useAuthStore';
import api, {
  jobService,
  applicationService,
  savedJobService,
  type ApiResponse,
} from '@/services/api';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Building2,
  Bookmark,
  BookmarkCheck,
  Send,
  AlertCircle,
  Clock,
  Users,
  FileText,
  Award,
  User,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Tab type
type TabType = 'description' | 'requirements' | 'benefits' | 'company';

// Modal Apply Job Component
function ApplyJobModal({
  jobId,
  jobTitle,
  isOpen,
  onClose,
}: {
  jobId: number;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [useFile, setUseFile] = useState(true);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const applyMutation = useMutation({
    mutationFn: async () => {
      // Nếu có file, upload trước
      let finalResumeUrl = resumeUrl;
      if (useFile && resumeFile) {
        const formData = new FormData();
        formData.append('file', resumeFile);
        
        try {
          const uploadResponse = await api.post<ApiResponse<{ resumeUrl?: string }>>(
            '/profiles/my/resume',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          
          if (uploadResponse.data.success && uploadResponse.data.data?.resumeUrl) {
            finalResumeUrl = uploadResponse.data.data.resumeUrl;
          }
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Không thể tải lên CV');
        }
      }

      return applicationService.applyJob({
        jobPostingId: jobId,
        coverLetter: coverLetter || undefined,
        resumeUrl: finalResumeUrl || undefined,
      });
    },
    onSuccess: () => {
      toast.success('Nộp đơn ứng tuyển thành công!', 'Thành công');
      queryClient.invalidateQueries({ queryKey: ['jobDetail', jobId] });
      onClose();
      setCoverLetter('');
      setResumeFile(null);
      setResumeUrl('');
    },
    onError: (error: any) => {
      toast.error(
        error.message || 'Có lỗi xảy ra khi nộp đơn ứng tuyển',
        'Lỗi'
      );
    },
  });

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Ứng tuyển: {jobTitle}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Resume Upload Option */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant={useFile ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUseFile(true)}
              >
                Tải lên CV
              </Button>
              <Button
                type="button"
                variant={!useFile ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUseFile(false)}
              >
                Nhập URL CV
              </Button>
            </div>

            {useFile ? (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Chọn file CV (PDF, DOC, DOCX - tối đa 5MB)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error('File quá lớn. Kích thước tối đa 5MB', 'Lỗi');
                        return;
                      }
                      setResumeFile(file);
                    }
                  }}
                  className="block w-full text-sm text-muted-foreground
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/90"
                />
                {resumeFile && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Đã chọn: {resumeFile.name}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">
                  URL CV (nếu CV đã được lưu trữ online)
                </label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://example.com/cv.pdf"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Thư xin việc (tùy chọn)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Viết thư xin việc của bạn..."
              rows={6}
              maxLength={5000}
              className="w-full px-3 py-2 border rounded-md resize-none"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {coverLetter.length}/5000 ký tự
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              onClick={() => applyMutation.mutate()}
              disabled={applyMutation.isPending || (!resumeFile && !resumeUrl && useFile)}
            >
              {applyMutation.isPending ? 'Đang xử lý...' : 'Nộp đơn'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function để format salary
function formatSalary(
  salaryMin?: number,
  salaryMax?: number,
  currency: string = 'VND'
): string {
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

// Job type labels
const jobTypeLabels: Record<string, string> = {
  FULL_TIME: 'Toàn thời gian',
  PART_TIME: 'Bán thời gian',
  CONTRACT: 'Hợp đồng',
  INTERNSHIP: 'Thực tập',
  FREELANCE: 'Tự do',
};

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [showApplyModal, setShowApplyModal] = useState(false);

  const jobId = id ? parseInt(id, 10) : 0;

  // Fetch job detail
  const {
    data: job,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['jobDetail', jobId],
    queryFn: () => jobService.getJobDetail(jobId),
    enabled: !!jobId && jobId > 0,
  });

  // Fetch similar jobs
  const { data: similarJobs = [] } = useQuery({
    queryKey: ['similarJobs', jobId],
    queryFn: () => jobService.getSimilarJobs(jobId, job, 6),
    enabled: !!jobId && jobId > 0 && !!job,
  });

  // Save/Unsave mutations
  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: () => savedJobService.saveJob(jobId),
    onSuccess: () => {
      toast.success('Đã lưu việc làm vào danh sách yêu thích', 'Thành công');
      queryClient.invalidateQueries({ queryKey: ['jobDetail', jobId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể lưu việc làm', 'Lỗi');
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: () => savedJobService.unsaveJob(jobId),
    onSuccess: () => {
      toast.success('Đã bỏ lưu việc làm', 'Thành công');
      queryClient.invalidateQueries({ queryKey: ['jobDetail', jobId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể bỏ lưu việc làm', 'Lỗi');
    },
  });

  // Handle save/unsave
  const handleSaveToggle = () => {
    if (job?.isSaved) {
      unsaveMutation.mutate();
    } else {
      saveMutation.mutate();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            icon={AlertCircle}
            title="Không tìm thấy việc làm"
            description="Việc làm không tồn tại hoặc đã bị xóa"
          />
          <div className="mt-6 text-center">
            <Button onClick={() => navigate('/jobs')}>
              Quay lại danh sách việc làm
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const isApplicant = isAuthenticated && user?.role === 'APPLICANT';
  const formattedDate = job.createdAt
    ? format(new Date(job.createdAt), 'dd/MM/yyyy')
    : '';
  const deadlineDate = job.applicationDeadline
    ? format(new Date(job.applicationDeadline), 'dd/MM/yyyy')
    : '';

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Job Header */}
        <div className="bg-card border rounded-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Company Logo */}
            {job.company?.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>
            )}

            {/* Job Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.title}</h1>
                  <div className="flex items-center gap-2 text-lg text-muted-foreground mb-4">
                    {job.company?.name && (
                      <>
                        <Building2 className="w-5 h-5" />
                        <Link
                          to={`/companies/${job.company.id}`}
                          className="hover:text-primary"
                        >
                          {job.company.name}
                        </Link>
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

              {/* Job Meta */}
              <div className="flex flex-wrap gap-4 text-sm mb-6">
                {job.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.jobType && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{jobTypeLabels[job.jobType] || job.jobType}</span>
                  </div>
                )}
                {(job.salaryMin || job.salaryMax) && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                    </span>
                  </div>
                )}
                {deadlineDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Hạn nộp: {deadlineDate}</span>
                  </div>
                )}
                {job.numberOfPositions && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{job.numberOfPositions} vị trí</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {isApplicant && (
                  <Button
                    size="lg"
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login');
                        return;
                      }
                      setShowApplyModal(true);
                    }}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Ứng tuyển ngay
                  </Button>
                )}
                {isApplicant && (
                  <Button
                    variant={job.isSaved ? 'default' : 'outline'}
                    size="lg"
                    onClick={handleSaveToggle}
                    disabled={saveMutation.isPending || unsaveMutation.isPending}
                  >
                    {job.isSaved ? (
                      <>
                        <BookmarkCheck className="w-5 h-5 mr-2" />
                        Đã lưu
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-5 h-5 mr-2" />
                        Lưu việc làm
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tabs */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b mb-6">
              <div className="flex gap-4 overflow-x-auto">
                {[
                  { id: 'description', label: 'Mô tả', icon: FileText },
                  { id: 'requirements', label: 'Yêu cầu', icon: Award },
                  { id: 'benefits', label: 'Phúc lợi', icon: User },
                  { id: 'company', label: 'Công ty', icon: Building2 },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as TabType)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap',
                      activeTab === id
                        ? 'border-primary text-primary font-medium'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="prose max-w-none">
              {activeTab === 'description' && (
                <div
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: job.description || '<p>Chưa có mô tả chi tiết.</p>',
                  }}
                />
              )}

              {activeTab === 'requirements' && (
                <div
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: job.requirements || '<p>Chưa có thông tin yêu cầu.</p>',
                  }}
                />
              )}

              {activeTab === 'benefits' && (
                <div
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: job.benefits || '<p>Chưa có thông tin phúc lợi.</p>',
                  }}
                />
              )}

              {activeTab === 'company' && job.company && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Về công ty</h3>
                    <p className="text-muted-foreground">
                      {job.company.description || 'Chưa có mô tả về công ty.'}
                    </p>
                  </div>
                  {job.company.industry && (
                    <div>
                      <h4 className="font-medium mb-1">Ngành nghề</h4>
                      <p className="text-muted-foreground">{job.company.industry}</p>
                    </div>
                  )}
                  {job.company.address && (
                    <div>
                      <h4 className="font-medium mb-1">Địa chỉ</h4>
                      <p className="text-muted-foreground">{job.company.address}</p>
                    </div>
                  )}
                  {job.company.website && (
                    <div>
                      <h4 className="font-medium mb-1">Website</h4>
                      <a
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {job.company.website}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Job Summary */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Thông tin tóm tắt</h3>
              <div className="space-y-3 text-sm">
                {job.experienceRequired && (
                  <div>
                    <span className="text-muted-foreground">Kinh nghiệm:</span>
                    <p className="font-medium">{job.experienceRequired}</p>
                  </div>
                )}
                {job.educationRequired && (
                  <div>
                    <span className="text-muted-foreground">Học vấn:</span>
                    <p className="font-medium">{job.educationRequired}</p>
                  </div>
                )}
                {job.skillsRequired && (
                  <div>
                    <span className="text-muted-foreground">Kỹ năng:</span>
                    <p className="font-medium">{job.skillsRequired}</p>
                  </div>
                )}
                {formattedDate && (
                  <div>
                    <span className="text-muted-foreground">Đăng ngày:</span>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                )}
                {job.viewsCount !== undefined && job.viewsCount !== null && (
                  <div>
                    <span className="text-muted-foreground">Lượt xem:</span>
                    <p className="font-medium">{job.viewsCount.toLocaleString('vi-VN')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Company Info */}
            {job.company && (
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Thông tin công ty</h3>
                <div className="space-y-3 text-sm">
                  {job.company.employeeCount !== undefined && job.company.employeeCount !== null && (
                    <div>
                      <span className="text-muted-foreground">Nhân viên:</span>
                      <p className="font-medium">
                        {job.company.employeeCount.toLocaleString('vi-VN')}
                      </p>
                    </div>
                  )}
                  {job.company.activeJobsCount !== undefined && (
                    <div>
                      <span className="text-muted-foreground">Việc làm đang tuyển:</span>
                      <p className="font-medium">{job.company.activeJobsCount}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Jobs */}
        {similarJobs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Việc làm tương tự</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarJobs.map((similarJob) => (
                <JobCard key={similarJob.id} job={similarJob} />
              ))}
            </div>
          </div>
        )}

        {/* Apply Modal */}
        <ApplyJobModal
          jobId={jobId}
          jobTitle={job.title}
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
        />
      </div>
    </PublicLayout>
  );
}

