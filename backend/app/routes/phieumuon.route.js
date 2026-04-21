const express = require('express');
const phieuMuonController = require('../controllers/phieumuon.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Tất cả thao tác mượn trả đều cần đăng nhập
router.use(authMiddleware.verifyToken);

// --- Dùng chung cho Admin & Độc giả ---
// Độc giả gọi sẽ thấy phiếu của mình. Admin gọi sẽ thấy toàn bộ.
router.get('/', phieuMuonController.findAll); 

// Độc giả tạo yêu cầu mượn sách
router.post('/', phieuMuonController.create);

// ... (Các route cũ giữ nguyên)

// Độc giả xin gia hạn sách
router.put('/:id/extend-request', phieuMuonController.requestExtension);

// Admin xử lý gia hạn
router.put('/:id/extend-approve', authMiddleware.isAdmin, phieuMuonController.approveExtension);
router.put('/:id/extend-reject', authMiddleware.isAdmin, phieuMuonController.rejectExtension);

// --- Chỉ Admin mới được can thiệp duyệt/trả/phạt ---
router.put('/:id/approve', authMiddleware.isAdmin, phieuMuonController.approve);
router.put('/:id/reject', authMiddleware.isAdmin, phieuMuonController.reject);
router.put('/:id/return', authMiddleware.isAdmin, phieuMuonController.returnBook);
router.put('/:id/pay-fine', authMiddleware.isAdmin, phieuMuonController.payFine);

module.exports = router;