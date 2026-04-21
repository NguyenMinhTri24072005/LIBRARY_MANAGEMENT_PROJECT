<template>
  <div>
    <!-- HÀNG 1: THẺ THỐNG KÊ (CARDS) -->
    <div class="row g-4 mb-4" v-if="!isLoading">
      
      <!-- Độc giả -->
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
          <div class="card-body position-relative p-4">
            <div class="text-muted fw-semibold mb-1">Tổng Độc Giả</div>
            <h2 class="fw-bold mb-0 text-dark">{{ stats.tongDocGia }}</h2>
            <div class="position-absolute top-50 end-0 translate-middle-y pe-4">
              <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                <i class="bi bi-people-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sách trong kho -->
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
          <div class="card-body position-relative p-4">
            <div class="text-muted fw-semibold mb-1">Sách Trong Kho</div>
            <h2 class="fw-bold mb-0 text-dark">{{ stats.tongSach }}</h2>
            <div class="position-absolute top-50 end-0 translate-middle-y pe-4">
              <div class="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                <i class="bi bi-book-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Phiếu đang mượn -->
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
          <div class="card-body position-relative p-4">
            <div class="text-muted fw-semibold mb-1">Đang Mượn</div>
            <h2 class="fw-bold mb-0 text-dark">{{ stats.phieuDangMuon }}</h2>
            <div class="position-absolute top-50 end-0 translate-middle-y pe-4">
              <div class="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                <i class="bi bi-bookmark-star-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Doanh thu phạt -->
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
          <div class="card-body position-relative p-4">
            <div class="text-muted fw-semibold mb-1">Doanh Thu Phạt</div>
            <h2 class="fw-bold mb-0 text-dark">{{ formatCurrency(stats.tongDoanhThu) }}</h2>
            <div class="position-absolute top-50 end-0 translate-middle-y pe-4">
              <div class="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                <i class="bi bi-cash-stack fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- HÀNG 2: TOP SÁCH MƯỢN NHIỀU NHẤT -->
    <div class="row" v-if="!isLoading">
      <div class="col-12 col-xl-8">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-header bg-white border-0 pt-4 pb-0 px-4">
            <h5 class="fw-bold mb-0">🏆 Top 5 Sách Mượn Nhiều Nhất</h5>
          </div>
          <div class="card-body p-4">
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th scope="col" class="rounded-start">#</th>
                    <th scope="col">Tên Sách</th>
                    <th scope="col" class="text-center rounded-end">Lượt Mượn</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sach, index) in stats.topSach" :key="sach._id">
                    <td class="fw-bold text-muted">{{ index + 1 }}</td>
                    <td>
                      <div class="d-flex align-items-center gap-3">
                        <div class="bg-light rounded p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                          <i class="bi bi-book text-primary"></i>
                        </div>
                        <span class="fw-semibold text-dark">{{ sach.tenSach }}</span>
                      </div>
                    </td>
                    <td class="text-center">
                      <span class="badge bg-primary rounded-pill px-3 py-2 fs-6">{{ sach.luotMuon }}</span>
                    </td>
                  </tr>
                  <tr v-if="stats.topSach.length === 0">
                    <td colspan="3" class="text-center text-muted py-4">Chưa có dữ liệu mượn sách.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="isLoading" class="d-flex justify-content-center align-items-center" style="height: 60vh;">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const stats = ref({
    tongDocGia: 0,
    tongSach: 0,
    phieuDangMuon: 0,
    tongDoanhThu: 0,
    topSach: []
});
const isLoading = ref(true);

const fetchStats = async () => {
    try {
        const response = await api.get('/stats');
        stats.value = response.data;
    } catch (error) {
        console.error("Lỗi lấy thống kê:", error);
    } finally {
        isLoading.value = false;
    }
};

// Hàm định dạng tiền tệ VNĐ
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

onMounted(() => {
    fetchStats();
});
</script>

<style scoped>
.bg-primary { background-color: var(--accent) !important; }
.text-primary { color: var(--accent) !important; }
</style>