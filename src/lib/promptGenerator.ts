import { DesignOptions, StyleElements, PromptSettings } from './types';

export class PromptGenerator {
  private static styleElements: StyleElements = {
    trends: {
      'minimalist': ['clean lines', 'simple silhouette', 'neutral tones', 'unstructured design', 'geometric shapes'],
      'y2k': ['low-rise', 'metallic fabrics', 'bold accessories', 'futuristic elements', 'holographic details'],
      'cottage-core': ['floral prints', 'flowing fabrics', 'vintage details', 'romantic ruffles', 'pastoral elements'],
      'tech-wear': ['functional pockets', 'waterproof materials', 'urban aesthetic', 'modular design', 'tactical elements'],
      'vintage': ['retro patterns', 'classic silhouettes', 'timeless elegance', 'heritage details', 'nostalgic elements'],
      'bohemian': ['free-flowing fabrics', 'ethnic patterns', 'layered textures', 'artistic prints', 'unconventional combinations'],
      'streetwear': ['oversized fit', 'graphic elements', 'urban culture', 'casual comfort', 'statement pieces'],
      'preppy': ['structured tailoring', 'classic patterns', 'polished details', 'traditional elements', 'refined aesthetics']
    },
    
    colorSchemes: {
      'monochrome': ['black and white', 'grayscale palette', 'minimal contrast', 'stark simplicity', 'tonal variations'],
      'pastel': ['soft pink', 'baby blue', 'lavender', 'mint green', 'powder yellow', 'gentle hues'],
      'vivid': ['electric blue', 'hot pink', 'neon green', 'bright orange', 'vibrant red', 'bold saturation'],
      'earth-tone': ['terracotta', 'olive green', 'sand beige', 'rust brown', 'warm ochre', 'natural palette'],
      'jewel-tone': ['emerald green', 'sapphire blue', 'ruby red', 'amethyst purple', 'rich colors'],
      'neon': ['fluorescent pink', 'electric lime', 'cyber blue', 'laser orange', 'glowing accents'],
      'muted': ['dusty rose', 'sage green', 'soft gray', 'muted blue', 'subtle tones']
    },
    
    moods: {
      'casual': ['relaxed fit', 'comfortable wear', 'everyday style', 'effortless elegance', 'laid-back attitude'],
      'formal': ['tailored precision', 'sophisticated design', 'elegant lines', 'professional appearance', 'refined details'],
      'edgy': ['asymmetric design', 'bold statement', 'unconventional elements', 'rebellious spirit', 'avant-garde'],
      'romantic': ['delicate details', 'flowing movement', 'feminine touch', 'soft textures', 'dreamy aesthetics'],
      'professional': ['clean structure', 'business appropriate', 'polished finish', 'confident silhouette', 'workplace ready'],
      'playful': ['fun elements', 'whimsical details', 'youthful energy', 'creative expression', 'joyful design'],
      'sophisticated': ['luxury materials', 'refined craftsmanship', 'timeless appeal', 'elevated design', 'mature elegance']
    },
    
    seasons: {
      'spring': ['light layers', 'fresh colors', 'breathable fabrics', 'blooming patterns', 'renewal energy'],
      'summer': ['lightweight materials', 'bright colors', 'airy silhouettes', 'sun-ready designs', 'vacation vibes'],
      'autumn': ['warm layers', 'rich colors', 'cozy textures', 'harvest tones', 'transitional pieces'],
      'winter': ['insulated layers', 'deep colors', 'warm fabrics', 'protective elements', 'holiday elegance']
    }
  };

