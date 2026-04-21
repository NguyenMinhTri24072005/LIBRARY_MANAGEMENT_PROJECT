const mongoose = require('mongoose');

const phieuMuonSchema = new mongoose.Schema({
    maDocGia: { type: mongoose.Schema.Types.ObjectId, ref: 'DocGia', required: true },
    maSach: { type: mongoose.Schema.Types.ObjectId, ref: 'Sach', required: true },
    ngayMuon: { type: Date }, // Admin cập nhật khi duyệt đơn
    hanTra: { type: Date }, // Tính toán dựa trên Cài đặt hệ thống
    ngayTraThucTe: { type: Date }, // Cập nhật khi độc giả đem sách tới trả
    trangThai: { 
        type: String, 
        enum: ['CHO_DUYET', 'DANG_MUON', 'DA_TRA', 'DA_HUY'], 
        default: 'CHO_DUYET' 
    },
    tienPhat: { type: Number, default: 0 }, // Tiền phạt tính khi trả trễ
    daThanhToanPhat: { type: Boolean, default: false }, // Đánh dấu đã đóng phạt hay chưa
    soLanGiaHan: { type: Number, default: 0 },
    trangThaiGiaHan: { 
        type: String, 
        enum: ['KHONG', 'CHO_DUYET_GIA_HAN', 'DA_GIA_HAN', 'TU_CHOI_GIA_HAN'], 
        default: 'KHONG' 
    }
}, { timestamps: true });

module.exports = mongoose.model('PhieuMuon', phieuMuonSchema);