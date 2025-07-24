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

interface ImagineAPIBlendRequest {
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

    // Check ImagineAPI token
    const apiToken = process.env.IMAGINE_API_TOKEN;
    const apiUrl = process.env.IMAGINE_API_URL || 'https://cl.imagineapi.dev';
    const apiModel = process.env.IMAGINE_API_MODEL || 'midjourney';
    
    if (!apiToken || apiToken === 'your_imagine_api_token_here') {
      console.error('❌ [Blend API] IMAGINE_API_TOKEN not configured');
      // Sentry.captureException(new Error('IMAGINE_API_TOKEN not configured'));
      return NextResponse.json(
        { error: 'APIトークンが設定されていません' },
        { status: 500 }
      );
    }

    // Create blend prompt for ImagineAPI
    // ImagineAPIではblendコマンドを直接プロンプトで指定
    const blendPrompt = `/blend ${imageUrls.join(' ')}${prompt ? ` ${prompt}` : ''}`;
    
    // Prepare ImagineAPI request
    const apiRequest: ImagineAPIBlendRequest = {
      prompt: blendPrompt,
      model: apiModel,
      ...(ref && { ref })
    };

    console.log('📤 [Blend API] Sending to ImagineAPI:', {
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
    console.log('📥 [Blend API] ImagineAPI response:', apiData);

    if (!apiResponse.ok) {
      console.error('❌ [Blend API] ImagineAPI error:', apiData);
      // Sentry.captureException(new Error(`ImagineAPI error: ${apiData.error || apiResponse.statusText}`));
      
      return NextResponse.json(
        { 
          error: apiData.error || 'ブレンド生成に失敗しました',
          details: apiData
        },
        { status: apiResponse.status }
      );
    }

    if (!apiData.data?.id) {
      console.error('❌ [Blend API] Unexpected response format:', apiData);
      return NextResponse.json(
        { error: 'ブレンド生成の開始に失敗しました' },
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
      // Continue anyway - the job was submitted to ImagineAPI
    }

    // Return success response
    return NextResponse.json({
      success: true,
      jobId: apiData.data.id,
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