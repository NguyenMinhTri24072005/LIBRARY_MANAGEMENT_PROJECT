const { CaiDatHeThong } = require('../models');

class CaiDatService {
    // Lấy cấu hình hiện tại (Nếu chưa có thì tự tạo 1 cái mặc định)
    async getSettings() {
        let config = await CaiDatHeThong.findOne();
        if (!config) {
            config = await CaiDatHeThong.create({});
        }
        return config;
    }

    // Cập nhật cấu hình
    async updateSettings(data) {
        let config = await CaiDatHeThong.findOne();
        if (!config) {
            config = await CaiDatHeThong.create({});
        }
        
        return await CaiDatHeThong.findByIdAndUpdate(config._id, data, { new: true });
    }
}

module.exports = new CaiDatService();