<template>
    <div class="login-wrapper min-vh-100 d-flex align-items-center justify-content-center">
        <div class="container">
            <div class="card shadow-lg border-0 rounded-4 overflow-hidden mx-auto" style="max-width: 900px;">
                <div class="row g-0">

                    <!-- Cột trái: Banner Hình ảnh -->
                    <div class="col-md-6 d-none d-md-flex bg-primary align-items-center justify-content-center text-center p-5 text-white"
                        style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <div>
                            <i class="bi bi-book-half display-1 mb-3"></i>
                            <h2 class="fw-bold mb-2">Hệ Thống Thư Viện</h2>
                            <p class="text-white-50">Nền tảng quản lý mượn trả sách thông minh, nhanh chóng và tiện lợi.
                            </p>
                        </div>
                    </div>

                    <!-- Cột phải: Form Đăng nhập -->
                    <div class="col-md-6 bg-white p-5">
                        <div class="text-center mb-4">
                            <h3 class="fw-bold text-dark mb-1">Đăng Nhập</h3>
                            <p class="text-muted small">Vui lòng chọn vai trò để tiếp tục</p>
                        </div>

                        <!-- Nút chọn Vai trò (Nav Pills) -->
                        <ul class="nav nav-pills nav-fill mb-4 p-1 bg-light rounded-3" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link fw-semibold" :class="{ active: role === 'user' }"
                                    @click="role = 'user'">
                                    <i class="bi bi-person-badge me-1"></i> Độc giả
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link fw-semibold" :class="{ active: role === 'admin' }"
                                    @click="role = 'admin'">
                                    <i class="bi bi-shield-lock me-1"></i> Thủ thư
                                </button>
                            </li>
                        </ul>

                        <!-- Form Nhập liệu -->
                        <form @submit.prevent="handleLogin">
                            <div class="mb-3 form-floating">
                                <input type="text" class="form-control bg-light border-0" id="dienThoaiInput"
                                    v-model="dienThoai" placeholder="Số điện thoại" required>
                                <label for="dienThoaiInput" class="text-muted"><i class="bi bi-telephone me-2"></i>Số
                                    điện thoại</label>
                            </div>

                            <div class="mb-4 form-floating">
                                <input type="password" class="form-control bg-light border-0" id="passwordInput"
                                    v-model="password" placeholder="Mật khẩu" required>
                                <label for="passwordInput" class="text-muted"><i class="bi bi-lock me-2"></i>Mật
                                    khẩu</label>
                            </div>

                            <button type="submit" class="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm"
                                :disabled="isLoading" style="background: #764ba2; border: none;">
                                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                {{ isLoading ? 'Đang xác thực...' : 'ĐĂNG NHẬP' }}
                            </button>
                        </form>

                        <div class="text-center mt-4" v-if="role === 'user'">
                            <span class="text-muted small">Bạn chưa có tài khoản? </span>
                            <router-link to="/register" class="text-decoration-none fw-bold"
                                style="color: #764ba2;">Đăng ký ngay</router-link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth.store';
import Swal from 'sweetalert2';

const router = useRouter();
const authStore = useAuthStore();

const dienThoai = ref('');
const password = ref('');
const role = ref('user');
const isLoading = ref(false);

const handleLogin = async () => {
    isLoading.value = true;
    try {
        await authStore.login(dienThoai.value, password.value, role.value);

        Swal.fire({
            icon: 'success',
            title: 'Xin chào!',
            text: 'Đăng nhập thành công',
            timer: 1500,
            showConfirmButton: false
        });

        // Router Guard sẽ tự động kiểm tra và cho phép đi qua
        if (role.value === 'admin') {
            router.push('/admin');
        } else {
            router.push('/');
        }
    } catch (error) {
        console.error("Login failed");
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.login-wrapper {
    background-color: #f4f7f6;
}

.form-control:focus {
    box-shadow: none;
    border: 1px solid #764ba2 !important;
    background-color: #fff !important;
}

.nav-pills .nav-link.active {
    background-color: #764ba2;
    color: white;
}

.nav-pills .nav-link {
    color: #6c757d;
}
</style>