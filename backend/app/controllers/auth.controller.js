const authService = require('../services/auth.service');
const ApiError = require('../api-error');
const DocGia = require('../models/docgia.model');
const NhanVien = require('../models/nhanvien.model');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
    try {
        const newUser = await authService.registerDocGia(req.body);
        return res.status(201).json({
            success: true,
            message: 'Đăng ký tài khoản thành công!',
            data: newUser
        });
    } catch (error) {
        return next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { dienThoai, password, role } = req.body;
        
        if (!dienThoai || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp đủ số điện thoại, mật khẩu và quyền (role)!"
            });
        }

        const result = await authService.login(dienThoai, password, role);
        
        return res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            data: result
        });
    } catch (error) {
        return next(error);
    }
};

// Lấy thông tin người dùng hiện tại từ token
exports.getMe = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        let userData;

        if (role === 'admin' || role === 'nhanvien') {
            userData = await NhanVien.findById(id).select('-password');
        } else {
            userData = await DocGia.findById(id).select('-password');
        }

        if (!userData) {
            return next(new ApiError(404, "Không tìm thấy người dùng"));
        }

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin thành công",
            data: userData
        });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi lấy thông tin cá nhân"));
    }
};

// Người dùng tự cập nhật thông tin
exports.updateMe = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const updateData = { ...req.body };
        
        // Không cho phép tự đổi password/role/uy tín qua API này
        delete updateData.password;
        delete updateData.role;
        delete updateData.diemUyTin;

        let updatedUser;
        if (role === 'admin' || role === 'nhanvien') {
            updatedUser = await NhanVien.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        } else {
            updatedUser = await DocGia.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        }

        return res.status(200).json({
            success: true,
            message: "Cập nhật thông tin thành công",
            data: updatedUser
        });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi cập nhật thông tin"));
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return next(new ApiError(400, "Vui lòng nhập đầy đủ mật khẩu cũ và mới."));
        }

        // 1. Tìm User (Admin hoặc Độc giả)
        let user;
        if (role === 'admin' || role === 'nhanvien') {
            user = await NhanVien.findById(id);
        } else {
            user = await DocGia.findById(id);
        }

        if (!user) return next(new ApiError(404, "Không tìm thấy người dùng."));

        // 2. Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return next(new ApiError(400, "Mật khẩu cũ không chính xác."));
        }

        // 3. Mã hóa và lưu mật khẩu mới
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Đổi mật khẩu thành công!"
        });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi đổi mật khẩu"));
    }
};