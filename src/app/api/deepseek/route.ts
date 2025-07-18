import { NextRequest, NextResponse } from 'next/server';
import { DeepSeekService } from '@/lib/deepseekService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    let result;

    switch (action) {
      case 'enhance':
        result = await DeepSeekService.enhancePrompt(
          params.userInput,
          params.designOptions,
          params.userPreferences
        );
        break;

      case 'trends':
        result = await DeepSeekService.getCurrentTrends(
          params.season || 'spring',
          params.year || new Date().getFullYear()
        );
        break;

      case 'refine':
        result = await DeepSeekService.refinePrompt(
          params.currentPrompt,
          params.userFeedback
        );
        break;

      case 'suggestions':
        result = await DeepSeekService.generateStyleSuggestions(params.userInput);
        break;

      case 'analyze':
        result = await DeepSeekService.analyzeUserPreferences(params.promptHistory);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}