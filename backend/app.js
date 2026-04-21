const express = require('express');
const cors = require('cors');
const path = require('path'); // <--- Đã thêm thư viện path ở đây
const ApiError = require('./app/api-error');

const app = express();

// --- 1. MIDDLEWARE TOÀN CỤC ---
app.use(cors()); // Cho phép Frontend gọi API (Cross-Origin Resource Sharing)
app.use(express.json()); // Phân tích các request có body định dạng JSON
app.use(express.urlencoded({ extended: true })); // Phân tích form data

// Cho phép truy cập thư mục ảnh công khai
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 2. ĐỊNH NGHĨA ROUTES CHÍNH ---
const authRoutes = require('./app/routes/auth.route');
const nxbRoutes = require('./app/routes/nhaxuatban.route'); 
const sachRoutes = require('./app/routes/sach.route'); 
const uploadRoutes = require('./app/routes/upload.route'); 
const docGiaRoutes = require('./app/routes/docgia.route'); 
const phieuMuonRoutes = require('./app/routes/phieumuon.route');
const caiDatRoutes = require('./app/routes/caidat.route'); 
const thongKeRoutes = require('./app/routes/thongke.route'); 

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Chào mừng đến với API Quản lý Thư viện!",
        data: null,
        error: null
    });
});

// Đăng ký các Route vào Express
app.use('/api/auth', authRoutes);
app.use('/api/publishers', nxbRoutes);
app.use('/api/books', sachRoutes);
app.use('/api/upload', uploadRoutes); 
app.use('/api/readers', docGiaRoutes); 
app.use('/api/borrows', phieuMuonRoutes);
app.use('/api/settings', caiDatRoutes);
app.use('/api/stats', thongKeRoutes);

// --- 3. XỬ LÝ LỖI (ERROR HANDLING) ---

// Bắt lỗi 404: Khi người dùng truy cập một route không tồn tại
app.use((req, res, next) => {
    return next(new ApiError(404, "Không tìm thấy tài nguyên (Route không tồn tại)"));
});

// Middleware xử lý lỗi tổng (Global Error Handler)
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Lỗi máy chủ nội bộ";

    return res.status(statusCode).json({
        success: false,
        message: message,
        data: null,
        error: process.env.NODE_ENV === 'development' ? error.stack : error
    });
});

module.exports = app;