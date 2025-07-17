import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    console.log('🔔 Webhook received:', payload);
    
    // Validate webhook payload
    if (!payload.data || !payload.data.id) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { id, status, url, progress, error } = payload.data;
    
    // Revalidate cache for this specific image
    revalidateTag(`image-${id}`);
    
    // In a real implementation, you would:
    // 1. Update database with new status
    // 2. Send Server-Sent Events to connected clients
    // 3. Handle different webhook events (processing, completed, failed)
    
    // For now, we'll just log the event
    console.log(`📸 Image ${id} status updated:`, {
      status,
      url,
      progress,
      error
    });
    
    // Mock response for development
    return NextResponse.json({
      success: true,
      message: `Webhook processed for image ${id}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const challenge = searchParams.get('hub.challenge');
  
  // This is typically used for webhook verification
  if (challenge) {
    return new Response(challenge, { status: 200 });
  }
  
  return NextResponse.json({
    message: 'Webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}

// Handle other methods
export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}