const phieuMuonService = require('../services/phieumuon.service');

exports.create = async (req, res, next) => {
    try {
        const maDocGia = req.user.id; // Lấy ID từ token của người dùng đang đăng nhập
        const { dsMaSach } = req.body; // Mảng các ID sách muốn mượn

        if (!dsMaSach || !Array.isArray(dsMaSach) || dsMaSach.length === 0) {
            return res.status(400).json({ success: false, message: "Vui lòng chọn ít nhất 1 cuốn sách để mượn!" });
        }

        const documents = await phieuMuonService.createRequest(maDocGia, dsMaSach);
        return res.status(201).json({ success: true, message: "Gửi yêu cầu mượn sách thành công!", data: documents });
    } catch (error) {
        return next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        // Truyền role và id để Service tự phân quyền dữ liệu trả về
        const documents = await phieuMuonService.getAll(req.query, req.user.role, req.user.id);
        return res.status(200).json({ success: true, message: "Lấy danh sách phiếu mượn thành công", data: documents });
    } catch (error) {
        return next(error);
    }
};

exports.approve = async (req, res, next) => {
    try {
        const document = await phieuMuonService.approve(req.params.id);
        return res.status(200).json({ success: true, message: "Duyệt phiếu mượn thành công", data: document });
    } catch (error) {
        return next(error);
    }
};

exports.reject = async (req, res, next) => {
    try {
        const document = await phieuMuonService.reject(req.params.id);
        return res.status(200).json({ success: true, message: "Đã từ chối yêu cầu mượn sách", data: document });
    } catch (error) {
        return next(error);
    }
};

exports.returnBook = async (req, res, next) => {
    try {
        const document = await phieuMuonService.returnBook(req.params.id);
        let msg = "Trả sách thành công.";
        if (document.tienPhat > 0) msg += ` Độc giả bị phạt ${document.tienPhat} VNĐ do trả trễ.`;

        return res.status(200).json({ success: true, message: msg, data: document });
    } catch (error) {
        return next(error);
    }
};

exports.payFine = async (req, res, next) => {
    try {
        const document = await phieuMuonService.payFine(req.params.id);
        return res.status(200).json({ success: true, message: "Đã xác nhận thu tiền phạt", data: document });
    } catch (error) {
        return next(error);
    }
};

exports.requestExtension = async (req, res, next) => {
    try {
        const document = await phieuMuonService.requestExtension(req.params.id, req.user.id);
        return res.status(200).json({ success: true, message: "Đã gửi yêu cầu gia hạn đến Thủ thư!", data: document });
    } catch (error) { return next(error); }
};

exports.approveExtension = async (req, res, next) => {
    try {
        const document = await phieuMuonService.approveExtension(req.params.id);
        return res.status(200).json({ success: true, message: "Đã duyệt gia hạn sách!", data: document });
    } catch (error) { return next(error); }
};

exports.rejectExtension = async (req, res, next) => {
    try {
        const document = await phieuMuonService.rejectExtension(req.params.id);
        return res.status(200).json({ success: true, message: "Đã từ chối gia hạn sách!", data: document });
    } catch (error) { return next(error); }
};