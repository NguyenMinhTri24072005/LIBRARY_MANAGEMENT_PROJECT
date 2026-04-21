const sachService = require('../services/sach.service');

exports.create = async (req, res, next) => {
    try {
        const document = await sachService.create(req.body);
        return res.status(201).json({ success: true, message: "Thêm sách thành công", data: document });
    } catch (error) {
        return next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await sachService.getAll(req.query);
        return res.status(200).json({ success: true, message: "Lấy danh sách sách thành công", data: documents });
    } catch (error) {
        return next(error);
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const document = await sachService.getById(req.params.id);
        return res.status(200).json({ success: true, message: "Lấy chi tiết sách thành công", data: document });
    } catch (error) {
        return next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const document = await sachService.update(req.params.id, req.body);
        return res.status(200).json({ success: true, message: "Cập nhật sách thành công", data: document });
    } catch (error) {
        return next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        await sachService.delete(req.params.id);
        return res.status(200).json({ success: true, message: "Xóa sách (ẩn sách) thành công" });
    } catch (error) {
        return next(error);
    }
};