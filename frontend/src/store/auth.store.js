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
        logout() {
            this.user = null;
            this.token = null;
        }
    },
    persist: true // Tự động lưu localStorage
});