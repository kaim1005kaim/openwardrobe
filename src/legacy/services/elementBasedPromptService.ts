// services/elementBasedPromptService.ts
import { Material, Silhouette, StyleTrend, FashionContext, Prompt, AppSettings, FilterOptions } from '../types';
import { fashionContext } from '../data/initialData';
import { colorPalettes, getColorPaletteById } from '../data/colorPalettes';

// ランダム選択のユーティリティ（安全性向上）
function getRandomElement<T>(array: T[]): T {
  if (!array || array.length === 0) {
    throw new Error('配列が空です');
  }
  return array[Math.floor(Math.random() * array.length)];
}

// 安全な特性取得
function getSafeCharacteristic(element: { keywords?: string[], description?: string }): string {
  if (!element) {
    return 'stylish design';
  }
  
  // keywordsから選択
  if (element.keywords && element.keywords.length > 0) {
    return getRandomElement(element.keywords);
  }
  
  // descriptionの最初の一文を使用
  if (element.description) {
    const firstSentence = element.description.split('。')[0];
    return firstSentence || 'stylish design';
  }
  
  return 'stylish design';
}

// カラーパレットの統合
function integrateColorPalette(
  trendColors: string[], 
  settings: AppSettings
): string[] {
  // カラーパレットを使用しない場合は、トレンドの色をそのまま使用
  if (!settings.useColorPalette) {
    return trendColors;
  }

  // カスタムカラーが設定されている場合
  if (settings.customColors && settings.customColors.length > 0) {
    return settings.customColors;
  }

  // 選択されたカラーパレットがある場合
  if (settings.selectedColorPalette) {
    const palette = getColorPaletteById(settings.selectedColorPalette);
    if (palette) {
      return palette.colors;
    }
  }

  // デフォルトはトレンドの色
  return trendColors;
}

// 安全なムード選択
function getSafeMood(mood: string[]): string {
  if (!mood || mood.length === 0) {
    return 'confident';
  }
  return getRandomElement(mood);
}

// 撮影角度選択（ユーザー選択対応）
function getCameraAngle(userPreference: 'random' | 'full-body' | 'portrait'): string {
  switch (userPreference) {
    case 'full-body':
      return 'full-body shot';
    case 'portrait':
      return 'portrait shot';
    case 'random':
    default:
      const angles = ['full-body shot', 'portrait shot'];
      return getRandomElement(angles);
  }
}

// フィルターに基づいて要素を選択
function filterByCompatibility<T extends { compatibility?: string[], season?: string[], seasons?: string[], formality?: string[] }>(
  elements: T[],
  selectedElements: string[] = [],
  season?: string,
  formality?: string
): T[] {
  if (!elements || elements.length === 0) {
    return [];
  }
  
  return elements.filter(element => {
    // 季節フィルター
    if (season) {
      const elementSeasons = element.season || element.seasons || [];
      if (elementSeasons.length > 0 && !elementSeasons.includes('all' as any) && !elementSeasons.includes(season as any)) {
        return false;
      }
    }
    
    // フォーマリティフィルター
    if (formality && element.formality) {
      if (element.formality.length > 0 && !element.formality.includes('all' as any) && !element.formality.includes(formality as any)) {
        return false;
      }
    }
    
    // 互換性フィルター
    if (selectedElements.length > 0 && element.compatibility) {
      return selectedElements.some(selected => element.compatibility!.includes(selected));
    }
    
    return true;
  });
}

// 人物記述を完全削除
function getPersonDescription(): string {
  return '';
}

// カラーハーモニーを考慮した色選択
function selectHarmoniousColors(styleTrend: StyleTrend, creativity: 'conservative' | 'balanced' | 'experimental'): string[] {
  const baseColors = styleTrend.colors || ['neutral'];
  
  switch (creativity) {
    case 'conservative':
      return baseColors.slice(0, 2); // 基本色のみ使用
    case 'balanced':
      // 基本色 + 類似色
      const additionalColors = fashionContext.colors.filter(color => 
        !baseColors.includes(color) && 
        (color.includes('light') || color.includes('dark') || color.includes('soft'))
      );
      return [...baseColors, ...additionalColors.slice(0, 1)];
    case 'experimental':
      // 大胆な色の組み合わせ
      const contrastColors = fashionContext.colors.filter(color => !baseColors.includes(color));
      return [...baseColors, ...contrastColors.slice(0, 2)];
    default:
      return baseColors;
  }
}

