import { NextRequest, NextResponse } from 'next/server';
import { googleDriveService } from '@/lib/googleDriveService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const folderUrl = searchParams.get('folderUrl');
    const folderId = searchParams.get('folderId');

    if (!folderUrl && !folderId) {
      return NextResponse.json(
        { error: 'Either folderUrl or folderId is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'Google API key not configured. Please add NEXT_PUBLIC_GOOGLE_API_KEY to your environment variables.',
          details: 'To use the gallery feature, you need to:\n1. Go to Google Cloud Console\n2. Enable Google Drive API\n3. Create an API key\n4. Add it to your .env.local file as NEXT_PUBLIC_GOOGLE_API_KEY'
        },
        { status: 503 }
      );
    }

    let actualFolderId = folderId;
    
    if (folderUrl && !folderId) {
      actualFolderId = googleDriveService.extractFolderIdFromUrl(folderUrl);
      if (!actualFolderId) {
        return NextResponse.json(
          { error: 'Invalid Google Drive folder URL. Please check the URL format.' },
          { status: 400 }
        );
      }
    }

    const pageToken = searchParams.get('pageToken');
    
    console.log('Fetching images from folder ID:', actualFolderId, 'pageToken:', pageToken);
    const result = await googleDriveService.getPublicImagesFromFolder(actualFolderId!, pageToken || undefined);
    
    return NextResponse.json({
      images: result.images,
      nextPageToken: result.nextPageToken,
      hasMore: !!result.nextPageToken
    });
  } catch (error) {
    console.error('Gallery API error:', error);
    
    let errorMessage = 'Failed to fetch gallery images';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Google API key is invalid or expired';
        statusCode = 401;
      } else if (error.message.includes('quota')) {
        errorMessage = 'Google API quota exceeded. Please try again later.';
        statusCode = 429;
      } else if (error.message.includes('permission') || error.message.includes('forbidden')) {
        errorMessage = 'Folder is not publicly accessible or API key lacks permissions';
        statusCode = 403;
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: statusCode }
    );
  }
}