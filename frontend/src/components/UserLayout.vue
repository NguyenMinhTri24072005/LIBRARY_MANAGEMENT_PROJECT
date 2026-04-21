<template>
    <div class="min-vh-100 d-flex flex-column bg-light">
        <!-- HEADER -->
        <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
            <div class="container">
                <!-- Logo -->
                <router-link class="navbar-brand d-flex align-items-center fw-bold text-primary" to="/">
                    <i class="bi bi-book-half fs-3 me-2"></i>
                    <span class="fs-4">Thư Viện Vie</span>
                </router-link>

                <!-- Nút toggle cho mobile -->
                <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarUser">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarUser">
                    <!-- Thanh tìm kiếm (Chiếm phần giữa) -->
                    <form class="d-flex mx-lg-auto my-3 my-lg-0 w-100" style="max-width: 500px;">
                        <div class="input-group">
                            <input type="text" class="form-control border-primary bg-light"
                                placeholder="Tìm kiếm sách, tác giả...">
                            <button class="btn btn-primary px-4" type="button"><i class="bi bi-search"></i></button>
                        </div>
                    </form>

                    <!-- Menu bên phải -->
                    <ul class="navbar-nav align-items-lg-center gap-2">
                        <li class="nav-item me-lg-2">
                            <router-link to="/books" class="nav-link fw-bold text-dark d-flex align-items-center"
                                active-class="text-primary">
                                <i class="bi bi-collection me-1"></i> Tủ Sách
                            </router-link>
                        </li>

                        <!-- CHỈ HIỂN THỊ GIỎ SÁCH NẾU LÀ ĐỘC GIẢ -->
                        <li class="nav-item me-lg-2" v-if="!authStore.isAdmin">
                            <router-link to="/cart" class="nav-link position-relative d-flex align-items-center">
                                <i class="bi bi-cart3 fs-4 text-dark"></i>
                                <span v-if="cartStore.totalItems > 0"
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                    style="margin-left: -5px; margin-top: 5px;">
                                    {{ cartStore.totalItems }}
                                </span>
                            </router-link>
                        </li>

                        <!-- Dropdown User -->
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" role="button"
                                data-bs-toggle="dropdown">
                                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                    style="width: 35px; height: 35px;">
                                    {{ userInitials }}
                                </div>
                                <span class="fw-semibold text-dark d-lg-none d-xl-inline">{{ authStore.user?.ten ||
                                    authStore.user?.hoTenNV }}</span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3">
                                <li v-if="!authStore.isAdmin">
                                    <h6 class="dropdown-header text-primary fw-bold">Điểm uy tín: <i
                                            class="bi bi-star-fill text-warning"></i> {{ authStore.user?.diemUyTin ||
                                        100 }}</h6>
                                </li>
                                <li v-if="!authStore.isAdmin">
                                    <hr class="dropdown-divider">
                                </li>
                                <li v-if="!authStore.isAdmin">
                                    <router-link to="/history" class="dropdown-item py-2">
                                        <i class="bi bi-clock-history me-2 text-muted"></i>Lịch sử mượn trả
                                    </router-link>
                                </li>

                                <!-- NÚT DÀNH RIÊNG CHO ADMIN QUAY VỀ DASHBOARD -->
                                <li v-if="authStore.isAdmin">
                                    <router-link to="/admin" class="dropdown-item py-2 text-primary fw-bold">
                                        <i class="bi bi-shield-lock-fill me-2"></i>Vào Trang Quản Trị
                                    </router-link>
                                </li>

                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li>
                                    <button @click="handleLogout" class="dropdown-item py-2 text-danger fw-semibold">
                                        <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- MAIN CONTENT -->
        <main class="flex-grow-1 container py-4">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>

        <!-- FOOTER -->
        <footer class="bg-white border-top py-4 mt-auto">
            <div class="container text-center text-muted small">
                <p class="mb-1">&copy; 2024 Thư Viện Vie. Đồ án CT449 - Nguyễn Minh Trí.</p>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.store';
import { useCartStore } from '../store/cart.store';
import Swal from 'sweetalert2';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const userInitials = computed(() => {
    const ten = authStore.user?.ten || 'U';
    return ten.charAt(0).toUpperCase();
});

const handleLogout = () => {
    Swal.fire({
        title: 'Đăng xuất?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#764ba2',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Đăng xuất'
    }).then((result) => {
        if (result.isConfirmed) {
            authStore.logout();
            router.push('/login');
        }
    });
};
</script>

<style scoped>
.text-primary {
    color: var(--accent) !important;
}

.bg-primary {
    background-color: var(--accent) !important;
}

.border-primary {
    border-color: var(--accent) !important;
}

.btn-primary {
    background-color: var(--accent);
    border-color: var(--accent);
}

.btn-primary:hover {
    background-color: #902be6;
    border-color: #902be6;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>