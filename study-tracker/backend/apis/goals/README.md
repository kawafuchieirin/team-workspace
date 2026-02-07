# Goals API

目標管理の CRUD と進捗計算を提供する FastAPI アプリケーション。

## エンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| GET | /health | ヘルスチェック |
| GET | /api/v1/goals/ | 一覧取得 |
| POST | /api/v1/goals/ | 新規作成 |
| GET | /api/v1/goals/{goal_id} | 詳細取得 |
| PUT | /api/v1/goals/{goal_id} | 更新 |
| DELETE | /api/v1/goals/{goal_id} | 削除 |
| GET | /api/v1/goals/{goal_id}/progress | 進捗詳細 |

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

## 備考

- 進捗計算のために `study-tracker-records` テーブルも参照する
- `records_table_name` 環境変数で records テーブル名を設定可能
