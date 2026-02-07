"""OpenAPI仕様をJSON形式で出力する"""
import json

from main import app

if __name__ == "__main__":
    spec = app.openapi()
    print(json.dumps(spec, indent=2, ensure_ascii=False))
