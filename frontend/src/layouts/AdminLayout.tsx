import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LayoutDashboard, 
  Users, 
  Building2,
  Briefcase,
  Shield,
  LogOut
} from 'lucide-react';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Người dùng', path: '/admin/users' },
    { icon: Building2, label: 'Công ty', path: '/admin/companies' },
    { icon: Briefcase, label: 'Việc làm', path: '/admin/jobs' },
    { icon: Shield, label: 'Quyền', path: '/admin/roles' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 w-64 h-full border-r bg-card">
        <div className="p-4">
          <Link to="/admin/dashboard" className="flex items-center gap-2 mb-8">
            <h1 className="text-xl font-bold text-destructive">Admin Portal</h1>
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
                Admin: {user?.firstName} {user?.lastName}
              </h2>
            </div>
            <div className="flex items-center gap-4">
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

