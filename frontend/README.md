# Recruitment System Frontend

Ứng dụng frontend cho hệ thống tuyển dụng được xây dựng với React + Vite + TypeScript.

## 🚀 Công nghệ

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **React Router v6** - Routing
- **Axios** - HTTP Client với interceptors
- **Zustand** - State management
- **React Query** - Server state management & caching
- **React Hook Form** + **Zod** - Form handling & validation
- **Tailwind CSS** + **shadcn/ui** - UI Framework
- **date-fns** - Date manipulation
- **Recharts** - Charts
- **Lucide React** - Icons

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## ⚙️ Cấu hình

Tạo file `.env` trong thư mục frontend:

```env
VITE_API_BASE_URL=http://localhost:8081/api
```

## 📁 Cấu trúc dự án

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── common/          # Common components (FilterBar, DataTable, etc.)
│   │   └── ui/              # UI components (Button, etc.)
│   ├── layouts/             # Layout components
│   │   ├── PublicLayout.tsx
│   │   ├── ApplicantLayout.tsx
│   │   ├── EmployerLayout.tsx
│   │   └── AdminLayout.tsx
│   ├── pages/               # Page components
│   ├── services/            # API services
│   │   └── api.ts           # Axios instance & interceptors
│   ├── store/               # Zustand stores
│   │   └── useAuthStore.ts  # Auth state management
│   ├── lib/                 # Utilities
│   │   └── utils.ts
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── index.html
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── package.json
```

## 🔐 Authentication

Hệ thống sử dụng JWT với:
- **Access Token**: 15 phút
- **Refresh Token**: 30 ngày

Auto refresh token khi hết hạn qua Axios interceptors.

## 📄 Routes

### Public
- `/` - Trang chủ
- `/login` - Đăng nhập
- `/register` - Đăng ký
- `/jobs` - Danh sách việc làm
- `/jobs/:id` - Chi tiết việc làm
- `/companies` - Danh sách công ty
- `/companies/:id` - Chi tiết công ty

### Applicant (Protected)
- `/applicant/dashboard` - Dashboard ứng viên
- `/applicant/profile` - Hồ sơ
- `/applicant/applications` - Đơn ứng tuyển
- `/applicant/applications/:id` - Chi tiết đơn
- `/applicant/interviews` - Lịch phỏng vấn
- `/applicant/saved-jobs` - Việc làm đã lưu
- `/applicant/notifications` - Thông báo
- `/applicant/settings` - Cài đặt

### Employer (Protected)
- `/employer/dashboard` - Dashboard nhà tuyển dụng
- `/employer/jobs` - Quản lý tin tuyển dụng
- `/employer/jobs/create` - Đăng tin mới
- `/employer/jobs/:id` - Chi tiết tin
- `/employer/applications` - Quản lý đơn ứng tuyển
- `/employer/applications/:id` - Chi tiết đơn
- `/employer/interviews` - Quản lý lịch phỏng vấn
- `/employer/company` - Thông tin công ty
- `/employer/notifications` - Thông báo
- `/employer/settings` - Cài đặt

### Admin (Protected)
- `/admin/dashboard` - Dashboard admin
- `/admin/users` - Quản lý người dùng
- `/admin/companies` - Quản lý công ty
- `/admin/jobs` - Quản lý tin tuyển dụng
- `/admin/roles` - Quản lý quyền

## 🎨 UI Components

Sử dụng Tailwind CSS và shadcn/ui:

- Button
- Skeleton
- EmptyState
- DataTable
- FilterBar
- Pagination
- ProtectedRoute

## 🔧 Development

```bash
# Development server chạy tại http://localhost:5173
npm run dev
```

Backend API server phải chạy tại `http://localhost:8081` để frontend hoạt động.

## 📝 Notes

- Dark mode được hỗ trợ thông qua Tailwind
- Responsive design cho mobile, tablet, desktop
- Form validation với Zod
- Error handling với React Query
- Protected routes với role-based access

## 🐛 Troubleshooting

### Lỗi module không tìm thấy
```bash
rm -rf node_modules package-lock.json
npm install
```

### Lỗi TypeScript
```bash
npm run build
# Kiểm tra lỗi trong terminal
```

### Lỗi API connection
- Đảm bảo backend server đang chạy
- Kiểm tra `.env` file có đúng API URL
- Kiểm tra CORS configuration trong backend
