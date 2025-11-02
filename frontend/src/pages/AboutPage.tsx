import { PublicLayout } from '@/layouts/PublicLayout';
import { Briefcase, Target, Users, Award, Heart, TrendingUp, Shield, Clock } from 'lucide-react';

export function AboutPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Giới thiệu về chúng tôi</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nền tảng tuyển dụng số 1 Việt Nam, kết nối hàng nghìn nhà tuyển dụng với ứng viên tài năng
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Sứ mệnh của chúng tôi</h2>
              <p className="text-lg text-muted-foreground">
                Tạo ra một nền tảng tuyển dụng hiện đại, minh bạch và hiệu quả,
                giúp các công ty tìm được nhân tài phù hợp và ứng viên tìm được cơ hội phát triển sự nghiệp
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chuyên nghiệp</h3>
              <p className="text-muted-foreground">
                Chúng tôi cam kết cung cấp dịch vụ chuyên nghiệp và chất lượng cao
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Đồng cảm</h3>
              <p className="text-muted-foreground">
                Thấu hiểu nhu cầu và mong muốn của cả nhà tuyển dụng và ứng viên
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Đổi mới</h3>
              <p className="text-muted-foreground">
                Không ngừng cải tiến và áp dụng công nghệ mới nhất trong tuyển dụng
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Minh bạch</h3>
              <p className="text-muted-foreground">
                Đảm bảo quy trình tuyển dụng minh bạch và công bằng cho mọi người
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-2xl p-8 md:p-12 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Việc làm đang tuyển</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Công ty đối tác</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-muted-foreground">Ứng viên</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Tỷ lệ hài lòng</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Vì sao chọn chúng tôi?</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-start gap-6 p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Đa dạng việc làm</h3>
                <p className="text-muted-foreground">
                  Hàng nghìn cơ hội việc làm từ nhiều ngành nghề khác nhau, từ IT, Marketing,
                  Tài chính đến Y tế, Giáo dục và nhiều lĩnh vực khác
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Công ty uy tín</h3>
                <p className="text-muted-foreground">
                  Đối tác của chúng tôi là những công ty hàng đầu, có danh tiếng tốt trong ngành
                  và chế độ đãi ngộ hấp dẫn
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Quy trình nhanh chóng</h3>
                <p className="text-muted-foreground">
                  Ứng tuyển đơn giản, nhanh chóng với công nghệ hiện đại giúp bạn tiết kiệm thời gian
                  và tăng cơ hội được lựa chọn
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Phát triển sự nghiệp</h3>
                <p className="text-muted-foreground">
                  Không chỉ tìm việc, chúng tôi còn hỗ trợ bạn phát triển kỹ năng và thăng tiến trong sự nghiệp
                  thông qua các khóa học và tài nguyên miễn phí
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-primary text-primary-foreground rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu?</h2>
          <p className="text-lg mb-8 opacity-90">
            Tham gia cùng hàng ngàn ứng viên và nhà tuyển dụng đang phát triển sự nghiệp
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register">
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Đăng ký ngay
              </button>
            </a>
            <a href="/jobs">
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Tìm việc ngay
              </button>
            </a>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

