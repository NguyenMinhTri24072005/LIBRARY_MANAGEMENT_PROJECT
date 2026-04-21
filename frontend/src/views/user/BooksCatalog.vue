<template>
    <div class="container py-4">
        <div class="row justify-content-center mb-4">
            <div class="col-md-8">
                <form @submit.prevent="handleSearch" class="d-flex shadow-sm rounded-pill overflow-hidden border">
                    <input type="text" class="form-control border-0 px-4 py-3 bg-white" v-model="searchQuery"
                        placeholder="Nhập tên sách hoặc tác giả bạn muốn tìm...">
                    <button class="btn btn-primary px-4 px-md-5 fw-bold" type="submit">
                        <i class="bi bi-search me-2"></i><span class="d-none d-md-inline">Tìm kiếm</span>
                    </button>
                </form>
            </div>
        </div>

        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <h4 class="fw-bold text-dark mb-0 border-start border-4 border-primary ps-2">Sách Mới Nổi Bật</h4>

            <div class="d-flex gap-2">
                <select class="form-select bg-white shadow-sm border-0" v-model="selectedPublisher"
                    @change="handleSearch" style="width: 200px;">
                    <option value="">Tất cả Nhà Xuất Bản</option>
                    <option v-for="nxb in publishers" :key="nxb._id" :value="nxb._id">{{ nxb.tenNXB }}</option>
                </select>
            </div>
        </div>

        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
            <p class="mt-3 text-muted fw-semibold">Đang tải danh sách sách...</p>
        </div>

        <div v-else-if="!books || books.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm border">
            <i class="bi bi-journal-x display-1 text-muted mb-3"></i>
            <h4 class="fw-bold text-dark">Chưa có cuốn sách nào</h4>
            <p class="text-muted">Vui lòng quay lại sau hoặc thử tìm kiếm với từ khóa khác.</p>
            <button v-if="searchQuery || selectedPublisher" class="btn btn-outline-primary mt-3" @click="clearFilters">
                Xóa bộ lọc và xem tất cả
            </button>
        </div>

        <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
            <div class="col" v-for="book in books" :key="book._id">
                <div class="card h-100 border-0 shadow-sm rounded-4 book-card overflow-hidden">
                    <div class="position-relative bg-light text-center p-3" style="height: 250px; cursor: pointer;"
                        @click="$router.push(`/books/${book._id}`)">
                        <img :src="getImageUrl(book.hinhAnh)"
                            class="img-fluid h-100 object-fit-contain shadow-sm rounded" :alt="book.tenSach"
                            @error="handleImageError">
                        <div v-if="book.soQuyenHienTai <= 0"
                            class="position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-75 text-white fw-bold px-3 py-2 rounded-pill shadow">
                            ĐÃ HẾT SÁCH
                        </div>
                    </div>

                    <div class="card-body d-flex flex-column p-3">
                        <div class="small text-muted mb-1 text-truncate" :title="book.maNXB?.tenNXB">
                            <i class="bi bi-building me-1"></i>{{ book.maNXB?.tenNXB || 'N/A' }}
                        </div>
                        <h6 class="card-title fw-bold text-dark mb-1 text-truncate-2" :title="book.tenSach">
                            {{ book.tenSach }}
                        </h6>
                        <div class="small text-secondary mb-2 text-truncate">
                            <i class="bi bi-pen me-1"></i>{{ book.tacGia }}
                        </div>

                        <div class="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                            <span class="fw-bold text-primary fs-5">{{ formatCurrency(book.donGia) }}</span>
                            <span class="badge bg-light text-dark border">
                                <i class="bi bi-stack me-1"></i>Kho: {{ book.soQuyenHienTai }}
                            </span>
                        </div>
                    </div>

                    <div class="card-footer bg-white border-0 p-3 pt-0">
                        <button v-if="!authStore.isAdmin" class="btn w-100 fw-bold rounded-3 shadow-sm btn-primary"
                            :disabled="book.soQuyenHienTai <= 0 || cartStore.totalItems >= maxBorrowBooks"
                            @click.stop="handleAddToCart(book)">
                            <span v-if="book.soQuyenHienTai <= 0"><i class="bi bi-x-circle me-1"></i> Hết sách</span>
                            <span v-else>
                                <i class="bi bi-cart-plus me-1"></i> Mượn sách
                                <span v-if="cartStore.getQuantityInCart && cartStore.getQuantityInCart(book._id) > 0"
                                    class="badge bg-white text-primary ms-1">{{ cartStore.getQuantityInCart(book._id)
                                    }}</span>
                            </span>
                        </button>
                        <button v-else class="btn w-100 fw-bold rounded-3 btn-secondary" disabled>
                            <i class="bi bi-shield-lock me-1"></i> Dành cho Độc giả
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <nav v-if="totalPages > 1 && !isLoading" class="mt-5 d-flex justify-content-center">
            <ul class="pagination pagination-lg shadow-sm rounded-4 overflow-hidden">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link border-0 fw-semibold px-4"
                        @click="changePage(currentPage - 1)">Trước</button>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
                    <button class="page-link border-0 fw-bold px-3" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link border-0 fw-semibold px-4"
                        @click="changePage(currentPage + 1)">Sau</button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';

