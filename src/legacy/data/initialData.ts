// 素材データ
export const materials = [
  // --- 既存データの変換と拡充 ---
  {
    id: "cashmere-knit", // 既存ID: knit_cashmere
    name: "カシミアニット",
    description: "カシミアヤギの毛から作られる高級ニット素材。非常に柔らかく軽量で、優れた保温性を持つ。上品な光沢も特徴。",
    keywords: ["cashmere", "knit", "luxury", "soft", "warm", "lightweight", "premium", "fine"],
    season: ["autumn", "winter"],
    formality: ["casual", "business", "formal"], // 既存: all
    compatibility: ["silk", "fine-wool", "satin", "lambskin-leather"], // 指示書に基づき「他の素材名」に変更
    texture: "soft", // 既存: ['soft', 'smooth', 'fine'] から代表的なもの
    weight: "lightweight",
    care: ["hand-wash", "dry-clean"],
    sustainability: "medium", // カシミアの生産背景を考慮
    priceRange: "luxury"
  },
  {
    id: "wool-knit", // 既存ID: knit_wool
    name: "ウールニット",
    description: "羊毛を編んで作られる保温性の高いニット素材。ケーブル編みやチャンキーニットなど多様な表情がある。",
    keywords: ["wool", "knit", "warm", "natural", "versatile", "chunky", "cable-knit"],
    season: ["autumn", "winter"],
    formality: ["casual", "business_casual"], // 既存: all
    compatibility: ["denim", "corduroy", "cotton", "leather"],
    texture: "textured", // 既存: ['textured', 'chunky', 'cable-knit']
    weight: "medium",
    care: ["hand-wash", "dry-clean", "machine-wash-wool-cycle"],
    sustainability: "medium", // 羊毛の生産方法による
    priceRange: "mid-range"
  },
  {
    id: "cotton-knit", // 既存ID: knit_cotton
    name: "コットンニット",
    description: "綿を編んで作られるニット素材。通気性が良く、肌触りが柔らかい。春夏に適している。",
    keywords: ["cotton", "knit", "breathable", "casual", "soft", "lightweight"],
    season: ["spring", "summer", "early_autumn"],
    formality: ["casual"],
    compatibility: ["linen", "denim", "jersey", "ramie"],
    texture: "smooth", // 既存: ['smooth', 'breathable', 'soft']
    weight: "lightweight",
    care: ["machine-wash", "tumble-dry-low"],
    sustainability: "medium", // 通常のコットン
    priceRange: "budget"
  },
  {
    id: "mohair-knit", // 既存ID: knit_mohair
    name: "モヘアニット",
    description: "アンゴラヤギの毛から作られる、光沢があり毛足の長いニット素材。ふわふわとした質感が特徴的。",
    keywords: ["mohair", "knit", "fluffy", "fuzzy", "texture", "statement", "lustrous"],
    season: ["autumn", "winter"],
    formality: ["casual", "semi-formal"], // 既存: casual
    compatibility: ["silk", "satin", "velvet", "fine-wool"],
    texture: "fuzzy", // 既存: ['fuzzy', 'fluffy', 'textured']
    weight: "lightweight",
    care: ["dry-clean", "hand-wash-gentle"],
    sustainability: "medium",
    priceRange: "mid-range"
  },
  {
    id: "raw-denim", // 既存ID: denim_raw
    name: "ローデニム",
    description: "未洗いの硬質なデニム生地。穿き込むことで体に馴染み、独特の色落ち（アタリ）が楽しめる。",
    keywords: ["denim", "raw", "selvedge", "sturdy", "classic", "indigo", "unwashed"],
    season: ["spring", "summer", "autumn", "winter"],
    formality: ["casual", "streetwear"], // 既存: casual
    compatibility: ["cotton-jersey", "chambray", "flannel", "leather"],
    texture: "rough", // 既存: ['rough', 'sturdy', 'structured']
    weight: "heavy",
    care: ["machine-wash-cold-inside-out", "hang-dry", "minimal-washing"],
    sustainability: "medium", // 耐久性は高いが染色工程に注意
    priceRange: "mid-range"
  },
  {
    id: "distressed-denim", // 既存ID: denim_distressed
    name: "ダメージデニム",
    description: "意図的に破れや色落ち、擦り切れなどの加工を施したデニム。エッジの効いたカジュアルスタイルに用いられる。",
    keywords: ["denim", "distressed", "ripped", "faded", "edgy", "street", "worn"],
    season: ["spring", "summer", "autumn"],
    formality: ["casual", "streetwear"],
    compatibility: ["cotton-jersey", "leather", "flannel", "band-tees"],
    texture: "worn", // 既存: ['worn', 'distressed', 'faded']
    weight: "medium",
    care: ["machine-wash-cold-gentle", "hang-dry"],
    sustainability: "low", // 加工が多い
    priceRange: "mid-range"
  },
  {
    id: "black-denim", // 既存ID: denim_black
    name: "ブラックデニム",
    description: "黒色に染められたデニム生地。シックでモダンな印象を与え、幅広いスタイルに合わせやすい。",
    keywords: ["denim", "black", "sleek", "modern", "dark-wash", "versatile"],
    season: ["spring", "summer", "autumn", "winter"], // 既存: autumn, winter のみだったがallに変更
    formality: ["casual", "business_casual", "streetwear"], // 既存: business
    compatibility: ["cotton", "leather", "silk", "poplin"],
    texture: "smooth", // 既存: ['smooth', 'sleek', 'structured']
    weight: "medium",
    care: ["machine-wash-cold-inside-out", "hang-dry-to-preserve-color"],
    sustainability: "medium",
    priceRange: "mid-range"
  },
  {
    id: "organic-cotton", // 既存ID: cotton_organic
    name: "オーガニックコットン",
    description: "農薬や化学肥料を3年以上使用しない畑で栽培された綿花。環境負荷が少なく、肌にも優しい。",
    keywords: ["cotton", "organic", "sustainable", "soft", "natural", "breathable", "eco-friendly"],
    season: ["spring", "summer", "autumn"], // 既存: spring, summer
    formality: ["casual", "loungewear"], // 既存: casual
    compatibility: ["linen", "tencel", "bamboo-fabric", "hemp"],
    texture: "soft", // 既存: ['soft', 'natural', 'breathable']
    weight: "lightweight",
    care: ["machine-wash", "tumble-dry-low"],
    sustainability: "high",
    priceRange: "mid-range"
  },
  {
    id: "vintage-cotton", // 既存ID: cotton_vintage
    name: "ヴィンテージコットン",
    description: "経年変化により柔らかく、風合いが増したコットン素材。独特のフェード感やこなれた雰囲気が特徴。",
    keywords: ["cotton", "vintage", "worn-in", "retro", "faded", "soft", "secondhand-feel"],
    season: ["spring", "summer", "autumn", "winter"], // 既存: spring, summer
    formality: ["casual", "streetwear"], // 既存: casual
    compatibility: ["denim", "corduroy", "flannel", "aged-leather"],
    texture: "worn", // 既存: ['worn', 'soft', 'faded']
    weight: "lightweight",
    care: ["machine-wash-gentle", "hang-dry"],
    sustainability: "high", // リユースやアップサイクルされたもの
    priceRange: "mid-range"
  },
  {
    id: "silk-charmeuse", // 既存ID: silk_charmeuse
    name: "シルクシャルムーズ",
    description: "片面が特に光沢のあるサテン織りのシルク生地。滑らかで流れるようなドレープ性が特徴で、高級感がある。",
    keywords: ["silk", "charmeuse", "luxury", "lustrous", "flowing", "drape", "satin-finish"],
    season: ["spring", "summer", "autumn"], // 既存: spring, summer
    formality: ["formal", "evening_wear", "lingerie"], // 既存: formal
    compatibility: ["lace", "velvet", "fine-wool", "cashmere-knit"],
    texture: "smooth", // 既存: ['smooth', 'lustrous', 'flowing']
    weight: "lightweight",
    care: ["dry-clean", "hand-wash-cold-gentle"],
    sustainability: "low", // シルク生産の環境負荷
    priceRange: "luxury"
  },
  {
    id: "lambskin-leather", // 既存ID: leather_lambskin
    name: "ラムスキンレザー",
    description: "子羊の皮から作られる非常に柔らかく滑らかな革。高級衣料や手袋などに用いられる。",
    keywords: ["leather", "lambskin", "soft", "luxury", "supple", "buttery", "premium-leather"],
    season: ["autumn", "winter", "spring"],
    formality: ["casual", "business_casual", "luxury_streetwear", "semi-formal"], // 既存: all
    compatibility: ["wool-knit", "cashmere-knit", "silk", "denim"],
    texture: "smooth", // 既存: ['smooth', 'supple', 'soft']
    weight: "medium",
    care: ["professional-leather-clean", "spot-clean-with-damp-cloth"],
    sustainability: "low", // 動物由来、なめし工程
    priceRange: "ultra-luxury"
  },
  {
    id: "ripstop-nylon", // 既存ID: nylon_ripstop
    name: "リップストップナイロン",
    description: "格子状に太いナイロン繊維を織り込むことで、裂け（rip）にくくした（stop）生地。軽量で耐久性、撥水性に優れる。",
    keywords: ["nylon", "ripstop", "technical", "durable", "lightweight", "water-resistant", "outdoor"],
    season: ["spring", "summer", "autumn"],
    formality: ["casual", "streetwear", "sportswear", "technical_outerwear"], // 既存: streetwear
    compatibility: ["fleece", "mesh", "technical-cotton", "performance-fabrics"],
    texture: "smooth", // 既存: ['smooth', 'technical', 'crisp'] (crispは表現として残しても良い)
    weight: "lightweight",
    care: ["machine-wash-cold", "hang-dry"],
    sustainability: "low", // 石油由来
    priceRange: "mid-range"
  },

  // --- 新規追加素材 ---
  // 高級素材
  {
    id: "angora-knit",
    name: "アンゴラニット",
    description: "アンゴラウサギの毛から作られる非常に柔らかく、ふわふわとした毛足の長いニット素材。保温性が高く軽量。",
    keywords: ["angora", "knit", "luxury", "soft", "fluffy", "warm", "lightweight", "hairy"],
    season: ["autumn", "winter"],
    formality: ["casual", "semi-formal"],
    compatibility: ["silk", "fine-wool", "cashmere-knit", "satin"],
    texture: "fluffy",
    weight: "lightweight",
    care: ["dry-clean", "hand-wash-very-gentle"],
    sustainability: "low", // 動物福祉の懸念
    priceRange: "luxury"
  },
  {
    id: "silk-twill",
    name: "シルクツイル",
    description: "綾織りのシルク生地で、独特の光沢としなやかさ、斜めの織り模様が特徴。スカーフや高級ブラウス、ドレスなどに用いられる。",
    keywords: ["silk", "twill", "luxury", "lustrous", "smooth", "drape", "diagonal-weave"],
    season: ["spring", "summer", "autumn", "winter"],
    formality: ["business", "formal", "black-tie"],
    compatibility: ["cashmere-knit", "fine-wool", "lace", "velvet"],
    texture: "smooth",
    weight: "lightweight",
    care: ["dry-clean"],
    sustainability: "low",
    priceRange: "luxury"
  },
  {
    id: "satin",
    name: "サテン",
    description: "朱子織りの生地で、表面が非常に滑らかで強い光沢を持つ。シルク、ポリエステル、アセテートなどで作られる。",
    keywords: ["satin", "lustrous", "smooth", "glossy", "elegant", "flowing", "evening-wear"],
    season: ["spring", "summer", "autumn", "winter"], // 用途による
    formality: ["formal", "evening_wear", "lingerie", "semi-formal"],
    compatibility: ["lace", "velvet", "silk-charmeuse", "sequins"],
    texture: "glossy",
    weight: "lightweight", // or medium
    care: ["dry-clean", "hand-wash-cold-gentle"], // 素材による
    sustainability: "low", // シルクやポリエステルなど原料による
    priceRange: "mid-range" // (ポリエステルサテン) to luxury (シルクサテン)
  },
  {
    id: "lace",
    name: "レース",
    description: "透かし模様が特徴の繊細な生地。リバーレース、シャンティレースなど様々な種類があり、装飾的効果が高い。",
    keywords: ["lace", "delicate", "transparent", "ornamental", "romantic", "feminine", "intricate"],
    season: ["spring", "summer", "autumn", "winter"], // アクセントとして
    formality: ["formal", "evening_wear", "bridal", "lingerie", "semi-formal"],
    compatibility: ["silk", "satin", "velvet", "tulle", "cotton-voile"],
    texture: "textured",
    weight: "lightweight",
    care: ["hand-wash-cold-gentle", "dry-clean"],
    sustainability: "low", // 製造工程
    priceRange: "mid-range" // to luxury
  },
  // 機能性素材
  {
    id: "gore-tex",
    name: "ゴアテックス",
    description: "防水性、透湿性、防風性に優れた高機能素材。アウトドアウェアやテクニカルアウターに広く使用される。",
    keywords: ["gore-tex", "waterproof", "breathable", "windproof", "technical", "outdoor", "performance"],
    season: ["spring", "autumn", "winter"],
    formality: ["sportswear", "technical_outerwear", "casual"],
    compatibility: ["fleece", "ripstop-nylon", "merino-wool", "softshell"],
    texture: "smooth", // or slightly textured
    weight: "medium",
    care: ["machine-wash-warm-gentle", "tumble-dry-medium", "special-detergent-recommended"],
    sustainability: "low", // フッ素化合物使用のため議論あり
    priceRange: "luxury"
  },
  {
    id: "neoprene",
    name: "ネオプレン",
    description: "合成ゴムの一種で、伸縮性、保温性、耐水性に優れる。ウェットスーツの他、ファッションアイテムにも使われる。",
    keywords: ["neoprene", "synthetic-rubber", "stretch", "insulating", "water-resistant", "scuba", "structured"],
    season: ["spring", "autumn", "winter"], // 用途による
    formality: ["sportswear", "streetwear", "avant-garde"],
    compatibility: ["lycra", "mesh", "technical-fabrics", "jersey"],
    texture: "smooth", // or rubbery
    weight: "medium", // or heavy
    care: ["hand-wash-cold", "hang-dry-away-from-sunlight"],
    sustainability: "low", // 石油由来、リサイクル難しい
    priceRange: "mid-range"
  },
  {
    id: "merino-wool",
    name: "メリノウール",
    description: "メリノ種の羊から採れる高品質なウール。繊維が細く、肌触りが柔らかで、保温性と通気性に優れる。",
    keywords: ["merino-wool", "wool", "soft", "fine", "breathable", "thermoregulating", "performance", "natural"],
    season: ["spring", "autumn", "winter"],
    formality: ["casual", "sportswear", "business_casual"],
    compatibility: ["cotton", "silk", "cashmere-knit", "performance-fabrics"],
    texture: "soft",
    weight: "lightweight", // or medium
    care: ["machine-wash-wool-cycle-cold", "lay-flat-to-dry"],
    sustainability: "medium", // 適切な飼育方法なら比較的高め
    priceRange: "mid-range" // to luxury
  },
  {
    id: "bamboo-fabric",
    name: "バンブー（竹）素材",
    description: "竹の繊維から作られる再生セルロース繊維。柔らかく、通気性、吸湿性に優れ、抗菌性もあるとされる。",
    keywords: ["bamboo", "rayon", "sustainable-alternative", "soft", "breathable", "hypoallergenic", "eco-friendly-potential"],
    season: ["spring", "summer"],
    formality: ["casual", "loungewear", "sportswear"],
    compatibility: ["organic-cotton", "tencel", "linen", "jersey"],
    texture: "smooth",
    weight: "lightweight",
    care: ["machine-wash-cold-gentle", "hang-dry"],
    sustainability: "medium", // 成長は早いが化学処理が必要な場合も
    priceRange: "mid-range"
  },
  // エコ素材
  {
    id: "tencel-lyocell",
    name: "テンセル™（リヨセル）",
    description: "ユーカリなどの木材パルプから作られる再生セルロース繊維。環境負荷の少ない製法で、柔らかくドレープ性がある。",
    keywords: ["tencel", "lyocell", "sustainable", "eco-friendly", "soft", "drapey", "breathable", "cellulose-fiber"],
    season: ["spring", "summer", "autumn"],
    formality: ["casual", "business_casual", "loungewear"],
    compatibility: ["organic-cotton", "linen", "silk", "rayon"],
    texture: "smooth",
    weight: "lightweight", // or medium
    care: ["machine-wash-cold-gentle", "hang-dry", "iron-low-heat"],
    sustainability: "high", // クローズドループ製法
    priceRange: "mid-range"
  },
  {
    id: "recycled-polyester",
    name: "リサイクルポリエステル",
    description: "使用済みのペットボトルなどを原料として再生されたポリエステル繊維。バージンポリエステルに比べ環境負荷が低い。",
    keywords: ["recycled-polyester", "sustainable", "eco-friendly", "durable", "synthetic", "rPET"],
    season: ["spring", "summer", "autumn", "winter"], // 用途による
    formality: ["casual", "sportswear", "outerwear"],
    compatibility: ["organic-cotton", "fleece", "nylon", "spandex"],
    texture: "smooth", // or other polyester textures
    weight: "medium", // or lightweight
    care: ["machine-wash", "tumble-dry-low"],
    sustainability: "medium", // リサイクルだがマイクロプラスチック問題あり
    priceRange: "budget" // to mid-range
  },
  {
    id: "linen",
    name: "リネン（亜麻）",
    description: "亜麻の繊維から作られる天然素材。通気性、吸湿性に優れ、丈夫で独特のシャリ感がある。夏に適している。",
    keywords: ["linen", "natural", "breathable", "durable", "summer-fabric", "crisp", "sustainable-potential"],
    season: ["spring", "summer"],
    formality: ["casual", "resort-wear", "business_casual"],
    compatibility: ["cotton", "ramie", "viscose", "silk-blends"],
    texture: "textured", // or crisp
    weight: "lightweight", // or medium
    care: ["machine-wash-cold-gentle", "hang-dry", "iron-damp"],
    sustainability: "high", // 栽培に農薬少なくて済む
    priceRange: "mid-range"
  },
  // テクスチャー系
  {
    id: "velvet",
    name: "ベルベット",
    description: "短い毛羽（パイル）が密集した、柔らかく光沢のある生地。ドレッシーで高級感がある。",
    keywords: ["velvet", "pile-fabric", "plush", "lustrous", "soft", "luxury", "evening-wear"],
    season: ["autumn", "winter"],
    formality: ["formal", "evening_wear", "black-tie", "semi-formal"],
    compatibility: ["silk", "satin", "lace", "chiffon", "brocade"],
    texture: "plush",
    weight: "medium", // or heavy
    care: ["dry-clean"],
    sustainability: "low", // 素材（シルク、レーヨン、ポリエステル等）による
    priceRange: "mid-range" // to luxury
  },
  {
    id: "corduroy",
    name: "コーデュロイ",
    description: "縦畝（うね）が特徴のパイル織物の一種。保温性があり、カジュアルからややフォーマルなアイテムまで使われる。",
    keywords: ["corduroy", "ribbed", "textured", "vintage-feel", "durable", "warm", "casual"],
    season: ["autumn", "winter", "early_spring"],
    formality: ["casual", "business_casual"],
    compatibility: ["denim", "flannel", "wool-knit", "cotton-twill"],
    texture: "ribbed",
    weight: "medium", // or heavy
    care: ["machine-wash-cold-inside-out", "tumble-dry-low"],
    sustainability: "medium", // 主にコットン製
    priceRange: "mid-range"
  },
  {
    id: "jacquard",
    name: "ジャカード",
    description: "ジャカード織機で作られる、複雑で立体的な紋様が織り出された生地。ブロケードやダマスクもジャカードの一種。",
    keywords: ["jacquard", "patterned", "textured", "ornamental", "brocade", "damask", "luxury"],
    season: ["autumn", "winter", "special_occasion"],
    formality: ["formal", "evening_wear", "black-tie", "statement-piece"],
    compatibility: ["silk", "velvet", "satin", "wool"],
    texture: "textured", // and patterned
    weight: "medium", // or heavy
    care: ["dry-clean"],
    sustainability: "low", // 製造工程が複雑
    priceRange: "luxury"
  },
  // 特殊素材
  {
    id: "pvc-vinyl",
    name: "PVC（ポリ塩化ビニル）",
    description: "光沢のあるプラスチック素材。防水性があり、未来的またはエッジの効いたファッションに使われる。",
    keywords: ["pvc", "vinyl", "shiny", "waterproof", "futuristic", "edgy", "fetish-inspired"],
    season: ["spring", "autumn"], // 通気性がないため注意
    formality: ["streetwear", "clubwear", "avant-garde", "statement-piece"],
    compatibility: ["mesh", "fishnet", "black-denim", "faux-leather"],
    texture: "glossy",
    weight: "medium",
    care: ["wipe-clean"],
    sustainability: "very-low",
    priceRange: "budget" // to mid-range
  },
  {
    id: "metallic-fabric",
    name: "メタリック素材",
    description: "金属のような光沢を持つ生地。ラメ糸の使用、コーティング、箔押しなどで作られ、華やかな印象を与える。",
    keywords: ["metallic", "shiny", "shimmering", "lame", "foil", "futuristic", "glamorous", "party-wear"],
    season: ["autumn", "winter", "party_season"],
    formality: ["evening_wear", "party_wear", "clubwear", "statement-piece"],
    compatibility: ["black-denim", "velvet", "satin", "leather"],
    texture: "smooth", // or textured depending on type
    weight: "lightweight", // or medium
    care: ["spot-clean", "hand-wash-gentle-inside-out"], // 素材による
    sustainability: "low",
    priceRange: "mid-range"
  },
  {
    id: "sequins",
    name: "スパンコール（シークイン）",
    description: "小さな光る円盤状の飾りが多数縫い付けられた、または接着された生地。非常に華やかで、舞台衣装やパーティードレスに使われる。",
    keywords: ["sequins", "sparkly", "shimmering", "glamorous", "party-wear", "evening-wear", "statement"],
    season: ["party_season", "evening_events"],
    formality: ["evening_wear", "black-tie", "party_wear", "performance"],
    compatibility: ["velvet", "satin", "chiffon", "mesh"],
    texture: "textured", // and sparkly
    weight: "medium", // or heavy
    care: ["spot-clean", "hand-wash-very-gentle-inside-out"],
    sustainability: "very-low", // プラスチック製が多い
    priceRange: "mid-range" // to luxury
  },
  {
    id: "faux-fur",
    name: "フェイクファー（エコファー）",
    description: "動物の毛皮を模して作られた人工素材。倫理的な観点から人気があり、様々な色や毛足のものが存在する。",
    keywords: ["faux-fur", "eco-fur", "artificial-fur", "plush", "warm", "animal-friendly", "statement"],
    season: ["autumn", "winter"],
    formality: ["casual", "streetwear", "evening_wear", "glamorous"],
    compatibility: ["leather", "denim", "satin", "knitwear"],
    texture: "plush",
    weight: "medium", // or heavy
    care: ["dry-clean", "spot-clean", "gentle-brushing"],
    sustainability: "low", // 石油由来が多いがリアルファーよりは良いとされることも
    priceRange: "mid-range"
  },
  {
    id: "patent-leather",
    name: "パテントレザー（エナメル革）",
    description: "表面をエナメル樹脂でコーティングし、強い光沢を出した革または合成皮革。ドレッシーでシャープな印象。",
    keywords: ["patent-leather", "enamel", "glossy", "shiny", "sleek", "formal", "statement-accessory"],
    season: ["autumn", "winter", "spring"], // 靴やバッグなど
    formality: ["formal", "evening_wear", "business", "chic-casual"],
    compatibility: ["wool-suiting", "velvet", "satin", "cashmere-knit"],
    texture: "glossy",
    weight: "medium",
    care: ["wipe-clean-with-soft-cloth", "special-patent-cleaner"],
    sustainability: "low", // コーティングと革/合成皮革のベースによる
    priceRange: "mid-range" // (synthetic) to luxury (real leather)
  },

  // --- 新規追加素材 (Phase 1: +14種類) ---
  
  // プレミアム天然素材
  {
    id: "vicuna-wool",
    name: "ビクーニャウール",
    description: "南米アンデス山脈に生息するビクーニャから採取される世界最高級の動物繊維。軽量で温かく、シルクのような光沢を持つ。",
    keywords: ["vicuna", "luxury", "premium", "rare", "soft", "lightweight", "lustrous", "exclusive"],
    season: ["autumn", "winter"],
    formality: ["formal", "luxury"],
    compatibility: ["silk", "cashmere", "fine-wool", "satin"],
    texture: "ultra-soft",
    weight: "ultra-lightweight",
    care: ["dry-clean-only", "specialist-care"],
    sustainability: "high", // 野生動物保護への配慮
    priceRange: "ultra-luxury"
  },
  {
    id: "alpaca-wool",
    name: "アルパカウール",
    description: "アルパカの毛から作られる高品質な天然繊維。羊毛よりも軽量で温かく、低アレルギー性も特徴。",
    keywords: ["alpaca", "natural", "hypoallergenic", "warm", "lightweight", "sustainable", "premium"],
    season: ["autumn", "winter"],
    formality: ["casual", "business", "formal"],
    compatibility: ["wool", "cashmere", "cotton", "linen"],
    texture: "soft",
    weight: "lightweight",
    care: ["hand-wash", "dry-clean", "gentle-machine-wash"],
    sustainability: "high",
    priceRange: "premium"
  },
  {
    id: "silk-georgette",
    name: "シルクジョーゼット",
    description: "薄手で軽やか、微細なしわ加工が施されたシルク素材。流れるような美しいドレープが特徴的。",
    keywords: ["silk", "georgette", "flowing", "lightweight", "drape", "elegant", "sheer", "luxurious"],
    season: ["spring", "summer", "early_autumn"],
    formality: ["business", "formal", "cocktail"],
    compatibility: ["silk-satin", "chiffon", "crepe", "lace"],
    texture: "crisp",
    weight: "ultra-lightweight",
    care: ["dry-clean", "gentle-hand-wash"],
    sustainability: "medium",
    priceRange: "luxury"
  },

  // 革新的テクニカル素材
  {
    id: "smart-fabric",
    name: "スマートファブリック",
    description: "体温調節機能や抗菌性、形状記憶など、先進技術を組み込んだ次世代素材。機能性とファッション性を両立。",
    keywords: ["smart-textile", "tech-wear", "functional", "innovative", "adaptive", "performance", "future"],
    season: ["all"],
    formality: ["casual", "activewear", "tech-casual"],
    compatibility: ["technical-nylon", "neoprene", "performance-fabrics"],
    texture: "smooth",
    weight: "variable",
    care: ["special-tech-wash", "air-dry"],
    sustainability: "medium",
    priceRange: "premium"
  },
  {
    id: "phase-change-material",
    name: "相変化素材",
    description: "体温に応じて蓄熱・放熱を行う素材。暑い時は冷却し、寒い時は保温する自動調節機能を持つ。",
    keywords: ["pcm", "temperature-regulating", "adaptive", "comfort", "innovative", "thermal-management"],
    season: ["all"],
    formality: ["activewear", "outdoor", "tech-casual"],
    compatibility: ["technical-fabrics", "performance-wear", "smart-textiles"],
    texture: "smooth",
    weight: "medium",
    care: ["machine-wash-cold", "air-dry"],
    sustainability: "medium",
    priceRange: "premium"
  },

  // バイオ・サステナブル素材
  {
    id: "mushroom-leather",
    name: "マッシュルームレザー",
    description: "キノコの菌糸体から作られる革新的なヴィーガンレザー。本革に近い質感を持ちながら環境負荷が低い。",
    keywords: ["mushroom", "mycelium", "vegan-leather", "sustainable", "innovative", "eco-friendly", "biodegradable"],
    season: ["all"],
    formality: ["casual", "business", "eco-luxury"],
    compatibility: ["organic-cotton", "hemp", "recycled-polyester", "sustainable-fabrics"],
    texture: "leather-like",
    weight: "medium",
    care: ["wipe-clean", "avoid-water"],
    sustainability: "very-high",
    priceRange: "premium"
  },
  {
    id: "pineapple-leather",
    name: "パイナップルレザー",
    description: "パイナップルの葉の繊維から作られるサステナブルなヴィーガンレザー。柔軟性と耐久性を兼ね備える。",
    keywords: ["pineapple", "pinatex", "vegan-leather", "sustainable", "fruit-waste", "eco-innovation", "flexible"],
    season: ["all"],
    formality: ["casual", "eco-conscious", "alternative-luxury"],
    compatibility: ["organic-cotton", "hemp", "sustainable-synthetics"],
    texture: "leather-like",
    weight: "medium",
    care: ["gentle-clean", "avoid-soaking"],
    sustainability: "very-high",
    priceRange: "mid-range"
  },
  {
    id: "orange-fiber",
    name: "オレンジファイバー",
    description: "オレンジの搾りかすから作られるシルクのような光沢を持つ素材。ビタミンEを含有し、肌に優しい。",
    keywords: ["orange", "citrus-fiber", "silk-like", "vitamin-enriched", "innovative", "upcycled", "lustrous"],
    season: ["spring", "summer"],
    formality: ["casual", "business", "eco-luxury"],
    compatibility: ["silk", "cotton", "sustainable-fabrics"],
    texture: "silk-like",
    weight: "lightweight",
    care: ["gentle-wash", "dry-flat"],
    sustainability: "very-high",
    priceRange: "premium"
  },

  // 伝統的高級素材
  {
    id: "brocade",
    name: "ブロケード",
    description: "金糸や銀糸を織り込んだ豪華な装飾織物。歴史ある高級素材で、フォーマルウェアに多用される。",
    keywords: ["brocade", "metallic-threads", "ornate", "formal", "traditional", "luxury", "decorative"],
    season: ["autumn", "winter"],
    formality: ["formal", "cocktail", "ceremonial"],
    compatibility: ["silk", "velvet", "satin", "fine-wool"],
    texture: "textured",
    weight: "heavy",
    care: ["dry-clean-only", "professional-care"],
    sustainability: "medium",
    priceRange: "luxury"
  },
  {
    id: "damask",
    name: "ダマスク",
    description: "光沢のある図柄と無光沢の地組織のコントラストが美しい高級織物。エレガントなパターンが特徴。",
    keywords: ["damask", "woven-pattern", "elegant", "contrast", "traditional", "sophisticated", "formal"],
    season: ["all"],
    formality: ["business", "formal", "luxury"],
    compatibility: ["silk", "fine-cotton", "linen", "wool-blend"],
    texture: "smooth",
    weight: "medium",
    care: ["dry-clean", "gentle-wash"],
    sustainability: "medium",
    priceRange: "luxury"
  },
  {
    id: "chiffon",
    name: "シフォン",
    description: "薄手で軽やか、透明感のある素材。ドレープ性に優れ、エレガントな仕上がりになる。",
    keywords: ["chiffon", "sheer", "lightweight", "flowing", "elegant", "feminine", "delicate"],
    season: ["spring", "summer"],
    formality: ["cocktail", "formal", "romantic"],
    compatibility: ["silk", "satin", "lace", "tulle"],
    texture: "sheer",
    weight: "ultra-lightweight",
    care: ["dry-clean", "gentle-hand-wash"],
    sustainability: "medium",
    priceRange: "mid-range"
  },
  {
    id: "organza",
    name: "オーガンザ",
    description: "薄手で張りがあり、透明感のある素材。ボリューム感を出しながらも軽やかな印象を与える。",
    keywords: ["organza", "crisp", "transparent", "structured", "volume", "formal", "bridal"],
    season: ["spring", "summer", "formal-occasions"],
    formality: ["formal", "bridal", "cocktail"],
    compatibility: ["silk", "tulle", "satin", "lace"],
    texture: "crisp",
    weight: "lightweight",
    care: ["dry-clean", "steam-gently"],
    sustainability: "medium",
    priceRange: "premium"
  },

  // パフォーマンス・スポーツ素材
  {
    id: "compression-fabric",
    name: "コンプレッション素材",
    description: "身体に適度な圧力を加えることで血流を促進し、パフォーマンス向上をサポートする機能性素材。",
    keywords: ["compression", "performance", "athletic", "support", "functional", "stretchy", "recovery"],
    season: ["all"],
    formality: ["activewear", "sportswear", "athleisure"],
    compatibility: ["moisture-wicking", "technical-fabrics", "performance-wear"],
    texture: "smooth",
    weight: "medium",
    care: ["machine-wash-cold", "air-dry"],
    sustainability: "medium",
    priceRange: "mid-range"
  },
  {
    id: "moisture-wicking",
    name: "モイスチャーウィック素材",
    description: "汗を素早く吸収・拡散させて乾燥を促進する高機能素材。運動時の快適性を向上させる。",
    keywords: ["moisture-wicking", "quick-dry", "breathable", "performance", "athletic", "comfort"],
    season: ["all"],
    formality: ["activewear", "sportswear", "casual-athletic"],
    compatibility: ["compression-fabric", "technical-synthetics", "performance-wear"],
    texture: "smooth",
    weight: "lightweight",
    care: ["machine-wash", "tumble-dry-low"],
    sustainability: "medium",
    priceRange: "mid-range"
  }
  // 現在の素材数: 約39種類（目標45種類まであと6種類）
];

