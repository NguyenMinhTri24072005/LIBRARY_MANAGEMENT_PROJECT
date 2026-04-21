const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
// Đảm bảo tên biến ở đây là thongkeController (viết thường chữ k)
const thongkeController = require("../controllers/thongke.controller");

// Lấy thống kê tổng quan cho Dashboard
router.get("/", 
    authMiddleware.verifyToken, 
    authMiddleware.isAdmin, 
    thongkeController.getStats
);

// Xuất file Excel danh sách sách (Đã đồng bộ tên biến thongkeController)
router.get("/export/books", 
    authMiddleware.verifyToken, 
    authMiddleware.isAdmin, 
    thongkeController.exportExcelBooks
);

module.exports = router;