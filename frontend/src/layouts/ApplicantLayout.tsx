import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  Calendar,
  Bookmark,
  Bell,
  Settings,
  LogOut,
  Home,
  Search,
  ChevronDown,
} from 'lucide-react';

export function ApplicantLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/applicant/dashboard' },
    { icon: User, label: 'Hồ sơ', path: '/applicant/profile' },
    { icon: Briefcase, label: 'Đơn ứng tuyển', path: '/applicant/applications' },
    { icon: Calendar, label: 'Lịch phỏng vấn', path: '/applicant/interviews' },
    { icon: Bookmark, label: 'Việc làm đã lưu', path: '/applicant/saved-jobs' },
    { icon: Bell, label: 'Thông báo', path: '/applicant/notifications' },
    { icon: Settings, label: 'Cài đặt', path: '/applicant/settings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 w-64 h-full border-r bg-card">
        <div className="p-4">
          <Link to="/applicant/dashboard" className="flex items-center gap-2 mb-8">
            <h1 className="text-xl font-bold text-primary">Applicant Portal</h1>
          </Link>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">
                Xin chào, <span className="text-primary">{user?.firstName} {user?.lastName}</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Trang chủ
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Tìm việc làm
                </Button>
              </Link>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover shadow-lg z-50">
                      <div className="p-2">
                        <div className="px-3 py-2 border-b">
                          <p className="text-sm font-semibold">{user?.fullName}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/applicant/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Hồ sơ
                          </Link>
                          <Link
                            to="/applicant/settings"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Cài đặt
                          </Link>
                        </div>
                        <div className="border-t pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 text-destructive w-full transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

