# 📱 行動 App 開發期末專題：TRENDY APPAREL MALL (潮流服飾商城)

## 👤 一、 組隊資訊

| 項目 | 內容 |
|:--|:--|
| **專題主題** | 2. 潮流服飾商城 (Apparel Fashion Store) |
| **專案成員** | **洪駿宥** (主掌採購與資料架構) 、 **邱渝璇** (主掌 UI 設計與 MCP 系統整合) |
| **組別人數** | 2 人組 |
| **功能達成度** | 核心 2 大模組 + 加分區 8 項 (完成) |
| **系統版本** | Standalone Modular v3.0 (高解構模組化) |

---

## 🚀 二、 核心功能需求達成 (基礎 2 大模組)

本專案已完全落實「天下茶屋」課程所學之元件化與模組化思維：

1. **產品模組 (Product Module)** 
   - 產品型錄展示、動態載入 `.agent/knowledge` 領域的知識庫與 `data.js` 檔案庫。
   - 產品詳細資料頁面 (多圖視角切換、尺寸指南)。
   - **防呆檢測**：加入購物車前必須選擇尺寸，否則系統會嚴格攔截 (詳見 `.agent/rules/form-validation.md`)。
2. **採購模組 (Order Module)**
   - 包含購物車 (Cart) 管理，可隨時側邊滑出增減數量，並動態計算小計與套用特價。
   - 結帳訂單產出，並落實 **嚴格表單防呆檢測**：Email 需符合正規表示法 (Regex)、姓名不得小於 2 字元、手機必須為 09 開頭 10 碼，否則退回提交。

---

## 🌟 三、 加分項目清單 (已完成 8 項)

為打造極致完整度之專案，本組挑戰實作了以下加分功能（遠超 2 人組基礎門檻要求）：

| 項次 | 對應加分清單分類 | 實作細節說明 | 運作位置 / 檔案 |
|:--|:--|:--|:--|
| 1 | **[功能面] 會員模組** | 實作登入、註冊表單。導入 Client-side 資料庫機制 `trendy_v3_users`，避免重複註冊，並防呆密碼與 Email 長度。 | `app.js` (login, register) |
| 2 | **[功能面] 歷史訂單查詢** | 會員中心 (Account) 頁面可瀏覽過往包含 UUID 單號、購買總數與總額的歷史紀錄。 | `app.js` (renderAccount) |
| 3 | **[功能面] 優惠碼/折扣** | 實作百位與百分比計算邏輯。結帳時輸入 `SAVE300` (滿3000折300)、`WELCOME10` (9折)。 | `order.js`, `.agent/rules/discount-rules.md` |
| 4 | **[功能面] 可同時採購多品項及數量** | 購物車能容納無上限的不同商品、同一商品的不同 Size，且能針對單品增減數量與金額運算。 | `js/app.js`, `js/order.js` |
| 5 | **[功能面] 預購商品模組** | 實作獨立「預購專區」，且商品卡片自動貼上「PREORDER」標籤，結帳時與現貨進行 UI 區隔。 | `index.html`, 首頁 Preorder 按鈕 |
| 6 | **[架構面] 採用 Agent 架構** | 落實將知識拆分。建立 `.agent/` 目錄並嚴格分類 `knowledge`, `rules`, `skills`, `workflows`，底層真實採用該邏輯開發。 | `.agent/*` 目錄全區 |
| 7 | **[技術面] MCP 實作 1** | **【MCP氣候感知推論】**：讀取外部模擬的天氣動態 API，配合使用者的體徵做「多條件重疊演算」來推薦款式。 | `js/mcp-server.js` |
| 8 | **[創新面] 其他功能(自行發想)** | **【終身累積制進度條】**：創新開發。結帳後總金額將永久累加於帳號，帶有進度條，用戶可由星級一路晉升至鑽石會員。 | `.agent/rules/membership-rules.md` |

---

## 📂 四、 檔案目錄結構與文件樹 (Tree)

完全遵守課程要求，**嚴禁單一檔案結構**，落實 UI、邏輯與知識的專業解構：

```text
TRENDY-APPAREL-MALL/
│
├── index.html              -> 應用入口 (Clean HTML5 Entry，無混寫 JS)
├── README.md               -> 本文件 (期末報告與組員說明)
├── 操作手冊.html           -> API 與架設說明文件
├── .env                    -> 系統環境變數配置
│
├── css/
│   └── main.css            -> 全站精品視覺、動畫與響應式定義
│
├── js/                     -> 模組化邏輯層 (Controller & Services)
│   ├── app.js              -> 主控邏輯、網頁路由與渲染引擎
│   ├── data.js             -> 代理人架構之底層知識庫對接點 (Database)
│   ├── product.js          -> 產品資料、搜尋邏輯與過濾篩選
│   ├── order.js            -> 採購邏輯、優惠碼運算與表單防呆驗證
│   └── mcp-server.js       -> MCP 氣候感知推薦引擎 (AI Simulation)
│
├── .agent/                 -> 【完全吻合 Agent 架構】知識分離區
    ├── persona.md          -> 系統人格與使命宣告
    │
    ├── knowledge/          -> 網頁底層呈現資料之 Markdown 化 (Ground Truth)
    │   ├── categories.md   -> 產品大分類矩陣
    │   ├── discounts.md    -> 優惠碼資料項目 (單一資料源)
    │   ├── info-pages.md   -> 配送與退換貨政策資訊
    │   ├── membership.md   -> 四階段會員階級與福利說明
    │   ├── preorder.md     -> 預購政策與說明
    │   ├── products.md     -> 商品屬性與 Agent 推薦矩陣
    │   ├── sizing.md       -> 尺寸數據對照表
    │   └── style-tags.md   -> 風格標籤與 MCP 關聯定義
    │
    ├── rules/              -> 商業規範與程式防呆法則 (SSOT)
    │   ├── discount-rules.md     -> 優惠運算與防負數規則
    │   ├── form-validation.md    -> 嚴格 Regex 表單驗證規範
    │   ├── membership-rules.md   -> 會員等級判定與累積邏輯
    │   └── preorder.md           -> 預購拆單與配送優先權規則
    │
    ├── skills/             -> 模組化程序宣告
    │   ├── auth-state.md         -> 會員資料庫防護與狀態持久化
    │   ├── mcp-engine.md         -> BMI 與氣候多維度運作技能
    │   └── order-calculator.md   -> 購物車精確運算技能
    │
    └── workflows/          -> 互動路徑 SOP
        ├── auth-flow.md          -> 會員驗證工作流
        ├── checkout-flow.md      -> 購物結帳作業流
        └── mcp-flow.md           -> 智能推薦作業流
```

### ✅ 開發規範遵守自評確認表：
- **落實基礎要求**：App 穩定不斷線，雙模組防呆成功，操作流暢。
- **落實文件規範**：依照 `期末報告.md` 指示，產出本 README 並釐清加分項目細節，且成員（洪駿宥、邱渝璇）標示明確。
- **Agent 結構真實性**：確保 `.agent/` 目錄內容與底層 JavaScript 邏輯一字不漏的互相輝映與印證（完全無 Hardcoding 欺騙）。
- **結構化開發**：全數解構 HTML、CSS、JS，已無「萬行神獸」單一檔案的違規情況。
