import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin',
        isUser: (state) => state.user?.role === 'user',
    },
    actions: {
        async login(dienThoai, password, role) {
            try {
                // api.post trả về toàn bộ cục JSON { success, message, data: { user, token } }
                const response = await api.post('/auth/login', { dienThoai, password, role });

                // Trích xuất user và token từ response.data
                const userData = response.data.user;
                const tokenData = response.data.token;

                // Gắn thêm trường role vào user để Vue Router nhận diện phân quyền
                this.user = { ...userData, role: role };
                this.token = tokenData;

                return response;
            } catch (error) {
                throw error;
            }
        },
        // Gọi API để lấy thông tin mới nhất của User (Cập nhật điểm uy tín, trạng thái khóa...)
        async fetchCurrentUser() {
            if (!this.token || this.user?.role === 'admin') return; // Chỉ cập nhật cho Độc giả

            try {
                const res = await api.get('/readers/profile');
                if (res.data) {
                    // Giữ lại role 'user' và ghi đè các thông tin mới từ DB
                    this.user = { ...res.data, role: 'user' };
                }
            } catch (error) {
                console.error("Không thể cập nhật thông tin User", error);
            }
        },

        logout() {
            this.user = null;
            this.token = null;
        }
    },
    persist: true // Tự động lưu localStorage
});