const docGiaService = require('../services/docgia.service');

exports.findAll = async (req, res, next) => {
    try {
        const documents = await docGiaService.getAll(req.query);
        return res.status(200).json({ success: true, message: "Lấy danh sách độc giả thành công", data: documents });
    } catch (error) {
        return next(error);
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const document = await docGiaService.getById(req.params.id);
        return res.status(200).json({ success: true, message: "Lấy chi tiết độc giả thành công", data: document });
    } catch (error) {
        return next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        // req.user.id lấy từ token do authMiddleware gắn vào
        const document = await docGiaService.updateProfile(req.user.id, req.body);
        return res.status(200).json({ success: true, message: "Cập nhật hồ sơ thành công", data: document });
    } catch (error) {
        return next(error);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { trangThai } = req.body;
        if (typeof trangThai !== 'boolean') {
            return res.status(400).json({ success: false, message: "Trạng thái phải là kiểu boolean (true/false)!" });
        }
        const document = await docGiaService.updateStatus(req.params.id, trangThai);
        return res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công", data: document });
    } catch (error) {
        return next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        await docGiaService.delete(req.params.id);
        return res.status(200).json({ success: true, message: "Xóa độc giả thành công" });
    } catch (error) {
        return next(error);
    }
};