// シルエットデータ
export const silhouettes = [
  // --- 既存データの変換と拡充 ---
  {
    id: "oversized-sweater", // 既存ID: oversized_sweater
    name: "オーバーサイズセーター",
    description: "肩が落ち、身幅や袖がゆったりとしたデザインのセーター。リラックス感があり、体型をカバーしやすい。",
    keywords: ["oversized", "sweater", "knitwear", "cozy", "relaxed", "slouchy", "comfortable"],
    bodyTypes: ["all", "apple", "rectangle"], // 既存: ['all']
    occasions: ["casual", "weekend", "loungewear", "streetwear"], // 既存: ['casual', 'weekend']
    seasons: ["autumn", "winter", "early_spring"], // 既存: winter
    eras: ["1980s", "1990s", "2010s", "contemporary"],
    compatibility: ["skinny-jeans", "leggings", "slip-dress-layered", "midi-skirt"], // 素材名ではなくアイテム/シルエット名
    formality: ["casual"],
    ageGroups: ["all", "teens", "20s", "30s", "40s", "50s+"]
  },
  {
    id: "fitted-turtleneck", // 既存ID: fitted_turtleneck
    name: "フィットタートルネック",
    description: "体に沿うようにフィットするタートルネックのトップス。首元まで暖かく、レイヤードにも適している。",
    keywords: ["fitted", "turtleneck", "sleek", "minimal", "body-conscious", "layering-piece", "classic"],
    bodyTypes: ["slim", "athletic", "hourglass", "pear"], // 既存: ['slim', 'athletic']
    occasions: ["work", "business_casual", "date", "chic_casual", "layering"], // 既存: ['work', 'date']
    seasons: ["autumn", "winter", "spring"], // 既存: winter
    eras: ["1960s", "1970s", "1990s", "contemporary"],
    compatibility: ["blazer", "a-line-skirt", "wide-leg-trousers", "high-waist-jeans"],
    formality: ["business_casual", "semi-formal", "chic_casual"], // 既存: business
    ageGroups: ["20s", "30s", "40s", "50s+"]
  },
  {
    id: "skinny-jeans", // 既存ID: skinny_jeans
    name: "スキニージーンズ",
    description: "脚のラインにぴったりとフィットする細身のジーンズ。様々なトップスと合わせやすい定番アイテム。",
    keywords: ["skinny-jeans", "fitted", "tapered-leg", "modern", "sleek", "versatile", "denim"],
    bodyTypes: ["slim", "athletic", "hourglass", "apple" /*with longer top*/], // 既存: ['slim', 'athletic']
    occasions: ["casual", "night_out", "streetwear", "daily"], // 既存: ['casual', 'night out']
    seasons: ["spring", "summer", "autumn", "winter"], // 既存: all
    eras: ["2000s", "2010s", "contemporary" /*though less dominant now*/],
    compatibility: ["oversized-sweater", "tunic-top", "blouse", "ankle-boots", "heels"],
    formality: ["casual", "smart_casual"], // 既存: casual
    ageGroups: ["teens", "20s", "30s", "40s"]
  },
  {
    id: "wide-leg-jeans", // 既存ID: wide_leg_jeans
    name: "ワイドレッグジーンズ",
    description: "腰から裾にかけて広がる、ゆったりとしたシルエットのジーンズ。リラックス感とトレンド感を兼ね備える。",
    keywords: ["wide-leg-jeans", "relaxed-fit", "flowing", "retro", "comfortable", "denim", "high-waisted-option"],
    bodyTypes: ["all", "tall", "pear", "rectangle"], // 既存: ['all']
    occasions: ["casual", "weekend", "creative_work", "streetwear"], // 既存: ['casual', 'creative']
    seasons: ["spring", "summer", "autumn", "winter"], // 既存: all
    eras: ["1970s", "1990s", "2020s", "contemporary"],
    compatibility: ["fitted-top", "crop-top", "tucked-in-shirt", "platform-shoes", "sneakers"],
    formality: ["casual", "smart_casual"], // 既存: casual
    ageGroups: ["teens", "20s", "30s", "40s", "50s+"]
  },
  {
    id: "cropped-jeans", // 既存ID: cropped_jeans
    name: "クロップドジーンズ",
    description: "足首が見える丈のジーンズ。すっきりとした印象で、靴のデザインを引き立てる。",
    keywords: ["cropped-jeans", "ankle-length", "modern-cut", "fresh", "denim", "versatile"],
    bodyTypes: ["all", "petite" /*especially good for*/, "slim", "hourglass"], // 既存: ['all']
    occasions: ["casual", "spring", "summer", "weekend", "smart_casual"], // 既存: ['casual', 'spring']
    seasons: ["spring", "summer", "early_autumn"], // 既存: spring
    eras: ["2010s", "contemporary"],
    compatibility: ["blouse", "t-shirt", "sandals", "loafers", "ankle-boots"],
    formality: ["casual", "smart_casual"], // 既存: casual
    ageGroups: ["all"]
  },
  {
    id: "oversized-tee", // 既存ID: oversized_tee
    name: "オーバーサイズTシャツ",
    description: "肩が落ち、身幅が広く、丈も長めなTシャツ。ストリート感のあるリラックスしたスタイルを作る。",
    keywords: ["oversized-tee", "relaxed-fit", "dropped-shoulders", "streetwear", "comfortable", "casual"],
    bodyTypes: ["all", "apple", "rectangle"], // 既存: ['all']
    occasions: ["casual", "streetwear", "loungewear", "weekend"], // 既存: ['casual', 'streetwear']
    seasons: ["spring", "summer", "autumn"], // 既存: summer
    eras: ["1990s", "2010s", "contemporary"],
    compatibility: ["biker-shorts", "leggings", "skinny-jeans", "denim-shorts", "sneakers"],
    formality: ["casual"],
    ageGroups: ["teens", "20s", "30s", "40s"]
  },
  {
    id: "fitted-tee", // 既存ID: fitted_tee
    name: "フィットTシャツ",
    description: "体に程よくフィットするクラシックなTシャツ。一枚でもレイヤードでも活躍する万能アイテム。",
    keywords: ["fitted-tee", "classic-cut", "body-hugging", "versatile", "clean", "basic"],
    bodyTypes: ["slim", "athletic", "hourglass"], // 既存: ['slim', 'athletic']
    occasions: ["casual", "layering", "sportswear", "daily"], // 既存: ['casual', 'layering']
    seasons: ["spring", "summer", "autumn", "winter"], // 既存: summer
    eras: ["timeless", "contemporary"],
    compatibility: ["jeans", "skirts", "shorts", "under-blazer", "cardigan"],
    formality: ["casual"],
    ageGroups: ["all"]
  },
  {
    id: "crop-top", // 既存ID: crop_top
    name: "クロップトップ",
    description: "丈が短く、お腹やウエスト部分が見えるデザインのトップス。ヘルシーで若々しい印象。",
    keywords: ["crop-top", "cropped", "midriff-baring", "short-length", "trendy", "youthful", "summer-style"],
    bodyTypes: ["slim", "athletic", "hourglass", "high-waisted-bottoms-users"], // 既存: ['slim', 'athletic']
    occasions: ["casual", "summer_events", "festivals", "night_out", "beachwear"], // 既存: ['casual', 'summer']
    seasons: ["summer", "late_spring"], // 既存: summer
    eras: ["1980s", "1990s", "2010s", "contemporary"],
    compatibility: ["high-waist-jeans", "high-waist-shorts", "midi-skirt", "wide-leg-pants"],
    formality: ["casual", "party_wear"], // 既存: casual
    ageGroups: ["teens", "20s", "early_30s"]
  },
  {
    id: "a-line-dress", // 既存ID: a_line_dress
    name: "Aラインドレス",
    description: "肩から裾にかけてアルファベットの「A」のように広がるシルエットのドレス。ウエストを強調しすぎず、多くの体型に似合う。",
    keywords: ["a-line-dress", "flared-skirt", "fitted-bodice", "classic", "feminine", "flattering", "versatile"],
    bodyTypes: ["all", "pear", "hourglass", "apple"], // 既存: ['all']
    occasions: ["work", "date", "formal_events", "weddings", "casual_chic"], // 既存: ['work', 'date', 'formal']
    seasons: ["spring", "summer", "autumn", "winter"], // 既存: all (素材による)
    eras: ["1950s", "1960s", "timeless", "contemporary"],
    compatibility: ["cardigan", "blazer", "heels", "flats", "delicate-jewelry"], // アイテム名
    formality: ["business", "semi-formal", "formal", "casual_chic"], // 既存: business
    ageGroups: ["all"]
  },
  {
    id: "slip-dress", // 既存ID: slip_dress
    name: "スリップドレス",
    description: "ランジェリーのような細いストラップとシンプルなデザインのドレス。一枚でも、レイヤードスタイルでも使える。",
    keywords: ["slip-dress", "minimalist", "flowing", "elegant", "satin-like", "lingerie-inspired", "90s-vibe"],
    bodyTypes: ["slim", "hourglass", "rectangle"], // 既存: ['slim', 'curvy']
    occasions: ["date", "evening_events", "summer_parties", "layered-casual"], // 既存: ['date', 'evening']
    seasons: ["summer", "spring", "autumn-layered"], // 既存: summer
    eras: ["1930s", "1990s", "contemporary"],
    compatibility: ["t-shirt-underneath", "oversized-sweater-over", "denim-jacket", "heels", "sneakers-for-casual"],
    formality: ["formal", "semi-formal", "casual_chic"], // 既存: formal
    ageGroups: ["20s", "30s", "40s"]
  },

  // --- 新規追加シルエット ---
  // トップス系
  {
    id: "peplum-top",
    name: "ペプラムトップ",
    description: "ウエスト部分から裾にかけてフレアが広がるデザインのトップス。女性らしいラインを強調し、体型カバー効果も期待できる。",
    keywords: ["peplum-top", "flared-waist", "feminine", "structured", "figure-flattering", "chic"],
    bodyTypes: ["hourglass", "pear", "rectangle", "apple" /* if flare starts high */],
    occasions: ["work", "business_casual", "date", "party", "semi-formal"],
    seasons: ["spring", "summer", "autumn"],
    eras: ["1940s", "1980s", "2010s", "contemporary"],
    compatibility: ["pencil-skirt", "skinny-trousers", "fitted-jeans", "heels"],
    formality: ["business_casual", "semi-formal", "smart_casual"],
    ageGroups: ["20s", "30s", "40s", "50s"]
  },
  {
    id: "asymmetric-top",
    name: "アシンメトリートップ",
    description: "左右非対称なデザインのトップス。ワンショルダートップや不規則なヘムラインなど、個性的でモダンな印象を与える。",
    keywords: ["asymmetric-top", "one-shoulder", "uneven-hem", "modern", "edgy", "statement", "unique"],
    bodyTypes: ["all" /* depends on specific design */, "rectangle", "inverted-triangle"],
    occasions: ["night_out", "party", "creative_events", "fashion-forward-casual"],
    seasons: ["spring", "summer", "autumn"],
    eras: ["1980s", "2000s", "contemporary"],
    compatibility: ["sleek-trousers", "fitted-skirt", "minimalist-bottoms", "statement-earrings"],
    formality: ["semi-formal", "smart_casual", "party_wear"],
    ageGroups: ["20s", "30s", "40s"]
  },
  // ボトムス系
  {
    id: "flare-pants",
    name: "フレアパンツ",
    description: "膝から裾にかけて大きく広がるシルエットのパンツ。脚長効果があり、70年代風のレトロなスタイルにもマッチする。",
    keywords: ["flare-pants", "bell-bottoms", "wide-flare", "leg-lengthening", "retro", "70s-vibe", "bohemian"],
    bodyTypes: ["tall", "hourglass", "pear", "rectangle"],
    occasions: ["casual", "smart_casual", "party", "retro-themed-events"],
    seasons: ["spring", "summer", "autumn", "winter"],
    eras: ["1970s", "late_1990s", "2020s", "contemporary"],
    compatibility: ["fitted-top", "tucked-in-blouse", "platform-shoes", "heeled-boots"],
    formality: ["casual", "smart_casual", "semi-formal"],
    ageGroups: ["teens", "20s", "30s", "40s", "50s+"]
  },
  {
    id: "high-waist-trousers",
    name: "ハイウエストトラウザー",
    description: "ウエストラインが高い位置に設定されたパンツ。脚を長く見せ、クラシックで洗練された印象を与える。",
    keywords: ["high-waist-trousers", "high-rise", "leg-lengthening", "classic", "sophisticated", "tailored"],
    bodyTypes: ["all", "petite" /* can be good */, "hourglass", "pear"],
    occasions: ["work", "business_casual", "formal_events", "smart_casual"],
    seasons: ["spring", "summer", "autumn", "winter"],
    eras: ["1940s", "1980s", "contemporary"],
    compatibility: ["tucked-in-blouse", "fitted-knit", "crop-top-for-balance", "blazer", "heels"],
    formality: ["business", "business_casual", "semi-formal", "smart_casual"],
    ageGroups: ["20s", "30s", "40s", "50s+"]
  },
  // ドレス系
  {
    id: "mermaid-dress",
    name: "マーメイドドレス",
    description: "上半身から膝までは体にフィットし、膝下から魚の尾ひれのように裾が広がるドレス。非常にエレガントでドラマチックなシルエット。",
    keywords: ["mermaid-dress", "fishtail-dress", "fitted-bodice", "flared-hem", "formal", "elegant", "dramatic", "red-carpet"],
    bodyTypes: ["hourglass", "curvy" /* well-defined waist needed */, "slim-with-curves"],
    occasions: ["formal_events", "black-tie", "weddings", "galas", "prom"],
    seasons: ["spring", "summer", "autumn", "winter"], // 素材による
    eras: ["1930s", "1950s", "contemporary_formal_wear"],
    compatibility: ["statement-jewelry", "clutch-bag", "high-heels", "updo-hairstyle"],
    formality: ["formal", "black-tie"],
    ageGroups: ["20s", "30s", "40s", "50s"]
  },
  {
    id: "empire-waist-dress",
    name: "エンパイアウエストドレス",
    description: "バストのすぐ下で切り替えがあり、そこから裾にかけて流れるように広がるドレス。胸元を強調し、お腹周りをカバーする。",
    keywords: ["empire-waist-dress", "high-waistline", "flowing-skirt", "romantic", "feminine", "flattering", "grecian-style-potential"],
    bodyTypes: ["all", "apple", "pear", "petite", "pregnant"],
    occasions: ["casual_chic", "summer_events", "garden_parties", "maternity-wear", "semi-formal"],
    seasons: ["spring", "summer"],
    eras: ["early_1800s_Regency", "1960s_revival", "contemporary"],
    compatibility: ["delicate-sandals", "ballet-flats", "bolero-jacket", "dainty-necklace"],
    formality: ["casual_chic", "semi-formal"],
    ageGroups: ["all"]
  },
  // アウター系
  {
    id: "bomber-jacket",
    name: "ボンバージャケット",
    description: "元々は空軍パイロットのジャケット。短い丈、リブ編みの襟・袖口・裾が特徴。カジュアルでスポーティーな印象。",
    keywords: ["bomber-jacket", "flight-jacket", "MA-1", "casual", "sporty", "streetwear", "versatile-outerwear"],
    bodyTypes: ["all"],
    occasions: ["casual", "streetwear", "weekend", "sporty-look"],
    seasons: ["spring", "autumn", "mild_winter"],
    eras: ["1950s_military", "1980s_fashion", "2010s_revival", "contemporary"],
    compatibility: ["jeans", "t-shirt", "hoodie", "sneakers", "casual-dresses"],
    formality: ["casual", "streetwear"],
    ageGroups: ["all"]
  },
  {
    id: "trench-coat",
    name: "トレンチコート",
    description: "第一次世界大戦時の軍用コートが起源。ダブルブレスト、ベルト、エポレットなどが特徴的なクラシックなアウター。",
    keywords: ["trench-coat", "classic-outerwear", "belted", "double-breasted", "timeless", "sophisticated", "versatile"],
    bodyTypes: ["all"],
    occasions: ["work", "business_casual", "smart_casual", "rainy_days", "travel"],
    seasons: ["spring", "autumn", "mild_winter"],
    eras: ["1900s_military", "timeless_fashion_staple", "contemporary"],
    compatibility: ["suits", "dresses", "jeans-and-sweater", "scarf", "ankle-boots"],
    formality: ["business", "business_casual", "smart_casual"],
    ageGroups: ["all"]
  },

  // --- 新規追加シルエット (Phase 1: +12種類) ---
  
  // トップス系
  {
    id: "off-shoulder-top",
    name: "オフショルダートップ",
    description: "肩を露出したデザインで、女性らしさとエレガンスを演出。春夏に人気の定番スタイル。",
    keywords: ["off-shoulder", "feminine", "elegant", "shoulder-baring", "romantic", "summer-style"],
    seasons: ["spring", "summer"],
    occasions: ["casual", "date", "vacation", "party"],
    bodyTypes: ["all"],
    formality: ["casual", "semi-formal"],
    ageGroups: ["young-adult", "adult"],
    compatibility: ["high-waisted-bottoms", "statement-earrings", "delicate-necklaces", "flowing-skirts"]
  },
  {
    id: "halter-neck-top",
    name: "ホルターネック",
    description: "首の後ろで結ぶデザインで背中が大きく開いたスタイル。セクシーで大胆な印象を与える。",
    keywords: ["halter-neck", "backless", "sexy", "dramatic", "statement", "summer"],
    seasons: ["spring", "summer"],
    occasions: ["party", "date", "vacation", "evening"],
    bodyTypes: ["pear", "rectangle", "inverted-triangle"],
    formality: ["casual", "cocktail", "evening"],
    ageGroups: ["young-adult", "adult"],
    compatibility: ["high-waisted-bottoms", "statement-jewelry", "strappy-sandals"]
  },
  {
    id: "bodysuit",
    name: "ボディスーツ",
    description: "体にフィットし、下部でスナップ留めするワンピース型トップス。スタイリッシュでスマートな印象。",
    keywords: ["bodysuit", "fitted", "sleek", "modern", "streamlined", "versatile"],
    seasons: ["all"],
    occasions: ["casual", "work", "evening", "layering"],
    bodyTypes: ["hourglass", "rectangle", "inverted-triangle"],
    formality: ["casual", "business_casual", "evening"],
    ageGroups: ["young-adult", "adult"],
    compatibility: ["high-waisted-pants", "skirts", "blazers", "statement-bottoms"]
  },
  {
    id: "tube-top",
    name: "チューブトップ",
    description: "肩紐がないスタイルで、胸元でフィットするデザイン。カジュアルからエレガントまで幅広く着用。",
    keywords: ["tube-top", "strapless", "minimal", "summer", "casual", "layering"],
    seasons: ["spring", "summer"],
    occasions: ["casual", "vacation", "layering-piece"],
    bodyTypes: ["hourglass", "pear"],
    formality: ["casual"],
    ageGroups: ["young-adult"],
    compatibility: ["cardigans", "blazers", "high-waisted-bottoms", "statement-accessories"]
  },

  // ボトムス系
  {
    id: "palazzo-pants",
    name: "パラッツォパンツ",
    description: "ウエストから裾にかけて大きく広がる、流れるようなワイドパンツ。エレガントで快適。",
    keywords: ["palazzo", "wide-leg", "flowing", "elegant", "comfortable", "bohemian"],
    seasons: ["spring", "summer", "early_autumn"],
    occasions: ["casual", "vacation", "evening", "relaxed"],
    bodyTypes: ["pear", "apple", "rectangle"],
    formality: ["casual", "resort", "semi-formal"],
    ageGroups: ["all"],
    compatibility: ["fitted-tops", "blouses", "camisoles", "statement-jewelry"]
  },
  {
    id: "capri-pants",
    name: "カプリパンツ",
    description: "ふくらはぎの中間丈の長さのパンツ。カジュアルで実用的、夏の定番アイテム。",
    keywords: ["capri", "cropped", "mid-calf", "casual", "practical", "summer"],
    seasons: ["spring", "summer"],
    occasions: ["casual", "vacation", "outdoor", "relaxed"],
    bodyTypes: ["rectangle", "pear", "inverted-triangle"],
    formality: ["casual"],
    ageGroups: ["adult", "mature"],
    compatibility: ["tops", "blouses", "sandals", "flats"]
  },
  {
    id: "jogger-pants",
    name: "ジョガーパンツ",
    description: "足首部分が絞られたスポーティーなパンツ。カジュアルで快適性を重視したデザイン。",
    keywords: ["jogger", "athletic", "casual", "comfortable", "sporty", "tapered"],
    seasons: ["all"],
    occasions: ["casual", "athletic", "relaxed", "streetwear"],
    bodyTypes: ["all"],
    formality: ["casual", "athleisure"],
    ageGroups: ["young-adult", "adult"],
    compatibility: ["sneakers", "t-shirts", "hoodies", "athletic-wear"]
  },
  {
    id: "cargo-pants",
    name: "カーゴパンツ",
    description: "太ももなどにパッチポケットが付いたユーティリティパンツ。機能的でストリート感のあるデザイン。",
    keywords: ["cargo", "utility", "functional", "streetwear", "pockets", "urban"],
    seasons: ["all"],
    occasions: ["casual", "streetwear", "outdoor", "urban"],
    bodyTypes: ["rectangle", "inverted-triangle"],
    formality: ["casual", "streetwear"],
    ageGroups: ["young-adult", "adult"],
    compatibility: ["t-shirts", "tank-tops", "sneakers", "boots"]
  },

  // ドレス・スカート系
  {
    id: "bodycon-dress",
    name: "ボディコンドレス",
    description: "体のラインにぴったりとフィットするタイトなドレス。セクシーで自信に満ちた印象を与える。",
    keywords: ["bodycon", "fitted", "tight", "sexy", "curve-hugging", "confident"],
    seasons: ["spring", "summer", "evening"],
    occasions: ["party", "date", "evening", "club"],
    bodyTypes: ["hourglass", "rectangle"],
    formality: ["cocktail", "evening", "party"],
    ageGroups: ["young-adult", "adult"],
    compatibility: ["heels", "statement-jewelry", "blazers", "jackets"]
  },
  {
    id: "shirt-dress",
    name: "シャツドレス",
    description: "シャツのディテールを持つドレススタイル。クラシックで versatile、カジュアルからビジネスまで対応。",
    keywords: ["shirt-dress", "versatile", "classic", "button-front", "collar", "timeless"],
    seasons: ["all"],
    occasions: ["casual", "work", "brunch", "everyday"],
    bodyTypes: ["all"],
    formality: ["casual", "business_casual"],
    ageGroups: ["all"],
    compatibility: ["belts", "sneakers", "sandals", "pumps", "cardigans"]
  },
  {
    id: "pleated-skirt",
    name: "プリーツスカート",
    description: "規則的なひだが入ったスカート。クラシックで上品、動きに合わせて美しく揺れる。",
    keywords: ["pleated", "classic", "elegant", "movement", "feminine", "structured"],
    seasons: ["all"],
    occasions: ["work", "casual", "formal", "school"],
    bodyTypes: ["rectangle", "pear", "inverted-triangle"],
    formality: ["casual", "business", "formal"],
    ageGroups: ["all"],
    compatibility: ["blouses", "sweaters", "boots", "heels", "flats"]
  },
  {
    id: "pencil-skirt",
    name: "ペンシルスカート",
    description: "体のラインに沿ったタイトなスカート。プロフェッショナルで洗練された印象を与える。",
    keywords: ["pencil", "fitted", "professional", "sophisticated", "business", "sleek"],
    seasons: ["all"],
    occasions: ["work", "business", "formal", "professional"],
    bodyTypes: ["hourglass", "rectangle", "pear"],
    formality: ["business", "formal", "professional"],
    ageGroups: ["adult", "mature"],
    compatibility: ["blouses", "blazers", "heels", "professional-accessories"]
  },

  // --- Phase 2 拡充: +10種類のシルエット ---
  
  // トップス系追加
  {
    id: "turtle-neck-sweater",
    name: "タートルネックセーター",
    description: "首元まで覆う高い襟が特徴的なセーター。知的で洗練された印象を与え、秋冬の定番アイテム。",
    keywords: ["turtle-neck", "high-collar", "sophisticated", "intellectual", "warm", "classic", "minimalist"],
    bodyTypes: ["all", "hourglass", "rectangle", "inverted-triangle"],
    occasions: ["casual", "work", "weekend", "smart_casual", "winter_events"],
    seasons: ["autumn", "winter", "early_spring"],
    eras: ["1960s", "timeless", "contemporary"],
    compatibility: ["midi-skirt", "straight-pants", "blazer", "wool-coat", "ankle-boots"],
    formality: ["casual", "business_casual", "smart_casual"],
    ageGroups: ["all"]
  },
  {
    id: "wrap-blouse",
    name: "ラップブラウス",
    description: "前身頃を巻きつけるようにして着用するブラウス。ウエストラインを美しく見せ、フェミニンな印象を演出。",
    keywords: ["wrap-style", "feminine", "flattering", "versatile", "flowing", "elegant", "waist-defining"],
    bodyTypes: ["hourglass", "pear", "apple", "rectangle"],
    occasions: ["work", "casual_chic", "date", "business_meeting", "semi-formal"],
    seasons: ["spring", "summer", "early_autumn"],
    eras: ["1940s", "contemporary"],
    compatibility: ["pencil-skirt", "wide-leg-pants", "midi-skirt", "heels", "statement-earrings"],
    formality: ["business", "business_casual", "semi-formal"],
    ageGroups: ["20s", "30s", "40s", "50s+"]
  },
  {
    id: "camisole-top",
    name: "キャミソールトップ",
    description: "細いストラップが特徴的なノースリーブトップス。レイヤードスタイルの基本アイテムとしても人気。",
    keywords: ["camisole", "strappy", "sleeveless", "layering", "lightweight", "feminine", "summer"],
    bodyTypes: ["all", "slim", "hourglass", "rectangle"],
    occasions: ["casual", "summer", "layering", "vacation", "date"],
    seasons: ["spring", "summer"],
    eras: ["1990s", "2000s", "contemporary"],
    compatibility: ["blazer", "cardigan", "high-waisted-jeans", "midi-skirt", "sandals"],
    formality: ["casual", "smart_casual"],
    ageGroups: ["teens", "20s", "30s", "40s"]
  },
  
  // ボトムス系追加
  {
    id: "straight-leg-trousers",
    name: "ストレートレッグトラウザーズ",
    description: "腰から裾まで一直線のラインが美しいパンツ。クラシックで上品、ビジネスシーンにも最適。",
    keywords: ["straight-leg", "classic", "tailored", "professional", "timeless", "structured", "elegant"],
    bodyTypes: ["all", "hourglass", "pear", "rectangle"],
    occasions: ["work", "business", "formal", "smart_casual", "professional_events"],
    seasons: ["all"],
    eras: ["timeless", "contemporary"],
    compatibility: ["blouse", "blazer", "button-down-shirt", "heels", "loafers"],
    formality: ["business", "formal", "professional"],
    ageGroups: ["20s", "30s", "40s", "50s+"]
  },
  {
    id: "high-waisted-shorts",
    name: "ハイウエストショーツ",
    description: "腰の位置が高く設定されたショーツ。脚長効果があり、ヴィンテージ感のあるスタイリングが可能。",
    keywords: ["high-waisted", "vintage-inspired", "leg-lengthening", "retro", "summer", "flattering"],
    bodyTypes: ["hourglass", "pear", "rectangle", "petite"],
    occasions: ["casual", "summer", "vacation", "weekend", "retro_events"],
    seasons: ["spring", "summer"],
    eras: ["1940s", "1950s", "contemporary_revival"],
    compatibility: ["crop-top", "tucked-in-blouse", "vintage-belt", "high-heels", "ankle-boots"],
    formality: ["casual", "smart_casual"],
    ageGroups: ["teens", "20s", "30s", "40s"]
  },
  
  // ドレス系追加
  {
    id: "tea-dress",
    name: "ティードレス",
    description: "午後のお茶の時間に着用されていたエレガントなドレス。膝丈でフェミニン、上品な印象。",
    keywords: ["tea-dress", "midi-length", "feminine", "vintage-inspired", "elegant", "classic", "floral-friendly"],
    bodyTypes: ["hourglass", "pear", "rectangle", "petite"],
    occasions: ["afternoon_tea", "garden_party", "casual_elegant", "brunch", "vintage_events"],
    seasons: ["spring", "summer", "early_autumn"],
    eras: ["1940s", "1950s", "contemporary_vintage"],
    compatibility: ["cardigan", "pearl-necklace", "ballet-flats", "low-heels", "vintage-bag"],
    formality: ["casual_elegant", "semi-formal"],
    ageGroups: ["20s", "30s", "40s", "50s+"]
  },
  {
    id: "slip-dress",
    name: "スリップドレス",
    description: "下着のスリップからインスパイアされた、シンプルで洗練されたドレス。90年代のミニマリズムを象徴。",
    keywords: ["slip-dress", "minimalist", "sleek", "90s-inspired", "satin-like", "effortless", "sophisticated"],
    bodyTypes: ["slim", "hourglass", "rectangle"],
    occasions: ["evening", "date", "party", "minimalist_events", "summer_formal"],
    seasons: ["spring", "summer", "early_autumn"],
    eras: ["1990s", "contemporary"],
    compatibility: ["blazer", "leather-jacket", "strappy-heels", "minimalist-jewelry", "clutch"],
    formality: ["cocktail", "semi-formal", "evening"],
    ageGroups: ["20s", "30s", "40s"]
  },
  
  // アウター系追加
  {
    id: "denim-jacket",
    name: "デニムジャケット",
    description: "カジュアルの代名詞的なジャケット。様々なスタイルに合わせやすく、オールシーズン活躍する万能アイテム。",
    keywords: ["denim-jacket", "casual", "versatile", "timeless", "layering", "americana", "relaxed"],
    bodyTypes: ["all"],
    occasions: ["casual", "weekend", "street_style", "layering", "outdoor"],
    seasons: ["spring", "summer", "autumn", "mild_winter"],
    eras: ["1950s", "timeless", "contemporary"],
    compatibility: ["dress", "t-shirt", "jeans", "skirt", "sneakers", "boots"],
    formality: ["casual"],
    ageGroups: ["all"]
  },
  {
    id: "cardigan-coat",
    name: "カーディガンコート",
    description: "カーディガンのディテールを持つ長めのコート。ニット素材が多く、カジュアルで温かみのある印象。",
    keywords: ["cardigan-coat", "knit-outerwear", "cozy", "long-cardigan", "comfortable", "layering", "soft"],
    bodyTypes: ["all", "apple", "rectangle"],
    occasions: ["casual", "work_casual", "weekend", "autumn_casual", "layering"],
    seasons: ["autumn", "winter", "early_spring"],
    eras: ["contemporary"],
    compatibility: ["jeans", "leggings", "midi-dress", "ankle-boots", "scarves"],
    formality: ["casual", "business_casual"],
    ageGroups: ["20s", "30s", "40s", "50s+"]
  },
  {
    id: "puffer-vest",
    name: "パフベスト",
    description: "中綿入りのノースリーブアウター。機能性とスタイルを兼ね備え、レイヤードスタイルに最適。",
    keywords: ["puffer-vest", "sleeveless-outerwear", "functional", "sporty", "layering", "urban", "practical"],
    bodyTypes: ["all", "athletic", "rectangle"],
    occasions: ["casual", "outdoor", "urban", "sporty", "layering"],
    seasons: ["autumn", "winter", "early_spring"],
    eras: ["contemporary"],
    compatibility: ["long-sleeve-shirt", "hoodie", "jeans", "leggings", "sneakers", "boots"],
    formality: ["casual", "athletic"],
    ageGroups: ["teens", "20s", "30s", "40s"]
  }
  // Phase 2完了: 合計40種類のシルエット
];

