# 📚 DỰ ÁN QUẢN LÝ THƯ VIỆN (MEVN STACK) - BẢNG TIẾN ĐỘ

## 🟢 GIAI ĐOẠN 1: KHỞI TẠO DỰ ÁN (HOÀN THÀNH)
- [x] Khởi tạo cây thư mục chuẩn cho `backend` và `frontend`.
- [x] Khởi tạo `package.json` và cài đặt các thư viện cần thiết (Express, Mongoose, Vue 3, Vite...).
- [x] Thiết lập script `combine.js` để xuất toàn bộ mã nguồn ra file `project_combined.txt`.
- [x] Xây dựng và tối ưu hóa System Instruction cho AI.

## 🟡 GIAI ĐOẠN 2: CẤU HÌNH SERVER & DATABASE (ĐANG THỰC HIỆN)
- [ ] Cấu hình biến môi trường (`backend/.env`).
- [ ] Thiết lập `backend/app/api-error.js` (Custom Error Handler).
- [ ] Thiết lập `backend/app.js` (Cấu hình Express, CORS, Middleware).
- [ ] Thiết lập `backend/server.js` (Kết nối Mongoose và khởi động Server).

## ⚪ GIAI ĐOẠN 3: XÂY DỰNG DATABASE SCHEMA (MODELS)
- [ ] Model `CaiDatHeThong` (Cấu hình phí phạt, thời gian mượn).
- [ ] Model `NhanVien` (Admin / Thủ thư).
- [ ] Model `DocGia` (Độc giả - Tích hợp điểm uy tín).
- [ ] Model `NhaXuatBan` & `Sach`.
- [ ] Model `PhieuMuon` (Quản lý mượn/trả/phạt).
- [ ] Model `GiaoDich` (Doanh thu).
- [ ] Model `ThongBao` (Hệ thống thông báo).

## ⚪ GIAI ĐOẠN 4: XÂY DỰNG API (BACKEND)
- [ ] Logic Xác thực (Auth): Đăng ký, Đăng nhập, tạo JWT Token.
- [ ] Middleware kiểm tra quyền (Verify Token, Check Admin).
- [ ] API Quản lý Sách & NXB (CRUD).
- [ ] API Quản lý Độc giả (Khóa/Mở tài khoản).
- [ ] API Xử lý Nghiệp vụ Mượn/Trả (Tạo phiếu, duyệt đơn, trả sách, tính phạt).

## ⚪ GIAI ĐOẠN 5: XÂY DỰNG GIAO DIỆN (FRONTEND)
- [ ] Thiết lập `main.js`, `style.css` và CSS Variables.
- [ ] Cấu hình `vue-router` và Navigation Guards (Bảo vệ route Admin).
- [ ] Thiết lập Pinia Store (`auth.store.js`, `cart.store.js`).
- [ ] **Giao diện Admin**:
  - [ ] Layout & Sidebar.
  - [ ] Dashboard (Thống kê doanh thu, sách mượn).
  - [ ] Quản lý Sách / Độc giả / Phiếu mượn.
- [ ] **Giao diện Độc giả**:
  - [ ] Layout & Header.
  - [ ] Đăng nhập / Đăng ký.
  - [ ] Danh sách sách & Tìm kiếm.
  - [ ] Giỏ sách & Lịch sử mượn trả.