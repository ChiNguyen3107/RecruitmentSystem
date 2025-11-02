import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import api, { type ApiResponse, type AuthResponse } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/useToast';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, Briefcase } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);

    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
        email: data.email,
        password: data.password,
      });
      
      if (response.data.success && response.data.data) {
        const { user, accessToken, refreshToken } = response.data.data;
        
        // Lưu auth vào store
        setAuth(user, accessToken, refreshToken);
        
        // Hiển thị thông báo thành công
        toast.success(`Chào mừng trở lại, ${user.fullName}!`, 'Đăng nhập thành công');
        
        // Redirect dựa trên role
        setTimeout(() => {
          if (user.role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else if (user.role === 'EMPLOYER') {
            navigate('/employer/dashboard');
          } else {
            navigate('/applicant/dashboard');
          }
        }, 500);
      } else {
        toast.error(response.data.message || 'Đăng nhập thất bại', 'Lỗi đăng nhập');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại';
      toast.error(errorMessage, 'Lỗi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RECRUIT SYSTEM
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Chào mừng bạn trở lại (Just get a job bruhhh!)
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-border/50 animate-in fade-in slide-in-from-bottom duration-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                Email
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="w-full pl-11 pr-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-all"
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                Mật khẩu
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="w-full pl-11 pr-12 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-all"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  disabled={isLoading}
                />
                <span className="group-hover:text-foreground transition-colors">Ghi nhớ đăng nhập</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-primary hover:text-primary/80 font-medium hover:underline transition-all"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-6 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  <span>Đăng nhập</span>
                </div>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Hoặc</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Chưa có tài khoản?{' '}
              <Link
                to="/register"
                className="text-primary font-semibold hover:text-primary/80 hover:underline transition-all inline-flex items-center gap-1"
              >
                Đăng ký ngay
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground animate-in fade-in duration-1000">
          <p>© 2025 Recruit System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}