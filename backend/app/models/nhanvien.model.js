const mongoose = require('mongoose');

const nhanVienSchema = new mongoose.Schema({
    hoTenNV: { type: String, required: true },
    password: { type: String, required: true },
    chucVu: { type: String, default: 'Thủ thư' },
    diaChi: { type: String },
    soDienThoai: { type: String, required: true, unique: true }, // Dùng SĐT làm tài khoản đăng nhập
    hinhAnh: { type: String, default: "" }, // Thêm trường lưu ảnh đại diện
}, { timestamps: true });

module.exports = mongoose.model('NhanVien', nhanVienSchema);