import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
// import * as Sentry from '@sentry/nextjs';

// Input validation schema
const DescribeRequestSchema = z.object({
  imageUrl: z.string().url('有効な画像URLを指定してください'),
  language: z.enum(['en', 'ja']).optional().default('ja')
});

type DescribeRequest = z.infer<typeof DescribeRequestSchema>;

interface MidjourneyDescribeRequest {
  image_url: string;
}

interface MidjourneyDescribeResponse {
  success: boolean;
  descriptions?: string[];
  error?: string;
}

interface DeepSeekVisionRequest {
  model: string;
  messages: Array<{
    role: string;
    content: Array<{
      type: string;
      text?: string;
      image_url?: {
        url: string;
      };
    }>;
  }>;
  max_tokens: number;
  temperature: number;
}

// Helper function to translate prompts using DeepSeek
async function translatePrompts(prompts: string[], targetLang: 'ja' | 'en'): Promise<string[]> {
  if (targetLang === 'en') return prompts; // Midjourney returns English by default
  
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
  if (!deepseekApiKey) {
    console.warn('DeepSeek API key not found, returning original prompts');
    return prompts;
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'あなたは優秀な翻訳者です。Midjourneyのプロンプトを日本語に翻訳してください。ファッション用語は適切な日本語に変換し、スタイル記述は自然な日本語で表現してください。'
          },
          {
            role: 'user',
            content: `以下のMidjourneyプロンプトを日本語に翻訳してください。各プロンプトは番号付きで、1行ずつ返してください：\n\n${prompts.map((p, i) => `${i + 1}. ${p}`).join('\n')}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0]?.message?.content || '';
    
    // Parse numbered list back to array
    const translated = translatedText
      .split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());

    return translated.length === prompts.length ? translated : prompts;
  } catch (error) {
    console.error('Translation error:', error);
    return prompts;
  }
}

export async function POST(req: NextRequest) {
  console.log('🎨 [Describe API] Received describe request');
  
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log('❌ [Describe API] Unauthorized - no session');
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    console.log('📝 [Describe API] Request body:', {
      ...body,
      imageUrl: body.imageUrl?.substring(0, 50) + '...'
    });
    
    let validatedData: DescribeRequest;
    try {
      validatedData = DescribeRequestSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('❌ [Describe API] Validation error:', error.issues);
        return NextResponse.json(
          { 
            error: 'リクエストが無効です', 
            details: error.issues.map(e => ({
              field: e.path.join('.'),
              message: e.message
            }))
          },
          { status: 400 }
        );
      }
      throw error;
    }

    const { imageUrl, language } = validatedData;

    // Check Midjourney API token
    const mjToken = process.env.MIDJOURNEY_API_TOKEN;
    if (!mjToken) {
      console.error('❌ [Describe API] MIDJOURNEY_API_TOKEN not configured');
      // Sentry.captureException(new Error('MIDJOURNEY_API_TOKEN not configured'));
      return NextResponse.json(
        { error: 'APIトークンが設定されていません' },
        { status: 500 }
      );
    }

    // Prepare Midjourney API request
    const mjRequest: MidjourneyDescribeRequest = {
      image_url: imageUrl
    };

    console.log('📤 [Describe API] Sending to Midjourney');

    // Call Midjourney Describe API
    const mjResponse = await fetch('https://api.midjourneyapi.xyz/mj/v2/describe', {
      method: 'POST',
      headers: {
        'X-API-KEY': mjToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mjRequest)
    });

    const mjData: MidjourneyDescribeResponse = await mjResponse.json();
    console.log('📥 [Describe API] Midjourney response:', mjData);

    if (!mjResponse.ok) {
      console.error('❌ [Describe API] Midjourney API error:', mjData);
      // Sentry.captureException(new Error(`Midjourney API error: ${mjData.error || mjResponse.statusText}`));
      
      return NextResponse.json(
        { 
          error: mjData.error || '画像の解析に失敗しました',
          details: mjData
        },
        { status: mjResponse.status }
      );
    }

    if (!mjData.success || !mjData.descriptions || mjData.descriptions.length === 0) {
      console.error('❌ [Describe API] No descriptions returned:', mjData);
      return NextResponse.json(
        { error: '画像からプロンプトを生成できませんでした' },
        { status: 500 }
      );
    }

    // Translate descriptions if needed
    let finalDescriptions = mjData.descriptions;
    if (language === 'ja') {
      console.log('🌐 [Describe API] Translating to Japanese...');
      finalDescriptions = await translatePrompts(mjData.descriptions, 'ja');
    }

    // Enhance descriptions with fashion-specific context
    const enhancedDescriptions = finalDescriptions.map(desc => {
      // Add fashion-specific prefix for better results
      const prefix = language === 'ja' 
        ? 'ファッション写真、プロフェッショナル撮影、' 
        : 'Fashion photography, professional shoot, ';
      return prefix + desc;
    });

    // Return success response
    return NextResponse.json({
      success: true,
      descriptions: enhancedDescriptions,
      originalDescriptions: mjData.descriptions,
      message: language === 'ja' 
        ? '画像からプロンプトを生成しました' 
        : 'Successfully generated prompts from image'
    });

  } catch (error) {
    console.error('❌ [Describe API] Unexpected error:', error);
    // Sentry.captureException(error);
    
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// OPTIONS method for CORS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}