  static generatePrompt(options: DesignOptions, settings: PromptSettings = {
    creativityLevel: 'balanced',
    includeSeasonalConsistency: true,
    includeColorHarmony: true,
    cameraAngle: 'random',
    aspectRatio: '--ar 3:4',
    quality: 'high'
  }): string {
    const elements: string[] = [];
    
    // Base fashion description
    elements.push('fashion photography');
    
    // Add trend elements
    if (options.trend) {
      const trendElements = this.styleElements.trends[options.trend];
      elements.push(...this.selectRandomElements(trendElements, 2));
    }
    
    // Add color scheme
    if (options.colorScheme) {
      const colorElements = this.styleElements.colorSchemes[options.colorScheme];
      elements.push(...this.selectRandomElements(colorElements, 2));
    }
    
    // Add mood
    if (options.mood) {
      const moodElements = this.styleElements.moods[options.mood];
      elements.push(...this.selectRandomElements(moodElements, 2));
    }
    
    // Add seasonal elements
    if (settings.includeSeasonalConsistency && options.season) {
      const seasonElements = this.styleElements.seasons[options.season];
      elements.push(...this.selectRandomElements(seasonElements, 1));
    }
    
    // Add photography and quality elements
    const cameraAngles = {
      'full-body': 'full body shot',
      'portrait': 'portrait shot',
      'random': this.getRandomElement(['full body shot', 'portrait shot', 'three-quarter view'])
    };
    
    elements.push(cameraAngles[settings.cameraAngle]);
    
    // Add quality modifiers
    const qualityModifiers = {
      'standard': ['professional photography', 'good lighting'],
      'high': ['studio lighting', 'professional photography', 'high resolution', 'detailed'],
      'ultra': ['studio lighting', 'professional photography', 'high resolution', 'ultra detailed', 'award winning', 'masterpiece']
    };
    
    elements.push(...qualityModifiers[settings.quality]);
    
    // Add creativity level modifiers
    const creativityModifiers = {
      'conservative': ['classic style', 'timeless design'],
      'balanced': ['modern style', 'contemporary design'],
      'experimental': ['innovative design', 'creative interpretation'],
      'maximum': ['avant-garde', 'artistic interpretation', 'boundary-pushing design']
    };
    
    elements.push(...creativityModifiers[settings.creativityLevel]);
    
    // Construct final prompt
    let prompt = elements.join(', ');
    
    // Add composition and framing requirements for ideal fashion photography
    const compositionElements = [
      'single model',
      'one person only', 
      'clean minimal background',
      'fashion lookbook style',
      'full body composition',
      'professional fashion photography'
    ];
    
    elements.push(...compositionElements);
    
    // Add technical parameters
    if (settings.aspectRatio) {
      prompt += ` ${settings.aspectRatio}`;
    }
    
    // Add quality suffix and comprehensive no-parameters to avoid unwanted compositions
    prompt += ' --v 6.1 --style raw --no text, words, letters, typography, signs, labels, multiple people, collage, grid, panels, frames, split screen, comic style, manga panels, multiple angles, contact sheet';
    
    return prompt;
  }

