import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth.store';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/user/Login.vue'),
        meta: { requiresGuest: true } 
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/user/Home.vue'),
        meta: { requiresAuth: true, role: 'user' }
    },
    // --- KHU VỰC ADMIN ---
    {
        path: '/admin',
        component: () => import('../components/AdminLayout.vue'),
        meta: { requiresAuth: true, role: 'admin' },
        children: [
            {
                path: '', 
                name: 'AdminDashboard',
                component: () => import('../views/admin/Dashboard.vue'),
            },
            {
                path: 'settings',
                name: 'AdminSettings',
                component: () => import('../views/admin/Settings.vue'),
            },
            {
                path: 'books',
                name: 'AdminBooks',
                component: () => import('../views/admin/Books.vue'),
            },
            // Tạm thời trỏ về một view trống hoặc Dashboard để không bị lỗi "No match found"
            {
                path: 'readers',
                name: 'AdminReaders',
                component: () => import('../views/admin/Dashboard.vue'),
            },
            {
                path: 'borrows',
                name: 'AdminBorrows',
                component: () => import('../views/admin/Dashboard.vue'),
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    const isAdmin = authStore.isAdmin;

    // 1. Nếu đã đăng nhập mà cố vào trang Login -> Đẩy về trang chủ tương ứng
    if (to.meta.requiresGuest && isAuthenticated) {
        return isAdmin ? '/admin' : '/';
    }

    // 2. Chặn người chưa đăng nhập vào trang yêu cầu Auth
    if (to.meta.requiresAuth && !isAuthenticated) {
        return '/login';
    }

    // 3. Chặn Độc giả (user) vào trang Admin và ngược lại
    if (to.meta.role === 'admin' && !isAdmin) {
        return '/';
    }
    if (to.meta.role === 'user' && isAdmin) {
        return '/admin';
    }

    // Nếu hợp lệ, tự động cho qua (không cần return)
    return true; 
});

export default router;