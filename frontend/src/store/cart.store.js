import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [], // Mảng chứa các sách được chọn
    }),
    getters: {
        // Tổng số sách (tính cả số lượng mượn của từng cuốn)
        totalItems: (state) => state.items.reduce((total, item) => total + item.soLuongMuon, 0),
        
        // Lấy số lượng đã mượn của 1 cuốn sách cụ thể
        getQuantityInCart: (state) => (bookId) => {
            const item = state.items.find(i => i._id === bookId);
            return item ? item.soLuongMuon : 0;
        }
    },
    actions: {
        // Thêm sách vào giỏ (Cho phép thêm nhiều cuốn giống nhau)
        addToCart(book, maxBooksAllowed = 5) {
            // 1. Kiểm tra giới hạn TỔNG SỐ SÁCH trong giỏ
            if (this.totalItems >= maxBooksAllowed) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Giỏ sách đã đầy!',
                    text: `Bạn chỉ được phép mượn tối đa ${maxBooksAllowed} cuốn sách cùng lúc.`,
                    confirmButtonColor: '#764ba2'
                });
                return false;
            }

            // 2. Kiểm tra số lượng tồn kho
            const currentQtyInCart = this.getQuantityInCart(book._id);
            if (currentQtyInCart >= book.soQuyenHienTai) {
                Swal.fire({
                    icon: 'error',
                    title: 'Hết sách!',
                    text: `Thư viện chỉ còn ${book.soQuyenHienTai} cuốn sách này.`,
                    confirmButtonColor: '#d33'
                });
                return false;
            }

            // 3. Thêm vào giỏ hoặc tăng số lượng
            const existingItem = this.items.find(item => item._id === book._id);
            if (existingItem) {
                existingItem.soLuongMuon += 1;
            } else {
                // Tạo bản sao của book và thêm trường soLuongMuon
                this.items.push({ ...book, soLuongMuon: 1 });
            }
            
            Swal.fire({
                icon: 'success',
                title: 'Đã thêm!',
                text: `Đã thêm "${book.tenSach}" vào giỏ sách.`,
                toast: true, position: 'top-end', showConfirmButton: false, timer: 1500
            });
            return true;
        },

        // Xóa 1 cuốn khỏi giỏ (Giảm số lượng, nếu = 0 thì xóa hẳn)
        decreaseQuantity(bookId) {
            const existingItem = this.items.find(item => item._id === bookId);
            if (existingItem) {
                existingItem.soLuongMuon -= 1;
                if (existingItem.soLuongMuon <= 0) {
                    this.removeFromCart(bookId);
                }
            }
        },

        // Xóa hẳn 1 tựa sách khỏi giỏ (Bất kể số lượng)
        removeFromCart(bookId) {
            this.items = this.items.filter(item => item._id !== bookId);
        },

        // Xóa toàn bộ giỏ hàng
        clearCart() {
            this.items = [];
        }
    },
    persist: true 
});