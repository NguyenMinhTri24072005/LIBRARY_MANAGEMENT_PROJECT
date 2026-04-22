<template>
  <div class="about-page">
    <!-- Hero Section -->
    <div class="hero-section position-relative overflow-hidden mb-5">
      <div class="container h-100 position-relative z-1 py-5">
        <div class="text-center text-white mt-5">
          <span class="badge bg-white text-primary mb-3 px-3 py-2 rounded-pill fw-bold shadow-sm">Giới Thiệu</span>
          <h1 class="display-3 fw-bolder mb-3 text-glow">Về Thư Viện Vie</h1>
          <p class="lead text-white-50 max-w-700 mx-auto fw-normal">Nơi khơi nguồn tri thức, kết nối đam mê đọc sách và xây dựng cộng đồng học tập không giới hạn.</p>
        </div>
      </div>
      <!-- Background elements -->
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-gradient-custom"></div>
      <div class="position-absolute top-0 end-0 opacity-20 floating-element-1" style="width: 300px; height: 300px; background: radial-gradient(circle, white 0%, transparent 70%); transform: translate(30%, -30%);"></div>
      <div class="position-absolute bottom-0 start-0 opacity-20 floating-element-2" style="width: 200px; height: 200px; background: radial-gradient(circle, white 0%, transparent 70%); transform: translate(-30%, 30%);"></div>
    </div>

    <div class="container pb-5">
      <div class="row align-items-center mb-5 g-5">
        <div class="col-lg-6">
          <div class="pe-lg-4">
            <h2 class="fw-bolder mb-4 text-gradient">Sứ Mệnh Của Chúng Tôi</h2>
            <p class="text-muted fs-5 mb-4 lh-base">
              Thư Viện Vie được thành lập với mục tiêu mang tri thức đến gần hơn với mọi người. Chúng tôi tin rằng mỗi cuốn sách là một cánh cửa mở ra thế giới mới, và việc tiếp cận những cánh cửa này cần phải dễ dàng, thuận tiện cho tất cả.
            </p>
            <ul class="list-unstyled mb-0">
              <li class="d-flex align-items-center mb-4 feature-item">
                <div class="icon-box bg-success bg-opacity-10 text-success me-3 shadow-sm">
                  <i class="bi bi-collection-fill fs-4"></i>
                </div>
                <span class="fs-5 text-dark fw-medium">Cung cấp hàng ngàn đầu sách chất lượng cao.</span>
              </li>
              <li class="d-flex align-items-center mb-4 feature-item">
                <div class="icon-box bg-primary bg-opacity-10 text-primary me-3 shadow-sm">
                  <i class="bi bi-lightning-fill fs-4"></i>
                </div>
                <span class="fs-5 text-dark fw-medium">Hệ thống mượn trả trực tuyến nhanh chóng.</span>
              </li>
              <li class="d-flex align-items-center feature-item">
                <div class="icon-box bg-warning bg-opacity-10 text-warning me-3 shadow-sm">
                  <i class="bi bi-people-fill fs-4"></i>
                </div>
                <span class="fs-5 text-dark fw-medium">Xây dựng cộng đồng văn hóa đọc văn minh.</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="glass-card rounded-5 p-5 text-center shadow-lg position-relative overflow-hidden">
            <div class="position-relative z-1">
              <i class="bi bi-book-half text-primary mb-4 floating-book" style="font-size: 8rem; filter: drop-shadow(0 15px 25px rgba(118, 75, 162, 0.4));"></i>
              <h3 class="display-5 fw-bolder text-dark mt-2 mb-0">10,000+</h3>
              <p class="text-primary fw-semibold fs-5 mb-0">Tài liệu & Đầu sách</p>
            </div>
            <div class="glass-decoration"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-primary { color: var(--accent) !important; }
.bg-primary { background-color: var(--accent) !important; }
.max-w-700 { max-width: 700px; margin-left: auto; margin-right: auto; }

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
  min-height: 350px;
  border-radius: 0 0 3rem 3rem;
  box-shadow: 0 10px 30px rgba(118, 75, 162, 0.15);
}

.icon-box {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.feature-item:hover .icon-box {
  transform: scale(1.1) rotate(5deg);
}

.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(118, 75, 162, 0.15) !important;
}

.glass-decoration {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(118, 75, 162, 0.05) 0%, transparent 60%);
  z-index: 0;
}

.floating-element-1 {
  animation: float 6s ease-in-out infinite;
  z-index: 0;
}

.floating-element-2 {
  animation: float 8s ease-in-out infinite reverse;
  z-index: 0;
}

.floating-book {
  display: inline-block;
  animation: float-small 4s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translate(30%, -30%) translateY(0px); }
  50% { transform: translate(30%, -30%) translateY(20px); }
  100% { transform: translate(30%, -30%) translateY(0px); }
}

@keyframes float-small {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}
</style>
