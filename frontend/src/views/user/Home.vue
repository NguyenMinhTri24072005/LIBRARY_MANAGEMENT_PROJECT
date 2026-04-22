<template>
  <div>
    <div class="hero-section rounded-4 overflow-hidden mb-5 position-relative shadow-sm" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 400px;">
      <div class="container h-100 position-relative z-1">
        <div class="row h-100 align-items-center py-5">
          <div class="col-lg-7 text-white text-center text-lg-start">
            <span class="badge bg-white text-primary mb-3 px-3 py-2 rounded-pill fw-bold shadow-sm">Thư Viện Thông Minh 2024</span>
            <h1 class="display-4 fw-bolder mb-4 lh-sm">Tri Thức Là Sức Mạnh<br>Hành Trình Bắt Đầu Từ Đây</h1>
            <p class="lead mb-4 text-white-50 fw-normal">Khám phá hàng ngàn đầu sách phong phú, từ văn học kinh điển đến khoa học hiện đại. Đăng ký mượn sách trực tuyến nhanh chóng, tiện lợi chỉ với vài cú click.</p>
            <div class="d-flex gap-3 justify-content-center justify-content-lg-start">
              <router-link to="/books" class="btn btn-light btn-lg text-primary fw-bold px-4 rounded-pill shadow-sm">
                <i class="bi bi-search me-2"></i>Khám phá ngay
              </router-link>
              <router-link to="/history" class="btn btn-outline-light btn-lg fw-bold px-4 rounded-pill">
                Lịch sử mượn
              </router-link>
            </div>
          </div>
          <div class="col-lg-5 d-none d-lg-block text-center">
            <i class="bi bi-book-half text-white opacity-50 floating-element" style="font-size: 15rem; line-height: 1; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.3));"></i>
          </div>
        </div>
      </div>
      <div class="position-absolute top-0 end-0 opacity-10" style="width: 300px; height: 300px; background: radial-gradient(circle, white 0%, transparent 70%); transform: translate(30%, -30%);"></div>
      <div class="position-absolute bottom-0 start-0 opacity-10" style="width: 200px; height: 200px; background: radial-gradient(circle, white 0%, transparent 70%); transform: translate(-30%, 30%);"></div>
    </div>

    <div class="row g-4 mb-5">
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm rounded-4 text-center p-4 feature-card">
          <div class="bg-primary bg-opacity-10 text-primary mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3" style="width: 70px; height: 70px;">
            <i class="bi bi-collection-fill fs-2"></i>
          </div>
          <h5 class="fw-bold text-dark mb-2">Đa Dạng Thể Loại</h5>
          <p class="text-muted small mb-0">Hàng ngàn đầu sách được cập nhật liên tục từ các nhà xuất bản uy tín.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm rounded-4 text-center p-4 feature-card">
          <div class="bg-success bg-opacity-10 text-success mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3" style="width: 70px; height: 70px;">
            <i class="bi bi-lightning-fill fs-2"></i>
          </div>
          <h5 class="fw-bold text-dark mb-2">Mượn Trả Nhanh Chóng</h5>
          <p class="text-muted small mb-0">Thao tác trực tuyến, duyệt đơn tự động, tiết kiệm thời gian chờ đợi.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm rounded-4 text-center p-4 feature-card">
          <div class="bg-warning bg-opacity-10 text-warning mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3" style="width: 70px; height: 70px;">
            <i class="bi bi-star-fill fs-2"></i>
          </div>
          <h5 class="fw-bold text-dark mb-2">Hệ Thống Uy Tín</h5>
          <p class="text-muted small mb-0">Tích lũy điểm uy tín khi trả sách đúng hạn để nhận thêm nhiều ưu đãi.</p>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-end mb-4 border-bottom pb-2">
      <h4 class="fw-bold text-dark mb-0 border-start border-4 border-primary ps-2">Sách Mới Cập Nhật</h4>
      <router-link to="/books" class="text-decoration-none fw-semibold text-primary">Xem tất cả <i class="bi bi-arrow-right"></i></router-link>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
    </div>

    <div v-else-if="recentBooks.length === 0" class="text-center py-5 text-muted">
      Chưa có sách nào trong hệ thống.
    </div>

    <div v-else class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4 mb-5">
      <div class="col" v-for="book in recentBooks" :key="book._id">
        <div class="card h-100 border-0 shadow-sm rounded-4 book-card overflow-hidden" style="cursor: pointer;" @click="$router.push(`/books/${book._id}`)">
          <div class="bg-light text-center p-3" style="height: 200px;">
            <img :src="getImageUrl(book.hinhAnh)" class="img-fluid h-100 object-fit-contain shadow-sm rounded" :alt="book.tenSach" @error="handleImageError">
          </div>
          <div class="card-body p-3 text-center">
            <h6 class="card-title fw-bold text-dark mb-1 text-truncate" :title="book.tenSach">{{ book.tenSach }}</h6>
            <div class="small text-secondary text-truncate">{{ book.tacGia }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const recentBooks = ref([]);
const isLoading = ref(true);

const fetchRecentBooks = async () => {
    isLoading.value = true;
    try {
        const res = await api.get('/books');
        // Logic lấy mảng sách an toàn
        const allBooks = res.data?.data?.books || res.data?.data || res.data || [];
        recentBooks.value = Array.isArray(allBooks) ? allBooks.slice(0, 5) : [];
    } catch (error) {
        console.error("Lỗi Home:", error);
        recentBooks.value = [];
    } finally {
        // Tắt loading trong mọi trường hợp (thành công hoặc thất bại)
        isLoading.value = false;
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
    fetchRecentBooks();
});
</script>

<style scoped>
.text-primary { color: var(--accent) !important; }
.bg-primary { background-color: var(--accent) !important; }
.border-primary { border-color: var(--accent) !important; }

.feature-card {
    transition: transform 0.3s ease;
}
.feature-card:hover {
    transform: translateY(-10px);
}

.book-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.book-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
</style>