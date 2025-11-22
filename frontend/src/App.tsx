import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

// Layouts
import { ApplicantLayout } from './layouts/ApplicantLayout';
import { EmployerLayout } from './layouts/EmployerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Common components
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ToasterProvider } from './components/ui/toaster';

// Pages - Public
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { SearchJobsPage } from './pages/SearchJobsPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CompanyDetailPage } from './pages/CompanyDetailPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Pages - Applicant
import { ApplicantDashboard } from './pages/ApplicantDashboard';
import { ApplicantProfilePage } from './pages/applicant/ApplicantProfilePage';

// Pages - Employer
import { EmployerDashboard } from './pages/EmployerDashboard';

// Pages - Admin
import { AdminDashboard } from './pages/AdminDashboard';

// Store
import { useAuthStore } from './store/useAuthStore';

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppRoutes() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/jobs" element={<SearchJobsPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="/companies/:id" element={<CompanyDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Applicant Routes */}
      <Route
        path="/applicant/dashboard"
        element={
          <ProtectedRoute allowedRoles={['APPLICANT']}>
            <ApplicantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicant/profile"
        element={
          <ProtectedRoute allowedRoles={['APPLICANT']}>
            <ApplicantProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicant/applications"
        element={
          <ProtectedRoute allowedRoles={['APPLICANT']}>
            <ApplicantLayout>
              <PlaceholderPage title="Đơn ứng tuyển của tôi" />
            </ApplicantLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicant/applications/:id"
        element={
          <ProtectedRoute allowedRoles={['APPLICANT']}>
            <ApplicantLayout>
              <PlaceholderPage title="Chi tiết đơn ứng tuyển" />
            </ApplicantLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicant/interviews"
        element={
          <ProtectedRoute allowedRoles={['APPLICANT']}>
            <ApplicantLayout>
              <PlaceholderPage title="Lịch phỏng vấn" />
            </ApplicantLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicant/saved-jobs"
        element={
          <ProtectedRoute allowedRoles={['APPLICANT']}>
            <ApplicantLayout>
              <PlaceholderPage title="Việc làm đã lưu" />
            </ApplicantLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicant/notifications"
        element={
          <ProtectedRoute allowedRoles={['APPLICANT']}>
            <ApplicantLayout>
              <PlaceholderPage title="Thông báo" />
            </ApplicantLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicant/settings"
        element={
          <ProtectedRoute allowedRoles={['APPLICANT']}>
            <ApplicantLayout>
              <PlaceholderPage title="Cài đặt" />
            </ApplicantLayout>
          </ProtectedRoute>
        }
      />

      {/* Employer Routes */}
      <Route
        path="/employer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/jobs"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerLayout>
              <PlaceholderPage title="Quản lý tin tuyển dụng" />
            </EmployerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/jobs/create"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerLayout>
              <PlaceholderPage title="Đăng tin tuyển dụng" />
            </EmployerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/jobs/:id"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerLayout>
              <PlaceholderPage title="Chi tiết tin tuyển dụng" />
            </EmployerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/applications"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerLayout>
              <PlaceholderPage title="Quản lý đơn ứng tuyển" />
            </EmployerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/applications/:id"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerLayout>
              <PlaceholderPage title="Chi tiết đơn ứng tuyển" />
            </EmployerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/interviews"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerLayout>
              <PlaceholderPage title="Quản lý lịch phỏng vấn" />
            </EmployerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/company"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerLayout>
              <PlaceholderPage title="Trang công ty của tôi" />
            </EmployerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/notifications"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerLayout>
              <PlaceholderPage title="Thông báo" />
            </EmployerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/settings"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerLayout>
              <PlaceholderPage title="Cài đặt" />
            </EmployerLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout>
              <PlaceholderPage title="Quản lý người dùng" />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/companies"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout>
              <PlaceholderPage title="Quản lý công ty" />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout>
              <PlaceholderPage title="Quản lý tin tuyển dụng" />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/roles"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout>
              <PlaceholderPage title="Quản lý quyền" />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ToasterProvider>
          <AppRoutes />
        </ToasterProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
