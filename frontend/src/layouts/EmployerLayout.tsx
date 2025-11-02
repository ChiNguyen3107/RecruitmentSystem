import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users,
  Calendar,
  Building2,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';

export function EmployerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/employer/dashboard' },
    { icon: Briefcase, label: 'Tin tuyển dụng', path: '/employer/jobs' },
    { icon: Users, label: 'Đơn ứng tuyển', path: '/employer/applications' },
    { icon: Calendar, label: 'Lịch phỏng vấn', path: '/employer/interviews' },
    { icon: Building2, label: 'Công ty', path: '/employer/company' },
    { icon: Bell, label: 'Thông báo', path: '/employer/notifications' },
    { icon: Settings, label: 'Cài đặt', path: '/employer/settings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 w-64 h-full border-r bg-card">
        <div className="p-4">
          <Link to="/employer/dashboard" className="flex items-center gap-2 mb-8">
            <h1 className="text-xl font-bold text-primary">Employer Portal</h1>
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
        <header className="sticky top-0 z-10 border-b bg-background">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">
                Xin chào, {user?.firstName} {user?.lastName}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/jobs">
                <Button variant="outline">Xem việc làm</Button>
              </Link>
              <Button onClick={handleLogout} variant="ghost" size="icon">
                <LogOut className="w-5 h-5" />
              </Button>
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

