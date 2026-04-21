const { Sach } = require("../models")
const ApiError = require('../api-error');

class SachService {
    async create(data) {
        // Khi mới tạo, số quyển hiện tại (trên kệ) bằng tổng số quyển nhập vào
        data.soQuyenHienTai = data.soQuyen;
        return await Sach.create(data);
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
            data.soQuyenHienTai = newSoQuyenHienTai;
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

    async findAll(query = {}) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { trangThai: true }; // ← Bật lại filter

        if (query.search && query.search.trim() !== "") {
            filter.$or = [
                { tenSach: { $regex: query.search, $options: 'i' } },
                { tacGia: { $regex: query.search, $options: 'i' } }
            ];
        }
        if (query.maNXB && query.maNXB !== "" && query.maNXB !== "undefined") {
            filter.maNXB = query.maNXB;
        }

        const [books, total] = await Promise.all([
            Sach.find(filter) // BỎ chữ "this." đi
                .populate('maNXB', 'tenNXB')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Sach.countDocuments(filter) // BỎ chữ "this." đi
        ]);

        return { books: books || [], totalPages: Math.ceil(total / limit) || 1, currentPage: page, totalItems: total || 0 };
    }
    async findById(id) {
        return await Sach.findById(id).populate('maNXB');
    }
}

module.exports = new SachService();