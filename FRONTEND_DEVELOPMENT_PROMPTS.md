# 🎨 FRONTEND DEVELOPMENT PROMPTS - HỆ THỐNG TUYỂN DỤNG

**Mục đích**: Tài liệu này cung cấp các prompt chi tiết để hoàn thiện frontend với design đồng nhất và hiện đại.

**Design System hiện tại**:
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS với shadcn/ui components
- **State Management**: Zustand (auth) + React Query (server state)
- **Form**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Color Scheme**: Primary blue (#3B82F6), với dark mode support
- **Animations**: Smooth transitions, blob animations, fade-in effects

---

## 📋 MỤC LỤC

1. [Phase 1: Trang Public - Ưu tiên CAO](#phase-1-trang-public)
2. [Phase 2: Trang Applicant](#phase-2-trang-applicant)
3. [Phase 3: Trang Employer](#phase-3-trang-employer)
4. [Phase 4: Trang Admin](#phase-4-trang-admin)
5. [Phase 5: Components nâng cao](#phase-5-components-nâng-cao)
6. [Design Guidelines](#design-guidelines)

---

## 🎯 PHASE 1: TRANG PUBLIC - ƯU TIÊN CAO

### 1.1. Trang Chi Tiết Việc Làm (`/jobs/:id`) - **QUAN TRỌNG NHẤT**

**Prompt:**

```
Tôi cần bạn tạo trang chi tiết việc làm (JobDetailPage) cho hệ thống tuyển dụng với React 19 + TypeScript + Tailwind CSS.

DESIGN REQUIREMENTS:
- Layout: 2 cột (70% content, 30% sidebar) trên desktop, 1 cột trên mobile
- Style: Hiện đại, clean, với animations mượt mà
- Color scheme: Primary blue (#3B82F6), sử dụng design tokens từ index.css
- Responsive: Mobile-first approach

FEATURES CẦN IMPLEMENT:
1. **Header Section**:
   - Job title (h1, font-bold, text-3xl)
   - Company logo và tên (clickable, link to company page)
   - Location, job type, experience level badges
   - Salary range (nếu có)
   - Posted date và application deadline
   - View count

2. **Main Content**:
   - Job description (rich text, preserve line breaks)
   - Requirements (bullet points)
   - Responsibilities (bullet points)
   - Benefits (bullet points)
   - Skills required (tags/badges)

3. **Sidebar (Sticky)**:
   - Apply button (primary, prominent)
   - Save job button (outline, with heart icon)
   - Share buttons (LinkedIn, Facebook, Copy link)
   - Company info card:
     * Logo
     * Name
     * Industry
     * Company size
     * Website link
     * "View company" button
   - Similar jobs section (3-4 jobs)

4. **Apply Modal/Section**:
   - Cover letter textarea (optional)
   - Resume upload/select from profile
   - Additional documents
   - Submit button
   - Validation với Zod

5. **States**:
   - Loading: Skeleton components
   - Error: EmptyState với retry button
   - Success: Show job details
   - Already applied: Show "Đã ứng tuyển" badge, disable apply button
   - Job expired: Show warning, disable apply button

TECHNICAL REQUIREMENTS:
- Sử dụng React Query để fetch data từ API: `jobService.getJobDetail(id)`
- Sử dụng `useParams()` để lấy job ID từ URL
- Implement save/unsave job với `savedJobService`
- Implement apply job với `applicationService.applyJob()`
- Toast notifications cho success/error
- SEO: Dynamic page title và meta description

API ENDPOINTS:
- GET `/api/public/jobs/{id}` - Chi tiết job
- GET `/api/public/jobs/latest` - Similar jobs
- POST `/api/jobs/{id}/save` - Lưu job (cần auth)
- DELETE `/api/jobs/{id}/unsave` - Bỏ lưu job (cần auth)
- POST `/api/applications/my` - Nộp đơn (cần auth)

COMPONENTS CẦN TẠO:
1. `JobDetailPage.tsx` - Main page
2. `ApplyJobModal.tsx` - Modal/form nộp đơn (optional, có thể inline)
3. `SimilarJobCard.tsx` - Card cho similar jobs (compact version)

FILE STRUCTURE:
```
src/
  pages/
    JobDetailPage.tsx (thay thế placeholder hiện tại)
  components/
    job/
      ApplyJobModal.tsx (new)
      SimilarJobCard.tsx (new)
```

DESIGN REFERENCE:
- Tham khảo style từ `HomePage.tsx` và `SearchJobsPage.tsx`
- Sử dụng components: Button, Skeleton, EmptyState, toast
- Icons: Lucide React (Briefcase, MapPin, Clock, DollarSign, Users, Building2, Heart, Share2, ExternalLink)

Hãy tạo code hoàn chỉnh với:
- TypeScript types đầy đủ
- Error handling
- Loading states
- Responsive design
- Accessibility (ARIA labels)
- Comments giải thích logic phức tạp
```

---

## 🎯 PHASE 2: TRANG APPLICANT

### 2.1. Trang Quản Lý Hồ Sơ (`/applicant/profile`)

**Prompt:**

```
Tạo trang quản lý hồ sơ ứng viên (ApplicantProfilePage) với React 19 + TypeScript + Tailwind CSS.

LAYOUT:
- ApplicantLayout wrapper
- Tabs navigation: "Thông tin cá nhân", "CV & Tài liệu", "Kỹ năng", "Kinh nghiệm", "Học vấn"

FEATURES:

**Tab 1: Thông tin cá nhân**
- Form fields:
  * Avatar upload (with preview)
  * Họ, Tên
  * Email (readonly)
  * Số điện thoại
  * Địa chỉ
  * Ngày sinh
  * Giới tính
  * Bio/Giới thiệu bản thân (textarea, max 500 chars)
  * LinkedIn, GitHub, Portfolio URLs
- Save button (primary)
- Cancel button (outline)

**Tab 2: CV & Tài liệu**
- Upload CV (PDF, DOCX, max 10MB)
- List uploaded documents:
  * File name
  * File size
  * Upload date
  * Download button
  * Delete button
- Primary CV selector (radio buttons)
- Upload new document button

**Tab 3: Kỹ năng**
- Skills input với autocomplete/tags
- Skill level selector (Beginner, Intermediate, Advanced, Expert)
- Add/Remove skills
- Skill categories (Technical, Soft skills, Languages, Tools)

**Tab 4: Kinh nghiệm**
- Add experience button
- Experience list:
  * Job title
  * Company name
  * Start date - End date (or "Hiện tại")
  * Description
  * Edit/Delete buttons
- Form modal để add/edit experience

**Tab 5: Học vấn**
- Add education button
- Education list:
  * Degree/Certificate
  * School/University
  * Field of study
  * Start date - End date
  * GPA (optional)
  * Description
  * Edit/Delete buttons
- Form modal để add/edit education

TECHNICAL:
- React Hook Form + Zod validation
- React Query mutations cho CRUD operations
- Optimistic updates
- Toast notifications
- File upload với progress bar
- Image cropper cho avatar (optional)

API ENDPOINTS:
- GET `/api/profile` - Lấy profile
- PUT `/api/profile` - Cập nhật profile
- POST `/api/profile/documents` - Upload document
- DELETE `/api/profile/documents/{id}` - Xóa document
- POST `/api/profile/avatar` - Upload avatar

VALIDATION RULES:
- Phone: Regex Vietnamese phone number
- Email: Valid email format
- URLs: Valid URL format
- File size: Max 10MB
- File types: PDF, DOCX cho CV
- Image types: JPG, PNG cho avatar

COMPONENTS:
```
src/
  pages/
    applicant/
      ApplicantProfilePage.tsx
  components/
    profile/
      PersonalInfoForm.tsx
      DocumentsManager.tsx
      SkillsManager.tsx
      ExperienceManager.tsx
      EducationManager.tsx
      ExperienceModal.tsx
      EducationModal.tsx
```

Sử dụng Tabs component (có thể tạo mới hoặc dùng headless UI).
```

---

### 2.2. Trang Danh Sách Đơn Ứng Tuyển (`/applicant/applications`)

**Prompt:**

```
Tạo trang danh sách đơn ứng tuyển (ApplicantApplicationsPage) với React 19 + TypeScript + Tailwind CSS.

LAYOUT:
- ApplicantLayout wrapper
- Header với title và filters
- DataTable với pagination

FEATURES:

**Filter Bar**:
- Status filter (dropdown): Tất cả, Đã nộp, Đang xem xét, Phỏng vấn, Nhận offer, Đã tuyển, Từ chối
- Date range filter: 7 ngày, 30 ngày, 3 tháng, Tất cả
- Search by job title
- Sort by: Ngày nộp (mới nhất), Ngày nộp (cũ nhất), Tên công ty

**Application Card/Row**:
- Job title (clickable → job detail)
- Company name và logo (clickable → company detail)
- Applied date
- Status badge (với màu sắc khác nhau):
  * RECEIVED: blue
  * REVIEWED: yellow
  * INTERVIEW: purple
  * OFFER: green
  * HIRED: green-dark
  * REJECTED: red
  * WITHDRAWN: gray
- View details button
- Withdraw button (nếu status = RECEIVED hoặc REVIEWED)

**Application Detail Modal/Page**:
- Job information
- Application timeline (vertical timeline):
  * Nộp đơn
  * Đang xem xét
  * Phỏng vấn (với thời gian nếu có)
  * Kết quả
- Cover letter
- Uploaded documents
- Interview schedule (nếu có)
- Employer notes (nếu có)
- Withdraw application button

**Empty State**:
- Icon: FileText
- Message: "Bạn chưa nộp đơn ứng tuyển nào"
- CTA button: "Tìm việc làm"

TECHNICAL:
- React Query với pagination
- Filter state management (URL params)
- Optimistic updates cho withdraw
- Confirmation modal cho withdraw action
- Toast notifications

API ENDPOINTS:
- GET `/api/applications/my?page=0&size=10&status=&sortBy=appliedAt&sortDir=desc`
- GET `/api/applications/{id}` - Chi tiết application
- PUT `/api/applications/{id}/withdraw` - Rút đơn

COMPONENTS:
```
src/
  pages/
    applicant/
      ApplicantApplicationsPage.tsx
      ApplicationDetailPage.tsx
  components/
    application/
      ApplicationCard.tsx
      ApplicationTimeline.tsx
      ApplicationFilters.tsx
      WithdrawConfirmModal.tsx
```

STATUS COLORS:
- RECEIVED: bg-blue-100 text-blue-800
- REVIEWED: bg-yellow-100 text-yellow-800
- INTERVIEW: bg-purple-100 text-purple-800
- OFFER: bg-green-100 text-green-800
- HIRED: bg-green-600 text-white
- REJECTED: bg-red-100 text-red-800
- WITHDRAWN: bg-gray-100 text-gray-800
```

---

### 2.3. Trang Lịch Phỏng Vấn (`/applicant/interviews`)

**Prompt:**

```
Tạo trang lịch phỏng vấn (ApplicantInterviewsPage) với React 19 + TypeScript + Tailwind CSS.

LAYOUT:
- ApplicantLayout wrapper
- Calendar view (tháng) và List view (toggle)
- Upcoming interviews section (highlight)

FEATURES:

**Calendar View**:
- Monthly calendar với interviews marked
- Click vào ngày → show interviews của ngày đó
- Color coding theo status:
  * SCHEDULED: blue
  * CONFIRMED: green
  * COMPLETED: gray
  * CANCELLED: red
  * RESCHEDULED: yellow

**List View**:
- Grouped by date (Hôm nay, Ngày mai, Tuần này, Tháng này, Quá khứ)
- Interview card:
  * Job title
  * Company name và logo
  * Interview date & time
  * Interview type (PHONE, VIDEO, ONSITE, TECHNICAL, HR)
  * Location/Meeting link
  * Interviewer names (nếu có)
  * Status badge
  * Notes from employer
  * Action buttons:
    - View details
    - Add to calendar (.ics download)
    - Join meeting (nếu VIDEO và gần giờ)

**Interview Detail Modal**:
- Full information
- Interview type và method
- Date, time, duration
- Location/Meeting link (clickable)
- Interviewer information
- Preparation notes
- Company information
- Related application link
- Add to calendar button
- Directions/Map (nếu ONSITE)

**Upcoming Section** (Top of page):
- Next 3 upcoming interviews
- Countdown timer cho interview sắp tới
- Quick actions

**Filter**:
- Status filter
- Date range
- Interview type
- Company

TECHNICAL:
- React Query
- Calendar library: react-big-calendar hoặc tự build với date-fns
- .ics file generation cho "Add to calendar"
- Countdown timer với useEffect
- Real-time updates (optional: polling hoặc WebSocket)

API ENDPOINTS:
- GET `/api/interviews/my?page=0&size=20&status=&from=&to=`
- GET `/api/interviews/{id}` - Chi tiết interview

COMPONENTS:
```
src/
  pages/
    applicant/
      ApplicantInterviewsPage.tsx
  components/
    interview/
      InterviewCalendar.tsx
      InterviewCard.tsx
      InterviewDetailModal.tsx
      UpcomingInterviews.tsx
      InterviewCountdown.tsx
```

CALENDAR INTEGRATION:
- Generate .ics file với thông tin:
  * Title: Interview for [Job Title] at [Company]
  * Start/End time
  * Location/Meeting link
  * Description với notes
```

---

### 2.4. Trang Việc Làm Đã Lưu (`/applicant/saved-jobs`)

**Prompt:**

```
Tạo trang việc làm đã lưu (SavedJobsPage) với React 19 + TypeScript + Tailwind CSS.

LAYOUT:
- ApplicantLayout wrapper
- Grid layout (3 columns desktop, 2 tablet, 1 mobile)
- Filter và sort options

FEATURES:

**Filter Bar**:
- Search by job title/company
- Job type filter
- Location filter
- Salary range filter
- Sort by: Ngày lưu (mới nhất), Ngày lưu (cũ nhất), Deadline

**Job Card** (giống HomePage nhưng có thêm):
- Saved date badge
- Unsave button (heart icon filled)
- Application deadline countdown (nếu gần hết hạn)
- "Đã ứng tuyển" badge (nếu đã apply)
- Quick apply button (nếu chưa apply)

**Bulk Actions**:
- Select multiple jobs
- Bulk unsave
- Bulk apply (optional)

**Empty State**:
- Icon: Heart
- Message: "Bạn chưa lưu việc làm nào"
- CTA: "Khám phá việc làm"

**Stats Section** (Top):
- Total saved jobs
- Applied from saved (X/Y)
- Expiring soon (deadline < 7 days)

TECHNICAL:
- React Query với pagination
- Optimistic updates cho unsave
- Bulk selection state management
- Filter state in URL params

API ENDPOINTS:
- GET `/api/jobs/saved?page=0&size=12`
- DELETE `/api/jobs/{id}/unsave`
- POST `/api/applications/my` - Quick apply

COMPONENTS:
```
src/
  pages/
    applicant/
      SavedJobsPage.tsx
  components/
    saved-jobs/
      SavedJobCard.tsx
      SavedJobFilters.tsx
      SavedJobStats.tsx
```

INTERACTIONS:
- Hover effect trên card
- Smooth animations khi unsave (fade out)
- Confirmation modal cho bulk unsave
- Toast notification sau mỗi action
```

---

### 2.5. Trang Thông Báo (`/applicant/notifications`)

**Prompt:**

```
Tạo trang thông báo (NotificationsPage) cho Applicant với React 19 + TypeScript + Tailwind CSS.

LAYOUT:
- ApplicantLayout wrapper
- List view với grouping theo ngày
- Mark all as read button

FEATURES:

**Notification Types**:
1. Application status changed
2. Interview scheduled
3. Interview reminder (1 day, 1 hour before)
4. New message from employer
5. Job recommendation
6. Saved job expiring soon

**Notification Item**:
- Icon theo type (màu sắc khác nhau)
- Title (bold nếu unread)
- Message/Description
- Timestamp (relative: "2 giờ trước")
- Read/Unread indicator (dot)
- Action button (View application, View interview, etc.)
- Delete button (hover)

**Grouping**:
- Hôm nay
- Hôm qua
- Tuần này
- Tháng này
- Cũ hơn

**Filter**:
- All notifications
- Unread only
- By type

**Header Actions**:
- Mark all as read
- Settings (notification preferences)

**Empty State**:
- Icon: Bell
- Message: "Không có thông báo mới"

TECHNICAL:
- React Query với pagination
- Optimistic updates cho mark as read
- Real-time updates (polling every 30s hoặc WebSocket)
- Notification count badge trong header

API ENDPOINTS:
- GET `/api/notifications?page=0&size=20&unreadOnly=false`
- PUT `/api/notifications/{id}/read` - Mark as read
- PUT `/api/notifications/read-all` - Mark all as read
- DELETE `/api/notifications/{id}` - Delete notification

COMPONENTS:
```
src/
  pages/
    applicant/
      NotificationsPage.tsx
  components/
    notifications/
      NotificationItem.tsx
      NotificationFilters.tsx
      NotificationSettings.tsx (modal)
```

NOTIFICATION ICONS & COLORS:
- Application: FileText, blue
- Interview: Calendar, purple
- Message: MessageSquare, green
- Recommendation: Sparkles, yellow
- Reminder: Bell, orange
```

---

## 🎯 PHASE 3: TRANG EMPLOYER

### 3.1. Trang Quản Lý Tin Tuyển Dụng (`/employer/jobs`)

**Prompt:**

```
Tạo trang quản lý tin tuyển dụng (EmployerJobsPage) với React 19 + TypeScript + Tailwind CSS.

LAYOUT:
- EmployerLayout wrapper
- Header với "Đăng tin mới" button (primary, prominent)
- Tabs: Tất cả, Đang tuyển, Nháp, Đã đóng
- DataTable với actions

FEATURES:

**Stats Cards** (Top):
- Total jobs
- Active jobs
- Total applications
- Pending reviews

**Filter Bar**:
- Search by job title
- Status filter
- Date range
- Sort by: Ngày tạo, Số lượng ứng viên, Deadline

**Job Table/Card**:
Columns:
- Job title (clickable)
- Status badge (DRAFT, ACTIVE, PAUSED, CLOSED)
- Posted date
- Deadline
- Applications count (clickable → applications page)
- Views count
- Actions dropdown:
  * View
  * Edit
  * Duplicate
  * Change status (Activate, Pause, Close)
  * Delete (nếu DRAFT hoặc không có applications)

**Status Management**:
- DRAFT → ACTIVE (Publish)
- ACTIVE → PAUSED (Pause recruitment)
- ACTIVE → CLOSED (Close recruitment)
- PAUSED → ACTIVE (Resume)

**Bulk Actions**:
- Select multiple jobs
- Bulk status change
- Bulk delete (DRAFT only)

TECHNICAL:
- React Query với pagination
- DataTable component (reusable)
- Confirmation modals cho delete/close
- Optimistic updates
- Toast notifications

API ENDPOINTS:
- GET `/api/jobs/manage?page=0&size=10&status=`
- PUT `/api/jobs/{id}/status` - Change status
- DELETE `/api/jobs/{id}` - Delete job
- POST `/api/jobs/{id}/duplicate` - Duplicate job

COMPONENTS:
```
src/
  pages/
    employer/
      EmployerJobsPage.tsx
  components/
    employer/
      JobsTable.tsx
      JobsStats.tsx
      JobStatusBadge.tsx
      JobActionsMenu.tsx
      ChangeStatusModal.tsx
```

STATUS COLORS:
- DRAFT: gray
- ACTIVE: green
- PAUSED: yellow
- CLOSED: red
- EXPIRED: orange
```

---

### 3.2. Form Đăng Tin Tuyển Dụng (`/employer/jobs/create` và `/employer/jobs/:id/edit`)

**Prompt:**

```
Tạo form đăng tin tuyển dụng (JobPostingForm) với React 19 + TypeScript + Tailwind CSS.

LAYOUT:
- EmployerLayout wrapper
- Multi-step form hoặc single page với sections
- Save as draft button
- Preview button
- Publish button

FORM SECTIONS:

**1. Thông tin cơ bản**:
- Job title* (text input)
- Job type* (select: Full-time, Part-time, Contract, Internship, Freelance)
- Work mode* (select: Remote, Onsite, Hybrid)
- Experience level* (select: Intern, Junior, Mid, Senior, Lead)
- Number of positions (number input, default 1)
- Location* (text input với autocomplete cities)

**2. Mô tả công việc**:
- Job description* (rich text editor hoặc textarea)
  * Giới thiệu về vị trí
  * Mô tả công việc chi tiết
- Requirements* (textarea, bullet points)
  * Yêu cầu về kinh nghiệm
  * Yêu cầu về kỹ năng
  * Yêu cầu về học vấn
- Responsibilities (textarea, bullet points)
  * Trách nhiệm chính
  * Nhiệm vụ hàng ngày

**3. Lương và phúc lợi**:
- Salary range (optional):
  * Min salary (number)
  * Max salary (number)
  * Currency (default VND)
  * Salary type (Monthly, Yearly, Hourly)
- Benefits (textarea, bullet points):
  * Bảo hiểm
  * Thưởng
  * Đào tạo
  * Các phúc lợi khác

**4. Kỹ năng yêu cầu**:
- Skills (tags input với autocomplete)
- Skill level (optional)

**5. Thời hạn**:
- Application deadline* (date picker)
- Start date (optional)

**6. Cài đặt**:
- Status (Draft, Active)
- Email notifications (toggle)
- Auto-close when filled (toggle)

VALIDATION:
- Required fields marked with *
- Zod schema validation
- Real-time validation
- Error messages dưới mỗi field

FEATURES:
- Auto-save draft (every 30s)
- Preview modal (show job như applicant thấy)
- Duplicate job (pre-fill form)
- Rich text editor cho description (optional: TinyMCE, Quill, hoặc simple textarea)

TECHNICAL:
- React Hook Form + Zod
- React Query mutations
- Optimistic updates
- Toast notifications
- Unsaved changes warning (beforeunload)

API ENDPOINTS:
- POST `/api/jobs` - Create job
- PUT `/api/jobs/{id}` - Update job
- GET `/api/jobs/{id}` - Get job for edit
- POST `/api/jobs/{id}/duplicate` - Duplicate

COMPONENTS:
```
src/
  pages/
    employer/
      CreateJobPage.tsx
      EditJobPage.tsx
  components/
    employer/
      JobPostingForm.tsx
      JobPreviewModal.tsx
      RichTextEditor.tsx (optional)
```

FORM LAYOUT:
- Sticky sidebar với:
  * Save draft button
  * Preview button
  * Publish button
  * Form progress indicator
- Main content area với sections
- Responsive: Stack on mobile
```

---

### 3.3. Trang Quản Lý Đơn Ứng Tuyển (`/employer/applications`)

**Prompt:**

```
Tạo trang quản lý đơn ứng tuyển (EmployerApplicationsPage) với React 19 + TypeScript + Tailwind CSS.

LAYOUT:
- EmployerLayout wrapper
- Kanban board view hoặc Table view (toggle)
- Filter sidebar

FEATURES:

**View Modes**:

1. **Kanban Board View**:
   - Columns: Received, Reviewed, Interview, Offer, Hired, Rejected
   - Drag & drop để change status
   - Application card:
     * Applicant name và avatar
     * Job title
     * Applied date
     * Quick actions (View, Schedule interview, Reject)
   - Card count per column

2. **Table View**:
   - Columns: Applicant, Job, Applied date, Status, Actions
   - Sort by columns
   - Bulk actions

**Filter Sidebar**:
- Job filter (dropdown)
- Status filter (checkboxes)
- Date range
- Source (Direct, LinkedIn, etc.)
- Rating/Score (if available)
- Search by applicant name/email

**Application Card/Row Actions**:
- View details
- Download CV
- Change status
- Schedule interview
- Add notes
- Send message
- Reject with reason

**Bulk Actions**:
- Select multiple
- Bulk status change
- Bulk reject
- Export to CSV

**Stats Cards** (Top):
- Total applications
- Pending review
- Scheduled interviews
- Offers sent

TECHNICAL:
- React Query
- Drag & drop: @dnd-kit/core
- Optimistic updates
- Real-time updates (polling)
- Export to CSV functionality

API ENDPOINTS:
- GET `/api/applications/employer?page=0&size=50&jobId=&status=`
- PUT `/api/applications/{id}/status` - Change status
- POST `/api/interviews` - Schedule interview
- GET `/api/applications/{id}` - Detail

COMPONENTS:
```
src/
  pages/
    employer/
      EmployerApplicationsPage.tsx
  components/
    employer/
      ApplicationKanban.tsx
      ApplicationTable.tsx
      ApplicationCard.tsx
      ApplicationFilters.tsx
      ChangeStatusModal.tsx
      RejectModal.tsx
```

KANBAN DRAG & DROP:
- Smooth animations
- Visual feedback
- Confirmation for sensitive actions (Reject, Hire)
- Auto-save on drop
```

---

### 3.4. Trang Chi Tiết Đơn Ứng Tuyển (`/employer/applications/:id`)

**Prompt:**

```
Tạo trang chi tiết đơn ứng tuyển (ApplicationDetailPage) cho Employer với React 19 + TypeScript + Tailwind CSS.

LAYOUT:
- EmployerLayout wrapper
- 2 columns: Main content (70%) + Sidebar (30%)
- Sticky sidebar

MAIN CONTENT:

**1. Applicant Information**:
- Avatar và tên
- Contact info (email, phone)
- Location
- LinkedIn, GitHub, Portfolio links
- Bio/Summary

**2. Application Details**:
- Job applied for (link)
- Applied date
- Current status với timeline
- Cover letter (expandable)
- Resume viewer/download
- Additional documents

**3. Profile**:
- Skills (tags)
- Experience (timeline):
  * Job title
  * Company
  * Duration
  * Description
- Education:
  * Degree
  * School
  * Year
  * GPA
- Certifications
- Languages

**4. Interview History** (nếu có):
- Interview schedules
- Interviewer feedback
- Ratings
- Notes

**5. Activity Timeline**:
- Application submitted
- Status changes
- Interviews scheduled
- Notes added
- Messages sent

SIDEBAR:

**1. Quick Actions**:
- Change status (dropdown)
- Schedule interview
- Send message
- Download CV
- Print profile
- Share with team

**2. Status Management**:
- Current status badge
- Status change history
- Next action suggestion

**3. Interview Scheduling** (nếu status = REVIEWED):
- Quick schedule form:
  * Date & time picker
  * Interview type
  * Location/Meeting link
  * Interviewers
  * Notes
- Schedule button

**4. Notes Section**:
- Add private notes
- Notes history
- Tags

**5. Matching Score** (optional):
- Overall match: X%
- Skills match
- Experience match
- Location match

FEATURES:
- Resume viewer (PDF preview)
- Print-friendly version
- Export to PDF
- Email integration
- Keyboard shortcuts

TECHNICAL:
- React Query
- PDF viewer: react-pdf
- Rich text for notes
- Form validation
- Real-time updates

API ENDPOINTS:
- GET `/api/applications/{id}` - Full details
- PUT `/api/applications/{id}/status`
- POST `/api/applications/{id}/notes`
- POST `/api/interviews` - Schedule
- GET `/api/applications/{id}/timeline`

COMPONENTS:
```
src/
  pages/
    employer/
      ApplicationDetailPage.tsx
  components/
    employer/
      ApplicantProfile.tsx
      ApplicationTimeline.tsx
      InterviewScheduler.tsx
      ApplicationNotes.tsx
      ResumeViewer.tsx
      MatchingScore.tsx
```
```

---

### 3.5. Trang Lên Lịch Phỏng Vấn (`/employer/interviews`)

**Prompt:**

```
Tạo trang quản lý lịch phỏng vấn (EmployerInterviewsPage) với React 19 + TypeScript + Tailwind CSS.

LAYOUT:
- EmployerLayout wrapper
- Calendar view + List view (toggle)
- Schedule new interview button (prominent)

FEATURES:

**Calendar View**:
- Monthly/Weekly/Daily views
- Interviews marked on calendar
- Color coding by status
- Click to view details
- Drag to reschedule (optional)

**List View**:
- Grouped by date
- Interview card:
  * Applicant name và avatar
  * Job title
  * Interview type (PHONE, VIDEO, ONSITE, TECHNICAL, HR)
  * Date & time
  * Status badge
  * Interviewers
  * Actions: View, Edit, Cancel, Complete

**Schedule Interview Form/Modal**:
- Select application (autocomplete)
- Interview type*
- Date & time*
- Duration (default 60 min)
- Location/Meeting link*
- Interviewers (multi-select)
- Notes/Instructions
- Send email notification (toggle)
- Add to calendar (toggle)

**Interview Detail Modal**:
- Full information
- Applicant profile summary
- Interview feedback form (after interview):
  * Rating (1-5 stars)
  * Technical skills assessment
  * Communication skills
  * Cultural fit
  * Overall impression
  * Recommendation (Hire, Maybe, Reject)
  * Notes
- Mark as completed
- Reschedule
- Cancel

**Filter**:
- Status (Scheduled, Completed, Cancelled)
- Interview type
- Interviewer
- Date range
- Job

**Stats** (Top):
- Upcoming interviews (today, this week)
- Completed this month
- Pending feedback
- Average rating

TECHNICAL:
- React Query
- Calendar: react-big-calendar
- Date/time picker: react-datepicker
- Conflict checking (interviewer availability)
- Email notifications
- .ics file generation

API ENDPOINTS:
- GET `/api/interviews?page=0&size=50&status=&from=&to=`
- POST `/api/interviews` - Schedule
- PUT `/api/interviews/{id}` - Update
- PUT `/api/interviews/{id}/complete` - Mark complete
- PUT `/api/interviews/{id}/cancel` - Cancel
- GET `/api/interviews/{id}/conflicts` - Check conflicts

COMPONENTS:
```
src/
  pages/
    employer/
      EmployerInterviewsPage.tsx
  components/
    employer/
      InterviewCalendar.tsx
      InterviewList.tsx
      ScheduleInterviewModal.tsx
      InterviewDetailModal.tsx
      InterviewFeedbackForm.tsx
```

CONFLICT CHECKING:
- Check interviewer availability
- Check room availability (if onsite)
- Suggest alternative times
- Warning if too many interviews in one day
```

---

### 3.6. Trang Quản Lý Công Ty (`/employer/company`)

**Prompt:**

```
Tạo trang quản lý thông tin công ty (EmployerCompanyPage) với React 19 + TypeScript + Tailwind CSS.

LAYOUT:
- EmployerLayout wrapper
- Tabs: Thông tin cơ bản, Hình ảnh, Thành viên, Cài đặt

**Tab 1: Thông tin cơ bản**:
- Company logo upload (with preview)
- Company name*
- Industry*
- Company size* (select)
- Website
- Description (rich text, max 2000 chars)
- Address*
- City/Province*
- Country*
- Phone number*
- Contact email*
- Tax code
- Business license number
- Founded year
- Working hours
- Benefits (textarea, bullet points)
- Social links:
  * LinkedIn
  * Facebook
  * Twitter
  * Instagram

**Tab 2: Hình ảnh**:
- Cover photo upload
- Office photos gallery (multiple upload)
- Team photos
- Event photos
- Drag to reorder
- Delete photos
- Set as featured

**Tab 3: Thành viên** (Team management):
- List of team members:
  * Name
  * Email
  * Role (Admin, Recruiter, Interviewer)
  * Status
  * Actions (Edit, Remove)
- Invite new member button
- Invite form:
  * Email*
  * Role*
  * Send invitation email

**Tab 4: Cài đặt**:
- Verification status
- Email preferences
- Notification settings
- Privacy settings
- Billing information (optional)

FEATURES:
- Preview company page (as applicants see)
- Verification request (if not verified)
- Auto-save
- Image optimization
- Drag & drop for images

VALIDATION:
- Required fields
- Email format
- URL format
- Phone number format
- Image size limits (max 5MB per image)

TECHNICAL:
- React Hook Form + Zod
- React Query mutations
- Image upload với preview
- Drag & drop: react-dropzone
- Image cropper (optional)
- Optimistic updates

API ENDPOINTS:
- GET `/api/companies/my` - Get company info
- PUT `/api/companies/my` - Update company
- POST `/api/companies/my/logo` - Upload logo
- POST `/api/companies/my/photos` - Upload photos
- DELETE `/api/companies/my/photos/{id}` - Delete photo
- POST `/api/companies/my/members/invite` - Invite member
- DELETE `/api/companies/my/members/{id}` - Remove member

COMPONENTS:
```
src/
  pages/
    employer/
      EmployerCompanyPage.tsx
  components/
    employer/
      CompanyInfoForm.tsx
      CompanyPhotosManager.tsx
      CompanyMembersManager.tsx
      CompanySettings.tsx
      InviteMemberModal.tsx
      CompanyPreview.tsx
```
```

---

## 🎯 PHASE 4: TRANG ADMIN

### 4.1. Trang Quản Lý Người Dùng (`/admin/users`)

**Prompt:**

```
Tạo trang quản lý người dùng (AdminUsersPage) với React 19 + TypeScript + Tailwind CSS.

LAYOUT:
- AdminLayout wrapper
- Stats cards
- Filter bar
- DataTable với actions

STATS CARDS:
- Total users
- Active users
- Pending verification
- Blocked users

FILTER BAR:
- Search (name, email)
- Role filter (All, Admin, Employer, Applicant)
- Status filter (All, Active, Pending, Suspended, Blocked)
- Date range (Registered date)
- Sort by: Name, Email, Registered date

USER TABLE:
Columns:
- Avatar + Name
- Email
- Role badge
- Status badge
- Registered date
- Last login
- Actions dropdown:
  * View profile
  * Edit
  * Change role
  * Change status (Activate, Suspend, Block)
  * Reset password
  * Delete (with confirmation)

**User Detail Modal**:
- Full user information
- Activity history
- Applications (if applicant)
- Jobs posted (if employer)
- Company info (if employer)
- Login history
- Actions

**Edit User Modal**:
- First name, Last name
- Email (readonly)
- Phone number
- Role (select)
- Status (select)
- Notes

**Bulk Actions**:
- Select multiple users
- Bulk status change
- Bulk delete
- Export to CSV

TECHNICAL:
- React Query với pagination
- DataTable component
- Confirmation modals
- Toast notifications
- Export functionality

API ENDPOINTS:
- GET `/api/admin/users?page=0&size=20&role=&status=&search=`
- GET `/api/admin/users/{id}` - User details
- PUT `/api/admin/users/{id}` - Update user
- PUT `/api/admin/users/{id}/role` - Change role
- PUT `/api/admin/users/{id}/status` - Change status
- DELETE `/api/admin/users/{id}` - Delete user
- POST `/api/admin/users/{id}/reset-password` - Reset password

COMPONENTS:
```
src/
  pages/
    admin/
      AdminUsersPage.tsx
  components/
    admin/
      UsersTable.tsx
      UsersStats.tsx
      UserDetailModal.tsx
      EditUserModal.tsx
      UserFilters.tsx
```

STATUS COLORS:
- ACTIVE: green
- PENDING: yellow
- SUSPENDED: orange
- BLOCKED: red
```

---

### 4.2. Trang Quản Lý Công Ty (`/admin/companies`)

**Prompt:**

```
Tạo trang quản lý công ty (AdminCompaniesPage) với React 19 + TypeScript + Tailwind CSS.

LAYOUT:
- AdminLayout wrapper
- Stats cards
- Filter bar
- Grid/Table view toggle

STATS:
- Total companies
- Verified companies
- Pending verification
- Active job postings

FILTER:
- Search (name, tax code)
- Industry filter
- Company size filter
- Verification status
- City filter
- Sort by: Name, Created date, Jobs count

COMPANY CARD/ROW:
- Logo
- Company name
- Industry
- Company size
- Verification badge
- Active jobs count
- Total applications
- Created date
- Actions:
  * View details
  * Verify/Unverify
  * Suspend
  * Delete

**Company Detail Modal**:
- Full company information
- Verification documents
- Team members
- Job postings
- Statistics
- Activity log
- Verification actions

**Verification Modal**:
- Company documents review
- Tax code verification
- Business license verification
- Approve/Reject buttons
- Rejection reason (if reject)

TECHNICAL:
- React Query
- Image viewer cho documents
- Verification workflow
- Toast notifications

API ENDPOINTS:
- GET `/api/admin/companies?page=0&size=20&verified=&industry=`
- GET `/api/admin/companies/{id}` - Details
- PUT `/api/admin/companies/{id}/verify` - Verify
- PUT `/api/admin/companies/{id}/reject` - Reject verification
- DELETE `/api/admin/companies/{id}` - Delete

COMPONENTS:
```
src/
  pages/
    admin/
      AdminCompaniesPage.tsx
  components/
    admin/
      CompaniesGrid.tsx
      CompanyCard.tsx
      CompanyDetailModal.tsx
      VerificationModal.tsx
      CompanyFilters.tsx
```
```

---

### 4.3. Trang Quản Lý Tin Tuyển Dụng (`/admin/jobs`)

**Prompt:**

```
Tạo trang quản lý tin tuyển dụng (AdminJobsPage) với React 19 + TypeScript + Tailwind CSS.

LAYOUT:
- AdminLayout wrapper
- Stats cards
- Filter bar
- Table view

STATS:
- Total jobs
- Active jobs
- Total applications
- Jobs expiring soon

FILTER:
- Search (job title, company)
- Status filter
- Company filter
- Date range
- Location filter
- Sort by: Created date, Applications count, Views

JOB TABLE:
Columns:
- Job title
- Company name
- Status badge
- Posted date
- Deadline
- Applications count
- Views count
- Actions:
  * View
  * Approve/Reject (if moderation enabled)
  * Close
  * Delete

**Job Detail Modal**:
- Full job information
- Company info
- Applications list
- Statistics
- Activity log
- Moderation actions

TECHNICAL:
- React Query
- DataTable
- Moderation workflow (optional)

API ENDPOINTS:
- GET `/api/admin/jobs?page=0&size=20&status=&companyId=`
- GET `/api/admin/jobs/{id}` - Details
- PUT `/api/admin/jobs/{id}/status` - Change status
- DELETE `/api/admin/jobs/{id}` - Delete

COMPONENTS:
```
src/
  pages/
    admin/
      AdminJobsPage.tsx
  components/
    admin/
      JobsTable.tsx
      JobDetailModal.tsx
      JobFilters.tsx
```
```

---

## 🎯 PHASE 5: COMPONENTS NÂNG CAO

### 5.1. Charts & Analytics Components

**Prompt:**

```
Tạo các chart components cho dashboard sử dụng Recharts với React 19 + TypeScript + Tailwind CSS.

COMPONENTS CẦN TẠO:

**1. ApplicationsChart.tsx** - Line chart:
- X-axis: Thời gian (7 ngày, 30 ngày, 3 tháng, 1 năm)
- Y-axis: Số lượng applications
- Multiple lines: Received, Reviewed, Hired, Rejected
- Tooltip với details
- Legend
- Responsive

**2. JobsChart.tsx** - Bar chart:
- X-axis: Tháng
- Y-axis: Số lượng jobs
- Stacked bars: Active, Closed, Expired
- Tooltip
- Legend

**3. HiringFunnelChart.tsx** - Funnel chart:
- Stages: Applications → Reviewed → Interview → Offer → Hired
- Conversion rates
- Tooltips

**4. SkillsChart.tsx** - Radar chart:
- Skills assessment
- Multiple candidates comparison
- Interactive

**5. SalaryRangeChart.tsx** - Area chart:
- Salary distribution
- Min, Max, Average lines
- Tooltips

**6. CompanyGrowthChart.tsx** - Line chart:
- Growth metrics over time
- Multiple metrics: Jobs, Applications, Hires
- Smooth curves

COMMON FEATURES:
- Responsive design
- Dark mode support
- Loading states
- Empty states
- Export to image (optional)
- Custom tooltips
- Animations

TECHNICAL:
- Recharts library
- TypeScript types
- Tailwind colors
- date-fns for date formatting

FILE STRUCTURE:
```
src/
  components/
    charts/
      ApplicationsChart.tsx
      JobsChart.tsx
      HiringFunnelChart.tsx
      SkillsChart.tsx
      SalaryRangeChart.tsx
      CompanyGrowthChart.tsx
      ChartContainer.tsx (wrapper)
      ChartTooltip.tsx (custom tooltip)
```

USAGE EXAMPLE:
```tsx
<ApplicationsChart
  data={applicationsData}
  period="30days"
  height={300}
/>
```

COLOR PALETTE (sử dụng Tailwind):
- Primary: blue-500
- Success: green-500
- Warning: yellow-500
- Danger: red-500
- Info: purple-500
```

---

### 5.2. Advanced Form Components

**Prompt:**

```
Tạo các form components nâng cao với React Hook Form + Zod validation.

COMPONENTS:

**1. RichTextEditor.tsx**:
- Toolbar: Bold, Italic, Underline, Lists, Links
- Character counter
- Preview mode
- Markdown support (optional)
- Validation
- Error display

**2. DateRangePicker.tsx**:
- Start date + End date
- Presets: Today, Last 7 days, Last 30 days, This month, Custom
- Calendar popup
- Validation (start < end)
- Clear button

**3. MultiSelect.tsx**:
- Search/filter options
- Select all/none
- Selected count badge
- Chips for selected items
- Validation
- Async options loading (optional)

**4. FileUploader.tsx**:
- Drag & drop zone
- File type validation
- File size validation
- Multiple files support
- Upload progress
- Preview (images, PDFs)
- Remove file button
- Error handling

**5. TagsInput.tsx**:
- Add tags by typing + Enter
- Remove tags
- Autocomplete suggestions
- Max tags limit
- Validation
- Custom tag colors

**6. LocationPicker.tsx**:
- Address autocomplete
- City/Province selector
- Map integration (optional)
- Validation

**7. SalaryRangeInput.tsx**:
- Min/Max inputs
- Currency selector
- Salary type (Monthly, Yearly, Hourly)
- Validation (min < max)
- Formatted display

COMMON FEATURES:
- React Hook Form integration
- Zod validation
- Error messages
- Disabled state
- Loading state
- Accessible (ARIA)
- TypeScript types

FILE STRUCTURE:
```
src/
  components/
    forms/
      RichTextEditor.tsx
      DateRangePicker.tsx
      MultiSelect.tsx
      FileUploader.tsx
      TagsInput.tsx
      LocationPicker.tsx
      SalaryRangeInput.tsx
      FormField.tsx (wrapper)
      FormError.tsx
```

USAGE EXAMPLE:
```tsx
<FormField
  control={control}
  name="description"
  label="Mô tả công việc"
  required
  render={({ field }) => (
    <RichTextEditor
      {...field}
      placeholder="Nhập mô tả..."
      maxLength={2000}
    />
  )}
/>
```
```

---

### 5.3. Modal & Dialog Components

**Prompt:**

```
Tạo các modal/dialog components reusable với React 19 + TypeScript + Tailwind CSS.

COMPONENTS:

**1. Modal.tsx** - Base modal:
- Overlay với backdrop
- Close button (X)
- Close on overlay click (optional)
- Close on ESC key
- Sizes: sm, md, lg, xl, full
- Animations: fade in/out
- Scroll behavior
- Accessible (focus trap, ARIA)

**2. ConfirmDialog.tsx**:
- Title
- Message/Description
- Confirm button (danger/primary)
- Cancel button
- Icon (optional)
- Async confirm action
- Loading state

**3. AlertDialog.tsx**:
- Type: success, error, warning, info
- Icon
- Title
- Message
- OK button
- Auto-close timer (optional)

**4. Drawer.tsx** - Side drawer:
- Position: left, right, top, bottom
- Overlay
- Slide animation
- Close button
- Sizes

**5. Popover.tsx**:
- Trigger element
- Content
- Position: top, bottom, left, right, auto
- Arrow
- Close on outside click
- Offset

**6. Tooltip.tsx**:
- Hover/focus trigger
- Position: top, bottom, left, right
- Delay
- Arrow
- Max width

FEATURES:
- Portal rendering (React.createPortal)
- Focus management
- Keyboard navigation
- Animations
- Responsive
- Accessible

FILE STRUCTURE:
```
src/
  components/
    ui/
      modal.tsx
      confirm-dialog.tsx
      alert-dialog.tsx
      drawer.tsx
      popover.tsx
      tooltip.tsx
```

USAGE EXAMPLE:
```tsx
<ConfirmDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Xác nhận xóa"
  description="Bạn có chắc chắn muốn xóa tin tuyển dụng này?"
  confirmText="Xóa"
  confirmVariant="destructive"
  onConfirm={handleDelete}
/>
```
```

---

## 🎨 DESIGN GUIDELINES

### Color System

```css
/* Primary Colors */
--primary: 221.2 83.2% 53.3%;        /* Blue #3B82F6 */
--primary-foreground: 210 40% 98%;   /* White text on primary */

/* Semantic Colors */
--success: 142 76% 36%;              /* Green */
--warning: 38 92% 50%;               /* Yellow */
--error: 0 84.2% 60.2%;              /* Red */
--info: 221 83% 53%;                 /* Blue */

/* Status Colors */
--status-draft: 220 13% 46%;         /* Gray */
--status-active: 142 76% 36%;        /* Green */
--status-paused: 38 92% 50%;         /* Yellow */
--status-closed: 0 84% 60%;          /* Red */
```

### Typography

```css
/* Headings */
h1: text-3xl md:text-4xl font-bold
h2: text-2xl md:text-3xl font-bold
h3: text-xl md:text-2xl font-semibold
h4: text-lg md:text-xl font-semibold

/* Body */
body: text-base (16px)
small: text-sm (14px)
tiny: text-xs (12px)

/* Font Weights */
normal: 400
medium: 500
semibold: 600
bold: 700
```

### Spacing

```css
/* Consistent spacing scale */
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

### Border Radius

```css
sm: 0.25rem (4px)
md: 0.375rem (6px)
lg: 0.5rem (8px)
xl: 0.75rem (12px)
2xl: 1rem (16px)
full: 9999px
```

### Shadows

```css
sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

### Animations

```css
/* Transitions */
transition-all: all 150ms cubic-bezier(0.4, 0, 0.2, 1)

/* Hover effects */
hover:scale-105
hover:shadow-lg
hover:bg-primary/90

/* Loading */
animate-spin
animate-pulse
animate-bounce
```

### Component Patterns

**Card Pattern:**
```tsx
<div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
  {/* Content */}
</div>
```

**Button Pattern:**
```tsx
<Button
  variant="default" // default, destructive, outline, secondary, ghost, link
  size="default"    // default, sm, lg, icon
  className="..."
>
  {/* Content */}
</Button>
```

**Badge Pattern:**
```tsx
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
  {/* Text */}
</span>
```

**Input Pattern:**
```tsx
<input
  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
/>
```

### Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Accessibility

- Always use semantic HTML
- Include ARIA labels
- Keyboard navigation support
- Focus visible states
- Color contrast ratio ≥ 4.5:1
- Screen reader friendly

---

## 📝 IMPLEMENTATION CHECKLIST

Sau khi hoàn thành mỗi trang, check:

- [ ] TypeScript types đầy đủ, không có `any`
- [ ] React Query được sử dụng đúng cách
- [ ] Form validation với Zod
- [ ] Error handling và error states
- [ ] Loading states với Skeleton
- [ ] Empty states với EmptyState component
- [ ] Toast notifications cho user feedback
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility (ARIA, keyboard navigation)
- [ ] Dark mode support
- [ ] Comments cho logic phức tạp
- [ ] Consistent naming conventions
- [ ] Reusable components
- [ ] Performance optimization (memo, useMemo, useCallback nếu cần)

---

## 🚀 NEXT STEPS

1. **Bắt đầu với Phase 1** - Trang public (ưu tiên cao nhất)
2. **Test thoroughly** - Mỗi trang sau khi hoàn thành
3. **Refactor** - Extract reusable components
4. **Optimize** - Performance và bundle size
5. **Document** - Update README với screenshots

---

**LƯU Ý QUAN TRỌNG**:

- Tất cả API endpoints đã có sẵn trong backend
- Sử dụng `api.ts` service functions đã được định nghĩa
- Follow design system hiện tại để đảm bảo consistency
- Responsive design là bắt buộc
- Dark mode phải hoạt động tốt
- Accessibility là ưu tiên

**Bắt đầu từ đâu?**
Tôi khuyến nghị bắt đầu với **Trang Chi Tiết Việc Làm** (`/jobs/:id`) vì đây là trang quan trọng nhất và được sử dụng nhiều nhất.
