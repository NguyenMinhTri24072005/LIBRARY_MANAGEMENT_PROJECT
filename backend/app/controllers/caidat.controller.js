const caiDatService = require('../services/caidat.service');

exports.getSettings = async (req, res, next) => {
    try {
        const document = await caiDatService.getSettings();
        return res.status(200).json({ success: true, data: document });
    } catch (error) {
        return next(error);
    }
};

exports.updateSettings = async (req, res, next) => {
    try {
        const document = await caiDatService.updateSettings(req.body);
        return res.status(200).json({ success: true, message: "Cập nhật cài đặt thành công!", data: document });
    } catch (error) {
        return next(error);
    }
};