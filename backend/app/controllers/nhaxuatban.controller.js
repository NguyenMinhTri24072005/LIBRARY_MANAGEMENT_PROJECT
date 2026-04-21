const nxbService = require('../services/nhaxuatban.service');

exports.create = async (req, res, next) => {
    try {
        if (!req.body.tenNXB) {
            return res.status(400).json({ success: false, message: "Tên NXB không được để trống!" });
        }
        const document = await nxbService.create(req.body);
        return res.status(201).json({ success: true, message: "Thêm NXB thành công", data: document });
    } catch (error) {
        return next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await nxbService.getAll();
        return res.status(200).json({ success: true, message: "Lấy danh sách NXB thành công", data: documents });
    } catch (error) {
        return next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: "Dữ liệu cập nhật không được rỗng!" });
        }
        const document = await nxbService.update(req.params.id, req.body);
        return res.status(200).json({ success: true, message: "Cập nhật NXB thành công", data: document });
    } catch (error) {
        return next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        await nxbService.delete(req.params.id);
        return res.status(200).json({ success: true, message: "Xóa NXB thành công" });
    } catch (error) {
        return next(error);
    }
};