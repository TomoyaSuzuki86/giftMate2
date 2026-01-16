## 作りたいアプリ概要

GiftMateというwebアプリを作りたいです。
誕生日や結婚式などの **贈り物や金銭のやりとりを管理するアプリ** です。
過去のやりとりを記録し、金額バランスを視覚化することを目的とします。
ユーザは、googleアカウントでログインし、アプリを利用します。したがって、ユーザ登録などの画面は不要です。
ログイン情報がない場合は強制的にログインを促してください。ログインされていない場合はアプリを利用できません。

ユーザ検索機能はいらず、個人用のメモ帳として機能すればよいです。別のユーザとやり取りしたり、ギフト情報の共有など一切できなくて構いません。
シンプルで必要最小限の機能で、使いやすくきれいでモダンな画面構成にしてください。


  ## 環境構築

  - 目的: Vite + React + TypeScript + Tailwind + Firebase(Auth/Firestore) + PWA対応の構成を再現する。
  - 使用技術:
    - Vite + React + TypeScript
    - Tailwind CSS（shadcn/ui相当の構成は任意）
    - Firebase Auth / Firestore
    - PWA（manifest + service worker）

  ### 1) プロジェクト初期化
  - ViteのReact+TSテンプレートで作成すること。
  - 依存関係は以下を含める:
    - react, react-dom
    - firebase
    - tailwindcss, postcss, autoprefixer
    - framer-motion, lucide-react（UIに必要なら）
    - shadcn/ui相当のコンポーネント群（必要なら）

  ### 4) PWA対応
  - `public/manifest.webmanifest` を用意。
  - `public/sw.js` を用意し `src/main.tsx` で登録。
  - スマホ対応のレスポンシブデザインを念頭に置いた画面レイアウト
  ### 5) 画面構成（最低限）
  - `src/App.tsx` を中心に画面を作成。
  - `src/components/*` に主要UIを分割。

 ### 6) 特記事項
  - .env.local は使わない
  - GitHub Actions Secrets を使う
  - 対象キー:
    VITE_FIREBASE_API_KEY, VITE_FIREBASE_APP_ID, VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_MEASUREMENT_ID, VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_STORAGE_BUCKET,
    VITE_GOOGLE_OAUTH_CLIENT_ID
