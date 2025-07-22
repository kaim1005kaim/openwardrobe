interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: DeepSeekMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class DeepSeekService {
  private static readonly API_URL = 'https://api.deepseek.com/v1/chat/completions';
  private static readonly API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || 'sk-cfff619084d6485fb5ef807e5a8c9370';
  
  /**
   * Main chat completion method
   */
  static async chat(messages: DeepSeekMessage[], temperature = 0.7, maxTokens = 1000): Promise<string> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.statusText}`);
      }

      const data: DeepSeekResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }

  /**
   * Enhance fashion prompt with AI
   */
  static async enhancePrompt(
    userInput: string, 
    designOptions: any,
    userPreferences?: string
  ): Promise<string> {
    const systemPrompt = `You are a fashion design AI assistant specializing in creating Midjourney prompts for Japanese fashion designers. 
Your task is to enhance user prompts to create stunning, commercially viable fashion designs.

Key responsibilities:
1. Transform simple ideas into detailed, artistic Midjourney prompts
2. Incorporate current Japanese and global fashion trends
3. Maintain cultural sensitivity and local market preferences
4. Add technical photography and styling details
5. Ensure prompts generate commercially appealing designs

CRITICAL RULES:
- NEVER include text, words, letters, numbers, or typography in the prompt
- NEVER mention signs, labels, logos, or written elements
- Focus ONLY on visual fashion elements, materials, colors, and photography techniques
- ALWAYS specify "single model", "one person only", "fashion lookbook style"
- ALWAYS specify "clean minimal background", "full body composition"
- AVOID multiple people, collage layouts, grid compositions, or split-screen effects
- Add comprehensive --no parameters at the end of every prompt

Output format: Return ONLY the enhanced Midjourney prompt in English, optimized for fashion photography.
Include camera angles, lighting, fabric details, and artistic style descriptors.
ALWAYS include composition requirements: single model, clean background, full body shot.`;

    const userMessage = `User input: "${userInput}"
Design preferences: ${JSON.stringify(designOptions)}
${userPreferences ? `User style preferences: ${userPreferences}` : ''}

Create an enhanced Midjourney prompt for fashion design.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    const enhancedPrompt = await this.chat(messages, 0.8, 500);
    
    // Ensure no text parameters and add Midjourney no-text parameters
    const cleanedPrompt = enhancedPrompt
      .replace(/\b(text|words?|letters?|typography|signs?|labels?)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Add comprehensive no-parameters if not already present
    if (!cleanedPrompt.includes('--no')) {
      return `${cleanedPrompt} --no text, words, letters, typography, signs, labels, multiple people, collage, grid, panels, frames, split screen, comic style, manga panels, multiple angles, contact sheet`;
    }
    
    return cleanedPrompt;
  }

  /**
   * Get current fashion trends
   */
  static async getCurrentTrends(season: string, year: number): Promise<string[]> {
    const systemPrompt = `You are a fashion trend analyst. Provide current fashion trends for the Japanese market.
Return a JSON array of 5-7 specific trend keywords or short phrases.
Focus on: colors, styles, materials, and design elements.`;

    const userMessage = `What are the current fashion trends for ${season} ${year} in Japan?
Consider both local and international influences.
Format: ["trend1", "trend2", ...]`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await this.chat(messages, 0.5, 300);
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse trends:', error);
      return ['minimalist', 'sustainable', 'tech-wear', 'vintage-revival', 'bold-colors'];
    }
  }

  /**
   * Refine prompt through conversation
   */
  static async refinePrompt(
    currentPrompt: string,
    userFeedback: string
  ): Promise<string> {
    const systemPrompt = `You are helping refine a Midjourney fashion design prompt based on user feedback.
Modify the prompt while maintaining its core concept and adding the requested changes.
Keep the technical photography parameters intact.

CRITICAL RULES:
- NEVER include text, words, letters, numbers, or typography in the prompt
- Maintain the "--no text" parameters at the end
- Focus ONLY on visual fashion elements`;

    const userMessage = `Current prompt: "${currentPrompt}"
User feedback: "${userFeedback}"

Provide the refined prompt.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    const refinedPrompt = await this.chat(messages, 0.7, 500);
    
    // Ensure no-text parameters are maintained
    if (!refinedPrompt.includes('--no')) {
      return `${refinedPrompt} --no text, words, letters, typography, signs, labels`;
    }
    
    return refinedPrompt;
  }

  /**
   * Generate style suggestions based on input
   */
  static async generateStyleSuggestions(userInput: string): Promise<string[]> {
    const systemPrompt = `Suggest 3-5 fashion style variations for the given concept.
Each suggestion should be a complete but concise style direction.
Focus on Japanese fashion market preferences.
Return as JSON array.`;

    const userMessage = `Base concept: "${userInput}"
Provide style variations that would appeal to Japanese fashion designers.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await this.chat(messages, 0.9, 400);
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse suggestions:', error);
      return [];
    }
  }

  /**
   * Analyze user preferences from history
   */
  static async analyzeUserPreferences(promptHistory: string[]): Promise<string> {
    if (promptHistory.length < 3) {
      return 'No clear preferences detected yet';
    }

    const systemPrompt = `Analyze the user's fashion design preferences based on their prompt history.
Identify patterns in: styles, colors, moods, materials, and design approaches.
Provide a concise summary of their preferences.`;

    const userMessage = `Recent prompts:
${promptHistory.slice(-10).map((p, i) => `${i + 1}. ${p}`).join('\n')}

What are this user's fashion design preferences?`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    return await this.chat(messages, 0.5, 300);
  }

  /**
   * Enhanced unified prompt generation
   * Used by the TagAssist API for integrated prompt enhancement
   */
  static async enhanceUnifiedPrompt(
    userInput: string,
    designOptions: any,
    generationSettings: any
  ): Promise<string> {
    const systemPrompt = `You are a fashion design AI assistant specialized in creating optimized Midjourney prompts for Japanese fashion designers.

Your task is to create a comprehensive prompt that incorporates:
1. User's creative input
2. Selected design options (trend, colors, mood, season)
3. Generation settings (aspect ratio, quality, stylization)
4. Professional photography specifications

CRITICAL RULES:
- NEVER include text, words, letters, numbers, or typography in the prompt
- NEVER mention signs, labels, logos, or written elements
- Focus ONLY on visual fashion elements, materials, colors, and photography techniques
- ALWAYS specify "single model", "one person only", "fashion lookbook style"
- ALWAYS specify "clean minimal background", "full body composition"
- AVOID multiple people, collage layouts, grid compositions, or split-screen effects
- Return ONLY the enhanced prompt text (no technical parameters)

Output format: Enhanced Midjourney prompt in English, optimized for fashion photography.`;

    const selectedElements = [];
    if (designOptions.trend) selectedElements.push(`${designOptions.trend} trend`);
    if (designOptions.colorScheme) selectedElements.push(`${designOptions.colorScheme} color palette`);
    if (designOptions.mood) selectedElements.push(`${designOptions.mood} mood`);
    if (designOptions.season) selectedElements.push(`${designOptions.season} season`);

    const userMessage = `User request: "${userInput}"
Selected elements: ${selectedElements.join(', ')}
Aspect ratio: ${generationSettings.aspectRatio || '1:1'}
Quality: ${generationSettings.quality || 'high'}

Create an enhanced unified fashion design prompt that incorporates all these elements.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    const enhancedPrompt = await this.chat(messages, 0.8, 600);
    
    // Clean the prompt and ensure no text parameters
    return enhancedPrompt
      .replace(/\b(text|words?|letters?|typography|signs?|labels?)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}