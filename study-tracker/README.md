# Study Tracker - 学習管理アプリ

学習時間の記録・可視化、目標設定・進捗管理ができる個人向け学習管理アプリです。

## 機能

- **学習記録**: 科目・学習時間・メモを記録。日付やフィルタで一覧表示
- **カレンダー**: 月別ヒートマップで学習量を可視化。日付クリックで詳細表示
- **ダッシュボード**: 統計サマリー・科目別内訳・学習時間推移グラフ
- **目標管理**: 目標時間を設定し、学習記録との紐づけで進捗を自動計算

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend | Python + FastAPI + Pydantic (マイクロサービス構成) |
| DB | DynamoDB (開発: DynamoDB Local) |
| グラフ | Recharts |
| パッケージ管理 | Poetry (Backend) / npm (Frontend) |
| テスト | pytest + moto / Vitest + React Testing Library |
| 開発環境 | Docker Compose |

## セットアップ

### 前提条件

- Docker / Docker Compose

### 起動

```bash
cd study-tracker
make up
```

以下のサービスが起動します:

| サービス | URL | 説明 |
|---------|-----|------|
| Frontend | http://localhost:5173 | React アプリ |
| Records API | http://localhost:8001 | 学習記録 API (FastAPI) |
| Records API Docs | http://localhost:8001/docs | Swagger UI |
| Goals API | http://localhost:8002 | 目標 API (FastAPI) |
| Goals API Docs | http://localhost:8002/docs | Swagger UI |
| DynamoDB Admin | http://localhost:8003 | DynamoDB テーブル確認用 |

### 停止

```bash
make down
```

## 開発

### pre-commit（コード品質チェック）

コミット時に自動でコード品質チェックを実行します。

#### セットアップ

```bash
make pre-commit-install
```

#### 手動実行

```bash
# 全ファイルをチェック
make pre-commit-run

# フックを最新版に更新
make pre-commit-update
```

#### 実行されるチェック

| カテゴリ | チェック内容 |
|---------|-------------|
| 一般 | trailing-whitespace, end-of-file-fixer, check-yaml, check-json, check-merge-conflict, detect-private-key |
| Python (backend/) | Ruff (lint + format), MyPy (型チェック) |
| TypeScript (frontend/) | Prettier (フォーマット) |

### テスト実行

```bash
# Records API テスト
make test-records

# Goals API テスト
make test-goals

# バックエンド全テスト
make test-backend

# フロントエンドテスト
make test-frontend

# 全テスト
make test
```

### ログ確認

```bash
make logs           # 全サービス
make logs-records   # Records API のみ
make logs-goals     # Goals API のみ
make logs-frontend  # フロントエンドのみ
```

### サービス再起動

```bash
make restart           # 全サービス
make restart-records   # Records API のみ
make restart-goals     # Goals API のみ
make restart-frontend  # フロントエンドのみ
```

### OpenAPI 仕様書生成

```bash
make generate-spec
```

## API

### Records API (http://localhost:8001)

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/health` | ヘルスチェック |
| GET | `/api/v1/records/` | 一覧取得 (date_from, date_to, subject でフィルタ) |
| POST | `/api/v1/records/` | 新規作成 |
| GET | `/api/v1/records/stats/summary` | 統計サマリー |
| GET | `/api/v1/records/stats/calendar` | カレンダーデータ |
| GET | `/api/v1/records/{record_id}` | 詳細取得 |
| PUT | `/api/v1/records/{record_id}` | 更新 |
| DELETE | `/api/v1/records/{record_id}` | 削除 |

### Goals API (http://localhost:8002)

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/health` | ヘルスチェック |
| GET | `/api/v1/goals/` | 一覧取得 (status でフィルタ) |
| POST | `/api/v1/goals/` | 新規作成 |
| GET | `/api/v1/goals/{goal_id}` | 詳細取得 |
| GET | `/api/v1/goals/{goal_id}/progress` | 進捗詳細 |
| PUT | `/api/v1/goals/{goal_id}` | 更新 |
| DELETE | `/api/v1/goals/{goal_id}` | 削除 |

## ディレクトリ構成

```
study-tracker/
├── docker-compose.yml
├── Makefile
├── README.md
├── CLAUDE.md
├── backend/
│   └── apis/
│       ├── records/              # 学習記録 API
│       │   ├── Dockerfile
│       │   ├── pyproject.toml    # Poetry 依存関係
│       │   ├── main.py           # FastAPI アプリ
│       │   ├── handler.py        # ルーター・ビジネスロジック
│       │   └── tests/            # pytest テスト
│       └── goals/                # 目標 API
│           ├── Dockerfile
│           ├── pyproject.toml    # Poetry 依存関係
│           ├── main.py           # FastAPI アプリ
│           ├── handler.py        # ルーター・ビジネスロジック
│           └── tests/            # pytest テスト
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── App.tsx           # ルーティング定義
        ├── pages/            # ページコンポーネント
        ├── components/
        │   ├── common/       # 汎用 UI (Button, Card, Modal 等)
        │   ├── features/     # 機能別コンポーネント
        │   └── layout/       # レイアウト (Header, Sidebar)
        ├── hooks/            # カスタムフック
        ├── services/         # API 呼び出し
        ├── types/            # TypeScript 型定義
        └── utils/            # ユーティリティ
```

## DynamoDB テーブル

| テーブル名 | PK | SK | GSI |
|-----------|----|----|-----|
| study-tracker-records | user_id | record_id | date-index (user_id, study_date) |
| study-tracker-goals | user_id | goal_id | status-index (user_id, status) |

## 注意事項

- 認証は未実装。各 API の `get_user_id()` で固定ユーザー ID を返している
- DynamoDB Local はインメモリモードのため、コンテナ再起動でデータがリセットされる
