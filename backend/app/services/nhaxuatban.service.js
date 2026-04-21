const { NhaXuatBan, Sach } = require('../models');
const ApiError = require('../api-error');

class NhaXuatBanService {
    // 1. Thêm mới NXB
    async create(data) {
        const { tenNXB, diaChi } = data;
        
        const existingNXB = await NhaXuatBan.findOne({ tenNXB: new RegExp(`^${tenNXB}$`, 'i') });
        if (existingNXB) {
            throw new ApiError(400, 'Tên Nhà xuất bản đã tồn tại!');
        }

        return await NhaXuatBan.create({ tenNXB, diaChi });
    }

    // 2. Lấy danh sách NXB
    async getAll() {
        return await NhaXuatBan.find().sort({ createdAt: -1 });
    }

    // 3. Cập nhật NXB
    async update(id, data) {
        const updatedNXB = await NhaXuatBan.findByIdAndUpdate(id, data, { new: true });
        if (!updatedNXB) {
            throw new ApiError(404, 'Không tìm thấy Nhà xuất bản!');
        }
        return updatedNXB;
    }

    // 4. Xóa NXB (Kiểm tra ràng buộc với Sách)
    async delete(id) {
        // Kiểm tra xem có sách nào thuộc NXB này không
        const sachLienKet = await Sach.findOne({ maNXB: id });
        if (sachLienKet) {
            throw new ApiError(400, 'Không thể xóa! Đang có sách thuộc Nhà xuất bản này.');
        }

        const deletedNXB = await NhaXuatBan.findByIdAndDelete(id);
        if (!deletedNXB) {
            throw new ApiError(404, 'Không tìm thấy Nhà xuất bản!');
        }
        return deletedNXB;
    }
}

module.exports = new NhaXuatBanService();