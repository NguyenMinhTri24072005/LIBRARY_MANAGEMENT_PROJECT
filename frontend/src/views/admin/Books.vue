<template>
    <div>
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <h4 class="fw-bold text-dark mb-0">
                <i class="bi bi-journal-bookmark-fill text-primary me-2"></i>Quản Lý Kho Sách
            </h4>
            <div class="d-flex gap-2">
                <button type="button" class="btn btn-success shadow-sm fw-semibold d-flex align-items-center"
                    @click="exportExcel" :disabled="isExporting">
                    <span v-if="isExporting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-file-earmark-excel-fill me-2"></i> Xuất Excel
                </button>
                <button type="button" class="btn btn-primary shadow-sm fw-semibold d-flex align-items-center"
                    @click="openModal()">
                    <i class="bi bi-plus-lg me-2"></i> Thêm Sách Mới
                </button>
            </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4 mb-4">
            <div class="card-body p-3">
                <form @submit.prevent="handleSearch" class="input-group">
                    <span class="input-group-text bg-light border-0"><i class="bi bi-search text-muted"></i></span>
                    <input type="text" class="form-control bg-light border-0" v-model="searchQuery"
                        placeholder="Nhập tên sách hoặc tác giả để tìm kiếm...">
                    <button type="submit" class="btn btn-primary px-4">Tìm kiếm</button>
                </form>
            </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th scope="col" class="ps-4">Sách</th>
                            <th scope="col">Tác giả</th>
                            <th scope="col">Nhà XB</th>
                            <th scope="col">Đơn giá</th>
                            <th scope="col" class="text-center">Kho / Sẵn có</th>
                            <th scope="col" class="text-end pe-4">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="isLoading">
                            <td colspan="6" class="text-center py-5">
                                <div class="spinner-border text-primary"></div>
                                <p class="mt-2 text-muted small">Đang nạp dữ liệu...</p>
                            </td>
                        </tr>
                        <tr v-else-if="books.length === 0">
                            <td colspan="6" class="text-center py-5 text-muted">
                                <i class="bi bi-inbox display-4 d-block mb-2"></i>
                                Không tìm thấy cuốn sách nào khớp với tìm kiếm.
                            </td>
                        </tr>
                        <tr v-else v-for="book in books" :key="book._id">
                            <td class="ps-4">
                                <div class="d-flex align-items-center gap-3">
                                    <img :src="getImageUrl(book.hinhAnh)" class="rounded shadow-sm bg-white border"
                                        style="width: 45px; height: 65px; object-fit: cover;" @error="handleImageError">
                                    <div>
                                        <h6 class="mb-0 fw-bold text-dark text-truncate" style="max-width: 200px;">{{
                                            book.tenSach }}</h6>
                                        <small class="text-muted">Năm: {{ book.namXuatBan || 'N/A' }}</small>
                                    </div>
                                </div>
                            </td>
                            <td>{{ book.tacGia }}</td>
                            <td>
                                <span class="badge bg-secondary bg-opacity-10 text-secondary">
                                    {{ book.maNXB?.tenNXB || 'N/A' }}
                                </span>
                            </td>
                            <td class="fw-semibold text-success">{{ formatCurrency(book.donGia) }}</td>
                            <td class="text-center">
                                <span class="fw-bold">{{ book.soQuyen }}</span> /
                                <span :class="book.soQuyenHienTai > 0 ? 'text-primary fw-bold' : 'text-danger fw-bold'">
                                    {{ book.soQuyenHienTai }}
                                </span>
                            </td>
                            <td class="text-end pe-4">
                                <button type="button" class="btn btn-sm btn-light text-primary me-2"
                                    @click="openModal(book)">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button type="button" class="btn btn-sm btn-light text-danger"
                                    @click="deleteBook(book._id)">
                                    <i class="bi bi-trash3"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <nav v-if="totalPages > 1 && !isLoading" class="mt-4 d-flex justify-content-center">
            <ul class="pagination shadow-sm">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button type="button" class="page-link" @click="changePage(currentPage - 1)">Trước</button>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
                    <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button type="button" class="page-link" @click="changePage(currentPage + 1)">Sau</button>
                </li>
            </ul>
        </nav>

        <div class="modal fade" id="bookModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 rounded-4 shadow">
                    <div class="modal-header border-bottom-0 pb-0">
                        <h5 class="modal-title fw-bold text-dark">{{ isEditing ? 'Chỉnh Sửa Sách' : 'Thêm Sách Mới' }}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveBook" id="bookForm" class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Tên sách <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control bg-light" v-model="formData.tenSach" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Tác giả <span class="text-danger">*</span></label>
                                <input type="text" class="form-control bg-light" v-model="formData.tacGia" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Nhà Xuất Bản <span
                                        class="text-danger">*</span></label>
                                <select class="form-select bg-light" v-model="formData.maNXB" required>
                                    <option value="" disabled>-- Chọn nhà xuất bản --</option>
                                    <option v-for="nxb in publishers" :key="nxb._id" :value="nxb._id">{{ nxb.tenNXB }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Năm xuất bản</label>
                                <input type="number" class="form-control bg-light" v-model="formData.namXuatBan"
                                    min="1000">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Đơn giá (VNĐ) <span
                                        class="text-danger">*</span></label>
                                <input type="number" class="form-control bg-light" v-model="formData.donGia" min="0"
                                    required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Tổng số quyển (Nhập kho) <span
                                        class="text-danger">*</span></label>
                                <input type="number" class="form-control bg-light" v-model="formData.soQuyen" min="1"
                                    required>
                                <small v-if="isEditing" class="text-muted">Hệ thống sẽ tự tính lại số sách sẵn
                                    có.</small>
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-semibold">Ảnh bìa sách</label>
                                <input type="file" class="form-control bg-light" accept="image/*"
                                    @change="handleFileUpload">
                                <div class="mt-2 d-flex align-items-center gap-3"
                                    v-if="imagePreview || formData.hinhAnh">
                                    <img :src="imagePreview || getImageUrl(formData.hinhAnh)"
                                        class="rounded border shadow-sm"
                                        style="height: 80px; width: 60px; object-fit: cover;" @error="handleImageError">
                                    <span class="text-success small"><i class="bi bi-check-circle-fill me-1"></i>Ảnh
                                        hiện tại</span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pt-0">
                        <button type="button" class="btn btn-light fw-semibold" data-bs-dismiss="modal">Hủy</button>
                        <button type="submit" form="bookForm" class="btn btn-primary fw-bold px-4" :disabled="isSaving">
                            <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                            {{ isEditing ? 'Cập Nhật' : 'Thêm Mới' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

const books = ref([]);
const publishers = ref([]);
const searchQuery = ref('');
const isLoading = ref(true);
const isSaving = ref(false);
const isExporting = ref(false);

// State Phân trang
const currentPage = ref(1);
const totalPages = ref(1);

// Modal state
let modalInstance = null;
const isEditing = ref(false);
const currentId = ref(null);
const imageFile = ref(null);
const imagePreview = ref(null);

const formData = ref({
    tenSach: '', tacGia: '', maNXB: '', donGia: 0, soQuyen: 1, namXuatBan: new Date().getFullYear(), hinhAnh: ''
});

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
const defaultImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2250%22%20height%3D%2270%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2210%22%20fill%3D%22%2364748b%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';

const getImageUrl = (path) => {
    if (!path) return defaultImage;
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path}`;
};

const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = defaultImage;
};

// Lấy dữ liệu sách (Hỗ trợ phân trang và tìm kiếm)
const fetchBooks = async () => {
    isLoading.value = true;
    try {
        const res = await api.get(`/books`, {
            params: {
                page: currentPage.value,
                limit: 10,
                search: searchQuery.value
            }
        });

        // Xử lý dữ liệu từ cấu hình Backend mới (Phân trang)
        if (res.data?.data?.books) {
            books.value = res.data.data.books;
            totalPages.value = res.data.data.totalPages;
            currentPage.value = res.data.data.currentPage;
        } else {
            // Fallback cho API cũ không phân trang
            books.value = res.data?.data || res.data;
            totalPages.value = 1;
        }
    } catch (error) {
        console.error("Lỗi lấy danh sách sách:", error);
    } finally {
        isLoading.value = false;
    }
};

const fetchPublishers = async () => {
    try {
        const res = await api.get('/publishers');
        publishers.value = res.data?.data || res.data;
    } catch (error) { console.error(error); }
};

const handleSearch = () => {
    currentPage.value = 1;
    fetchBooks();
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchBooks();
    }
};

const openModal = (book = null) => {
    imageFile.value = null;
    imagePreview.value = null;

    if (book) {
        isEditing.value = true;
        currentId.value = book._id;
        formData.value = { ...book, maNXB: book.maNXB?._id || '' };
    } else {
        isEditing.value = false;
        currentId.value = null;
        formData.value = { tenSach: '', tacGia: '', maNXB: '', donGia: 0, soQuyen: 1, namXuatBan: new Date().getFullYear(), hinhAnh: '' };
    }

    const modalElement = document.getElementById('bookModal');
    if (!modalInstance && modalElement) {
        modalInstance = new Modal(modalElement);
    }
    if (modalInstance) {
        modalInstance.show();
    }
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        imageFile.value = file;
        imagePreview.value = URL.createObjectURL(file);
    }
};

const saveBook = async () => {
    isSaving.value = true;
    try {
        if (imageFile.value) {
            const formDataUpload = new FormData();
            formDataUpload.append('image', imageFile.value);
            const uploadRes = await api.post('/upload', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            formData.value.hinhAnh = uploadRes.data.data.imageUrl; // Sửa trích xuất đúng URL ảnh
        }

        if (isEditing.value) {
            await api.put(`/books/${currentId.value}`, formData.value);
            Swal.fire('Thành công', 'Đã cập nhật sách!', 'success');
        } else {
            await api.post('/books', formData.value);
            Swal.fire('Thành công', 'Đã thêm sách mới!', 'success');
        }

        if (modalInstance) modalInstance.hide();
        fetchBooks();
    } catch (error) {
        console.error("Lỗi lưu sách:", error);
    } finally {
        isSaving.value = false;
    }
};

const deleteBook = (id) => {
    Swal.fire({
        title: 'Xóa sách này?',
        text: "Sách sẽ bị ẩn khỏi hệ thống nhưng không ảnh hưởng đến lịch sử mượn.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Xóa'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await api.delete(`/books/${id}`);
                Swal.fire('Đã xóa!', 'Sách đã được ẩn.', 'success');
                fetchBooks();
            } catch (error) { console.error(error); }
        }
    });
};

const exportExcel = async () => {
    // SỬA TẠI ĐÂY: Thêm khối bật/tắt loading
    isExporting.value = true;
    try {
        const response = await api.get('/stats/export/books', {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'BaoCao_Sach.xlsx');
        document.body.appendChild(link);
        link.click();

        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Lỗi xuất Excel:", error);
        Swal.fire('Lỗi', 'Không thể xuất file Excel', 'error');
    } finally {
        isExporting.value = false;
    }
};

onMounted(() => {
    fetchBooks();
    fetchPublishers();
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

.card {
    border: none;
}

.table-hover tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.02);
}

.pagination .page-link {
    color: var(--accent);
    border: none;
    margin: 0 2px;
    border-radius: 8px;
}

.pagination .page-item.active .page-link {
    background-color: var(--accent);
    color: white;
}
</style>