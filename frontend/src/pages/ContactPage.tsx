import { useState } from 'react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1000);
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Liên hệ với chúng tôi</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin, chúng tôi sẽ phản hồi sớm nhất có thể
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-sm text-muted-foreground">Gửi email cho chúng tôi</p>
                </div>
              </div>
              <p className="text-primary">support@recruitsystem.com</p>
            </div>

            <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Điện thoại</h3>
                  <p className="text-sm text-muted-foreground">Gọi cho chúng tôi</p>
                </div>
              </div>
              <p className="text-primary">1900 1234</p>
              <p className="text-sm text-muted-foreground">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
            </div>

            <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Địa chỉ</h3>
                  <p className="text-sm text-muted-foreground">Văn phòng của chúng tôi</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                123 Đường ABC, Phường XYZ<br />
                Quận DEF, Thành phố Hồ Chí Minh
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Giờ làm việc</h3>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thứ 2 - Thứ 6</span>
                  <span className="font-medium">8:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thứ 7</span>
                  <span className="font-medium">8:00 - 12:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chủ nhật</span>
                  <span className="font-medium">Nghỉ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Gửi tin nhắn cho chúng tôi
              </h2>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Gửi thành công!</p>
                    <p className="text-sm text-green-700">Chúng tôi sẽ phản hồi bạn sớm nhất có thể.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Họ và tên *</Label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Chủ đề *</Label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="support">Hỗ trợ kỹ thuật</option>
                    <option value="job">Thông tin tuyển dụng</option>
                    <option value="partnership">Hợp tác</option>
                    <option value="feedback">Góp ý</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message">Tin nhắn *</Label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    * Trường bắt buộc
                  </p>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>Đang gửi...</>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Gửi tin nhắn
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Câu hỏi thường gặp</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">Làm thế nào để ứng tuyển?</h3>
              <p className="text-sm text-muted-foreground">
                Đơn giản! Tạo tài khoản, tìm việc phù hợp và nhấn nút "Ứng tuyển". 
                Bạn có thể theo dõi trạng thái đơn trong Dashboard của mình.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Quy trình tuyển dụng như thế nào?</h3>
              <p className="text-sm text-muted-foreground">
                Sau khi ứng tuyển, nhà tuyển dụng sẽ xem xét hồ sơ và liên hệ với bạn nếu phù hợp. 
                Bạn sẽ nhận được thông báo qua email và trong hệ thống.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Tôi có thể chỉnh sửa hồ sơ sau khi ứng tuyển?</h3>
              <p className="text-sm text-muted-foreground">
                Có, bạn có thể cập nhật hồ sơ bất cứ lúc nào trong phần "Hồ sơ của tôi". 
                Thông tin mới sẽ áp dụng cho các đơn ứng tuyển sau.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Làm sao để đăng tin tuyển dụng?</h3>
              <p className="text-sm text-muted-foreground">
                Đăng ký tài khoản Nhà tuyển dụng, cập nhật thông tin công ty và bắt đầu đăng tin. 
                Chúng tôi sẽ kiểm duyệt và kích hoạt tin của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

