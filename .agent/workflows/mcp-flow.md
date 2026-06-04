---
description: MCP伺服器智能推薦作業流
---

# 智能推薦決策流 (MCP Flow)

MCP (Model Context Protocol) 推薦系統旨在提供精準的服飾風格客製化體驗。

1. **資料喚起 (Invoke Intent)** 
   - 點擊「智慧服飾推薦」，彈出包含輸入框的覆蓋模態框 (`#recommend-modal`)。
   - 要求使用者填入 `身長` 與 `體重`，利用 HTML 表單原生的 `min` / `max` 約束（配合驗證規範限制極端亂碼）。
2. **點擊驅動 (Process)**
   - 呼叫 `processRecommendation()`。
   - 計算使用者的 BMI 質 `weight / ((height / 100) ** 2)`。
3. **異步感測 (Context fetching)**
   - 調用模擬 `MCPServer.fetchWeather()` API 取得環境狀態。
4. **模型邏輯解析 (Resolution)**
   - 參照 `.agent/skills/mcp-engine.md` 邏輯，篩選出配對清單 (`items`) 以及一段生成的文案解析 (`reasoning`)。
5. **結果呈現 (Output Render)**
   - 隱藏輸入欄位，替換出專屬的結果區塊（黑底反白文字說明），並排滿動態產生的衣服卡片供其再點擊並進入購買流程。
