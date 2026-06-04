# MCP 推薦引擎技能 MCP Intelligence Engine

核心代理人能力：串接假 API 與使用決策樹演算法推論消費者購買方針。

## 雙引擎輸入維度
1. **氣候推論感知器 (`fetchWeather`)**
   - **實作方式**：隨機切換 `Sunny`, `Rainy`, `Cold`。
   - **衍生行為**：不同天氣賦予獨立的加權評分，比如 Rainy 時強制優先推薦 `Techwear` 標籤產品，Cold 時優先拉取 `jacket` 與 `hoodie`。
2. **身體質量指數分類器 (BMI Calculator)**
   - **數學公式**：`bmi = weight / ((height / 100)^2)`
   - **三階層分類法**：
     - `< 18.5` (偏瘦): 重心推向 `Oversized` 與 `Street` 來修飾單薄。
     - `>= 18.5 && <= 24` (標準): 泛用所有庫存商品，推薦 `Minimal`。
     - `> 24` (厚實): 著重 `Techwear` 硬挺線條，或者深色系 (`Dark`) 收縮視覺。

## 決策邏輯 (Decision Logic)
MCP-Server 收齊兩大維度後作交集，回傳一份 Payload，內容將包含：
- **`reasoning`**: 人工智慧 (Model) 模擬語氣吐出的分析段落（將在 UI 面板顯性展示）。
- **`items`**: `ProductModule.products` 經過濾後的子陣列，供外部渲染畫廊。
