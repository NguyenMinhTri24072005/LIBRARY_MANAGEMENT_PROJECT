import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth.store';
import Profile from '../views/Profile.vue';

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
            },
            {
                path: 'profile',
                name: 'UserProfile',
                component: Profile,
                meta: { requiresAuth: true }
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
            },
            {
                path: 'profile',
                name: 'AdminProfile',
                component: Profile
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = !!authStore.token;
    
    // Kiểm tra chức vụ: Thủ thư hoặc Admin đều được vào trang quản trị
    const isAdmin = authStore.user?.chucVu === 'Thủ thư' || authStore.user?.chucVu === 'Admin';

    if (to.meta.requiresAuth && !isAuthenticated) {
        return next('/login');
    }

    if (to.meta.requiresAdmin && !isAdmin) {
        return next('/');
    }

    next();
});
export default router;