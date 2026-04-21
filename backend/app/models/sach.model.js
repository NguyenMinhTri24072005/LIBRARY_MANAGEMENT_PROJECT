const mongoose = require('mongoose');

const sachSchema = new mongoose.Schema({
    tenSach: { type: String, required: true },
    donGia: { type: Number, required: true },
    soQuyen: { type: Number, required: true }, // Tổng số lượng nhập kho
    soQuyenHienTai: { type: Number, required: true }, // Số lượng đang sẵn có trên kệ (Sẽ trừ khi có người mượn)
    namXuatBan: { type: Number },
    maNXB: { type: mongoose.Schema.Types.ObjectId, ref: 'NhaXuatBan', required: true }, // Khóa ngoại
    tacGia: { type: String, required: true },
    hinhAnh: { type: String, default: '' }, // Đường dẫn ảnh bìa sách
    trangThai: { type: Boolean, default: true } // true = Đang hiển thị, false = Bị ẩn
}, { timestamps: true });

module.exports = mongoose.model('Sach', sachSchema);