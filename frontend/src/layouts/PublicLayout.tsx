import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Tuyển Dụng System
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link to="/jobs" className="hover:text-primary">
              Việc làm
            </Link>
            <Link to="/companies" className="hover:text-primary">
              Công ty
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'APPLICANT' && (
                  <Link to="/applicant/dashboard">
                    <Button variant="ghost">Ứng viên</Button>
                  </Link>
                )}
                {user?.role === 'EMPLOYER' && (
                  <Link to="/employer/dashboard">
                    <Button variant="ghost">Nhà tuyển dụng</Button>
                  </Link>
                )}
                {user?.role === 'ADMIN' && (
                  <Link to="/admin/dashboard">
                    <Button variant="ghost">Quản trị viên</Button>
                  </Link>
                )}
                <Button onClick={logout} variant="ghost">
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Đăng nhập</Button>
                </Link>
                <Link to="/register">
                  <Button>Đăng ký</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

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

