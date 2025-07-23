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

interface MidjourneyVaryRequest {
  image_url: string;
  variation: 'subtle' | 'strong';
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

    // Check Midjourney API token
    const mjToken = process.env.MIDJOURNEY_API_TOKEN;
    if (!mjToken) {
      console.error('❌ [Vary API] MIDJOURNEY_API_TOKEN not configured');
      // Sentry.captureException(new Error('MIDJOURNEY_API_TOKEN not configured'));
      return NextResponse.json(
        { error: 'APIトークンが設定されていません' },
        { status: 500 }
      );
    }

    // Get webhook URL
    const webhookUrl = process.env.MIDJOURNEY_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn('⚠️ [Vary API] MIDJOURNEY_WEBHOOK_URL not configured');
    }

    // Prepare Midjourney API request
    const mjRequest: MidjourneyVaryRequest = {
      image_url: imageUrl,
      variation: variationType,
      ...(prompt && { prompt }),
      ...(ref && { ref }),
      ...(webhookUrl && { webhook_override: webhookUrl })
    };

    console.log('📤 [Vary API] Sending to Midjourney:', {
      ...mjRequest,
      image_url: mjRequest.image_url.substring(0, 50) + '...'
    });

    // Call Midjourney Vary API
    const mjResponse = await fetch('https://api.midjourneyapi.xyz/mj/v2/vary', {
      method: 'POST',
      headers: {
        'X-API-KEY': mjToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mjRequest)
    });

    const mjData: MidjourneyResponse = await mjResponse.json();
    console.log('📥 [Vary API] Midjourney response:', mjData);

    if (!mjResponse.ok) {
      console.error('❌ [Vary API] Midjourney API error:', mjData);
      // Sentry.captureException(new Error(`Midjourney API error: ${mjData.error || mjResponse.statusText}`));
      
      return NextResponse.json(
        { 
          error: mjData.error || 'バリエーション生成に失敗しました',
          details: mjData
        },
        { status: mjResponse.status }
      );
    }

    if (!mjData.success || !mjData.messageId) {
      console.error('❌ [Vary API] Unexpected response format:', mjData);
      return NextResponse.json(
        { error: 'バリエーション生成の開始に失敗しました' },
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
      // Continue anyway - the job was submitted to Midjourney
    }

    // Return success response
    return NextResponse.json({
      success: true,
      jobId: mjData.messageId,
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