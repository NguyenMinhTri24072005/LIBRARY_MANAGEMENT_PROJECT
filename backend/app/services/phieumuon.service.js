const { PhieuMuon, Sach, DocGia, CaiDatHeThong } = require('../models');
const ApiError = require('../api-error');
const { calculateDaysDifference, addDays } = require('../utils/date.util');

class PhieuMuonService {
    // 1. Độc giả gửi yêu cầu mượn sách
    async createRequest(maDocGia, dsMaSach) {
        const docGia = await DocGia.findById(maDocGia);
        if (!docGia || !docGia.trangThai) {
            throw new ApiError(403, 'Tài khoản của bạn đã bị khóa hoặc không tồn tại!');
        }

        // --- GIẢI QUYẾT VẤN ĐỀ 2: ĐIỂM UY TÍN ---
        if (docGia.diemUyTin < 50) {
            throw new ApiError(403, `Điểm uy tín của bạn quá thấp (${docGia.diemUyTin}/100). Tài khoản bị tạm khóa quyền mượn!`);
        }

        const noPhat = await PhieuMuon.findOne({ maDocGia, tienPhat: { $gt: 0 }, daThanhToanPhat: false });
        if (noPhat) {
            throw new ApiError(403, 'Bạn đang có khoản phạt chưa thanh toán. Không thể mượn thêm!');
        }

        // --- GIẢI QUYẾT VẤN ĐỀ 3: CHẶN MƯỢN KHI ĐANG CÓ SÁCH TRỄ HẠN ---
        const sachTreHan = await PhieuMuon.findOne({
            maDocGia,
            trangThai: 'DANG_MUON',
            hanTra: { $lt: new Date() } // Hạn trả nhỏ hơn thời gian hiện tại
        });
        if (sachTreHan) {
            throw new ApiError(403, 'TÀI KHOẢN BỊ KHÓA: Bạn đang có sách mượn quá hạn chưa trả. Vui lòng trả sách trước!');
        }

        let config = await CaiDatHeThong.findOne() || await CaiDatHeThong.create({});

        const dangMuon = await PhieuMuon.countDocuments({
            maDocGia,
            trangThai: { $in: ['CHO_DUYET', 'DANG_MUON'] }
        });

        if (dangMuon + dsMaSach.length > config.soSachMuonToiDa) {
            throw new ApiError(400, `Bạn chỉ được mượn tối đa ${config.soSachMuonToiDa} quyển sách cùng lúc!`);
        }

        const phieuMuons = [];
        for (const maSach of dsMaSach) {
            const sach = await Sach.findById(maSach);
            if (!sach || !sach.trangThai) throw new ApiError(404, `Sách không tồn tại hoặc đã bị ẩn!`);
            if (sach.soQuyenHienTai <= 0) throw new ApiError(400, `Sách '${sach.tenSach}' đã hết trong kho!`);

            const phieu = await PhieuMuon.create({ maDocGia, maSach, trangThai: 'CHO_DUYET' });
            phieuMuons.push(phieu);
        }
        return phieuMuons;
    }

    // 2. Admin duyệt mượn
    async approve(id) {
        const phieu = await PhieuMuon.findById(id);
        if (!phieu || phieu.trangThai !== 'CHO_DUYET') {
            throw new ApiError(400, 'Phiếu mượn không tồn tại hoặc không ở trạng thái Chờ duyệt!');
        }

        const sach = await Sach.findById(phieu.maSach);
        if (sach.soQuyenHienTai <= 0) {
            throw new ApiError(400, 'Sách này hiện đã hết trong kho, không thể duyệt!');
        }

        let config = await CaiDatHeThong.findOne();
        if (!config) config = await CaiDatHeThong.create({});

        // Trừ số lượng sách
        sach.soQuyenHienTai -= 1;
        await sach.save();

        // Cập nhật phiếu
        phieu.trangThai = 'DANG_MUON';
        phieu.ngayMuon = new Date();
        phieu.hanTra = addDays(phieu.ngayMuon, config.soNgayMuonToiDa);

        return await phieu.save();
    }

    // 3. Admin hủy yêu cầu (Từ chối)
    async reject(id) {
        const phieu = await PhieuMuon.findById(id);
        if (!phieu || phieu.trangThai !== 'CHO_DUYET') {
            throw new ApiError(400, 'Chỉ có thể hủy phiếu đang ở trạng thái Chờ duyệt!');
        }
        phieu.trangThai = 'DA_HUY';
        return await phieu.save();
    }

