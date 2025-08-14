import { NextRequest, NextResponse } from 'next/server';
import { googleDriveService } from '@/lib/googleDriveService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const folderUrl = searchParams.get('folderUrl');

    if (!folderUrl) {
      return NextResponse.json({ error: 'folderUrl is required' }, { status: 400 });
    }

    // Test folder ID extraction
    const folderId = googleDriveService.extractFolderIdFromUrl(folderUrl);
    
    // Check if API key is configured
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    
    return NextResponse.json({
      originalUrl: folderUrl,
      extractedFolderId: folderId,
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'Not set'
    });
  } catch (error) {
    console.error('Gallery test API error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}