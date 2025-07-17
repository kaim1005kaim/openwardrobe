# OpenDesign Fashion Generator - 技術仕様書

## 1. システムアーキテクチャ

### 1.1 技術スタック
- **フロントエンド**: React 18.3.1 + TypeScript 5.5.3
- **スタイリング**: Tailwind CSS 3.4.1
- **ビルドツール**: Vite 5.4.2
- **リンター**: ESLint 9.9.1
- **アイコン**: Lucide React 0.344.0

### 1.2 プロジェクト構造
```
OpenDesign-Fashion-Generator/
├── src/
│   ├── components/         # UIコンポーネント
│   │   ├── CreativeMode/  # クリエイティブモード関連
│   │   ├── MixedMode/     # ミックスモード関連
│   │   ├── database/      # データベース管理
│   │   └── *.tsx          # 各種コンポーネント
│   ├── services/          # ビジネスロジック
│   ├── data/             # 静的データ
│   ├── utils/            # ユーティリティ関数
│   └── types.ts          # TypeScript型定義
├── public/               # 静的ファイル
└── scripts/              # ビルド・移行スクリプト
```

## 2. データモデル

### 2.1 主要な型定義

#### Brand（ブランド）
```typescript
interface Brand {
  id: number;
  name: string;
  eraStart: string;
  eraEnd: string;
  coreStyle: string[];
  signatureElements: string[];
  materials: string[];
  silhouettes: string[];
  colorPalette: string[];
  lighting: string[];
  atmosphereMood: string[];
  settingBackgroundDetail: string[];
  cameraShotType: string[];
}
```

#### Material（素材）
```typescript
interface Material {
  id: string;
  name: string;
  category: 'material';
  description: string;
  keywords: string[];
  season: string[];
  formality: string[];
  compatibility: string[];
  texture: string;
  weight: 'lightweight' | 'medium' | 'heavy';
  care: string[];
  sustainability: 'low' | 'medium' | 'high' | 'very-low';
  priceRange: 'budget' | 'mid-range' | 'luxury' | 'ultra-luxury';
}
```

#### Silhouette（シルエット）
```typescript
interface Silhouette {
  id: string;
  name: string;
  category: 'silhouette';
  description: string;
  keywords: string[];
  bodyTypes: string[];
  occasions: string[];
  seasons: string[];
  eras: string[];
  compatibility: string[];
  formality: string[];
  ageGroups: string[];
}
```

#### StyleTrend（スタイルトレンド）
```typescript
interface StyleTrend {
  id: string;
  name: string;
  category: 'style_trend';
  description: string;
  keywords: string[];
  era: string;
  seasons: string[];
  occasions: string[];
  colors: string[];
  materials: string[];
  compatibility: string[];
  popularity: number;
  formality: string[];
  mood: string[];
}
```

#### Prompt（生成プロンプト）
```typescript
interface Prompt {
  id: string;
  text: string;
  fullPrompt: string;
  timestamp: Date;
  rating: number;
  isFavorite: boolean;
  notes: string;
  mode: 'brand' | 'elements' | 'creative' | 'mixed';
  selectedMaterial?: Material;
  selectedSilhouette?: Silhouette;
  selectedStyleTrend?: StyleTrend;
  creativeElements?: CreativeElements;
  settings?: AppSettings;
}
```

### 2.2 アプリケーション設定
```typescript
interface AppSettings {
  // 基本設定
  darkMode: boolean;
  promptCount: number;
  
  // プロンプトオプション
  includeAspectRatio: boolean;
  aspectRatio: string;
  includeVersion: boolean;
  version: string;
  includeStylize: boolean;
  stylize: string;
  customSuffix: string;
  
  // 生成モード
  generationMode: 'brand' | 'elements' | 'creative' | 'mixed';
  
  // 高度な設定
  includeSeasonalConsistency: boolean;
  includeColorHarmony: boolean;
  creativityLevel: 'conservative' | 'balanced' | 'experimental' | 'maximum';
  cameraAngle: 'random' | 'full-body' | 'portrait';
  
  // カラーパレット
  useColorPalette: boolean;
  selectedColorPalette?: string;
  customColors: string[];
}
```

## 3. サービス層

### 3.1 プロンプト生成サービス

#### elementBasedPromptService
- **機能**: 素材、シルエット、トレンドベースのプロンプト生成
- **主要メソッド**:
  - `generateElementBasedPrompt()`: 単一プロンプト生成
  - `generateMultipleElementBasedPrompts()`: 複数プロンプト生成
  - `checkElementCompatibility()`: 要素間の互換性チェック
  - `getPopularCombinations()`: 人気の組み合わせ取得

