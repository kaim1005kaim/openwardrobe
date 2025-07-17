import { AppSettings, FilterOptions, Prompt, MixedModeSettings, CreativeSettings, Material, Silhouette, StyleTrend } from '../types';
import { generateMultipleElementBasedPrompts } from './elementBasedPromptService';
import { generateMultipleBrandBasedPrompts } from './brandBasedPromptService';
import { generateMultipleCreativePrompts } from './creativePromptService';

// ミックスモード用のプロンプト生成
export async function generateMixedModePrompts(
  settings: AppSettings,
  selectedElements: {
    material: Material | null;
    silhouette: Silhouette | null;
    styleTrend: StyleTrend | null;
  },
  filters: FilterOptions,
  creativeSettings: CreativeSettings,
  mixedSettings: MixedModeSettings,
  totalCount: number
): Prompt[] {
  
  const prompts: Prompt[] = [];
  
  // バランスモードに基づいて各モードの生成数を計算
  const counts = calculateModeCounts(mixedSettings, totalCount);
  
  try {
    // 要素ベースプロンプト生成
    if (counts.elements > 0) {
      const updatedFilters = { ...filters };
      if (selectedElements.material) {
        updatedFilters.selectedMaterials = [selectedElements.material.id];
      }
      if (selectedElements.silhouette) {
        updatedFilters.selectedSilhouettes = [selectedElements.silhouette.id];
      }
      if (selectedElements.styleTrend) {
        updatedFilters.selectedStyleTrends = [selectedElements.styleTrend.id];
      }
      
      const elementPrompts = generateMultipleElementBasedPrompts(
        settings,
        counts.elements,
        updatedFilters
      );
      
      // 配列かどうかチェック
      if (Array.isArray(elementPrompts)) {
        prompts.push(...elementPrompts);
      } else {
        console.warn('要素ベース生成が配列を返しませんでした:', elementPrompts);
      }
    }
    
    // ブランドベースプロンプト生成  
    if (counts.brand > 0) {
      const brandPrompts = await generateMultipleBrandBasedPrompts(
        settings,
        counts.brand,
        filters
      );
      
      // 配列かどうかチェック
      if (Array.isArray(brandPrompts)) {
        prompts.push(...brandPrompts);
      } else {
        console.warn('ブランドベース生成が配列を返しませんでした:', brandPrompts);
      }
    }
    
    // Creativeモードプロンプト生成
    if (counts.creative > 0) {
      const creativePrompts = generateMultipleCreativePrompts(
        settings,
        selectedElements,
        counts.creative,
        creativeSettings
      );
      
      // 配列かどうかチェック
      if (Array.isArray(creativePrompts)) {
        prompts.push(...creativePrompts);
      } else {
        console.warn('Creative生成が配列を返しませんでした:', creativePrompts);
      }
    }
    
    // シャッフル設定に基づいて順序を調整
    if (mixedSettings.shuffleOrder) {
      return shuffleArray([...prompts]);
    } else {
      // デフォルトは交互に配置
      return interleavePrompts(prompts, counts);
    }
    
  } catch (error) {
    console.error('ミックスモード生成エラー:', error);
    throw new Error(`ミックスモードでのプロンプト生成に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
}

// バランスモードに基づいて各モードの生成数を計算
function calculateModeCounts(mixedSettings: MixedModeSettings, totalCount: number): {
  elements: number;
  brand: number;
  creative: number;
} {
  
  if (mixedSettings.balanceMode === 'equal') {
    // 均等分割
    const baseCount = Math.floor(totalCount / 3);
    const remainder = totalCount % 3;
    
    return {
      elements: baseCount + (remainder > 0 ? 1 : 0),
      brand: baseCount + (remainder > 1 ? 1 : 0),
      creative: baseCount
    };
  } 
  
  if (mixedSettings.balanceMode === 'random') {
    // ランダム分割（最低1つずつは保証）
    const remaining = totalCount - 3; // 各モードに最低1つずつ割り当て
    const random1 = Math.floor(Math.random() * (remaining + 1));
    const random2 = Math.floor(Math.random() * (remaining - random1 + 1));
    const random3 = remaining - random1 - random2;
    
    return {
      elements: 1 + random1,
      brand: 1 + random2,
      creative: 1 + random3
    };
  }
  
  // カスタム分割
  const totalRatio = mixedSettings.elementsRatio + mixedSettings.brandRatio + mixedSettings.creativeRatio;
  
  if (totalRatio === 0) {
    // 比率がすべて0の場合は均等分割
    return calculateModeCounts({ ...mixedSettings, balanceMode: 'equal' }, totalCount);
  }
  
  const elementsCount = Math.round((mixedSettings.elementsRatio / totalRatio) * totalCount);
  const brandCount = Math.round((mixedSettings.brandRatio / totalRatio) * totalCount);
  const creativeCount = totalCount - elementsCount - brandCount;
  
  // 最低0個は保証（負の値を防ぐ）
  return {
    elements: Math.max(0, elementsCount),
    brand: Math.max(0, brandCount),
    creative: Math.max(0, creativeCount)
  };
}

// 配列をシャッフルする
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// プロンプトを交互に配置する
function interleavePrompts(prompts: Prompt[], counts: { elements: number; brand: number; creative: number }): Prompt[] {
  const elementPrompts = prompts.filter(p => p.mode === 'elements');
  const brandPrompts = prompts.filter(p => p.mode === 'brand');
  const creativePrompts = prompts.filter(p => p.mode === 'creative');
  
  const result: Prompt[] = [];
  const maxCount = Math.max(counts.elements, counts.brand, counts.creative);
  
  for (let i = 0; i < maxCount; i++) {
    if (i < elementPrompts.length) result.push(elementPrompts[i]);
    if (i < brandPrompts.length) result.push(brandPrompts[i]);
    if (i < creativePrompts.length) result.push(creativePrompts[i]);
  }
  
  return result;
}

// デフォルトのミックスモード設定
export function getDefaultMixedSettings(): MixedModeSettings {
  return {
    elementsRatio: 34,
    brandRatio: 33,
    creativeRatio: 33,
    balanceMode: 'equal',
    shuffleOrder: true
  };
}

// プリセット設定
export const mixedModePresets = {
  balanced: {
    name: 'バランス重視',
    description: '3つのモードを均等に生成',
    settings: {
      elementsRatio: 34,
      brandRatio: 33,
      creativeRatio: 33,
      balanceMode: 'equal' as const,
      shuffleOrder: true
    }
  },
  
  creative_focused: {
    name: 'Creative重視',
    description: 'Creativeモードを多めに生成',
    settings: {
      elementsRatio: 20,
      brandRatio: 30,
      creativeRatio: 50,
      balanceMode: 'custom' as const,
      shuffleOrder: true
    }
  },
  
  traditional_focused: {
    name: '伝統的重視',
    description: '要素ベースとブランドベースを多めに生成',
    settings: {
      elementsRatio: 45,
      brandRatio: 45,
      creativeRatio: 10,
      balanceMode: 'custom' as const,
      shuffleOrder: true
    }
  },
  
  random_mix: {
    name: 'ランダムミックス',
    description: '毎回異なる比率でランダム生成',
    settings: {
      elementsRatio: 0,
      brandRatio: 0,
      creativeRatio: 0,
      balanceMode: 'random' as const,
      shuffleOrder: true
    }
  }
};

// バリデーション関数
export function validateMixedSettings(settings: MixedModeSettings): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (settings.balanceMode === 'custom') {
    const totalRatio = settings.elementsRatio + settings.brandRatio + settings.creativeRatio;
    if (totalRatio === 0) {
      errors.push('カスタムモードでは少なくとも1つのモードの比率を0より大きくしてください');
    }
    
    if (settings.elementsRatio < 0 || settings.brandRatio < 0 || settings.creativeRatio < 0) {
      errors.push('比率は0以上の値を入力してください');
    }
    
    if (settings.elementsRatio > 100 || settings.brandRatio > 100 || settings.creativeRatio > 100) {
      errors.push('比率は100以下の値を入力してください');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}