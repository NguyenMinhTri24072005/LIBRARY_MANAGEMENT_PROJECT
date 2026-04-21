require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { NhanVien } = require('./app/models');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log("⏳ Đang kết nối DB. Đang tạo Admin...");
    
    // Mã hóa mật khẩu "123456"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    // Tìm và cập nhật, nếu chưa có thì tạo mới (upsert)
    await NhanVien.findOneAndUpdate(
        { soDienThoai: "0999999999" },
        {
            hoTenNV: "Admin Thư Viện",
            soDienThoai: "0999999999",
            password: hashedPassword,
            chucVu: "Thủ thư",
        },
        { upsert: true, new: true }
    );

    console.log("✅ TẠO ADMIN THÀNH CÔNG!");
    console.log("👉 SĐT đăng nhập: 0999999999");
    console.log("👉 Mật khẩu: 123456");
    process.exit(0);
}).catch(err => {
    console.error("❌ Lỗi:", err);
    process.exit(1);
});