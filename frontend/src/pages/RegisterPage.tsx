import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import api, { type ApiResponse, type AuthResponse } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/useToast';
import { 
  Mail, 
  Lock, 
  UserPlus, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  User, 
  Building2, 
  Briefcase,
  Phone,
  Users,
  Target,
  Zap
} from 'lucide-react';

const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
    .max(100, 'Email không được quá 100 ký tự'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .min(6, 'Mật khẩu tối thiểu 6 ký tự')
    .max(50, 'Mật khẩu tối đa 50 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  fullName: z
    .string()
    .min(1, 'Họ tên không được để trống')
    .min(2, 'Họ tên tối thiểu 2 ký tự')
    .max(100, 'Họ tên không được quá 100 ký tự')
    .regex(/^[\p{L}\s]+$/u, 'Họ tên chỉ được chứa chữ cái và khoảng trắng'),
  phone: z
    .string()
    .max(15, 'Số điện thoại không được quá 15 ký tự')
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Số điện thoại không hợp lệ')
    .optional()
    .or(z.literal('')),
  role: z.enum(['APPLICANT', 'EMPLOYER'], {
    required_error: 'Vui lòng chọn vai trò',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const { toast } = useToast();

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'APPLICANT',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);

    try {
      // Tách fullName thành firstName và lastName
      const nameParts = data.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

      // Chuẩn bị dữ liệu gửi lên API
      const { confirmPassword, fullName, phone, ...registerData } = data;
      const payload = {
        ...registerData,
        firstName,
        lastName,
        phoneNumber: phone || undefined,
      };

      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
      
      if (response.data.success && response.data.data) {
        const { user, accessToken, refreshToken } = response.data.data;
        setAuth(user, accessToken, refreshToken);
        
        // Hiển thị thông báo thành công
        toast.success(
          'Kiểm tra email để xác minh tài khoản của bạn.', 
          'Đăng ký thành công!'
        );

        // Reset form
        reset({
          role: 'APPLICANT',
          email: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          phone: '',
        });
      } else {
        toast.error(response.data.message || 'Đăng ký thất bại', 'Lỗi đăng ký');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      toast.error(errorMessage, 'Lỗi đăng ký');
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

      <div className="container max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full relative z-10">
        {/* Left Side - Feature Showcase */}
        <div className="hidden lg:block space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bắt đầu hành trình sự nghiệp
            </h2>
            <p className="text-xl text-muted-foreground">
              Tạo tài khoản ngay hôm nay để khám phá vô vàn cơ hội
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-primary/20 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Ứng viên</h3>
              <p className="text-sm text-muted-foreground">
                Tìm việc làm phù hợp với kỹ năng của bạn
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-primary/20 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Nhà tuyển dụng</h3>
              <p className="text-sm text-muted-foreground">
                Tìm kiếm tài năng chất lượng cao
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-2xl border border-primary/20 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Miễn phí 100%</h3>
              <p className="text-sm text-muted-foreground">
                Không phí đăng ký hay phí ẩn
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-2xl border border-primary/20 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Matching thông minh</h3>
              <p className="text-sm text-muted-foreground">
                AI đề xuất việc phù hợp nhất
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white dark:border-gray-900" />
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white dark:border-gray-900" />
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 border-2 border-white dark:border-gray-900" />
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+2K</span>
                </div>
              </div>
              <div>
                <p className="font-semibold">Hơn 2,000+ thành viên mới mỗi tuần</p>
                <p className="text-sm text-muted-foreground">Tham gia cộng đồng ngay!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full max-w-md mx-auto">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ĐĂNG KÝ
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Tạo tài khoản mới để bắt đầu
            </p>
          </div>

          {/* Register Card */}
          <div className="bg-card/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-border/50 animate-in fade-in slide-in-from-bottom duration-700">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Vai trò của bạn
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`relative cursor-pointer group transition-all duration-200 ${
                    selectedRole === 'APPLICANT' 
                      ? 'border-primary bg-primary/10 scale-105' 
                      : 'border-input hover:border-primary/50'
                  }`}>
                    <input 
                      type="radio" 
                      {...register('role')} 
                      value="APPLICANT" 
                      className="hidden" 
                    />
                    <div className="p-4 border-2 rounded-xl transition-all">
                      <User className={`w-8 h-8 mx-auto mb-2 ${
                        selectedRole === 'APPLICANT' ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <div className={`font-semibold ${
                        selectedRole === 'APPLICANT' ? 'text-primary' : 'text-foreground'
                      }`}>
                        Ứng viên
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Tìm việc làm</div>
                    </div>
                  </label>
                  
                  <label className={`relative cursor-pointer group transition-all duration-200 ${
                    selectedRole === 'EMPLOYER' 
                      ? 'border-primary bg-primary/10 scale-105' 
                      : 'border-input hover:border-primary/50'
                  }`}>
                    <input 
                      type="radio" 
                      {...register('role')} 
                      value="EMPLOYER" 
                      className="hidden" 
                    />
                    <div className="p-4 border-2 rounded-xl transition-all">
                      <Building2 className={`w-8 h-8 mx-auto mb-2 ${
                        selectedRole === 'EMPLOYER' ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <div className={`font-semibold ${
                        selectedRole === 'EMPLOYER' ? 'text-primary' : 'text-foreground'
                      }`}>
                        Nhà tuyển dụng
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Tuyển dụng</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-semibold text-foreground">
                  Họ tên
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    {...register('fullName')}
                    className="w-full pl-11 pr-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-all"
                    placeholder="Nhập họ và tên đầy đủ"
                    disabled={isLoading}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.fullName.message}
                  </p>
                )}
              </div>

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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground">
                  Xác nhận mật khẩu
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    className="w-full pl-11 pr-12 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-all"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-foreground">
                  Số điện thoại <span className="text-muted-foreground font-normal">(tùy chọn)</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="w-full pl-11 pr-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-all"
                    placeholder="+84 912 345 678"
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone.message}
                  </p>
                )}
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
                    <span>Đang đăng ký...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    <span>Đăng ký</span>
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

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Đã có tài khoản?{' '}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:text-primary/80 hover:underline transition-all inline-flex items-center gap-1 group"
                >
                  Đăng nhập ngay
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
    </div>
  );
}
