# 結帳演算法技能 Order Calculator

負責掌管商品加入購物車後，直至轉為最終訂單 (`this.state.orders.push(o)`) 之間的計算邏輯。

## 技能模組分解
1. **購物車小計算 (Subtotal)**
   - 使用陣列聚合 (`reduce`)：`this.state.cart.reduce((sum, item) => sum + (product.price * item.qty), 0)`。
2. **優惠計算與容錯**
   - 從外部傳入 `activeDiscount` 物件（`{ code, val }`）。
   - 保險起見：若找不到 `activeDiscount`，折扣扣發 0。
3. **最終金額收斂**
   - 透過 `Math.max(0, subtotal - discountValue)` 強制修正極端情況，確保 `Total >= 0`。
4. **訂單實體化 (Hydration)**
   - 調用 `Date.now()` 搭配 `ORD-` 組成唯一訂單編號。
   - 保留該當下 (`...this.state.cart`) 的購買足跡而非傳參考拷貝（使用 `[...array]` 展開賦值）。
5. **重製清空**
   - 推送成功後，必須初始化 `this.state.cart = []` 及 `this.state.activeDiscount = null`。
