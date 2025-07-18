/**
 * Utility to clean and optimize prompts for text-free fashion generation
 */
export class PromptCleaner {
  /**
   * Remove text-related elements from prompts
   */
  static removeTextElements(prompt: string): string {
    // Words and phrases that might cause text to appear in images
    const textKeywords = [
      'text', 'words?', 'letters?', 'typography', 'font', 'signs?', 'labels?',
      'writing', 'written', 'script', 'caption', 'title', 'heading',
      'logo', 'brand', 'branding', 'graphic design', 'poster',
      'advertising', 'banner', 'display text', 'readable',
      'inscription', 'message', 'slogan', 'tagline'
    ];
    
    let cleanedPrompt = prompt;
    
    // Remove text-related keywords (case insensitive)
    textKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      cleanedPrompt = cleanedPrompt.replace(regex, '');
    });
    
    // Clean up multiple spaces and commas
    cleanedPrompt = cleanedPrompt
      .replace(/,\s*,+/g, ',') // Multiple commas
      .replace(/\s+/g, ' ') // Multiple spaces
      .replace(/,\s*$/, '') // Trailing comma
      .trim();
    
    return cleanedPrompt;
  }
  
  /**
   * Add Midjourney no-text parameters
   */
  static addNoTextParameters(prompt: string): string {
    const noTextParams = '--no text, words, letters, typography, signs, labels, writing';
    
    // Check if no-text parameters already exist
    if (prompt.includes('--no')) {
      // Update existing --no parameter
      return prompt.replace(/--no\s+[^-]+/, noTextParams);
    } else {
      // Add new --no parameter
      return `${prompt} ${noTextParams}`;
    }
  }
  
  /**
   * Complete cleaning process
   */
  static cleanPrompt(prompt: string): string {
    let cleaned = this.removeTextElements(prompt);
    cleaned = this.addNoTextParameters(cleaned);
    
    return cleaned.trim();
  }
  
  /**
   * Clean the example prompt provided by user
   */
  static cleanExamplePrompt(): string {
    const examplePrompt = `Hyper-modern sustainable techwear spring collection, monochrome color scheme with metallic silver accents, featuring modular designs with functional hidden pockets and transformable elements. Low-rise cargo pants with geometric paneling and detachable components, paired with a sleek cropped tech-jacket made from recycled polyester with a liquid metal finish. Photographed in a futuristic Tokyo backstreet at golden hour, using dramatic side lighting to highlight the garment's technical details and metallic sheen. Shot from a low angle to emphasize the elongated silhouette, with the model in dynamic motion to showcase the fabric's movement. Ultra-high definition 8K fashion photography with a cyberpunk aesthetic, blending urban futurism with sustainable design principle`;
    
    return this.cleanPrompt(examplePrompt);
  }
}

// Test the cleaning with the provided example
console.log('Cleaned example prompt:', PromptCleaner.cleanExamplePrompt());