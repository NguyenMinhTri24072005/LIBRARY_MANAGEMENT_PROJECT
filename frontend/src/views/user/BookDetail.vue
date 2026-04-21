<template>
    <div class="container py-5">
        <!-- Nút quay lại -->
        <button class="btn btn-light mb-4 text-primary fw-semibold shadow-sm" @click="router.go(-1)">
            <i class="bi bi-arrow-left me-2"></i>Quay lại
        </button>

        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="book" class="row g-5">
            <!-- Cột Ảnh -->
            <div class="col-md-5 col-lg-4 text-center">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style="top: 90px;">
                    <img :src="getImageUrl(book.hinhAnh)" class="img-fluid w-100 object-fit-cover"
                        style="max-height: 500px;" @error="handleImageError">
                </div>
            </div>

            <!-- Cột Thông tin -->
            <div class="col-md-7 col-lg-8">
                <div class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 mb-3 fw-bold">
                    <i class="bi bi-building me-1"></i> {{ book.maNXB?.tenNXB || 'N/A' }}
                </div>

                <h1 class="fw-bolder text-dark mb-3">{{ book.tenSach }}</h1>
                <h5 class="text-muted mb-4"><i class="bi bi-pen me-2"></i>Tác giả: <span class="text-dark">{{
                    book.tacGia }}</span></h5>

                <div class="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom">
                    <div>
                        <div class="text-muted small mb-1">Đơn giá tham khảo</div>
                        <h3 class="fw-bold text-primary mb-0">{{ formatCurrency(book.donGia) }}</h3>
                    </div>
                    <div class="border-start ps-4">
                        <div class="text-muted small mb-1">Tình trạng kho</div>
                        <h4 class="fw-bold mb-0" :class="book.soQuyenHienTai > 0 ? 'text-success' : 'text-danger'">
                            {{ book.soQuyenHienTai > 0 ? `Còn ${book.soQuyenHienTai} cuốn` : 'Đã hết sách' }}
                        </h4>
                    </div>
                    <div class="border-start ps-4">
                        <div class="text-muted small mb-1">Năm xuất bản</div>
                        <h4 class="fw-bold text-dark mb-0">{{ book.namXuatBan || 'N/A' }}</h4>
                    </div>
                </div>

                <!-- Nút Thêm vào giỏ -->
                <div class="card-footer bg-white border-0 p-3 pt-0">
                    <button v-if="!authStore.isAdmin" class="btn w-100 fw-bold rounded-3 shadow-sm btn-primary"
                        :disabled="book.soQuyenHienTai <= 0 || cartStore.totalItems >= maxBorrowBooks"
                        @click.stop="handleAddToCart(book)">

                        <span v-if="book.soQuyenHienTai <= 0"><i class="bi bi-x-circle me-1"></i> Hết sách</span>
                        <span v-else>
                            <i class="bi bi-cart-plus me-1"></i>
                            Mượn sách <span
                                v-if="cartStore.getQuantityInCart && cartStore.getQuantityInCart(book._id) > 0"
                                class="badge bg-white text-primary ms-1">{{ cartStore.getQuantityInCart(book._id)
                                }}</span>
                        </span>
                    </button>
                    <button v-else class="btn w-100 fw-bold rounded-3 btn-secondary" disabled>
                        <i class="bi bi-shield-lock me-1"></i> Dành cho Độc giả
                    </button>
                </div>

                <div class="alert alert-light border mt-4 text-muted small">
                    <i class="bi bi-info-circle-fill text-primary me-2"></i>
                    Lưu ý: Bạn cần đến thư viện để nhận sách sau khi yêu cầu mượn được thủ thư duyệt.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../services/api';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const book = ref(null);
const isLoading = ref(true);
const maxBorrowBooks = ref(5);

const fetchBookDetail = async () => {
    try {
        const res = await api.get(`/books/${route.params.id}`);
        book.value = res.data;
    } catch (error) {
        console.error(error);
        router.push('/books'); // Lỗi thì quay về danh sách
    } finally {
        isLoading.value = false;
    }
};

const fetchSettings = async () => {
    try {
        const res = await api.get('/settings');
        if (res.data) maxBorrowBooks.value = res.data.soSachMuonToiDa;
    } catch (error) { }
};

const handleAddToCart = (b) => {
    cartStore.addToCart(b, maxBorrowBooks.value);
};

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
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
    fetchBookDetail();
});
</script>

<style scoped>
.text-primary {
    color: var(--accent) !important;
}

.bg-primary {
    background-color: var(--accent) !important;
}

.btn-primary {
    background-color: var(--accent);
    border-color: var(--accent);
}

.btn-primary:hover {
    background-color: #902be6;
    border-color: #902be6;
}
</style>