// 拡充されたファッション要素データベース
import { Material, Silhouette, StyleTrend } from '../types';

// 大幅に拡充された素材データ (80種類)
export const expandedMaterials: Material[] = [
  // === 既存素材の改良版 ===
  {
    id: "cashmere-knit",
    name: "カシミアニット",
    description: "カシミアヤギの毛から作られる高級ニット素材。非常に柔らかく軽量で、優れた保温性を持つ。",
    keywords: ["cashmere", "knit", "luxury", "soft", "warm", "lightweight", "premium", "fine"],
    season: ["autumn", "winter"],
    formality: ["casual", "business", "formal"],
    compatibility: ["silk-charmeuse", "fine-wool", "satin", "lambskin-leather"],
    texture: "soft",
    weight: "lightweight",
    care: ["hand-wash", "dry-clean"],
    sustainability: "medium",
    priceRange: "luxury"
  },
  {
    id: "merino-wool-knit",
    name: "メリノウールニット",
    description: "メリノ種の羊から採れる高品質なウール。繊維が細く、肌触りが柔らかで、保温性と通気性に優れる。",
    keywords: ["merino-wool", "wool", "soft", "fine", "breathable", "thermoregulating", "performance", "natural"],
    season: ["spring", "autumn", "winter"],
    formality: ["casual", "sportswear", "business_casual"],
    compatibility: ["cotton", "silk", "cashmere-knit", "performance-fabrics"],
    texture: "soft",
    weight: "medium",
    care: ["machine-wash-wool-cycle-cold", "lay-flat-to-dry"],
    sustainability: "medium",
    priceRange: "mid-range"
  },
  
  // === 新規追加: エキゾチック素材 ===
  {
    id: "alpaca-wool",
    name: "アルパカウール",
    description: "アルパカの毛から作られる高級天然繊維。カシミアよりも軽く、保温性に優れ、アレルギーを起こしにくい。",
    keywords: ["alpaca", "wool", "hypoallergenic", "lightweight", "warm", "exotic", "sustainable"],
    season: ["autumn", "winter"],
    formality: ["casual", "business_casual", "luxury"],
    compatibility: ["cashmere-knit", "silk", "fine-wool"],
    texture: "soft",
    weight: "lightweight",
    care: ["hand-wash-gentle", "dry-clean"],
    sustainability: "high",
    priceRange: "luxury"
  },
  {
    id: "vicuna-wool",
    name: "ビクーニャウール",
    description: "南米の野生ビクーニャから採れる世界最高級の天然繊維。極めて希少で、カシミアを上回る柔らかさ。",
    keywords: ["vicuna", "ultra-luxury", "rare", "softest", "exclusive", "premium"],
    season: ["autumn", "winter"],
    formality: ["formal", "ultra-luxury"],
    compatibility: ["silk-charmeuse", "cashmere-knit"],
    texture: "ultra-soft",
    weight: "lightweight",
    care: ["professional-dry-clean-only"],
    sustainability: "high",
    priceRange: "ultra-luxury"
  },
  {
    id: "qiviut",
    name: "キビュート（ジャコウウシ毛）",
    description: "北極のジャコウウシの下毛。カシミアの8倍の保温性を持ち、水に濡れても保温効果を維持する。",
    keywords: ["qiviut", "arctic", "warmest", "rare", "natural", "insulating"],
    season: ["winter"],
    formality: ["casual", "luxury_outdoor"],
    compatibility: ["wool-knit", "technical-fabrics"],
    texture: "fluffy",
    weight: "lightweight",
    care: ["hand-wash-cold", "professional-care"],
    sustainability: "high",
    priceRange: "ultra-luxury"
  },
  
  // === テクニカル・パフォーマンス素材 ===
  {
    id: "graphene-infused-fabric",
    name: "グラフェン混合ファブリック",
    description: "グラフェンを織り込んだ次世代素材。抗菌性、導電性、温度調節機能を持つ革新的テクニカルファブリック。",
    keywords: ["graphene", "high-tech", "antibacterial", "thermoregulating", "innovative", "futuristic"],
    season: ["all"],
    formality: ["sportswear", "technical_outerwear"],
    compatibility: ["performance-fabrics", "smart-textiles"],
    texture: "smooth",
    weight: "lightweight",
    care: ["machine-wash-cold", "air-dry"],
    sustainability: "medium",
    priceRange: "luxury"
  },
  {
    id: "phase-change-material",
    name: "相変化素材（PCM）",
    description: "体温に応じて状態が変化し、温度を一定に保つスマートファブリック。NASA技術を応用した温度調節素材。",
    keywords: ["PCM", "smart-fabric", "temperature-control", "NASA-tech", "adaptive", "performance"],
    season: ["all"],
    formality: ["sportswear", "technical_outerwear"],
    compatibility: ["merino-wool", "synthetic-blends"],
    texture: "smooth",
    weight: "medium",
    care: ["machine-wash-gentle", "no-heat-dry"],
    sustainability: "medium",
    priceRange: "luxury"
  },
  {
    id: "aerogel-insulation",
    name: "エアロジェル断熱素材",
    description: "NASA開発の超軽量断熱材。従来の断熱材の10倍の性能を持ちながら、羽毛よりも軽い。",
    keywords: ["aerogel", "NASA", "ultra-lightweight", "insulation", "space-tech", "revolutionary"],
    season: ["winter"],
    formality: ["technical_outerwear", "extreme-weather"],
    compatibility: ["ripstop-nylon", "gore-tex"],
    texture: "smooth",
    weight: "ultra-lightweight",
    care: ["professional-clean", "no-compression"],
    sustainability: "medium",
    priceRange: "ultra-luxury"
  },
  
  // === サステナブル・エコ素材 ===
  {
    id: "mushroom-leather",
    name: "マッシュルームレザー（マイセリウム）",
    description: "キノコの菌糸体から作られるヴィーガンレザー。環境負荷が少なく、本革に近い質感を持つ革新的素材。",
    keywords: ["mushroom", "mycelium", "vegan-leather", "sustainable", "bio-material", "eco-friendly"],
    season: ["spring", "autumn", "winter"],
    formality: ["casual", "eco-luxury"],
    compatibility: ["organic-cotton", "hemp-fabric", "recycled-polyester"],
    texture: "leather-like",
    weight: "medium",
    care: ["wipe-clean", "condition-monthly"],
    sustainability: "very-high",
    priceRange: "mid-range"
  },
  {
    id: "algae-fabric",
    name: "アルガエ