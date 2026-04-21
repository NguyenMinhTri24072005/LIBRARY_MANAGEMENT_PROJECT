<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold text-dark mb-0"><i class="bi bi-people-fill text-primary me-2"></i>Quản Lý Độc Giả</h4>
    </div>

    <!-- Thanh tìm kiếm -->
    <div class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-3">
        <div class="input-group">
          <span class="input-group-text bg-light border-0"><i class="bi bi-search text-muted"></i></span>
          <input type="text" class="form-control bg-light border-0" v-model="searchQuery" placeholder="Tìm kiếm theo tên hoặc số điện thoại...">
        </div>
      </div>
    </div>

    <!-- Bảng danh sách Độc giả -->
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
              <td>{{ reader.dienThoai }}</td>
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
                <!-- Nút Khóa / Mở Khóa -->
                <button class="btn btn-sm me-2" 
                        :class="reader.trangThai ? 'btn-outline-warning' : 'btn-outline-success'"
                        @click="toggleStatus(reader)"
                        :title="reader.trangThai ? 'Khóa tài khoản' : 'Mở khóa tài khoản'">
                  <i class="bi" :class="reader.trangThai ? 'bi-lock-fill' : 'bi-unlock-fill'"></i>
                </button>
                <!-- Nút Xóa -->
                <button class="btn btn-sm btn-outline-danger" @click="deleteReader(reader._id)" title="Xóa độc giả">
                  <i class="bi bi-trash3"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';
import Swal from 'sweetalert2';

const readers = ref([]);
const searchQuery = ref('');
const isLoading = ref(true);

// Lọc Client-side theo Tên hoặc SĐT
const filteredReaders = computed(() => {
    if (!searchQuery.value) return readers.value;
    const q = searchQuery.value.toLowerCase();
    return readers.value.filter(r => 
        r.dienThoai.includes(q) || 
        (r.hoLot + ' ' + r.ten).toLowerCase().includes(q)
    );
});

const fetchReaders = async () => {
    try {
        const res = await api.get('/readers');
        readers.value = res.data;
    } catch (error) { console.error(error); }
    finally { isLoading.value = false; }
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
.text-primary { color: var(--accent) !important; }
.bg-primary { background-color: var(--accent) !important; }
.btn-primary { background-color: var(--accent); border-color: var(--accent); }
.btn-primary:hover { background-color: #902be6; border-color: #902be6; }
</style>