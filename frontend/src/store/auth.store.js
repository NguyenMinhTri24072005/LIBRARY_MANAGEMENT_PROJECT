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
        // Tìm đến action login trong auth.store.js và sửa lại như sau:
        async login(credentials) {
            try {
                const response = await api.post('/auth/login', credentials);

                // Backend trả về { success: true, data: { token, user } }
                // Nên phải lấy response.data.data
                const result = response.data.data;

                this.token = result.token;
                this.user = result.user;

                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));

                api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                return result;
            } catch (error) {
                this.logout();
                throw error;
            }
        },
        // Gọi API để lấy thông tin mới nhất của User (Cập nhật điểm uy tín, trạng thái khóa...)
        async fetchCurrentUser() {
            if (!this.token) return;

            try {
                const isAdmin = this.user?.chucVu === 'Thủ thư' || this.user?.chucVu === 'Admin' || this.user?.role === 'admin';
                const endpoint = isAdmin ? '/auth/me' : '/readers/profile';
                
                const res = await api.get(endpoint);
                const freshData = res.data?.data || res.data;
                
                if (freshData) {
                    this.user = { ...this.user, ...freshData };
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