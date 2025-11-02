import { AdminLayout } from '@/layouts/AdminLayout';
import { Users, Building2, Briefcase, TrendingUp } from 'lucide-react';

export function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Quản trị viên</h1>
          <p className="text-muted-foreground">Tổng quan hệ thống</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Tổng người dùng</span>
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold">0</div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Công ty</span>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-3xl font-bold">0</div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Việc làm</span>
              <Briefcase className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-3xl font-bold">0</div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Tăng trưởng</span>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold">0%</div>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Hoạt động gần đây</h2>
          <p className="text-muted-foreground">Chưa có hoạt động nào.</p>
        </div>
      </div>
    </AdminLayout>
  );
}

