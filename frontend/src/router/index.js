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
        path: '/register', // <--- THÊM ROUTE NÀY
        name: 'Register',
        component: () => import('../views/user/Register.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/user/BooksCatalog.vue'),
        meta: { requiresAuth: true, role: 'user' }
    },
    {
        path: '/',
        component: () => import('../components/UserLayout.vue'), // <--- DÙNG LAYOUT MỚI
        meta: { requiresAuth: true, role: 'user' },
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('../views/user/Home.vue'), // Landing Page mới
            },
            {
                path: 'books', // <--- THÊM ROUTE NÀY
                name: 'BooksCatalog',
                component: () => import('../views/user/BooksCatalog.vue'), // Trang danh sách sách cũ
            },
            {
                path: 'books/:id', // <--- THÊM ROUTE NÀY VÀO ĐÂY
                name: 'BookDetail',
                component: () => import('../views/user/BookDetail.vue'),
            },
            {
                path: 'cart',
                name: 'Cart',
                component: () => import('../views/user/Cart.vue'), // <--- ĐÃ SỬA
            },
            {
                path: 'history',
                name: 'History',
                component: () => import('../views/user/History.vue'), // <--- ĐÃ SỬA
            }
        ]
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
            {
                path: 'publishers',
                name: 'AdminPublishers',
                component: () => import('../views/admin/Publishers.vue'),
            },
            {
                path: 'readers',
                name: 'AdminReaders',
                component: () => import('../views/admin/Readers.vue'),
            },
            {
                path: 'borrows',
                name: 'AdminBorrows',
                component: () => import('../views/admin/Borrows.vue'),
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

    // 3. Chặn Độc giả (user) vào trang Admin
    if (to.meta.role === 'admin' && !isAdmin) {
        return '/';
    }

    // Nếu hợp lệ, tự động cho qua
    return true;
});

export default router;