import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import api, { type ApiResponse } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import { Lock, ArrowLeft, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Mật khẩu phải có tối thiểu 8 ký tự')
    .max(100, 'Mật khẩu không được vượt quá 100 ký tự')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = searchParams.get('token');

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  // Validate password requirements
  const passwordRequirements = {
    minLength: newPassword.length >= 8,
    maxLength: newPassword.length <= 100,
    hasLowerCase: /[a-z]/.test(newPassword),
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasNumber: /\d/.test(newPassword),
    hasSpecialChar: /[@$!%*?&]/.test(newPassword),
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

  useEffect(() => {
    if (!token) {
      toast.error('Token không hợp lệ hoặc đã hết hạn', 'Lỗi');
      navigate('/forgot-password');
    }
  }, [token, navigate, toast]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error('Token không hợp lệ', 'Lỗi');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post<ApiResponse<void>>('/auth/reset-password', {
        token: token,
        newPassword: data.newPassword,
      });
      
      if (response.data.success) {
        toast.success(
          response.data.message || 'Mật khẩu đã được đặt lại thành công',
          'Đặt lại mật khẩu thành công'
        );
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra', 'Lỗi');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu';
      toast.error(errorMessage, 'Lỗi');
      
      // If token is invalid or expired, redirect to forgot password
      if (err.response?.status === 400) {
        setTimeout(() => {
          navigate('/forgot-password');
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="text-center">
          <p className="text-destructive mb-4">Token không hợp lệ hoặc đã hết hạn</p>
          <Link to="/forgot-password">
            <Button>Yêu cầu đặt lại mật khẩu mới</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md mx-auto relative z-10">
        {/* Back to Login */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại đăng nhập
        </Link>

        {/* Logo/Brand Section */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Đặt lại mật khẩu
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-card/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-border/50 animate-in fade-in slide-in-from-bottom duration-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password Field */}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-semibold text-foreground">
                Mật khẩu mới
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  {...register('newPassword')}
                  className="w-full pl-11 pr-12 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-all"
                  placeholder="Nhập mật khẩu mới"
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
              {errors.newPassword && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            {newPassword && (
              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold mb-2">Yêu cầu mật khẩu:</p>
                <div className="space-y-1.5">
                  <div className={`flex items-center gap-2 text-sm ${passwordRequirements.minLength ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    <CheckCircle2 className={`w-4 h-4 ${passwordRequirements.minLength ? '' : 'opacity-50'}`} />
                    Tối thiểu 8 ký tự
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${passwordRequirements.hasLowerCase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    <CheckCircle2 className={`w-4 h-4 ${passwordRequirements.hasLowerCase ? '' : 'opacity-50'}`} />
                    Ít nhất 1 chữ thường (a-z)
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${passwordRequirements.hasUpperCase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    <CheckCircle2 className={`w-4 h-4 ${passwordRequirements.hasUpperCase ? '' : 'opacity-50'}`} />
                    Ít nhất 1 chữ hoa (A-Z)
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${passwordRequirements.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    <CheckCircle2 className={`w-4 h-4 ${passwordRequirements.hasNumber ? '' : 'opacity-50'}`} />
                    Ít nhất 1 số (0-9)
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${passwordRequirements.hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    <CheckCircle2 className={`w-4 h-4 ${passwordRequirements.hasSpecialChar ? '' : 'opacity-50'}`} />
                    Ít nhất 1 ký tự đặc biệt (@$!%*?&)
                  </div>
                </div>
              </div>
            )}

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
                  placeholder="Nhập lại mật khẩu mới"
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-6 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              disabled={isLoading || !allRequirementsMet}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  <span>Đặt lại mật khẩu</span>
                </div>
              )}
            </Button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 font-medium hover:underline transition-all"
            >
              Yêu cầu liên kết đặt lại mật khẩu mới
            </Link>
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

