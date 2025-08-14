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

    let actualFolderId = folderId;
    
    if (folderUrl && !folderId) {
      actualFolderId = googleDriveService.extractFolderIdFromUrl(folderUrl);
      if (!actualFolderId) {
        return NextResponse.json(
          { error: 'Invalid Google Drive folder URL' },
          { status: 400 }
        );
      }
    }

    const images = await googleDriveService.getPublicImagesFromFolder(actualFolderId!);
    
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Gallery API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}