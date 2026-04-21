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
            { hoLot: "Lê", ten: "Hoa", dienThoai: "0903333333", password: hashedUserPwd, phai: "Nữ", diemUyTin: 90, trangThai: true }
        ]);

        // 6. Tạo Phiếu Mượn
        await PhieuMuon.insertMany([
            {
                maDocGia: docGias[0]._id,
                maSach: sachs[1]._id,
                ngayMuon: new Date(),
                hanTra: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                trangThai: 'DANG_MUON'
            }
        ]);

        console.log("✅ SEED DỮ LIỆU THÀNH CÔNG!");
        console.log("Admin: 0999999999 / admin | User: 0901234567 / 123");
        process.exit();
    } catch (error) {
        console.error("❌ Lỗi Seed:", error);
        process.exit(1);
    }
};

seedData();