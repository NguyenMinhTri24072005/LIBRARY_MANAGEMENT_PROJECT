const { DocGia, Sach, PhieuMuon } = require('../models');

class ThongKeService {
    async getDashboardStats() {
        // 1. Tổng số độc giả đang hoạt động
        const tongDocGia = await DocGia.countDocuments({ trangThai: true });

        // 2. Tổng số sách trong kho (Tính theo trường soQuyen)
        const tongSachResult = await Sach.aggregate([
            { $match: { trangThai: true } },
            { $group: { _id: null, total: { $sum: '$soQuyen' } } }
        ]);
        const tongSach = tongSachResult.length > 0 ? tongSachResult[0].total : 0;

        // 3. Số lượng phiếu đang mượn (Chưa trả)
        const phieuDangMuon = await PhieuMuon.countDocuments({ trangThai: 'DANG_MUON' });

        // 4. Tổng doanh thu tiền phạt đã thu
        const doanhThuResult = await PhieuMuon.aggregate([
            { $match: { daThanhToanPhat: true } },
            { $group: { _id: null, total: { $sum: '$tienPhat' } } }
        ]);
        const tongDoanhThu = doanhThuResult.length > 0 ? doanhThuResult[0].total : 0;

        // 5. Top 5 sách được mượn nhiều nhất
        const topSach = await PhieuMuon.aggregate([
            { $match: { trangThai: { $ne: 'DA_HUY' } } }, // Bỏ qua các phiếu đã hủy
            { $group: { _id: '$maSach', luotMuon: { $sum: 1 } } }, // Gom nhóm theo mã sách và đếm
            { $sort: { luotMuon: -1 } }, // Sắp xếp giảm dần
            { $limit: 5 }, // Lấy 5 cuốn
            // Lookup để lấy thông tin chi tiết của sách từ collection 'saches' (Mongoose tự thêm 'es' hoặc 's')
            { $lookup: { from: 'saches', localField: '_id', foreignField: '_id', as: 'sachInfo' } },
            { $unwind: '$sachInfo' },
            { 
                $project: { 
                    _id: 1, 
                    luotMuon: 1, 
                    tenSach: '$sachInfo.tenSach', 
                    hinhAnh: '$sachInfo.hinhAnh' 
                } 
            }
        ]);

        return {
            tongDocGia,
            tongSach,
            phieuDangMuon,
            tongDoanhThu,
            topSach
        };
    }
}

module.exports = new ThongKeService();