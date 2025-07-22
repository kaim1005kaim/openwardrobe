# OpenWardrobe (Imagine Fashion Generator) - 実装内容まとめ

## プロジェクト概要

**プロジェクト名**: OpenWardrobe (旧: Imagine Fashion Generator)
**目的**: ImagineAPIを使用したAI駆動のファッションデザイン生成アプリケーション
**フレームワーク**: Next.js 15.4.1 (App Router)
**言語**: TypeScript
**状態管理**: Zustand with persistence
**スタイリング**: Tailwind CSS v4
**デプロイ**: Netlify

## 技術スタック

### フロントエンド
- Next.js 15.4.1 (App Router)
- TypeScript
- React 19
- Zustand (状態管理)
- Tailwind CSS v4
- Framer Motion (アニメーション)
- Lucide React (アイコン)
- Ky (HTTPクライアント)

### バックエンド
- Next.js API Routes
- ImagineAPI (画像生成)
- DeepSeek API (プロンプト拡張)

## ディレクトリ構造

```
/src
├── /app                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # メインアプリケーション
│   ├── globals.css        # グローバルスタイル
│   └── /api               # APIルート
│       ├── /generate      # 画像生成エンドポイント
│       ├── /status        # ステータスチェック
│       ├── /deepseek      # AI拡張サービス
│       └── /webhook       # Webhookハンドラー
├── /components            # UIコンポーネント
├── /lib                   # ビジネスロジック
├── /store                 # Zustand ストア
└── /hooks                 # カスタムフック
```

## 主要機能

### 1. AI駆動のプロンプト生成
- **DeepSeek統合**: プロンプトの自動拡張と改善
- **スタイル提案**: トレンド、色、ムード、季節に基づく提案
- **プリセットシステム**: 事前定義されたスタイルコンビネーション

### 2. デザインオプション
```typescript
interface DesignOptions {
  trend: TrendType | null;        // minimalist, y2k, cottage-core等
  colorScheme: ColorSchemeType | null;  // monochrome, pastel, vivid等
  mood: MoodType | null;          // casual, formal, edgy等
  season: SeasonType;             // spring, summer, autumn, winter
  style?: StyleType;              // dress, casual, business等
}
```

### 3. 画像生成フロー
1. ユーザーがプロンプトを入力/デザインオプションを選択
2. AI拡張（オプション）
3. ImagineAPIへリクエスト送信
4. ポーリングによるステータス確認
5. 完成画像の表示
6. アップスケール/バリエーション生成オプション

### 4. 状態管理 (Zustand)
```typescript
interface ImageStore {
  images: GeneratedImage[];
  currentDesignOptions: DesignOptions;
  isGenerating: boolean;
  favorites: string[];
  // Actions
  setDesignOptions: (options: DesignOptions) => void;
  addImage: (image: GeneratedImage) => void;
  updateImageStatus: (id: string, status: ImageStatus) => void;
  toggleFavorite: (id: string) => void;
}
```

### 5. ジョブ管理システム
```typescript
interface GenerationJob {
  id: string;
  status: JobStatus;  // idle, submitting, queued, generating, complete, failed
  progress?: number;
  error?: { code: string; message: string; retryCount?: number };
  images?: GeneratedImage[];
}
```

## UI/UXデザイン

### デザインシステム
- **テーマ**: ダークモード専用
- **カラーパレット**: 
  - Primary: #7B61FF (紫)
  - Background: #0A0A0F (ダークネイビー)
  - Surface: rgba(255, 255, 255, 0.05)
- **効果**: グラスモーフィズム、ノイズテクスチャ
- **アニメーション**: Framer Motionによるスムーズなトランジション

### 主要コンポーネント

1. **AIPromptBar**: メインプロンプト入力
   - AI拡張トグル
   - リアルタイム提案
   - キーボードショートカット (⌘+Enter)

2. **ControlDrawer**: デザインオプション設定
   - トレンド、色、ムード、季節の選択
   - プリセットカード
   - 設定の永続化

3. **ImageGallery**: 生成画像の表示
   - グリッドレイアウト
   - お気に入り機能
   - アップスケール/バリエーションアクション

4. **TutorialOverlay**: 初回ユーザー向けガイド
   - インタラクティブなステップバイステップ
   - プログレストラッキング

## API統合

### ImagineAPI
```typescript
// 環境変数
IMAGINE_API_URL=https://api.imagine.art
IMAGINE_API_TOKEN=your-token
IMAGINE_API_MODEL=MJ

// エンドポイント
POST /v1/generations  // 画像生成
GET /v1/generation/id  // ステータス確認
```

### DeepSeek API
```typescript
// プロンプト拡張用
POST /v1/chat/completions
Model: deepseek-chat
```

## プロンプト生成ロジック

### 基本構造
```typescript
const prompt = [
  'fashion photography',
  ...trendElements,      // 選択されたトレンドから2要素
  ...colorElements,      // 選択された色から2要素
  ...moodElements,       // 選択されたムードから2要素
  ...seasonElements,     // 季節から1要素
  'single model',
  'clean minimal background',
  'professional lighting',
  '--ar 3:4 --v 6.1 --style raw',
  '--no text, words, multiple people, collage, grid'
].join(', ');
```

### 品質設定
- **Standard**: professional photography, good lighting
- **High**: studio lighting, high resolution, detailed
- **Ultra**: ultra detailed, award winning, masterpiece

## パフォーマンス最適化

1. **画像の遅延読み込み**: Intersection Observerによる
2. **状態の永続化**: 最大100画像まで保存
3. **キャッシュ戦略**: 生成済み画像のローカル保存
4. **バッチ更新**: 複数のステータス更新を最適化

## セキュリティ考慮事項

1. **APIキー管理**: 環境変数による管理
2. **入力検証**: プロンプトのサニタイズ
3. **レート制限**: API呼び出しの制限
4. **エラーハンドリング**: 適切なエラーメッセージ

## 今後の拡張可能性

1. **ユーザーアカウント**: 生成履歴の永続化
2. **コラボレーション**: デザインの共有機能
3. **高度なプロンプト編集**: マニュアル調整機能
4. **バッチ生成**: 複数バリエーションの同時生成
5. **エクスポート機能**: 様々なフォーマットでの保存

## 開発環境セットアップ

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env.local
# IMAGINE_API_TOKEN等を設定

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run type-check
```

## デプロイ設定 (Netlify)

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## まとめ

OpenWardrobeは、最新のWeb技術とAIを組み合わせた革新的なファッションデザイン生成ツールです。直感的なUIと強力なAI機能により、誰でも簡単にプロフェッショナルなファッションデザインを作成できます。モジュラーな設計により、将来的な機能拡張も容易に行えます。