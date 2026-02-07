# 機能開発ワークフロー

新機能を開発する際の標準ワークフロー。PMが全体を統括し、各エージェントが役割に応じてタスクを実行する。

## フロー概要

```
ユーザー要件
    │
    ▼
[Phase 1] PM: 要件分析・タスク分解
    │
    ├──────────────────┐
    ▼                  ▼
[Phase 2a]          [Phase 2b]
Frontend:           Backend:
UI実装（並行）      API実装（並行）
    │                  │
    └──────────────────┘
    │
    ▼
[Phase 3] PM: 統合確認
    │
    ▼
[Phase 4] Tester: テスト検証
    │  ※バグ発見 → 担当エンジニアに差し戻し → 修正後 Phase 4 再実行
    ▼
[Phase 5] Security Engineer: セキュリティ監査
    │  ※脆弱性発見 → PM にエスカレーション → 対応後 Phase 5 再実行
    ▼
[Phase 6] PM: 最終レビュー・リリース判定
```

## Phase 1: 要件分析・タスク分解（PM）

### 入力
- ユーザーからの機能要件

### 実行内容
1. 要件の明確化（不明点はユーザーに質問）
2. 機能要件・非機能要件の整理
3. タスク分解（`templates/task-assignment.md` のフォーマットで作成）
4. 依存関係と実行順序の定義
5. Frontend / Backend の並行可能範囲の特定

### 出力
- タスク分解結果（タスク一覧と実行順序）
- 各エンジニアへのタスク割り当て

### 起動コマンド
```bash
claude --system-prompt "$(cat agents/pm.md)" "要件: ..."
```

## Phase 2a: フロントエンド実装（Frontend Engineer）

### 入力
- PMからのタスク割り当て（`templates/task-assignment.md` 形式）
- Backend Engineer が定義したAPI仕様（利用可能な場合）

### 実行内容
1. コンポーネント設計
2. UI実装
3. API統合（モック or 実API）
4. フロントエンドテスト作成
5. 引き継ぎレポート作成

### 出力
- 実装されたフロントエンドコード
- 引き継ぎレポート（`templates/handoff-report.md` 形式）

### 起動コマンド
```bash
claude --system-prompt "$(cat agents/frontend-engineer.md)" "タスク: ..."
```

## Phase 2b: バックエンド実装（Backend Engineer）

### 入力
- PMからのタスク割り当て（`templates/task-assignment.md` 形式）

### 実行内容
1. API仕様定義
2. データベース設計（必要に応じて）
3. ビジネスロジック実装
4. APIエンドポイント実装
5. バックエンドテスト作成
6. 引き継ぎレポート作成

### 出力
- 実装されたバックエンドコード
- API仕様（エンドポイント、リクエスト/レスポンス型）
- 引き継ぎレポート（`templates/handoff-report.md` 形式）

### 起動コマンド
```bash
claude --system-prompt "$(cat agents/backend-engineer.md)" "タスク: ..."
```

## Phase 3: 統合確認（PM）

### 入力
- Frontend / Backend の引き継ぎレポート

### 実行内容
1. APIインターフェースの整合性確認
2. データフォーマットの一致確認
3. エラーハンドリングの連携確認
4. 不整合がある場合、該当エンジニアに修正依頼

### 出力
- 統合確認結果
- 不整合があればエンジニアへの修正依頼

## Phase 4: テスト検証（Tester）

### 入力
- Frontend / Backend の引き継ぎレポート
- PMの統合確認結果
- 元のタスク割り当て（受け入れ条件の確認用）

### 実行内容
1. テスト計画の策定
2. テストの実装・実行
3. バグの記録と報告
4. テスト結果のサマリー作成

### 出力
- テスト実行結果
- バグ報告（該当する場合）
- 引き継ぎレポート（`templates/handoff-report.md` 形式）

### 差し戻しフロー
```
バグ発見 → バグ報告作成 → PM経由で担当エンジニアに差し戻し
         → エンジニアが修正 → Tester が再検証
```

### 起動コマンド
```bash
claude --system-prompt "$(cat agents/tester.md)" "テスト対象: ..."
```

## Phase 5: セキュリティ監査（Security Engineer）

### 入力
- 実装済みのコード全体
- Frontend / Backend の引き継ぎレポート

### 実行内容
1. OWASP Top 10 に基づく監査
2. 依存関係の脆弱性チェック
3. 秘密情報のハードコードチェック
4. セキュリティ監査レポートの作成

### 出力
- セキュリティ監査レポート
- 引き継ぎレポート（`templates/handoff-report.md` 形式）

### エスカレーションフロー
```
脆弱性発見 → 深刻度評価 → PMにエスカレーション
           → PMが対応方針を決定 → 担当エンジニアが修正
           → Security Engineer が再監査
```

### 起動コマンド
```bash
claude --system-prompt "$(cat agents/security-engineer.md)" "監査対象: ..."
```

## Phase 6: 最終レビュー・リリース判定（PM）

### 入力
- 全フェーズの引き継ぎレポート
- テスト結果
- セキュリティ監査レポート

### 実行内容
1. `templates/review-checklist.md` に基づくチェック
2. 要件充足の確認
3. 未解決の問題がないか確認
4. リリース判定

### 出力
- リリース判定結果（リリース可 / 差し戻し / 条件付きリリース可）

## 所要フェーズの短縮

小規模な機能開発の場合、PMの判断で以下を簡略化可能:

- フロントエンドのみ / バックエンドのみの変更 → 不要な側の Phase 2 をスキップ
- Phase 3（統合確認）→ 片側のみの場合はスキップ
- ただし Phase 4（テスト）と Phase 5（セキュリティ監査）は省略しない
