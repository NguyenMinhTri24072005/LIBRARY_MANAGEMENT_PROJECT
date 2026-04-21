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
              <th scope="col" class="text-end pe-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="7" class="text-center py-5">
                <div class="spinner-border text-primary"></div>
                <p class="mt-2 text-muted small">Đang tải lịch sử...</p>
              </td>
            </tr>

            <tr v-else-if="!history || history.length === 0">
              <td colspan="7" class="text-center py-5 text-muted">
                <i class="bi bi-journal-x display-4 d-block mb-3"></i>
                Bạn chưa có lịch sử mượn sách nào.
              </td>
            </tr>

            <tr v-else v-for="phieu in history" :key="phieu._id">
              <td class="ps-4 text-muted fw-semibold small">
                #{{ phieu._id ? phieu._id.slice(-6).toUpperCase() : 'N/A' }}
              </td>

              <td>
                <div class="d-flex align-items-center gap-3">
                  <img :src="getImageUrl(phieu.maSach?.hinhAnh)" class="rounded border shadow-sm"
                    style="width: 40px; height: 60px; object-fit: cover;" @error="handleImageError">
                  <div>
                    <div class="fw-bold text-dark text-truncate" style="max-width: 250px;"
                      :title="phieu.maSach?.tenSach">{{ phieu.maSach?.tenSach || 'Sách đã bị xóa' }}</div>
                    <div class="small text-muted"><i class="bi bi-pen me-1"></i>{{ phieu.maSach?.tacGia || 'N/A' }}</div>
                  </div>
                </div>
              </td>

              <td class="text-muted">{{ formatDate(phieu.createdAt) }}</td>

              <td>
                <div v-if="phieu.trangThai === 'CHO_DUYET'" class="text-muted fst-italic small">Chờ thủ thư duyệt</div>
                <div v-else-if="phieu.trangThai === 'DA_HUY'" class="text-muted fst-italic small">-</div>
                <div v-else>
                  <div class="fw-semibold"
                    :class="isOverdue(phieu.hanTra) && phieu.trangThai === 'DANG_MUON' ? 'text-danger' : 'text-dark'">
                    {{ formatDate(phieu.hanTra) }}
                  </div>
                  <div v-if="phieu.trangThai === 'DA_TRA'" class="small text-success">
                    Đã trả: {{ formatDate(phieu.ngayTraThucTe) }}
                  </div>
                </div>
              </td>

              <td class="text-center">
                <span class="badge" :class="getStatusBadge(phieu)">
                  {{ getStatusText(phieu) }}
                </span>
              </td>

              <td class="text-end pe-4">
                <div v-if="phieu.tienPhat > 0">
                  <span class="fw-bold text-danger">{{ formatCurrency(phieu.tienPhat) }}</span>
                  <div class="small mt-1">
                    <span v-if="phieu.daThanhToanPhat" class="badge bg-success bg-opacity-10 text-success">
                      <i class="bi bi-check-circle-fill me-1"></i>Đã đóng
                    </span>
                    <span v-else class="badge bg-danger bg-opacity-10 text-danger">
                      <i class="bi bi-exclamation-circle-fill me-1"></i>Chưa đóng
                    </span>
                  </div>
                </div>
                <span v-else class="text-muted fst-italic small">-</span>
              </td>

              <td class="text-end pe-4">
                <template v-if="phieu.trangThai === 'DANG_MUON' && !isOverdue(phieu.hanTra)">
                  <button v-if="phieu.trangThaiGiaHan === 'KHONG'"
                    class="btn btn-sm btn-outline-primary fw-semibold rounded-pill"
                    @click="requestExtension(phieu._id)">
                    <i class="bi bi-calendar-plus me-1"></i> Xin gia hạn
                  </button>
                  <span v-else-if="phieu.trangThaiGiaHan === 'CHO_DUYET_GIA_HAN'" class="text-warning small fw-bold">
                    <i class="bi bi-hourglass-split me-1"></i>Đang chờ duyệt...
                  </span>
                  <span v-else-if="phieu.trangThaiGiaHan === 'DA_GIA_HAN'" class="text-success small fw-bold">
                    <i class="bi bi-check2-circle me-1"></i>Đã gia hạn
                  </span>
                  <span v-else-if="phieu.trangThaiGiaHan === 'TU_CHOI_GIA_HAN'" class="text-danger small fw-bold">
                    <i class="bi bi-x-circle me-1"></i>Bị từ chối
                  </span>
                </template>
                <span v-else class="text-muted small fst-italic">-</span>
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
import Swal from 'sweetalert2';
import { useAuthStore } from '../../store/auth.store';

const history = ref([]);
const isLoading = ref(true);
const authStore = useAuthStore();

const fetchHistory = async () => {
  isLoading.value = true;
  try {
    const res = await api.get('/borrows');
    // SỬA LỖI TẠI ĐÂY: Trích xuất mảng từ res.data.data
    if (res.data && res.data.success) {
      history.value = res.data.data || [];
    } else {
      history.value = Array.isArray(res.data) ? res.data : [];
    }
  } catch (error) {
    console.error("Lỗi fetchHistory:", error);
    history.value = [];
  } finally {
    isLoading.value = false;
  }
};

// ---- TIỆN ÍCH HIỂN THỊ ----
const formatCurrency = (val) => {
    if(!val) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const isOverdue = (hanTraString) => {
  if (!hanTraString) return false;
  const hanTra = new Date(hanTraString);
  const today = new Date();
  hanTra.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return hanTra < today;
};

const getStatusText = (phieu) => {
  if (phieu.trangThai === 'DANG_MUON' && isOverdue(phieu.hanTra)) return 'Quá hạn';
  switch (phieu.trangThai) {
    case 'CHO_DUYET': return 'Chờ duyệt';
    case 'DANG_MUON': return 'Đang mượn';
    case 'DA_TRA': return 'Đã trả';
    case 'DA_HUY': return 'Đã hủy';
    default: return phieu.trangThai;
  }
};

const getStatusBadge = (phieu) => {
  if (phieu.trangThai === 'DANG_MUON' && isOverdue(phieu.hanTra)) return 'bg-danger animation-blink';
  switch (phieu.trangThai) {
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

const requestExtension = (id) => {
  Swal.fire({
    title: 'Xin gia hạn sách?',
    text: "Yêu cầu của bạn sẽ được gửi đến Thủ thư để chờ duyệt.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#764ba2',
    cancelButtonText: 'Hủy',
    confirmButtonText: 'Gửi yêu cầu'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api.put(`/borrows/${id}/extend-request`);
        Swal.fire('Thành công', 'Đã gửi yêu cầu gia hạn!', 'success');
        fetchHistory(); // Load lại lịch sử
      } catch (error) { }
    }
  });
};

onMounted(() => {
  fetchHistory();
});
</script>

<style scoped>
.text-primary { color: var(--accent) !important; }
.bg-primary { background-color: var(--accent) !important; }
.animation-blink { animation: blinker 1s linear infinite; }
@keyframes blinker { 50% { opacity: 0.5; } }
</style>