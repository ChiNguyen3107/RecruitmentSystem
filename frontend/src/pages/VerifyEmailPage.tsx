import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import api, { type ApiResponse } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import { 
  CheckCircle2, 
  Mail, 
  AlertCircle, 
  Send, 
  ArrowRight,
  Loader2,
  MailCheck,
  RefreshCw
} from 'lucide-react';

const resendSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ'),
});

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tokenFromQuery, setTokenFromQuery] = useState<string>('');

  const handleVerifyToken = useCallback(async (token: string) => {
    setIsLoading(true);
    setVerificationStatus('idle');
    setErrorMessage('');

    try {
      const response = await api.post<ApiResponse<void>>('/auth/verify-email', {
        token: token,
      });

      if (response.data.success) {
        setVerificationStatus('success');
        toast.success(
          'Email của bạn đã được xác minh thành công!',
          'Xác minh thành công'
        );
      } else {
        setVerificationStatus('error');
        setErrorMessage(response.data.message || 'Token xác minh không hợp lệ');
        toast.error(
          response.data.message || 'Token xác minh không hợp lệ',
          'Xác minh thất bại'
        );
      }
    } catch (err: any) {
      setVerificationStatus('error');
      const errorMsg = err.response?.data?.message || 'Token xác minh không hợp lệ hoặc đã hết hạn';
      setErrorMessage(errorMsg);
      toast.error(errorMsg, 'Xác minh thất bại');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Đọc token từ query params
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setTokenFromQuery(token);
      handleVerifyToken(token);
    }
  }, [searchParams, handleVerifyToken]);

  const {
    register: registerResend,
    handleSubmit: handleSubmitResend,
    formState: { errors: errorsResend },
  } = useForm<{ email: string }>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmitResend = async (data: { email: string }) => {
    setIsResending(true);

    try {
      const response = await api.post<ApiResponse<void>>('/auth/resend-verification', {
        email: data.email,
      });

      if (response.data.success) {
        toast.success(
          'Nếu email tồn tại và chưa được xác minh, email xác minh sẽ được gửi lại',
          'Email đã được gửi'
        );
      }
    } catch (err: any) {
      // Backend trả về generic message nên luôn success
      // Chỉ xử lý lỗi mạng
      toast.error(
        'Không thể gửi email. Vui lòng thử lại sau',
        'Lỗi gửi email'
      );
    } finally {
      setIsResending(false);
    }
  };

  // Trạng thái thành công
  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="w-full max-w-lg mx-auto relative z-10">
          <div className="bg-card/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-border/50 animate-in fade-in slide-in-from-bottom duration-700">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                Email đã được xác minh!
              </h1>
              <p className="text-lg text-muted-foreground">
                Tài khoản của bạn đã được kích hoạt thành công. Bây giờ bạn có thể đăng nhập và sử dụng đầy đủ các tính năng của hệ thống.
              </p>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => navigate('/login')}
              className="w-full py-6 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2">
                <ArrowRight className="w-5 h-5" />
                <span>Đến trang đăng nhập</span>
              </div>
            </Button>
          </div>
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

      <div className="container max-w-2xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <MailCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Xác minh Email
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Xác minh địa chỉ email của bạn để kích hoạt tài khoản
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-border/50 animate-in fade-in slide-in-from-bottom duration-700">
          {/* Error Message */}
          {verificationStatus === 'error' && errorMessage && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive mb-1">Xác minh thất bại</h3>
                  <p className="text-sm text-muted-foreground">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mb-6 p-8 text-center animate-in fade-in duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <p className="text-muted-foreground">Đang xác minh email của bạn...</p>
            </div>
          )}

          {/* Resend Verification Form - hiển thị khi không có token hoặc đã lỗi */}
          {!isLoading && (!tokenFromQuery || verificationStatus === 'error') && (
            <>
              {!tokenFromQuery && (
                <div className="mb-6 p-6 bg-muted/50 border border-border rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Chưa có mã xác minh</h3>
                      <p className="text-sm text-muted-foreground">
                        Bạn có thể yêu cầu gửi lại email xác minh bằng cách nhập địa chỉ email của mình bên dưới.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resend Verification Form */}
              <form onSubmit={handleSubmitResend(onSubmitResend)} className="space-y-6">
                <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                    Gửi lại email xác minh
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chưa nhận được email? Nhập địa chỉ email của bạn để nhận email xác minh mới.
                  </p>

                  <div className="space-y-2">
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        {...registerResend('email')}
                        className="w-full pl-11 pr-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-all"
                        placeholder="your@email.com"
                        disabled={isResending}
                      />
                    </div>
                    {errorsResend.email && (
                      <p className="text-destructive text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errorsResend.email.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full mt-4"
                    disabled={isResending}
                  >
                    {isResending ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang gửi...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send className="w-5 h-5" />
                        <span>Gửi lại email xác minh</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>

              {/* Footer Links */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Đã có tài khoản?{' '}
                    <Link
                      to="/login"
                      className="text-primary font-semibold hover:text-primary/80 hover:underline transition-all inline-flex items-center gap-1"
                    >
                      Đăng nhập ngay
                      <span>→</span>
                    </Link>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Chưa có tài khoản?{' '}
                    <Link
                      to="/register"
                      className="text-primary font-semibold hover:text-primary/80 hover:underline transition-all inline-flex items-center gap-1"
                    >
                      Đăng ký ngay
                      <span>→</span>
                    </Link>
                  </p>
                </div>
              </div>
            </>
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