    // 4. Admin xác nhận trả sách
    async returnBook(id) {
        const phieu = await PhieuMuon.findById(id);
        if (!phieu || phieu.trangThai !== 'DANG_MUON') {
            throw new ApiError(400, 'Phiếu mượn không hợp lệ hoặc sách đã được trả!');
        }

        let config = await CaiDatHeThong.findOne();
        if (!config) config = await CaiDatHeThong.create({});

        phieu.ngayTraThucTe = new Date();
        phieu.trangThai = 'DA_TRA';

        // Tính ngày trễ
        const soNgayTre = calculateDaysDifference(phieu.ngayTraThucTe, phieu.hanTra);
        const docGia = await DocGia.findById(phieu.maDocGia);

        if (soNgayTre > 0) {
            // Trễ hạn: Tính tiền phạt và trừ uy tín
            phieu.tienPhat = soNgayTre * config.phiPhatTrenNgay;
            docGia.diemUyTin = Math.max(0, docGia.diemUyTin - 5); // Trừ 5 điểm, không để âm
        } else {
            // Đúng hạn: Cộng uy tín
            docGia.diemUyTin += 2;
        }

        await docGia.save();

        // Hoàn lại sách vào kho
        const sach = await Sach.findById(phieu.maSach);
        sach.soQuyenHienTai += 1;
        await sach.save();

        return await phieu.save();
    }

    // 5. Admin xác nhận đã thu tiền phạt
    async payFine(id) {
        const phieu = await PhieuMuon.findById(id);
        if (!phieu || phieu.tienPhat <= 0) throw new ApiError(400, 'Phiếu này không có tiền phạt!');
        if (phieu.daThanhToanPhat) throw new ApiError(400, 'Tiền phạt này đã được thanh toán trước đó!');

        phieu.daThanhToanPhat = true;
        return await phieu.save();
    }

    // 6. Xem danh sách phiếu mượn
    async getAll(query, userRole, userId) {
        const filter = {};

        // Nếu là Độc giả, chỉ được xem phiếu của chính mình
        if (userRole === 'user') {
            filter.maDocGia = userId;
        }

        if (query.trangThai) filter.trangThai = query.trangThai;

        return await PhieuMuon.find(filter)
            .populate('maSach', 'tenSach hinhAnh tacGia')
            .populate('maDocGia', 'hoLot ten dienThoai diemUyTin')
            .sort({ createdAt: -1 });
    }

    // 7. Độc giả GỬI YÊU CẦU gia hạn sách
    async requestExtension(id, maDocGia) {
        const phieu = await PhieuMuon.findOne({ _id: id, maDocGia: maDocGia });
        if (!phieu) throw new ApiError(404, 'Không tìm thấy phiếu mượn!');

        if (phieu.trangThai !== 'DANG_MUON') {
            throw new ApiError(400, 'Chỉ có thể gia hạn sách đang mượn!');
        }
        if (new Date(phieu.hanTra) < new Date()) {
            throw new ApiError(400, 'Sách đã trễ hạn, không thể gia hạn! Vui lòng đem sách đến thư viện trả và nộp phạt.');
        }
        if (phieu.soLanGiaHan >= 1 || phieu.trangThaiGiaHan !== 'KHONG') {
            throw new ApiError(400, 'Bạn đã gia hạn hoặc đang chờ duyệt gia hạn cuốn sách này rồi!');
        }

        // Chỉ đổi trạng thái, CHƯA cộng ngày
        phieu.trangThaiGiaHan = 'CHO_DUYET_GIA_HAN';
        return await phieu.save();
    }

    // 8. Admin DUYỆT yêu cầu gia hạn
    async approveExtension(id) {
        const phieu = await PhieuMuon.findById(id);
        if (!phieu || phieu.trangThaiGiaHan !== 'CHO_DUYET_GIA_HAN') {
            throw new ApiError(400, 'Phiếu mượn không có yêu cầu gia hạn nào đang chờ duyệt!');
        }

        let config = await CaiDatHeThong.findOne() || await CaiDatHeThong.create({});

        // Cộng ngày và đổi trạng thái
        phieu.hanTra = addDays(phieu.hanTra, config.soNgayMuonToiDa);
        phieu.soLanGiaHan += 1;
        phieu.trangThaiGiaHan = 'DA_GIA_HAN';

        return await phieu.save();
    }

    // 9. Admin TỪ CHỐI yêu cầu gia hạn
    async rejectExtension(id) {
        const phieu = await PhieuMuon.findById(id);
        if (!phieu || phieu.trangThaiGiaHan !== 'CHO_DUYET_GIA_HAN') {
            throw new ApiError(400, 'Phiếu mượn không có yêu cầu gia hạn nào đang chờ duyệt!');
        }

        phieu.trangThaiGiaHan = 'TU_CHOI_GIA_HAN';
        return await phieu.save();
    }
}

module.exports = new PhieuMuonService();