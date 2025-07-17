// Core Types for Imagine Fashion Generator
export interface DesignOptions {
  trend: TrendType | null;
  colorScheme: ColorSchemeType | null;
  mood: MoodType | null;
  season: SeasonType;
  style?: StyleType;
}

export type TrendType = 'minimalist' | 'y2k' | 'cottage-core' | 'tech-wear' | 'vintage' | 'bohemian' | 'streetwear' | 'preppy';
export type ColorSchemeType = 'monochrome' | 'pastel' | 'vivid' | 'earth-tone' | 'jewel-tone' | 'neon' | 'muted';
export type MoodType = 'casual' | 'formal' | 'edgy' | 'romantic' | 'professional' | 'playful' | 'sophisticated';
export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter';
export type StyleType = 'dress' | 'casual' | 'business' | 'evening' | 'athletic' | 'loungewear';

export interface GeneratedImage {
  id: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  imageUrl?: string;
  thumbnailUrl?: string;
  timestamp: Date;
  designOptions: DesignOptions;
  variations?: GeneratedImage[];
}

export interface ImageStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  url?: string;
  thumbnail?: string;
  upscaled?: boolean;
  error?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  designOptions: DesignOptions;
  ref?: string; // For variations and upscaling
  action?: 'generate' | 'upscale' | 'variation' | 'blend';
  index?: 1 | 2 | 3 | 4; // For upscale actions
}

export interface StyleElements {
  trends: Record<TrendType, string[]>;
  colorSchemes: Record<ColorSchemeType, string[]>;
  moods: Record<MoodType, string[]>;
  seasons: Record<SeasonType, string[]>;
}

// Legacy types from original project (for prompt generation)
export interface Material {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  season: string[];
  formality: string[];
  compatibility: string[];
}

export interface Silhouette {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  bodyTypes: string[];
  occasions: string[];
  seasons: string[];
}

export interface StyleTrend {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  era: string;
  seasons: string[];
  colors: string[];
  materials: string[];
  popularity: number;
}

export interface PromptSettings {
  creativityLevel: 'conservative' | 'balanced' | 'experimental' | 'maximum';
  includeSeasonalConsistency: boolean;
  includeColorHarmony: boolean;
  cameraAngle: 'random' | 'full-body' | 'portrait';
  aspectRatio: string;
  quality: 'standard' | 'high' | 'ultra';
}