// 季節に適した要素の組み合わせを生成
function generateSeasonalCombination(season: string, creativity: 'conservative' | 'balanced' | 'experimental') {
  const seasonalMaterials = fashionContext.materials.filter(m => 
    m.season && (m.season.includes(season as any) || m.season.includes('all' as any))
  );
  
  const seasonalSilhouettes = fashionContext.silhouettes.filter(s => 
    s.seasons && (s.seasons.includes(season as any) || s.seasons.includes('all' as any))
  );
  
  const seasonalTrends = fashionContext.styleTrends.filter(t => 
    t.seasons && (t.seasons.includes(season as any) || t.seasons.includes('all' as any))
  );
  
  return {
    materials: seasonalMaterials.length > 0 ? seasonalMaterials : fashionContext.materials,
    silhouettes: seasonalSilhouettes.length > 0 ? seasonalSilhouettes : fashionContext.silhouettes,
    trends: seasonalTrends.length > 0 ? seasonalTrends : fashionContext.styleTrends
  };
}

// メイン生成関数（エラーハンドリング強化）
export function generateElementBasedPrompt(
  settings: AppSettings,
  filters?: FilterOptions,
  context: FashionContext = fashionContext
): Prompt {
  try {
    // データ整合性チェック
    if (!context || !context.materials || !context.silhouettes || !context.styleTrends) {
      throw new Error('ファッションコンテキストデータが不正です');
    }

    if (context.materials.length === 0 || context.silhouettes.length === 0 || context.styleTrends.length === 0) {
      throw new Error('ファッション要素データが不足しています');
    }

    const { creativityLevel = 'balanced', includeSeasonalConsistency, includeColorHarmony } = settings;
    
    // 現在の季節を取得（設定またはランダム）
    const currentSeason = filters?.seasons?.[0] || getRandomElement(context.seasons || ['spring']);
    
    // 季節に基づいた要素の事前フィルタリング
    let availableMaterials = context.materials;
    let availableSilhouettes = context.silhouettes;
    let availableTrends = context.styleTrends;
    
    if (includeSeasonalConsistency) {
      const seasonal = generateSeasonalCombination(currentSeason, creativityLevel);
      availableMaterials = seasonal.materials;
      availableSilhouettes = seasonal.silhouettes;
      availableTrends = seasonal.trends;
    }
    
    // フィルターの適用
    if (filters?.selectedMaterials?.length) {
      availableMaterials = availableMaterials.filter(m => filters.selectedMaterials!.includes(m.id));
    }
    
    if (filters?.selectedSilhouettes?.length) {
      availableSilhouettes = availableSilhouettes.filter(s => filters.selectedSilhouettes!.includes(s.id));
    }
    
    if (filters?.selectedStyleTrends?.length) {
      availableTrends = availableTrends.filter(t => filters.selectedStyleTrends!.includes(t.id));
    }
    
    // 最低限の要素が確保されているかチェック
    if (availableMaterials.length === 0) availableMaterials = context.materials;
    if (availableSilhouettes.length === 0) availableSilhouettes = context.silhouettes;
    if (availableTrends.length === 0) availableTrends = context.styleTrends;
    
    // スタイルトレンドを最初に選択（コアとなる要素）
    const selectedTrend = getRandomElement(availableTrends);
    
    // トレンドに基づいて互換性のある素材とシルエットを選択
    const compatibleMaterials = filterByCompatibility(
      availableMaterials,
      [selectedTrend.id],
      currentSeason,
      filters?.formality?.[0]
    );
    
    const compatibleSilhouettes = filterByCompatibility(
      availableSilhouettes,
      [selectedTrend.id],
      currentSeason,
      filters?.formality?.[0]
    );
    
    // 最終的な要素を選択
    const selectedMaterial = compatibleMaterials.length > 0 ? 
      getRandomElement(compatibleMaterials) : 
      getRandomElement(availableMaterials);
      
    const selectedSilhouette = compatibleSilhouettes.length > 0 ? 
      getRandomElement(compatibleSilhouettes) : 
      getRandomElement(availableSilhouettes);
    
    // 色の選択（カラーパレット統合）
    const trendColors = selectedTrend.colors || ['neutral'];
    const colors = integrateColorPalette(trendColors, settings);
    const primaryColor = colors.length > 0 ? getRandomElement(colors) : 'neutral';
    
    // ライティングと画角の選択
    const lighting = getRandomElement(context.lightingStyles || ['natural lighting']);
    const cameraAngle = getCameraAngle(settings.cameraAngle); // ユーザー選択を反映
    const background = getRandomElement(context.backgrounds || ['clean background']);
    const mood = getSafeMood(selectedTrend.mood || ['confident']);
    
    // 人物情報の生成（人種・性別を完全削除）
    const personDescription = getPersonDescription();
    
    // 安全な特性取得
    const materialChar = getSafeCharacteristic(selectedMaterial);
    const silhouetteChar = getSafeCharacteristic(selectedSilhouette);
    const trendChar = getSafeCharacteristic(selectedTrend);
    
    // 創造性レベルに基づく詳細度の調整
    let detailLevel = '';
    switch (creativityLevel) {
      case 'conservative':
        detailLevel = 'clean, professional';
        break;
      case 'balanced':
        detailLevel = 'stylish, well-composed';
        break;
      case 'experimental':
        detailLevel = 'artistic, avant-garde, creative styling';
        break;
    }
    
    // プロンプトテキストの組み立て
    let promptText = `A ${cameraAngle} of model wearing ${trendChar}, `;
    promptText += `${silhouetteChar} in ${materialChar}, `;
    
    // カラーパレットが指定されている場合のみ色を追加
    if (settings.useColorPalette && (settings.selectedColorPalette || settings.customColors?.length)) {
      promptText += `${primaryColor} color palette, `;
    }
    
    promptText += `${mood} mood, `;
    promptText += `${background}, `;
    promptText += `${lighting}, `;
    promptText += `${detailLevel}, fashion photography`;
    
    // オプション設定をパラメータとして追加
    if (settings.includeAspectRatio) {
      promptText += ` ${settings.aspectRatio}`;
    }
    
    if (settings.includeVersion) {
      promptText += ` ${settings.version}`;
    }
    
    if (settings.includeStylize) {
      promptText += ` --stylize ${settings.stylize}`;
    }
    
    if (settings.customSuffix) {
      promptText += ` ${settings.customSuffix}`;
    }
    
    // プロンプトオブジェクトの作成
    const now = new Date();
    const prompt: Prompt = {
      id: now.getTime() + Math.floor(Math.random() * 1000),
      fullPrompt: promptText,
      timestamp: now,
      rating: 0,
      isFavorite: false,
      material: selectedMaterial.name,
      silhouette: selectedSilhouette.name,
      lighting: lighting,
      background: background,
      era: '', // 年代は削除
      styleElements: [trendChar, materialChar, silhouetteChar],
      atmosphereMood: mood,
      generationMode: 'elements',
      selectedMaterial: selectedMaterial,
      selectedSilhouette: selectedSilhouette,
      selectedStyleTrend: selectedTrend
    };
    
    return prompt;
    
  } catch (error) {
    console.error('プロンプト生成エラー:', error);
    
    // フォールバック：基本的なプロンプトを生成
    const now = new Date();
    const cameraAngle = getCameraAngle('random'); // フォールバック時はランダム
    return {
      id: now.getTime() + Math.floor(Math.random() * 1000),
      fullPrompt: `A ${cameraAngle} of model wearing modern clothing, clean professional styling, fashion photography --ar 3:4 --v 6.1`,
      timestamp: now,
      rating: 0,
      isFavorite: false,
      material: 'modern fabric',
      silhouette: 'contemporary fit',
      lighting: 'professional lighting',
      background: 'clean background',
      era: '',
      styleElements: ['modern', 'stylish', 'professional'],
      atmosphereMood: 'confident',
      generationMode: 'elements'
    };
  }
}

