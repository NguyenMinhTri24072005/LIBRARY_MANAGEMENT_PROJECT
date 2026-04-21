<template>
    <div class="container py-5">
        <div v-if="isLoadingProfile" class="text-center py-5 mt-5">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status"></div>
            <h5 class="mt-3 text-muted">Đang tải hồ sơ...</h5>
        </div>

        <div v-else-if="!hasError" class="row g-4">
            <div class="col-lg-4">
                <div class="card border-0 shadow-sm rounded-4 text-center p-4">
                    <div class="position-relative d-inline-block mx-auto mb-3">
                        <img :src="avatarPreview || getImageUrl(user.hinhAnh)"
                            class="rounded-circle object-fit-cover border border-3 border-primary shadow-sm"
                            style="width: 150px; height: 150px; background-color: #f8f9fa;" @error="handleImageError">

                        <label for="avatarUpload"
                            class="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow cursor-pointer"
                            style="cursor: pointer; transition: 0.2s;" title="Đổi ảnh đại diện">
                            <i class="bi bi-camera-fill"></i>
                        </label>
                        <input type="file" id="avatarUpload" class="d-none" accept="image/*" @change="handleFileUpload">
                    </div>

                    <h4 class="fw-bold mb-1">{{ user.hoLot }} {{ user.ten }} {{ user.hoTenNV }}</h4>
                    <p class="text-muted mb-3"><i class="bi bi-telephone-fill me-2"></i>{{ user.dienThoai ||
                        user.soDienThoai }}</p>

                    <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold mb-3">
                        {{ authStore.isAdmin ? 'Quản trị viên' : 'Thành viên Thư Viện' }}
                    </span>

                    <div v-if="!authStore.isAdmin" class="bg-light rounded-3 p-3 text-start mt-2 border">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-muted fw-semibold">Điểm uy tín:</span>
                            <span class="badge rounded-pill fs-6"
                                :class="user.diemUyTin >= 50 ? 'bg-success' : 'bg-danger'">
                                <i class="bi bi-star-fill me-1"></i>{{ user.diemUyTin }}
                            </span>
                        </div>
                        <div class="progress" style="height: 6px;">
                            <div class="progress-bar bg-success" :style="{ width: user.diemUyTin + '%' }"></div>
                        </div>
                        <small class="text-muted mt-2 d-block" style="font-size: 0.8rem;">Điểm uy tín quyết định số
                            lượng sách bạn được mượn.</small>
                    </div>
                </div>
            </div>

            <div class="col-lg-8">
                <div class="card border-0 shadow-sm rounded-4">
                    <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                        <ul class="nav nav-tabs nav-tabs-custom border-bottom-0" role="tablist">
                            <li class="nav-item">
                                <button class="nav-link active fw-bold px-4" data-bs-toggle="tab"
                                    data-bs-target="#info-tab" type="button">Thông tin cá nhân</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link fw-bold px-4 text-muted" data-bs-toggle="tab"
                                    data-bs-target="#password-tab" type="button">Đổi mật khẩu</button>
                            </li>
                        </ul>
                    </div>

                    <div class="card-body p-4">
                        <div class="tab-content">
                            <div class="tab-pane fade show active" id="info-tab">
                                <form @submit.prevent="updateProfile">
                                    <div class="row g-3">
                                        <div class="col-md-6" v-if="!authStore.isAdmin">
                                            <label class="form-label fw-semibold">Họ lót</label>
                                            <input type="text" class="form-control bg-light" v-model="user.hoLot"
                                                required>
                                        </div>
                                        <div class="col-md-6" v-if="!authStore.isAdmin">
                                            <label class="form-label fw-semibold">Tên</label>
                                            <input type="text" class="form-control bg-light" v-model="user.ten"
                                                required>
                                        </div>

                                        <div class="col-md-12" v-if="authStore.isAdmin">
                                            <label class="form-label fw-semibold">Họ và Tên</label>
                                            <input type="text" class="form-control bg-light" v-model="user.hoTenNV"
                                                required>
                                        </div>

                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold">Số điện thoại</label>
                                            <input v-if="!authStore.isAdmin" type="tel" class="form-control bg-light"
                                                v-model="user.dienThoai" readonly title="Không thể đổi SĐT">
                                            <input v-else type="tel" class="form-control bg-light"
                                                v-model="user.soDienThoai" pattern="[0-9]{10,11}">
                                        </div>

                                        <div class="col-md-6" v-if="!authStore.isAdmin">
                                            <label class="form-label fw-semibold">Giới tính</label>
                                            <select class="form-select bg-light" v-model="user.phai">
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                                <option value="Khác">Khác</option>
                                            </select>
                                        </div>

                                        <div class="col-md-6" v-if="!authStore.isAdmin">
                                            <label class="form-label fw-semibold">Ngày sinh</label>
                                            <input type="date" class="form-control bg-light"
                                                v-model="formattedNgaySinh">
                                        </div>

                                        <div class="col-12">
                                            <label class="form-label fw-semibold">Địa chỉ</label>
                                            <input type="text" class="form-control bg-light" v-model="user.diaChi">
                                        </div>
                                    </div>
                                    <div class="mt-4 text-end">
                                        <button type="submit" class="btn btn-primary px-4 fw-bold shadow-sm"
                                            :disabled="isSavingProfile">
                                            <span v-if="isSavingProfile"
                                                class="spinner-border spinner-border-sm me-2"></span>
                                            Lưu Thông Tin
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div class="tab-pane fade" id="password-tab">
                                <form @submit.prevent="changePassword">
                                    <div class="row g-3">
                                        <div class="col-12">
                                            <label class="form-label fw-semibold">Mật khẩu hiện tại <span
                                                    class="text-danger">*</span></label>
                                            <input type="password" class="form-control bg-light"
                                                v-model="pwdForm.oldPassword" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold">Mật khẩu mới <span
                                                    class="text-danger">*</span></label>
                                            <input type="password" class="form-control bg-light"
                                                v-model="pwdForm.newPassword" required minlength="6">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold">Xác nhận mật khẩu mới <span
                                                    class="text-danger">*</span></label>
                                            <input type="password" class="form-control bg-light"
                                                v-model="pwdForm.confirmPassword" required minlength="6">
                                        </div>
                                    </div>
                                    <div class="mt-4 text-end">
                                        <button type="submit" class="btn btn-warning text-dark px-4 fw-bold shadow-sm"
                                            :disabled="isSavingPwd">
                                            <span v-if="isSavingPwd"
                                                class="spinner-border spinner-border-sm me-2"></span>
                                            Cập Nhật Mật Khẩu
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-center py-5 mt-5">
            <i class="bi bi-exclamation-circle text-danger display-1"></i>
            <h4 class="mt-3">Không thể tải thông tin</h4>
            <p class="text-muted">Vui lòng tải lại trang hoặc đăng nhập lại.</p>
            <button class="btn btn-primary mt-2" @click="fetchProfile">Thử lại</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../store/auth.store';
