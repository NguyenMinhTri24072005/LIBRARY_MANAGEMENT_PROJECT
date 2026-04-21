<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold text-dark mb-0"><i class="bi bi-building text-primary me-2"></i>Nhà Xuất Bản</h4>
      <button class="btn btn-primary shadow-sm fw-semibold" @click="openModal()">
        <i class="bi bi-plus-lg me-1"></i> Thêm NXB
      </button>
    </div>

    <div class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-3">
        <div class="input-group">
          <span class="input-group-text bg-light border-0"><i class="bi bi-search text-muted"></i></span>
          <input type="text" class="form-control bg-light border-0" v-model="searchQuery" placeholder="Tìm kiếm nhà xuất bản theo tên...">
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col" class="ps-4" style="width: 50px;">#</th>
              <th scope="col">Tên Nhà Xuất Bản</th>
              <th scope="col">Địa Chỉ</th>
              <th scope="col" class="text-end pe-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="4" class="text-center py-5"><div class="spinner-border text-primary"></div></td>
            </tr>
            <tr v-else-if="filteredPublishers.length === 0">
              <td colspan="4" class="text-center py-5 text-muted">Không tìm thấy nhà xuất bản nào.</td>
            </tr>
            <tr v-else v-for="(nxb, index) in filteredPublishers" :key="nxb._id">
              <td class="ps-4 text-muted fw-semibold">{{ index + 1 }}</td>
              <td class="fw-bold text-dark">{{ nxb.tenNXB }}</td>
              <td>{{ nxb.diaChi || 'Chưa cập nhật' }}</td>
              <td class="text-end pe-4">
                <button class="btn btn-sm btn-light text-primary me-2" @click="openModal(nxb)"><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-sm btn-light text-danger" @click="deletePublisher(nxb._id)"><i class="bi bi-trash3"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="nxbModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold text-dark">{{ isEditing ? 'Chỉnh Sửa NXB' : 'Thêm NXB Mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePublisher">
              <div class="mb-3">
                <label class="form-label fw-semibold">Tên Nhà Xuất Bản <span class="text-danger">*</span></label>
                <input type="text" class="form-control bg-light" v-model="formData.tenNXB" required placeholder="Nhập tên NXB">
              </div>
              <div class="mb-4">
                <label class="form-label fw-semibold">Địa chỉ</label>
                <textarea class="form-control bg-light" v-model="formData.diaChi" rows="3" placeholder="Nhập địa chỉ (không bắt buộc)"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer border-top-0 pt-0">
            <button type="button" class="btn btn-light fw-semibold" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary fw-bold px-4" @click="savePublisher" :disabled="isSaving">
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
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

const publishers = ref([]);
const searchQuery = ref('');
const isLoading = ref(true);
const isSaving = ref(false);

let modalInstance = null;
const isEditing = ref(false);
const currentId = ref(null);
const formData = ref({ tenNXB: '', diaChi: '' });

// Lọc NXB theo ô tìm kiếm ở Client-side
const filteredPublishers = computed(() => {
    // Thêm lớp bảo vệ: nếu không phải mảng thì trả về mảng rỗng
    if (!Array.isArray(publishers.value)) return [];
    if (!searchQuery.value) return publishers.value;
    
    return publishers.value.filter(nxb => 
        nxb.tenNXB && nxb.tenNXB.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const fetchPublishers = async () => {
    isLoading.value = true;
    try {
        const res = await api.get('/publishers');
        // SỬA LỖI TẠI ĐÂY: Trích xuất đúng mảng từ cấu trúc mới
        if (res.data && res.data.success) {
            publishers.value = res.data.data || [];
        } else {
            // Fallback nếu API trả về mảng trực tiếp
            publishers.value = Array.isArray(res.data) ? res.data : [];
        }
    } catch (error) { 
        console.error("Lỗi fetchPublishers:", error);
        publishers.value = []; // Đảm bảo luôn là mảng khi có lỗi
    } finally { 
        isLoading.value = false; 
    }
};

const openModal = (nxb = null) => {
    if (nxb) {
        isEditing.value = true;
        currentId.value = nxb._id;
        formData.value = { tenNXB: nxb.tenNXB, diaChi: nxb.diaChi };
    } else {
        isEditing.value = false;
        currentId.value = null;
        formData.value = { tenNXB: '', diaChi: '' };
    }
    
    const modalElement = document.getElementById('nxbModal');
    if (!modalInstance && modalElement) modalInstance = new Modal(modalElement);
    if (modalInstance) modalInstance.show();
};

const savePublisher = async () => {
    isSaving.value = true;
    try {
        if (isEditing.value) {
            await api.put(`/publishers/${currentId.value}`, formData.value);
            Swal.fire('Thành công', 'Đã cập nhật Nhà xuất bản!', 'success');
        } else {
            await api.post('/publishers', formData.value);
            Swal.fire('Thành công', 'Đã thêm Nhà xuất bản mới!', 'success');
        }
        if (modalInstance) modalInstance.hide();
        fetchPublishers();
    } catch (error) {
        // Lỗi trùng tên đã được Axios Interceptor bắt và hiển thị Swal
    } finally {
        isSaving.value = false;
    }
};

const deletePublisher = (id) => {
    Swal.fire({
        title: 'Xóa Nhà xuất bản?',
        text: "Hành động này không thể hoàn tác!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Xóa'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await api.delete(`/publishers/${id}`);
                Swal.fire('Đã xóa!', 'Nhà xuất bản đã bị xóa.', 'success');
                fetchPublishers();
            } catch (error) { 
                // Lỗi ràng buộc sách đã được Axios Interceptor bắt
            }
        }
    });
};

onMounted(() => {
    fetchPublishers();
});
</script>

<style scoped>
.text-primary { color: var(--accent) !important; }
.bg-primary { background-color: var(--accent) !important; }
.btn-primary { background-color: var(--accent); border-color: var(--accent); }
.btn-primary:hover { background-color: #902be6; border-color: #902be6; }
</style>