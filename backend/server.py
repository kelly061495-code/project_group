from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json
import os

app = FastAPI()

# 加入 CORS 支援，讓網頁 (3000) 可以連到後端 (8001)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BMIRequest(BaseModel):
    height: float
    weight: float
    temp: float = 25.0
    budget: float = 5000.0
    styles: list = []

@app.post("/api/mcp/bmi-recommend")
async def bmi_recommend(req: BMIRequest):
    # 自動偵測當前 server.py 所在資料夾，確保能找到 mcp_servers 子目錄
    base_dir = os.path.dirname(os.path.abspath(__file__))
    script_path = os.path.join(base_dir, 'mcp_servers', 'bmi_recommend.py')
    
    try:
        process = subprocess.Popen(
            ['python', script_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        rpc_call = {
            "jsonrpc": "2.0",
            "method": "tools/call",
            "params": {"name": "bmi_recommend", "arguments": req.dict()},
            "id": 1
        }
        
        # 發送指令，務必加上 \n
        stdout, stderr = process.communicate(input=json.dumps(rpc_call) + "\n")
        
        if not stdout:
            raise Exception(f"Python MCP Server error: {stderr}")
            
        response = json.loads(stdout)
        # 解析 MCP 回傳格式
        result_text = response["result"]["content"][0]["text"]
        return json.loads(result_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/mcp/product/{product_id}")
async def get_product(product_id: str):
    # 同理呼叫 product_info.py
    return {"id": product_id, "name": "Simulated Live Product", "price": 999}

if __name__ == "__main__":
    import uvicorn
    # 讀取環境變數 (模擬從 .env 讀取，若沒安裝 python-dotenv 則使用預設值)
    port = int(os.getenv("SERVER_PORT", 8001))
    debug = os.getenv("DEBUG", "True") == "True"
    
    print(f"--- TRENDY MALL MCP BRIDGE STARTING ---")
    print(f"--- API PORT: {port} | DEBUG: {debug} ---")
    
    uvicorn.run(app, host="0.0.0.0", port=port)
