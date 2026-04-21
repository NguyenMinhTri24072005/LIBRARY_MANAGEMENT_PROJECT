const express = require('express');
const upload = require('../middleware/upload.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Route upload 1 ảnh (Dùng cho ảnh bìa sách hoặc avatar)
// Cần đăng nhập mới được upload
router.post('/', authMiddleware.verifyToken, upload.single('image'), (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Vui lòng chọn một tệp ảnh!" });
        }
        
        // Trả về đường dẫn tương đối để lưu vào Database
        const imagePath = `/uploads/${req.file.filename}`;
        
        return res.status(200).json({
            success: true,
            message: "Tải ảnh lên thành công!",
            data: { imageUrl: imagePath }
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;