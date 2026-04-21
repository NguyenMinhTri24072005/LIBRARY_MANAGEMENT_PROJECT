<template>
  <div class="admin-layout d-flex min-vh-100 bg-light">
    
    <!-- SIDEBAR (Cố định trên Desktop, Offcanvas trên Mobile) -->
    <aside class="sidebar bg-white shadow-sm d-flex flex-column" :class="{ 'sidebar-collapsed': !isSidebarOpen }">
      <div class="sidebar-header d-flex align-items-center justify-content-between p-3 border-bottom">
        <router-link to="/admin" class="text-decoration-none d-flex align-items-center text-primary fw-bold fs-5">
          <i class="bi bi-book-half me-2 fs-4"></i>
          <span v-if="isSidebarOpen">Thư Viện Vie</span>
        </router-link>
        <button class="btn btn-sm btn-light d-md-none" @click="toggleSidebar">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="sidebar-menu flex-grow-1 overflow-auto p-2">
        <ul class="nav flex-column gap-1">
          <li class="nav-item">
            <router-link to="/admin" class="nav-link rounded-3 text-secondary d-flex align-items-center" exact-active-class="active bg-primary text-white shadow-sm">
              <i class="bi bi-grid-1x2-fill me-3 fs-5"></i>
              <span v-if="isSidebarOpen">Tổng quan</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/books" class="nav-link rounded-3 text-secondary d-flex align-items-center" active-class="active bg-primary text-white shadow-sm">
              <i class="bi bi-journal-bookmark-fill me-3 fs-5"></i>
              <span v-if="isSidebarOpen">Quản lý Sách</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/publishers" class="nav-link rounded-3 text-secondary d-flex align-items-center" active-class="active bg-primary text-white shadow-sm">
              <i class="bi bi-building me-3 fs-5"></i>
              <span v-if="isSidebarOpen">Nhà Xuất Bản</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/readers" class="nav-link rounded-3 text-secondary d-flex align-items-center" active-class="active bg-primary text-white shadow-sm">
              <i class="bi bi-people-fill me-3 fs-5"></i>
              <span v-if="isSidebarOpen">Độc giả</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/borrows" class="nav-link rounded-3 text-secondary d-flex align-items-center" active-class="active bg-primary text-white shadow-sm">
              <i class="bi bi-card-checklist me-3 fs-5"></i>
              <span v-if="isSidebarOpen">Mượn / Trả sách</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/settings" class="nav-link rounded-3 text-secondary d-flex align-items-center" active-class="active bg-primary text-white shadow-sm">
              <i class="bi bi-gear-fill me-3 fs-5"></i>
              <span v-if="isSidebarOpen">Cài đặt</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="sidebar-footer p-3 border-top">
        <button @click="handleLogout" class="btn btn-light text-danger w-100 d-flex align-items-center justify-content-center fw-semibold">
          <i class="bi bi-box-arrow-right me-2"></i>
          <span v-if="isSidebarOpen">Đăng xuất</span>
        </button>
      </div>
    </aside>

    <!-- CONTENT AREA -->
    <main class="flex-grow-1 d-flex flex-column overflow-hidden">
      <!-- HEADER -->
      <header class="header bg-white shadow-sm d-flex align-items-center justify-content-between px-4 py-3 z-1">
        <div class="d-flex align-items-center">
          <button class="btn btn-light me-3 d-md-none" @click="toggleSidebar">
            <i class="bi bi-list fs-5"></i>
          </button>
          <h5 class="mb-0 fw-bold text-dark">{{ currentRouteName }}</h5>
        </div>

        <div class="d-flex align-items-center gap-3">
          <div class="dropdown">
            <button class="btn btn-light rounded-circle p-2 position-relative" type="button" data-bs-toggle="dropdown">
              <i class="bi bi-bell fs-5 text-secondary"></i>
              <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <li><h6 class="dropdown-header">Thông báo</h6></li>
              <li><a class="dropdown-item small text-muted" href="#">Chưa có thông báo mới</a></li>
            </ul>
          </div>
          
          <div class="d-flex align-items-center gap-2">
            <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 40px; height: 40px;">
              {{ adminInitials }}
            </div>
            <div class="d-none d-sm-block">
              <div class="fw-semibold text-dark lh-1">{{ authStore.user?.hoTenNV }}</div>
              <small class="text-muted">{{ authStore.user?.chucVu }}</small>
            </div>
          </div>
        </div>
      </header>

      <!-- VÙNG HIỂN THỊ TRANG CON -->
      <div class="content-body p-4 flex-grow-1 overflow-auto">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Overlay cho Mobile -->
    <div v-if="isSidebarOpen" class="sidebar-overlay d-md-none" @click="toggleSidebar"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.store';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Trạng thái Sidebar
const isSidebarOpen = ref(true);
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

// Lấy chữ cái đầu của tên Admin
const adminInitials = computed(() => {
    const name = authStore.user?.hoTenNV || 'A';
    const words = name.split(' ');
    return words[words.length - 1].charAt(0).toUpperCase();
});

// Lấy tên Route hiện tại để hiển thị trên Header
const currentRouteName = computed(() => {
    switch (route.name) {
        case 'AdminDashboard': return 'Tổng quan hệ thống';
        case 'AdminBooks': return 'Quản lý Sách';
        case 'AdminPublishers': return 'Nhà Xuất Bản';
        case 'AdminReaders': return 'Quản lý Độc giả';
        case 'AdminBorrows': return 'Quản lý Mượn Trả';
        case 'AdminSettings': return 'Cài đặt hệ thống';
        default: return 'Quản trị viên';
    }
});

const handleLogout = () => {
    Swal.fire({
        title: 'Đăng xuất?',
        text: "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            authStore.logout();
            router.push('/login');
        }
    });
};
</script>

<style scoped>
.sidebar {
    width: 260px;
    transition: all 0.3s ease;
    z-index: 1040;
}
.sidebar-collapsed {
    width: 80px;
}
.sidebar-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1030;
}
.nav-link {
    transition: all 0.2s ease;
}
.nav-link:hover:not(.active) {
    background-color: #f8f9fa;
    color: var(--accent) !important;
}
.bg-primary {
    background-color: var(--accent) !important;
}
.text-primary {
    color: var(--accent) !important;
}

/* Animation chuyển trang */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive Mobile */
@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        height: 100vh;
        left: -260px;
    }
    .sidebar:not(.sidebar-collapsed) {
        left: 0;
    }
}
</style>