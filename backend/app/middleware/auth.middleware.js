const jwt = require('jsonwebtoken');
const ApiError = require('../api-error');

// Kiểm tra xem người dùng đã đăng nhập chưa (Có Token hợp lệ không)
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError(401, "Không tìm thấy Token xác thực!"));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin user (id, role) vào req để các controller sau sử dụng
        next();
    } catch (error) {
        return next(new ApiError(401, "Token không hợp lệ hoặc đã hết hạn!"));
    }
};

// Kiểm tra xem người dùng có phải là Admin (Nhân viên) không
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return next(new ApiError(403, "Bạn không có quyền truy cập tài nguyên này (Yêu cầu quyền Admin)!"));
    }
};