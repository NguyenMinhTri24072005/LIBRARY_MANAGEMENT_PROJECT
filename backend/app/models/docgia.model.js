const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema({
    hoLot: { type: String, required: true },
    ten: { type: String, required: true },
    ngaySinh: { type: Date },
    phai: { type: String, enum: ['Nam', 'Nữ', 'Khác'] },
    diaChi: { type: String },
    dienThoai: { type: String, required: true, unique: true }, // Dùng SĐT làm tài khoản đăng nhập
    password: { type: String, required: true },
    diemUyTin: { type: Number, default: 100 }, // Điểm uy tín, trừ khi trả trễ, cộng khi trả đúng hạn
    trangThai: { type: Boolean, default: true }, // true = Hoạt động, false = Bị khóa (không cho mượn)
    avatar: { type: String, default: "" }, // Thêm trường lưu ảnh đại diện
}, { timestamps: true });

module.exports = mongoose.model('DocGia', docGiaSchema);