# 優惠碼運算規範 Discount Rules

本系統 (`app.js`) 支援在結帳區動態套用優惠碼，運算規則遵循以下邏輯與防呆。

## 運算流程
1. **輸入捕捉**：獲取用戶輸入的字串，透過 `.trim().toUpperCase()` 標準化。
2. **存在性檢查**：比對 `OrderModule.discountCodes` 字典，若無此鍵則報錯「無效的優惠碼」。
3. **低消門檻 (Min Spend)**：
   - 獲取購物車當前小計 (`subtotal`)。
   - 若優惠碼定義了 `min` 參數且 `subtotal < min`，則攔截並報錯：「需滿 NT$ [min] 使用」。
4. **折扣換算 (Discount Value)**：
   - 若 `type === 'percent'`：`Math.floor(subtotal * (value / 100))`
   - 否則直接拿定額 `value` 型態。
5. **折抵上限 (Cap)**：
   - 若折扣碼具備 `max` 屬性且計算出的折價 > `max`，則將折價強制抑制為 `max`。
6. **最終金額保護**：
   - 結帳最終金額公式為：`Math.max(0, subtotal - discountValue)`。
   - 保護訂單金額不出現負數。

## 狀態管理
- 目前套用的優惠碼儲存於 `this.state.activeDiscount = { code, val }`。
- 一旦下單 (`placeOrder`) 成功，必須主動將其清空 (`null`)，防止下一筆訂單誤套用。
