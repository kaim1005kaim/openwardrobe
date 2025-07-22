import { DesignOptions, GenerationSettings } from './types';
import { PromptGenerator } from './promptGenerator';

export interface PresetDesign {
  id: string;
  name: string;
  description: string;
  options: DesignOptions;
  emoji: string;
}

export class PresetGenerator {
  /**
   * Popular preset combinations for quick generation
   */
  static presets: PresetDesign[] = [
    {
      id: 'minimalist-spring',
      name: 'ミニマル春コレクション',
      description: 'シンプルで洗練された、クリーンな春のエッセンス',
      emoji: '🌸',
      options: {
        trend: 'minimalist',
        colorScheme: 'pastel',
        mood: 'casual',
        season: 'spring'
      }
    },
    {
      id: 'tech-urban',
      name: 'アーバンテックウェア',
      description: '都市の機能美と未来的デザインの融合',
      emoji: '⚡',
      options: {
        trend: 'tech-wear',
        colorScheme: 'monochrome',
        mood: 'edgy',
        season: 'winter'
      }
    },
    {
      id: 'vintage-romantic',
      name: 'ヴィンテージロマンス',
      description: 'ノスタルジックで女性らしい、時を超えた美しさ',
      emoji: '🌹',
      options: {
        trend: 'vintage',
        colorScheme: 'earth-tone',
        mood: 'romantic',
        season: 'autumn'
      }
    },
    {
      id: 'y2k-neon',
      name: 'Y2Kネオンファンタジー',
      description: '未来的でエネルギッシュな、サイバーパンクスタイル',
      emoji: '✨',
      options: {
        trend: 'y2k',
        colorScheme: 'neon',
        mood: 'playful',
        season: 'summer'
      }
    },
    {
      id: 'professional-modern',
      name: 'モダンプロフェッショナル',
      description: 'ビジネスシーンに映える、洗練されたエレガンス',
      emoji: '💼',
      options: {
        trend: 'preppy',
        colorScheme: 'monochrome',
        mood: 'professional',
        season: 'winter'
      }
    },
    {
      id: 'bohemian-summer',
      name: 'ボヘミアンサマー',
      description: '自由で芸術的な、アーティスティック夏スタイル',
      emoji: '🌙',
      options: {
        trend: 'bohemian',
        colorScheme: 'earth-tone',
        mood: 'casual',
        season: 'summer'
      }
    }
  ];

  /**
   * Generate prompt from design options using AI enhancement
   */
  static async generatePromptFromOptions(options: DesignOptions): Promise<string> {
    // Create base prompt using PromptGenerator
    const basePrompt = PromptGenerator.generatePrompt(options, {
      creativityLevel: 'balanced',
      includeSeasonalConsistency: true,
      includeColorHarmony: true,
      cameraAngle: 'full-body',
      aspectRatio: '9:16',
      quality: 'high'
    });

    // Enhance with DeepSeek AI if available
    try {
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enhance',
          userInput: `Create a fashion design based on these settings: ${JSON.stringify(options)}`,
          designOptions: options
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.result;
      }
    } catch (error) {
      console.warn('AI enhancement failed, using base prompt:', error);
    }

