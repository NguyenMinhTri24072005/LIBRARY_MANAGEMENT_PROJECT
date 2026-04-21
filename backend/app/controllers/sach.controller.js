const sachService = require("../services/sach.service"); // Import đối tượng đã khởi tạo
const ApiError = require("../api-error");

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
        const result = await sachService.findAll(req.query);
        // Trả về cấu trúc: { success: true, data: { books: [...], totalPages: ... } }
        return res.json({ 
            success: true, 
            data: result 
        });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi lấy danh sách sách"));
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const document = await sachService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy sách"));
        }
        return res.json({ success: true, data: document });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi lấy sách với id=${req.params.id}`));
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