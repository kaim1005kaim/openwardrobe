// カラーパレットデータベース
export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  harmony: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'split-complementary';
  mood: string[];
  season: string[];
  description: string;
  category: 'basic' | 'trend' | 'seasonal' | 'mood' | 'cultural' | 'brand-inspired';
}

export const colorPalettes: ColorPalette[] = [
  // === ベーシックパレット ===
  {
    id: "monochrome-classic",
    name: "モノクロームクラシック",
    colors: ["black", "white", "charcoal grey", "silver"],
    harmony: "monochromatic",
    mood: ["sophisticated", "timeless", "modern", "clean"],
    season: ["all"],
    description: "永遠の定番。どんなスタイルにも合う究極のニュートラル",
    category: "basic"
  },
  {
    id: "earth-tones-warm",
    name: "ウォームアーストーン",
    colors: ["camel", "cognac brown", "terracotta", "cream", "rust orange"],
    harmony: "analogous",
    mood: ["warm", "natural", "comfortable", "grounded"],
    season: ["autumn", "winter"],
    description: "大地の温かみを感じる、自然で上品な色合い",
    category: "basic"
  },
  {
    id: "navy-neutrals",
    name: "ネイビーニュートラル",
    colors: ["navy blue", "cream", "beige", "light grey", "white"],
    harmony: "monochromatic",
    mood: ["sophisticated", "professional", "reliable", "clean"],
    season: ["all"],
    description: "ビジネスからカジュアルまで使える万能パレット",
    category: "basic"
  },

  // === トレンドパレット ===
  {
    id: "korean-minimal",
    name: "韓国ミニマルトーン",
    colors: ["sage green", "cream", "soft beige", "ivory", "dusty pink"],
    harmony: "analogous",
    mood: ["calm", "sophisticated", "understated", "modern"],
    season: ["spring", "autumn"],
    description: "韓国発の洗練されたミニマルスタイルの色調",
    category: "trend"
  },
  {
    id: "y2k-cyber",
    name: "Y2Kサイバー",
    colors: ["silver metallic", "electric blue", "hot pink", "holographic", "neon green"],
    harmony: "complementary",
    mood: ["futuristic", "bold", "energetic", "playful"],
    season: ["spring", "summer"],
    description: "2000年代の未来的なメタリック＆ネオンカラー",
    category: "trend"
  },
  {
    id: "quiet-luxury",
    name: "クワイエットラグジュアリー",
    colors: ["chocolate brown", "champagne", "nude beige", "soft taupe", "pearl white"],
    harmony: "monochromatic",
    mood: ["sophisticated", "understated", "expensive", "timeless"],
    season: ["all"],
    description: "さりげない高級感を演出する上質なニュートラル",
    category: "trend"
  },
  {
    id: "maximalist-joy",
    name: "マキシマリストジョイ",
    colors: ["sunshine yellow", "fuchsia pink", "emerald green", "royal blue", "tangerine orange"],
    harmony: "triadic",
    mood: ["joyful", "bold", "energetic", "creative", "expressive"],
    season: ["spring", "summer"],
    description: "最大限の色彩で喜びを表現するビビッドパレット",
    category: "trend"
  },

  // === 季節パレット ===
  {
    id: "spring-fresh",
    name: "スプリングフレッシュ",
    colors: ["cherry blossom pink", "mint green", "lavender", "butter yellow", "sky blue"],
    harmony: "analogous",
    mood: ["fresh", "romantic", "gentle", "optimistic"],
    season: ["spring"],
    description: "春の新緑と花々を思わせる爽やかなパステル",
    category: "seasonal"
  },
  {
    id: "summer-vibrant",
    name: "サマーバイブラント",
    colors: ["coral pink", "turquoise", "lime green", "sunshine yellow", "white"],
    harmony: "triadic",
    mood: ["energetic", "cheerful", "tropical", "vibrant"],
    season: ["summer"],
    description: "夏の太陽と海を表現する鮮やかなカラー",
    category: "seasonal"
  },
  {
    id: "autumn-harvest",
    name: "オータムハーベスト",
    colors: ["burgundy", "mustard yellow", "olive green", "burnt orange", "deep brown"],
    harmony: "analogous",
    mood: ["warm", "rich", "sophisticated", "cozy"],
    season: ["autumn"],
    description: "秋の収穫と紅葉をイメージした深みのある色調",
    category: "seasonal"
  },
  {
    id: "winter-elegance",
    name: "ウィンターエレガンス",
    colors: ["deep navy", "silver", "icy blue", "pure white", "charcoal"],
    harmony: "monochromatic",
    mood: ["elegant", "cool", "sophisticated", "serene"],
    season: ["winter"],
    description: "冬の清澄で上品な色彩世界",
    category: "seasonal"
  },

  // === ムード別パレット ===
  {
    id: "romantic-dreamy",
    name: "ロマンティックドリーミー",
    colors: ["blush pink", "lavender", "pearl white", "soft gold", "dusty rose"],
    harmony: "analogous",
    mood: ["romantic", "dreamy", "feminine", "gentle"],
    season: ["spring", "summer"],
    description: "夢見るような柔らかなロマンティックカラー",
    category: "mood"
  },
  {
    id: "powerful-confidence",
    name: "パワフルコンフィデンス",
    colors: ["crimson red", "black", "gold", "white", "deep navy"],
    harmony: "complementary",
    mood: ["powerful", "confident", "bold", "commanding"],
    season: ["all"],
    description: "自信と力強さを表現するパワーカラー",
    category: "mood"
  },
  {
    id: "bohemian-earth",
    name: "ボヘミアンアース",
    colors: ["terracotta", "sage green", "dusty pink", "ochre yellow", "warm brown"],
    harmony: "analogous",
    mood: ["free-spirited", "natural", "artistic", "warm"],
    season: ["spring", "autumn"],
    description: "自由で芸術的なボヘミアンスピリット",
    category: "mood"
  },
  {
    id: "cyber-futuristic",
    name: "サイバーフューチャリスティック",
    colors: ["neon blue", "electric purple", "silver chrome", "black", "holographic"],
    harmony: "split-complementary",
    mood: ["futuristic", "high-tech", "mysterious", "edgy"],
    season: ["all"],
    description: "未来的でテクノロジカルな世界観",
    category: "mood"
  },

  // === 文化的パレット ===
  {
    id: "japanese-zen",
    name: "ジャパニーズ禅",
    colors: ["natural beige", "charcoal grey", "moss green", "warm white", "deep brown"],
    harmony: "monochromatic",
    mood: ["serene", "balanced", "natural", "minimalist"],
    season: ["all"],
    description: "日本の禅の精神を表現した静寂な色調",
    category: "cultural"
  },
  {
    id: "french-chic",
    name: "フレンチシック",
    colors: ["navy blue", "cream", "burgundy", "camel", "black"],
    harmony: "triadic",
    mood: ["chic", "sophisticated", "timeless", "elegant"],
    season: ["all"],
    description: "パリの洗練されたエレガンス",
    category: "cultural"
  },
  {
    id: "italian-passion",
    name: "イタリアンパッション",
    colors: ["deep red", "golden yellow", "forest green", "cream", "rich brown"],
    harmony: "triadic",
    mood: ["passionate", "warm", "luxurious", "vibrant"],
    season: ["autumn", "winter"],
    description: "イタリアの情熱的で豊かな色彩感覚",
    category: "cultural"
  },
  {
    id: "scandi-minimal",
    name: "スカンジミニマル",
    colors: ["pure white", "light grey", "muted blue", "natural wood tone", "soft black"],
    harmony: "monochromatic",
    mood: ["clean", "functional", "serene", "modern"],
    season: ["all"],
    description: "北欧の機能美を表現したクリーンなパレット",
    category: "cultural"
  },

  // === ブランドインスパイアパレット ===
  {
    id: "chanel-classic",
    name: "シャネルクラシック",
    colors: ["black", "white", "beige", "gold", "navy"],
    harmony: "monochromatic",
    mood: ["timeless", "elegant", "sophisticated", "luxurious"],
    season: ["all"],
    description: "シャネルの永遠なるエレガンス",
    category: "brand-inspired"
  },
  {
    id: "valentino-red",
    name: "ヴァレンティノレッド",
    colors: ["valentino red", "black", "ivory", "nude", "gold"],
    harmony: "complementary",
    mood: ["passionate", "romantic", "luxurious", "dramatic"],
    season: ["all"],
    description: "ヴァレンティノの象徴的な赤を中心としたパレット",
    category: "brand-inspired"
  },
  {
    id: "tiffany-blue",
    name: "ティファニーブルー",
    colors: ["tiffany blue", "white", "silver", "pearl", "light grey"],
    harmony: "monochromatic",
    mood: ["elegant", "fresh", "luxurious", "dreamy"],
    season: ["spring", "summer"],
    description: "ティファニーの象徴的なブルーの世界",
    category: "brand-inspired"
  },
  {
    id: "hermes-orange",
    name: "エルメスオレンジ",
    colors: ["hermes orange", "brown", "tan", "cream", "gold"],
    harmony: "analogous",
    mood: ["luxury", "craftsmanship", "warm", "sophisticated"],
    season: ["autumn", "spring"],
    description: "エルメスの高級感を表現するオレンジパレット",
    category: "brand-inspired"
  },

  // === 追加のトレンドパレット ===
  {
    id: "gen-z-optimism",
    name: "Gen-Z オプティミズム",
    colors: ["bright yellow", "hot pink", "electric blue", "lime green", "pure white"],
    harmony: "tetradic",
    mood: ["optimistic", "bold", "youthful", "energetic"],
    season: ["spring", "summer"],
    description: "Z世代の楽観的で大胆な色彩感覚",
    category: "trend"
  },
  {
    id: "sustainable-earth",
    name: "サステナブルアース",
    colors: ["olive green", "earth brown", "natural beige", "sage grey", "clay orange"],
    harmony: "analogous",
    mood: ["natural", "sustainable", "grounded", "conscious"],
    season: ["all"],
    description: "環境に配慮した自然素材の色調",
    category: "trend"
  },
  {
    id: "digital-nomad",
    name: "デジタルノマド",
    colors: ["sunset orange", "deep teal", "warm grey", "cream", "copper"],
    harmony: "split-complementary",
    mood: ["adventurous", "modern", "flexible", "connected"],
    season: ["all"],
    description: "自由なライフスタイルを表現するモダンパレット",
    category: "trend"
  }
];

