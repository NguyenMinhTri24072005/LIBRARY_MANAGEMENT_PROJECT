import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [], // Mảng chứa các sách được chọn
    }),
    getters: {
        totalItems: (state) => state.items.length,
        // Kiểm tra xem một cuốn sách đã có trong giỏ chưa
        isInCart: (state) => (bookId) => {
            return state.items.some(item => item._id === bookId);
        }
    },
    actions: {
        // Thêm sách vào giỏ
        addToCart(book, maxBooksAllowed = 5) {
            // 1. Kiểm tra giới hạn giỏ hàng
            if (this.items.length >= maxBooksAllowed) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Giỏ sách đã đầy!',
                    text: `Bạn chỉ được phép mượn tối đa ${maxBooksAllowed} cuốn sách cùng lúc.`,
                    confirmButtonColor: '#764ba2'
                });
                return false;
            }

            // 2. Kiểm tra sách đã có trong giỏ chưa
            if (this.isInCart(book._id)) {
                Swal.fire({
                    icon: 'info',
                    title: 'Đã có trong giỏ!',
                    text: 'Cuốn sách này đã nằm trong giỏ mượn của bạn.',
                    toast: true, position: 'top-end', showConfirmButton: false, timer: 2000
                });
                return false;
            }

            // 3. Kiểm tra số lượng tồn kho (Đã check ở UI nhưng check lại cho chắc)
            if (book.soQuyenHienTai <= 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Hết sách!',
                    text: 'Cuốn sách này hiện không còn sẵn trong kho.',
                    confirmButtonColor: '#d33'
                });
                return false;
            }

            // 4. Thêm vào giỏ
            this.items.push(book);
            
            Swal.fire({
                icon: 'success',
                title: 'Đã thêm!',
                text: `Đã thêm "${book.tenSach}" vào giỏ sách.`,
                toast: true, position: 'top-end', showConfirmButton: false, timer: 2000
            });
            return true;
        },

        // Xóa sách khỏi giỏ
        removeFromCart(bookId) {
            this.items = this.items.filter(item => item._id !== bookId);
        },

        // Xóa toàn bộ giỏ hàng
        clearCart() {
            this.items = [];
        }
    },
    persist: true // Tự động lưu giỏ hàng vào localStorage để không bị mất khi F5
});