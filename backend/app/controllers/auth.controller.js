const authService = require('../services/auth.service');

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