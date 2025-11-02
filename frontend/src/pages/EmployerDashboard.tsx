import { EmployerLayout } from '@/layouts/EmployerLayout';
import { Briefcase, Users, Calendar, Eye } from 'lucide-react';

export function EmployerDashboard() {
  return (
    <EmployerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Nhà tuyển dụng</h1>
          <p className="text-muted-foreground">Tổng quan về tuyển dụng và ứng viên</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Việc làm hoạt động</span>
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold">0</div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Đơn ứng tuyển</span>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-3xl font-bold">0</div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Lịch phỏng vấn</span>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-3xl font-bold">0</div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Lượt xem</span>
              <Eye className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold">0</div>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Đơn ứng tuyển gần đây</h2>
            <p className="text-muted-foreground">Chưa có đơn ứng tuyển nào.</p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Việc làm hoạt động</h2>
            <p className="text-muted-foreground">Bạn chưa có việc làm nào.</p>
          </div>
        </div>
      </div>
    </EmployerLayout>
  );
}

