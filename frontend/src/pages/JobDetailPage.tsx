import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { SimilarJobCard } from '@/components/job/SimilarJobCard';
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
  Share2,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Copy,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
    >
      <div
        className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between z-10">
          <h2 id="apply-modal-title" className="text-xl font-bold">Ứng tuyển: {jobTitle}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Đóng modal">
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
                <label className="block text-sm font-medium mb-2" htmlFor="resume-file">
                  Chọn file CV (PDF, DOC, DOCX - tối đa 5MB)
                </label>
                <input
                  id="resume-file"
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
                <label className="block text-sm font-medium mb-2" htmlFor="resume-url">
                  URL CV (nếu CV đã được lưu trữ online)
                </label>
                <input
                  id="resume-url"
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
            <label className="block text-sm font-medium mb-2" htmlFor="cover-letter">
              Thư xin việc (tùy chọn)
            </label>
            <textarea
              id="cover-letter"
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

// Share functionality
function shareToLinkedIn(jobTitle: string, jobUrl: string) {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
  window.open(url, '_blank', 'width=600,height=600');
}

function shareToFacebook(jobUrl: string) {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`;
  window.open(url, '_blank', 'width=600,height=600');
}

async function copyToClipboard(text: string, toast: any) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Đã sao chép link vào clipboard!', 'Thành công');
  } catch (err) {
    toast.error('Không thể sao chép link', 'Lỗi');
  }
}

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [showApplyModal, setShowApplyModal] = useState(false);

  const jobId = id ? parseInt(id, 10) : 0;
  const currentUrl = window.location.href;

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
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (job?.isSaved) {
      unsaveMutation.mutate();
    } else {
      saveMutation.mutate();
    }
  };

  // SEO: Update document title
  useEffect(() => {
    if (job) {
      document.title = `${job.title} - ${job.company?.name || 'Công ty'} | Hệ thống tuyển dụng`;
    }
    return () => {
      document.title = 'Hệ thống tuyển dụng';
    };
  }, [job]);

  // Calculate deadline status
  const getDeadlineStatus = (deadline?: string) => {
    if (!deadline) return null;
    const daysLeft = differenceInDays(new Date(deadline), new Date());
    if (daysLeft < 0) return 'expired';
    if (daysLeft <= 7) return 'warning';
    return 'normal';
  };

  const deadlineStatus = getDeadlineStatus(job?.applicationDeadline);

  // Loading state with enhanced skeleton
  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="bg-card border rounded-lg p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="w-24 h-24 rounded-lg" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
            <div className="space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
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

  // Check if job is expired or user already applied
  const isExpired = deadlineStatus === 'expired';
  const hasApplied = job.canApply === false; // Assuming backend sets this

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Job Header */}
        <div className="bg-card border rounded-lg p-6 md:p-8 mb-6 animate-fade-in-up">
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
                          className="hover:text-primary transition-colors"
                        >
                          {job.company.name}
                        </Link>
                        {job.company.isVerified && (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Đã xác thực
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {hasApplied && (
                  <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Đã ứng tuyển
                  </span>
                )}
                {isExpired && (
                  <span className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Đã hết hạn
                  </span>
                )}
                {deadlineStatus === 'warning' && !isExpired && (
                  <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Sắp hết hạn
                  </span>
                )}
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
                    disabled={isExpired || hasApplied}
                    aria-label={isExpired ? 'Công việc đã hết hạn' : hasApplied ? 'Bạn đã ứng tuyển' : 'Ứng tuyển ngay'}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {hasApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
                  </Button>
                )}
                {isApplicant && (
                  <Button
                    variant={job.isSaved ? 'default' : 'outline'}
                    size="lg"
                    onClick={handleSaveToggle}
                    disabled={saveMutation.isPending || unsaveMutation.isPending}
                    aria-label={job.isSaved ? 'Bỏ lưu việc làm' : 'Lưu việc làm'}
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

        {/* Main Content - 70/30 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
          {/* Left Column - Main Content */}
          <div className="animate-fade-in-up animation-delay-100">
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
                    aria-label={`Xem ${label.toLowerCase()}`}
                    aria-current={activeTab === id ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content with animations */}
            <div className="prose max-w-none animate-scale-in" key={activeTab}>
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
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {job.company.website}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar (Sticky) */}
          <div className="space-y-6 lg:sticky lg:top-4 lg:self-start animate-fade-in-up animation-delay-200">
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

            {/* Share Section */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Chia sẻ việc làm
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => shareToLinkedIn(job.title, currentUrl)}
                  aria-label="Chia sẻ lên LinkedIn"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => shareToFacebook(currentUrl)}
                  aria-label="Chia sẻ lên Facebook"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => copyToClipboard(currentUrl, toast)}
                  aria-label="Sao chép link"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Sao chép link
                </Button>
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
                  <Link to={`/companies/${job.company.id}`}>
                    <Button variant="outline" className="w-full mt-2">
                      <Building2 className="w-4 h-4 mr-2" />
                      Xem trang công ty
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Jobs */}
        {similarJobs.length > 0 && (
          <div className="mt-12 animate-fade-in-up animation-delay-300">
            <h2 className="text-2xl font-bold mb-6">Việc làm tương tự</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarJobs.map((similarJob) => (
                <SimilarJobCard key={similarJob.id} job={similarJob} />
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
