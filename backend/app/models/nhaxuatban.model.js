const mongoose = require('mongoose');

const nhaXuatBanSchema = new mongoose.Schema({
    tenNXB: { type: String, required: true, unique: true },
    diaChi: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('NhaXuatBan', nhaXuatBanSchema);