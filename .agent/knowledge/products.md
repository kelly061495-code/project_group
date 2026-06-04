# 產品知識庫 Products

此知識庫為 MCP 推薦系統 (Agent Framework) 的基礎理解層。詳細的產品 JSON 資料由 `data.js` 提供並由 `product.js` 封裝，而本文件定義其**設計規範**與**AI 推薦邏輯關聯**。

## 產品物件結構 (Data Model)
每件商品結構如下：
- `id`: 商品編號 (例如 `prod_001`)
- `name_zh` / `name_en`: 商品中英文名稱
- `category`: 所屬分類 (如 `shirts`, `pants`)
- `price` / `compare_price`: 售價與特價標籤 (原價)
- `style_tags`: 風格標籤陣列，用於 AI 推薦與用戶搜尋，例如 `["Techwear", "Oversized"]`
- `material`: 材質成分，作為進階洗滌或天氣匹配資訊
- `description_zh`: 產品特點詳細描述
- `sizes`: 可選尺寸清單陣列
- `size_chart`: 掛載 `sizing.md` 中的專屬參考表 (Top / Pant)
- `is_preorder`: 布林值 (true)，代表預購區商品
- `available_date`: 若為預購，則標記預計出貨日期 (如 "2026-04-05")

## AI 推薦演算法矩陣分析 (MCP Logic)

TRENDY MALL 將所有商品切分為四大核心主打系列。MCP 會在此架構下根據用戶輸入的「身高、體重 (BMI)」與「即時天氣 API」，進行條件過濾：

### 1. VOID 暗黑金屬系列
- **代表單品**：VOID 暗黑印花T、VOID 重磅連帽衫、VOID 銀色項鏈
- **風格標籤**：`Dark`, `Punk`
- **推薦情境**：適合喜愛酷炫冷調、氣溫偏低的季節 (多為重磅布料)。

### 2. TECH 戰術機能系列
- **代表單品**：STORM 機能風衣外套、MILITIA 機能工裝褲、PHANTOM 機能斜背包
- **風格標籤**：`Techwear`, `Cargo`, `Cyber`
- **推薦情境**：
  - **天氣**：雨天 (Rain) 或鋒面來襲時，因應防水抗風需求而推薦。
  - **身型**：立體剪裁與多口袋能有效強化份量感。

### 3. ESSENTIAL 極簡日常系列
- **代表單品**：MONO 純色長版T、KOREAN Soft Hoodie、TECH 機能彈性西褲
- **風格標籤**：`Minimal`, `Korean`
- **推薦情境**：適合 BMI 適中至偏低者 (提供韓系俐落線條)，晴天溫和氣候之最佳日常穿搭。

### 4. Y2K 千禧復古系列
- **代表單品**：Y2K 低腰牛仔褲、DENIM 復古丹寧外套
- **風格標籤**：`Y2K`, `Street`
- **推薦情境**：熱門社群穿搭，多為丹寧或金屬水洗做舊，無特定氣候限制。
