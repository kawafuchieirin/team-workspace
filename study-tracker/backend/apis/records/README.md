# Records API

学習記録の CRUD と統計データを提供する FastAPI アプリケーション。

## エンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| GET | /health | ヘルスチェック |
| GET | /api/v1/records/ | 一覧取得 |
| POST | /api/v1/records/ | 新規作成 |
| GET | /api/v1/records/{record_id} | 詳細取得 |
| PUT | /api/v1/records/{record_id} | 更新 |
| DELETE | /api/v1/records/{record_id} | 削除 |
| GET | /api/v1/records/stats/summary | 統計サマリー |
| GET | /api/v1/records/stats/calendar | カレンダーデータ |

## 開発

```bash
# 依存関係インストール
poetry install

# テスト実行
make test

# Docker で起動
make up

# OpenAPI 仕様生成
make generate-spec
```
