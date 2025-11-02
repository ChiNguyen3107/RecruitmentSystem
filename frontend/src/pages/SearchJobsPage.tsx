import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PublicLayout } from '@/layouts/PublicLayout';
import { JobCard } from '@/components/home/JobCard';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { SearchBar } from '@/components/home/SearchBar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Briefcase,
  SlidersHorizontal 
} from 'lucide-react';
import { jobService } from '@/services/api';
import type { JobType, ExperienceLevel, WorkMode, CompanySize } from '@/services/api';

type SortOption = 'latest' | 'salary_desc' | 'deadline';

const jobTypeOptions: { value: JobType; label: string }[] = [
  { value: 'FULL_TIME', label: 'Toàn thời gian' },
  { value: 'PART_TIME', label: 'Bán thời gian' },
  { value: 'CONTRACT', label: 'Hợp đồng' },
  { value: 'INTERNSHIP', label: 'Thực tập' },
  { value: 'FREELANCE', label: 'Tự do' },
];

const experienceOptions: { value: ExperienceLevel; label: string }[] = [
  { value: 'INTERN', label: 'Thực tập sinh' },
  { value: 'JUNIOR', label: 'Mới tốt nghiệp' },
  { value: 'MID', label: '1-3 năm kinh nghiệm' },
  { value: 'SENIOR', label: '3-5 năm kinh nghiệm' },
  { value: 'LEAD', label: '5+ năm kinh nghiệm' },
];

const workModeOptions: { value: WorkMode; label: string }[] = [
  { value: 'REMOTE', label: 'Làm việc từ xa' },
  { value: 'ONSITE', label: 'Làm việc tại văn phòng' },
  { value: 'HYBRID', label: 'Làm việc kết hợp' },
];

const companySizeOptions: { value: CompanySize; label: string }[] = [
  { value: 'STARTUP', label: 'Khởi nghiệp (< 10)' },
  { value: 'SMALL', label: 'Nhỏ (10-50)' },
  { value: 'MEDIUM', label: 'Vừa (51-200)' },
  { value: 'LARGE', label: 'Lớn (201-1000)' },
  { value: 'ENTERPRISE', label: 'Quy mô lớn (1000+)' },
];

const postedWithinOptions = [
  { value: 7, label: '7 ngày qua' },
  { value: 14, label: '14 ngày qua' },
  { value: 30, label: '30 ngày qua' },
  { value: 90, label: '90 ngày qua' },
];

const salaryRanges = [
  { value: '0-10000000', label: 'Dưới 10 triệu' },
  { value: '10000000-20000000', label: '10-20 triệu' },
  { value: '20000000-30000000', label: '20-30 triệu' },
  { value: '30000000-50000000', label: '30-50 triệu' },
  { value: '50000000-100000000', label: '50-100 triệu' },
  { value: '100000000-999999999', label: 'Trên 100 triệu' },
];

const sortOptions: { value: SortOption; sortBy: string; sortDir: string; label: string }[] = [
  { value: 'latest', sortBy: 'createdAt', sortDir: 'DESC', label: 'Mới nhất' },
  { value: 'salary_desc', sortBy: 'salaryMax', sortDir: 'DESC', label: 'Lương cao nhất' },
  { value: 'deadline', sortBy: 'applicationDeadline', sortDir: 'ASC', label: 'Hạn nộp gần nhất' },
];

export function SearchJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Đọc params từ URL
  const keyword = searchParams.get('keyword') || '';
  const location = searchParams.get('location') || '';
  const jobType = searchParams.get('jobType') as JobType | null;
  const salaryRange = searchParams.get('salaryRange') || '';
  const experience = searchParams.get('experience') as ExperienceLevel | null;
  const postedWithin = searchParams.get('postedWithin') ? Number(searchParams.get('postedWithin')) : undefined;
  const workMode = searchParams.get('workMode') as WorkMode | null;
  const companySize = searchParams.get('companySize') as CompanySize | null;
  const page = Number(searchParams.get('page')) || 1;
  const size = 12;
  const sort = (searchParams.get('sort') as SortOption) || 'latest';

  // Lấy sort config
  const sortConfig = sortOptions.find(opt => opt.value === sort) || sortOptions[0];

  // Query params cho API
  const queryParams = useMemo(() => ({
    keyword: keyword || undefined,
    location: location || undefined,
    jobType: jobType || undefined,
    salaryRange: salaryRange || undefined,
    experienceLevel: experience || undefined,
    postedWithin,
    workMode: workMode || undefined,
    companySize: companySize || undefined,
    page: page - 1, // Backend dùng 0-based
    size,
    sortBy: sortConfig.sortBy,
    sortDir: sortConfig.sortDir,
  }), [keyword, location, jobType, salaryRange, experience, postedWithin, workMode, companySize, page, size, sortConfig]);

  // Fetch jobs
  const { data, isLoading, error } = useQuery({
    queryKey: ['searchJobs', queryParams],
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

  const handleSortChange = (value: string) => {
    updateURL({ sort: value });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = useMemo(() => {
    return !!(jobType || salaryRange || experience || postedWithin || workMode || companySize);
  }, [jobType, salaryRange, experience, postedWithin, workMode, companySize]);

  const totalResults = data?.totalElements || 0;

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Tìm việc làm</h1>
          <SearchBar 
            defaultKeyword={keyword} 
            defaultLocation={location}
            size="default"
            onSearch={(kw, loc) => {
              updateURL({ keyword: kw, location: loc });
            }}
          />
        </div>

        {/* Filters & Sort */}
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

            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <Label htmlFor="sort" className="text-sm font-medium">Sắp xếp:</Label>
              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger id="sort" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="border rounded-lg p-6 bg-card space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Job Type */}
                <div>
                  <Label className="mb-2 block">Loại công việc</Label>
                  <Select 
                    value={jobType || 'all'} 
                    onValueChange={(value) => handleFilterChange('jobType', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {jobTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Level */}
                <div>
                  <Label className="mb-2 block">Kinh nghiệm</Label>
                  <Select 
                    value={experience || 'all'} 
                    onValueChange={(value) => handleFilterChange('experience', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {experienceOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Work Mode */}
                <div>
                  <Label className="mb-2 block">Hình thức làm việc</Label>
                  <Select 
                    value={workMode || 'all'} 
                    onValueChange={(value) => handleFilterChange('workMode', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {workModeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Posted Within */}
                <div>
                  <Label className="mb-2 block">Đăng trong</Label>
                  <Select 
                    value={postedWithin?.toString() || 'all'} 
                    onValueChange={(value) => handleFilterChange('postedWithin', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả thời gian</SelectItem>
                      {postedWithinOptions.map(option => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Salary Range */}
                <div>
                  <Label className="mb-2 block">Khoảng lương</Label>
                  <Select 
                    value={salaryRange || 'all'} 
                    onValueChange={(value) => handleFilterChange('salaryRange', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {salaryRanges.map(range => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Company Size */}
                <div>
                  <Label className="mb-2 block">Quy mô công ty</Label>
                  <Select 
                    value={companySize || 'all'} 
                    onValueChange={(value) => handleFilterChange('companySize', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {companySizeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
        </div>

        {/* Results count */}
        {!isLoading && (
          <div className="mb-4 text-sm text-muted-foreground">
            Tìm thấy <span className="font-semibold text-foreground">{totalResults.toLocaleString('vi-VN')}</span> việc làm phù hợp
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