// 複数のプロンプトを生成する
export function generateMultipleElementBasedPrompts(
  settings: AppSettings,
  count: number = 5,
  filters?: FilterOptions,
  context: FashionContext = fashionContext
): Prompt[] {
  const prompts: Prompt[] = [];
  
  for (let i = 0; i < count; i++) {
    try {
      const prompt = generateElementBasedPrompt(settings, filters, context);
      prompts.push(prompt);
    } catch (error) {
      console.error(`プロンプト ${i + 1} 生成エラー:`, error);
    }
  }
  
  // 最低限1つのプロンプトは返す
  if (prompts.length === 0) {
    prompts.push(generateElementBasedPrompt(settings, filters, context));
  }
  
  return prompts;
}

// 特定の要素の組み合わせでプロンプト生成
export function generatePromptWithSpecificElements(
  materialId: string,
  silhouetteId: string,
  trendId: string,
  settings: AppSettings,
  context: FashionContext = fashionContext
): Prompt {
  const material = context.materials.find(m => m.id === materialId);
  const silhouette = context.silhouettes.find(s => s.id === silhouetteId);
  const trend = context.styleTrends.find(t => t.id === trendId);
  
  if (!material || !silhouette || !trend) {
    throw new Error('指定された要素が見つかりません');
  }
  
  // 指定された要素を使用してフィルターを作成
  const filters: FilterOptions = {
    brands: [],
    eras: [],
    styles: [],
    materials: [],
    silhouettes: [],
    selectedMaterials: [materialId],
    selectedSilhouettes: [silhouetteId],
    selectedStyleTrends: [trendId]
  };
  
  return generateElementBasedPrompt(settings, filters, context);
}

