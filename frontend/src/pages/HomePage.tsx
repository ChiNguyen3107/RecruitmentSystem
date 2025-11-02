import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Search, Briefcase, Building2, TrendingUp } from 'lucide-react';

export function HomePage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Tìm việc làm mơ ước của bạn ngay hôm nay
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Kết nối hàng ngàn cơ hội việc làm từ các công ty hàng đầu
            </p>
            
            {/* Search Bar */}
            <div className="flex gap-2 max-w-2xl mx-auto mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm việc làm, kỹ năng, công ty..."
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button size="lg">Tìm kiếm</Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg border">
                <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                <div className="text-muted-foreground">Việc làm đang tuyển</div>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Công ty đối tác</div>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
                <div className="text-muted-foreground">Ứng viên</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Tại sao chọn chúng tôi?</h2>
          <p className="text-muted-foreground">Trải nghiệm tuyển dụng tốt nhất</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu?</h2>
          <p className="text-xl mb-8 opacity-90">
            Tham gia ngàn ứng viên đang tìm kiếm cơ hội mới
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Đăng ký tìm việc
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                Xem việc làm
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

