import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import api, { type ApiResponse } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import { Mail, ArrowLeft, AlertCircle, Send } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);

    try {
      const response = await api.post<ApiResponse<void>>('/auth/forgot-password', {
        email: data.email,
      });
      
      if (response.data.success) {
        setIsSubmitted(true);
        toast.success(
          response.data.message || 'Nếu email của bạn tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu',
          'Yêu cầu đặt lại mật khẩu'
        );
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra', 'Lỗi');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu';
      toast.error(errorMessage, 'Lỗi');
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
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Quên mật khẩu
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Nhập email để nhận liên kết đặt lại mật khẩu
          </p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-card/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-border/50 animate-in fade-in slide-in-from-bottom duration-700">
          {!isSubmitted ? (
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

              {/* Info Message */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Chúng tôi sẽ gửi email hướng dẫn đặt lại mật khẩu đến địa chỉ email của bạn.
                </p>
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
                    <span>Đang gửi...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    <span>Gửi yêu cầu</span>
                  </div>
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-6 text-center animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Email đã được gửi!</h3>
                <p className="text-sm text-muted-foreground">
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến{' '}
                  <span className="font-semibold text-foreground">{getValues('email')}</span>
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-left">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Lưu ý:</strong> Vui lòng kiểm tra hộp thư đến và thư mục spam. Liên kết đặt lại mật khẩu sẽ hết hạn sau 1 giờ.
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full py-6 text-base font-semibold"
                >
                  Quay lại đăng nhập
                </Button>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Gửi lại email
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground animate-in fade-in duration-1000">
          <p>© 2025 Recruit System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

