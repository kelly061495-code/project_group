---
description: 註冊與登入驗證工作流
---

# 會員驗證工作流 (Auth Flow)

這是使用者在應用程式中切換身份或首次註冊的標準程序。

1. **觸發彈窗 (Trigger Modal)**：使用者點選 Header 之圖示 (`<i data-lucide="user">`)。 
   - 系統將調用 `navigate('account')`。
   - 若偵測無登入之 `user`，系統攔截並顯示 `<div id="auth-modal">`。
2. **表單填寫 (Fill Details)**：
   - 使用者欲登入，則填入 `email` 與 `password` 並點擊「登入」。
   - 若為註冊，則透過 `toggleAuthMode('reg')` 切換畫面，補填 `name`。
3. **驗證與防呆 (Validation)**：
   - 參照 `.agent/rules/form-validation.md`。若出錯，中斷工作流並 `alert`。
4. **資料庫讀寫 (Database Transaction)**：
   - `loadUsers()` 拉出 JSON。
   - 確認合法後，將 `spending: 0` 的帳號存回，或者若登入，載入帳號內記錄的舊有 `spending` 值。
5. **啟動授權環境 (Boot Context)**：
   - 設定 `this.state.user = ...`，重新執行 `this.render()` 以切換到 `account` 總覽頁面。