// 要素の互換性をチェック
export function checkElementCompatibility(
  materialId: string,
  silhouetteId: string,
  trendId: string,
  context: FashionContext = fashionContext
): {
  compatible: boolean;
  suggestions: string[];
  issues: string[];
} {
  const material = context.materials.find(m => m.id === materialId);
  const silhouette = context.silhouettes.find(s => s.id === silhouetteId);
  const trend = context.styleTrends.find(t => t.id === trendId);
  
  if (!material || !silhouette || !trend) {
    return {
      compatible: false,
      suggestions: [],
      issues: ['指定された要素が見つかりません']
    };
  }
  
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // 季節の互換性をチェック
  const materialSeasons = material.season || [];
  const trendSeasons = trend.seasons || [];
  const hasCommonSeason = materialSeasons.some(s => trendSeasons.includes(s)) || 
                         materialSeasons.includes('all' as any) || 
                         trendSeasons.includes('all' as any);
  
  if (materialSeasons.length > 0 && trendSeasons.length > 0 && !hasCommonSeason) {
    issues.push(`素材の季節性（${materialSeasons.join(', ')}）とトレンドの季節性（${trendSeasons.join(', ')}）が合いません`);
  }
  
  // フォーマリティの互換性をチェック
  const materialFormality = material.formality || [];
  const silhouetteFormality = silhouette.formality || [];
  const hasCommonFormality = materialFormality.some(f => silhouetteFormality.includes(f)) ||
                            materialFormality.includes('all' as any) ||
                            silhouetteFormality.includes('all' as any);
  
  if (materialFormality.length > 0 && silhouetteFormality.length > 0 && !hasCommonFormality) {
    issues.push(`素材のフォーマリティ（${materialFormality.join(', ')}）とシルエットのフォーマリティ（${silhouetteFormality.join(', ')}）が合いません`);
  }
  
  // 相性の良い組み合わせをチェック
  const hasCompatibility = 
    material.compatibility?.includes(silhouetteId) ||
    material.compatibility?.includes(trendId) ||
    silhouette.compatibility?.includes(materialId) ||
    silhouette.compatibility?.includes(trendId) ||
    trend.compatibility?.includes(materialId) ||
    trend.compatibility?.includes(silhouetteId);
  
  if (!hasCompatibility) {
    suggestions.push('この組み合わせは実験的です。より調和の取れた組み合わせを試してみてください。');
  }
  
  return {
    compatible: issues.length === 0,
    suggestions,
    issues
  };
}

// トレンド分析: 人気の組み合わせを取得
export function getPopularCombinations(context: FashionContext = fashionContext) {
  return [
    {
      name: '韓国ミニマル × カシミア × フィットタートル',
      elements: ['cashmere-knit', 'fitted-turtleneck', 'korean-minimal'],
      description: '洗練されたミニマルスタイル',
      popularity: 95
    },
    {
      name: 'Y2K × クロップトップ × テクニカル素材',
      elements: ['ripstop-nylon', 'crop-top', 'y2k-revival'],
      description: '未来的なストリートスタイル',
      popularity: 87
    },
    {
      name: 'サステナブル × オーガニックコットン × Aライン',
      elements: ['organic-cotton', 'a-line-dress', 'sustainable-chic'],
      description: '環境に優しいエレガンス',
      popularity: 82
    },
    {
      name: 'インディースリーズ × ダメージデニム × スキニー',
      elements: ['distressed-denim', 'skinny-jeans', 'indie-sleaze'],
      description: 'エフォートレスクール',
      popularity: 78
    }
  ];
}
