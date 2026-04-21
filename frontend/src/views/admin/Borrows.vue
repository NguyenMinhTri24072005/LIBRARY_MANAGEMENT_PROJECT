<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold text-dark mb-0"><i class="bi bi-card-checklist text-primary me-2"></i>Quản Lý Mượn Trả</h4>
    </div>

    <ul class="nav nav-pills mb-4 gap-2">
      <li class="nav-item">
        <button class="nav-link fw-semibold rounded-pill px-4" :class="{ active: currentTab === '' }"
          @click="changeTab('')">
          Tất cả
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link fw-semibold rounded-pill px-4 position-relative"
          :class="{ active: currentTab === 'CHO_DUYET' }" @click="changeTab('CHO_DUYET')">
          Chờ duyệt
          <span v-if="countPending > 0"
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {{ countPending }}
          </span>
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link fw-semibold rounded-pill px-4" :class="{ active: currentTab === 'DANG_MUON' }"
          @click="changeTab('DANG_MUON')">
          Đang mượn
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link fw-semibold rounded-pill px-4" :class="{ active: currentTab === 'DA_TRA' }"
          @click="changeTab('DA_TRA')">
          Đã trả
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link fw-semibold rounded-pill px-4" :class="{ active: currentTab === 'DA_HUY' }"
          @click="changeTab('DA_HUY')">
          Đã hủy
        </button>
      </li>
    </ul>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col" class="ps-4">Mã Phiếu</th>
              <th scope="col">Độc giả</th>
              <th scope="col">Sách mượn</th>
              <th scope="col">Hạn trả</th>
              <th scope="col" class="text-center">Trạng thái / Phạt</th>
              <th scope="col" class="text-end pe-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="text-center py-5">
                <div class="spinner-border text-primary"></div>
              </td>
            </tr>
            <tr v-else-if="filteredBorrows.length === 0">
              <td colspan="6" class="text-center py-5 text-muted">Không có phiếu mượn nào trong mục này.</td>
            </tr>
            <tr v-else v-for="phieu in filteredBorrows" :key="phieu._id">
              <td class="ps-4 text-muted fw-semibold small">
                #{{ phieu._id ? phieu._id.slice(-6).toUpperCase() : 'N/A' }}
              </td>

              <td>
                <div class="fw-bold text-dark">{{ phieu.maDocGia?.hoLot }} {{ phieu.maDocGia?.ten }}</div>
                <div class="small text-muted"><i class="bi bi-telephone-fill me-1"></i>{{ phieu.maDocGia?.dienThoai }}
                </div>
              </td>

              <td>
                <div class="d-flex align-items-center gap-2">
                  <img :src="getImageUrl(phieu.maSach?.hinhAnh)" class="rounded border"
                    style="width: 30px; height: 45px; object-fit: cover;" @error="handleImageError">
                  <span class="fw-semibold text-dark text-truncate" style="max-width: 200px;">{{ phieu.maSach?.tenSach
                    || 'Sách đã bị xóa' }}</span>
                </div>
              </td>

              <td>
                <div v-if="phieu.trangThai === 'CHO_DUYET'" class="text-muted fst-italic small">Chưa duyệt</div>
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

                <div v-if="phieu.tienPhat > 0" class="mt-1">
                  <span class="badge"
                    :class="phieu.daThanhToanPhat ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">
                    Phạt: {{ formatCurrency(phieu.tienPhat) }}
                    <i v-if="phieu.daThanhToanPhat" class="bi bi-check-circle-fill ms-1"></i>
                  </span>

                  <div v-if="phieu.trangThaiGiaHan === 'CHO_DUYET_GIA_HAN'" class="mt-2">
                    <span class="badge bg-warning text-dark border border-warning shadow-sm animation-blink">
                      <i class="bi bi-bell-fill me-1"></i>Xin gia hạn!
                    </span>
                  </div>
                </div>
              </td>

              <td class="text-end pe-4">

                <template v-if="phieu.trangThai === 'CHO_DUYET'">
                  <button class="btn btn-sm btn-success me-2 fw-semibold shadow-sm"
                    @click="handleAction(phieu._id, 'approve', 'Duyệt mượn sách này?')">
                    <i class="bi bi-check2"></i> Duyệt
                  </button>
                  <button class="btn btn-sm btn-outline-danger fw-semibold"
                    @click="handleAction(phieu._id, 'reject', 'Từ chối yêu cầu này?')">
                    Từ chối
                  </button>
                </template>

                <template v-if="phieu.trangThai === 'DANG_MUON'">

                  <div v-if="phieu.trangThaiGiaHan === 'CHO_DUYET_GIA_HAN'" class="mb-2">
                    <button class="btn btn-sm btn-success me-1 fw-semibold"
                      @click="handleAction(phieu._id, 'extend-approve', 'Duyệt cho phép gia hạn sách này?')">
                      <i class="bi bi-check-lg"></i> Duyệt GH
                    </button>
                    <button class="btn btn-sm btn-danger fw-semibold"
                      @click="handleAction(phieu._id, 'extend-reject', 'Từ chối gia hạn sách này?')">
                      <i class="bi bi-x-lg"></i> Từ chối
                    </button>
                  </div>

                  <button class="btn btn-sm btn-primary fw-semibold shadow-sm w-100"
                    @click="handleAction(phieu._id, 'return', 'Xác nhận độc giả đã trả sách?')">
                    <i class="bi bi-box-arrow-in-down"></i> Nhận Trả Sách
                  </button>
                </template>

                <template v-if="phieu.trangThai === 'DA_TRA' && phieu.tienPhat > 0 && !phieu.daThanhToanPhat">
                  <button class="btn btn-sm btn-danger fw-semibold shadow-sm"
                    @click="handleAction(phieu._id, 'pay-fine', `Xác nhận thu ${formatCurrency(phieu.tienPhat)} tiền phạt?`)">
                    <i class="bi bi-cash-coin"></i> Thu Tiền Phạt
                  </button>
                </template>

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

