<template>
  <div>
    <!-- BỘ LỌC THỜI GIAN -->
    <div class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <h5 class="fw-bold mb-0 text-dark"><i class="bi bi-funnel-fill text-primary me-2"></i>Lọc dữ liệu</h5>
        <div class="d-flex align-items-center gap-2">
          <input type="date" class="form-control bg-light border-0" v-model="filter.fromDate">
          <span class="text-muted fw-bold">-</span>
          <input type="date" class="form-control bg-light border-0" v-model="filter.toDate">
          <button class="btn btn-primary fw-bold px-4" @click="fetchStats" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm"></span> Lọc
          </button>
          <button class="btn btn-light text-danger fw-bold" @click="resetFilter" title="Xóa bộ lọc">
            <i class="bi bi-x-circle"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- HÀNG 1: THẺ THỐNG KÊ -->
    <div class="row g-4 mb-4" v-if="!isLoading">
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">
            <div class="text-muted fw-semibold mb-1">Tổng Độc Giả</div>
            <h2 class="fw-bold mb-0 text-dark">{{ stats.tongDocGia }}</h2>
            <i class="bi bi-people-fill position-absolute top-50 end-0 translate-middle-y pe-4 fs-1 text-primary opacity-25"></i>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">
            <div class="text-muted fw-semibold mb-1">Sách Trong Kho</div>
            <h2 class="fw-bold mb-0 text-dark">{{ stats.tongSach }}</h2>
            <i class="bi bi-book-fill position-absolute top-50 end-0 translate-middle-y pe-4 fs-1 text-success opacity-25"></i>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">
            <div class="text-muted fw-semibold mb-1">Lượt Mượn (Kỳ này)</div>
            <h2 class="fw-bold mb-0 text-dark">{{ stats.soLuotMuon }}</h2>
            <i class="bi bi-bookmark-star-fill position-absolute top-50 end-0 translate-middle-y pe-4 fs-1 text-warning opacity-25"></i>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 h-100 bg-primary text-white" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <div class="card-body p-4">
            <div class="fw-semibold mb-1 text-white-50">Doanh Thu Phạt (Kỳ này)</div>
            <h2 class="fw-bold mb-0">{{ formatCurrency(stats.tongDoanhThu) }}</h2>
            <i class="bi bi-cash-stack position-absolute top-50 end-0 translate-middle-y pe-4 fs-1 text-white opacity-25"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- HÀNG 2: BIỂU ĐỒ & TOP SÁCH -->
    <div class="row g-4 mb-4" v-if="!isLoading">
      <!-- Biểu đồ -->
      <div class="col-12 col-xl-7">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-header bg-white border-0 pt-4 pb-0 px-4">
            <h5 class="fw-bold mb-0">📈 Biểu đồ Lượt mượn theo ngày</h5>
          </div>
          <div class="card-body p-4">
            <!-- Render Biểu đồ Bar -->
            <Bar v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" style="max-height: 300px;" />
            <div v-else class="text-center text-muted py-5 mt-4 border border-dashed rounded-3">
              Không có dữ liệu mượn sách trong thời gian này.
            </div>
          </div>
        </div>
      </div>

      <!-- Top Sách -->
      <div class="col-12 col-xl-5">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-header bg-white border-0 pt-4 pb-0 px-4">
            <h5 class="fw-bold mb-0">🏆 Top 5 Sách Hot</h5>
          </div>
          <div class="card-body p-4">
            <div class="table-responsive">
              <table class="table table-borderless align-middle mb-0">
                <tbody>
                  <tr v-for="(sach, index) in stats.topSach" :key="sach._id" class="border-bottom">
                    <td class="fw-bold text-primary">#{{ index + 1 }}</td>
                    <td>
                      <div class="fw-semibold text-dark text-truncate" style="max-width: 200px;">{{ sach.tenSach }}</div>
                    </td>
                    <td class="text-end">
                      <span class="badge bg-light text-dark border px-3 py-2">{{ sach.luotMuon }} lượt</span>
                    </td>
                  </tr>
                  <tr v-if="stats.topSach.length === 0">
                    <td colspan="3" class="text-center text-muted py-4">Chưa có dữ liệu.</td>
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
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

// --- Cấu hình cho vue-chartjs ---
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const stats = ref({ tongDocGia: 0, tongSach: 0, soLuotMuon: 0, tongDoanhThu: 0, topSach: [], chartData: [] });
const isLoading = ref(true);

// Lọc 30 ngày gần nhất mặc định
const today = new Date();
const lastMonth = new Date();
lastMonth.setDate(today.getDate() - 30);

const filter = ref({
    fromDate: lastMonth.toISOString().split('T')[0],
    toDate: today.toISOString().split('T')[0]
});

// Dữ liệu cho biểu đồ
const chartData = ref({ labels: [], datasets: [] });
const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
});

const fetchStats = async () => {
    isLoading.value = true;
    try {
        let query = '';
        if (filter.value.fromDate && filter.value.toDate) {
            query = `?fromDate=${filter.value.fromDate}&toDate=${filter.value.toDate}`;
        }
        
        const response = await api.get(`/stats${query}`);
        stats.value = response.data;

        // Đổ dữ liệu vào biểu đồ
        if (stats.value.chartData) {
            chartData.value = {
                labels: stats.value.chartData.map(item => item._id), // Các ngày
                datasets: [{
                    label: 'Số lượt mượn',
                    backgroundColor: '#764ba2',
                    borderRadius: 4,
                    data: stats.value.chartData.map(item => item.count) // Số lượng
                }]
            };
        }
    } catch (error) {
        console.error("Lỗi lấy thống kê:", error);
    } finally {
        isLoading.value = false;
    }
};

const resetFilter = () => {
    filter.value.fromDate = '';
    filter.value.toDate = '';
    fetchStats();
};

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
.btn-primary { background-color: var(--accent); border-color: var(--accent); }
.border-dashed { border-style: dashed !important; }
</style>