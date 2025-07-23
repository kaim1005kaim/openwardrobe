import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
// import * as Sentry from '@sentry/nextjs';

const prisma = new PrismaClient();

// Input validation schema
const BlendRequestSchema = z.object({
  imageUrls: z.array(z.string().url('有効な画像URLを指定してください'))
    .min(2, '最低2枚の画像が必要です')
    .max(5, '最大5枚までの画像をブレンドできます'),
  weights: z.array(z.number().min(0).max(1))
    .optional(),
  prompt: z.string().optional(),
  ref: z.string().optional()
});

type BlendRequest = z.infer<typeof BlendRequestSchema>;

interface MidjourneyBlendRequest {
  image_urls: string[];
  weights?: number[];
  prompt?: string;
  ref?: string;
  webhook_override?: string;
}

interface MidjourneyResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function POST(req: NextRequest) {
  console.log('🎨 [Blend API] Received blend request');
  
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log('❌ [Blend API] Unauthorized - no session');
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    console.log('📝 [Blend API] Request body:', {
      ...body,
      imageUrls: body.imageUrls?.map((url: string) => url.substring(0, 50) + '...')
    });
    
    let validatedData: BlendRequest;
    try {
      validatedData = BlendRequestSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('❌ [Blend API] Validation error:', error.issues);
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

    const { imageUrls, weights, prompt, ref } = validatedData;

    // Validate weights if provided
    if (weights && weights.length !== imageUrls.length) {
      return NextResponse.json(
        { error: '画像の数とウェイトの数が一致しません' },
        { status: 400 }
      );
    }

    // Check Midjourney API token
    const mjToken = process.env.MIDJOURNEY_API_TOKEN;
    if (!mjToken) {
      console.error('❌ [Blend API] MIDJOURNEY_API_TOKEN not configured');
      // Sentry.captureException(new Error('MIDJOURNEY_API_TOKEN not configured'));
      return NextResponse.json(
        { error: 'APIトークンが設定されていません' },
        { status: 500 }
      );
    }

    // Get webhook URL
    const webhookUrl = process.env.MIDJOURNEY_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn('⚠️ [Blend API] MIDJOURNEY_WEBHOOK_URL not configured');
    }

    // Prepare Midjourney API request
    const mjRequest: MidjourneyBlendRequest = {
      image_urls: imageUrls,
      ...(weights && { weights }),
      ...(prompt && { prompt }),
      ...(ref && { ref }),
      ...(webhookUrl && { webhook_override: webhookUrl })
    };

    console.log('📤 [Blend API] Sending to Midjourney:', {
      ...mjRequest,
      image_urls: mjRequest.image_urls.map(url => url.substring(0, 50) + '...')
    });

    // Call Midjourney Blend API
    const mjResponse = await fetch('https://api.midjourneyapi.xyz/mj/v2/blend', {
      method: 'POST',
      headers: {
        'X-API-KEY': mjToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mjRequest)
    });

    const mjData: MidjourneyResponse = await mjResponse.json();
    console.log('📥 [Blend API] Midjourney response:', mjData);

    if (!mjResponse.ok) {
      console.error('❌ [Blend API] Midjourney API error:', mjData);
      // Sentry.captureException(new Error(`Midjourney API error: ${mjData.error || mjResponse.statusText}`));
      
      return NextResponse.json(
        { 
          error: mjData.error || 'ブレンド生成に失敗しました',
          details: mjData
        },
        { status: mjResponse.status }
      );
    }

    if (!mjData.success || !mjData.messageId) {
      console.error('❌ [Blend API] Unexpected response format:', mjData);
      return NextResponse.json(
        { error: 'ブレンド生成の開始に失敗しました' },
        { status: 500 }
      );
    }

    // Save job to database
    try {
      const job = await prisma.generationJob.create({
        data: {
          id: mjData.messageId,
          userId: session.user.id,
          params: {
            prompt: prompt || `Blend of ${imageUrls.length} images`,
            action: 'blend',
            designOptions: {},
            sourceImageUrls: imageUrls,
            weights: weights,
            originalPrompt: prompt
          },
          status: 'queued',
          progress: 0
        }
      });

      console.log('✅ [Blend API] Job created:', job.id);
    } catch (dbError) {
      console.error('❌ [Blend API] Database error:', dbError);
      // Sentry.captureException(dbError);
      // Continue anyway - the job was submitted to Midjourney
    }

    // Return success response
    return NextResponse.json({
      success: true,
      jobId: mjData.messageId,
      message: 'ブレンド生成を開始しました'
    });

  } catch (error) {
    console.error('❌ [Blend API] Unexpected error:', error);
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