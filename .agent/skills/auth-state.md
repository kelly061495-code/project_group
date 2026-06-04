# 多元身份維持技能 Auth State Management

這個能力定義了 TRENDY Application 該如何處理狀態持久化（Persistence），同時避免不同使用者間的資料污染。

## 虛擬資料庫 Storage 庫表設計
為取代傳統大型後端，前台共需維護兩大集合體：
1. **`trendy_v3_users`** (Dictionary):
   - Key: 使用者信箱 (Email) 
   - Value: `{ name, email, pass, spending }`
   - *技能特徵*：負責儲存跨 Session 的歷史紀錄，防止登出後被「還原初始狀態」或「惡意註冊洗白」。
2. **`trendy_v3_state`** (JSON stringified object):
   - 負責追蹤 **當下瀏覽器操作** (Current Session Context)。
   - 包含 `user` (只引用目前的登入帳號片段), `cart` (當前未結帳), `orders` (全站訂單), `wishlist`。

## 讀寫注入流
- 上層組件 (`App.js`) 提供 `saveUsers` 與 `loadUsers` 直接與 Storage 對接，充當 ORM 或 Data Access Object。
- 當用戶登入與註冊時，會存取 `trendy_v3_users` 確認唯一性。若驗證成功，則將資訊「克隆」一份放入 `this.state.user` 啟動使用環境。

## 登出清除法
- 調用 `this.state.user = null` 清空 Context 並覆寫 `trendy_v3_state`。但 `trendy_v3_users` 資料庫中的累計消費不動如山。
