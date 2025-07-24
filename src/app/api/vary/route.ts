import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
// import * as Sentry from '@sentry/nextjs';

const prisma = new PrismaClient();

// Input validation schema
const VaryRequestSchema = z.object({
  imageUrl: z.string().url('有効な画像URLを指定してください'),
  variationType: z.enum(['subtle', 'strong']).optional().default('subtle'),
  prompt: z.string().optional(),
  ref: z.string().optional()
});

type VaryRequest = z.infer<typeof VaryRequestSchema>;

interface ImagineAPIVaryRequest {
  prompt: string;
  model?: string;
  ref?: string;
}

interface ImagineAPIResponse {
  data: {
    id: string;
  };
}

export async function POST(req: NextRequest) {
  console.log('🎨 [Vary API] Received variation request');
  
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log('❌ [Vary API] Unauthorized - no session');
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    console.log('📝 [Vary API] Request body:', body);
    
    let validatedData: VaryRequest;
    try {
      validatedData = VaryRequestSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('❌ [Vary API] Validation error:', error.issues);
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

    const { imageUrl, variationType, prompt, ref } = validatedData;

    // Check ImagineAPI token
    const apiToken = process.env.IMAGINE_API_TOKEN;
    const apiUrl = process.env.IMAGINE_API_URL || 'https://cl.imagineapi.dev';
    const apiModel = process.env.IMAGINE_API_MODEL || 'midjourney';
    
    if (!apiToken || apiToken === 'your_imagine_api_token_here') {
      console.error('❌ [Vary API] IMAGINE_API_TOKEN not configured');
      // Sentry.captureException(new Error('IMAGINE_API_TOKEN not configured'));
      return NextResponse.json(
        { error: 'APIトークンが設定されていません' },
        { status: 500 }
      );
    }

    // Create vary prompt for ImagineAPI
    // V1-V4ボタンをシミュレートするため、プロンプトにバリエーションコマンドを追加
    const varyCommand = variationType === 'strong' ? '--vary 2' : '--vary 1';
    const varyPrompt = `${imageUrl} ${varyCommand}${prompt ? ` ${prompt}` : ''}`;
    
    // Prepare ImagineAPI request
    const apiRequest: ImagineAPIVaryRequest = {
      prompt: varyPrompt,
      model: apiModel,
      ...(ref && { ref })
    };

    console.log('📤 [Vary API] Sending to ImagineAPI:', {
      ...apiRequest,
      prompt: apiRequest.prompt.substring(0, 100) + '...'
    });

    // Call ImagineAPI
    const apiResponse = await fetch(`${apiUrl}/items/images/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(apiRequest)
    });

    const apiData = await apiResponse.json();
    console.log('📥 [Vary API] ImagineAPI response:', apiData);

    if (!apiResponse.ok) {
      console.error('❌ [Vary API] ImagineAPI error:', apiData);
      // Sentry.captureException(new Error(`ImagineAPI error: ${apiData.error || apiResponse.statusText}`));
      
      return NextResponse.json(
        { 
          error: apiData.error || 'バリエーション生成に失敗しました',
          details: apiData
        },
        { status: apiResponse.status }
      );
    }

    if (!apiData.data?.id) {
      console.error('❌ [Vary API] Unexpected response format:', apiData);
      return NextResponse.json(
        { error: 'バリエーション生成の開始に失敗しました' },
        { status: 500 }
      );
    }

    // Save job to database
    try {
      const job = await prisma.generationJob.create({
        data: {
          id: apiData.data.id,
          userId: session.user.id,
          params: {
            prompt: prompt || `Variation of ${imageUrl}`,
            action: 'vary',
            designOptions: {},
            sourceImageUrl: imageUrl,
            variationType: variationType,
            originalPrompt: prompt
          },
          status: 'queued',
          progress: 0
        }
      });

      console.log('✅ [Vary API] Job created:', job.id);
    } catch (dbError) {
      console.error('❌ [Vary API] Database error:', dbError);
      // Sentry.captureException(dbError);
      // Continue anyway - the job was submitted to ImagineAPI
    }

    // Return success response
    return NextResponse.json({
      success: true,
      jobId: apiData.data.id,
      message: 'バリエーション生成を開始しました'
    });

  } catch (error) {
    console.error('❌ [Vary API] Unexpected error:', error);
    // Sentry.captureException(error);
    
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
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