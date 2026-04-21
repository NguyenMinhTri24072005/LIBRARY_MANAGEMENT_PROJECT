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
        component: () => import('../components/AdminLayout.vue'), // Layout cha bọc bên ngoài
        meta: { requiresAuth: true, role: 'admin' },
        children: [
            {
                path: '', // Đường dẫn mặc định khi vào /admin
                name: 'AdminDashboard',
                component: () => import('../views/admin/Dashboard.vue'),
            },
            // Các trang con khác sẽ thêm vào đây sau:
            // { path: 'books', name: 'AdminBooks', component: ... }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    const isAdmin = authStore.isAdmin;

    // 1. Nếu đã đăng nhập mà cố vào trang Login -> Đẩy về trang chủ tương ứng
    if (to.meta.requiresGuest && isAuthenticated) {
        return next(isAdmin ? '/admin' : '/');
    }

    // 2. Chặn người chưa đăng nhập vào trang yêu cầu Auth
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next('/login');
    }

    // 3. Chặn Độc giả (user) vào trang Admin và ngược lại
    if (to.meta.role === 'admin' && !isAdmin) {
        return next('/');
    }
    if (to.meta.role === 'user' && isAdmin) {
        return next('/admin');
    }

    next();
});

export default router;