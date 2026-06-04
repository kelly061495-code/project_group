import { DISCOUNT_CODES } from './data.js';

export const OrderModule = {
    cart: [],
    orders: [],
    discountCodes: DISCOUNT_CODES,

    init() {
        const saved = localStorage.getItem('trendy_v3_state');
        if (saved) {
            const data = JSON.parse(saved);
            this.cart = data.cart || [];
            this.orders = data.orders || [];
        }
    },

    save() {
        const current = JSON.parse(localStorage.getItem('trendy_v3_state') || '{}');
        localStorage.setItem('trendy_v3_state', JSON.stringify({
            ...current,
            cart: this.cart,
            orders: this.orders
        }));
    },

    addToCart(product, size, qty = 1) {
        // 防呆: 數量檢測
        if (isNaN(qty) || qty <= 0) {
            throw new Error("數量輸入不正確，請輸入數字");
        }

        const existing = this.cart.find(item => item.id === product.id && item.size === size);
        if (existing) {
            existing.qty += qty;
        } else {
            this.cart.push({ id: product.id, size, qty, price: product.price, name: product.name_zh });
        }
        this.save();
    },

    calculateSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    },

    // 實作 .agent/rules/shipping.md 中定義的規則
    calculateShipping(subtotal, userTierId = 'star') {
        // 金星(gold)與鑽石(diamond)會員享有無條件免運
        if (userTierId === 'gold' || userTierId === 'diamond') return 0;

        // 一般配送規則：滿 2000 免運，否則 150
        if (subtotal >= 2000) return 0;
        return 150;
    },

    validateOrder(form) {
        // 嚴格遵守防呆規範
        if (!form.name || form.name.length < 2) return "請輸入正確姓名";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Email 格式無效";
        if (!form.phone || !/^09\d{8}$/.test(form.phone)) return "手機格式錯誤 (應為 09xxxxxxxx)";
        if (!form.address) return "請填寫配送地址";
        return null;
    }
};