// カラーパレットヘルパー関数
export function getColorPalettesByCategory(category: ColorPalette['category']): ColorPalette[] {
  return colorPalettes.filter(palette => palette.category === category);
}

export function getColorPalettesBySeason(season: string): ColorPalette[] {
  return colorPalettes.filter(palette => palette.season.includes(season));
}

export function getColorPalettesByMood(mood: string): ColorPalette[] {
  return colorPalettes.filter(palette => palette.mood.includes(mood));
}

export function getColorPaletteById(id: string): ColorPalette | undefined {
  return colorPalettes.find(palette => palette.id === id);
}

// カラーハーモニーヘルパー
export function getHarmonyDescription(harmony: ColorPalette['harmony']): string {
  const descriptions = {
    'monochromatic': '同色系の調和：同じ色相の濃淡で構成される落ち着いた組み合わせ',
    'analogous': '類似色の調和：色相環で隣り合う色同士の自然な組み合わせ',
    'complementary': '補色の調和：色相環で正反対の位置にある色同士の強いコントラスト',
    'triadic': '三色調和：色相環を三等分した位置の3色を使った活発な組み合わせ',
    'tetradic': '四色調和：色相環の4つの色を使った豊かで複雑な組み合わせ',
    'split-complementary': '分裂補色：補色の両隣の色を使った調和の取れたコントラスト'
  };
  
  return descriptions[harmony] || '';
}

