import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Briefcase,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:inline-block">Recruit System</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                isActive('/')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              Trang chủ
            </Link>
            <Link
              to="/jobs"
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                location.pathname.startsWith('/jobs')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              Việc làm
            </Link>
            <Link
              to="/companies"
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                location.pathname.startsWith('/companies')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              Công ty
            </Link>
            <Link
              to="/about"
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                isActive('/about')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              Giới thiệu
            </Link>
            <Link
              to="/contact"
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                isActive('/contact')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              Liên hệ
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Quick Search */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/jobs')}
                  className="hidden sm:flex"
                  title="Tìm việc làm"
                >
                  <Search className="w-5 h-5" />
                </Button>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex relative"
                  title="Thông báo"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                      {user?.firstName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:block text-sm font-medium max-w-[120px] truncate">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <ChevronDown className="hidden lg:block w-4 h-4 text-muted-foreground" />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover shadow-lg z-50">
                        <div className="p-2">
                          <div className="px-3 py-2 border-b">
                            <p className="text-sm font-semibold truncate">
                              {user?.fullName || 'Người dùng'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user?.email}
                            </p>
                          </div>
                          <div className="py-1">
                            {user?.role === 'APPLICANT' && (
                              <Link
                                to="/applicant/dashboard"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                              >
                                <Home className="w-4 h-4" />
                                Dashboard
                              </Link>
                            )}
                            {user?.role === 'EMPLOYER' && (
                              <Link
                                to="/employer/dashboard"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                              >
                                <Home className="w-4 h-4" />
                                Dashboard
                              </Link>
                            )}
                            {user?.role === 'ADMIN' && (
                              <Link
                                to="/admin/dashboard"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                              >
                                <Home className="w-4 h-4" />
                                Dashboard
                              </Link>
                            )}
                            <Link
                              to="/jobs"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                            >
                              <Search className="w-4 h-4" />
                              Tìm việc làm
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

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </>
            ) : (
              <>
                <Link to="/jobs" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Tìm việc
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Đăng ký</Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive('/')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                Trang chủ
              </Link>
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  location.pathname.startsWith('/jobs')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                Việc làm
              </Link>
              <Link
                to="/companies"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  location.pathname.startsWith('/companies')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                Công ty
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive('/about')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                Giới thiệu
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive('/contact')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                Liên hệ
              </Link>
              {!isAuthenticated && (
                <>
                  <div className="border-t pt-2 mt-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10"
                    >
                      Đăng ký
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

