import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { PublicLayout } from '@/layouts/PublicLayout';
import { SearchBar } from '@/components/home/SearchBar';
import { JobCard } from '@/components/home/JobCard';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Briefcase, Building2, TrendingUp, ArrowRight, FileText } from 'lucide-react';
import { jobService } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

export function HomePage() {
  const { isAuthenticated, user } = useAuthStore();

  // Fetch latest jobs
  const {
    data: latestJobsData,
    isLoading: isLoadingJobs,
    error: jobsError,
  } = useQuery({
    queryKey: ['latestJobs', 0, 6],
    queryFn: () => jobService.getLatestJobs(0, 6),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Featured companies section đã được loại bỏ vì backend không có endpoint GET /api/companies
  // Khi backend hỗ trợ endpoint này, có thể uncomment và sử dụng lại
  // const {
  //   data: featuredCompaniesData,
  //   isLoading: isLoadingCompanies,
  //   error: companiesError,
  // } = useQuery({
  //   queryKey: ['featuredCompanies'],
  //   queryFn: () => companyService.getCompanies({ featured: true, size: 6 }),
  //   staleTime: 10 * 60 * 1000,
  //   retry: false,
  //   refetchOnWindowFocus: false,
  // });

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Tìm việc làm mơ ước của bạn ngay hôm nay
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12">
              Kết nối hàng ngàn cơ hội việc làm từ các công ty hàng đầu
            </p>
            
            {/* Search Bar */}
            <div className="mb-8 md:mb-12">
              <SearchBar size="lg" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
              <div className="bg-card p-4 md:p-6 rounded-lg border">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  {latestJobsData?.totalElements?.toLocaleString('vi-VN') || '10,000+'}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">Việc làm đang tuyển</div>
              </div>
              <div className="bg-card p-4 md:p-6 rounded-lg border">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm md:text-base text-muted-foreground">Công ty đối tác</div>
              </div>
              <div className="bg-card p-4 md:p-6 rounded-lg border">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">50,000+</div>
                <div className="text-sm md:text-base text-muted-foreground">Ứng viên</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="py-12 md:py-20 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Việc làm mới nhất</h2>
            <p className="text-muted-foreground">Khám phá những cơ hội việc làm mới nhất</p>
          </div>
          <Link to="/jobs">
            <Button variant="ghost" className="hidden md:flex">
              Xem tất cả
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {isLoadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : jobsError ? (
          <EmptyState
            icon={Briefcase}
            title="Không thể tải danh sách việc làm"
            description="Vui lòng thử lại sau"
          />
        ) : latestJobsData && latestJobsData.content.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {latestJobsData.content.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <div className="text-center md:hidden">
              <Link to="/jobs">
                <Button variant="outline" className="w-full md:w-auto">
                  Xem tất cả việc làm
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <EmptyState
            icon={Briefcase}
            title="Chưa có việc làm nào"
            description="Hãy quay lại sau để xem các cơ hội việc làm mới"
          />
        )}
      </section>

      {/* Featured Companies Section - DISABLED vì backend không có endpoint GET /api/companies */}
      {/* Khi backend hỗ trợ endpoint này, có thể uncomment và sử dụng lại */}
      {/* 
      {featuredCompaniesData && featuredCompaniesData.content.length > 0 && (
        <section className="py-12 md:py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Công ty nổi bật</h2>
                <p className="text-muted-foreground">Những công ty hàng đầu đang tuyển dụng</p>
              </div>
              <Link to="/companies">
                <Button variant="ghost" className="hidden md:flex">
                  Xem tất cả
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {featuredCompaniesData.content.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </div>
        </section>
      )}
      */}

      {/* Features Section */}
      <section className="py-12 md:py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Tại sao chọn chúng tôi?</h2>
          <p className="text-muted-foreground">Trải nghiệm tuyển dụng tốt nhất</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Việc làm đa dạng</h3>
            <p className="text-muted-foreground">
              Hàng nghìn cơ hội việc làm từ nhiều ngành nghề khác nhau
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Công ty uy tín</h3>
            <p className="text-muted-foreground">
              Đối tác là những công ty hàng đầu, đáng tin cậy
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Phát triển sự nghiệp</h3>
            <p className="text-muted-foreground">
              Cơ hội thăng tiến và phát triển nghề nghiệp lâu dài
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Sẵn sàng bắt đầu?</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            {isAuthenticated
              ? user?.role === 'EMPLOYER'
                ? 'Đăng tin tuyển dụng để tìm ứng viên phù hợp'
                : 'Tìm kiếm cơ hội việc làm mới nhất ngay hôm nay'
              : 'Tham gia ngàn ứng viên đang tìm kiếm cơ hội mới'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link to="/register">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    <FileText className="mr-2 w-4 h-4" />
                    Đăng ký tìm việc
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10">
                    Tìm việc ngay
                  </Button>
                </Link>
              </>
            ) : user?.role === 'EMPLOYER' ? (
              <Link to="/employer/jobs/create">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <FileText className="mr-2 w-4 h-4" />
                  Đăng tin tuyển dụng
                </Button>
              </Link>
            ) : (
              <Link to="/jobs">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Tìm việc ngay
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