// スタイルトレンドデータ
export const styleTrends = [
  // --- 既存データの変換と拡充 ---
  {
    id: "korean-minimal", // 既存ID: korean_minimal
    name: "韓国ミニマル",
    description: "クリーンなライン、ニュートラルな色調、計算されたシンプルさが特徴の韓国発ミニマリズム。洗練された普段着スタイル。",
    keywords: ["korean-fashion", "minimalism", "clean-lines", "neutral-palette", "effortless-chic", "contemporary", "understated-elegance"],
    era: "2010s-2020s", // 既存: 2020s
    seasons: ["spring", "autumn", "winter"], // 既存: all
    occasions: ["daily_wear", "casual_chic", "work_appropriate", "cafe-hopping"], // 既存: allを具体的に
    colors: ["beige", "cream", "ivory", "soft-grey", "white", "black", "muted-blue", "dusty-rose"], // 既存: ['beige', 'cream', 'soft grey', 'white']
    materials: ["cotton-poplin", "light-wool", "cashmere-knit", "tencel", "fine-gauge-knit", "crisp-cotton"],
    compatibility: ["wide-leg-trousers", "oversized-blazer", "fitted-turtleneck", "midi-skirt", "minimalist-sneakers", "loafers"], // シルエット名/アイテム名
    popularity: 90, // 現在の人気度
    formality: ["casual_chic", "business_casual"], // 既存: all
    mood: ["effortless", "sophisticated", "understated", "calm", "modern", "clean"] // 既存: ['effortless', 'sophisticated', 'understated']
  },
  {
    id: "y2k-revival", // 既存ID: y2k_revival
    name: "Y2Kリバイバル",
    description: "2000年代初頭のファッションの再流行。ローライズジーンズ、クロップトップ、カラフルな小物、未来的要素が特徴。",
    keywords: ["y2k", "2000s-fashion", "revival", "nostalgic", "futuristic-elements", "pop-culture", "playful", "bold"],
    era: "2000s (revival in 2020s)", // 既存: 2000s revival
    seasons: ["spring", "summer", "party_season"], // 既存: all
    occasions: ["casual", "streetwear", "parties", "festivals", "clubwear"], // 既存: streetwearを具体的に
    colors: ["hot-pink", "baby-blue", "lime-green", "silver", "holographic", "bright-purple", "juicy-orange"], // 既存: ['silver', 'holographic', 'neon blue', 'hot pink']
    materials: ["denim-distressed", "velour", "mesh", "metallic-fabric", "rhinestones", "pleather", "ribbed-knit"],
    compatibility: ["low-rise-jeans", "crop-top", "mini-skirt", "butterfly-motifs", "chunky-sneakers", "baguette-bag"],
    popularity: 85,
    formality: ["casual", "streetwear", "party_wear"], // 既存: streetwear
    mood: ["fun", "playful", "bold", "experimental", "nostalgic", "sexy", "youthful"] // 既存: ['futuristic', 'bold', 'experimental']
  },
  {
    id: "cottagecore", // 既存ID: cottagecore
    name: "コテージコア",
    description: "田舎での素朴でロマンチックな生活様式にインスパイアされたスタイル。花柄、天然素材、手作り感が特徴。",
    keywords: ["cottagecore", "pastoral", "romantic", "vintage-inspired", "rural-idyll", "nature", "whimsical", "feminine"],
    era: "2010s-2020s", // 既存: 2020s
    seasons: ["spring", "summer"],
    occasions: ["casual", "picnics", "gardening", "weekend_getaway", "relaxed-daily"],
    colors: ["sage-green", "cream", "ivory", "dusty-rose", "lavender", "pale-yellow", "earthy-browns"], // 既存: ['sage green', 'cream', 'dusty rose', 'lavender']
    materials: ["linen", "organic-cotton", "cotton-voile", "gingham", "floral-print-cotton", "lace-details", "broderie-anglaise", "soft-knit"],
    compatibility: ["prairie-dress", "milkmaid-top", "flowy-skirt", "puff-sleeve-blouse", "knitted-cardigan", "straw-hat", "wicker-basket"],
    popularity: 75,
    formality: ["casual", "relaxed_semi-formal"], // 既存: casual
    mood: ["romantic", "nostalgic", "peaceful", "dreamy", "charming", "innocent", "cozy"] // 既存: ['romantic', 'nostalgic', 'peaceful']
  },
  {
    id: "dark-academia", // 既存ID: dark_academia
    name: "ダークアカデミア",
    description: "古典文学や美術、歴史への憧憬を反映した、知的でノスタルジックなスタイル。ツイードやダークカラーが特徴。",
    keywords: ["dark-academia", "academic", "scholarly", "vintage-inspired", "classic-literature", "intellectual", "moody", "traditional"],
    era: "2010s-2020s", // 既存: 2020s
    seasons: ["autumn", "winter"],
    occasions: ["university", "library_visits", "museum_trips", "bookstore-Browse", "smart_casual"],
    colors: ["dark-brown", "burgundy", "forest-green", "navy-blue", "charcoal-grey", "black", "cream", "mustard-yellow-accent"], // 既存: ['dark brown', 'burgundy', 'forest green', 'navy']
    materials: ["tweed", "wool-suiting", "corduroy", "cashmere-knit", "oxford-cloth", "velvet-accents", "leather-details"],
    compatibility: ["blazer", "pleated-skirt", "fitted-turtleneck", "tailored-trousers", "cardigan", "loafer", "satchel-bag", "plaid-scarf"],
    popularity: 80,
    formality: ["business_casual", "smart_casual", "semi-formal"], // 既存: business
    mood: ["intellectual", "mysterious", "scholarly", "nostalgic", "moody", "sophisticated", "classic"] // 既存: ['intellectual', 'mysterious', 'scholarly']
  },
  {
    id: "techwear", // 既存ID: techwear
    name: "テックウェア",
    description: "機能性と都市的な美学を融合させたスタイル。高性能素材、多機能ポケット、未来的なデザインが特徴。",
    keywords: ["techwear", "functional", "urban-utility", "futuristic", "performance-gear", "technical-fabrics", "monochromatic", "modular"],
    era: "2010s-2020s",
    seasons: ["spring", "autumn", "winter"], // 既存: all
    occasions: ["urban_exploration", "streetwear", "commuting", "travel", "casual_tech-focused"],
    colors: ["black", "charcoal-grey", "olive-drab", "navy-blue", "reflective-silver", "neon-accents-optional"], // 既存: ['black', 'charcoal', 'reflective silver', 'neon accents']
    materials: ["gore-tex", "ripstop-nylon", "softshell", "dyneema", "technical-cotton-blends", "waterproof-zippers"],
    compatibility: ["cargo-pants-technical", "multi-pocket-vest", "hooded-shell-jacket", "tactical-bag", "trail-sneakers", "waterproof-boots"],
    popularity: 70,
    formality: ["streetwear", "casual_performance"], // 既存: streetwear
    mood: ["functional", "futuristic", "urban", "utilitarian", "stealthy", "prepared", "edgy"] // 既存: ['functional', 'futuristic', 'urban']
  },
  {
    id: "indie-sleaze", // 既存ID: indie_sleaze
    name: "インディースリーズ",
    description: "2000年代後半から2010年代初頭のインディーズ音楽シーンに影響された、気だるくエッジの効いたスタイル。最近リバイバル。",
    keywords: ["indie-sleaze", "grunge-revival", "effortless-cool", "edgy", "party-scene", "messy-chic", "vintage-inspired", "alternative"],
    era: "late_2000s-early_2010s (revival in 2020s)", // 既存: 2000s revival
    seasons: ["autumn", "winter", "all-year-party"], // 既存: all
    occasions: ["concerts", "parties", "night_out", "casual_streetwear", "art-events"],
    colors: ["black", "faded-denim", "dark-grey", "burgundy", "deep-red", "metallic-accents", "band-tee-colors"], // 既存: ['black', 'faded denim', 'vintage band colors']
    materials: ["distressed-denim", "leather-faux-leather", "band-tees-cotton", "fishnet", "worn-out-knit", "sequins-for-party"],
    compatibility: ["skinny-jeans-ripped", "oversized-tee-band", "leather-jacket", "mini-dress-party", "combat-boots", "messy-hair"],
    popularity: 65, // リバイバル中だがニッチ
    formality: ["streetwear", "casual", "party_wear"], // 既存: streetwear
    mood: ["effortless", "rebellious", "cool", "edgy", "grungy", "nonchalant", "artistic"] // 既存: ['effortless', 'rebellious', 'cool']
  },
  {
    id: "maximalist-color", // 既存ID: maximalist_color
    name: "マキシマリストカラー",
    description: "大胆な色使い、派手な柄の組み合わせ、過剰なまでの装飾を特徴とするスタイル。「その他はその他」の精神。",
    keywords: ["maximalism", "color-blocking", "bold-patterns", "expressive-styling", "more-is-more", "statement-making", "eclectic"],
    era: "2020s",
    seasons: ["spring", "summer", "anytime_for_boldness"], // 既存: summer
    occasions: ["creative_events", "fashion_statements", "parties", "expressive_dailywear"],
    colors: ["bright-pink", "electric-blue", "sunshine-yellow", "emerald-green", "vibrant-orange", "rich-purple", "clashing-colors"], // 既存: ['bright pink', 'electric blue', 'sunshine yellow', 'emerald green']
    materials: ["printed-silk", "jacquard", "sequins", "faux-fur-bright", "colorful-knit", "pvc-colored", "textured-weaves"],
    compatibility: ["pattern-clash-outfits", "statement-coat", "bold-accessories", "colorful-handbag", "platform-shoes", "oversized-jewelry"],
    popularity: 70,
    formality: ["casual_statement", "party_wear", "creative_formal"], // 既存: casual
    mood: ["bold", "expressive", "confident", "playful", "eclectic", "artistic", "joyful"] // 既存: ['bold', 'expressive', 'confident']
  },
  {
    id: "sustainable-chic", // 既存ID: sustainable_chic
    name: "サステナブルシック",
    description: "環境や社会に配慮した素材選び、倫理的な生産背景、長く愛用できるタイムレスなデザインを重視するスタイル。",
    keywords: ["sustainable-fashion", "eco-conscious", "ethical-fashion", "timeless-pieces", "mindful-consumption", "natural-fabrics", "quality-over-quantity"],
    era: "2010s-2020s", // 既存: 2020s
    seasons: ["all"],
    occasions: ["daily_wear", "work_appropriate", "conscious-events", "capsule-wardrobe"],
    colors: ["earth-tones", "natural-beige", "forest-green", "ocean-blue", "undyed-natural", "muted-pastels", "classic-neutrals"], // 既存: ['earth tones', 'natural beige', 'forest green', 'ocean blue']
    materials: ["organic-cotton", "linen", "tencel-lyocell", "recycled-polyester", "hemp-fabric", "bamboo-fabric", "ethical-wool", "upcycled-materials"],
    compatibility: ["classic-trench-coat", "well-made-knitwear", "tailored-trousers-natural-fabric", "simple-midi-dress", "durable-denim", "minimalist-accessories"],
    popularity: 88,
    formality: ["all", "casual_chic", "business_casual", "minimal_formal"],
    mood: ["mindful", "timeless", "conscious", "serene", "understated-elegance", "responsible", "natural"] // 既存: ['mindful', 'timeless', 'conscious']
  },
  {
    id: "japanese-street", // 既存ID: japanese_street
    name: "ジャパニーズストリート",
    description: "原宿ファッションに代表される、多様で独創的な日本のストリートスタイル。レイヤード、異素材ミックス、カワイイ要素などが特徴。",
    keywords: ["japanese-street-fashion", "harajuku-style", "kawaii-aesthetic", "layered-look", "mixed-patterns", "eclectic", "individualistic", "avant-garde-street"],
    era: "1990s-2020s", // 既存: 2000s-2020s
    seasons: ["all"], // レイヤードで調整
    occasions: ["streetwear", "fashion-events", "daily-expression", "subculture-gatherings"],
    colors: ["pastel-pink", "baby-blue", "mint-green", "lavender", "black-and-white-contrasts", "vibrant-neons", "eclectic-mix"], // 既存: ['pastel pink', 'baby blue', 'mint green', 'lavender']
    materials: ["cotton-jersey", "denim-various", "tulle", "lace", "faux-fur", "pvc-vinyl", "printed-fabrics", "knitwear-novelty"],
    compatibility: ["oversized-tee-graphic", "platform-boots", "layered-skirts-and-trousers", "kawaii-accessories", "statement-headwear", "unique-bags"],
    popularity: 75, // 国際的にも影響力
    formality: ["streetwear", "casual_expressive"], // 既存: streetwear
    mood: ["playful", "creative", "expressive", "unique", "bold", "experimental", "kawaii", "edgy-sometimes"] // 既存: ['playful', 'creative', 'expressive']
  },
  {
    id: "scandi-minimalism", // 既存ID: scandi_minimalism
    name: "スカンジミニマリズム",
    description: "北欧デザインの哲学を反映した、機能的でシンプル、クリーンな美しさを持つスタイル。快適さと洗練されたミニマリズムの融合。",
    keywords: ["scandinavian-style", "minimalism", "functional-design", "clean-aesthetics", "effortless-chic", "neutral-palette", "comfortable", "timeless"],
    era: "2010s-2020s",
    seasons: ["all"],
    occasions: ["daily_wear", "work_appropriate", "casual_chic", "minimalist-events"],
    colors: ["white", "grey-tones", "black", "beige", "muted-blue", "pale-pink", "natural-wood-tones-inspired"], // 既存: ['white', 'grey', 'black', 'natural wood tones']
    materials: ["wool-knit-fine", "organic-cotton", "linen", "cashmere-blends", "light-denim", "sustainable-viscose"],
    compatibility: ["straight-leg-trousers", "oversized-shirt", "minimalist-knitwear", "tailored-coat", "simple-sneakers", "functional-bag"],
    popularity: 85,
    formality: ["all", "casual_chic", "business_casual", "understated_formal"],
    mood: ["calm", "functional", "timeless", "serene", "effortless", "sophisticated", "clean", "comfortable"] // 既存: ['calm', 'functional', 'timeless']
  },

  // --- 新規追加トレンド ---
  // 現代トレンド
  {
    id: "quiet-luxury",
    name: "クワイエットラグジュアリー",
    description: "ロゴや派手な装飾を排し、上質な素材と完璧な仕立て、タイムレスなデザインでさりげない高級感を表現するスタイル。",
    keywords: ["quiet-luxury", "stealth-wealth", "understated-elegance", "timeless-design", "high-quality-materials", "minimalist-luxury", "old-money-aesthetic-related"],
    era: "2020s",
    seasons: ["all"],
    occasions: ["daily_luxury", "business_elite", "exclusive-events", "refined_casual"],
    colors: ["navy", "cream", "beige", "camel", "charcoal-grey", "olive-green", "burgundy", "black"],
    materials: ["cashmere-knit", "silk-charmeuse", "fine-wool-suiting", "lambskin-leather", "high-quality-cotton", "vicuna-rarely"],
    compatibility: ["tailored-blazer-perfect-fit", "cashmere-sweater-classic", "silk-blouse-elegant", "well-cut-trousers", "leather-loafers-high-quality", "minimalist-leather-bag"],
    popularity: 92, // 非常に高い現在の人気
    formality: ["business_formal", "smart_casual_luxury", "refined_evening"],
    mood: ["sophisticated", "elegant", "understated", "confident", "timeless", "refined", "exclusive"]
  },
  {
    id: "balletcore",
    name: "バレエコア",
    description: "バレエの練習着や衣装にインスパイアされた、優雅でフェミニンなトレンド。リボン、チュール、ラップデザイン、淡い色彩が特徴。",
    keywords: ["balletcore", "ballet-inspired", "feminine", "graceful", "ethereal", "soft-aesthetic", "ribbons", "tulle", "bodysuits"],
    era: "2020s",
    seasons: ["spring", "summer"],
    occasions: ["casual_chic", "dance-inspired-fashion", "feminine-dailywear", "special-daytime-events"],
    colors: ["pastel-pink", "baby-blue", "white", "cream", "ivory", "light-grey", "dusty-rose", "black-for-contrast"],
    materials: ["tulle", "satin-ribbon", "soft-knit-wraps", "pointelle-knit", "stretch-jersey-bodysuits", "silk-charmeuse-skirts"],
    compatibility: ["wrap-top-ballet", "tulle-skirt-midi", "ballet-flats", "leg-warmers", "bodysuit-layered", "ribbon-details-in-hair"],
    popularity: 80,
    formality: ["casual_chic", "semi-formal-feminine"],
    mood: ["romantic", "delicate", "elegant", "dreamy", "graceful", "feminine", "soft"]
  },
  // クラシック
  {
    id: "preppy",
    name: "プレッピー",
    description: "アメリカ東海岸の名門私立学校（プレパラトリースクール）の学生風ファッション。清潔感があり、伝統的で上品なスタイル。",
    keywords: ["preppy", "ivy-league-style", "classic-american", "collegiate", "traditional", "polished", "smart-casual", "nautical-elements"],
    era: "1950s-present (cyclical revivals)",
    seasons: ["spring", "autumn", "summer-nautical"],
    occasions: ["casual_smart", "weekend_activities", "university-campus", "country_club_events", "yachting"],
    colors: ["navy-blue", "white", "red-accent", "hunter-green", "khaki-beige", "pastel-pink", "light-blue", "madras-plaid"],
    materials: ["oxford-cloth", "cotton-pique-polo", "cable-knit-wool-or-cotton", "tweed-blazer", "chino-twill", "seersucker", "argyle-knit"],
    compatibility: ["polo-shirt", "chino-pants-or-shorts", "button-down-shirt", "blazer-crested", "penny-loafers", "boat-shoes", "argyle-sweater-vest"],
    popularity: 70, // 定番だがトレンドの波あり
    formality: ["casual", "smart_casual", "business_casual-relaxed"],
    mood: ["classic", "refined", "youthful-traditional", "conservative-chic", "sporty-elegant", "clean-cut", "wholesome"]
  },
  {
    id: "parisienne-chic",
    name: "パリシック（パリジェンヌシック）",
    description: "フランス・パリの女性たちのような、努力していないように見える洗練されたスタイル。シンプル、上質、タイムレスが鍵。",
    keywords: ["parisienne-chic", "french-girl-style", "effortless-elegance", "timeless-basics", "understated-sophistication", "neutral-palette", "quality-pieces"],
    era: "timeless",
    seasons: ["all"],
    occasions: ["daily_chic", "work_appropriate", "casual_elegance", "city-strolling"],
    colors: ["black", "white", "navy-blue", "beige", "grey", "red-lipstick-accent", "breton-stripes-blue-white"],
    materials: ["silk-blouse", "fine-wool-knit", "well-fitting-denim", "cotton-trench", "leather-good-quality", "cashmere-scarf"],
    compatibility: ["breton-stripe-top", "straight-leg-jeans", "tailored-blazer", "trench-coat", "ballet-flats", "ankle-boots", "silk-scarf", "minimalist-bag"],
    popularity: 90, // 常に人気のある普遍的スタイル
    formality: ["casual_chic", "smart_casual", "understated_business"],
    mood: ["effortless", "chic", "sophisticated", "confident", "understated", "timeless", "feminine-independent"]
  },

  // --- 新規追加スタイルトレンド (Phase 1: +16種類) ---
  
  // 地域別スタイル
  {
    id: "california-girl",
    name: "カリフォルニアガール",
    description: "西海岸の太陽、サーフィン、ビーチライフにインスパイアされたリラックスした魅力的なスタイル。",
    keywords: ["california", "beach-style", "laid-back", "sun-kissed", "effortless", "coastal", "relaxed-glamour"],
    era: "1960s-2020s",
    seasons: ["spring", "summer", "early_autumn"],
    occasions: ["casual", "vacation", "beach", "outdoor"],
    colors: ["sun-bleached-blonde", "ocean-blue", "coral", "sandy-beige", "sunset-orange", "white"],
    materials: ["denim", "cotton", "linen", "jersey", "crochet"],
    compatibility: ["denim-shorts", "flowing-maxi-dress", "crop-tops", "sandals", "sun-hat"],
    popularity: 80,
    formality: ["casual", "vacation"],
    mood: ["relaxed", "confident", "sunny", "effortless", "beach-vibes"]
  },
  {
    id: "new-york-chic",
    name: "ニューヨークシック",
    description: "都市の洗練されたエネルギーと実用性を体現する、スマートで効率的なスタイル。",
    keywords: ["new-york", "urban-chic", "sophisticated", "practical", "fast-paced", "cosmopolitan"],
    era: "1980s-2020s",
    seasons: ["all"],
    occasions: ["work", "urban", "business", "everyday"],
    colors: ["black", "grey", "navy", "white", "camel"],
    materials: ["wool", "cashmere", "leather", "cotton", "silk"],
    compatibility: ["blazers", "trench-coats", "ankle-boots", "structured-bags"],
    popularity: 85,
    formality: ["business", "smart-casual", "urban-professional"],
    mood: ["confident", "efficient", "sophisticated", "urban", "powerful"]
  },
  {
    id: "milanese-elegance",
    name: "ミラネーゼエレガンス",
    description: "イタリア・ミラノ発祥の、伝統的な技巧と現代的な洗練が融合した上品なスタイル。",
    keywords: ["milanese", "italian-elegance", "refined", "luxurious", "artisanal", "sophisticated"],
    era: "1950s-2020s",
    seasons: ["all"],
    occasions: ["business", "formal", "luxury", "cultural-events"],
    colors: ["deep-navy", "cream", "rich-brown", "burgundy", "gold"],
    materials: ["fine-wool", "silk", "cashmere", "leather", "tweed"],
    compatibility: ["tailored-coats", "silk-scarves", "leather-goods", "fine-jewelry"],
    popularity: 75,
    formality: ["business", "formal", "luxury"],
    mood: ["refined", "sophisticated", "elegant", "timeless", "luxurious"]
  },

  // 時代別リバイバル
  {
    id: "1920s-flapper",
    name: "1920sフラッパー",
    description: "1920年代の自由な女性たちのスタイル。ドロップウエスト、ビーズ、フリンジが特徴的。",
    keywords: ["1920s", "flapper", "art-deco", "jazz-age", "beaded", "fringe", "drop-waist"],
    era: "1920s",
    seasons: ["all"],
    occasions: ["formal", "party", "vintage-themed", "special-events"],
    colors: ["gold", "silver", "black", "cream", "pearl-white"],
    materials: ["silk", "chiffon", "beads", "sequins", "lace"],
    compatibility: ["headbands", "long-pearls", "t-bar-shoes", "beaded-dresses"],
    popularity: 60,
    formality: ["formal", "cocktail", "vintage"],
    mood: ["rebellious", "glamorous", "free-spirited", "vintage", "jazz-era"]
  },
  {
    id: "1950s-rockabilly",
    name: "1950sロカビリー",
    description: "1950年代のロックンロール文化に影響を受けた、女性らしく反抗的なスタイル。",
    keywords: ["1950s", "rockabilly", "pin-up", "vintage", "rock-n-roll", "retro"],
    era: "1950s",
    seasons: ["all"],
    occasions: ["casual", "vintage-events", "rockabilly-culture", "pin-up"],
    colors: ["cherry-red", "black", "white", "polka-dots", "gingham"],
    materials: ["cotton", "denim", "leather", "tulle", "satin"],
    compatibility: ["circle-skirts", "petticoats", "cardigans", "victory-rolls"],
    popularity: 65,
    formality: ["casual", "vintage", "pin-up"],
    mood: ["retro", "feminine", "rebellious", "vintage", "rock-n-roll"]
  },
  {
    id: "1970s-bohemian",
    name: "1970sボヘミアン",
    description: "1970年代のヒッピー文化とボヘミアンライフスタイルを反映した自由なスタイル。",
    keywords: ["1970s", "bohemian", "hippie", "free-spirit", "natural", "folk", "psychedelic"],
    era: "1970s",
    seasons: ["all"],
    occasions: ["casual", "festivals", "bohemian-lifestyle", "artistic"],
    colors: ["earth-tones", "burnt-orange", "deep-purple", "forest-green", "golden-yellow"],
    materials: ["cotton", "hemp", "suede", "fringe", "crochet"],
    compatibility: ["flowing-maxi-dresses", "peasant-blouses", "headbands", "sandals"],
    popularity: 70,
    formality: ["casual", "bohemian", "festival"],
    mood: ["free-spirited", "natural", "artistic", "peaceful", "bohemian"]
  },

  // ライフスタイル・サブカルチャー
  {
    id: "normcore",
    name: "ノームコア",
    description: "意図的に普通で目立たない服装を選ぶことで、逆に個性を表現するスタイル。",
    keywords: ["normcore", "anti-fashion", "ordinary", "understated", "minimal", "unpretentious"],
    era: "2010s-2020s",
    seasons: ["all"],
    occasions: ["everyday", "casual", "anti-fashion"],
    colors: ["neutral", "beige", "grey", "navy", "white"],
    materials: ["cotton", "denim", "jersey", "basic-fabrics"],
    compatibility: ["basic-tees", "jeans", "sneakers", "simple-accessories"],
    popularity: 60,
    formality: ["casual", "everyday"],
    mood: ["understated", "comfortable", "unpretentious", "minimal", "relaxed"]
  },
  {
    id: "visual-kei",
    name: "ビジュアル系",
    description: "日本発祥の音楽ジャンルに関連した、劇的でアンドロジナスな美的表現。",
    keywords: ["visual-kei", "japanese", "androgynous", "dramatic", "gothic", "theatrical"],
    era: "1980s-2020s",
    seasons: ["all"],
    occasions: ["concerts", "subculture-events", "artistic-expression"],
    colors: ["black", "white", "deep-purple", "blood-red", "silver"],
    materials: ["leather", "lace", "velvet", "metal-accessories", "pvc"],
    compatibility: ["platform-boots", "dramatic-makeup", "elaborate-accessories"],
    popularity: 45,
    formality: ["alternative", "subcultural"],
    mood: ["dramatic", "mysterious", "androgynous", "artistic", "rebellious"]
  },

  // 職業・シーン別
  {
    id: "power-business",
    name: "パワービジネス",
    description: "権威と専門性を示すための、強力で印象的なビジネススタイル。",
    keywords: ["power-dressing", "authoritative", "professional", "commanding", "executive"],
    era: "1980s-2020s",
    seasons: ["all"],
    occasions: ["business", "executive", "professional", "leadership"],
    colors: ["navy", "black", "charcoal", "burgundy", "white"],
    materials: ["wool-suiting", "silk", "cashmere", "fine-cotton"],
    compatibility: ["structured-blazers", "power-suits", "statement-accessories"],
    popularity: 70,
    formality: ["business", "formal", "executive"],
    mood: ["authoritative", "confident", "professional", "powerful", "commanding"]
  },
  {
    id: "creative-casual",
    name: "クリエイティブカジュアル",
    description: "創造的な職業に従事する人々の、個性と専門性を両立させたスタイル。",
    keywords: ["creative", "artistic", "individual", "expressive", "innovative", "contemporary"],
    era: "2000s-2020s",
    seasons: ["all"],
    occasions: ["creative-work", "artistic", "casual-professional"],
    colors: ["varied", "artistic-palettes", "unconventional-combinations"],
    materials: ["mixed-textures", "innovative-fabrics", "artistic-prints"],
    compatibility: ["unique-accessories", "statement-pieces", "artistic-elements"],
    popularity: 65,
    formality: ["casual", "creative-professional"],
    mood: ["creative", "expressive", "individual", "innovative", "artistic"]
  },

  // 季節・イベント特化
  {
    id: "resort-wear",
    name: "リゾートウェア",
    description: "休暇や高級リゾートでの滞在に適した、エレガントで快適なスタイル。",
    keywords: ["resort", "vacation", "luxury-travel", "elegant-casual", "comfortable-chic"],
    era: "1950s-2020s",
    seasons: ["spring", "summer"],
    occasions: ["vacation", "resort", "travel", "leisure"],
    colors: ["tropical", "coral", "turquoise", "white", "sunset-hues"],
    materials: ["linen", "silk", "cotton", "lightweight-fabrics"],
    compatibility: ["flowing-dresses", "elegant-swimwear", "resort-accessories"],
    popularity: 75,
    formality: ["resort-casual", "elegant-vacation"],
    mood: ["relaxed", "elegant", "vacation", "luxurious", "tropical"]
  },
  {
    id: "festival-fashion",
    name: "フェスティバルファッション",
    description: "音楽フェスティバルやアウトドアイベントでの実用的でスタイリッシュな装い。",
    keywords: ["festival", "outdoor", "practical", "boho", "comfortable", "weather-resistant"],
    era: "1960s-2020s",
    seasons: ["spring", "summer", "early_autumn"],
    occasions: ["festivals", "outdoor-events", "concerts"],
    colors: ["vibrant", "tie-dye", "earth-tones", "neon-accents"],
    materials: ["denim", "cotton", "weather-resistant", "comfortable-fabrics"],
    compatibility: ["comfortable-shoes", "practical-bags", "weather-gear"],
    popularity: 80,
    formality: ["casual", "festival"],
    mood: ["fun", "energetic", "practical", "bohemian", "adventurous"]
  },

  // 新興トレンド
  {
    id: "gender-neutral",
    name: "ジェンダーニュートラル",
    description: "性別の境界を超えた、包括的で多様性を重視するファッションスタイル。",
    keywords: ["gender-neutral", "inclusive", "unisex", "diverse", "boundary-breaking"],
    era: "2010s-2020s",
    seasons: ["all"],
    occasions: ["everyday", "progressive", "inclusive-events"],
    colors: ["neutral", "earth-tones", "monochromatic"],
    materials: ["versatile", "comfortable", "quality-basics"],
    compatibility: ["versatile-pieces", "unisex-accessories", "comfortable-footwear"],
    popularity: 85,
    formality: ["casual", "progressive"],
    mood: ["inclusive", "comfortable", "progressive", "authentic", "diverse"]
  },
  {
    id: "cyberpunk",
    name: "サイバーパンク",
    description: "未来的なテクノロジーとストリート文化が融合した、反体制的で革新的なスタイル。",
    keywords: ["cyberpunk", "futuristic", "tech", "neon", "dystopian", "sci-fi"],
    era: "1980s-2020s",
    seasons: ["all"],
    occasions: ["alternative", "sci-fi-events", "tech-culture"],
    colors: ["neon-colors", "metallic", "black", "electric-blue", "cyber-green"],
    materials: ["synthetic", "metallic", "tech-fabrics", "neon-accents"],
    compatibility: ["tech-accessories", "futuristic-footwear", "LED-elements"],
    popularity: 50,
    formality: ["alternative", "subcultural"],
    mood: ["futuristic", "rebellious", "tech-oriented", "edgy", "innovative"]
  },
  {
    id: "solarpunk",
    name: "ソーラーパンク",
    description: "持続可能な未来と自然との調和を重視した、希望的で環境意識の高いスタイル。",
    keywords: ["solarpunk", "sustainable", "eco-futuristic", "optimistic", "nature-tech"],
    era: "2010s-2020s",
    seasons: ["all"],
    occasions: ["eco-events", "sustainable-lifestyle", "future-oriented"],
    colors: ["green-tones", "earth-colors", "solar-inspired", "natural-palettes"],
    materials: ["sustainable", "eco-friendly", "bio-materials", "recycled"],
    compatibility: ["eco-accessories", "solar-elements", "natural-textures"],
    popularity: 60,
    formality: ["casual", "eco-conscious"],
    mood: ["optimistic", "eco-friendly", "futuristic", "harmonious", "sustainable"]
  },
  {
    id: "metaverse-fashion",
    name: "メタバースファッション",
    description: "デジタル空間での自己表現に特化した、現実の制約を超えたバーチャルスタイル。",
    keywords: ["metaverse", "digital", "virtual", "avatar", "limitless", "futuristic"],
    era: "2020s",
    seasons: ["digital-all"],
    occasions: ["virtual-events", "digital-spaces", "avatar-styling"],
    colors: ["digital-spectrum", "holographic", "impossible-colors"],
    materials: ["digital-textures", "virtual-materials", "light-elements"],
    compatibility: ["digital-accessories", "virtual-elements", "impossible-physics"],
    popularity: 40,
    formality: ["virtual", "digital"],
    mood: ["innovative", "limitless", "digital", "creative", "futuristic"]
  },

  // --- Phase 2 拡充: +20種類のスタイルトレンド ---
  
  // 現代新興トレンド
  {
    id: "dopamine-dressing",
    name: "ドーパミンドレッシング",
    description: "鮮やかな色彩と楽しいパターンで気分を高揚させる、心理学的効果を狙ったポジティブなスタイル。",
    keywords: ["dopamine-dressing", "bright-colors", "mood-boosting", "positive", "vibrant", "cheerful", "uplifting"],
    era: "2020s",
    seasons: ["all"],
    occasions: ["daily_mood-boost", "creative_work", "social_events", "self-care"],
    colors: ["rainbow-spectrum", "neon-pink", "electric-yellow", "vibrant-green", "royal-blue", "sunset-orange"],
    materials: ["textured-knits", "shiny-fabrics", "playful-prints", "colorful-accessories"],
    compatibility: ["statement-jewelry", "colorful-bags", "fun-shoes", "playful-accessories"],
    popularity: 88,
    formality: ["casual", "creative"],
    mood: ["joyful", "energetic", "positive", "confident", "expressive", "uplifting"]
  },
  {
    id: "coastal-grandmother",
    name: "コースタルグランドマザー",
    description: "海辺で過ごす上品な祖母をイメージした、リラックスしたエレガンスとタイムレスな魅力を持つスタイル。",
    keywords: ["coastal-grandmother", "timeless-elegance", "relaxed-luxury", "seaside-chic", "mature-style", "effortless"],
    era: "2020s",
    seasons: ["spring", "summer", "early_autumn"],
    occasions: ["vacation", "relaxed_elegance", "seaside_events", "mature_casual"],
    colors: ["soft-blues", "creamy-whites", "natural-linens", "sage-green", "sandy-beige"],
    materials: ["linen", "cotton", "cashmere", "natural-fibers", "flowing-fabrics"],
    compatibility: ["comfortable-sandals", "straw-hats", "natural-jewelry", "canvas-bags"],
    popularity: 75,
    formality: ["relaxed_elegant", "vacation"],
    mood: ["serene", "sophisticated", "comfortable", "timeless", "relaxed", "elegant"]
  },
  {
    id: "clean-girl-aesthetic",
    name: "クリーンガールエステティック",
    description: "ミニマルなメイクと自然な髪型、シンプルな服装で健康的な美しさを強調するトレンド。",
    keywords: ["clean-girl", "minimal-makeup", "natural-beauty", "effortless", "healthy", "simple", "fresh"],
    era: "2020s",
    seasons: ["all"],
    occasions: ["daily_natural", "minimal_lifestyle", "wellness_focused", "authentic_self"],
    colors: ["neutral-tones", "skin-tone-harmonious", "soft-whites", "gentle-beiges", "natural-browns"],
    materials: ["organic-cotton", "bamboo-fiber", "natural-textures", "breathable-fabrics"],
    compatibility: ["minimal-jewelry", "natural-accessories", "comfortable-footwear", "simple-bags"],
    popularity: 90,
    formality: ["casual", "natural"],
    mood: ["fresh", "natural", "confident", "authentic", "healthy", "serene"]
  },
  {
    id: "academia-core",
    name: "アカデミアコア",
    description: "学術的な環境にインスパイアされた知的でクラシックなスタイル。図書館や大学キャンパスの雰囲気。",
    keywords: ["academia", "scholarly", "intellectual", "vintage-books", "library-aesthetic", "studious", "classic"],
    era: "timeless_academic",
    seasons: ["autumn", "winter", "early_spring"],
    occasions: ["study", "library", "academic_events", "intellectual_gatherings", "book_clubs"],
    colors: ["deep-browns", "forest-green", "burgundy", "cream", "antique-gold", "charcoal"],
    materials: ["wool-blend", "corduroy", "leather-patches", "fine-cotton", "cashmere"],
    compatibility: ["leather-satchel", "vintage-glasses", "scarves", "oxford-shoes", "classic-coats"],
    popularity: 70,
    formality: ["smart_casual", "academic"],
    mood: ["intellectual", "scholarly", "sophisticated", "contemplative", "classic", "refined"]
  },
  {
    id: "romantic-academia",
    name: "ロマンティックアカデミア",
    description: "クラシックなアカデミアスタイルにロマンティックでフェミニンな要素を加えた詩的なトレンド。",
    keywords: ["romantic-academia", "feminine-scholarly", "poetic", "vintage-romantic", "literature-inspired", "dreamy"],
    era: "timeless_romantic",
    seasons: ["spring", "autumn", "early_winter"],
    occasions: ["poetry_readings", "literary_events", "romantic_dates", "artistic_gatherings"],
    colors: ["dusty-rose", "soft-lavender", "cream", "sage-green", "warm-brown", "antique-white"],
    materials: ["silk-scarves", "lace-details", "wool-cardigans", "vintage-patterns", "soft-knits"],
    compatibility: ["pearl-accessories", "vintage-brooches", "mary-jane-shoes", "delicate-jewelry"],
    popularity: 65,
    formality: ["romantic_casual", "artistic"],
    mood: ["romantic", "dreamy", "poetic", "gentle", "artistic", "feminine"]
  },
  
  // サブカルチャー・ライフスタイル
  {
    id: "cottagecore",
    name: "コテージコア",
    description: "田舎暮らしと手作りライフスタイルに憧れる、牧歌的でノスタルジックなスタイル。",
    keywords: ["cottagecore", "rural-life", "handmade", "pastoral", "nostalgic", "countryside", "traditional-crafts"],
    era: "2020s_revival",
    seasons: ["spring", "summer", "early_autumn"],
    occasions: ["countryside", "handcraft_activities", "garden_parties", "pastoral_events"],
    colors: ["wildflower-colors", "meadow-green", "honey-yellow", "soft-pink", "cream", "earth-tones"],
    materials: ["linen", "cotton", "wool", "natural-fibers", "handwoven-textures", "floral-prints"],
    compatibility: ["straw-accessories", "handmade-jewelry", "vintage-aprons", "comfortable-boots"],
    popularity: 72,
    formality: ["rural_casual", "handcraft"],
    mood: ["peaceful", "nostalgic", "romantic", "simple", "natural", "handmade"]
  },
  {
    id: "dark-academia",
    name: "ダークアカデミア",
    description: "ゴシック建築の大学や古典文学にインスパイアされた、ダークで知的なアカデミックスタイル。",
    keywords: ["dark-academia", "gothic-university", "literary", "mysterious", "intellectual-dark", "classical"],
    era: "timeless_gothic",
    seasons: ["autumn", "winter"],
    occasions: ["academic_gothic", "literary_events", "mysterious_gatherings", "intellectual_circles"],
    colors: ["black", "deep-burgundy", "forest-green", "charcoal", "antique-gold", "dark-brown"],
    materials: ["wool-blend", "leather", "corduroy", "tweed", "vintage-textures", "dark-fabrics"],
    compatibility: ["vintage-glasses", "leather-bags", "dark-scarves", "oxford-shoes", "antique-jewelry"],
    popularity: 68,
    formality: ["academic_dark", "mysterious"],
    mood: ["mysterious", "intellectual", "gothic", "sophisticated", "contemplative", "dark"]
  },
  {
    id: "indie-sleaze",
    name: "インディースリーズ",
    description: "2000年代後半のインディーロック文化に根ざした、故意に荒廃したシックなスタイル。",
    keywords: ["indie-sleaze", "2000s-revival", "disheveled-chic", "alternative", "music-inspired", "grungy-cool"],
    era: "2000s_revival",
    seasons: ["all"],
    occasions: ["music_events", "alternative_scenes", "indie_gatherings", "artistic_communities"],
    colors: ["black", "grey", "faded-colors", "vintage-wash", "muted-tones", "distressed-colors"],
    materials: ["distressed-denim", "vintage-band-tees", "leather-jackets", "worn-textures", "faded-fabrics"],
    compatibility: ["vintage-accessories", "worn-boots", "band-merchandise", "alternative-jewelry"],
    popularity: 55,
    formality: ["alternative", "indie"],
    mood: ["rebellious", "artistic", "cool", "alternative", "independent", "grungy"]
  },
  {
    id: "fairy-grunge",
    name: "フェアリーグランジ",
    description: "グランジの荒々しさと妖精のような幻想的要素を組み合わせた対照的なスタイル。",
    keywords: ["fairy-grunge", "whimsical-edge", "fantasy-alternative", "magical-dark", "ethereal-grunge", "contrasting"],
    era: "2020s_fusion",
    seasons: ["all"],
    occasions: ["alternative_fantasy", "artistic_expression", "creative_events", "fantasy_gatherings"],
    colors: ["pastels-with-black", "iridescent", "dark-purple", "magical-colors", "contrast-palette"],
    materials: ["tulle-with-leather", "lace-with-denim", "metallic-accents", "contrasting-textures"],
    compatibility: ["fantasy-accessories", "alternative-jewelry", "platform-boots", "whimsical-bags"],
    popularity: 45,
    formality: ["alternative", "fantasy"],
    mood: ["whimsical", "rebellious", "magical", "contrasting", "creative", "unique"]
  },
  
  // 地域・文化的トレンド
  {
    id: "scandinavian-minimalism",
    name: "スカンジナビアンミニマリズム",
    description: "北欧の機能美とシンプルさを重視した、洗練されたミニマルスタイル。",
    keywords: ["scandinavian", "minimalism", "functional-beauty", "nordic", "clean-lines", "quality-basics"],
    era: "contemporary_nordic",
    seasons: ["all"],
    occasions: ["daily_minimal", "work_clean", "lifestyle_focused", "quality_living"],
    colors: ["white", "grey", "natural-wood-tones", "soft-blues", "muted-earth"],
    materials: ["wool", "organic-cotton", "linen", "sustainable-materials", "natural-textures"],
    compatibility: ["minimalist-accessories", "quality-basics", "functional-footwear", "simple-bags"],
    popularity: 85,
    formality: ["casual_clean", "work_minimal"],
    mood: ["calm", "functional", "clean", "serene", "quality-focused", "sophisticated"]
  },
  {
    id: "japanese-minimalism",
    name: "ジャパニーズミニマリズム",
    description: "日本の美意識に基づく、削ぎ落とされた美しさと機能性を追求するスタイル。",
    keywords: ["japanese-minimalism", "wabi-sabi", "functional-beauty", "subtle", "refined-simplicity", "zen"],
    era: "traditional_modern",
    seasons: ["all"],
    occasions: ["mindful_living", "zen_lifestyle", "artistic_minimal", "contemplative"],
    colors: ["natural-white", "charcoal", "earth-tones", "muted-colors", "monochromatic"],
    materials: ["natural-fibers", "organic-cotton", "linen", "bamboo", "sustainable-materials"],
    compatibility: ["minimal-accessories", "natural-jewelry", "simple-footwear", "functional-bags"],
    popularity: 75,
    formality: ["zen_casual", "mindful"],
    mood: ["serene", "mindful", "refined", "contemplative", "peaceful", "zen"]
  },
  {
    id: "mediterranean-chic",
    name: "メディタレニアンシック",
    description: "地中海沿岸のライフスタイルにインスパイアされた、リラックスしたエレガンスのスタイル。",
    keywords: ["mediterranean", "coastal-elegance", "relaxed-luxury", "seaside-chic", "european-casual", "sun-kissed"],
    era: "timeless_coastal",
    seasons: ["spring", "summer", "early_autumn"],
    occasions: ["vacation", "coastal_living", "relaxed_elegance", "seaside_events"],
    colors: ["ocean-blue", "sun-bleached-white", "terracotta", "olive-green", "sandy-beige", "coral"],
    materials: ["linen", "cotton", "light-wool", "natural-fibers", "flowing-fabrics"],
    compatibility: ["espadrilles", "straw-accessories", "natural-jewelry", "canvas-bags"],
    popularity: 70,
    formality: ["relaxed_elegant", "vacation"],
    mood: ["relaxed", "elegant", "sun-kissed", "sophisticated", "coastal", "effortless"]
  },
  {
    id: "brooklyn-hipster",
    name: "ブルックリンヒップスター",
    description: "ニューヨーク・ブルックリンの創造的コミュニティに根ざした、知的でアーティスティックなスタイル。",
    keywords: ["brooklyn-hipster", "artisanal", "creative-community", "indie", "intellectual-casual", "handmade"],
    era: "2010s_creative",
    seasons: ["all"],
    occasions: ["creative_work", "artisanal_events", "indie_culture", "intellectual_gatherings"],
    colors: ["muted-tones", "vintage-colors", "earth-tones", "faded-denim", "natural-dyes"],
    materials: ["vintage-denim", "organic-cotton", "handwoven-fabrics", "artisanal-textiles", "reclaimed-materials"],
    compatibility: ["vintage-accessories", "handmade-jewelry", "vintage-boots", "canvas-bags"],
    popularity: 60,
    formality: ["creative_casual", "artisanal"],
    mood: ["creative", "intellectual", "authentic", "artisanal", "independent", "thoughtful"]
  },
  
  // 世代・年代別トレンド
  {
    id: "gen-z-maximalism",
    name: "ジェンZ世代マキシマリズム",
    description: "Z世代による表現力豊かな最大主義。多様な要素を組み合わせた個性的で大胆なスタイル。",
    keywords: ["gen-z", "maximalism", "expressive", "bold-mixing", "individual", "diverse", "statement-making"],
    era: "2020s_generation",
    seasons: ["all"],
    occasions: ["self_expression", "social_media", "creative_events", "generation_specific"],
    colors: ["bold-contrasts", "unexpected-combinations", "bright-colors", "pattern-mixing"],
    materials: ["mixed-textures", "statement-pieces", "vintage-modern-mix", "expressive-fabrics"],
    compatibility: ["statement-accessories", "bold-shoes", "expressive-bags", "layered-jewelry"],
    popularity: 80,
    formality: ["expressive_casual", "creative"],
    mood: ["bold", "expressive", "individual", "confident", "creative", "diverse"]
  },
  {
    id: "millennial-comfort",
    name: "ミレニアル世代コンフォート",
    description: "ミレニアル世代のライフスタイルに合わせた、機能性と快適さを重視するスタイル。",
    keywords: ["millennial", "comfort-first", "functional", "work-life-balance", "practical", "lifestyle"],
    era: "2010s_2020s",
    seasons: ["all"],
    occasions: ["work_from_home", "busy_lifestyle", "multitasking", "practical_living"],
    colors: ["neutral-palette", "earth-tones", "calming-colors", "versatile-shades"],
    materials: ["comfortable-fabrics", "stretch-materials", "easy-care", "functional-textiles"],
    compatibility: ["comfortable-shoes", "practical-bags", "functional-accessories", "versatile-pieces"],
    popularity: 85,
    formality: ["comfort_casual", "practical"],
    mood: ["comfortable", "practical", "balanced", "functional", "relaxed", "efficient"]
  },
  
  // テクノロジー・未来志向
  {
    id: "tech-wear",
    name: "テックウェア",
    description: "高機能素材とミニマルなデザインを組み合わせた、未来的で機能重視のスタイル。",
    keywords: ["tech-wear", "functional", "performance", "futuristic", "minimal-tech", "innovative"],
    era: "2010s_2020s",
    seasons: ["all"],
    occasions: ["urban_active", "tech_work", "modern_lifestyle", "functional_fashion"],
    colors: ["black", "grey", "tech-colors", "monochromatic", "metallic-accents"],
    materials: ["performance-fabrics", "weather-resistant", "stretch-tech", "innovative-textiles"],
    compatibility: ["tech-accessories", "performance-shoes", "functional-bags", "minimal-jewelry"],
    popularity: 65,
    formality: ["tech_casual", "functional"],
    mood: ["futuristic", "efficient", "minimal", "performance", "innovative", "urban"]
  },
  {
    id: "biohacking-fashion",
    name: "バイオハッキングファッション",
    description: "健康とパフォーマンス向上を目的とした、科学的アプローチのファッションスタイル。",
    keywords: ["biohacking", "health-optimized", "performance", "scientific", "wellness", "data-driven"],
    era: "2020s_future",
    seasons: ["all"],
    occasions: ["wellness_lifestyle", "performance_optimization", "health_conscious", "scientific_approach"],
    colors: ["clinical-white", "nature-green", "tech-blue", "health-inspired"],
    materials: ["smart-fabrics", "health-monitoring", "performance-textiles", "wellness-materials"],
    compatibility: ["health-tech", "performance-accessories", "wellness-jewelry", "monitoring-devices"],
    popularity: 40,
    formality: ["wellness_casual", "tech_health"],
    mood: ["health-conscious", "performance", "scientific", "optimized", "future-oriented", "wellness"]
  },
  
  // 持続可能性・環境意識
  {
    id: "zero-waste-fashion",
    name: "ゼロウェイストファッション",
    description: "廃棄物を最小限に抑える設計と製造プロセスによる、環境に配慮したファッションスタイル。",
    keywords: ["zero-waste", "sustainable", "environmental", "circular-fashion", "eco-conscious", "waste-reduction"],
    era: "2020s_sustainable",
    seasons: ["all"],
    occasions: ["eco_lifestyle", "sustainable_events", "environmental_awareness", "conscious_living"],
    colors: ["natural-dyes", "undyed-natural", "earth-tones", "sustainable-colors"],
    materials: ["upcycled", "recycled-materials", "organic-fibers", "sustainable-textiles", "biodegradable"],
    compatibility: ["upcycled-accessories", "sustainable-shoes", "eco-bags", "natural-jewelry"],
    popularity: 55,
    formality: ["eco_casual", "sustainable"],
    mood: ["conscious", "responsible", "environmental", "thoughtful", "sustainable", "aware"]
  },
  {
    id: "regenerative-fashion",
    name: "リジェネラティブファッション",
    description: "環境再生に貢献する材料と手法を用いた、地球にポジティブな影響を与えるファッション。",
    keywords: ["regenerative", "earth-positive", "restoration", "healing-environment", "positive-impact", "regeneration"],
    era: "2020s_future",
    seasons: ["all"],
    occasions: ["environmental_restoration", "conscious_lifestyle", "regenerative_living", "earth_care"],
    colors: ["soil-browns", "plant-greens", "sky-blues", "earth-restoration-palette"],
    materials: ["regenerative-fibers", "soil-building", "carbon-sequestering", "restoration-textiles"],
    compatibility: ["earth-positive-accessories", "regenerative-shoes", "restoration-bags", "healing-jewelry"],
    popularity: 35,
    formality: ["regenerative_casual", "earth_positive"],
    mood: ["healing", "restorative", "earth-conscious", "positive-impact", "regenerative", "caring"]
  }
  // Phase 2完了: 合計50種類のスタイルトレンド
];

