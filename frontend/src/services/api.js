import axios from 'axios';
import Swal from 'sweetalert2';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Interceptor YÊU CẦU (Gắn Token)
api.interceptors.request.use(
    (config) => {
        const authState = JSON.parse(localStorage.getItem('auth') || '{}');
        const token = authState.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor PHẢN HỒI (Xử lý lỗi chung)
api.interceptors.response.use(
    (response) => response.data, 
    (error) => {
        const status = error.response ? error.response.status : null;
        const message = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!';

        // Kiểm tra xem có phải đang gọi API đăng nhập không
        const isLoginRequest = error.config.url.includes('/auth/login');

        // Nếu hết hạn token (401) VÀ KHÔNG PHẢI đang ở form đăng nhập -> Đá ra ngoài
        if (status === 401 && !isLoginRequest) {
            localStorage.removeItem('auth');
            window.location.href = '/login';
        } 
        // Các lỗi khác (bao gồm sai mật khẩu 401 khi login) -> Hiện thông báo
        else if (status !== 404) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: message,
                confirmButtonColor: '#764ba2'
            });
        }

        return Promise.reject(error);
    }
);

export default api;