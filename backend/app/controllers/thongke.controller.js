const thongKeService = require('../services/thongke.service');

exports.getStats = async (req, res, next) => {
    try {
        const stats = await thongKeService.getDashboardStats();
        return res.status(200).json({ success: true, message: "Lấy thống kê thành công", data: stats });
    } catch (error) {
        return next(error);
    }
};