const cartStore = useCartStore();
const authStore = useAuthStore();

const books = ref([]);
const publishers = ref([]);
const selectedPublisher = ref('');
const isLoading = ref(true);

const searchQuery = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const maxBorrowBooks = ref(5);

const fetchBooks = async () => {
    isLoading.value = true;
    try {
        const url = `/books?page=${currentPage.value}&limit=10&search=${encodeURIComponent(searchQuery.value)}&maNXB=${selectedPublisher.value}`;
        const res = await api.get(url);
        
        // Kiểm tra cấu trúc dữ liệu từ Backend v19
        if (res.data && res.data.success && res.data.data) {
            books.value = res.data.data.books || [];
            totalPages.value = res.data.data.totalPages || 1;
            currentPage.value = res.data.data.currentPage || 1;
        } else {
            // Fallback nếu Backend trả về mảng trực tiếp
            const rawData = res.data?.data || res.data;
            books.value = Array.isArray(rawData) ? rawData : [];
            totalPages.value = 1;
        }
    } catch (error) {
        console.error("Lỗi fetchBooks:", error);
        books.value = [];
    } finally {
        isLoading.value = false; // Nhờ bước 1, dòng này sẽ được chạy khi có lỗi
    }
};

const handleSearch = () => {
    currentPage.value = 1;
    fetchBooks();
};

const clearFilters = () => {
    searchQuery.value = '';
    selectedPublisher.value = '';
    handleSearch();
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchBooks();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const fetchPublishers = async () => {
    try {
        const res = await api.get('/publishers');
        publishers.value = res.data?.data || res.data || [];
    } catch (error) { console.error("Lỗi fetchPublishers:", error); }
};

const fetchSettings = async () => {
    try {
        const res = await api.get('/settings');
        const settingsData = res.data?.data || res.data;
        if (settingsData?.soSachMuonToiDa) {
            maxBorrowBooks.value = settingsData.soSachMuonToiDa;
        }
    } catch (error) { console.error("Lỗi fetchSettings:", error); }
};

const handleAddToCart = (book) => {
    cartStore.addToCart(book, maxBorrowBooks.value);
};

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const defaultImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2250%22%20height%3D%2270%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2050%2070%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%2250%22%20height%3D%2270%22%20fill%3D%22%23eeeeee%22%2F%3E%3Ctext%20text-anchor%3D%22middle%22%20x%3D%2225%22%20y%3D%2238%22%20style%3D%22fill%3A%23aaaaaa%3Bfont-weight%3Abold%3Bfont-size%3A10px%3Bfont-family%3AArial%2CHelvetica%2Csans-serif%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';

const getImageUrl = (path) => {
    if (!path) return defaultImage;
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path}`;
};

const handleImageError = (e) => {
    e.target.src = defaultImage;
    e.target.onerror = null;
};

onMounted(() => {
    fetchSettings();
    fetchPublishers();
    fetchBooks();
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

.book-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.book-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 2.4em;
}

.pagination .page-link {
    color: var(--accent);
}

.pagination .page-item.active .page-link {
    background-color: var(--accent);
    color: white;
    border-color: var(--accent);
}
</style>