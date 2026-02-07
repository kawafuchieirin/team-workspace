# Team Workspace

チーム開発用ワークスペース。複数のプロジェクトを格納する構成です。

## ディレクトリ構成

```
team-workspace/
├── .github/          # GitHub テンプレート
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── agents/           # AIエージェント定義
├── workflows/        # 開発ワークフロー定義
├── templates/        # 引き継ぎ・レビュー用テンプレート
├── study-tracker/    # 学習管理アプリ（プロジェクト）
└── README.md
```

## プロジェクト

### Study Tracker（学習管理アプリ）

学習時間の記録・可視化、目標設定・進捗管理ができる個人向け学習管理アプリです。

| 項目 | 内容 |
|------|------|
| 場所 | `study-tracker/` |
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend | Python 3.14 + FastAPI + Poetry |
| DB | DynamoDB (開発: DynamoDB Local) |

## demo
[screenshot 2026-02-07 9.50.28-1.mov.zip](https://github.com/user-attachments/files/25140920/screenshot.2026-02-07.9.50.28-1.mov.zip)
わからない場合は上記をダウンロードして手順を確認下さい

#### クイックスタート

```
git clone https://github.com/kawafuchieirin/team-workspace.git
```
```
cd team-workspace
```
```bash
cd study-tracker
```
```
make up
```

※windowsの方は、ディレクトリの移動コマンドは異なります。

| サービス | URL | 説明 |
|---------|-----|------|
| Frontend | http://localhost:5173 | React アプリ |
| Records API | http://localhost:8001 | 学習記録 FastAPI |
| Goals API | http://localhost:8002 | 目標管理 FastAPI |
| DynamoDB Admin | http://localhost:8003 | DynamoDB テーブル確認用 |

詳細は [`study-tracker/README.md`](./study-tracker/README.md) を参照してください。

## 開発ガイドライン

- 新規プロジェクトは専用ディレクトリを作成し、独自の`README.md`を配置
- プロジェクト固有のコマンドやアーキテクチャは各プロジェクトのドキュメントを参照


