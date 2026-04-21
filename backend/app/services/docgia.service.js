const { DocGia, PhieuMuon } = require('../models');
const ApiError = require('../api-error');

class DocGiaService {
    // 1. Lấy danh sách độc giả (Dành cho Admin)
    async getAll(query) {
        const filter = {};
        if (query.dienThoai) filter.dienThoai = { $regex: new RegExp(query.dienThoai, 'i') };
        
        // Loại bỏ trường password khi trả về
        return await DocGia.find(filter).select('-password').sort({ createdAt: -1 });
    }

    // 2. Lấy thông tin 1 độc giả (Dành cho Admin hoặc chính Độc giả đó)
    async getById(id) {
        const docGia = await DocGia.findById(id).select('-password');
        if (!docGia) throw new ApiError(404, 'Không tìm thấy độc giả!');
        return docGia;
    }

    // 3. Cập nhật hồ sơ cá nhân (Độc giả tự cập nhật)
    async updateProfile(id, data) {
        // Không cho phép tự ý cập nhật điểm uy tín, trạng thái, mật khẩu qua API này
        delete data.diemUyTin;
        delete data.trangThai;
        delete data.password;
        delete data.dienThoai; // Số điện thoại là duy nhất, hạn chế cho đổi tùy tiện

        const updatedDocGia = await DocGia.findByIdAndUpdate(id, data, { new: true }).select('-password');
        if (!updatedDocGia) throw new ApiError(404, 'Không tìm thấy độc giả!');
        return updatedDocGia;
    }

    // 4. Khóa / Mở tài khoản (Dành cho Admin)
    async updateStatus(id, trangThai) {
        const updatedDocGia = await DocGia.findByIdAndUpdate(id, { trangThai }, { new: true }).select('-password');
        if (!updatedDocGia) throw new ApiError(404, 'Không tìm thấy độc giả!');
        return updatedDocGia;
    }

    // 5. Xóa độc giả (Dành cho Admin)
    async delete(id) {
        // KIỂM TRA RÀNG BUỘC TOÀN VẸN DỮ LIỆU
        // Không cho xóa nếu đang mượn sách hoặc nợ phạt
        const dangMuonSach = await PhieuMuon.findOne({
            maDocGia: id,
            trangThai: { $in: ['CHO_DUYET', 'DANG_MUON'] }
        });

        if (dangMuonSach) {
            throw new ApiError(400, 'Không thể xóa! Độc giả này đang có sách mượn chưa trả hoặc đơn chờ duyệt.');
        }

        const noPhat = await PhieuMuon.findOne({
            maDocGia: id,
            tienPhat: { $gt: 0 },
            daThanhToanPhat: false
        });

        if (noPhat) {
            throw new ApiError(400, 'Không thể xóa! Độc giả này đang nợ tiền phạt chưa thanh toán.');
        }

        const deletedDocGia = await DocGia.findByIdAndDelete(id);
        if (!deletedDocGia) throw new ApiError(404, 'Không tìm thấy độc giả!');
        return deletedDocGia;
    }
}

module.exports = new DocGiaService();