// その他のファッション要素 (既存のまま、または必要に応じて拡充)
export const colors = [
  'black', 'white', 'grey', 'navy', 'beige', 'cream', 'brown',
  'red', 'burgundy', 'pink', 'hot pink', 'coral', 'baby-blue', 'pastel-pink',
  'blue', 'sky blue', 'teal', 'turquoise', 'muted-blue', 'electric-blue',
  'green', 'forest green', 'sage green', 'mint', 'olive-drab', 'emerald-green', 'lime-green',
  'yellow', 'mustard', 'gold', 'sunshine-yellow', 'pale-yellow',
  'purple', 'lavender', 'plum', 'bright-purple', 'dusty-rose',
  'orange', 'rust', 'terracotta', 'juicy-orange',
  'silver', 'holographic', 'earth-tones', 'charcoal-grey', 'ivory', 'camel'
];

export const seasons = ['spring', 'summer', 'autumn', 'winter', 'early_spring', 'early_autumn', 'mild_winter', 'party_season', 'all'];

export const occasions = [
  'casual', 'work', 'formal', 'date', 'weekend', 'party', 'daily_wear', 'streetwear', 'evening_events',
  'beach', 'travel', 'sportswear', 'loungewear', 'business_casual', 'smart_casual', 'semi-formal', 'black-tie',
  'clubwear', 'festivals', 'weddings', 'galas', 'prom', 'picnics', 'creative_events', 'urban_exploration',
  'university', 'library_visits', 'concerts', 'cafe-hopping', 'refined_casual', 'daily_luxury'
];

