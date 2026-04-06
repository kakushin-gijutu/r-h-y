# 株式会社革新技術 共通開発ルール / Kakushin Gijutsu Co., Ltd. Common Development Rules

---

## 日本語版

### 環境構成

- 3つの環境がある: production, preview, development
- 環境判定は使用箇所に適した環境変数を使用する
  - Next.js (Vercel): `process.env.NEXT_PUBLIC_ENV`
  - Expo (EAS): `process.env.EXPO_PUBLIC_ENV` またはEAS固有の環境変数
  - Supabase Edge Functions: `Deno.env.get()` 等、Supabase固有の環境変数
  - 各プラットフォームの命名規則に従い、適切な環境変数名を選択すること

### preview/development環境の必須要件

- フォームやinput要素を実装する際は、preview/development環境でのみダミーデータをワンクリックで入力できるボタンを必ず追加すること
- ダミーデータは日本語で、現実的な値を使うこと（例：山田太郎、090-1234-5678、yamada@example.com など）
- production環境ではダミー入力UIを一切表示しないこと
- ダミーデータボタンは開発者がすぐ気づけるように、フォームの上部に配置すること
- defaultValueはデータベースから取得してセットすること
- 新規登録・ログイン系のdefaultValueのメールアドレスは以下のいずれかの形式にすること
  - `keitanamazue+{new Date()のYYYYMMDD}{ios or android}{連番}@gmail.com`
  - `sai+{new Date()のYYYYMMDD}{ios or android}{連番}@kakushin-gijutu.com`
- 連番はデータベースから同パターンの既存データ数を取得し、なければ1、あれば次の番号を使うこと

### EAS Build ルール

- EAS Buildを実行する前に、必ず先に `npx expo prebuild` を実行すること
- prebuildが成功したことを確認した後、生成された `/ios` と `/android` フォルダを削除すること
- その後、remoteでのEAS Buildを開始すること
- prebuildで失敗した場合は原因を追求して修正してからやり直すこと

### 環境変数の管理

- 環境変数は常にremote（Vercel, EAS等）で管理すること
- アプリ・Web・Supabaseを起動する前に、必ず環境変数をremoteからpullして最新の状態にしてから作業を開始すること
- 各プロジェクトに `npm run sync` コマンドが用意されており、git pullと環境変数の同期を一括で実行できる
- `npm run dev` 実行時には自動で同期が走る（predevスクリプト）
- セットアップ方法は `scripts/project-sync.mjs` を参照

### エラーハンドリング・監視

- エラーハンドリングは必ず実装すること
- console.logのデバッグ用出力はproduction環境では出力しないこと
- production環境ではエラー発生時にSlack Webhook APIにエラー内容を通知すること
- Slack Webhook URLはremoteの環境変数に格納されている

### 多言語対応

- どのプロジェクトでも多言語設定を行うこと
- 対応言語: 英語・日本語・ミャンマー語・韓国語・中国語

### テスト

- 新規機能を追加する場合は必ずテストコードを書くこと
- テストが通る状態を維持して品質を保つこと

### 本番環境の扱い

- 本番環境のデータベースには決して触らないこと。操作が必要な場合は、毎回必ず事前に確認を取ること
- 本番ブランチ（`main` / `master` / `production`）には絶対に直接コミットしないこと
- その他のサービス（Vercel, Supabase, EAS等）の本番環境も、許可なく操作しないこと
- 本番環境に対するPOST・DELETE・UPDATEの操作は一切禁止

### ブランチ運用

- 特に指示がない場合は `preview` ブランチで開発を続けること
- ブランチ切り替えや `git stash` が必要な場合、変更が消失しないよう以下の手順を守ること:
  1. stashした内容をremoteに反映した後、必ず `git stash pop` で戻す
  2. stashを戻せない場合は、その変更だけの新規ブランチを作成しremoteにpush＆PRを作成して変更を保全する
- いかなる場合も、コミット済み・未コミットを問わず変更が失われないようにすること

### コーディング規約

- TypeScript strict mode
- コメントは日本語
- コミットメッセージは日本語

---

## English Version

### Environment Configuration

- There are 3 environments: production, preview, development
- Use the appropriate environment variable for each platform:
  - Next.js (Vercel): `process.env.NEXT_PUBLIC_ENV`
  - Expo (EAS): `process.env.EXPO_PUBLIC_ENV` or EAS-specific environment variables
  - Supabase Edge Functions: `Deno.env.get()` or Supabase-specific environment variables
  - Follow each platform's naming conventions when choosing environment variable names

### Mandatory Requirements for preview/development Environments

- When implementing forms or input elements, always add a button that fills in dummy data with a single click, available only in preview/development environments
- Dummy data must be in Japanese and use realistic values (e.g., 山田太郎, 090-1234-5678, yamada@example.com)
- Do not display any dummy input UI in the production environment
- Place the dummy data button at the top of the form so developers can easily notice it
- defaultValue must be fetched from the database and set accordingly
- For sign-up/login related defaultValue email addresses, use one of the following formats:
  - `keitanamazue+{YYYYMMDD from new Date()}{ios or android}{sequential number}@gmail.com`
  - `sai+{YYYYMMDD from new Date()}{ios or android}{sequential number}@kakushin-gijutu.com`
- For the sequential number, query the database for existing data matching the same pattern; if none exist, start with 1; otherwise, use the next number

### EAS Build Rules

- Before running an EAS Build, always run `npx expo prebuild` first
- After confirming that prebuild succeeded, delete the generated `/ios` and `/android` folders
- Then start the remote EAS Build
- If prebuild fails, investigate and fix the root cause before retrying

### Environment Variable Management

- Always manage environment variables on the remote side (Vercel, EAS, etc.)
- Before starting any app, web, or Supabase service, always pull the latest environment variables from the remote and ensure they are up to date before beginning work
- Each project has an `npm run sync` command that performs git pull and environment variable sync in one step
- Running `npm run dev` automatically triggers sync first (via predev script)
- See `scripts/project-sync.mjs` for setup instructions

### Error Handling & Monitoring

- Error handling must always be implemented
- Do not output console.log debug messages in the production environment
- In the production environment, send error details to the Slack Webhook API when an error occurs
- The Slack Webhook URL is stored in the remote environment variables

### Internationalization (i18n)

- Configure internationalization in every project
- Supported languages: English, Japanese, Myanmar (Burmese), Korean, Chinese

### Testing

- Always write test code when adding new features
- Maintain a passing test suite to ensure quality

### Production Environment Rules

- Never touch the production database. Always ask for explicit permission before every operation
- Never commit directly to production branches (`main` / `master` / `production`)
- Do not operate on any production environment (Vercel, Supabase, EAS, etc.) without permission
- POST, DELETE, and UPDATE operations against the production environment are strictly prohibited

### Branch Workflow

- By default, continue development on the `preview` branch unless otherwise instructed
- When switching branches or using `git stash`, always ensure changes are never lost:
  1. After applying stashed changes to remote, always restore with `git stash pop`
  2. If the stash cannot be restored, create a new branch with those changes, push to remote, and open a PR to preserve them
- Whether committed or uncommitted, changes must never be discarded or lost under any circumstances

### Coding Conventions

- TypeScript strict mode
- Comments must be written in Japanese
- Commit messages must be written in Japanese
