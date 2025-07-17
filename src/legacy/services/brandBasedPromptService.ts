// services/brandBasedPromptService.ts
import { Brand, AppSettings, FilterOptions, Prompt } from '../types';
import { loadInitialData } from './dataService';
import { colorPalettes, getColorPaletteById } from '../data/colorPalettes';


// ランダム要素選択ヘルパー
function getRandomElement<T>(array: T[]): T {
  if (!array || array.length === 0) {
    throw new Error('配列が空です');
  }
  return array[Math.floor(Math.random() * array.length)];
}

// フィルターに基づいてブランドを選択
function filterBrands(brands: Brand[], filters?: FilterOptions): Brand[] {
  if (!filters) return brands;

  return brands.filter(brand => {
    // ブランドIDフィルター
    if (filters.brands?.length && !filters.brands.includes(brand.id)) {
      return false;
    }

    // 年代フィルター
    if (filters.eras?.length) {
      const brandStartYear = parseBrandYear(brand.eraStart);
      const brandEndYear = brand.eraEnd === 'present' ? new Date().getFullYear() : parseBrandYear(brand.eraEnd);
      
      const matchesEra = filters.eras.some(era => {
        if (era.endsWith('s')) {
          const decadeStart = parseInt(era.replace('s', ''));
          const decadeEnd = decadeStart + 9;
          return brandEndYear >= decadeStart && brandStartYear <= decadeEnd;
        } else {
          const year = parseInt(era);
          return !isNaN(year) && year >= brandStartYear && year <= brandEndYear;
        }
      });

      if (!matchesEra) return false;
    }

    // スタイルフィルター
    if (filters.styles?.length) {
      const hasMatchingStyle = brand.coreStyle.some(style => 
        filters.styles!.some(filterStyle => 
          style.toLowerCase().includes(filterStyle.toLowerCase())
        )
      );
      if (!hasMatchingStyle) return false;
    }

    return true;
  });
}

function parseBrandYear(yearString: string): number {
  const match = yearString.match(/\d+/);
  if (match) {
    const year = parseInt(match[0]);
    if (year < 100) {
      return year < 50 ? 2000 + year : 1900 + year;
    }
    return year;
  }
  return 0;
}

