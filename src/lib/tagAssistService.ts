import { DesignOptions, TrendType, ColorSchemeType, MoodType, SeasonType } from './types';

export interface TagSuggestion {
  type: 'trend' | 'colorScheme' | 'mood' | 'season';
  value: string;
  confidence: number;
  reason: string;
}

export interface AssistResponse {
  suggestions: TagSuggestion[];
  enhancedPrompt?: string;
  userIntent: string;
}

export interface AssistOptions {
  mode?: 'suggestions' | 'enhance' | 'analyze';
  includePromptEnhancement?: boolean;
  maxSuggestions?: number;
}

/**
 * AI-powered tag suggestion service
 * Helps users discover optimal design options based on their input
 */
export class TagAssistService {
  private static readonly API_ENDPOINT = '/api/assist';

  /**
   * Get AI-powered tag suggestions based on user input
   */
  static async getSuggestions(
    userInput: string,
    currentOptions?: Partial<DesignOptions>,
    options: AssistOptions = {}
  ): Promise<AssistResponse> {
    const {
      mode = 'suggestions',
      maxSuggestions = 6
    } = options;

    try {
      console.log('[TagAssist] Calling API with:', { userInput, currentOptions, mode });
      
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput,
          currentOptions,
          mode
        })
      });

      if (!response.ok) {
        throw new Error(`Assist API error: ${response.statusText}`);
      }

      const result: AssistResponse = await response.json();
      console.log('[TagAssist] API Response:', result);

      // Limit suggestions count
      if (result.suggestions && result.suggestions.length > maxSuggestions) {
        result.suggestions = result.suggestions
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, maxSuggestions);
      }

      return result;
    } catch (error) {
      console.error('Tag assist service error:', error);
      
      // Return fallback response
      return {
        suggestions: [],
        userIntent: userInput,
        enhancedPrompt: undefined
      };
    }
  }

  /**
   * Get enhanced prompt with optimal tag suggestions applied
   */
  static async getEnhancedPrompt(
    userInput: string,
    currentOptions?: Partial<DesignOptions>
  ): Promise<{ prompt: string; appliedTags: TagSuggestion[] }> {
    try {
      const result = await this.getSuggestions(userInput, currentOptions, {
        mode: 'enhance',
        includePromptEnhancement: true
      });

      // Find high-confidence suggestions that were applied
      const appliedTags = result.suggestions.filter(s => s.confidence > 0.7);

      return {
        prompt: result.enhancedPrompt || userInput,
        appliedTags
      };
    } catch (error) {
      console.error('Enhanced prompt generation failed:', error);
      return {
        prompt: userInput,
        appliedTags: []
      };
    }
  }

  /**
   * Analyze user intent without specific suggestions
   */
  static async analyzeIntent(userInput: string): Promise<string> {
    try {
      const result = await this.getSuggestions(userInput, {}, {
        mode: 'analyze'
      });

      return result.userIntent;
    } catch (error) {
      console.error('Intent analysis failed:', error);
      return `Fashion design request: ${userInput}`;
    }
  }

  /**
   * Apply suggested tags to current design options
   */
  static applySuggestions(
    currentOptions: DesignOptions,
    suggestions: TagSuggestion[],
    confidenceThreshold = 0.7
  ): DesignOptions {
    const updatedOptions = { ...currentOptions };
    
    // Apply high-confidence suggestions
    suggestions.forEach(suggestion => {
      if (suggestion.confidence >= confidenceThreshold) {
        switch (suggestion.type) {
          case 'trend':
            if (!updatedOptions.trend) {
              updatedOptions.trend = suggestion.value as TrendType;
            }
            break;
          case 'colorScheme':
            if (!updatedOptions.colorScheme) {
              updatedOptions.colorScheme = suggestion.value as ColorSchemeType;
            }
            break;
          case 'mood':
            if (!updatedOptions.mood) {
              updatedOptions.mood = suggestion.value as MoodType;
            }
            break;
          case 'season':
            if (!updatedOptions.season) {
              updatedOptions.season = suggestion.value as SeasonType;
            }
            break;
        }
      }
    });

    return updatedOptions;
  }

  /**
   * Get suggestions for complementary tags based on current selection
   */
  static async getComplementarySuggestions(
    currentOptions: DesignOptions
  ): Promise<TagSuggestion[]> {
    // Create a description of current selections
    const selections: string[] = [];
    
    if (currentOptions.trend) {
      selections.push(`${currentOptions.trend} trend`);
    }
    if (currentOptions.colorScheme) {
      selections.push(`${currentOptions.colorScheme} colors`);
    }
    if (currentOptions.mood) {
      selections.push(`${currentOptions.mood} mood`);
    }
    if (currentOptions.season) {
      selections.push(`${currentOptions.season} season`);
    }

    if (selections.length === 0) {
      return [];
    }

    const userInput = `I want a design with ${selections.join(', ')}. What other style elements would work well with this combination?`;

    try {
      const result = await this.getSuggestions(userInput, currentOptions, {
        maxSuggestions: 4
      });

      // Filter out suggestions for categories that are already selected
      return result.suggestions.filter(suggestion => {
        switch (suggestion.type) {
          case 'trend':
            return !currentOptions.trend;
          case 'colorScheme':
            return !currentOptions.colorScheme;
          case 'mood':
            return !currentOptions.mood;
          case 'season':
            return !currentOptions.season;
          default:
            return false;
        }
      });
    } catch (error) {
      console.error('Complementary suggestions failed:', error);
      return [];
    }
  }

  /**
   * Validate if a suggestion is applicable to current context
   */
  static isValidSuggestion(
    suggestion: TagSuggestion,
    currentOptions: DesignOptions
  ): boolean {
    // Check if the suggestion category is already filled
    switch (suggestion.type) {
      case 'trend':
        return !currentOptions.trend;
      case 'colorScheme':
        return !currentOptions.colorScheme;
      case 'mood':
        return !currentOptions.mood;
      case 'season':
        return !currentOptions.season;
      default:
        return false;
    }
  }

  /**
   * Get human-readable description for tag type
   */
  static getTagTypeLabel(type: string): string {
    switch (type) {
      case 'trend':
        return 'トレンド';
      case 'colorScheme':
        return 'カラースキーム';
      case 'mood':
        return 'ムード';
      case 'season':
        return 'シーズン';
      default:
        return type;
    }
  }

  /**
   * Get human-readable description for tag value
   */
  static getTagValueLabel(type: string, value: string): string {
    const labels: Record<string, Record<string, string>> = {
      trend: {
        'minimalist': 'ミニマリスト',
        'y2k': 'Y2K',
        'cottage-core': 'コテージコア',
        'tech-wear': 'テックウェア',
        'vintage': 'ヴィンテージ',
        'bohemian': 'ボヘミアン',
        'streetwear': 'ストリートウェア',
        'preppy': 'プレッピー'
      },
      colorScheme: {
        'monochrome': 'モノクローム',
        'pastel': 'パステル',
        'vivid': 'ヴィヴィッド',
        'earth-tone': 'アースト',
        'jewel-tone': 'ジュエルト',
        'neon': 'ネオン',
        'muted': 'ミューテッド'
      },
      mood: {
        'casual': 'カジュアル',
        'formal': 'フォーマル',
        'edgy': 'エッジー',
        'romantic': 'ロマンティック',
        'professional': 'プロフェッショナル',
        'playful': 'プレイフル',
        'sophisticated': 'ソフィスティケート'
      },
      season: {
        'spring': '春',
        'summer': '夏',
        'autumn': '秋',
        'winter': '冬'
      }
    };

    return labels[type]?.[value] || value;
  }
}