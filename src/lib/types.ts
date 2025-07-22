import type { User as PrismaUser } from "@prisma/client";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string;
    };
  }

  interface User extends PrismaUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

// Core Types for Imagine Fashion Generator
export interface DesignOptions {
  trend: TrendType | null;
  colorScheme: ColorSchemeType | null;
  mood: MoodType | null;
  season: SeasonType | null;
  style?: StyleType;
}

// Generation Settings for advanced configuration
export interface GenerationSettings {
  batchSize: number; // Number of variations to generate (1-4)
  aspectRatio: AspectRatioType; // Image aspect ratio
  quality: QualityType; // Generation quality
  stylize: number; // Stylization strength (0-1000)
}

export type TrendType = 'minimalist' | 'y2k' | 'cottage-core' | 'tech-wear' | 'vintage' | 'bohemian' | 'streetwear' | 'preppy';
export type ColorSchemeType = 'monochrome' | 'pastel' | 'vivid' | 'earth-tone' | 'jewel-tone' | 'neon' | 'muted';
export type MoodType = 'casual' | 'formal' | 'edgy' | 'romantic' | 'professional' | 'playful' | 'sophisticated';
export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter';
export type StyleType = 'dress' | 'casual' | 'business' | 'evening' | 'athletic' | 'loungewear';
export type AspectRatioType = '1:1' | '2:3' | '3:2' | '16:9' | '9:16' | '4:5' | '5:4';
export type QualityType = 'standard' | 'high' | 'ultra';

export interface GeneratedImage {
  id: string;
  prompt: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress?: number | null; // Progress as 0-100 or null
  imageUrl?: string | null;
  upscaled_urls?: string[];
  timestamp: Date;
  designOptions: DesignOptions;
  variations?: GeneratedImage[];
}

export interface ImageStatus {
  id: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress?: number | null;
  url?: string | null;
  upscaled_urls?: string[];
  error?: string | null;
  ref?: string;
  prompt?: string;
  user_created?: string;
  date_created?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  designOptions: DesignOptions;
  ref?: string; // For variations and upscaling
  action?: 'generate' | 'upscale' | 'variation' | 'blend' | 'subtle' | 'strong' | 'animate' | 'regenerate' | 'remix' | 'vary';
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

// Enhanced Job State Management (Phase NOW)
export type JobStatus = 'idle' | 'submitting' | 'queued' | 'generating' | 'complete' | 'failed' | 'canceled';

export interface GenerationJob {
  id: string;
  createdAt: number;
  params: GenerationParams;
  status: JobStatus;
  progress?: number; // 0-1
  error?: { code: string; message: string; retryCount?: number };
  images?: GeneratedImage[];
  isHighlighted?: boolean; // For new completion highlighting
}

export interface GenerationParams {
  prompt: string;
  designOptions: DesignOptions;
  action?: 'generate' | 'upscale' | 'variation' | 'blend' | 'subtle' | 'strong' | 'animate' | 'regenerate' | 'remix' | 'vary';
  aiAssistUsed?: boolean;
  presetId?: string;
}

// Selection Tags for Summary Bar
export interface SelectionTag {
  id: string;
  label: string;
  kind: 'style' | 'color' | 'mood' | 'season';
  value: string;
}

// Analytics Events
export interface AnalyticsContext {
  userAnonId: string;
  sessionId: string;
  device: 'desktop' | 'mobile';
  locale: string;
}

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  context: AnalyticsContext;
  timestamp: number;
}

// Network & Retry Queue
export interface NetworkState {
  online: boolean;
  pendingQueue: GenerationJob[];
  retryQueue: GenerationJob[];
  lastPing: number;
}

// Loading States for UI
export type LoadingPhase = 'uploading' | 'queued' | 'generating' | 'rendering' | 'complete';

export interface LoadingState {
  phase: LoadingPhase;
  message: string;
  progress: number; // 0-1
}