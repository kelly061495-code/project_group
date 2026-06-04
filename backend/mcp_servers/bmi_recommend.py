import sys
import json

def calculate_bmi(height_cm, weight_kg):
    height_m = height_cm / 100
    return weight_kg / (height_m * height_m)

def get_recommendation(height, weight, budget, styles=None, temp=25.0):
    bmi = calculate_bmi(height, weight)
    
    # 決定尺碼
    if bmi < 18.5:
        size = "S"
        category = "過輕"
    elif bmi < 24:
        size = "M"
        category = "正常"
    else:
        size = "L"
        category = "極致寬鬆"

    # 氣候感知邏輯
    weather_note = f"偵測到當前氣溫為 {temp}度，"
    if temp > 25:
        weather_note += "天氣偏熱，建議搭配透氣排汗系列。"
    else:
        weather_note += "體感微涼，建議選擇重磅或具備層次感的單品。"

    # 模擬推薦邏輯
    recommended_items = ["prod_001", "prod_005", "prod_010", "prod_015", "prod_020", "prod_024"]
    
    return {
        "bmi": round(bmi, 2),
        "category": category,
        "sizes": {"top": size, "pant": "32" if size=="M" else "34"},
        "items": recommended_items,
        "note": f"{weather_note} 您的 BMI 為 {round(bmi, 1)}，建議選擇 {size} 碼。",
        "source": "mcp-python-server"
    }

def main():
    # 簡易的 stdio JSON-RPC 模擬 (MCP 協定基礎)
    for line in sys.stdin:
        try:
            request = json.loads(line)
            if request.get("method") == "tools/call":
                name = request["params"]["name"]
                args = request["params"]["arguments"]
                
                if name == "bmi_recommend":
                    result = get_recommendation(
                        args.get("height"), 
                        args.get("weight"), 
                        args.get("budget", 5000),
                        args.get("styles", []),
                        args.get("temp", 25.0)
                    )
                    response = {
                        "jsonrpc": "2.0",
                        "id": request.get("id"),
                        "result": {"content": [{"type": "text", "text": json.dumps(result)}]}
                    }
                    print(json.dumps(response), flush=True)
        except Exception as e:
            pass

if __name__ == "__main__":
    main()
