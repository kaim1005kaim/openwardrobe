export interface VaryOptions {
  imageUrl: string;
  variationType: 'subtle' | 'strong';
  prompt?: string;
}

export interface BlendOptions {
  imageUrls: string[];
  weights?: number[];
  prompt?: string;
}

export interface DescribeResult {
  descriptions: string[];
  originalDescriptions: string[];
}

export interface EditJobResult {
  success: boolean;
  jobId: string;
  message: string;
}

export class ImageEditService {
  private static baseUrl = '/api';

  /**
   * Create variations of an image
   */
  static async createVariation(options: VaryOptions): Promise<EditJobResult> {
    const response = await fetch(`${this.baseUrl}/vary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl: options.imageUrl,
        variationType: options.variationType,
        prompt: options.prompt,
        ref: `vary_${Date.now()}`
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'バリエーション生成に失敗しました');
    }

    return await response.json();
  }

  /**
   * Blend multiple images together
   */
  static async blendImages(options: BlendOptions): Promise<EditJobResult> {
    // Validate input
    if (options.imageUrls.length < 2) {
      throw new Error('最低2枚の画像が必要です');
    }
    if (options.imageUrls.length > 5) {
      throw new Error('最大5枚までの画像をブレンドできます');
    }

    const response = await fetch(`${this.baseUrl}/blend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrls: options.imageUrls,
        weights: options.weights,
        prompt: options.prompt,
        ref: `blend_${Date.now()}`
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'ブレンド生成に失敗しました');
    }

    return await response.json();
  }

  /**
   * Describe an image to generate prompts
   */
  static async describeImage(imageUrl: string, language: 'en' | 'ja' = 'ja'): Promise<DescribeResult> {
    const response = await fetch(`${this.baseUrl}/describe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl,
        language
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || '画像の解析に失敗しました');
    }

    const result = await response.json();
    return {
      descriptions: result.descriptions || [],
      originalDescriptions: result.originalDescriptions || []
    };
  }

  /**
   * Validate image URL format
   */
  static isValidImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(urlObj.pathname);
    } catch {
      return false;
    }
  }

  /**
   * Get supported file formats
   */
  static getSupportedFormats(): string[] {
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  }

  /**
   * Validate blend weights
   */
  static validateBlendWeights(weights: number[], imageCount: number): boolean {
    if (weights.length !== imageCount) return false;
    
    // All weights should be between 0 and 1
    if (weights.some(w => w < 0 || w > 1)) return false;
    
    // Sum should be approximately 1 (allow small floating point errors)
    const sum = weights.reduce((a, b) => a + b, 0);
    return Math.abs(sum - 1) < 0.01;
  }

  /**
   * Generate equal weights for blend
   */
  static generateEqualWeights(imageCount: number): number[] {
    const weight = 1 / imageCount;
    return Array(imageCount).fill(weight);
  }

  /**
   * Validate image URL accessibility
   */
  static async validateImageAccess(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors' // Allow cross-origin checks
      });
      return response.ok;
    } catch {
      // In no-cors mode, we can't check the actual response
      // Just validate the URL format
      return this.isValidImageUrl(url);
    }
  }

  /**
   * Get image dimensions (if accessible)
   */
  static async getImageDimensions(url: string): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      
      img.onerror = () => {
        resolve(null);
      };
      
      img.src = url;
    });
  }

  /**
   * Format variation type for display
   */
  static getVariationTypeLabel(type: 'subtle' | 'strong'): string {
    switch (type) {
      case 'subtle':
        return '微調整';
      case 'strong':
        return '大幅変更';
      default:
        return type;
    }
  }

  /**
   * Check if operation is supported
   */
  static isOperationSupported(operation: 'vary' | 'blend' | 'describe'): boolean {
    // All operations are supported in this implementation
    return true;
  }

  /**
   * Get estimated processing time
   */
  static getEstimatedProcessingTime(operation: 'vary' | 'blend' | 'describe'): string {
    switch (operation) {
      case 'vary':
        return '約1-2分';
      case 'blend':
        return '約2-3分';
      case 'describe':
        return '約30秒';
      default:
        return '約1-3分';
    }
  }
}