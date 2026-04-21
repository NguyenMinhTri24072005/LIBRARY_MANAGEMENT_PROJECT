require('dotenv').config(); // Load biến môi trường từ file .env
const app = require('./app');
const connectDB = require('./app/config/db');

const PORT = process.env.PORT || 3000;

// Hàm khởi động server
const startServer = async () => {
    try {
        // 1. Kết nối với Cơ sở dữ liệu trước
        await connectDB();

        // 2. Nếu DB kết nối thành công, tiến hành bật server lắng nghe
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại địa chỉ: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Không thể khởi động server!", error);
        process.exit(1);
    }
};

// Thực thi hàm
startServer();