// services/dataService.ts - 簡素化版
import { Brand, PhraseVariations, RawBrand, AppSettings, Prompt } from '../types';
import { convertBrands, convertPhraseVariations } from '../utils/dataUtils';

// ローカルストレージのキー
const FAVORITES_KEY = 'odfg_favorites';
const SETTINGS_KEY = 'odfg_settings';
const HISTORY_KEY = 'odfg_history';

// デフォルト設定
const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  promptCount: 5,
  includeAspectRatio: true,
  aspectRatio: "--ar 4:5",
  includeVersion: true,
  version: "--v 7.0",
  includeStylize: true,
  stylize: "s100",
  customSuffix: '',
  // V2設定
  generationMode: 'elements',
  includeSeasonalConsistency: true,
  includeColorHarmony: true,
  creativityLevel: 'balanced',
  cameraAngle: 'random',
  // カラーパレット設定
  useColorPalette: false,
  selectedColorPalette: undefined,
  customColors: []
};

// アスペクト比オプション
export const ASPECT_RATIO_OPTIONS = [
  { label: "4:5 (縦長 - Instagram推奨)", value: "--ar 4:5" },
  { label: "16:9 (横長 - 風景向け)", value: "--ar 16:9" },
  { label: "9:16 (スマホ縦向き)", value: "--ar 9:16" },
  { label: "1:1 (正方形)", value: "--ar 1:1" },
  { label: "3:2 (写真標準)", value: "--ar 3:2" },
];

// スタイライズオプション
export const STYLIZE_OPTIONS = [
  { label: "s0 (スタイライズなし)", value: "s0" },
  { label: "s100 (軽度スタイライズ - デフォルト)", value: "s100" },
  { label: "s200 (中程度スタイライズ)", value: "s200" },
  { label: "s300 (強めスタイライズ)", value: "s300" },
  { label: "s400 (かなり強めスタイライズ)", value: "s400" },
  { label: "s500 (非常に強めスタイライズ)", value: "s500" },
  { label: "s1000 (最大スタイライズ)", value: "s1000" },
];

// バージョンオプション
export const VERSION_OPTIONS = [
  { label: "v7.0 (最新版)", value: "--v 7.0" },
  { label: "v6.1 (旧バージョン)", value: "--v 6.1" },
];

// 人種オプション
export const ETHNICITY_OPTIONS = [
  { label: "ランダム", value: "ランダム" },
  { label: "白人", value: "白人" },
  { label: "黒人", value: "黒人" },
  { label: "アジア人", value: "アジア人" },
];

// 性別オプション
export const GENDER_OPTIONS = [
  { label: "ランダム", value: "ランダム" },
  { label: "男性", value: "男" },
  { label: "女性", value: "女" },
];

// グローバルデータキャッシュ
let globalBrands: Brand[] = [];
let globalPhraseVariations: PhraseVariations | null = null;
let dataLoaded = false;

/**
 * メインのデータ読み込み関数（一括読み込み）
 */
export async function loadInitialData(): Promise<{ brands: Brand[], phraseVariations: PhraseVariations }> {
  // 既に読み込み済みの場合はキャッシュを返す
  if (dataLoaded && globalBrands.length > 0 && globalPhraseVariations) {
    return {
      brands: globalBrands,
      phraseVariations: globalPhraseVariations
    };
  }

  try {
    console.log('データベースからデータを読み込み中...');
    
    // メインのデータベースJSONファイルを読み込み
    const response = await fetch('/fashion-database.json');
    if (!response.ok) {
      throw new Error(`データベース読み込みエラー: ${response.status} ${response.statusText}`);
    }
    
    const rawData = await response.json();
    
    // データ変換
    const brands = convertBrands(rawData.brands as RawBrand[]);
    const phraseVariations = convertPhraseVariations(rawData);
    
    // キャッシュに保存
    globalBrands = brands;
    globalPhraseVariations = phraseVariations;
    dataLoaded = true;
    
    console.log(`データ読み込み完了: ${brands.length}件のブランド`);
    
    return { brands, phraseVariations };
    
  } catch (error) {
    console.error('データ読み込みエラー:', error);
    
    // フォールバック: 初期データを使用
    const fallbackData = await loadFallbackData();
    return fallbackData;
  }
}

/**
 * フォールバックデータの読み込み
 */
