import { Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">Về chúng tôi</h3>
              <p className="text-muted-foreground">
                Hệ thống tuyển dụng hàng đầu, kết nối ứng viên và nhà tuyển dụng.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Liên kết nhanh</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/jobs" className="hover:text-primary">Tìm việc làm</Link></li>
                <li><Link to="/companies" className="hover:text-primary">Công ty</Link></li>
                <li><Link to="/about" className="hover:text-primary">Giới thiệu</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Liên hệ</h3>
              <p className="text-muted-foreground">
                Email: support@tuyendung.com<br />
                Hotline: 1900-xxxx
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            © 2025 Tuyển Dụng System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

