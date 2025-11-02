import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PublicLayout } from '@/layouts/PublicLayout';
import { JobCard } from '@/components/home/JobCard';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { FilterBar } from '@/components/common/FilterBar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SearchBar } from '@/components/home/SearchBar';
import { Briefcase, SlidersHorizontal } from 'lucide-react';
import { jobService } from '@/services/api';
import type { JobType, ExperienceLevel, WorkMode, CompanySize } from '@/services/api';

// Danh sách loại hình công việc
const jobTypeOptions: { value: JobType; label: string }[] = [
  { value: 'FULL_TIME', label: 'Toàn thời gian' },
  { value: 'PART_TIME', label: 'Bán thời gian' },
  { value: 'CONTRACT', label: 'Hợp đồng' },
  { value: 'INTERNSHIP', label: 'Thực tập' },
  { value: 'FREELANCE', label: 'Tự do' },
];

// Danh sách cấp độ kinh nghiệm
const experienceLevelOptions: { value: ExperienceLevel; label: string }[] = [
  { value: 'INTERN', label: 'Thực tập' },
  { value: 'JUNIOR', label: 'Mới ra trường' },
  { value: 'MID', label: 'Trung cấp (2-5 năm)' },
  { value: 'SENIOR', label: 'Cao cấp (5+ năm)' },
  { value: 'LEAD', label: 'Quản lý/Lãnh đạo' },
];

// Danh sách chế độ làm việc
const workModeOptions: { value: WorkMode; label: string }[] = [
  { value: 'REMOTE', label: 'Làm việc từ xa' },
  { value: 'ONSITE', label: 'Tại văn phòng' },
  { value: 'HYBRID', label: 'Kết hợp' },
];

// Danh sách quy mô công ty
const companySizeOptions: { value: CompanySize; label: string }[] = [
  { value: 'STARTUP', label: 'Khởi nghiệp (< 10)' },
  { value: 'SMALL', label: 'Nhỏ (10-50)' },
  { value: 'MEDIUM', label: 'Vừa (51-200)' },
  { value: 'LARGE', label: 'Lớn (201-1000)' },
  { value: 'ENTERPRISE', label: 'Quy mô lớn (1000+)' },
];

// Danh sách mức lương
const salaryRangeOptions = [
  { value: '0-5000000', label: 'Dưới 5 triệu' },
  { value: '5000000-10000000', label: '5 - 10 triệu' },
  { value: '10000000-20000000', label: '10 - 20 triệu' },
  { value: '20000000-30000000', label: '20 - 30 triệu' },
  { value: '30000000-50000000', label: '30 - 50 triệu' },
  { value: '50000000-', label: 'Trên 50 triệu' },
];

// Danh sách thời gian đăng tin
const postedWithinOptions = [
  { value: 1, label: 'Hôm nay' },
  { value: 7, label: '7 ngày qua' },
  { value: 30, label: '30 ngày qua' },
  { value: 60, label: '60 ngày qua' },
];

