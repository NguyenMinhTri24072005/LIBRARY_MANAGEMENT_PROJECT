<template>
  <div class="register-wrapper min-vh-100 d-flex align-items-center justify-content-center py-5">
    <div class="container">
      <div class="card shadow-lg border-0 rounded-4 overflow-hidden mx-auto" style="max-width: 900px;">
        <div class="row g-0">
          
          <!-- Cột trái: Banner -->
          <div class="col-md-5 d-none d-md-flex flex-column bg-primary align-items-center justify-content-center text-center p-5 text-white" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <i class="bi bi-person-plus-fill display-1 mb-3"></i>
            <h3 class="fw-bold mb-2">Đăng Ký Tài Khoản</h3>
            <p class="text-white-50">Trở thành thành viên của Thư Viện Vie để mượn hàng ngàn cuốn sách miễn phí.</p>
          </div>

          <!-- Cột phải: Form Đăng ký -->
          <div class="col-md-7 bg-white p-4 p-lg-5">
            <div class="text-center mb-4 d-md-none">
              <h3 class="fw-bold text-dark">Đăng Ký</h3>
            </div>
            
            <form @submit.prevent="handleRegister" class="row g-3">
              <!-- Họ lót & Tên -->
              <div class="col-sm-7">
                <label class="form-label fw-semibold text-muted small mb-1">Họ lót <span class="text-danger">*</span></label>
                <input type="text" class="form-control bg-light border-0" v-model="formData.hoLot" required>
              </div>
              <div class="col-sm-5">
                <label class="form-label fw-semibold text-muted small mb-1">Tên <span class="text-danger">*</span></label>
                <input type="text" class="form-control bg-light border-0" v-model="formData.ten" required>
              </div>

              <!-- Số điện thoại & Giới tính -->
              <div class="col-sm-7">
                <label class="form-label fw-semibold text-muted small mb-1">Số điện thoại (Dùng đăng nhập) <span class="text-danger">*</span></label>
                <input type="text" class="form-control bg-light border-0" v-model="formData.dienThoai" required>
              </div>
              <div class="col-sm-5">
                <label class="form-label fw-semibold text-muted small mb-1">Giới tính</label>
                <select class="form-select bg-light border-0" v-model="formData.phai">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <!-- Mật khẩu -->
              <div class="col-12">
                <label class="form-label fw-semibold text-muted small mb-1">Mật khẩu <span class="text-danger">*</span></label>
                <input type="password" class="form-control bg-light border-0" v-model="formData.password" required minlength="6">
              </div>

              <!-- Địa chỉ -->
              <div class="col-12">
                <label class="form-label fw-semibold text-muted small mb-1">Địa chỉ</label>
                <input type="text" class="form-control bg-light border-0" v-model="formData.diaChi">
              </div>

              <!-- Ngày sinh -->
              <div class="col-12 mb-2">
                <label class="form-label fw-semibold text-muted small mb-1">Ngày sinh</label>
                <input type="date" class="form-control bg-light border-0" v-model="formData.ngaySinh">
              </div>

              <div class="col-12 mt-4">
                <button type="submit" class="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm" :disabled="isLoading" style="background: #764ba2; border: none;">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isLoading ? 'Đang xử lý...' : 'ĐĂNG KÝ' }}
                </button>
              </div>
            </form>

            <div class="text-center mt-4">
              <span class="text-muted small">Đã có tài khoản? </span>
              <router-link to="/login" class="text-decoration-none fw-bold" style="color: #764ba2;">Đăng nhập ngay</router-link>
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
import api from '../../services/api';
import Swal from 'sweetalert2';

const router = useRouter();
const isLoading = ref(false);

const formData = ref({
    hoLot: '',
    ten: '',
    dienThoai: '',
    password: '',
    phai: 'Nam',
    diaChi: '',
    ngaySinh: ''
});

const handleRegister = async () => {
    isLoading.value = true;
    try {
        await api.post('/auth/register', formData.value);
        
        Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Đăng ký tài khoản thành công. Vui lòng đăng nhập!',
            confirmButtonColor: '#764ba2'
        }).then(() => {
            router.push('/login');
        });
    } catch (error) {
        // Lỗi (như trùng SĐT) đã được Axios Interceptor bắt và hiển thị Swal
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.register-wrapper { background-color: #f4f7f6; }
.form-control:focus, .form-select:focus {
    box-shadow: none;
    border: 1px solid #764ba2 !important;
    background-color: #fff !important;
}
</style>