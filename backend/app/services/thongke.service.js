const { Sach, DocGia, PhieuMuon } = require('../models');
const ExcelJS = require('exceljs');

class ThongKeService {
    
    // 1. HÀM LẤY THỐNG KÊ (Đã đặt khối await vào đúng bên trong hàm async)
    async getDashboardStats(query = {}) {
        let matchDate = {};
        
        // Xử lý lọc theo ngày
        if (query.fromDate && query.toDate) {
            matchDate.createdAt = {
                $gte: new Date(query.fromDate),
                $lte: new Date(new Date(query.toDate).setHours(23, 59, 59, 999))
            };
        }

        // Lấy dữ liệu biểu đồ (Đã bao gồm ép múi giờ Việt Nam)
        const chartData = await PhieuMuon.aggregate([
            { $match: { ...matchDate, trangThai: { $ne: 'DA_HUY' } } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                            timezone: "Asia/Ho_Chi_Minh" 
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Tính tổng các số liệu
        const [tongDocGia, tongSach, soLuotMuon, tongDoanhThuData] = await Promise.all([
            DocGia.countDocuments({ trangThai: true }),
            Sach.aggregate([{ $group: { _id: null, total: { $sum: "$soQuyen" } } }]),
            PhieuMuon.countDocuments({ ...matchDate, trangThai: { $ne: 'DA_HUY' } }),
            PhieuMuon.aggregate([
                { $match: { ...matchDate, daThanhToanPhat: true } },
                { $group: { _id: null, total: { $sum: "$tienPhat" } } }
            ])
        ]);

        const tongDoanhThu = tongDoanhThuData.length > 0 ? tongDoanhThuData[0].total : 0;
        const tongSoSach = tongSach.length > 0 ? tongSach[0].total : 0;

        // Lấy Top 5 sách mượn nhiều nhất
        const topSach = await PhieuMuon.aggregate([
            { $match: { ...matchDate, trangThai: { $ne: 'DA_HUY' } } },
            { $group: { _id: "$maSach", luotMuon: { $sum: 1 } } },
            { $sort: { luotMuon: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'saches', localField: '_id', foreignField: '_id', as: 'sachInfo' } },
            { $unwind: "$sachInfo" },
            {
                $project: {
                    _id: 1,
                    tenSach: "$sachInfo.tenSach",
                    luotMuon: 1
                }
            }
        ]);

        return {
            tongDocGia,
            tongSach: tongSoSach,
            soLuotMuon,
            tongDoanhThu,
            chartData,
            topSach
        };
    }

    // 2. HÀM XUẤT EXCEL
    async exportExcelBooks(res) {
        try {
            const books = await Sach.find({}).populate('maNXB', 'tenNXB').lean();

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Danh Sách Sách');

            // Định nghĩa các cột Excel
            worksheet.columns = [
                { header: 'STT', key: 'stt', width: 5 },
                { header: 'Tên Sách', key: 'tenSach', width: 40 },
                { header: 'Tác Giả', key: 'tacGia', width: 25 },
                { header: 'Nhà Xuất Bản', key: 'nxb', width: 25 },
                { header: 'Năm Xuất Bản', key: 'namXuatBan', width: 15 },
                { header: 'Đơn Giá', key: 'donGia', width: 15 },
                { header: 'Tổng Số Quyển', key: 'soQuyen', width: 15 },
                { header: 'Còn Lại', key: 'soQuyenHienTai', width: 15 }
            ];

            // Đổ dữ liệu vào các dòng
            books.forEach((book, index) => {
                worksheet.addRow({
                    stt: index + 1,
                    tenSach: book.tenSach,
                    tacGia: book.tacGia,
                    nxb: book.maNXB ? book.maNXB.tenNXB : 'N/A',
                    namXuatBan: book.namXuatBan,
                    donGia: book.donGia,
                    soQuyen: book.soQuyen,
                    soQuyenHienTai: book.soQuyenHienTai
                });
            });

            // In đậm hàng tiêu đề
            worksheet.getRow(1).font = { bold: true };

            // Cấu hình header để trả file về cho Frontend
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Danh_Sach_Sach.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ThongKeService();