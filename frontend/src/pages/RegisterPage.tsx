import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import api, { type ApiResponse, type AuthResponse } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  firstName: z.string().min(1, 'Họ không được để trống'),
  lastName: z.string().min(1, 'Tên không được để trống'),
  phoneNumber: z.string().optional(),
  role: z.enum(['APPLICANT', 'EMPLOYER'], {
    required_error: 'Vui lòng chọn vai trò',
  }),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'APPLICANT',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
      
      if (response.data.success && response.data.data) {
        const { user, accessToken, refreshToken } = response.data.data;
        setAuth(user, accessToken, refreshToken);
        
        // Redirect based on role
        if (user.role === 'EMPLOYER') {
          navigate('/employer/dashboard');
        } else {
          navigate('/applicant/dashboard');
        }
      } else {
        setError(response.data.message || 'Đăng ký thất bại');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg border">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Đăng ký</h1>
          <p className="text-muted-foreground mt-2">
            Tạo tài khoản mới
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Vai trò</label>
            <div className="grid grid-cols-2 gap-2">
              <label className={`cursor-pointer p-3 border rounded-lg text-center ${selectedRole === 'APPLICANT' ? 'border-primary bg-primary/10' : ''}`}>
                <input type="radio" {...register('role')} value="APPLICANT" className="hidden" />
                <div className="font-medium">Ứng viên</div>
              </label>
              <label className={`cursor-pointer p-3 border rounded-lg text-center ${selectedRole === 'EMPLOYER' ? 'border-primary bg-primary/10' : ''}`}>
                <input type="radio" {...register('role')} value="EMPLOYER" className="hidden" />
                <div className="font-medium">Nhà tuyển dụng</div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Họ</label>
              <input
                type="text"
                {...register('firstName')}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Họ"
              />
              {errors.firstName && (
                <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tên</label>
              <input
                type="text"
                {...register('lastName')}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tên"
              />
              {errors.lastName && (
                <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mật khẩu</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-destructive text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Số điện thoại (tùy chọn)</label>
            <input
              type="text"
              {...register('phoneNumber')}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+84..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

