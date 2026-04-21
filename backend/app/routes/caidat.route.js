const express = require('express');
const caiDatController = require('../controllers/caidat.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Yêu cầu đăng nhập
router.use(authMiddleware.verifyToken);

// Độc giả có thể xem cài đặt (để biết phí phạt, số ngày mượn)
router.get('/', caiDatController.getSettings);

// Chỉ Admin mới được thay đổi cài đặt
router.put('/', authMiddleware.isAdmin, caiDatController.updateSettings);

module.exports = router;