const express = require('express');
const sachController = require('../controllers/sach.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Bất kỳ ai cũng có thể xem danh sách và chi tiết sách
router.get('/', sachController.findAll);
router.get('/:id', sachController.findOne);

// Chỉ Admin mới được Thêm, Sửa, Xóa sách
router.use(authMiddleware.verifyToken, authMiddleware.isAdmin);

router.post('/', sachController.create);
router.put('/:id', sachController.update);
router.delete('/:id', sachController.delete);

module.exports = router;