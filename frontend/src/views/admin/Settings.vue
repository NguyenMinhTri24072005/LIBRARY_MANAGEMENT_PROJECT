<template>
  <div class="row justify-content-center">
    <div class="col-12 col-lg-8 col-xl-6">
      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-header bg-white border-0 pt-4 pb-0 px-4">
          <h4 class="fw-bold mb-0 text-primary"><i class="bi bi-gear-fill me-2"></i>Cài Đặt Hệ Thống</h4>
          <p class="text-muted small mt-1">Thay đổi các tham số quy định việc mượn/trả sách của thư viện.</p>
        </div>
        
        <div class="card-body p-4">
          <form @submit.prevent="saveSettings" v-if="!isLoading">
            
            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Số ngày mượn tối đa</label>
              <div class="input-group">
                <input type="number" class="form-control bg-light" v-model="settings.soNgayMuonToiDa" min="1" required>
                <span class="input-group-text bg-white text-muted">Ngày</span>
              </div>
              <div class="form-text">Thời gian tối đa độc giả được giữ sách trước khi bị tính trễ hạn.</div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Phí phạt trễ hạn (mỗi ngày)</label>
              <div class="input-group">
                <input type="number" class="form-control bg-light" v-model="settings.phiPhatTrenNgay" min="0" step="1000" required>
                <span class="input-group-text bg-white text-muted">VNĐ</span>
              </div>
              <div class="form-text">Số tiền phạt tính cho mỗi cuốn sách bị trả trễ 1 ngày.</div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Giới hạn số sách mượn</label>
              <div class="input-group">
                <input type="number" class="form-control bg-light" v-model="settings.soSachMuonToiDa" min="1" required>
                <span class="input-group-text bg-white text-muted">Cuốn</span>
              </div>
              <div class="form-text">Số lượng sách tối đa một độc giả được phép mượn cùng lúc.</div>
            </div>

            <hr class="my-4 text-muted">

            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary px-4 fw-bold shadow-sm" :disabled="isSaving">
                <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-floppy me-2"></i>
                Lưu Thay Đổi
              </button>
            </div>
          </form>

          <!-- Loading State -->
          <div v-else class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
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

const settings = ref({
    soNgayMuonToiDa: 14,
    phiPhatTrenNgay: 5000,
    soSachMuonToiDa: 5
});

const isLoading = ref(true);
const isSaving = ref(false);

const fetchSettings = async () => {
    try {
        const response = await api.get('/settings');
        if (response.data) {
            settings.value = response.data;
        }
    } catch (error) {
        console.error("Lỗi lấy cài đặt:", error);
    } finally {
        isLoading.value = false;
    }
};

const saveSettings = async () => {
    isSaving.value = true;
    try {
        await api.put('/settings', settings.value);
        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Đã cập nhật cài đặt hệ thống!',
            timer: 1500,
            showConfirmButton: false
        });
    } catch (error) {
        console.error("Lỗi lưu cài đặt:", error);
    } finally {
        isSaving.value = false;
    }
};

onMounted(() => {
    fetchSettings();
});
</script>

<style scoped>
.bg-primary { background-color: var(--accent) !important; }
.text-primary { color: var(--accent) !important; }
.btn-primary { background-color: var(--accent); border-color: var(--accent); }
.btn-primary:hover { background-color: #902be6; border-color: #902be6; }
</style>