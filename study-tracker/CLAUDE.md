# Study Tracker - CLAUDE.md

## プロジェクト概要

個人向け学習管理アプリ。学習時間の記録・可視化、目標設定・進捗管理を行う。

## 技術スタック

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Python 3.14 + FastAPI + Pydantic + Poetry (Function-Based 構成)
- **DB**: DynamoDB (開発: DynamoDB Local)
- **テスト**: pytest + moto (Backend) / Vitest + React Testing Library (Frontend)
- **開発環境**: Docker Compose

## 開発コマンド

```bash
# 全サービス起動
make up

# 停止
make down

# ログ確認
make logs
make logs-records    # records-api のみ
make logs-goals      # goals-api のみ
make logs-frontend   # frontend のみ

# バックエンドテスト
make test-records    # records API テスト
make test-goals      # goals API テスト
make test-backend    # 全バックエンドテスト

# フロントエンドテスト
make test-frontend

# 全テスト
make test

# OpenAPI仕様生成
make generate-spec
```

## アーキテクチャ

### Backend (Function-Based FastAPI)

各APIは独立した FastAPI プロジェクトとして構成。個別にデプロイ・テスト・開発が可能。

```
backend/apis/
├── records/                    # 学習記録 API (port: 8001)
│   ├── pyproject.toml          # Poetry (Python >=3.14)
│   ├── Dockerfile
│   ├── docker-compose.yml      # 独立開発用
│   ├── Makefile
│   ├── main.py                 # FastAPI app + Settings + CORS + health
│   ├── handler.py              # Schemas + DynamoDB ops + Business logic + Routes
│   ├── generate_specification.py
│   └── tests/
│       ├── conftest.py
│       └── test_handler.py
└── goals/                      # 目標管理 API (port: 8002)
    ├── pyproject.toml
    ├── Dockerfile
    ├── docker-compose.yml      # 独立開発用
    ├── Makefile
    ├── main.py                 # Settings に records_table_name も含む
    ├── handler.py              # goals + records テーブルアクセス
    ├── generate_specification.py
    └── tests/
        ├── conftest.py
        └── test_handler.py
```

### Frontend (React + Vite)

```
frontend/src/
├── App.tsx              # ルーティング定義
├── pages/               # ページコンポーネント
├── components/
│   ├── common/          # 汎用UI (Button, Card, Modal, etc.)
│   ├── layout/          # レイアウト (Header, Sidebar)
│   └── features/        # 機能別コンポーネント
├── hooks/               # カスタムフック
├── services/            # API呼び出し
├── types/               # TypeScript型定義
└── utils/               # ユーティリティ
```

## ポート割り当て

| サービス | ポート | 説明 |
|---------|--------|------|
| frontend | 5173 | React + Vite |
| records-api | 8001 | 学習記録 FastAPI |
| goals-api | 8002 | 目標管理 FastAPI |
| dynamodb-local | 8000 | DynamoDB Local |
| dynamodb-admin | 8003 | DynamoDB Admin UI |

## API エンドポイント

### Records API (port: 8001)

- `GET /health` - ヘルスチェック
- `GET/POST /api/v1/records/` - 学習記録一覧・作成
- `GET/PUT/DELETE /api/v1/records/{record_id}` - 学習記録操作
- `GET /api/v1/records/stats/summary` - 統計サマリー
- `GET /api/v1/records/stats/calendar` - カレンダーデータ

### Goals API (port: 8002)

- `GET /health` - ヘルスチェック
- `GET/POST /api/v1/goals/` - 目標一覧・作成
- `GET/PUT/DELETE /api/v1/goals/{goal_id}` - 目標操作
- `GET /api/v1/goals/{goal_id}/progress` - 進捗詳細

## DynamoDB テーブル

- `study-tracker-records` - 学習記録 (PK: user_id, SK: record_id, GSI: date-index)
- `study-tracker-goals` - 目標 (PK: user_id, SK: goal_id, GSI: status-index)

## 注意事項

- 認証は未実装。各 handler.py の `get_user_id()` で固定ユーザーIDを返している
- 認証導入時は各 function の `get_user_id()` を差し替えるだけで対応可能
- DynamoDB Local はインメモリモードのため、コンテナ再起動でデータがリセットされる
- goals API は進捗計算のために records テーブルも参照する