#### brandBasedPromptService
- **機能**: ブランドベースのプロンプト生成
- **主要メソッド**:
  - `generateBrandBasedPrompt()`: 単一プロンプト生成
  - `generateMultipleBrandBasedPrompts()`: 複数プロンプト生成
  - `getAvailableBrands()`: 利用可能なブランド一覧取得

#### creativePromptService
- **機能**: クリエイティブモードのプロンプト生成
- **主要メソッド**:
  - `generateCreativePrompt()`: 単一プロンプト生成
  - `generateMultipleCreativePrompts()`: 複数プロンプト生成
  - `getCreativeTemplates()`: クリエイティブテンプレート取得

#### mixedModeService
- **機能**: 複数モードを組み合わせたプロンプト生成
- **主要メソッド**:
  - `generateMixedModePrompts()`: ミックスモードプロンプト生成
  - `getDefaultMixedSettings()`: デフォルト設定取得

### 3.2 データサービス

#### dataService
- **機能**: データの永続化とローカルストレージ管理
- **主要メソッド**:
  - `loadInitialData()`: 初期データ読み込み
  - `loadFavorites()`: お気に入り読み込み
  - `saveFavorites()`: お気に入り保存
  - `loadHistory()`: 履歴読み込み
  - `saveHistory()`: 履歴保存
  - `loadSettings()`: 設定読み込み
  - `saveSettings()`: 設定保存

## 4. ローカルストレージ構造

### 4.1 保存されるデータ
- **odfg_settings**: アプリケーション設定
- **odfg_favorites**: お気に入りプロンプト（配列）
- **odfg_history**: プロンプト生成履歴（最大100件）

### 4.2 データフォーマット
```javascript
// 設定
{
  darkMode: boolean,
  promptCount: number,
  // ... その他の設定
}

// お気に入り/履歴
[
  {
    id: string,
    text: string,
    fullPrompt: string,
    timestamp: string,
    rating: number,
    isFavorite: boolean,
    notes: string,
    mode: string,
    // ... その他のプロンプトデータ
  }
]
```

## 5. パフォーマンス最適化

### 5.1 実装済み最適化
- **遅延読み込み**: データベースの動的読み込み
- **メモ化**: React.memoによるコンポーネント再レンダリング防止
- **バッチ処理**: 複数プロンプトの一括生成
- **キャッシュ**: ブランドデータのメモリキャッシュ

### 5.2 推奨事項
- プロンプト生成数は用途に応じて調整（通常3-10、大量生成時50-150）
- 大量データ処理時はWebWorkerの活用を検討
- 画像プレビュー機能追加時は遅延読み込みを実装

## 6. セキュリティ考慮事項

### 6.1 実装済みセキュリティ
- XSS対策: Reactの自動エスケープ機能
- 入力検証: TypeScriptによる型チェック
- ローカルストレージ: サイト固有のデータ隔離

### 6.2 推奨セキュリティ対策
- Content Security Policy (CSP) の設定
- HTTPS通信の強制
- 定期的な依存関係の更新

## 7. ブラウザ互換性

### 7.1 サポートブラウザ
- Chrome/Edge: 最新版および1つ前のバージョン
- Firefox: 最新版および1つ前のバージョン
- Safari: 最新版および1つ前のバージョン
- モバイルブラウザ: iOS Safari、Chrome for Android

### 7.2 必要な機能
- ES6+ サポート
- LocalStorage API
- CSS Grid/Flexbox
- CSS Variables

## 8. 開発環境セットアップ

### 8.1 必要な環境
- Node.js 16以上
- npm 7以上 または yarn

### 8.2 インストール手順
```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ビルドのプレビュー
npm run preview
```

### 8.3 環境変数
現在、環境変数は使用していませんが、将来的な拡張のために以下の構造を推奨：
```
VITE_API_URL=https://api.example.com
VITE_API_KEY=your-api-key
```

## 9. デプロイメント

### 9.1 ビルド設定
- **出力ディレクトリ**: dist/
- **ベースパス**: /（ルート）
- **アセット最適化**: Viteによる自動最適化

### 9.2 推奨デプロイ先
- Netlify（設定ファイル付属）
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

### 9.3 本番環境チェックリスト
- [ ] 環境変数の設定
- [ ] エラーログの設定
- [ ] パフォーマンス監視の設定
- [ ] バックアップ体制の確立
- [ ] CDNの設定
- [ ] HTTPSの有効化