  private static selectRandomElements(array: string[], count: number): string[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate variations of the same concept
   */
  static generateVariations(baseOptions: DesignOptions, count: number = 3): string[] {
    const variations: string[] = [];
    
    for (let i = 0; i < count; i++) {
      // Create slight variations in creativity level
      const creativityLevels: ('conservative' | 'balanced' | 'experimental')[] = ['conservative', 'balanced', 'experimental'];
      const settings: PromptSettings = {
        creativityLevel: creativityLevels[i % creativityLevels.length],
        includeSeasonalConsistency: true,
        includeColorHarmony: true,
        cameraAngle: 'random',
        aspectRatio: '--ar 3:4',
        quality: 'high'
      };
      
      variations.push(this.generatePrompt(baseOptions, settings));
    }
    
    return variations;
  }

  /**
   * Generate a completely random design
   */
  static generateRandomDesign(): DesignOptions {
    const trends = Object.keys(this.styleElements.trends) as (keyof typeof this.styleElements.trends)[];
    const colorSchemes = Object.keys(this.styleElements.colorSchemes) as (keyof typeof this.styleElements.colorSchemes)[];
    const moods = Object.keys(this.styleElements.moods) as (keyof typeof this.styleElements.moods)[];
    const seasons = Object.keys(this.styleElements.seasons) as (keyof typeof this.styleElements.seasons)[];
    
    return {
      trend: this.getRandomElement(trends),
      colorScheme: this.getRandomElement(colorSchemes),
      mood: this.getRandomElement(moods),
      season: this.getRandomElement(seasons)
    };
  }

  /**
   * Generate prompt using legacy system (for advanced users)
   */
  static generateAdvancedPrompt(options: DesignOptions): string {
    // This will integrate with the existing OpenDesign prompt generation system
    // For now, we'll use a simplified version
    
    const elements: string[] = [];
    
    if (options.trend) {
      elements.push(`${options.trend} fashion style`);
    }
    
    if (options.colorScheme) {
      elements.push(`${options.colorScheme} color palette`);
    }
    
    if (options.mood) {
      elements.push(`${options.mood} mood`);
    }
    
    if (options.season) {
      elements.push(`${options.season} season appropriate`);
    }
    
    const basePrompt = `Fashion photography, ${elements.join(', ')}, single model, one person only, clean minimal background, fashion lookbook style, full body composition, professional lighting, high quality, detailed, modern style`;
    
    return basePrompt + ' --ar 3:4 --v 6.1 --style raw --no text, words, letters, typography, signs, labels, multiple people, collage, grid, panels, frames, split screen, comic style, manga panels, multiple angles, contact sheet';
  }

  /**
   * Modify existing prompt for style changes
   */
  static modifyPromptForColorChange(originalPrompt: string, newColorScheme: string): string {
    // Remove existing color information and add new
    const colorKeywords = ['monochrome', 'pastel', 'vivid', 'earth-tone', 'jewel-tone', 'neon', 'muted'];
    let modifiedPrompt = originalPrompt;
    
    // Remove old color keywords
    colorKeywords.forEach(keyword => {
      modifiedPrompt = modifiedPrompt.replace(new RegExp(keyword, 'gi'), '');
    });
    
    // Add new color scheme
    const newColorElements = this.styleElements.colorSchemes[newColorScheme as keyof typeof this.styleElements.colorSchemes];
    if (newColorElements) {
      const selectedColors = this.selectRandomElements(newColorElements, 1);
      modifiedPrompt = `${selectedColors.join(', ')}, ${modifiedPrompt}`;
    }
    
    // Ensure comprehensive no-parameters are maintained
    if (!modifiedPrompt.includes('--no')) {
      modifiedPrompt += ' --no text, words, letters, typography, signs, labels, multiple people, collage, grid, panels, frames, split screen, comic style, manga panels, multiple angles, contact sheet';
    }
    
    return modifiedPrompt.replace(/,\s*,/g, ',').trim();
  }

  static modifyPromptForMoodChange(originalPrompt: string, newMood: string): string {
    // Similar to color change but for mood
    const moodKeywords = ['casual', 'formal', 'edgy', 'romantic', 'professional', 'playful', 'sophisticated'];
    let modifiedPrompt = originalPrompt;
    
    // Remove old mood keywords
    moodKeywords.forEach(keyword => {
      modifiedPrompt = modifiedPrompt.replace(new RegExp(keyword, 'gi'), '');
    });
    
    // Add new mood
    const newMoodElements = this.styleElements.moods[newMood as keyof typeof this.styleElements.moods];
    if (newMoodElements) {
      const selectedMoods = this.selectRandomElements(newMoodElements, 1);
      modifiedPrompt = `${selectedMoods.join(', ')}, ${modifiedPrompt}`;
    }
    
    // Ensure comprehensive no-parameters are maintained
    if (!modifiedPrompt.includes('--no')) {
      modifiedPrompt += ' --no text, words, letters, typography, signs, labels, multiple people, collage, grid, panels, frames, split screen, comic style, manga panels, multiple angles, contact sheet';
    }
    
    return modifiedPrompt.replace(/,\s*,/g, ',').trim();
  }
}