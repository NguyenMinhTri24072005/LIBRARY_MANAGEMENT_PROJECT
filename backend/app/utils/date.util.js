const calculateDaysDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    // Ép về chuẩn UTC 00:00:00 để tránh sai số do múi giờ Việt Nam (UTC+7)
    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

    const diffTime = utc1 - utc2;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

module.exports = { calculateDaysDifference, addDays };