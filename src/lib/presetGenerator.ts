import { DesignOptions } from './types';
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