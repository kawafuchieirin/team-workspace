# Team Workspace

チーム開発用ワークスペース。複数のプロジェクトを格納する構成です。

## ディレクトリ構成

```
team-workspace/
├── .github/          # GitHub テンプレート
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── agents/           # AIエージェント定義→変更しないでください
├── workflows/        # 開発ワークフロー定義→変更しないでください
├── templates/        # 引き継ぎ・レビュー用テンプレート→変更しないでください
├── study-tracker/    # 学習管理アプリ（プロジェクト）
└── README.md
```

## プロジェクト
共同開発用のプロジェクトです。

※秘匿情報は、pushしないでください

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
docker compose up --build -d
```

※windowsの方は、ディレクトリの移動コマンドは異なります。

## demo
[screenshot 2026-02-07 9.50.28-1.mov.zip](https://github.com/user-attachments/files/25140920/screenshot.2026-02-07.9.50.28-1.mov.zip)


わからない場合は上記をダウンロードして手順を確認下さい


## 開発ガイドライン

- 新規プロジェクトは専用ディレクトリを作成し、独自の`README.md`を配置
- プロジェクト固有のコマンドやアーキテクチャは各プロジェクトのドキュメントを参照
- pre-commitをインストールしコードの品質を担保して下さい

