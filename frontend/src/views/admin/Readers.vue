<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold text-dark mb-0"><i class="bi bi-people-fill text-primary me-2"></i>Quản Lý Độc Giả</h4>
    </div>

    <div class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-3">
        <div class="input-group">
          <span class="input-group-text bg-light border-0"><i class="bi bi-search text-muted"></i></span>
          <input type="text" class="form-control bg-light border-0" v-model="searchQuery" placeholder="Tìm kiếm theo tên hoặc số điện thoại...">
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col" class="ps-4">Họ & Tên</th>
              <th scope="col">Số điện thoại</th>
              <th scope="col">Giới tính</th>
              <th scope="col" class="text-center">Điểm uy tín</th>
              <th scope="col" class="text-center">Trạng thái</th>
              <th scope="col" class="text-end pe-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="text-center py-5"><div class="spinner-border text-primary"></div></td>
            </tr>
            <tr v-else-if="filteredReaders.length === 0">
              <td colspan="6" class="text-center py-5 text-muted">Không tìm thấy độc giả nào.</td>
            </tr>
            <tr v-else v-for="reader in filteredReaders" :key="reader._id">
              <td class="ps-4 fw-bold text-dark">{{ reader.hoLot }} {{ reader.ten }}</td>
              <td>{{ reader.dienThoai || 'N/A' }}</td>
              <td>{{ reader.phai || 'N/A' }}</td>
              <td class="text-center">
                <span class="badge rounded-pill" :class="reader.diemUyTin >= 50 ? 'bg-success' : 'bg-danger'">
                  <i class="bi bi-star-fill me-1"></i>{{ reader.diemUyTin }}
                </span>
              </td>
              <td class="text-center">
                <span class="badge" :class="reader.trangThai ? 'bg-primary bg-opacity-10 text-primary' : 'bg-danger bg-opacity-10 text-danger'">
                  {{ reader.trangThai ? 'Hoạt động' : 'Bị khóa' }}
                </span>
              </td>
              <td class="text-end pe-4">
                <button class="btn btn-sm btn-outline-info me-2" @click="openEditModal(reader)" title="Sửa thông tin">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm me-2" 
                        :class="reader.trangThai ? 'btn-outline-warning' : 'btn-outline-success'"
                        @click="toggleStatus(reader)"
                        :title="reader.trangThai ? 'Khóa tài khoản' : 'Mở khóa tài khoản'">
                  <i class="bi" :class="reader.trangThai ? 'bi-lock-fill' : 'bi-unlock-fill'"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteReader(reader._id)" title="Xóa độc giả">
                  <i class="bi bi-trash3"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="editReaderModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 rounded-4 shadow">
                <div class="modal-header border-bottom-0 pb-0">
                    <h5 class="modal-title fw-bold text-dark">Sửa Thông Tin Độc Giả</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="updateReader" class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Họ lót</label>
                            <input type="text" class="form-control bg-light" v-model="editForm.hoLot" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Tên</label>
                            <input type="text" class="form-control bg-light" v-model="editForm.ten" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Số điện thoại</label>
                            <input type="text" class="form-control bg-light" v-model="editForm.dienThoai">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Giới tính</label>
                            <select class="form-select bg-light" v-model="editForm.phai">
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-semibold">Địa chỉ</label>
                            <input type="text" class="form-control bg-light" v-model="editForm.diaChi">
                        </div>
                    </form>
                </div>
                <div class="modal-footer border-top-0 pt-0">
                    <button type="button" class="btn btn-light fw-semibold" data-bs-dismiss="modal">Hủy</button>
                    <button type="button" class="btn btn-primary fw-bold px-4" @click="updateReader" :disabled="isSaving">
                        <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span> Lưu Thay Đổi
                    </button>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

const readers = ref([]);
const searchQuery = ref('');
const isLoading = ref(true);

// State cho Modal Sửa
const editForm = ref({});
const isSaving = ref(false);
let editModalInstance = null;

// Lọc Client-side theo Tên hoặc SĐT
const filteredReaders = computed(() => {
    if (!Array.isArray(readers.value)) return [];
    if (!searchQuery.value) return readers.value;

    const q = searchQuery.value.toLowerCase();
    return readers.value.filter(r => {
        const phone = r.dienThoai || '';
        const fullName = (r.hoLot || '') + ' ' + (r.ten || '');
        return phone.toLowerCase().includes(q) || fullName.toLowerCase().includes(q);
    });
});

const fetchReaders = async () => {
    isLoading.value = true;
    try {
        const res = await api.get('/readers');
        if (res.data && res.data.success) {
            readers.value = res.data.data || [];
        } else {
            readers.value = Array.isArray(res.data) ? res.data : [];
        }
    } catch (error) {
        console.error("Lỗi fetchReaders:", error);
        readers.value = [];
    } finally {
        isLoading.value = false;
    }
};

// Mở Modal Sửa
const openEditModal = (reader) => {
    editForm.value = { ...reader };

    const modalElement = document.getElementById('editReaderModal');
    if (modalElement) {
        // SỬA LỖI MODAL: Luôn lấy instance mới nhất từ DOM để tránh bị kẹt
        editModalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
        editModalInstance.show();
    }
};

// Cập nhật thông tin
const updateReader = async () => {
    isSaving.value = true;
    try {
        // SỬA LỖI MONGODB: Loại bỏ _id và các trường hệ thống ra khỏi payload gửi đi
        const { _id, diemUyTin, trangThai, createdAt, updatedAt, __v, ...updatePayload } = editForm.value;

        await api.put(`/readers/${_id}`, updatePayload);
        Swal.fire('Thành công', 'Đã cập nhật thông tin độc giả!', 'success');
        
        if (editModalInstance) editModalInstance.hide();
        fetchReaders(); // Tải lại bảng
    } catch (error) {
        console.error("Lỗi cập nhật độc giả:", error);
        // Hiển thị lỗi chi tiết từ server nếu có
        const errorMsg = error.response?.data?.message || 'Không thể cập nhật thông tin';
        Swal.fire('Lỗi', errorMsg, 'error');
    } finally {
        isSaving.value = false;
    }
};

// Đảo trạng thái Khóa / Mở
const toggleStatus = async (reader) => {
    const actionText = reader.trangThai ? 'khóa' : 'mở khóa';
    Swal.fire({
        title: `Xác nhận ${actionText}?`,
        text: `Bạn sắp ${actionText} tài khoản của ${reader.hoLot} ${reader.ten}.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#764ba2',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Đồng ý'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await api.patch(`/readers/${reader._id}/status`, { trangThai: !reader.trangThai });
                Swal.fire('Thành công!', `Tài khoản đã được ${actionText}.`, 'success');
                fetchReaders();
            } catch (error) { console.error(error); }
        }
    });
};

// Xóa Độc giả
const deleteReader = (id) => {
    Swal.fire({
        title: 'Xóa độc giả này?',
        text: "Hành động này sẽ xóa vĩnh viễn dữ liệu nếu họ không nợ sách/phạt.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Xóa'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await api.delete(`/readers/${id}`);
                Swal.fire('Đã xóa!', 'Độc giả đã bị xóa khỏi hệ thống.', 'success');
                fetchReaders();
            } catch (error) {
                // Lỗi ràng buộc (đang nợ sách/phạt) sẽ do Axios Interceptor hiển thị
            }
        }
    });
};

onMounted(() => {
    fetchReaders();
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