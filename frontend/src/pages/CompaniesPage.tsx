import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PublicLayout } from '@/layouts/PublicLayout';
import { CompanyCard } from '@/components/home/CompanyCard';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { FilterBar } from '@/components/common/FilterBar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Building2, MapPin, Users, SlidersHorizontal } from 'lucide-react';
import { companyService } from '@/services/api';
import type { CompanySize } from '@/services/api';

// Danh sách ngành nghề phổ biến (có thể lấy từ backend sau)
const industryOptions = [
  'Công nghệ thông tin',
  'Tài chính - Ngân hàng',
  'Bất động sản',
  'Y tế - Sức khỏe',
  'Giáo dục',
  'Bán lẻ',
  'Sản xuất',
  'Du lịch - Khách sạn',
  'Marketing - Quảng cáo',
  'Logistics',
];

// Danh sách thành phố (có thể lấy từ backend sau)
const cityOptions = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Nha Trang',
  'Vũng Tàu',
];

const companySizeOptions: { value: CompanySize; label: string }[] = [
  { value: 'STARTUP', label: 'Khởi nghiệp (< 10)' },
  { value: 'SMALL', label: 'Nhỏ (10-50)' },
  { value: 'MEDIUM', label: 'Vừa (51-200)' },
  { value: 'LARGE', label: 'Lớn (201-1000)' },
  { value: 'ENTERPRISE', label: 'Quy mô lớn (1000+)' },
];

export function CompaniesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Đọc params từ URL
  const keyword = searchParams.get('keyword') || '';
  const industry = searchParams.get('industry') || '';
  const city = searchParams.get('city') || '';
  const companySize = searchParams.get('companySize') as CompanySize | null;
  const isVerified = searchParams.get('isVerified') === 'true' ? true : undefined;
  const page = Number(searchParams.get('page')) || 1;
  const size = 12;

  // Query params cho API
  const queryParams = useMemo(
    () => ({
      keyword: keyword || undefined,
      industry: industry || undefined,
      city: city || undefined,
      companySize: companySize || undefined,
      isVerified,
      page: page - 1, // Backend dùng 0-based
      size,
    }),
    [keyword, industry, city, companySize, isVerified, page, size]
  );

  // Fetch companies
  const { data, isLoading, error } = useQuery({
    queryKey: ['companies', queryParams],
    queryFn: () => companyService.searchCompanies(queryParams),
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
    return !!(industry || city || companySize || isVerified !== undefined);
  }, [industry, city, companySize, isVerified]);

  const totalResults = data?.totalElements || 0;

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Danh sách công ty</h1>
          <p className="text-muted-foreground mb-4">
            Khám phá các công ty hàng đầu và cơ hội nghề nghiệp hấp dẫn
          </p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Industry */}
                <div>
                  <Label className="mb-2 block">Ngành nghề</Label>
                  <Select value={industry || 'all'} onValueChange={(value) => handleFilterChange('industry', value === 'all' ? undefined : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {industryOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div>
                  <Label className="mb-2 block">Thành phố</Label>
                  <Select value={city || 'all'} onValueChange={(value) => handleFilterChange('city', value === 'all' ? undefined : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {cityOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
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
                      {companySizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Verified */}
                <div>
                  <Label className="mb-2 block">Trạng thái xác thực</Label>
                  <Select
                    value={isVerified === true ? 'true' : isVerified === false ? 'false' : 'all'}
                    onValueChange={(value) =>
                      handleFilterChange('isVerified', value === 'all' ? undefined : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="true">Đã xác thực</SelectItem>
                      <SelectItem value="false">Chưa xác thực</SelectItem>
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
              {industry && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  Ngành: {industry}
                </span>
              )}
              {city && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  Thành phố: {city}
                </span>
              )}
              {companySize && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  Quy mô: {companySizeOptions.find((o) => o.value === companySize)?.label}
                </span>
              )}
              {isVerified !== undefined && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  {isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                </span>
              )}
            </FilterBar>
          )}
        </div>

        {/* Results count */}
        {!isLoading && (
          <div className="mb-4 text-sm text-muted-foreground">
            Tìm thấy <span className="font-semibold text-foreground">{totalResults.toLocaleString('vi-VN')}</span> công
            ty
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
            icon={Building2}
            title="Không thể tải danh sách công ty"
            description="Vui lòng thử lại sau"
          />
        )}

        {/* Results */}
        {!isLoading && !error && data && data.content.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.content.map((company) => (
                <CompanyCard key={company.id} company={company} />
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
            icon={Building2}
            title="Không tìm thấy công ty phù hợp"
            description="Hãy thử điều chỉnh bộ lọc của bạn để tìm kiếm tốt hơn"
          />
        )}
      </div>
    </PublicLayout>
  );
}

