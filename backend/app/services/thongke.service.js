const { DocGia, Sach, PhieuMuon } = require('../models');
const ExcelJS = require('exceljs');
const ApiError = require('../api-error'); // THÊM DÒNG NÀY

class ThongKeService {
    async getDashboardStats(query) {
        // ... giữ nguyên logic cũ của bạn ...
        let matchDate = {};
        if (query.fromDate && query.toDate) {
            matchDate.createdAt = {
                $gte: new Date(query.fromDate),
                $lte: new Date(query.toDate + 'T23:59:59.999Z')
            };
        }
        
        const tongDocGia = await DocGia.countDocuments({ trangThai: true });
        
        const tongSachResult = await Sach.aggregate([
            { $match: { trangThai: true } },
            { $group: { _id: null, total: { $sum: '$soQuyen' } } }
        ]);
        const tongSach = tongSachResult.length > 0 ? tongSachResult[0].total : 0;

        const soLuotMuon = await PhieuMuon.countDocuments({ ...matchDate, trangThai: { $ne: 'DA_HUY' } });

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

        const chartData = await PhieuMuon.aggregate([
            { $match: { ...matchDate, trangThai: { $ne: 'DA_HUY' } } },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
                    count: { $sum: 1 } 
                } 
            },
            { $sort: { _id: 1 } }
        ]);

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

    // ĐƯA HÀM NÀY VÀO TRONG CLASS
    async exportExcelBooks(res) {
        try {
            const books = await Sach.find({}).populate('maNXB', 'tenNXB');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Danh Sách Sách');

            worksheet.columns = [
                { header: 'Tên Sách', key: 'tenSach', width: 40 },
                { header: 'Tác Giả', key: 'tacGia', width: 25 },
                { header: 'Năm XB', key: 'namXuatBan', width: 15 },
                { header: 'Nhà XB', key: 'nxb', width: 25 },
                { header: 'Tồn Kho', key: 'soQuyenHienTai', width: 15 },
            ];

            books.forEach(b => {
                worksheet.addRow({
                    tenSach: b.tenSach,
                    tacGia: b.tacGia,
                    namXuatBan: b.namXuatBan,
                    nxb: b.maNXB ? b.maNXB.tenNXB : 'N/A',
                    soQuyenHienTai: b.soQuyenHienTai
                });
            });

            worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF764BA2' } };

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=BaoCao_Sach.xlsx');

            return await workbook.xlsx.write(res);
        } catch (error) {
            throw new ApiError(500, "Lỗi khi xuất file Excel");
        }
    }
}

module.exports = new ThongKeService();