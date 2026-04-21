<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-dark mb-0"><i class="bi bi-cart3 text-primary me-2"></i>Giỏ Sách Của Bạn</h3>
      <button v-if="cartStore.totalItems > 0" class="btn btn-outline-danger btn-sm fw-semibold rounded-pill px-3" @click="clearCart">
        <i class="bi bi-trash3 me-1"></i> Xóa tất cả
      </button>
    </div>

    <div class="row g-4">
      <!-- Cột Trái: Danh sách sách trong giỏ -->
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          
          <!-- Trạng thái trống -->
          <div v-if="cartStore.totalItems === 0" class="card-body text-center py-5">
            <div class="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 100px; height: 100px;">
              <i class="bi bi-bag-x text-muted display-4"></i>
            </div>
            <h5 class="fw-bold text-dark">Giỏ sách đang trống</h5>
            <p class="text-muted mb-4">Bạn chưa chọn cuốn sách nào để mượn.</p>
            <router-link to="/books" class="btn btn-primary fw-bold px-4 rounded-pill shadow-sm">
              Khám phá sách ngay
            </router-link>
          </div>

          <!-- Danh sách sách -->
          <div v-else class="list-group list-group-flush">
            <div v-for="(book, index) in cartStore.items" :key="book._id" class="list-group-item p-4">
              <div class="d-flex gap-3 align-items-center">
                <!-- Số thứ tự -->
                <span class="text-muted fw-bold fs-5">{{ index + 1 }}</span>
                
                <!-- Ảnh bìa -->
                <img :src="getImageUrl(book.hinhAnh)" class="rounded border shadow-sm" style="width: 60px; height: 90px; object-fit: cover;" @error="handleImageError">
                
                <!-- Thông tin -->
                <div class="flex-grow-1">
                  <h5 class="fw-bold text-dark mb-1">{{ book.tenSach }}</h5>
                  <div class="text-muted small mb-2"><i class="bi bi-pen me-1"></i>{{ book.tacGia }}</div>
                  <span class="badge bg-light text-dark border"><i class="bi bi-building me-1"></i>{{ book.maNXB?.tenNXB || 'N/A' }}</span>
                </div>

                <!-- Nút xóa -->
                <button class="btn btn-light text-danger rounded-circle p-2" @click="removeItem(book._id)" title="Xóa khỏi giỏ">
                  <i class="bi bi-x-lg fs-5"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột Phải: Tổng quan & Nút xác nhận -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 sticky-top" style="top: 90px;">
          <div class="card-body p-4">
            <h5 class="fw-bold text-dark mb-4 border-bottom pb-3">Thông Tin Mượn Sách</h5>
            
            <div class="d-flex justify-content-between mb-3">
              <span class="text-muted">Số lượng sách:</span>
              <span class="fw-bold fs-5">{{ cartStore.totalItems }} <span class="fs-6 fw-normal text-muted">cuốn</span></span>
            </div>

            <div class="alert alert-info border-0 bg-primary bg-opacity-10 text-primary rounded-3 mb-4">
              <i class="bi bi-info-circle-fill me-2"></i>
              <small class="fw-semibold">Bạn có thể mượn tối đa sách trong {{ settings.soNgayMuonToiDa || 14 }} ngày.</small>
            </div>

            <button class="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm fs-5" 
                    :disabled="cartStore.totalItems === 0 || isSubmitting" 
                    @click="submitBorrowRequest">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-send-check-fill me-2"></i>
              Gửi Yêu Cầu Mượn
            </button>

            <div class="text-center mt-3">
              <router-link to="/books" class="text-decoration-none text-muted small fw-semibold hover-primary">
                <i class="bi bi-arrow-left me-1"></i> Tiếp tục chọn sách
              </router-link>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../store/cart.store';
import api from '../../services/api';
import Swal from 'sweetalert2';

const router = useRouter();
const cartStore = useCartStore();
const isSubmitting = ref(false);
const settings = ref({});

// Hàm lấy cài đặt hệ thống (Để hiển thị số ngày mượn)
const fetchSettings = async () => {
    try {
        const res = await api.get('/settings');
        if (res.data) settings.value = res.data;
    } catch (error) { console.error(error); }
};

// Xóa 1 cuốn
const removeItem = (id) => {
    cartStore.removeFromCart(id);
};

// Xóa tất cả
const clearCart = () => {
    Swal.fire({
        title: 'Xóa giỏ sách?',
        text: "Bạn có chắc chắn muốn bỏ chọn tất cả sách?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Xóa tất cả'
    }).then((result) => {
        if (result.isConfirmed) {
            cartStore.clearCart();
        }
    });
};

// Gửi yêu cầu mượn
const submitBorrowRequest = async () => {
    if (cartStore.totalItems === 0) return;
    
    isSubmitting.value = true;
    try {
        // Lấy mảng ID sách từ giỏ hàng
        const dsMaSach = cartStore.items.map(book => book._id);
        
        // Gửi API
        await api.post('/borrows', { dsMaSach });
        
        // Thành công: Xóa giỏ hàng, thông báo và chuyển trang
        cartStore.clearCart();
        Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Yêu cầu mượn sách đã được gửi đến Thủ thư.',
            confirmButtonColor: '#764ba2'
        }).then(() => {
            router.push('/history');
        });

    } catch (error) {
        // Lỗi (như nợ phạt, khóa thẻ, mượn quá số lượng) đã được Axios Interceptor bắt
        console.error("Lỗi gửi yêu cầu mượn:", error);
    } finally {
        isSubmitting.value = false;
    }
};

// Xử lý ảnh
const defaultImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2250%22%20height%3D%2270%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2050%2070%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%2250%22%20height%3D%2270%22%20fill%3D%22%23eeeeee%22%2F%3E%3Ctext%20text-anchor%3D%22middle%22%20x%3D%2225%22%20y%3D%2238%22%20style%3D%22fill%3A%23aaaaaa%3Bfont-weight%3Abold%3Bfont-size%3A10px%3Bfont-family%3AArial%2CHelvetica%2Csans-serif%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
const getImageUrl = (path) => {
    if (!path) return defaultImage;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `http://localhost:3000${path}`;
};
const handleImageError = (e) => {
    e.target.src = defaultImage;
    e.target.onerror = null; 
};

onMounted(() => {
    fetchSettings();
});
</script>

<style scoped>
.text-primary { color: var(--accent) !important; }
.bg-primary { background-color: var(--accent) !important; }
.btn-primary { background-color: var(--accent); border-color: var(--accent); }
.btn-primary:hover { background-color: #902be6; border-color: #902be6; }
.hover-primary:hover { color: var(--accent) !important; }
</style>