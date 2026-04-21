const express = require('express');
const cors = require('cors');
const ApiError = require('./app/api-error');

const app = express();

// --- 1. MIDDLEWARE TOÀN CỤC ---
app.use(cors()); // Cho phép Frontend gọi API (Cross-Origin Resource Sharing)
app.use(express.json()); // Phân tích các request có body định dạng JSON
app.use(express.urlencoded({ extended: true })); // Phân tích form data

// --- 2. ĐỊNH NGHĨA ROUTES CHÍNH (Sẽ import sau) ---
const authRoutes = require('./app/routes/auth.route');

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Chào mừng đến với API Quản lý Thư viện!",
        data: null,
        error: null
    });
});

app.use('/api/auth', authRoutes);
// app.use('/api/books', bookRoutes);
// ...

// --- 3. XỬ LÝ LỖI (ERROR HANDLING) ---

// Bắt lỗi 404: Khi người dùng truy cập một route không tồn tại
app.use((req, res, next) => {
    return next(new ApiError(404, "Không tìm thấy tài nguyên (Route không tồn tại)"));
});

// Middleware xử lý lỗi tổng (Global Error Handler)
// Mọi lỗi từ try/catch được next(error) sẽ chạy vào đây
app.use((error, req, res, next) => {
    // Trạng thái mặc định là 500 (Internal Server Error) nếu không được chỉ định
    const statusCode = error.statusCode || 500;
    const message = error.message || "Lỗi máy chủ nội bộ";

    // Trả về JSON chuẩn hóa theo yêu cầu
    return res.status(statusCode).json({
        success: false,
        message: message,
        data: null,
        error: process.env.NODE_ENV === 'development' ? error.stack : error // Ẩn stack trace nếu là production
    });
});

module.exports = app;