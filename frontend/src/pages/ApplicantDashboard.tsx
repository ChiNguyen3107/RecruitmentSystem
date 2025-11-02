
import { ApplicantLayout } from '@/layouts/ApplicantLayout';
import { Briefcase, Calendar, FileCheck, TrendingUp } from 'lucide-react';

export function ApplicantDashboard() {
  return (
    <ApplicantLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Ứng viên</h1>
          <p className="text-muted-foreground">Tổng quan về hồ sơ và đơn ứng tuyển của bạn</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Tổng đơn</span>
              <FileCheck className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold">0</div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Phỏng vấn</span>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-3xl font-bold">0</div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Đề nghị</span>
              <Briefcase className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-3xl font-bold">0</div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Cơ hội</span>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold">0</div>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Việc làm được đề xuất</h2>
            <p className="text-muted-foreground">Chưa có việc làm nào được đề xuất.</p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Đơn ứng tuyển gần đây</h2>
            <p className="text-muted-foreground">Bạn chưa có đơn ứng tuyển nào.</p>
          </div>
        </div>
      </div>
    </ApplicantLayout>
  );
}

