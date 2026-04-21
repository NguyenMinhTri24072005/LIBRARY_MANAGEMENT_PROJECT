const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Thực hiện kết nối với MongoDB thông qua biến môi trường
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected thành công: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
        // Dừng tiến trình (Server) nếu không thể kết nối tới DB
        process.exit(1);
    }
};

module.exports = connectDB;