// Hàm tính số ngày chênh lệch giữa 2 mốc thời gian (bỏ qua giờ phút giây)
const calculateDaysDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    // Đưa về cùng giờ 00:00:00 để tính toán chính xác số ngày
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    const diffTime = d1.getTime() - d2.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Hàm cộng thêm ngày vào một ngày hiện tại
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

module.exports = { calculateDaysDifference, addDays };