// カラー名の表示用変換
export const colorDisplayNames: Record<string, string> = {
  // ベーシック
  'black': 'ブラック',
  'white': 'ホワイト',
  'charcoal grey': 'チャコールグレー',
  'silver': 'シルバー',
  'navy blue': 'ネイビーブルー',
  'cream': 'クリーム',
  'beige': 'ベージュ',
  'light grey': 'ライトグレー',
  
  // ウォームトーン
  'camel': 'キャメル',
  'cognac brown': 'コニャックブラウン',
  'terracotta': 'テラコッタ',
  'rust orange': 'ラストオレンジ',
  'chocolate brown': 'チョコレートブラウン',
  
  // パステル
  'sage green': 'セージグリーン',
  'soft beige': 'ソフトベージュ',
  'ivory': 'アイボリー',
  'dusty pink': 'ダスティピンク',
  'lavender': 'ラベンダー',
  'cherry blossom pink': 'チェリーブロッサムピンク',
  'mint green': 'ミントグリーン',
  'butter yellow': 'バターイエロー',
  'sky blue': 'スカイブルー',
  
  // ビビッド
  'electric blue': 'エレクトリックブルー',
  'hot pink': 'ホットピンク',
  'holographic': 'ホログラフィック',
  'neon green': 'ネオングリーン',
  'sunshine yellow': 'サンシャインイエロー',
  'fuchsia pink': 'フューシャピンク',
  'emerald green': 'エメラルドグリーン',
  'royal blue': 'ロイヤルブルー',
  'tangerine orange': 'タンジェリンオレンジ',
  
  // ディープトーン
  'burgundy': 'バーガンディ',
  'mustard yellow': 'マスタードイエロー',
  'olive green': 'オリーブグリーン',
  'burnt orange': 'バーントオレンジ',
  'deep brown': 'ディープブラウン',
  'deep navy': 'ディープネイビー',
  'icy blue': 'アイシーブルー',
  'crimson red': 'クリムゾンレッド',
  
  // 特殊色
  'valentino red': 'ヴァレンティノレッド',
  'tiffany blue': 'ティファニーブルー',
  'hermes orange': 'エルメスオレンジ',
  'natural wood tone': 'ナチュラルウッドトーン'
};

export function getColorDisplayName(colorId: string): string {
  return colorDisplayNames[colorId] || colorId;
}