const { Sach } = require('../models');
const ApiError = require('../api-error');

class SachService {
    async create(data) {
        // Khi mới tạo, số quyển hiện tại (trên kệ) bằng tổng số quyển nhập vào
        data.soQuyenHienTai = data.soQuyen;
        return await Sach.create(data);
    }

    async getAll(query) {
        const filter = { trangThai: true }; // Chỉ lấy sách chưa bị ẩn
        
        // Tìm kiếm theo tên sách (không phân biệt hoa thường)
        if (query.tenSach) {
            filter.tenSach = { $regex: new RegExp(query.tenSach, 'i') };
        }
        
        // Lọc theo NXB
        if (query.maNXB) {
            filter.maNXB = query.maNXB;
        }

        // Dùng populate để lấy chi tiết NXB (chỉ lấy trường tenNXB)
        return await Sach.find(filter)
            .populate('maNXB', 'tenNXB')
            .sort({ createdAt: -1 });
    }

    async getById(id) {
        const sach = await Sach.findById(id).populate('maNXB', 'tenNXB');
        if (!sach || !sach.trangThai) {
            throw new ApiError(404, 'Không tìm thấy sách!');
        }
        return sach;
    }

    async update(id, data) {
        const sachCu = await Sach.findById(id);
        if (!sachCu) throw new ApiError(404, 'Không tìm thấy sách!');

        // Nếu Admin thay đổi tổng số quyển (Nhập thêm sách hoặc giảm bớt)
        if (data.soQuyen !== undefined && data.soQuyen !== sachCu.soQuyen) {
            const chenhLech = data.soQuyen - sachCu.soQuyen;
            data.soQuyenHienTai = sachCu.soQuyenHienTai + chenhLech;
            
            if (data.soQuyenHienTai < 0) {
                throw new ApiError(400, 'Số lượng sách cập nhật không hợp lệ (Số quyển hiện tại bị âm)!');
            }
        }

        return await Sach.findByIdAndUpdate(id, data, { new: true }).populate('maNXB', 'tenNXB');
    }

    async delete(id) {
        // Xóa mềm: Đổi trạng thái thành false thay vì xóa hẳn khỏi DB
        const deletedSach = await Sach.findByIdAndUpdate(id, { trangThai: false }, { new: true });
        if (!deletedSach) {
            throw new ApiError(404, 'Không tìm thấy sách!');
        }
        return deletedSach;
    }
}

module.exports = new SachService();