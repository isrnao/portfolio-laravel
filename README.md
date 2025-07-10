# portfolio-laravel – *Free Tier Edition*

> **目的**: Vercel (Free) を活用して個人ブログを気軽に公開するために、元設計から *無料枠では過剰* な部分をそぎ落とした最小構成のモノレポ。

---

## 🏗️ リポジトリ構成

```text
repo-root/
├── apps/                # 実行物 (2 つだけ)
│   ├── web/            # React 19 + Vite + Inertia (RSC & streaming‑SSR 移行パスあり)
│   └── api/            # Laravel 12 (PHP 8.4)
├── supabase/           # DB/RLS/Seed (最低限)
│   ├── migrations/
│   └── policies/
├── docker/             # カスタム Dockerfile 置き場
│   └── app/
│       └── Dockerfile  # php:8.4-cli-alpine + pdo_pgsql
├── docker-compose.yml  # ローカル開発用
├── .github/workflows/  # シンプル CI (lint & test)
└── README.md
```

---

## 🔧 ローカル実行用コンテナ定義

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: ./docker/app           # custom PHP image (pdo_pgsql included)
    working_dir: /var/www/html
    volumes:
      - ./:/var/www/html:delegated
    command: >
      sh -c "composer install --no-interaction --prefer-dist && \
             php -S 0.0.0.0:8000 -t public"
    depends_on:
      - db
    environment:
      APP_ENV: local
      DB_CONNECTION: pgsql
      DB_HOST: db
      DB_PORT: 5432
      DB_DATABASE: postgres
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
    ports:
      - '8000:8000'

  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - '5432:5432'

volumes:
  pgdata:
```

### docker/app/Dockerfile

```dockerfile
FROM php:8.4-cli-alpine

# Install system dependencies
RUN apk add --no-cache git bash curl \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS

# Install PHP extensions (PostgreSQL)
RUN docker-php-ext-install pdo_pgsql pgsql

# Install Composer (copy from official image)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
```

---

## 🚀 採用技術 (無料枠に収まるものだけ)

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


## 🔧 セットアップ手順

### 1. 事前準備

* **Docker** (任意) / **Node.js 20+** / **pnpm** / **PHP 8.4+** / **Git** をインストール

#### macOS

```bash
# Homebrew で必要なツールをインストール
brew install node pnpm php git
brew install --cask docker  # Docker Desktop (任意)
```

#### Ubuntu/Linux

```bash
# 基本ツール
sudo apt update
sudo apt install nodejs npm php8.4 php8.4-cli php8.4-zip git composer
sudo npm install -g pnpm

# Docker (任意)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 2. 初期化

```bash
# クローン
git clone <repo-url>
cd portfolio-laravel

# 依存関係のインストール
pnpm install

# 環境ファイル
cp .env.example .env
cp apps/api/.env.example apps/api/.env
```

### 3. Supabase セットアップ

```bash
# Supabase CLI インストール (pnpm経由)
pnpm add -g @supabase/cli

# ローカル開発用 Supabase 起動 (任意)
npx supabase start

# マイグレーション適用
pnpm run db:migrate
```

### 4. ローカル実行 (オプション)

```bash
# 一括起動 (pnpm)
pnpm run dev

# 一括起動 (Docker Desktop があれば)
docker compose up -d  # PHP 8.4 / Postgres 15 / Node 20
# Web開発サーバーは別途起動
cd apps/web && pnpm run dev
```

| サービス                     | URL                                              |
| ------------------------ | ------------------------------------------------ |
| Laravel API              | [http://localhost:8000](http://localhost:8000)   |
| React Front              | [http://localhost:5173](http://localhost:5173)   |
| Supabase Studio (Docker) | [http://localhost:54323](http://localhost:54323) |

---

## 🌐 デプロイ

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

## 🛠️ 開発コマンド (最小)

### Monorepo (root)

```bash
# 開発サーバー起動 (API & Web)
pnpm run dev

# ビルド
pnpm run build

# テスト
pnpm run test
```

### API (`apps/api`)

```bash
# マイグレーション
php artisan migrate

# テスト
pnpm run test

# ローカルサーバー
pnpm run dev
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
# 新規マイグレーション
npx supabase migration new create_posts_table

# マイグレーション適用
pnpm run db:migrate

# DB リセット
pnpm run db:reset
```

---

## 🚀 CI/CD (超シンプル)

### GitHub Actions

`.github/workflows/ci.yml`

```yaml
name: CI
on: [push, pull_request]

jobs:
  test-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.4'
      - name: Install dependencies
        run: |
          cd apps/api
          composer install --no-interaction --no-progress --no-scripts
      - name: Run tests
        run: |
          cd apps/api
          ./vendor/bin/phpunit

  test-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - name: Install dependencies
        run: |
          pnpm install
      - name: Run tests
        run: |
          pnpm --filter web test
      - name: Build
        run: |
          pnpm --filter web build

  # Vercel & Laravel Cloud は Git 連携で自動デプロイ (別途設定不要)
```

### 自動デプロイ

* **Vercel**: main ブランチへの push で自動デプロイ
* **Supabase**: マイグレーションは手動実行推奨 (Free Plan では自動化制限あり)
