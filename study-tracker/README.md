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
| Backend | Python + FastAPI + Pydantic |
| DB | DynamoDB (開発: DynamoDB Local) |
| グラフ | Recharts |
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
| Backend | http://localhost:8000 | FastAPI |
| API Docs | http://localhost:8000/docs | Swagger UI |
| DynamoDB Admin | http://localhost:8002 | DynamoDB テーブル確認用 |

### 停止

```bash
make down
```

## 開発

### テスト実行

```bash
# バックエンドテスト
make test-backend

# フロントエンドテスト
make test-frontend

# 全テスト
make test
```

### ログ確認

```bash
make logs           # 全サービス
make logs-backend   # バックエンドのみ
make logs-frontend  # フロントエンドのみ
```

## API

### 学習記録

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/v1/records/` | 一覧取得 (date_from, date_to, subject でフィルタ) |
| POST | `/api/v1/records/` | 新規作成 |
| GET | `/api/v1/records/{record_id}` | 詳細取得 |
| PUT | `/api/v1/records/{record_id}` | 更新 |
| DELETE | `/api/v1/records/{record_id}` | 削除 |
| GET | `/api/v1/records/stats/summary` | 統計サマリー |
| GET | `/api/v1/records/stats/calendar` | カレンダーデータ |

### 目標

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/v1/goals/` | 一覧取得 (status でフィルタ) |
| POST | `/api/v1/goals/` | 新規作成 |
| GET | `/api/v1/goals/{goal_id}` | 詳細取得 |
| PUT | `/api/v1/goals/{goal_id}` | 更新 |
| DELETE | `/api/v1/goals/{goal_id}` | 削除 |
| GET | `/api/v1/goals/{goal_id}/progress` | 進捗詳細 |

## ディレクトリ構成

```
study-tracker/
├── docker-compose.yml
├── Makefile
├── README.md
├── CLAUDE.md
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   ├── config.py
│   ├── dependencies.py
│   ├── routers/          # APIルーター
│   ├── schemas/          # リクエスト/レスポンスモデル
│   ├── services/         # ビジネスロジック
│   ├── models/           # DynamoDB接続
│   └── tests/            # バックエンドテスト
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── pages/        # ページコンポーネント
        ├── components/   # UIコンポーネント
        ├── hooks/        # カスタムフック
        ├── services/     # API呼び出し
        ├── types/        # 型定義
        └── utils/        # ユーティリティ
```