export function SearchJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Đọc params từ URL
  const keyword = searchParams.get('keyword') || '';
  const location = searchParams.get('location') || '';
  const jobType = searchParams.get('jobType') as JobType | null;
  const experienceLevel = searchParams.get('experienceLevel') as ExperienceLevel | null;
  const workMode = searchParams.get('workMode') as WorkMode | null;
  const companySize = searchParams.get('companySize') as CompanySize | null;
  const salaryRange = searchParams.get('salaryRange') || '';
  const postedWithin = searchParams.get('postedWithin');
  const page = Number(searchParams.get('page')) || 1;
  const size = 12;

  // Extract minSalary từ salaryRange
  const minSalary = useMemo(() => {
    if (!salaryRange) return undefined;
    const parts = salaryRange.split('-');
    return parts[0] ? parseInt(parts[0]) : undefined;
  }, [salaryRange]);

  // Query params cho API
  const queryParams = useMemo(
    () => ({
      keyword: keyword || undefined,
      location: location || undefined,
      jobType: jobType || undefined,
      experienceLevel: experienceLevel || undefined,
      workMode: workMode || undefined,
      companySize: companySize || undefined,
      minSalary: minSalary,
      salaryRange: salaryRange || undefined,
      postedWithin: postedWithin ? parseInt(postedWithin) : undefined,
      page: page - 1, // Backend dùng 0-based
      size,
    }),
    [keyword, location, jobType, experienceLevel, workMode, companySize, minSalary, salaryRange, postedWithin, page, size]
  );

  // Fetch jobs
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', 'search', queryParams],
    queryFn: () => jobService.searchJobs(queryParams),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Update URL khi params thay đổi
  const updateURL = (updates: Record<string, string | number | undefined>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    // Reset về trang 1 khi filter thay đổi
    if (!updates.page) {
      newParams.set('page', '1');
    }

    setSearchParams(newParams);
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | undefined) => {
    updateURL({ [key]: value });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = useMemo(() => {
    return !!(jobType || experienceLevel || workMode || companySize || salaryRange || postedWithin);
  }, [jobType, experienceLevel, workMode, companySize, salaryRange, postedWithin]);

  const totalResults = data?.totalElements || 0;

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Tìm việc làm</h1>
          <p className="text-muted-foreground mb-4">
            Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl">
            <SearchBar 
              defaultKeyword={keyword} 
              defaultLocation={location}
              size="default"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Quick filters */}
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Bộ lọc nâng cao
            </Button>
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="border rounded-lg p-6 bg-card space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Job Type */}
                <div>
                  <Label className="mb-2 block">Loại hình công việc</Label>
                  <Select value={jobType || 'all'} onValueChange={(value) => handleFilterChange('jobType', value === 'all' ? undefined : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {jobTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Level */}
                <div>
                  <Label className="mb-2 block">Cấp độ kinh nghiệm</Label>
                  <Select value={experienceLevel || 'all'} onValueChange={(value) => handleFilterChange('experienceLevel', value === 'all' ? undefined : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {experienceLevelOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Work Mode */}
                <div>
                  <Label className="mb-2 block">Chế độ làm việc</Label>
                  <Select value={workMode || 'all'} onValueChange={(value) => handleFilterChange('workMode', value === 'all' ? undefined : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {workModeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Company Size */}
                <div>
                  <Label className="mb-2 block">Quy mô công ty</Label>
                  <Select value={companySize || 'all'} onValueChange={(value) => handleFilterChange('companySize', value === 'all' ? undefined : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {companySizeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Salary Range */}
                <div>
                  <Label className="mb-2 block">Mức lương</Label>
                  <Select value={salaryRange || 'all'} onValueChange={(value) => handleFilterChange('salaryRange', value === 'all' ? undefined : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {salaryRangeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Posted Within */}
                <div>
                  <Label className="mb-2 block">Thời gian đăng tin</Label>
                  <Select value={postedWithin || 'all'} onValueChange={(value) => handleFilterChange('postedWithin', value === 'all' ? undefined : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {postedWithinOptions.map((opt) => (
                        <SelectItem key={opt.value} value={String(opt.value)}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <div className="flex justify-end pt-2 border-t">
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Xóa tất cả bộ lọc
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Active filters bar */}
          {hasActiveFilters && (
            <FilterBar onClear={clearFilters}>
              {jobType && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  Loại: {jobTypeOptions.find(o => o.value === jobType)?.label}
                </span>
              )}
              {experienceLevel && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  Kinh nghiệm: {experienceLevelOptions.find(o => o.value === experienceLevel)?.label}
                </span>
              )}
              {workMode && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  Chế độ: {workModeOptions.find(o => o.value === workMode)?.label}
                </span>
              )}
              {companySize && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  Quy mô: {companySizeOptions.find(o => o.value === companySize)?.label}
                </span>
              )}
              {salaryRange && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  Lương: {salaryRangeOptions.find(o => o.value === salaryRange)?.label}
                </span>
              )}
              {postedWithin && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  Đăng trong {postedWithinOptions.find(o => o.value === parseInt(postedWithin))?.label}
                </span>
              )}
            </FilterBar>
          )}
        </div>

        {/* Results count */}
        {!isLoading && (
          <div className="mb-4 text-sm text-muted-foreground">
            Tìm thấy <span className="font-semibold text-foreground">{totalResults.toLocaleString('vi-VN')}</span> việc làm
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <EmptyState
            icon={Briefcase}
            title="Không thể tải danh sách việc làm"
            description="Vui lòng thử lại sau"
          />
        )}

        {/* Results */}
        {!isLoading && !error && data && data.content.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.content.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={(newPage) => updateURL({ page: newPage })}
              />
            )}
          </>
        )}

        {/* Empty state */}
        {!isLoading && !error && data && data.content.length === 0 && (
          <EmptyState
            icon={Briefcase}
            title="Không tìm thấy việc làm phù hợp"
            description="Hãy thử điều chỉnh bộ lọc của bạn để tìm kiếm tốt hơn"
          />
        )}
      </div>
    </PublicLayout>
  );
}