import api from '../services/api';
import Swal from 'sweetalert2';

const authStore = useAuthStore();

// KHỞI TẠO BỘ KHUNG AN TOÀN
const user = ref({
    _id: '',
    hoLot: '',
    ten: '',
    hoTenNV: '',
    dienThoai: '',
    soDienThoai: '',
    phai: 'Nam',
    diaChi: '',
    ngaySinh: '',
    hinhAnh: '', // Đồng bộ tên trường hinhAnh với Model và Header
    diemUyTin: 100
});

const isLoadingProfile = ref(true);
const hasError = ref(false);
const isSavingProfile = ref(false);
const isSavingPwd = ref(false);

const avatarFile = ref(null);
const avatarPreview = ref(null);

const pwdForm = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});

// Hàm tạo URL ảnh an toàn
const getImageUrl = (path) => {
    if (!path) return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.value.ten || user.value.hoTenNV || 'U') + '&background=764ba2&color=fff&size=150';
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path}`;
};

const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.value.ten || user.value.hoTenNV || 'U') + '&background=764ba2&color=fff&size=150';
};

// Computed property an toàn cho ngày sinh
const formattedNgaySinh = computed({
    get() {
        if (!user.value.ngaySinh) return '';
        try {
            return new Date(user.value.ngaySinh).toISOString().split('T')[0];
        } catch (e) {
            return '';
        }
    },
    set(newValue) {
        user.value.ngaySinh = newValue;
    }
});

// Trong Profile.vue, sửa lại hàm fetchProfile một chút:
const fetchProfile = async () => {
    isLoadingProfile.value = true;
    hasError.value = false;
    try {
        // Ưu tiên dùng dữ liệu Store để hiện giao diện ngay
        if (authStore.user) {
            user.value = { ...user.value, ...authStore.user };
        }

        let endpoint = '';
        if (authStore.isAdmin) {
            console.log("là admin")
            endpoint = '/auth/me';
        } else {
            console.log("là user")
            // Đảm bảo Backend đã chỉnh docgia.route.js như Bước 1
            endpoint = '/readers/profile';
        }

        const res = await api.get(endpoint);
        const freshData = res.data?.data || res.data;

        if (freshData) {
            console.log('vôp nè')
            // Map dữ liệu linh hoạt giữa Nhân viên và Độc giả
            user.value = {
                ...user.value,
                ...freshData,
                // Đồng bộ trường ảnh
                hinhAnh: freshData.hinhAnh || freshData.avatar || ''
            };
        }
    } catch (error) {
        console.error("Lỗi lấy thông tin:", error);
        // Nếu lỗi 404 nhưng vẫn có data trong Store thì không hiện màn hình lỗi
        if (!authStore.user) {
            hasError.value = true;
        }
    } finally {
        isLoadingProfile.value = false;
    }
};

// Upload Avatar
const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    avatarFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);

    try {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        const uploadRes = await api.post('/upload', formDataUpload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Cập nhật tên trường hinhAnh
        const imageUrl = uploadRes.data.data?.imageUrl || uploadRes.data.imageUrl;
        user.value.hinhAnh = imageUrl;

        // SỬA LỖI TẠI ĐÂY: Gọi đúng API update profile tùy vai trò
        const updateEndpoint = authStore.isAdmin ? '/auth/profile' : '/readers/profile';
        await api.put(updateEndpoint, { hinhAnh: imageUrl });

        await authStore.fetchCurrentUser();
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã cập nhật ảnh đại diện', showConfirmButton: false, timer: 2000 });
    } catch (error) {
        console.error("Lỗi upload avatar:", error);
        Swal.fire('Lỗi', 'Không thể tải ảnh lên', 'error');
    }
};

const updateProfile = async () => {
    isSavingProfile.value = true;
    try {
        // SỬA LỖI TẠI ĐÂY: Gọi đúng API update profile tùy vai trò
        const updateEndpoint = authStore.isAdmin ? '/auth/profile' : '/readers/profile';

        // Loại bỏ các trường không cho phép sửa hoặc của hệ thống
        const { _id, dienThoai, diemUyTin, password, ...updateData } = user.value;

        await api.put(updateEndpoint, updateData);
        await authStore.fetchCurrentUser();
        Swal.fire('Thành công', 'Đã cập nhật thông tin cá nhân!', 'success');
    } catch (error) {
        console.error("Lỗi cập nhật profile:", error);
        Swal.fire('Lỗi', 'Có lỗi xảy ra khi lưu thông tin', 'error');
    } finally {
        isSavingProfile.value = false;
    }
};

const changePassword = async () => {
    if (pwdForm.value.newPassword !== pwdForm.value.confirmPassword) {
        return Swal.fire('Lỗi', 'Mật khẩu xác nhận không khớp!', 'warning');
    }

    isSavingPwd.value = true;
    try {
        await api.put('/auth/password', {
            oldPassword: pwdForm.value.oldPassword,
            newPassword: pwdForm.value.newPassword
        });

        Swal.fire('Thành công', 'Đổi mật khẩu thành công. Lần đăng nhập sau hãy dùng mật khẩu mới!', 'success');
        pwdForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
    } catch (error) {
        console.error("Lỗi đổi mật khẩu:", error);
    } finally {
        isSavingPwd.value = false;
    }
};

onMounted(() => {
    fetchProfile();
});
</script>

<style scoped>
.nav-tabs-custom .nav-link {
    color: #6c757d;
    border: none;
    border-bottom: 3px solid transparent;
    padding-bottom: 12px;
}

.nav-tabs-custom .nav-link.active {
    color: var(--accent);
    background-color: transparent;
    border-bottom: 3px solid var(--accent);
}

.nav-tabs-custom .nav-link:hover {
    color: var(--accent);
}

.object-fit-cover {
    object-fit: cover;
}

.cursor-pointer {
    cursor: pointer;
}
</style>