export const moods = [
  'minimalist', 'romantic', 'edgy', 'playful', 'sophisticated', 'effortless', 'understated', 'confident',
  'relaxed', 'bold', 'elegant', 'cozy', 'fresh', 'calm', 'functional', 'timeless', 'dreamy', 'intellectual',
  'mysterious', 'scholarly', 'nostalgic', 'moody', 'urban', 'utilitarian', 'rebellious', 'cool', 'grungy',
  'expressive', 'eclectic', 'artistic', 'joyful', 'mindful', 'conscious', 'serene', 'responsible', 'natural',
  'unique', 'kawaii', 'graceful', 'delicate', 'exclusive', 'chic', 'clean', 'comfortable', 'sexy', 'youthful',
  'wholesome', 'feminine-independent'
];

// 既存の lightingStyles, backgrounds, cameraAngles は変更なしと仮定
export const lightingStyles = [
  'natural lighting', 'studio lighting', 'golden hour lighting',
  'dramatic lighting', 'soft diffused lighting', 'backlit',
  'window lighting', 'sunset lighting', 'overcast lighting'
];

export const backgrounds = [
  'solid color backdrop', 'gradient background', 'urban street',
  'minimalist interior', 'natural outdoor setting', 'studio backdrop',
  'architectural background', 'textured wall', 'clean background'
];

