import sys
import json

# 模擬產品資料庫 (與 data.js 保持一致)
PRODUCT_DB = {
    "prod_001": {"name": "ECLIPSE Oversized Tee", "price": 1280, "stock": 15},
    "prod_003": {"name": "NEO TOKYO Snapback Cap", "price": 1980, "stock": 5},
    "prod_008": {"name": "STORM Tech Shell", "price": 4880, "stock": 8, "preorder": True}
}

def main():
    for line in sys.stdin:
        try:
            req = json.loads(line)
            if req.get("method") == "tools/call":
                name = req["params"]["name"]
                args = req["params"]["arguments"]
                
                if name == "get_product":
                    p_id = args.get("product_id")
                    result = PRODUCT_DB.get(p_id, {"error": "Product not found"})
                    
                elif name == "list_products":
                    result = list(PRODUCT_DB.values())
                
                response = {
                    "jsonrpc": "2.0",
                    "id": req.get("id"),
                    "result": {"content": [{"type": "text", "text": json.dumps(result)}]}
                }
                print(json.dumps(response), flush=True)
        except:
            pass

if __name__ == "__main__":
    main()
