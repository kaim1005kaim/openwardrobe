// types.ts
export interface RawBrand {
  brand_id: number;
  brand_name: string;
  era_start: string;
  era_end: string;
  core_style: string;
  signature_elements: string;
  materials: string;
  silhouettes: string;
  color_palette: string;
  lighting: string[] | string;
  atmosphere_mood: string[] | string;
  setting_background_detail: string[] | string;
  camera_shot_type: string[] | string;
}

export interface Brand {
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

// 新しいファッション要素の定義
export interface FashionElement {
  id: string;
  name: string;
  category: 'material' | 'silhouette' | 'style_trend' | 'detail' | 'color';
  tags: string[];
  characteristics: string[];
  compatibleWith?: string[]; // 相性の良い他の要素
  seasonal?: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  formality?: 'casual' | 'business' | 'formal' | 'streetwear' | 'all';
}

// 素材の定義
export interface Material extends FashionElement {
  category: 'material';
  description: string;
  keywords: string[];
  season: ('spring' | 'summer' | 'autumn' | 'winter' | 'early_spring' | 'early_autumn' | 'mild_winter' | 'party_season' | 'all')[];
  formality: ('casual' | 'business' | 'formal' | 'business_casual' | 'smart_casual' | 'semi-formal' | 'black-tie' | 'streetwear' | 'sportswear' | 'loungewear' | 'evening_wear' | 'party_wear' | 'clubwear' | 'technical_outerwear' | 'all')[];
  compatibility: string[];
  texture: string;
  weight: 'lightweight' | 'medium' | 'heavy';
  care: string[];
  sustainability: 'low' | 'medium' | 'high' | 'very-low';
  priceRange: 'budget' | 'mid-range' | 'luxury' | 'ultra-luxury';
}

// シルエットの定義
export interface Silhouette extends FashionElement {
  category: 'silhouette';
  description: string;
  keywords: string[];
  bodyTypes: string[];
  occasions: string[];
  seasons: ('spring' | 'summer' | 'autumn' | 'winter' | 'early_spring' | 'early_autumn' | 'mild_winter' | 'party_season' | 'all')[];
  eras: string[];
  compatibility: string[];
  formality: ('casual' | 'business' | 'formal' | 'business_casual' | 'smart_casual' | 'semi-formal' | 'black-tie' | 'streetwear' | 'sportswear' | 'loungewear' | 'evening_wear' | 'party_wear' | 'clubwear' | 'technical_outerwear' | 'all')[];
  ageGroups: string[];
}

// スタイルトレンドの定義
export interface StyleTrend extends FashionElement {
  category: 'style_trend';
  description: string;
  keywords: string[];
  era: string;
  seasons: ('spring' | 'summer' | 'autumn' | 'winter' | 'early_spring' | 'early_autumn' | 'mild_winter' | 'party_season' | 'evening_events' | 'anytime_for_boldness' | 'all-year-party' | 'all')[];
  occasions: string[];
  colors: string[];
  materials: string[];
  compatibility: string[];
  popularity: number;
  formality: ('casual' | 'business' | 'formal' | 'business_casual' | 'smart_casual' | 'semi-formal' | 'black-tie' | 'streetwear' | 'sportswear' | 'loungewear' | 'evening_wear' | 'party_wear' | 'clubwear' | 'technical_outerwear' | 'casual_chic' | 'casual_statement' | 'creative_formal' | 'avant-garde' | 'statement-piece' | 'casual_expressive' | 'understated_business' | 'refined_evening' | 'all')[];
  mood: string[];
}

// プロンプト生成に使用するファッションコンテキスト
export interface FashionContext {
  materials: Material[];
  silhouettes: Silhouette[];
  styleTrends: StyleTrend[];
  colors: string[];
  seasons: string[];
  occasions: string[];
  moods: string[];
  lightingStyles: string[];
  backgrounds: string[];
  cameraAngles: string[];
}

export interface Prompt {
  id: string; // 更新: 文字列IDに変更
  text: string; // 基本プロンプトテキスト
  fullPrompt: string;
  timestamp: Date; // 更新: Date型に変更
  rating: number;
  isFavorite: boolean;
  notes: string; // 更新: resultNotesからnotesに変更
  resultImagePath?: string;
  brandId?: number;
  brandName?: string;
  material?: string;
  silhouette?: string;
  lighting?: string;
  background?: string;
  era?: string;
  styleElements?: string[];
  atmosphereMood?: string;
  settingBackgroundDetail?: string;
  cameraShotType?: string;
  // 新しいV2専用フィールド
  selectedMaterial?: Material;
  selectedSilhouette?: Silhouette;
  selectedStyleTrend?: StyleTrend;
  mode: 'brand' | 'elements' | 'creative' | 'mixed'; // 生成モード（Creativeモード、ミックスモード追加）
  elements?: any; // 選択された要素全体
  creativeElements?: CreativeElements; // Creativeモード用要素
  settings?: AppSettings; // 生成時の設定
}

// Creativeモード用の要素定義
export interface CreativeElements {
  artisticTechnique: string;
  naturalElement: string;
  overlayEffect: string;
  colorMood: string;
  surrealElement: string;
  artistReference: string;
}

export interface PhraseVariationGroup {
  base_term: string;
  variations: string[];
}

export interface PhraseVariations {
  silhouettes: PhraseVariationGroup[];
  materials: PhraseVariationGroup[];
  backgrounds: PhraseVariationGroup[];
  lighting: PhraseVariationGroup[];
  background_styles?: PhraseVariationGroup[] | string[];
  background_color_phrases?: PhraseVariationGroup[] | any[];
  lighting_variations?: PhraseVariationGroup[];
  atmosphere_mood_variations?: PhraseVariationGroup[];
  camera_shot_type_variations?: PhraseVariationGroup[];
  general_silhouette_variations?: PhraseVariationGroup[];
  general_material_variations?: PhraseVariationGroup[];
  sportswear_silhouettes?: PhraseVariationGroup[];
  sportswear_materials?: PhraseVariationGroup[];
}

export interface FilterOptions {
  brands: number[]; // Selected brand IDs
  eras: string[]; // Selected eras like "1920s", "1930s", etc.
  styles: string[]; // Selected style elements
  materials: string[]; // Selected material types
  silhouettes: string[]; // Selected silhouette types
  // 新しいV2フィルター
  selectedMaterials?: string[]; // 選択された素材ID
  selectedSilhouettes?: string[]; // 選択されたシルエットID
  selectedStyleTrends?: string[]; // 選択されたスタイルトレンドID
  seasons?: string[]; // 季節フィルター
  formality?: string[]; // フォーマリティフィルター
  moods?: string[]; // ムードフィルター
}

export interface AspectRatioOption {
  label: string;
  value: string;
}

export interface StyleOption {
  label: string;
  value: string;
}

export interface VersionOption {
  label: string;
  value: string;
}

export interface AppSettings {
  darkMode: boolean;
  promptCount: number; // Number of prompts to generate at once
  includeAspectRatio: boolean;
  aspectRatio: string; // 選択されたアスペクト比
  includeVersion: boolean;
  version: string; // 選択されたバージョン
  includeStylize: boolean;
  stylize: string; // 選択されたスタイライズ値
  customSuffix: string;
  // 新しいV2設定
  generationMode: 'brand' | 'elements' | 'creative' | 'mixed'; // 生成モード（Creativeモード、ミックスモード追加）
  includeSeasonalConsistency: boolean; // 季節的一貫性を考慮
  includeColorHarmony: boolean; // カラーハーモニーを考慮
  creativityLevel: 'conservative' | 'balanced' | 'experimental' | 'maximum'; // 創造性レベル（maximum追加）
  // 撮影角度設定
  cameraAngle: 'random' | 'full-body' | 'portrait'; // 撮影角度選択
  // カラーパレット設定
  useColorPalette: boolean; // カラーパレットを使用するか
  selectedColorPalette?: string; // 選択されたカラーパレットID
  customColors: string[]; // カスタムカラー（最大5色）
}

// Creativeモード用の設定
export interface CreativeSettings {
  artisticTechnique?: string;
  naturalElement?: string;
  overlayEffect?: string;
  colorMood?: string;
  surrealElement?: string;
  artistReference?: string;
  templateIndex?: number;
  fashionDescription?: string;
  randomizeAll?: boolean; // すべてランダム化するか
}

// ミックスモード用の設定
export interface MixedModeSettings {
  elementsRatio: number; // 要素ベースの割合 (0-100)
  brandRatio: number; // ブランドベースの割合 (0-100)
  creativeRatio: number; // Creativeモードの割合 (0-100)
  balanceMode: 'equal' | 'custom' | 'random'; // バランスモード
  shuffleOrder: boolean; // 生成順をシャッフルするか
}
