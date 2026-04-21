require('dotenv').config();
const mongoose = require('mongoose');

// Import các model từ file index.js trong thư mục models của bạn
const { 
    CaiDatHeThong, 
    NhanVien, 
    NhaXuatBan, 
    Sach, 
    DocGia, 
    PhieuMuon 
} = require('./app/models');

// Kết nối Database (Lấy URI từ file .env, nếu không có thì dùng mặc định)
const DB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/LIBRARY_MANAGEMENT";

const seedData = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("🟢 Đã kết nối Database. Bắt đầu dọn dẹp dữ liệu cũ...");

        // 1. Xóa dữ liệu cũ
        await Promise.all([
            CaiDatHeThong.deleteMany({}),
            NhanVien.deleteMany({}),
            NhaXuatBan.deleteMany({}),
            Sach.deleteMany({}),
            DocGia.deleteMany({}),
            PhieuMuon.deleteMany({})
        ]);
        console.log("🧹 Đã xóa sạch dữ liệu cũ.");

        // 2. Tạo Cài đặt hệ thống mặc định
        await CaiDatHeThong.create({
            soNgayMuonToiDa: 14,
            phiPhatTrenNgay: 5000,
            soSachMuonToiDa: 5
        });

        // 3. Tạo tài khoản Admin mặc định
        // Lưu ý: Nếu Model NhanVien của bạn có hook pre('save') để băm mật khẩu, 
        // thì nhập '123456' nó sẽ tự băm. Nếu không, bạn cần require('bcrypt') và băm tại đây.
        await NhanVien.create({
            hoTenNV: "Quản Trị Viên",
            chucVu: "Admin",
            diaChi: "Thư viện trung tâm",
            soDienThoai: "0999999999",
            password: "admin" // Mật khẩu mặc định là admin
        });

        // 4. Tạo Nhà Xuất Bản
        const nxbs = await NhaXuatBan.insertMany([
            { tenNXB: "NXB Trẻ", diaChi: "161B Lý Chính Thắng, TP.HCM" },
            { tenNXB: "NXB Kim Đồng", diaChi: "248 Cống Quỳnh, TP.HCM" },
            { tenNXB: "NXB Giáo Dục", diaChi: "81 Trần Hưng Đạo, Hà Nội" },
            { tenNXB: "NXB Hội Nhà Văn", diaChi: "65 Nguyễn Du, Hà Nội" },
            { tenNXB: "NXB Tổng Hợp TP.HCM", diaChi: "62 Nguyễn Thị Minh Khai, TP.HCM" }
        ]);

        // 5. Tạo Sách
        const sachData = [
            { tenSach: "Đắc Nhân Tâm", tacGia: "Dale Carnegie", namXuatBan: 2020, donGia: 85000, soQuyen: 20, soQuyenHienTai: 20 },
            { tenSach: "Nhà Giả Kim", tacGia: "Paulo Coelho", namXuatBan: 2019, donGia: 79000, soQuyen: 15, soQuyenHienTai: 15 },
            { tenSach: "Tuổi Trẻ Đáng Giá Bao Nhiêu", tacGia: "Rosie Nguyễn", namXuatBan: 2018, donGia: 80000, soQuyen: 30, soQuyenHienTai: 30 },
            { tenSach: "Cây Cam Ngọt Của Tôi", tacGia: "José Mauro", namXuatBan: 2021, donGia: 105000, soQuyen: 12, soQuyenHienTai: 12 },
            { tenSach: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh", tacGia: "Nguyễn Nhật Ánh", namXuatBan: 2015, donGia: 95000, soQuyen: 25, soQuyenHienTai: 25 },
            { tenSach: "Sapiens: Lược Sử Loài Người", tacGia: "Yuval Noah Harari", namXuatBan: 2017, donGia: 250000, soQuyen: 10, soQuyenHienTai: 10 },
            { tenSach: "Tâm Lý Học Tội Phạm", tacGia: "Stanton Samenow", namXuatBan: 2022, donGia: 150000, soQuyen: 8, soQuyenHienTai: 8 },
            { tenSach: "Lập trình Vue.js căn bản", tacGia: "Evan You", namXuatBan: 2023, donGia: 200000, soQuyen: 5, soQuyenHienTai: 5 },
            { tenSach: "Cấu Trúc Dữ Liệu & Giải Thuật", tacGia: "Nhiều Tác Giả", namXuatBan: 2021, donGia: 120000, soQuyen: 15, soQuyenHienTai: 15 },
            { tenSach: "Harry Potter và Hòn Đá Phù Thủy", tacGia: "J.K. Rowling", namXuatBan: 2000, donGia: 180000, soQuyen: 10, soQuyenHienTai: 10 }
        ];

        // Gắn ngẫu nhiên mã NXB cho các sách
        const sachToInsert = sachData.map(s => ({
            ...s,
            maNXB: nxbs[Math.floor(Math.random() * nxbs.length)]._id
        }));
        const sachs = await Sach.insertMany(sachToInsert);

        // 6. Tạo Độc Giả
        const docGiaData = [];
        for (let i = 1; i <= 10; i++) {
            docGiaData.push({
                hoLot: `Nguyễn Văn`,
                ten: `Khách ${i}`,
                ngaySinh: new Date(1995 + (i % 10), i % 12, (i * 2) % 28 + 1),
                phai: i % 2 === 0 ? "Nam" : "Nữ",
                diaChi: `Quận ${i % 5 + 1}, TP.HCM`,
                dienThoai: `090900000${i}`,
                password: "123", // MK mặc định là 123
                diemUyTin: 100 - (i * 2),
                trangThai: true
            });
        }
        const docGias = await DocGia.insertMany(docGiaData);

        // 7. Tạo Phiếu Mượn (Giả lập mượn trả)
        const phieuMuonData = [];
        const trangThaiList = ["CHO_DUYET", "DANG_MUON", "DA_TRA", "DA_HUY"];

        for (let i = 0; i < 15; i++) {
            const sachRandom = sachs[Math.floor(Math.random() * sachs.length)];
            const docGiaRandom = docGias[Math.floor(Math.random() * docGias.length)];
            const trangThaiRandom = trangThaiList[Math.floor(Math.random() * trangThaiList.length)];
            
            // Giả lập ngày mượn từ 1-20 ngày trước
            const ngayMuon = new Date();
            ngayMuon.setDate(ngayMuon.getDate() - Math.floor(Math.random() * 20 + 1));
            
            const hanTra = new Date(ngayMuon);
            hanTra.setDate(hanTra.getDate() + 14); // Hạn trả 14 ngày

            let ngayTraThucTe = null;
            let tienPhat = 0;
            let daThanhToanPhat = false;

            if (trangThaiRandom === "DA_TRA") {
                ngayTraThucTe = new Date(ngayMuon);
                ngayTraThucTe.setDate(ngayTraThucTe.getDate() + Math.floor(Math.random() * 20)); // Có thể trả trước hoặc sau hạn
                
                // Nếu trả trễ -> Tính tiền phạt giả lập
                if (ngayTraThucTe > hanTra) {
                    const daysLate = Math.ceil((ngayTraThucTe - hanTra) / (1000 * 60 * 60 * 24));
                    tienPhat = daysLate * 5000;
                    daThanhToanPhat = Math.random() > 0.5; // Random 50% đã đóng phạt
                }
            }

            phieuMuonData.push({
                maDocGia: docGiaRandom._id,
                maSach: sachRandom._id,
                trangThai: trangThaiRandom,
                hanTra: hanTra,
                ngayTraThucTe: ngayTraThucTe,
                tienPhat: tienPhat,
                daThanhToanPhat: daThanhToanPhat,
                createdAt: ngayMuon
            });

            // Nếu đang mượn thì trừ số lượng sách hiện tại (giả lập)
            if (trangThaiRandom === "DANG_MUON" || trangThaiRandom === "CHO_DUYET") {
                await Sach.findByIdAndUpdate(sachRandom._id, { $inc: { soQuyenHienTai: -1 } });
            }
        }
        await PhieuMuon.insertMany(phieuMuonData);

        console.log("✅ SEED DỮ LIỆU THÀNH CÔNG!");
        console.log("-----------------------------------------");
        console.log("Tài khoản Admin: SĐT: 0999999999 | MK: admin");
        console.log("Tài khoản Độc giả: SĐT: 0909000001 | MK: 123");
        console.log("-----------------------------------------");
        process.exit();
    } catch (error) {
        console.error("❌ Lỗi Seed dữ liệu:", error);
        process.exit(1);
    }
};

seedData();