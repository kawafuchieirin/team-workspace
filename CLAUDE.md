# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ワークスペース概要

チーム開発用のワークスペースリポジトリ。AIエージェントチームによる開発ワークフローを備え、複数のプロジェクトを格納する構成。

## AIエージェントチーム

本リポジトリにはClaude Code用のAIエージェントチームが構成されている。各エージェントはMarkdownプロンプトとして定義され、`--system-prompt` オプションで起動する。

### エージェント一覧

| エージェント | ファイル | 責務 |
|-------------|---------|------|
| PM | `agents/pm.md` | 要件分析・タスク分解・進捗管理・最終レビュー |
| Frontend Engineer | `agents/frontend-engineer.md` | UIコンポーネント・状態管理・API統合 (React/TypeScript) |
| Backend Engineer | `agents/backend-engineer.md` | API設計・DB設計・ビジネスロジック (FastAPI/Python) |
| Tester | `agents/tester.md` | テスト計画・テスト実装・バグ報告 |
| Security Engineer | `agents/security-engineer.md` | OWASP Top 10監査・依存関係監査・脆弱性報告 |

### エージェントの起動方法

```bash
# PMにタスク分解を依頼
claude --system-prompt "$(cat agents/pm.md)" "要件を入力"

# Frontend Engineer にタスクを割り当て
claude --system-prompt "$(cat agents/frontend-engineer.md)" "タスク内容"

# Backend Engineer にタスクを割り当て
claude --system-prompt "$(cat agents/backend-engineer.md)" "タスク内容"

# Tester にテスト検証を依頼
claude --system-prompt "$(cat agents/tester.md)" "テスト対象の説明"

# Security Engineer に監査を依頼
claude --system-prompt "$(cat agents/security-engineer.md)" "監査対象の説明"
```

### ワークフロー

| ワークフロー | ファイル | 用途 |
|-------------|---------|------|
| 機能開発 | `workflows/feature-development.md` | 新機能開発の標準フロー |
| バグ修正 | `workflows/bug-fix.md` | バグ報告から修正完了までのフロー |

### テンプレート

| テンプレート | ファイル | 用途 |
|-------------|---------|------|
| タスク割り当て | `templates/task-assignment.md` | PMが各エンジニアにタスクを渡す統一フォーマット |
| 引き継ぎレポート | `templates/handoff-report.md` | エージェント間で成果物を引き継ぐフォーマット |
| レビューチェックリスト | `templates/review-checklist.md` | PMの最終レビュー用チェックリスト |

### 典型的な機能開発の流れ

```
ユーザー要件 → [PM] 要件分析・タスク分解
                  ├→ [Frontend] UI実装（並行）
                  └→ [Backend] API実装（並行）
              → [PM] 統合確認
              → [Tester] テスト検証
              → [Security] セキュリティ監査
              → [PM] 最終レビュー・リリース判定
```

## ディレクトリ構成

```
team-workspace/
├── agents/                        # エージェント定義
│   ├── pm.md
│   ├── frontend-engineer.md
│   ├── backend-engineer.md
│   ├── tester.md
│   └── security-engineer.md
├── workflows/                     # ワークフロー定義
│   ├── feature-development.md
│   └── bug-fix.md
├── templates/                     # テンプレート
│   ├── task-assignment.md
│   ├── handoff-report.md
│   └── review-checklist.md
└── CLAUDE.md
```

## プロジェクト別の作業

各プロジェクトが追加された際は、該当プロジェクトのディレクトリ内に独自の`CLAUDE.md`や`README.md`を配置し、プロジェクト固有の指示（ビルド方法、テスト実行、アーキテクチャ等）を記載すること。