export const cameraAngles = [
  'full-body shot', 'three-quarter shot', 'portrait shot',
  'wide shot', 'close-up detail', 'overhead shot',
  'side profile', 'back view', 'dynamic angle'
];

// ファッションコンテキストの統合 (拡充されたデータを反映)
export const fashionContext = {
  materials,
  silhouettes,
  styleTrends,
  colors,
  seasons,
  occasions,
  moods,
  lightingStyles,
  backgrounds,
  cameraAngles
};

// 初期データ（互換性のため残す）
export const initialBrands = []; //変更なし

// phraseVariations は拡充されたデータに基づいて更新が必要ですが、
// ここでは既存の構造のみ示します。実際のバリエーション生成は別途必要です。
// 今回の指示では拡充対象外なので、既存のものをベースに考えます。
export const phraseVariations = {
  materials: materials.map(m => ({
    base_term: m.name,
    // description や keywords からバリエーションを生成することを想定
    variations: [m.name, ...m.keywords.slice(0,2), m.description.substring(0, m.description.indexOf('。') > 0 ? m.description.indexOf('。') : m.description.length) ]
  })),
  silhouettes: silhouettes.map(s => ({
    base_term: s.name,
    variations: [s.name, ...s.keywords.slice(0,2), s.description.substring(0, s.description.indexOf('。') > 0 ? s.description.indexOf('。') : s.description.length) ]
  })),
  lighting: lightingStyles.map(l => ({
    base_term: l,
    variations: [l]
  })),
  backgrounds: backgrounds.map(b => ({
    base_term: b,
    variations: [b]
  }))
};