const express = require('express');
const nxbController = require('../controllers/nhaxuatban.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Bất kỳ ai cũng có thể xem danh sách NXB (Để hiển thị filter ở Frontend)
router.get('/', nxbController.findAll);

// Chỉ Admin mới được Thêm, Sửa, Xóa NXB
router.use(authMiddleware.verifyToken, authMiddleware.isAdmin); // Áp dụng middleware cho các route bên dưới

router.post('/', nxbController.create);
router.put('/:id', nxbController.update);
router.delete('/:id', nxbController.delete);

module.exports = router;