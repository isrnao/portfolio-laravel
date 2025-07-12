# トラブルシューティング

このドキュメントでは、portfolio-laravelプロジェクトでよく発生する問題とその解決方法をまとめています。

## Composerが見つからない場合

```bash
# Composerを手動インストール
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# または Homebrew で再インストール
brew install composer
```

## Supabase CLIのインストールエラー

```bash
# pnpmでのグローバルインストールは非対応
# pnpm add -g @supabase/cli  # ❌ これは失敗する

# Homebrew を使用してインストール (推奨)
brew install supabase/tap/supabase

# インストール確認
supabase --version
```

## Docker関連のエラー

```bash
# Docker Desktopが起動していない場合
# アプリケーションフォルダからDocker Desktopを起動
open -a Docker

# または、手動でDocker Desktopアプリを起動してから
supabase start
```

## `pnpm run db:migrate` でスクリプトが見つからない場合

プロジェクトルートの `package.json` にマイグレーションスクリプトを追加：

```json
{
  "scripts": {
    "db:migrate": "cd apps/api && php artisan migrate",
    "db:migrate:fresh": "cd apps/api && php artisan migrate:fresh",
    "db:migrate:fresh:seed": "cd apps/api && php artisan migrate:fresh --seed",
    "db:seed": "cd apps/api && php artisan db:seed",
    "db:rollback": "cd apps/api && php artisan migrate:rollback"
  }
}
```

## Laravel依存関係のエラー

```bash
# vendor ディレクトリを削除して再インストール
cd apps/api
rm -rf vendor
# Composerがローカルの場合
php composer.phar install
# または、グローバルの場合
composer install
php artisan key:generate
```

## Supabase関連のエラー

```bash
# Supabaseローカル環境が起動しない場合
# Docker Desktopが起動していることを確認
open -a Docker

# Docker Desktopが完全に起動するまで待ってから実行
npx supabase start

# ポートが既に使用されている場合
npx supabase stop
npx supabase start

# Supabaseローカル環境の状況確認
npx supabase status
```

## LaravelとSupabaseの接続エラー

```bash
# .envファイルでSupabaseローカル設定に変更
cd apps/api

# 手動で.envファイルを編集するか、以下のコマンドで一括変更
sed -i '' 's/DB_CONNECTION=sqlite/DB_CONNECTION=pgsql/' .env
sed -i '' 's/# DB_HOST=127.0.0.1/DB_HOST=127.0.0.1/' .env
sed -i '' 's/# DB_PORT=3306/DB_PORT=54322/' .env
sed -i '' 's/# DB_DATABASE=laravel/DB_DATABASE=postgres/' .env
sed -i '' 's/# DB_USERNAME=root/DB_USERNAME=postgres/' .env
sed -i '' 's/# DB_PASSWORD=/DB_PASSWORD=postgres/' .env

# マイグレーションを再実行
cd ../..
pnpm run db:migrate
```

## Supabase StudioでのテーブルとLaravelマイグレーションの連携

```bash
# Laravelマイグレーション実行後、Supabase Studioで確認
# http://127.0.0.1:54323 → Table Editor
# users, cache, jobs テーブルが作成されているか確認

# 新しいテーブルを作成する場合
cd apps/api
php artisan make:migration create_posts_table

# マイグレーション編集後に実行
php artisan migrate
```

## APP_URLの設定問題

```bash
# Laravel開発サーバーとAPP_URLが一致しない場合
# apps/api/.env ファイルを編集
APP_URL=http://localhost:8000  # 開発サーバーのポート(8000)に合わせる

# または、sedコマンドで一括置換
cd apps/api
sed -i '' 's/APP_URL=http:\/\/localhost/APP_URL=http:\/\/localhost:8000/' .env
```
