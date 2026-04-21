import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.chucVu === 'Thủ thư' || state.user?.chucVu === 'Admin',
        isUser: (state) => state.user?.role === 'user',
    },
    actions: {
        async login(credentials) {
            try {
                const response = await api.post('/auth/login', credentials);

                // SỬA LỖI TẠI ĐÂY: Trích xuất từ response.data.data
                const loginData = response.data.data;

                this.token = loginData.token;
                this.user = loginData.user;

                // Lưu vào localStorage
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));

                // Thiết lập header cho các request sau
                api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

                return loginData;
            } catch (error) {
                this.logout();
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