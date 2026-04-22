<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div class="container">
            <router-link class="navbar-brand d-flex align-items-center fw-bold text-primary" to="/">
                <i class="bi bi-book-half fs-3 me-2"></i>
                <span class="fs-4">Thư Viện Vie</span>
            </router-link>

            <button class="navbar-toggler border-0 shadow-none" type="button" @click="toggleMobileMenu">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" :class="{ 'show': isMobileMenuOpen }" id="navbarUser">


                <ul class="navbar-nav ms-auto align-items-lg-center gap-4">
                    <li class="nav-item me-lg-2" @click="isMobileMenuOpen = false">
                        <router-link to="/about" class="nav-link fw-bold text-dark d-flex align-items-center"
                            active-class="text-primary">
                            <i class="bi bi-info-circle me-1"></i> Giới Thiệu
                        </router-link>
                    </li>

                    <li class="nav-item me-lg-2" @click="isMobileMenuOpen = false">
                        <router-link to="/contact" class="nav-link fw-bold text-dark d-flex align-items-center"
                            active-class="text-primary">
                            <i class="bi bi-envelope me-1"></i> Liên Hệ
                        </router-link>
                    </li>

                    <li class="nav-item me-lg-2" @click="isMobileMenuOpen = false">
                        <router-link to="/books" class="nav-link fw-bold text-dark d-flex align-items-center"
                            active-class="text-primary">
                            <i class="bi bi-collection me-1"></i> Tủ Sách
                        </router-link>
                    </li>

                    <li class="nav-item me-lg-2" v-if="!authStore.isAdmin" @click="isMobileMenuOpen = false">
                        <router-link to="/cart" class="nav-link position-relative d-flex align-items-center">
                            <i class="bi bi-cart3 fs-4 text-dark"></i>
                            <span v-if="cartStore.totalItems > 0"
                                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                style="margin-left: -5px; margin-top: 5px;">
                                {{ cartStore.totalItems }}
                            </span>
                        </router-link>
                    </li>

                    <li class="nav-item dropdown user-dropdown" v-if="authStore.isAuthenticated">
                        <a class="nav-link dropdown-toggle d-flex align-items-center gap-2 cursor-pointer"
                            @click.prevent="toggleDropdown" role="button">
                            <div class="avatar-wrapper bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                                style="width: 35px; height: 35px;">
                                <img v-if="authStore.user?.hinhAnh" :src="userAvatar"
                                    class="rounded-circle object-fit-cover" style="width: 100%; height: 100%;"
                                    @error="handleImageError" alt="Avatar">
                                <span v-else>{{ userInitials }}</span>
                            </div>
                            <span class="fw-semibold text-dark d-lg-none d-xl-inline">{{ authStore.user?.ten ||
                                authStore.user?.hoTenNV }}</span>
                        </a>

                        <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3"
                            :class="{ 'show': isDropdownOpen }">
                            <li v-if="!authStore.isAdmin">
                                <h6 class="dropdown-header text-primary fw-bold">Điểm uy tín: <i
                                        class="bi bi-star-fill text-warning"></i> {{ authStore.user?.diemUyTin || 100 }}
                                </h6>
                            </li>
                            <li v-if="!authStore.isAdmin">
                                <hr class="dropdown-divider">
                            </li>

                            <li @click="closeMenu">
                                <router-link :to="authStore.isAdmin ? '/admin/profile' : '/profile'"
                                    class="dropdown-item py-2">
                                    <i class="bi bi-person-vcard me-2 text-primary"></i>Hồ sơ cá nhân
                                </router-link>
                            </li>

                            <li v-if="!authStore.isAdmin" @click="closeMenu">
                                <router-link to="/history" class="dropdown-item py-2">
                                    <i class="bi bi-clock-history me-2 text-muted"></i>Lịch sử mượn trả
                                </router-link>
                            </li>

                            <li v-if="authStore.isAdmin" @click="closeMenu">
                                <router-link to="/admin" class="dropdown-item py-2 text-primary fw-bold">
                                    <i class="bi bi-shield-lock-fill me-2"></i>Vào Trang Quản Trị
                                </router-link>
                            </li>

                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li @click="closeMenu">
                                <button @click="handleLogout" class="dropdown-item py-2 text-danger fw-semibold">
                                    <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                                </button>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item" v-else @click="isMobileMenuOpen = false">
                        <router-link to="/login" class="btn btn-outline-primary fw-bold px-4 rounded-pill">Đăng
                            nhập</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.store';
import { useCartStore } from '../store/cart.store';
import Swal from 'sweetalert2';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

// --- STATE QUẢN LÝ DROPDOWN & MENU MOBILE BẰNG VUE ---
const isDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMenu = () => {
    isDropdownOpen.value = false;
    isMobileMenuOpen.value = false;
};

// Đóng dropdown khi người dùng click ra ngoài vùng menu
const handleClickOutside = (e) => {
    if (!e.target.closest('.user-dropdown')) {
        isDropdownOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
// ----------------------------------------------------

const userInitials = computed(() => {
    const name = authStore.user?.ten || authStore.user?.hoTenNV || 'U';
    const words = name.split(' ');
    return words[words.length - 1].charAt(0).toUpperCase();
});

// Logic xử lý đường dẫn ảnh Avatar
const userAvatar = computed(() => {
    const path = authStore.user?.hinhAnh;
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path}`;
});

// Xóa ảnh nếu có lỗi load (để fallback về chữ cái)
const handleImageError = (e) => {
    e.target.style.display = 'none';
};

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
            cartStore.clearCart();
            router.push('/login');
        }
    });
};
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}

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

/* Thêm transition nhẹ nhàng khi dropdown xổ xuống */
.dropdown-menu {
    display: block;
    visibility: hidden;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.2s ease;
}

.dropdown-menu.show {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
}

.avatar-wrapper {
    overflow: hidden;
}

.object-fit-cover {
    object-fit: cover;
}
</style>