    return basePrompt;
  }

  /**
   * Generate prompt from preset
   */
  static async generateFromPreset(presetId: string): Promise<string> {
    const preset = this.presets.find(p => p.id === presetId);
    if (!preset) {
      throw new Error(`Preset ${presetId} not found`);
    }

    return await this.generatePromptFromOptions(preset.options);
  }

  /**
   * Get seasonal presets
   */
  static getSeasonalPresets(season: string): PresetDesign[] {
    return this.presets.filter(preset => preset.options.season === season);
  }

  /**
   * Get presets by trend
   */
  static getTrendPresets(trend: string): PresetDesign[] {
    return this.presets.filter(preset => preset.options.trend === trend);
  }

  /**
   * Create custom prompt from partial options
   */
  static async generateFromPartialOptions(
    options: Partial<DesignOptions>,
    userHint?: string
  ): Promise<string> {
    // Fill missing options with smart defaults
    const completeOptions: DesignOptions = {
      trend: options.trend || null,
      colorScheme: options.colorScheme || null,
      mood: options.mood || null,
      season: options.season || this.getCurrentSeason()
    };

    // Create descriptive prompt based on selected options
    const selectedElements: string[] = [];
    
    if (completeOptions.trend) {
      selectedElements.push(`${completeOptions.trend} trend`);
    }
    
    if (completeOptions.colorScheme) {
      selectedElements.push(`${completeOptions.colorScheme} color palette`);
    }
    
    if (completeOptions.mood) {
      selectedElements.push(`${completeOptions.mood} mood`);
    }
    
    if (completeOptions.season) {
      selectedElements.push(`${completeOptions.season} season`);
    }

    let basePrompt = selectedElements.length > 0 
      ? `Fashion design featuring ${selectedElements.join(', ')}`
      : 'Contemporary fashion design';

    if (userHint) {
      basePrompt = `${userHint}, ${basePrompt}`;
    }

    // Enhance with AI
    try {
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enhance',
          userInput: basePrompt,
          designOptions: completeOptions
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.result;
      }
    } catch (error) {
      console.warn('AI enhancement failed, using base generation:', error);
    }

    // Fallback to PromptGenerator
    return PromptGenerator.generatePrompt(completeOptions, {
      creativityLevel: 'balanced',
      includeSeasonalConsistency: true,
      includeColorHarmony: true,
      cameraAngle: 'full-body',
      aspectRatio: '9:16',
      quality: 'high'
    });
  }

  /**
   * Generate unified prompt with generation settings
   * This creates a single prompt instead of multiple separate prompts
   */
  static async generateUnifiedPrompt(
    options: DesignOptions,
    settings: GenerationSettings,
    userHint?: string
  ): Promise<string> {
    // Create a comprehensive prompt that incorporates all settings
    const selectedElements: string[] = [];
    
    if (options.trend) {
      selectedElements.push(this.getTrendDescription(options.trend));
    }
    
    if (options.colorScheme) {
      selectedElements.push(this.getColorSchemeDescription(options.colorScheme));
    }
    
    if (options.mood) {
      selectedElements.push(this.getMoodDescription(options.mood));
    }
    
    if (options.season) {
      selectedElements.push(this.getSeasonDescription(options.season));
    }

    // Base prompt with unified elements
    let basePrompt = `Single model wearing ${selectedElements.join(' with ')} fashion design, full body composition against minimal background`;

    if (userHint) {
      basePrompt = `${userHint}, ${basePrompt}`;
    }

    // Create internal technical parameters (hidden from user)
    const internalTechnicalParams: string[] = [];
    
    // Always use MJ7 (internal only)
    internalTechnicalParams.push('--v 7');
    
    // Add aspect ratio
    internalTechnicalParams.push(`--ar ${settings.aspectRatio}`);
    
    // Add quality setting
    if (settings.quality === 'ultra') {
      internalTechnicalParams.push('--q 2');
    } else if (settings.quality === 'high') {
      internalTechnicalParams.push('--q 1');
    }
    
    // Add stylization
    if (settings.stylize !== 100) {
      internalTechnicalParams.push(`--s ${settings.stylize}`);
    }

    // Create user-facing prompt (clean, no technical parameters visible)
    const userPrompt = basePrompt;
    
    // Create internal prompt with technical parameters (for API)
    const internalPrompt = `${basePrompt} ${internalTechnicalParams.join(' ')}`;

    // Try AI enhancement (using user prompt for enhancement, but return internal prompt for API)
    try {
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enhance_unified',
          userInput: userPrompt,
          designOptions: options,
          generationSettings: settings
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Enhance the user prompt but add technical parameters for internal use
        const enhancedUserPrompt = data.result;
        return `${enhancedUserPrompt} ${internalTechnicalParams.join(' ')}`;
      }
    } catch (error) {
      console.warn('AI enhancement failed, using base generation:', error);
    }

    // Return internal prompt with technical parameters (hidden from user display)
    return internalPrompt;
  }

  /**
   * Clean user-facing prompt by removing technical parameters
   * This hides Midjourney-specific elements from the UI
   */
  static cleanPromptForDisplay(prompt: string): string {
    // Remove all Midjourney technical parameters
    return prompt
      .replace(/--v\s+\d+(\.\d+)?/g, '') // Remove version parameters
      .replace(/--ar\s+[\d:]+/g, '') // Remove aspect ratio
      .replace(/--q\s+\d+/g, '') // Remove quality
      .replace(/--s\s+\d+/g, '') // Remove stylization
      .replace(/--niji\s+\d+/g, '') // Remove niji parameters
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim();
  }

  /**
   * Helper methods for detailed descriptions
   */
  private static getTrendDescription(trend: string): string {
    const descriptions: Record<string, string> = {
      'minimalist': 'clean architectural silhouettes with precise tailoring',
      'y2k': 'futuristic metallic textures and cyber-inspired elements',
      'cottage-core': 'romantic florals with vintage pastoral charm',
      'tech-wear': 'functional urban utility with modern performance fabrics',
      'vintage': 'classic retro styling with timeless elegance',
      'bohemian': 'flowing fabrics with artistic free-spirited details',
      'streetwear': 'urban casual comfort with contemporary edge',
      'preppy': 'polished collegiate style with refined sophistication'
    };
    return descriptions[trend] || trend;
  }

  private static getColorSchemeDescription(colorScheme: string): string {
    const descriptions: Record<string, string> = {
      'monochrome': 'sophisticated black and white tones',
      'pastel': 'soft dreamy colors and gentle hues',
      'vivid': 'bold saturated colors with high contrast',
      'earth-tone': 'natural warm browns and organic colors',
      'jewel-tone': 'rich emerald and sapphire deep colors',
      'neon': 'electric bright colors with luminous glow',
      'muted': 'subtle understated colors with gentle saturation'
    };
    return descriptions[colorScheme] || colorScheme;
  }

  private static getMoodDescription(mood: string): string {
    const descriptions: Record<string, string> = {
      'casual': 'relaxed comfortable everyday styling',
      'formal': 'elegant sophisticated formal wear',
      'edgy': 'bold rebellious avant-garde styling',
      'romantic': 'feminine delicate dreamy styling',
      'professional': 'polished business-appropriate styling',
      'playful': 'fun whimsical creative styling',
      'sophisticated': 'refined luxurious high-end styling'
    };
    return descriptions[mood] || mood;
  }

  private static getSeasonDescription(season: string): string {
    const descriptions: Record<string, string> = {
      'spring': 'fresh renewal with light layering',
      'summer': 'breathable fabrics with sun-kissed styling',
      'autumn': 'warm rich textures with cozy layering',
      'winter': 'luxurious materials with structured silhouettes'
    };
    return descriptions[season] || season;
  }

  /**
   * Get current season
   */
  private static getCurrentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }
}