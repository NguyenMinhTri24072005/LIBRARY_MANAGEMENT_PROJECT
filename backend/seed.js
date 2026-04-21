require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Thêm bcrypt
const { CaiDatHeThong, NhanVien, NhaXuatBan, Sach, DocGia, PhieuMuon } = require('./app/models');

// Đảm bảo tên DB trùng với DB bạn đang dùng (LIBRARY_MANAGEMENT)
const DB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/LIBRARY_MANAGEMENT";

const seedData = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("🟢 Kết nối thành công. Đang dọn dẹp và tạo dữ liệu mới...");

        // Xóa sạch dữ liệu cũ
        await Promise.all([
            CaiDatHeThong.deleteMany({}), NhanVien.deleteMany({}),
            NhaXuatBan.deleteMany({}), Sach.deleteMany({}),
            DocGia.deleteMany({}), PhieuMuon.deleteMany({})
        ]);

        // MÃ HÓA MẬT KHẨU TRƯỚC KHI LƯU
        const salt = await bcrypt.genSalt(10);
        const hashedAdminPwd = await bcrypt.hash("admin", salt);
        const hashedUserPwd = await bcrypt.hash("123", salt);

        // 1. Cài đặt hệ thống
        await CaiDatHeThong.create({ soNgayMuonToiDa: 14, phiPhatTrenNgay: 5000, soSachMuonToiDa: 5 });

        // 2. Tạo Admin (Sử dụng hashedAdminPwd)
        await NhanVien.create({
            hoTenNV: "Quản Trị Viên",
            chucVu: "Thủ thư",
            diaChi: "Cần Thơ",
            soDienThoai: "0999999999",
            password: hashedAdminPwd 
        });

        // 3. Tạo NXB
        const nxbs = await NhaXuatBan.insertMany([
            { tenNXB: "NXB Trẻ", diaChi: "TP.HCM" },
            { tenNXB: "NXB Kim Đồng", diaChi: "TP.HCM" },
            { tenNXB: "NXB Giáo Dục", diaChi: "Hà Nội" },
            { tenNXB: "NXB Văn Học", diaChi: "Hà Nội" }
        ]);

        // 4. Tạo Sách
        const sachs = await Sach.insertMany([
            { tenSach: "Đắc Nhân Tâm", tacGia: "Dale Carnegie", maNXB: nxbs[0]._id, namXuatBan: 2020, donGia: 85000, soQuyen: 10, soQuyenHienTai: 10 },
            { tenSach: "Nhà Giả Kim", tacGia: "Paulo Coelho", maNXB: nxbs[1]._id, namXuatBan: 2019, donGia: 70000, soQuyen: 5, soQuyenHienTai: 4 },
            { tenSach: "Lập trình C++ căn bản", tacGia: "Nhiều tác giả", maNXB: nxbs[2]._id, namXuatBan: 2021, donGia: 120000, soQuyen: 15, soQuyenHienTai: 15 },
            { tenSach: "Tuổi trẻ đáng giá bao nhiêu", tacGia: "Rosie Nguyễn", maNXB: nxbs[3]._id, namXuatBan: 2018, donGia: 90000, soQuyen: 20, soQuyenHienTai: 20 },
            { tenSach: "Tôi thấy hoa vàng trên cỏ xanh", tacGia: "Nguyễn Nhật Ánh", maNXB: nxbs[0]._id, namXuatBan: 2015, donGia: 110000, soQuyen: 8, soQuyenHienTai: 8 },
            { tenSach: "Sapiens: Lược Sử Loài Người", tacGia: "Yuval Noah Harari", maNXB: nxbs[1]._id, namXuatBan: 2020, donGia: 150000, soQuyen: 12, soQuyenHienTai: 12 },
            { tenSach: "Muôn Kiếp Nhân Sinh", tacGia: "Nguyên Phong", maNXB: nxbs[0]._id, namXuatBan: 2021, donGia: 130000, soQuyen: 15, soQuyenHienTai: 15 },
            { tenSach: "Cấu trúc dữ liệu và giải thuật", tacGia: "Nguyễn Đức Nghĩa", maNXB: nxbs[2]._id, namXuatBan: 2018, donGia: 95000, soQuyen: 20, soQuyenHienTai: 20 },
            { tenSach: "Clean Code", tacGia: "Robert C. Martin", maNXB: nxbs[2]._id, namXuatBan: 2017, donGia: 250000, soQuyen: 7, soQuyenHienTai: 7 },
            { tenSach: "Dế Mèn Phiêu Lưu Ký", tacGia: "Tô Hoài", maNXB: nxbs[1]._id, namXuatBan: 2010, donGia: 45000, soQuyen: 30, soQuyenHienTai: 30 },
            { tenSach: "Cho Tôi Xin Một Vé Đi Tuổi Thơ", tacGia: "Nguyễn Nhật Ánh", maNXB: nxbs[0]._id, namXuatBan: 2018, donGia: 80000, soQuyen: 14, soQuyenHienTai: 14 },
            { tenSach: "Kafka Bên Bờ Biển", tacGia: "Haruki Murakami", maNXB: nxbs[3]._id, namXuatBan: 2019, donGia: 145000, soQuyen: 9, soQuyenHienTai: 9 },
            { tenSach: "Tâm Lý Học Tội Phạm", tacGia: "Stanton E. Samenow", maNXB: nxbs[3]._id, namXuatBan: 2022, donGia: 160000, soQuyen: 11, soQuyenHienTai: 11 },
            { tenSach: "Hoàng Tử Bé", tacGia: "Antoine De Saint-Exupéry", maNXB: nxbs[1]._id, namXuatBan: 2021, donGia: 55000, soQuyen: 25, soQuyenHienTai: 25 },
            { tenSach: "Nhập môn Trí tuệ nhân tạo", tacGia: "Stuart Russell", maNXB: nxbs[2]._id, namXuatBan: 2020, donGia: 300000, soQuyen: 5, soQuyenHienTai: 5 }
        ]);

        // 5. Tạo Độc giả (Sử dụng hashedUserPwd)
        const docGias = await DocGia.insertMany([
            { hoLot: "Nguyễn", ten: "An", dienThoai: "0901234567", password: hashedUserPwd, phai: "Nam", diemUyTin: 100, trangThai: true },
            { hoLot: "Trần", ten: "Bình", dienThoai: "0902222222", password: hashedUserPwd, phai: "Nam", diemUyTin: 100, trangThai: true },
            { hoLot: "Lê", ten: "Hoa", dienThoai: "0903333333", password: hashedUserPwd, phai: "Nữ", diemUyTin: 90, trangThai: true },
            { hoLot: "Phạm", ten: "Hùng", dienThoai: "0904444444", password: hashedUserPwd, phai: "Nam", diemUyTin: 100, trangThai: true },
            { hoLot: "Hoàng", ten: "Yến", dienThoai: "0905555555", password: hashedUserPwd, phai: "Nữ", diemUyTin: 85, trangThai: true },
            { hoLot: "Vũ", ten: "Khánh", dienThoai: "0906666666", password: hashedUserPwd, phai: "Nam", diemUyTin: 100, trangThai: true },
            { hoLot: "Đặng", ten: "Mai", dienThoai: "0907777777", password: hashedUserPwd, phai: "Nữ", diemUyTin: 95, trangThai: true },
            { hoLot: "Bùi", ten: "Sơn", dienThoai: "0908888888", password: hashedUserPwd, phai: "Nam", diemUyTin: 70, trangThai: true },
            { hoLot: "Đỗ", ten: "Quyên", dienThoai: "0909999999", password: hashedUserPwd, phai: "Nữ", diemUyTin: 100, trangThai: true },
            { hoLot: "Ngô", ten: "Bảo", dienThoai: "0911111111", password: hashedUserPwd, phai: "Nam", diemUyTin: 100, trangThai: true }
        ]);

        // 6. Tạo Phiếu Mượn (50 phiếu rải rác từ tháng 2 đến tháng 4)
        const today = new Date();
        
        const phieuMuons = [];
        for (let i = 0; i < 50; i++) {
            const randomDocGia = docGias[Math.floor(Math.random() * docGias.length)]._id;
            const randomSach = sachs[Math.floor(Math.random() * sachs.length)]._id;
            
            // Random days ago từ 0 đến 85 ngày (Từ giữa tháng 1/tháng 2 đến tháng 4)
            const daysAgo = Math.floor(Math.random() * 85); 
            const ngayMuon = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
            
            // Hạn trả mặc định là 14 ngày sau khi mượn
            const hanTra = new Date(ngayMuon.getTime() + 14 * 24 * 60 * 60 * 1000);
            
            // Random trạng thái (20% Chờ duyệt, 50% Đã trả, 25% Đang mượn, 5% Đã hủy)
            const r = Math.random();
            let trangThai = 'DANG_MUON';
            let ngayTraThucTe = null;
            let tienPhat = 0;
            let daThanhToanPhat = false;
            
            if (r < 0.20) {
                trangThai = 'CHO_DUYET';
            } else if (r < 0.70) {
                trangThai = 'DA_TRA';
                // Trả ngẫu nhiên trong khoảng 5 đến 20 ngày sau khi mượn
                const returnedDays = Math.floor(Math.random() * 16) + 5;
                ngayTraThucTe = new Date(ngayMuon.getTime() + returnedDays * 24 * 60 * 60 * 1000);
                
                // Nếu trả sau hạn trả -> Bị phạt tiền
                if (ngayTraThucTe > hanTra) {
                    tienPhat = (returnedDays - 14) * 5000; // Mỗi ngày trễ phạt 5k
                    daThanhToanPhat = Math.random() > 0.3; // 70% đã đóng phạt
                }
            } else if (r < 0.95) {
                trangThai = 'DANG_MUON';
                // Đang mượn nhưng nếu đã qua hạn trả so với hôm nay
                if (today > hanTra) {
                    tienPhat = Math.floor((today - hanTra) / (1000 * 60 * 60 * 24)) * 5000;
                }
            } else {
                trangThai = 'DA_HUY';
            }
            
            phieuMuons.push({
                maDocGia: randomDocGia,
                maSach: randomSach,
                ngayMuon,
                hanTra,
                ngayTraThucTe,
                trangThai,
                tienPhat,
                daThanhToanPhat
            });
        }
        
        await PhieuMuon.insertMany(phieuMuons);

        console.log("✅ SEED DỮ LIỆU THÀNH CÔNG!");
        console.log("Admin: 0999999999 / admin | User: 0901234567 / 123");
        process.exit();
    } catch (error) {
        console.error("❌ Lỗi Seed:", error);
        process.exit(1);
    }
};

seedData();