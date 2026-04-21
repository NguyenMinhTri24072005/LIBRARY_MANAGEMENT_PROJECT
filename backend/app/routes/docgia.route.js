const express = require('express');
const docGiaController = require('../controllers/docgia.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Bắt buộc đăng nhập cho mọi thao tác
router.use(authMiddleware.verifyToken);

// --- Tuyến đường cho Độc Giả (User) ---
// Xem hồ sơ của chính mình (Lấy ID từ Token)
router.get('/profile', (req, res, next) => {
    req.params.id = req.user.id; // Mượn hàm findOne nhưng gán ID từ token
    next();
}, docGiaController.findOne);

// Cập nhật hồ sơ của chính mình
router.put('/profile', docGiaController.updateProfile);


// --- Tuyến đường cho Admin ---
router.use(authMiddleware.isAdmin);

router.get('/', docGiaController.findAll);
router.get('/:id', docGiaController.findOne);
router.patch('/:id/status', docGiaController.updateStatus); // Dùng PATCH vì chỉ cập nhật 1 trường trangThai
router.delete('/:id', docGiaController.delete);

module.exports = router;