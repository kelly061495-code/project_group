# 優惠碼與折扣系統 Discount System

系統支援結帳時由使用者自行輸入優惠碼進行折抵。
程式邏輯會自動偵測購物車的「小計 (Subtotal)」是否達到「最低消費門檻 (Min)」，並防呆阻止無效輸入。

## 支援優惠碼列表

| 代碼 (Code) | 折扣類型 (Type) | 數值設定 | 啟動門檻 (Min spend) | 其他限制 / 上限 | 官方說明 |
| --- | --- | --- | --- | --- | --- |
| `WELCOME10` | 百分比 (`percent`) | -10% | 無低消限制 | 折抵上限金: NT$ 500 | 新會員專屬，首單立刻享受 9 折福利。 |
| `SAVE300` | 固定額 (`fixed`) | -NT$ 300 | 小計滿 NT$ 3,000 | 無 | 滿 NT$ 3,000 折 NT$ 300 |
| `VIP500` | 固定額 (`fixed`) | -NT$ 500 | 小計滿 NT$ 5,000 | 無 | 滿 NT$ 5,000 折 NT$ 500 |
| `FREESHIP` | 運費抵免 (`free_shipping`) | -NT$ 150 | 無低消限制 | 無 | 立即減免全額標準宅配費 NT$ 150。 |


---

> [!NOTE]
> 關於折扣的程式計算邏輯與防呆驗證規範，請參閱：[.agent/rules/discount-rules.md](file:///.agent/rules/discount-rules.md)
