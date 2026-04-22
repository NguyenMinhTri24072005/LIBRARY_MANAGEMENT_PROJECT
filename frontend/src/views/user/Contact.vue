<template>
  <div class="contact-page pb-5">
    <!-- Hero Section -->
    <div class="hero-section position-relative overflow-hidden mb-5">
      <div class="container h-100 position-relative z-1 py-5">
        <div class="text-center text-white mt-5">
          <span class="badge bg-white text-primary mb-3 px-3 py-2 rounded-pill fw-bold shadow-sm">Kết Nối</span>
          <h1 class="display-3 fw-bolder mb-3 text-glow">Liên Hệ Với Chúng Tôi</h1>
          <p class="lead text-white-50 max-w-700 mx-auto fw-normal">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với Thư Viện Vie qua các thông tin bên dưới.</p>
        </div>
      </div>
      <!-- Background elements -->
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-gradient-custom"></div>
      <div class="position-absolute top-0 end-0 opacity-20 floating-element-1" style="width: 300px; height: 300px; background: radial-gradient(circle, white 0%, transparent 70%); transform: translate(30%, -30%);"></div>
      <div class="position-absolute bottom-0 start-0 opacity-20 floating-element-2" style="width: 200px; height: 200px; background: radial-gradient(circle, white 0%, transparent 70%); transform: translate(-30%, 30%);"></div>
    </div>

    <div class="container" style="margin-top: -60px; position: relative; z-index: 2;">
      <div class="row g-4 g-lg-5">
        <div class="col-lg-5">
          <div class="glass-card p-5 rounded-5 shadow-lg h-100 border-top border-4 border-primary position-relative overflow-hidden">
            <h3 class="fw-bolder mb-4 text-gradient">Thông Tin Liên Hệ</h3>
            
            <div class="contact-item d-flex mb-4 align-items-center p-3 rounded-4 transition-all">
              <div class="icon-box bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm" style="width: 55px; height: 55px;">
                <i class="bi bi-geo-alt-fill fs-4"></i>
              </div>
              <div class="ms-4">
                <h5 class="fw-bold mb-1 text-dark">Địa Chỉ</h5>
                <p class="text-muted mb-0">123 Đường Sách, Phường Tri Thức, Quận Đọc, TP. Hồ Chí Minh</p>
              </div>
            </div>

            <div class="contact-item d-flex mb-4 align-items-center p-3 rounded-4 transition-all">
              <div class="icon-box bg-success text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm" style="width: 55px; height: 55px;">
                <i class="bi bi-envelope-fill fs-4"></i>
              </div>
              <div class="ms-4">
                <h5 class="fw-bold mb-1 text-dark">Email</h5>
                <p class="text-muted mb-0">hotro@thuvienvie.vn</p>
              </div>
            </div>

            <div class="contact-item d-flex mb-4 align-items-center p-3 rounded-4 transition-all">
              <div class="icon-box bg-warning text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm" style="width: 55px; height: 55px;">
                <i class="bi bi-telephone-fill fs-4"></i>
              </div>
              <div class="ms-4">
                <h5 class="fw-bold mb-1 text-dark">Điện Thoại</h5>
                <p class="text-muted mb-0">+84 123 456 789</p>
              </div>
            </div>

            <div class="d-flex mt-5 gap-3 justify-content-center border-top pt-4">
               <a href="#" class="social-btn btn btn-outline-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;"><i class="bi bi-facebook fs-4"></i></a>
               <a href="#" class="social-btn btn btn-outline-info rounded-circle p-2 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;"><i class="bi bi-twitter fs-4"></i></a>
               <a href="#" class="social-btn btn btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;"><i class="bi bi-instagram fs-4"></i></a>
            </div>
            <div class="glass-decoration"></div>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="glass-card p-5 rounded-5 shadow-lg h-100">
            <h3 class="fw-bolder mb-4 text-gradient">Gửi Lời Nhắn</h3>
            <form @submit.prevent="submitForm">
              <div class="row g-4">
                <div class="col-md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control custom-input" id="nameInput" placeholder="Họ và Tên" required>
                    <label for="nameInput"><i class="bi bi-person me-2"></i>Họ và Tên</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating">
                    <input type="email" class="form-control custom-input" id="emailInput" placeholder="Email" required>
                    <label for="emailInput"><i class="bi bi-envelope me-2"></i>Email</label>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-floating">
                    <input type="text" class="form-control custom-input" id="subjectInput" placeholder="Tiêu Đề" required>
                    <label for="subjectInput"><i class="bi bi-chat-square-text me-2"></i>Tiêu Đề</label>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-floating">
                    <textarea class="form-control custom-input" id="messageInput" placeholder="Nội Dung" style="height: 150px" required></textarea>
                    <label for="messageInput"><i class="bi bi-pencil me-2"></i>Nội Dung Lời Nhắn...</label>
                  </div>
                </div>
                <div class="col-12 mt-4">
                  <button type="submit" class="btn btn-primary btn-lg w-100 fw-bold rounded-pill shadow-sm py-3 btn-glow">
                    <i class="bi bi-send-fill me-2"></i> Gửi Tin Nhắn
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2';

const submitForm = () => {
    Swal.fire({
        icon: 'success',
        title: 'Đã gửi thành công!',
        text: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.',
        confirmButtonColor: '#764ba2',
        background: '#fff',
        backdrop: `rgba(0,0,0,0.4)`
    });
};
</script>

<style scoped>
.text-primary { color: var(--accent) !important; }
.bg-primary { background-color: var(--accent) !important; }
.border-primary { border-color: var(--accent) !important; }
.btn-primary { background-color: var(--accent); border-color: var(--accent); }
.btn-primary:hover { background-color: #902be6; border-color: #902be6; }
.max-w-700 { max-width: 700px; margin-left: auto; margin-right: auto;}

.bg-gradient-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 0 3rem 3rem;
  z-index: 0;
}

.text-glow {
  text-shadow: 0 0 20px rgba(255,255,255,0.3);
}

.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-section {
  min-height: 400px;
  border-radius: 0 0 3rem 3rem;
  box-shadow: 0 10px 30px rgba(118, 75, 162, 0.15);
}

.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.glass-decoration {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(118, 75, 162, 0.05) 0%, transparent 60%);
  z-index: 0;
  pointer-events: none;
}

.transition-all {
  transition: all 0.3s ease;
}

.contact-item {
  position: relative;
  z-index: 1;
}

.contact-item:hover {
  background: rgba(118, 75, 162, 0.05);
  transform: translateX(10px);
}

.contact-item:hover .icon-box {
  transform: scale(1.1);
}

.social-btn {
  transition: all 0.3s ease;
}
.social-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.custom-input {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.custom-input:focus {
  background-color: #fff;
  border-color: var(--accent);
  box-shadow: 0 0 0 0.25rem rgba(118, 75, 162, 0.1);
}

.form-floating label {
  color: #6c757d;
  padding-left: 1.25rem;
}

.form-floating > .form-control {
  padding-left: 1.25rem;
}

.btn-glow {
  transition: all 0.3s ease;
}

.btn-glow:hover {
  box-shadow: 0 0 20px rgba(118, 75, 162, 0.4) !important;
  transform: translateY(-2px);
}

.floating-element-1 {
  animation: float 6s ease-in-out infinite;
  z-index: 0;
}

.floating-element-2 {
  animation: float 8s ease-in-out infinite reverse;
  z-index: 0;
}

@keyframes float {
  0% { transform: translate(30%, -30%) translateY(0px); }
  50% { transform: translate(30%, -30%) translateY(20px); }
  100% { transform: translate(30%, -30%) translateY(0px); }
}
</style>
