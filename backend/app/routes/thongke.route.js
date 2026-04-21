const express = require('express');
const thongKeController = require('../controllers/thongke.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Chỉ Admin mới được xem thống kê Dashboard
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, thongKeController.getStats);

module.exports = router;