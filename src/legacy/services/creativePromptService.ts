import { 
  artisticTechniques, 
  naturalElements, 
  overlayEffects, 
  colorMoods, 
  surrealElements, 
  artistReferences,
  creativePromptTemplates,
  creativeSamples
} from '../data/creativeData';
import { AppSettings, Prompt } from '../types';

// Creativeモード用の設定型定義
export interface CreativeSettings {
  artisticTechnique: string;
  naturalElement: string;
  overlayEffect: string;
  colorMood: string;
  surrealElement: string;
  artistReference: string;
  templateIndex: number;
  fashionDescription: string;
}

// ランダム選択ヘルパー関数
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// ファッション要素からの説明生成
function generateFashionDescription(selectedElements: any, settings: AppSettings): string {
  const descriptions = [];
  
  if (selectedElements.material) {
    descriptions.push(selectedElements.material.name);
  }
  
  if (selectedElements.silhouette) {
    descriptions.push(selectedElements.silhouette.name);
  }
  
  if (selectedElements.styleTrend) {
    descriptions.push(`${selectedElements.styleTrend.name} style`);
  }
  
  if (descriptions.length === 0) {
    const fallbackDescriptions = [
      "avant-garde couture piece",
      "flowing silk garment",
      "structured minimalist design",
      "ethereal layered ensemble",
      "sculptural fashion piece",
      "organic draped silhouette"
    ];
    return getRandomItem(fallbackDescriptions);
  }
  
  return descriptions.join(' ');
}

// Creativeプロンプト生成メイン関数
export function generateCreativePrompt(
  settings: AppSettings,
  selectedElements: any,
  creativeSettings?: Partial<CreativeSettings>
): Prompt {
  
  // Creativeモード用パラメータの設定（ランダムまたは指定）
  const params = {
    artisticTechnique: creativeSettings?.artisticTechnique || getRandomItem(artisticTechniques).keywords[0],
    naturalElement: creativeSettings?.naturalElement || getRandomItem(naturalElements).keywords[0],
    overlayEffect: creativeSettings?.overlayEffect || getRandomItem(overlayEffects).keywords[0],
    colorMood: creativeSettings?.colorMood || getRandomItem(colorMoods).keywords[0],
    surrealElement: creativeSettings?.surrealElement || getRandomItem(surrealElements).keywords[0],
    artistReference: creativeSettings?.artistReference || getRandomItem(artistReferences).keywords[0],
    fashionDescription: creativeSettings?.fashionDescription || generateFashionDescription(selectedElements, settings)
  };
  
  // テンプレート選択
  const templateIndex = creativeSettings?.templateIndex ?? Math.floor(Math.random() * creativePromptTemplates.length);
  let template = creativePromptTemplates[templateIndex];
  
  // テンプレートにパラメータを挿入
  const promptText = template
    .replace('{artisticTechnique}', params.artisticTechnique)
    .replace('{fashionDescription}', params.fashionDescription)
    .replace('{naturalElements}', params.naturalElement)
    .replace('{overlayEffects}', params.overlayEffect)
    .replace('{colorMood}', params.colorMood)
    .replace('{surrealElements}', params.surrealElement)
    .replace('{artistReference}', params.artistReference);
  
  // 設定に基づいてサフィックスを追加
  let fullPrompt = promptText;
  
  if (settings.customSuffix) {
    fullPrompt += ` ${settings.customSuffix}`;
  }
  
  // Creativeモード特有の要素を追加
  const creativeElements = {
    artisticTechnique: params.artisticTechnique,
    naturalElement: params.naturalElement,
    overlayEffect: params.overlayEffect,
    colorMood: params.colorMood,
    surrealElement: params.surrealElement,
    artistReference: params.artistReference
  };
  
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    text: promptText,
    fullPrompt: fullPrompt,
    timestamp: new Date(),
    isFavorite: false,
    rating: 0,
    notes: '',
    mode: 'creative',
    elements: selectedElements,
    creativeElements: creativeElements,
    settings: {
      ...settings,
      creativityLevel: 'maximum',
      includeStylize: false // Creativeモードでは--style rawを使用するため
    }
  };
}

// 複数のCreativeプロンプト生成
export function generateMultipleCreativePrompts(
  settings: AppSettings,
  selectedElements: any,
  count: number = 3,
  creativeSettings?: Partial<CreativeSettings>
): Prompt[] {
  const prompts: Prompt[] = [];
  
  for (let i = 0; i < count; i++) {
    // 各プロンプトで異なるランダム要素を使用
    const prompt = generateCreativePrompt(settings, selectedElements, {
      ...creativeSettings,
      // 指定されていない場合は各回ランダムに選択
      ...(creativeSettings?.artisticTechnique ? {} : { artisticTechnique: undefined }),
      ...(creativeSettings?.naturalElement ? {} : { naturalElement: undefined }),
      ...(creativeSettings?.overlayEffect ? {} : { overlayEffect: undefined }),
      ...(creativeSettings?.colorMood ? {} : { colorMood: undefined }),
      ...(creativeSettings?.surrealElement ? {} : { surrealElement: undefined }),
      ...(creativeSettings?.artistReference ? {} : { artistReference: undefined })
    });
    
    prompts.push(prompt);
  }
  
  return prompts;
}

// サンプルプロンプト取得
export function getCreativeSamples() {
  return creativeSamples;
}

// パラメータバリデーション
export function validateCreativeSettings(settings: Partial<CreativeSettings>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // 必要に応じてバリデーションルールを追加
  if (settings.templateIndex !== undefined && 
      (settings.templateIndex < 0 || settings.templateIndex >= creativePromptTemplates.length)) {
    errors.push('Invalid template index');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// データ取得関数
export function getCreativeData() {
  return {
    artisticTechniques,
    naturalElements,
    overlayEffects,
    colorMoods,
    surrealElements,
    artistReferences,
    templates: creativePromptTemplates,
    samples: creativeSamples
  };
}