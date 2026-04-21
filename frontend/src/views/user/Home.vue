<template>
  <div class="container mt-5 text-center">
    <h1 class="text-success">🏠 TRANG CHỦ ĐỘC GIẢ</h1>
    <p class="lead">Chào mừng bạn đến với Thư Viện. Bạn đã đăng nhập thành công!</p>
    
    <button @click="handleLogout" class="btn btn-danger mt-3">
      <i class="bi bi-box-arrow-right"></i> Đăng xuất
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
    authStore.logout();
    router.push('/login');
};
</script>