const borrows = ref([]);
const isLoading = ref(true);
const currentTab = ref(''); // '' = Tất cả, 'CHO_DUYET', 'DANG_MUON', ...

// Lấy danh sách phiếu mượn
const fetchBorrows = async () => {
  isLoading.value = true;
  try {
    const res = await api.get('/borrows');
    // SỬA LỖI TẠI ĐÂY: Trích xuất đúng mảng dữ liệu
    if (res.data && res.data.success) {
      borrows.value = res.data.data || [];
    } else {
      borrows.value = Array.isArray(res.data) ? res.data : [];
    }
  } catch (error) {
    console.error(error);
    borrows.value = []; // Đảm bảo luôn là mảng khi có lỗi
  } finally {
    isLoading.value = false;
  }
};

// Đếm số lượng phiếu đang chờ duyệt để hiện badge đỏ
const countPending = computed(() => {
  if (!Array.isArray(borrows.value)) return 0; // SỬA LỖI TẠI ĐÂY: Lớp bảo vệ chống crash
  return borrows.value.filter(p => p.trangThai === 'CHO_DUYET').length;
});

// Lọc danh sách theo Tab
const filteredBorrows = computed(() => {
  if (!Array.isArray(borrows.value)) return []; // SỬA LỖI TẠI ĐÂY: Lớp bảo vệ chống crash
  if (currentTab.value === '') return borrows.value;
  return borrows.value.filter(p => p.trangThai === currentTab.value);
});

const changeTab = (tab) => {
  currentTab.value = tab;
};

// ---- CÁC HÀM TIỆN ÍCH HIỂN THỊ ----

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Kiểm tra xem đã quá hạn trả chưa (để tô màu đỏ)
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

// Xử lý ảnh lỗi
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

// ---- XỬ LÝ NGHIỆP VỤ GỌI API ----

const handleAction = (id, action, confirmMessage) => {
  Swal.fire({
    title: 'Xác nhận',
    text: confirmMessage,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#764ba2',
    cancelButtonText: 'Hủy',
    confirmButtonText: 'Đồng ý'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // action có thể là: 'approve', 'reject', 'return', 'pay-fine'
        const response = await api.put(`/borrows/${id}/${action}`);

        // SỬA LỖI TẠI ĐÂY: Trích xuất thông báo đúng cấu trúc mới của axios
        const successMessage = response.data?.message || 'Thao tác thành công';
        Swal.fire('Thành công!', successMessage, 'success');

        // Tải lại danh sách
        fetchBorrows();
      } catch (error) {
        // Lỗi (ví dụ: Hết sách trong kho) đã được Axios Interceptor bắt và hiển thị Swal
        console.error("Lỗi khi thao tác:", error);
      }
    }
  });
};

onMounted(() => {
  fetchBorrows();
});
</script>

<style scoped>
.nav-pills .nav-link {
  color: #6c757d;
  background-color: #f8f9fa;
  border: 1px solid transparent;
}

.nav-pills .nav-link:hover {
  background-color: #e9ecef;
}

.nav-pills .nav-link.active {
  background-color: var(--accent);
  color: white;
  box-shadow: 0 4px 6px rgba(170, 59, 255, 0.2);
}

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

.animation-blink {
  animation: blinker 1.5s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0.5;
  }
}
</style>