const thongKeService = require('../services/thongke.service');

exports.getStats = async (req, res, next) => {
    try {
        // Truyền query (chứa fromDate, toDate) vào service
        const stats = await thongKeService.getDashboardStats(req.query);
        return res.status(200).json({ success: true, message: "Lấy thống kê thành công", data: stats });
    } catch (error) {
        return next(error);
    }
};