async function loadFallbackData(): Promise<{ brands: Brand[], phraseVariations: PhraseVariations }> {
  console.log('フォールバックデータを読み込み中...');
  
  // 初期データからブランドを作成
  const fallbackBrands: Brand[] = [
    {
      id: 1,
      name: "Chanel",
      eraStart: "1910s",
      eraEnd: "present",
      coreStyle: ["Elegant", "Timeless", "Refined", "Parisian"],
      signatureElements: ["Tweed suits", "Quilted bags", "Chain details", "Camellia flowers", "Double C logo"],
      materials: ["Bouclé tweed", "Quilted leather", "Jersey", "Silk chiffon"],
      silhouettes: ["Boxy jackets", "A-line skirts", "Straight-cut dresses", "Slim trousers"],
      colorPalette: ["Black", "White", "Beige", "Navy", "Gold accents"],
      lighting: ["Soft studio lighting", "Natural window light", "Golden hour"],
      atmosphereMood: ["Elegant", "Sophisticated", "Timeless"],
      settingBackgroundDetail: ["Parisian apartment", "Fashion studio", "Luxury boutique"],
      cameraShotType: ["Full body", "Three-quarter", "Portrait"]
    },
    {
      id: 2,
      name: "Dior",
      eraStart: "1940s",
      eraEnd: "present",
      coreStyle: ["Romantic", "Feminine", "Luxurious", "Structured"],
      signatureElements: ["New Look silhouette", "Bar jacket", "Full skirts", "Cannage pattern", "Lady Dior bag"],
      materials: ["Silk taffeta", "Wool gabardine", "Tulle", "Luxurious embroidery"],
      silhouettes: ["Cinched waists", "Full skirts", "Structured shoulders", "Hourglass figures"],
      colorPalette: ["Blush pink", "Light gray", "Navy blue", "Black", "Red"],
      lighting: ["Dramatic lighting", "Soft romantic lighting", "Studio lighting"],
      atmosphereMood: ["Romantic", "Feminine", "Luxurious"],
      settingBackgroundDetail: ["French garden", "Elegant ballroom", "Fashion atelier"],
      cameraShotType: ["Full body", "Three-quarter", "Detail shot"]
    }
  ];
  
  const fallbackPhraseVariations: PhraseVariations = {
    silhouettes: [
      { base_term: "dress", variations: ["flowing dress", "elegant gown", "structured dress", "draped dress"] },
      { base_term: "suit", variations: ["tailored suit", "power suit", "evening suit", "structured suit"] }
    ],
    materials: [
      { base_term: "silk", variations: ["flowing silk", "lustrous silk", "delicate silk", "raw silk"] },
      { base_term: "wool", variations: ["fine wool", "textured wool", "brushed wool", "merino wool"] }
    ],
    lighting: [
      { base_term: "studio", variations: ["studio lighting", "dramatic lighting", "soft diffused lighting", "natural lighting"] },
      { base_term: "outdoor", variations: ["golden hour lighting", "backlit", "ambient lighting", "dramatic shadows"] }
    ],
    backgrounds: [
      { base_term: "solid", variations: ["solid [color] backdrop", "gradient [color] background", "[color] studio background"] }
    ]
  };
  
  // キャッシュに保存
  globalBrands = fallbackBrands;
  globalPhraseVariations = fallbackPhraseVariations;
  dataLoaded = true;
  
  return { brands: fallbackBrands, phraseVariations: fallbackPhraseVariations };
}

/**
 * レガシーデータの読み込み（下位互換性のため）
 */
export async function loadLegacyFashionData(): Promise<{ brands: Brand[], phraseVariations: PhraseVariations }> {
  return loadInitialData();
}

/**
 * データベース状態の取得（簡素化版）
 */
export async function getDatabaseStatus(): Promise<{
  totalBrands: number;
  loadedBrands: number;
  totalChunks: number;
  loadedChunks: number[];
  lastUpdated: string;
}> {
  // データが読み込まれていない場合は読み込む
  if (!dataLoaded) {
    await loadInitialData();
  }
  
  return {
    totalBrands: globalBrands.length,
    loadedBrands: globalBrands.length,
    totalChunks: 1, // 一括読み込みなので常に1
    loadedChunks: [1], // 常に1つのチャンクとして扱う
    lastUpdated: new Date().toISOString()
  };
}

// 以下の関数は下位互換性のために残す（空の実装）
export async function loadAllChunks(): Promise<{ brands: Brand[], phraseVariations: PhraseVariations }> {
  return loadInitialData();
}

export async function loadBrandChunk(chunkId: number): Promise<Brand[]> {
  const data = await loadInitialData();
  return data.brands;
}

export function resetDatabase(): void {
  globalBrands = [];
  globalPhraseVariations = null;
  dataLoaded = false;
}

/**
 * お気に入りをローカルストレージから読み込む
 */
export function loadFavorites(): Prompt[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('お気に入りの読み込みエラー:', error);
    return [];
  }
}

/**
 * お気に入りをローカルストレージに保存
 */
export function saveFavorites(favorites: Prompt[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('お気に入りの保存エラー:', error);
  }
}

/**
 * プロンプト履歴をローカルストレージから読み込む
 */
export function loadHistory(): Prompt[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('履歴の読み込みエラー:', error);
    return [];
  }
}

/**
 * プロンプト履歴をローカルストレージに保存
 */
export function saveHistory(history: Prompt[]): void {
  try {
    // 最大100件まで保存
    const limitedHistory = history.slice(0, 100);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('履歴の保存エラー:', error);
  }
}

/**
 * 設定をローカルストレージから読み込む
 */
export function loadSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('設定の読み込みエラー:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * 設定をローカルストレージに保存
 */
export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('設定の保存エラー:', error);
  }
}

/**
 * ローカルストレージの全データをクリア
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    resetDatabase();
  } catch (error) {
    console.error('データのクリアエラー:', error);
  }
}