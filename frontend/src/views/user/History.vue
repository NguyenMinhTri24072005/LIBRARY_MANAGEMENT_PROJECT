<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-dark mb-0"><i class="bi bi-clock-history text-primary me-2"></i>Lịch Sử Mượn Trả</h3>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col" class="ps-4">Mã Phiếu</th>
              <th scope="col">Sách mượn</th>
              <th scope="col">Ngày tạo đơn</th>
              <th scope="col">Hạn trả</th>
              <th scope="col" class="text-center">Trạng thái</th>
              <th scope="col" class="text-end pe-4">Tiền phạt</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="text-center py-5"><div class="spinner-border text-primary"></div></td>
            </tr>
            <tr v-else-if="history.length === 0">
              <td colspan="6" class="text-center py-5 text-muted">
                <i class="bi bi-journal-x display-4 d-block mb-3"></i>
                Bạn chưa có lịch sử mượn sách nào.
              </td>
            </tr>
            <tr v-else v-for="phieu in history" :key="phieu._id">
              <!-- Mã phiếu -->
              <td class="ps-4 text-muted fw-semibold small">#{{ phieu._id.slice(-6).toUpperCase() }}</td>

              <!-- Sách -->
              <td>
                <div class="d-flex align-items-center gap-3">
                  <img :src="getImageUrl(phieu.maSach?.hinhAnh)" class="rounded border shadow-sm" style="width: 40px; height: 60px; object-fit: cover;" @error="handleImageError">
                  <div>
                    <div class="fw-bold text-dark text-truncate" style="max-width: 250px;" :title="phieu.maSach?.tenSach">{{ phieu.maSach?.tenSach || 'Sách đã bị xóa' }}</div>
                    <div class="small text-muted"><i class="bi bi-pen me-1"></i>{{ phieu.maSach?.tacGia }}</div>
                  </div>
                </div>
              </td>

              <!-- Ngày tạo (Ngày gửi yêu cầu) -->
              <td class="text-muted">{{ formatDate(phieu.createdAt) }}</td>

              <!-- Hạn trả -->
              <td>
                <div v-if="phieu.trangThai === 'CHO_DUYET'" class="text-muted fst-italic small">Chưa duyệt</div>
                <div v-else-if="phieu.trangThai === 'DA_HUY'" class="text-muted fst-italic small">-</div>
                <div v-else>
                  <div class="fw-semibold" :class="isOverdue(phieu.hanTra) && phieu.trangThai === 'DANG_MUON' ? 'text-danger' : 'text-dark'">
                    {{ formatDate(phieu.hanTra) }}
                  </div>
                  <div v-if="phieu.trangThai === 'DA_TRA'" class="small text-success">
                    Đã trả: {{ formatDate(phieu.ngayTraThucTe) }}
                  </div>
                </div>
              </td>

              <!-- Trạng thái -->
              <td class="text-center">
                <span class="badge" :class="getStatusBadge(phieu.trangThai)">
                  {{ getStatusText(phieu.trangThai) }}
                </span>
              </td>

              <!-- Tiền phạt -->
              <td class="text-end pe-4">
                <div v-if="phieu.tienPhat > 0">
                  <span class="fw-bold text-danger">{{ formatCurrency(phieu.tienPhat) }}</span>
                  <div class="small mt-1">
                    <span v-if="phieu.daThanhToanPhat" class="badge bg-success bg-opacity-10 text-success"><i class="bi bi-check-circle-fill me-1"></i>Đã đóng</span>
                    <span v-else class="badge bg-danger bg-opacity-10 text-danger"><i class="bi bi-exclamation-circle-fill me-1"></i>Chưa đóng</span>
                  </div>
                </div>
                <span v-else class="text-muted fst-italic small">-</span>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const history = ref([]);
const isLoading = ref(true);

const fetchHistory = async () => {
    try {
        const res = await api.get('/borrows');
        history.value = res.data;
    } catch (error) { 
        console.error(error); 
    } finally { 
        isLoading.value = false; 
    }
};

// ---- TIỆN ÍCH HIỂN THỊ ----
const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const isOverdue = (hanTraString) => {
    if (!hanTraString) return false;
    const hanTra = new Date(hanTraString);
    const today = new Date();
    hanTra.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    return hanTra < today;
};

const getStatusText = (status) => {
    switch(status) {
        case 'CHO_DUYET': return 'Chờ duyệt';
        case 'DANG_MUON': return 'Đang mượn';
        case 'DA_TRA': return 'Đã trả';
        case 'DA_HUY': return 'Đã hủy';
        default: return status;
    }
};

const getStatusBadge = (status) => {
    switch(status) {
        case 'CHO_DUYET': return 'bg-warning text-dark';
        case 'DANG_MUON': return 'bg-primary';
        case 'DA_TRA': return 'bg-success';
        case 'DA_HUY': return 'bg-secondary';
        default: return 'bg-light text-dark';
    }
};

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
    fetchHistory();
});
</script>

<style scoped>
.text-primary { color: var(--accent) !important; }
.bg-primary { background-color: var(--accent) !important; }
</style>