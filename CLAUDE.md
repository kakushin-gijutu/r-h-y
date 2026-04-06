# 株式会社革新技術 共通開発ルール / Kakushin Gijutsu Co., Ltd. Common Development Rules

---

## 日本語版

### 環境構成

- 3つの環境がある: production, preview, development
- 環境判定は `process.env.NEXT_PUBLIC_ENV` を使用する

### preview/development環境の必須要件

- フォームやinput要素を実装する際は、preview/development環境でのみダミーデータをワンクリックで入力できるボタンを必ず追加すること
- ダミーデータは日本語で、現実的な値を使うこと（例：山田太郎、090-1234-5678、yamada@example.com など）
- production環境ではダミー入力UIを一切表示しないこと
- ダミーデータボタンは開発者がすぐ気づけるように、フォームの上部に配置すること
- defaultValueはデータベースから取得してセットすること
- 新規登録・ログイン系のdefaultValueのメールアドレスは `keitanamazue+{new Date()のYYYYMMDD}{ios or android}{連番}@gmail.com` の形式にすること
- 連番はデータベースから同パターンの既存データ数を取得し、なければ1、あれば次の番号を使うこと

### EAS Build ルール

- EAS Buildを実行する前に、必ず先に `npx expo prebuild` を実行すること
- prebuildが成功したことを確認した後、生成された `/ios` と `/android` フォルダを削除すること
- その後、remoteでのEAS Buildを開始すること
- prebuildで失敗した場合は原因を追求して修正してからやり直すこと

### 環境変数の管理

- 環境変数は常にremote（Vercel, EAS等）で管理すること
- アプリ・Web・Supabaseを起動する前に、必ず環境変数をremoteからpullして最新の状態にしてから作業を開始すること

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

### コーディング規約

- TypeScript strict mode
- コメントは日本語
- コミットメッセージは日本語

---

## English Version

### Environment Configuration

- There are 3 environments: production, preview, development
- Use `process.env.NEXT_PUBLIC_ENV` for environment detection

### Mandatory Requirements for preview/development Environments

- When implementing forms or input elements, always add a button that fills in dummy data with a single click, available only in preview/development environments
- Dummy data must be in Japanese and use realistic values (e.g., 山田太郎, 090-1234-5678, yamada@example.com)
- Do not display any dummy input UI in the production environment
- Place the dummy data button at the top of the form so developers can easily notice it
- defaultValue must be fetched from the database and set accordingly
- For sign-up/login related defaultValue email addresses, use the format: `keitanamazue+{YYYYMMDD from new Date()}{ios or android}{sequential number}@gmail.com`
- For the sequential number, query the database for existing data matching the same pattern; if none exist, start with 1; otherwise, use the next number

### EAS Build Rules

- Before running an EAS Build, always run `npx expo prebuild` first
- After confirming that prebuild succeeded, delete the generated `/ios` and `/android` folders
- Then start the remote EAS Build
- If prebuild fails, investigate and fix the root cause before retrying

### Environment Variable Management

- Always manage environment variables on the remote side (Vercel, EAS, etc.)
- Before starting any app, web, or Supabase service, always pull the latest environment variables from the remote and ensure they are up to date before beginning work

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

### Coding Conventions

- TypeScript strict mode
- Comments must be written in Japanese
- Commit messages must be written in Japanese
