const { DocGia, Sach, PhieuMuon } = require('../models');

class ThongKeService {
    async getDashboardStats(query) {
        // Tạo bộ lọc thời gian nếu Admin có truyền lên
        let matchDate = {};
        if (query.fromDate && query.toDate) {
            matchDate.createdAt = {
                $gte: new Date(query.fromDate),
                $lte: new Date(query.toDate + 'T23:59:59.999Z')
            };
        }

        // 1. Tổng số độc giả (Không phụ thuộc ngày)
        const tongDocGia = await DocGia.countDocuments({ trangThai: true });

        // 2. Tổng số sách (Không phụ thuộc ngày)
        const tongSachResult = await Sach.aggregate([
            { $match: { trangThai: true } },
            { $group: { _id: null, total: { $sum: '$soQuyen' } } }
        ]);
        const tongSach = tongSachResult.length > 0 ? tongSachResult[0].total : 0;

        // 3. Số lượng phiếu mượn TRONG KHOẢNG THỜI GIAN ĐÓ
        const soLuotMuon = await PhieuMuon.countDocuments({ ...matchDate, trangThai: { $ne: 'DA_HUY' } });

        // 4. Tổng doanh thu TRONG KHOẢNG THỜI GIAN ĐÓ (Dựa vào ngày trả thực tế)
        let matchDoanhThu = { daThanhToanPhat: true };
        if (query.fromDate && query.toDate) {
            matchDoanhThu.ngayTraThucTe = {
                $gte: new Date(query.fromDate),
                $lte: new Date(query.toDate + 'T23:59:59.999Z')
            };
        }
        const doanhThuResult = await PhieuMuon.aggregate([
            { $match: matchDoanhThu },
            { $group: { _id: null, total: { $sum: '$tienPhat' } } }
        ]);
        const tongDoanhThu = doanhThuResult.length > 0 ? doanhThuResult[0].total : 0;

        // 5. Dữ liệu cho BIỂU ĐỒ (Nhóm lượt mượn theo ngày)
        const chartData = await PhieuMuon.aggregate([
            { $match: { ...matchDate, trangThai: { $ne: 'DA_HUY' } } },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
                    count: { $sum: 1 } 
                } 
            },
            { $sort: { _id: 1 } } // Sắp xếp ngày tăng dần
        ]);

        // 6. Top 5 sách
        const topSach = await PhieuMuon.aggregate([
            { $match: { ...matchDate, trangThai: { $ne: 'DA_HUY' } } },
            { $group: { _id: '$maSach', luotMuon: { $sum: 1 } } },
            { $sort: { luotMuon: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'saches', localField: '_id', foreignField: '_id', as: 'sachInfo' } },
            { $unwind: '$sachInfo' },
            { $project: { _id: 1, luotMuon: 1, tenSach: '$sachInfo.tenSach', hinhAnh: '$sachInfo.hinhAnh' } }
        ]);

        return { tongDocGia, tongSach, soLuotMuon, tongDoanhThu, topSach, chartData };
    }
}

module.exports = new ThongKeService();