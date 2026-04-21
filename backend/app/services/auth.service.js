const bcrypt = require('bcrypt');
const { DocGia, NhanVien } = require('../models');
const { generateToken } = require('../utils/jwt.util');
const ApiError = require('../api-error');

class AuthService {
    // Đăng ký cho Độc Giả
    async registerDocGia(data) {
        const { hoLot, ten, phai, dienThoai, password, diaChi, ngaySinh } = data;

        // 1. Kiểm tra SĐT đã tồn tại chưa
        const existingUser = await DocGia.findOne({ dienThoai });
        if (existingUser) {
            throw new ApiError(400, 'Số điện thoại đã được đăng ký!');
        }

        // 2. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Tạo độc giả mới
        const newDocGia = await DocGia.create({
            hoLot, ten, phai, dienThoai, diaChi, ngaySinh,
            password: hashedPassword
        });

        // 4. Loại bỏ password trước khi trả về
        const userResponse = newDocGia.toObject();
        delete userResponse.password;

        return userResponse;
    }

    // Đăng nhập chung cho Độc Giả và Nhân Viên
    async login(dienThoai, password, role) {
        let user = null;

        // 1. Tìm user theo role
        if (role === 'admin') {
            user = await NhanVien.findOne({ soDienThoai: dienThoai });
        } else {
            user = await DocGia.findOne({ dienThoai });
        }

        if (!user) {
            throw new ApiError(404, 'Tài khoản không tồn tại!');
        }

        // 2. Kiểm tra tài khoản Độc giả có bị khóa không
        if (role === 'user' && user.trangThai === false) {
            throw new ApiError(403, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ thủ thư!');
        }

        // 3. Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError(401, 'Mật khẩu không chính xác!');
        }

        // 4. Tạo JWT Token
        const payload = {
            id: user._id,
            role: role
        };
        const token = generateToken(payload);

        // 5. Chuẩn bị dữ liệu trả về
        const userResponse = user.toObject();
        delete userResponse.password;

        return { user: userResponse, token };
    }
}

module.exports = new AuthService();