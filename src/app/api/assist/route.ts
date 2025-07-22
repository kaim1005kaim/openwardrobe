import { NextRequest, NextResponse } from 'next/server';
import { DeepSeekService } from '@/lib/deepseekService';
import { DesignOptions, TrendType, ColorSchemeType, MoodType, SeasonType } from '@/lib/types';

interface TagSuggestion {
  type: 'trend' | 'colorScheme' | 'mood' | 'season';
  value: string;
  confidence: number;
  reason: string;
}

interface AssistResponse {
  suggestions: TagSuggestion[];
  enhancedPrompt?: string;
  userIntent: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userInput, currentOptions, mode = 'suggestions' } = body;

    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json(
        { error: 'User input is required' },
        { status: 400 }
      );
    }

    let result: AssistResponse;

    switch (mode) {
      case 'suggestions':
        result = await generateTagSuggestions(userInput, currentOptions);
        break;
      
      case 'enhance':
        result = await enhanceWithSuggestions(userInput, currentOptions);
        break;
      
      case 'analyze':
        result = await analyzeUserIntent(userInput);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid mode. Use "suggestions", "enhance", or "analyze"' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Assist API error:', error);
    return NextResponse.json(
      { error: 'Failed to process assistance request' },
      { status: 500 }
    );
  }
}

/**
 * Generate AI-powered tag suggestions based on user input
 */
async function generateTagSuggestions(
  userInput: string, 
  currentOptions?: Partial<DesignOptions>
): Promise<AssistResponse> {
  const systemPrompt = `You are a fashion design AI assistant specialized in Japanese fashion trends and global style preferences. 

Your task is to analyze user descriptions and suggest optimal design options (tags) from the following categories:

TRENDS: minimalist, y2k, cottage-core, tech-wear, vintage, bohemian, streetwear, preppy
COLORS: monochrome, pastel, vivid, earth-tone, jewel-tone, neon, muted  
MOODS: casual, formal, edgy, romantic, professional, playful, sophisticated
SEASONS: spring, summer, autumn, winter

IMPORTANT RULES:
1. Suggest only values that exist in the categories above
2. Provide confidence scores (0-1) based on how well the suggestion matches the user input
3. Give brief, helpful explanations for each suggestion
4. Consider Japanese fashion market preferences
5. Be selective - only suggest tags that truly match the user's intent

Return ONLY valid JSON in this format:
{
  "userIntent": "brief interpretation of what the user wants",
  "suggestions": [
    {
      "type": "trend|colorScheme|mood|season",
      "value": "exact_value_from_categories",
      "confidence": 0.0-1.0,
      "reason": "why this tag fits"
    }
  ]
}`;

  const userMessage = `User input: "${userInput}"

${currentOptions ? `Current selections: ${JSON.stringify(currentOptions)}` : ''}

Analyze this input and suggest the most appropriate design tags. Focus on what the user is truly trying to achieve.`;

  try {
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userMessage }
    ];

    const response = await DeepSeekService.chat(messages, 0.7, 800);
    const parsed = JSON.parse(response);

    // Validate and filter suggestions
    const validSuggestions = parsed.suggestions?.filter((s: any) => 
      isValidSuggestion(s)
    ) || [];

    return {
      suggestions: validSuggestions,
      userIntent: parsed.userIntent || userInput,
    };
  } catch (error) {
    console.error('Failed to generate suggestions:', error);
    
    // Fallback to rule-based suggestions
    return generateFallbackSuggestions(userInput);
  }
}

/**
 * Enhanced mode: provide both suggestions and enhanced prompt
 */
