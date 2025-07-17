# Imagine Fashion Generator - 実装計画

## 🏗️ プロジェクト構成案

### 1. 新規プロジェクトとして実装（推奨）

```
Imagine-Fashion-Generator/  （新規）
└── AI画像生成機能に特化

OpenDesign-Fashion-Generator/  （既存）
└── プロンプト生成ライブラリとして活用
```

## 🔄 既存プロジェクトの活用方法

### 1. プロンプト生成ロジックの再利用

既存プロジェクトから以下を抽出して npm パッケージ化または直接コピー：

```typescript
// 再利用可能なモジュール
- services/elementBasedPromptService.ts
- services/brandBasedPromptService.ts  
- services/creativePromptService.ts
- data/initialData.ts
- types.ts（必要な型定義のみ）
```

### 2. 新プロジェクトでの統合方法

```typescript
// lib/promptGenerator.ts
import { generateElementBasedPrompt } from '@opendesign/prompt-generator';

export function generatePromptFromUserSelection(options: {
  trend?: string;
  color?: string;
  mood?: string;
  style?: string;
}) {
  // ユーザー選択を内部パラメータに変換
  const elements = mapUserSelectionToElements(options);
  
  // 既存ロジックを活用してプロンプト生成
  return generateElementBasedPrompt({
    material: elements.material,
    silhouette: elements.silhouette,
    styleTrend: elements.trend,
    settings: {
      includeColorHarmony: true,
      creativityLevel: 'balanced'
    }
  });
}
```

## 📋 機能実装計画

### Phase 1: 基本画像生成（5日）

1. **デザインピッカー UI**
   ```typescript
   interface DesignOptions {
     trend: 'minimalist' | 'y2k' | 'cottage-core' | 'tech-wear';
     colorScheme: 'monochrome' | 'pastel' | 'vivid' | 'earth-tone';
     mood: 'casual' | 'formal' | 'edgy' | 'romantic';
     season: 'spring' | 'summer' | 'autumn' | 'winter';
   }
   ```

2. **プロンプト自動生成**
   - ユーザー選択を既存プロンプト生成ロジックに橋渡し
   - 生成されたプロンプトは内部処理（非表示）

3. **画像生成フロー**
   - ImagineAPI 呼び出し
   - プログレス表示
   - 結果表示

### Phase 2: 画像編集機能（3日）

1. **バリエーション生成**
   ```typescript
   // 色変更
   async function changeColorScheme(imageId: string, newColor: ColorScheme) {
     const prompt = `change color to ${newColor} :: ${imageId}`;
     return generateImage(prompt, imageId);
   }
   
   // 柄変更
   async function changePattern(imageId: string, newPattern: Pattern) {
     const prompt = `apply ${newPattern} pattern :: ${imageId}`;
     return generateImage(prompt, imageId);
   }
   
   // 雰囲気変更
   async function changeMood(imageId: string, newMood: Mood) {
     const prompt = `transform to ${newMood} style :: ${imageId}`;
     return generateImage(prompt, imageId);
   }
   ```

2. **画像ブレンド**
   - 2つの画像を組み合わせ
   - スタイル転送

### Phase 3: 高度な機能（2日）

1. **履歴管理**
   - 生成履歴の保存
   - お気に入り機能

2. **プリセット**
   - 人気の組み合わせ
   - カスタムプリセット保存

## 🛠️ 技術実装詳細

### コンポーネント構成

```typescript
// app/components/DesignPicker.tsx
export function DesignPicker() {
  const [selection, setSelection] = useState<DesignOptions>({
    trend: null,
    colorScheme: null,
    mood: null,
    season: 'spring'
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* トレンド選択カード */}
      <TrendSelector value={selection.trend} onChange={...} />
      
      {/* カラースキーム選択 */}
      <ColorSchemeSelector value={selection.colorScheme} onChange={...} />
      
      {/* ムード選択 */}
      <MoodSelector value={selection.mood} onChange={...} />
      
      {/* ランダムボタン */}
      <RandomButton onClick={generateRandomSelection} />
    </div>
  );
}
```

### プロンプト生成戦略

```typescript
// lib/promptStrategy.ts
export class FashionPromptStrategy {
  private baseElements = {
    trends: {
      'minimalist': ['clean lines', 'simple silhouette', 'neutral colors'],
      'y2k': ['low rise', 'metallic fabrics', 'bold accessories'],
      'cottage-core': ['floral prints', 'flowing fabrics', 'vintage details'],
      'tech-wear': ['functional pockets', 'waterproof materials', 'urban aesthetic']
    },
    
    colorSchemes: {
      'monochrome': ['black and white', 'grayscale', 'minimal contrast'],
      'pastel': ['soft pink', 'baby blue', 'lavender', 'mint green'],
      'vivid': ['electric blue', 'hot pink', 'neon green', 'bright orange'],
      'earth-tone': ['terracotta', 'olive green', 'sand beige', 'rust brown']
    },
    
    moods: {
      'casual': ['relaxed fit', 'comfortable', 'everyday wear'],
      'formal': ['tailored', 'sophisticated', 'elegant lines'],
      'edgy': ['asymmetric', 'bold statement', 'unconventional'],
      'romantic': ['delicate details', 'flowing', 'feminine touch']
    }
  };

  generatePrompt(options: DesignOptions): string {
    // 既存のプロンプト生成ロジックと組み合わせ
    const elements = this.mapToElements(options);
    const basePrompt = this.createBasePrompt(elements);
    const refinedPrompt = this.addQualityModifiers(basePrompt);
    
    return refinedPrompt;
  }
}
```

## 📊 移行スケジュール

| Week | Tasks | Deliverable |
|------|-------|-------------|
| 1 | - Next.js プロジェクトセットアップ<br>- 既存ロジックの抽出・整理<br>- UI コンポーネント作成 | デザインピッカー動作 |
| 2 | - ImagineAPI 統合<br>- 画像生成フロー実装<br>- エラーハンドリング | 基本的な画像生成 |
| 3 | - 画像編集機能<br>- テスト・最適化<br>- Netlify デプロイ | 完成版 PoC |

## 🎯 成功指標

1. **ユーザビリティ**
   - 3クリック以内で画像生成
   - 生成時間 < 30秒

2. **品質**
   - 生成成功率 > 90%
   - プロンプト品質スコア > 4.0/5.0

3. **拡張性**
   - 新しいトレンド/スタイルの追加が容易
   - 既存プロンプトロジックの再利用率 > 70%

## 💡 追加提案

### 1. ハイブリッドモード
既存のプロンプト生成UIも残し、上級者向けに手動編集可能に：

```typescript
// 初心者モード：ビジュアル選択のみ
// 上級者モード：生成されたプロンプトを表示・編集可能
```

### 2. A/Bテスト機能
同じ選択から複数バリエーションを同時生成：

```typescript
async function generateABVariations(options: DesignOptions) {
  const variations = [
    { creativityLevel: 'conservative' },
    { creativityLevel: 'balanced' },
    { creativityLevel: 'experimental' }
  ];
  
  return Promise.all(
    variations.map(v => generateWithVariation(options, v))
  );
}
```

### 3. スタイル学習
ユーザーの選択履歴から好みを学習し、レコメンド精度向上