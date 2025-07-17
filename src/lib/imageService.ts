import { ImageGenerationRequest, ImageStatus } from './types';

export class ImageService {
  /**
   * Generate a new image based on prompt
   */
  static async generateImage(request: ImageGenerationRequest): Promise<string> {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          ref: request.ref
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Generate API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`API Error ${response.status}: ${errorData.details || errorData.error || 'Failed to generate image'}`);
      }

      const data = await response.json();
      console.log('✅ Image generation started:', data);
      return data.data.id;
    } catch (error) {
      console.error('❌ Image generation failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate image');
    }
  }

  /**
   * Get image status and result
   */
  static async getImageStatus(id: string): Promise<ImageStatus> {
    try {
      const response = await fetch(`/api/status/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Status API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Status API Error ${response.status}: ${errorData.details || errorData.error || 'Failed to get image status'}`);
      }

      const data = await response.json();
      console.log('✅ Status check result:', data);
      return data.data;
    } catch (error) {
      console.error('❌ Status check failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to get image status');
    }
  }

  /**
   * Upscale image
   */
  static async upscaleImage(id: string, index: 1 | 2 | 3 | 4): Promise<string> {
    try {
      const upscalePrompt = `U${index} :: ${id}`;
      return await ImageService.generateImage({
        prompt: upscalePrompt,
        ref: id,
        action: 'upscale',
        index,
        designOptions: { trend: null, colorScheme: null, mood: null, season: 'spring' }
      });
    } catch (error) {
      console.error('Upscaling failed:', error);
      throw new Error('Failed to upscale image');
    }
  }

  /**
   * Create variation of image
   */
  static async createVariation(id: string, index: 1 | 2 | 3 | 4): Promise<string> {
    try {
      const variationPrompt = `V${index} :: ${id}`;
      return await ImageService.generateImage({
        prompt: variationPrompt,
        ref: id,
        action: 'variation',
        index,
        designOptions: { trend: null, colorScheme: null, mood: null, season: 'spring' }
      });
    } catch (error) {
      console.error('Variation creation failed:', error);
      throw new Error('Failed to create variation');
    }
  }

  /**
   * Blend two images
   */
  static async blendImages(id1: string, id2: string, ratio: number = 0.5): Promise<string> {
    try {
      const blendPrompt = `blend ${id1} ${id2} --ratio ${ratio}`;
      return await ImageService.generateImage({
        prompt: blendPrompt,
        ref: id1,
        action: 'blend',
        designOptions: { trend: null, colorScheme: null, mood: null, season: 'spring' }
      });
    } catch (error) {
      console.error('Image blending failed:', error);
      throw new Error('Failed to blend images');
    }
  }
}