async function enhanceWithSuggestions(
  userInput: string,
  currentOptions?: Partial<DesignOptions>
): Promise<AssistResponse> {
  const suggestions = await generateTagSuggestions(userInput, currentOptions);
  
  // Create enhanced design options by applying top suggestions
  const enhancedOptions: DesignOptions = {
    trend: currentOptions?.trend || null,
    colorScheme: currentOptions?.colorScheme || null, 
    mood: currentOptions?.mood || null,
    season: currentOptions?.season || null,
  };

  // Apply high-confidence suggestions
  suggestions.suggestions.forEach(suggestion => {
    if (suggestion.confidence > 0.7) {
      if (suggestion.type === 'trend') {
        enhancedOptions.trend = suggestion.value as TrendType;
      } else if (suggestion.type === 'colorScheme') {
        enhancedOptions.colorScheme = suggestion.value as ColorSchemeType;
      } else if (suggestion.type === 'mood') {
        enhancedOptions.mood = suggestion.value as MoodType;
      } else if (suggestion.type === 'season') {
        enhancedOptions.season = suggestion.value as SeasonType;
      }
    }
  });

  // Generate enhanced prompt using DeepSeek
  let enhancedPrompt: string | undefined;
  try {
    enhancedPrompt = await DeepSeekService.enhancePrompt(userInput, enhancedOptions);
  } catch (error) {
    console.warn('Failed to enhance prompt:', error);
  }

  return {
    ...suggestions,
    enhancedPrompt
  };
}

/**
 * Analyze user intent without providing specific suggestions
 */
async function analyzeUserIntent(userInput: string): Promise<AssistResponse> {
  const systemPrompt = `Analyze the user's fashion design intent and provide insights about their request.
Focus on understanding what they're trying to achieve and what style direction would work best.

Return JSON format:
{
  "userIntent": "detailed interpretation of the user's creative goals",
  "suggestions": []
}`;

  const userMessage = `Analyze this fashion design request: "${userInput}"

What is the user trying to create? What are their underlying style goals?`;

  try {
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userMessage }
    ];

    const response = await DeepSeekService.chat(messages, 0.6, 400);
    const parsed = JSON.parse(response);

    return {
      suggestions: [],
      userIntent: parsed.userIntent || userInput
    };
  } catch (error) {
    return {
      suggestions: [],
      userIntent: `Intent analysis for: "${userInput}"`
    };
  }
}

/**
 * Validate suggestion format and values
 */
function isValidSuggestion(suggestion: any): suggestion is TagSuggestion {
  if (!suggestion || typeof suggestion !== 'object') return false;
  
  const validTrends = ['minimalist', 'y2k', 'cottage-core', 'tech-wear', 'vintage', 'bohemian', 'streetwear', 'preppy'];
  const validColors = ['monochrome', 'pastel', 'vivid', 'earth-tone', 'jewel-tone', 'neon', 'muted'];
  const validMoods = ['casual', 'formal', 'edgy', 'romantic', 'professional', 'playful', 'sophisticated'];
  const validSeasons = ['spring', 'summer', 'autumn', 'winter'];
  
  const { type, value, confidence, reason } = suggestion;
  
  if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) return false;
  if (typeof reason !== 'string' || !reason.trim()) return false;
  
  switch (type) {
    case 'trend':
      return validTrends.includes(value);
    case 'colorScheme':
      return validColors.includes(value);
    case 'mood':
      return validMoods.includes(value);
    case 'season':
      return validSeasons.includes(value);
    default:
      return false;
  }
}

/**
 * Fallback rule-based suggestions when AI fails
 */
function generateFallbackSuggestions(userInput: string): AssistResponse {
  const input = userInput.toLowerCase();
  const suggestions: TagSuggestion[] = [];

  // Simple keyword matching
  if (input.includes('business') || input.includes('office') || input.includes('work')) {
    suggestions.push({
      type: 'mood',
      value: 'professional',
      confidence: 0.8,
      reason: 'Business context detected'
    });
  }

  if (input.includes('casual') || input.includes('everyday') || input.includes('relaxed')) {
    suggestions.push({
      type: 'mood', 
      value: 'casual',
      confidence: 0.7,
      reason: 'Casual style indicators found'
    });
  }

  if (input.includes('minimal') || input.includes('simple') || input.includes('clean')) {
    suggestions.push({
      type: 'trend',
      value: 'minimalist',
      confidence: 0.8,
      reason: 'Minimalist design elements mentioned'
    });
  }

  if (input.includes('colorful') || input.includes('bright') || input.includes('vibrant')) {
    suggestions.push({
      type: 'colorScheme',
      value: 'vivid',
      confidence: 0.7,
      reason: 'Bright color preferences indicated'
    });
  }

  return {
    suggestions,
    userIntent: `Fashion design request: ${userInput}`
  };
}