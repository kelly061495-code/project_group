---
description: 購物車與結帳作業流
---

# 購物車結帳工作流 (Checkout Flow)

此工作流涵蓋使用者從商品頁點選，直到訂單產生入庫的各個階段。

1. **商品檢視與選尺寸 (Product Selection)**
   - 使用者瀏覽首頁或商城列表，點擊發動 `openModal(id)`。
   - 瀏覽畫廊，必須選擇一項 `size` 否則會觸發防呆。
   - 點擊「放入購物車」，觸發 `App.addCart()` -> 呼叫 `OrderModule.addToCart()` 寫入。

2. **抽屜管理 (Cart Drawer Toggle)**
   - 點選右上角圖標直接呼叫 `toggleCart()` 滑出。
   - 更改 `-` 或 `+` 將觸發 `updateQty()` 重算數字與 UI。

3. **登入閘門卡控 (Login Gate)**
   - 若使用者在抽屜內點選「前往結帳系統」，會觸發條件分支。
   - **攔截檢查**：若不是會員 (`!this.state.user`)，將發送警告「為了給您完整的會員福利...」，並中斷且前往登入視窗。

4. **結帳表單填寫 (Checkout Validation)**
   - 使用者到達 `renderCheckout` 畫面。利用 `user` 物件預先載入 `name` 與 `email` 欄位。
   - 填寫剩餘配送資料，可於下方反覆測試優惠碼 (`applyDisc`)。
   - 點擊「確認下單訂購」。

5. **系統扣整處理 (Order Processing)**
   - `placeOrder()` 接手。對表單運行 `.agent/rules/form-validation.md`。
   - 總計加權進用戶 `spending` 並調用 `saveUsers` 保留進度。
   - 生成 ORD UUID，把購物車放入 `orders` 歷史紀錄，最後轉跳至 `renderConfirmed` 的感謝畫面。
