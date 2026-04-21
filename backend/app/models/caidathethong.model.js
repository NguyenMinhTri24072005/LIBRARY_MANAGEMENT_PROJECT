const mongoose = require('mongoose');

const caiDatHeThongSchema = new mongoose.Schema({
    soNgayMuonToiDa: { type: Number, default: 14 }, // Hạn mượn mặc định (ngày)
    phiPhatTrenNgay: { type: Number, default: 5000 }, // Tiền phạt mỗi ngày trễ (VNĐ)
    soSachMuonToiDa: { type: Number, default: 5 } // Số sách tối đa 1 độc giả được mượn cùng lúc
}, { timestamps: true });

module.exports = mongoose.model('CaiDatHeThong', caiDatHeThongSchema);