# portfolio-laravel – *Free Tier Edition*


---

## リポジトリ構成

```text
repo-root/
├── apps/
│   ├── web/            # React 19 (TypeScript 5.8) + Vite + Inertia (RSC & streaming‑SSR 移行パスあり)
│   └── api/            # Laravel 12 (PHP 8.4)
├── supabase/           # DB/RLS/Seed
│   ├── migrations/
│   └── policies/
├── docker/             # カスタム Dockerfile 置き場
│   └── app/
│       └── Dockerfile  # php:8.4-cli-alpine + pdo_pgsql
├── docker-compose.yml  # ローカル開発用
├── .github/workflows/  # CI (lint & test)
└── README.md
```

---

## ローカル実行用コンテナ定義

Docker設定は `docker-compose.yml` および `docker/app/Dockerfile` で定義されています。

---

## 技術スタック

| 分類                  | 採用技術                                                      | 無料枠での理由                             |
| ------------------- | --------------------------------------------------------- | ----------------------------------- |
| **バックエンド**          | Laravel 12.x (PHP 8.4)                                    | Laravel Cloud Sandbox に最適化済み        |
| **フロントエンド**         | React 19 + Vite + Inertia.js (RSC & streaming‑SSR 移行パスあり) | Vercel の静的 & Edge Runtime 互換        |
| **UI / Components** | shadcn/ui + Tailwind CSS                                  | コンポーネントは apps/web/components/ に直接配置 |
| **DB / Auth**       | Supabase Free Plan (PostgreSQL 15)                        | 500 MB DB / 2 GB Storage で十分        |
| **CI**              | GitHub Actions & Vercel 自動ビルド                             | 無料 2 000 分/月 以内                     |
| **テスト**             | Vitest / React Testing Library, PHPUnit                   | 軽量 & パラレル不要                         |
| **ローカル開発**          | Docker + Laravel Sail (option)                            | 環境差異を最小限に                           |

---


## セットアップ手順

### 1. 事前準備

必要なツールをインストール：
- **Node.js 20+** / **pnpm** / **PHP 8.4+** / **Composer** / **Git**
- **Docker** (任意)
- **Supabase CLI** (必要に応じて)

#### macOS

```bash
# Homebrew で必要なツールをインストール
brew install node pnpm php git composer
brew install --cask docker  # Docker Desktop (任意)

# Supabase CLI をインストール (必要に応じて)
brew install supabase/tap/supabase
```

### 2. プロジェクトのセットアップ

```bash
# リポジトリのクローン
git clone <repo-url>
cd portfolio-laravel

# 依存関係のインストール
pnpm install
cd apps/api && composer install && cd ../..

# 環境ファイルのコピー
cp .env.example .env
cp apps/api/.env.example apps/api/.env

# Laravel設定
cd apps/api
php artisan key:generate
touch database/database.sqlite
cd ../..
```

### 3. データベースのセットアップ

```bash
# Laravel基本マイグレーション実行
pnpm run db:migrate

# サンプルデータ投入（任意）
pnpm run db:seed
```

### 4. 開発サーバーの起動

```bash
# 一括起動
pnpm run dev

# または個別起動
# API: cd apps/api && pnpm run dev
# Web: cd apps/web && pnpm run dev
```

| サービス | URL |
|---------|-----|
| Laravel API | http://127.0.0.1:8000 |
| React Front | http://localhost:5173 |

---

## セットアップ手順

詳細な手順については、問題が発生した場合は [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) を参照してください。

| レイヤ           | プラットフォーム          | 設定ポイント                                                    |
| ------------- | ----------------- | --------------------------------------------------------- |
| **UI (web)**  | **Vercel**        | GitHub 連携 → Framework = *Other* → `apps/web` を `root` に指定 |
| **API (api)** | **Laravel Cloud** | `laravel cloud init` → `deploy` で push                    |
| **DB**        | **Supabase**      | ダッシュボードからプロジェクト作成 → `.env` の URL/KEY を更新                  |

> **注意**: 無料枠は *瞬断* が発生しやすい。Webhook や長時間ジョブは避け、ポーリング / クライアント再接続でフォールトトレラントにする。

### Vercel デプロイ手順

1. **GitHub リポジトリ連携**: Vercel ダッシュボードで Import Project
2. **Root Directory**: `apps/web` を指定
3. **Framework Preset**: `Other` を選択
4. **Build Command**: `pnpm run build`
5. **Output Directory**: `dist`

### Laravel Cloud デプロイ手順

```bash
# Laravel Cloud CLI インストール
composer global require laravel/cloud

# プロジェクト初期化
cd apps/api
laravel cloud init

# デプロイ実行
laravel cloud deploy
```

### Supabase セットアップ

1. **プロジェクト作成**: [https://app.supabase.com/](https://app.supabase.com/)
2. **環境変数設定**: プロジェクト設定から API URL と Key を取得
3. **マイグレーション**: `npx supabase db push` でスキーマ適用

---

## 開発コマンド

### Monorepo (root)

```bash
# 開発サーバー起動 (API & Web)
pnpm run dev

# ビルド
pnpm run build

# テスト
pnpm run test

# データベースマイグレーション
pnpm run db:migrate

# データベースリセット + マイグレーション
pnpm run db:migrate:fresh

# データベースリセット + マイグレーション + シード
pnpm run db:migrate:fresh:seed

# シード実行
pnpm run db:seed

# マイグレーションロールバック
pnpm run db:rollback
```

### API (`apps/api`)

```bash
# マイグレーション
php artisan migrate

# テスト
pnpm run test

# ローカルサーバー (Laravel + Vite HMR)
pnpm run dev

# Laravel サーバーのみ
pnpm run dev:serve

# Vite HMR のみ
pnpm run dev:vite
```

### Web (`apps/web`)

```bash
# 開発サーバー
pnpm run dev

# プロダクションビルド
pnpm run build

# プレビュー
pnpm run preview

# テスト
pnpm run test
```

### Supabase

```bash
# Supabaseローカル環境の状況確認
npx supabase status

# 新規Supabaseマイグレーション作成
npx supabase migration new create_posts_table

# Supabaseマイグレーション適用
npx supabase db push

# Supabaseスキーマをローカルに同期
npx supabase db pull

# Supabaseローカル環境の停止・起動
npx supabase stop
npx supabase start

# Laravel側でのマイグレーション適用
pnpm run db:migrate

# DB リセット
pnpm run db:reset

# Supabase Studio (データベース管理UI)
# http://127.0.0.1:54323
```

---

## CI/CD

### GitHub Actions

自動テストとビルドは `.github/workflows/ci.yml` で設定されています。

### 自動デプロイ

* **Vercel**: main ブランチへの push で自動デプロイ
* **Supabase**: マイグレーションは手動実行推奨 (Free Plan では自動化制限あり)
