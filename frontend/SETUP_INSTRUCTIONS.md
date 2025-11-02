# 📋 Hướng dẫn Setup Frontend

## ✅ Đã hoàn thành

1. ✅ Đã sửa lỗi version của `tailwind-merge` từ `^2.7.0` → `^2.6.0`
2. ✅ Đã kiểm tra các file cấu hình (TypeScript, Vite, Tailwind)
3. ✅ Đã xác nhận Node.js và npm đã được cài đặt

## 🔧 Các bước tiếp theo

### 1. Cài đặt Dependencies

Chạy lệnh sau trong thư mục `frontend`:

```bash
npm install
```

Lệnh này sẽ cài đặt tất cả dependencies cần thiết.

### 2. Tạo file .env

Tạo file `.env` trong thư mục `frontend` với nội dung:

```env
VITE_API_BASE_URL=http://localhost:8081/api
```

**Lưu ý:** 
- File `.env` không được commit vào git
- Đảm bảo backend server đang chạy tại địa chỉ trên

### 3. Chạy Development Server

Sau khi cài đặt xong, chạy:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:5173**

## 🐛 Troubleshooting

### Nếu vẫn gặp lỗi khi cài đặt:

```bash
# Xóa cache và cài đặt lại
rmdir /s node_modules
del package-lock.json
npm install
```

### Nếu port 5173 đã được sử dụng:

Vite sẽ tự động chọn port khác, hoặc bạn có thể chỉ định port trong `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // hoặc port khác
  },
  // ...
})
```

### Lỗi API connection:

- Kiểm tra backend server có đang chạy không
- Kiểm tra URL trong file `.env`
- Kiểm tra CORS configuration trong backend

## 📦 Dependencies đã được sửa

- `tailwind-merge`: `^2.7.0` → `^2.6.0` (version hợp lệ)

## 🚀 Scripts có sẵn

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build  
- `npm run lint` - Chạy ESLint

## ✨ Sau khi setup xong

1. Đảm bảo backend server đang chạy trên port 8081
2. Chạy `npm run dev`
3. Mở browser tại http://localhost:5173
4. Bắt đầu phát triển!