// カラーパレットの統合
function integrateColorPalette(
  brandColors: string[], 
  settings: AppSettings
): string[] {
  // カラーパレットを使用しない場合は、ブランドの色をそのまま使用
  if (!settings.useColorPalette) {
    return brandColors;
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

  // デフォルトはブランドの色
  return brandColors;
}

// 撮影角度の選択
function getCameraAngle(userPreference: string, brandCameraTypes: string[]): string {
  switch (userPreference) {
    case 'full-body':
      return 'full-body shot';
    case 'portrait':
      return 'portrait shot';
    case 'random':
    default:
      if (brandCameraTypes && brandCameraTypes.length > 0) {
        return getRandomElement(brandCameraTypes);
      }
      const defaultAngles = ['full-body shot', 'portrait shot', 'three-quarter shot'];
      return getRandomElement(defaultAngles);
  }
}

// メインのブランドベースプロンプト生成関数
export async function generateBrandBasedPrompt(
  settings: AppSettings,
  filters?: FilterOptions
): Promise<Prompt> {
  try {
    // データベースからブランドデータを読み込み
    const { brands } = await loadInitialData();
    
    if (!brands || brands.length === 0) {
      throw new Error('ブランドデータが見つかりません');
    }
    console.log('利用可能なブランド数:', brands.length);
    console.log('最初のブランド:', brands[0]?.name);
    
    // フィルターを適用
    const filteredBrands = filterBrands(brands, filters);
    console.log('フィルター後のブランド数:', filteredBrands.length);
    
    if (filteredBrands.length === 0) {
      throw new Error('フィルター条件に一致するブランドがありません');
    }

    // ランダムにブランドを選択
    const selectedBrand = getRandomElement(filteredBrands);
    console.log('選択されたブランド:', selectedBrand.name);
    
    // 要素を選択
    const era = selectedBrand.eraStart;
    const signatureElement = selectedBrand.signatureElements.length > 0 
      ? getRandomElement(selectedBrand.signatureElements)
      : 'signature style';
    const material = selectedBrand.materials.length > 0 
      ? getRandomElement(selectedBrand.materials)
      : 'luxury fabric';
    const silhouette = selectedBrand.silhouettes.length > 0 
      ? getRandomElement(selectedBrand.silhouettes)
      : 'elegant silhouette';
    const lighting = selectedBrand.lighting.length > 0 
      ? getRandomElement(selectedBrand.lighting)
      : 'studio lighting';
    
    // ムードと背景
    const atmosphereMood = selectedBrand.atmosphereMood.length > 0 
      ? getRandomElement(selectedBrand.atmosphereMood)
      : 'sophisticated';
    const background = selectedBrand.settingBackgroundDetail.length > 0 
      ? getRandomElement(selectedBrand.settingBackgroundDetail)
      : 'elegant studio backdrop';
    
    // カラーパレットの統合
    const colors = integrateColorPalette(selectedBrand.colorPalette, settings);
    const primaryColor = colors.length > 0 ? getRandomElement(colors) : 'neutral tone';
    
    // 撮影角度
    const cameraAngle = getCameraAngle(settings.cameraAngle, selectedBrand.cameraShotType);
    
    // プロンプトテキストの構築
    let promptText = `${cameraAngle} of model wearing ${selectedBrand.name} style, `;
    promptText += `featuring ${signatureElement}, `;
    promptText += `${silhouette} in ${material}, `;
    
    console.log('プロンプト構築中 - ブランド名:', selectedBrand.name);
    console.log('構築されたプロンプト（開始部分）:', promptText);
    
    // カラーパレットが指定されている場合のみ色を追加
    if (settings.useColorPalette && (settings.selectedColorPalette || settings.customColors?.length)) {
      promptText += `${primaryColor} color palette, `;
    }
    
    promptText += `${atmosphereMood} mood, `;
    promptText += `${background}, `;
    promptText += `${lighting}, `;
    promptText += `fashion photography`;
    
    // オプション設定を追加
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
    
    console.log('最終プロンプト:', promptText);
    
    // プロンプトオブジェクトの作成
    const now = new Date();
    const prompt: Prompt = {
      id: now.getTime() + Math.floor(Math.random() * 1000),
      fullPrompt: promptText,
      timestamp: now,
      rating: 0,
      isFavorite: false,
      brandId: selectedBrand.id,
      brandName: selectedBrand.name,
      material,
      silhouette,
      lighting,
      background,
      era,
      styleElements: [signatureElement, ...selectedBrand.coreStyle],
      atmosphereMood,
      settingBackgroundDetail: background,
      cameraShotType: cameraAngle,
      generationMode: 'brand'
    };
    
    return prompt;
    
  } catch (error) {
    console.error('ブランドベースプロンプト生成エラー:', error);
    
    // フォールバック: 基本的なプロンプトを生成
    const now = new Date();
    return {
      id: now.getTime() + Math.floor(Math.random() * 1000),
      fullPrompt: `A fashion portrait of model wearing contemporary designer clothing, elegant styling, professional fashion photography ${settings.aspectRatio || ''} ${settings.version || ''}`,
      timestamp: now,
      rating: 0,
      isFavorite: false,
      brandName: 'Contemporary Designer',
      material: 'luxury fabric',
      silhouette: 'contemporary silhouette',
      lighting: 'professional lighting',
      background: 'studio backdrop',
      era: 'contemporary',
      styleElements: ['modern', 'elegant', 'sophisticated'],
      atmosphereMood: 'sophisticated',
      generationMode: 'brand'
    };
  }
}

// 複数のブランドベースプロンプトを生成
export async function generateMultipleBrandBasedPrompts(
  settings: AppSettings,
  count: number = 5,
  filters?: FilterOptions
): Promise<Prompt[]> {
  const prompts: Prompt[] = [];
  
  for (let i = 0; i < count; i++) {
    try {
      const prompt = await generateBrandBasedPrompt(settings, filters);
      prompts.push(prompt);
    } catch (error) {
      console.error(`ブランドプロンプト ${i + 1} 生成エラー:`, error);
    }
  }
  
  // 最低限1つのプロンプトは返す
  if (prompts.length === 0) {
    prompts.push(await generateBrandBasedPrompt(settings, filters));
  }
  
  return prompts;
}

// 利用可能なブランド一覧を取得
export async function getAvailableBrands(): Promise<Brand[]> {
  try {
    const { brands } = await loadInitialData();
    return brands;
  } catch (error) {
    console.error('ブランド一覧取得エラー:', error);
    return [];
  }
}

// 年代別ブランド一覧を取得
export async function getBrandsByEra(era: string): Promise<Brand[]> {
  const brands = await getAvailableBrands();
  return filterBrands(brands, { brands: [], eras: [era], styles: [], materials: [], silhouettes: [] });
}