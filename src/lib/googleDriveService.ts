import { google } from 'googleapis';

export interface DriveImage {
  id: string;
  name: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  mimeType?: string;
  createdTime?: string;
  modifiedTime?: string;
}

export class GoogleDriveService {
  private static instance: GoogleDriveService;
  private drive: any;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): GoogleDriveService {
    if (!GoogleDriveService.instance) {
      GoogleDriveService.instance = new GoogleDriveService();
    }
    return GoogleDriveService.instance;
  }

  async initialize(apiKey: string) {
    if (this.isInitialized) return;

    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      });

      this.drive = google.drive({ version: 'v3', auth });
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Google Drive service:', error);
      throw error;
    }
  }

  async getImagesFromFolder(folderId: string): Promise<DriveImage[]> {
    if (!this.isInitialized) {
      throw new Error('Google Drive service not initialized');
    }

    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and (mimeType contains 'image/')`,
        fields: 'files(id, name, thumbnailLink, webViewLink, webContentLink, mimeType, createdTime, modifiedTime)',
        pageSize: 100,
      });

      return response.data.files || [];
    } catch (error) {
      console.error('Failed to fetch images from Google Drive:', error);
      throw error;
    }
  }

  async getPublicImagesFromFolder(folderId: string, pageToken?: string): Promise<{images: DriveImage[], nextPageToken?: string}> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) {
        throw new Error('Google API key not configured');
      }

      let url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+(mimeType+contains+'image/')&fields=files(id,name,thumbnailLink,webViewLink,webContentLink,mimeType,createdTime,modifiedTime),nextPageToken&pageSize=100&key=${apiKey}`;
      
      if (pageToken) {
        url += `&pageToken=${pageToken}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        images: data.files || [],
        nextPageToken: data.nextPageToken
      };
    } catch (error) {
      console.error('Failed to fetch public images from Google Drive:', error);
      throw error;
    }
  }

  extractFolderIdFromUrl(url: string): string | null {
    const patterns = [
      /\/folders\/([a-zA-Z0-9-_]+)/,
      /id=([a-zA-Z0-9-_]+)/,
      /\/d\/([a-zA-Z0-9-_]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }
}

export const googleDriveService = GoogleDriveService.getInstance();