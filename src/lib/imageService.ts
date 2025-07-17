import ky from 'ky';
import { ImageGenerationRequest, ImageStatus, GeneratedImage } from './types';

const API_URL = process.env.IMAGINE_API_URL || 'https://cl.imagineapi.dev';
const API_TOKEN = process.env.IMAGINE_API_TOKEN || '__DUMMY_IMAGINE_TOKEN__';

const api = ky.create({
  prefixUrl: API_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  timeout: 30000,
  retry: 2
});

export class ImageService {
  /**
   * Generate a new image based on prompt
   */
  static async generateImage(request: ImageGenerationRequest): Promise<string> {
    try {
      // Mock implementation for development
      if (API_TOKEN === '__DUMMY_IMAGINE_TOKEN__') {
        return ImageService.mockGenerateImage(request);
      }

      const response = await api.post('items/images', {
        json: {
          prompt: request.prompt,
          ref: request.ref,
          model: process.env.IMAGINE_API_MODEL || 'MJ'
        }
      }).json<{ data: { id: string } }>();

      return response.data.id;
    } catch (error) {
      console.error('Image generation failed:', error);
      throw new Error('Failed to generate image');
    }
  }

  /**
   * Get image status and result
   */
  static async getImageStatus(id: string): Promise<ImageStatus> {
    try {
      // Mock implementation for development
      if (API_TOKEN === '__DUMMY_IMAGINE_TOKEN__') {
        return ImageService.mockGetImageStatus(id);
      }

      const response = await api.get(`items/images/${id}`).json<{ data: ImageStatus }>();
      return response.data;
    } catch (error) {
      console.error('Failed to get image status:', error);
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
        designOptions: {} as any // Will be filled from original
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
        designOptions: {} as any // Will be filled from original
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
        designOptions: {} as any // Will be filled from original
      });
    } catch (error) {
      console.error('Image blending failed:', error);
      throw new Error('Failed to blend images');
    }
  }

  // Mock implementations for development
  private static async mockGenerateImage(request: ImageGenerationRequest): Promise<string> {
    console.log('🎨 Mock: Generating image with prompt:', request.prompt);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store mock data for status checking
    ImageService.mockData.set(mockId, {
      id: mockId,
      status: 'processing',
      progress: 0,
      prompt: request.prompt,
      designOptions: request.designOptions
    });

    // Simulate processing
    ImageService.simulateProcessing(mockId);
    
    return mockId;
  }

  private static async mockGetImageStatus(id: string): Promise<ImageStatus> {
    const mockData = ImageService.mockData.get(id);
    
    if (!mockData) {
      throw new Error('Image not found');
    }

    return {
      id: mockData.id,
      status: mockData.status,
      progress: mockData.progress,
      url: mockData.url,
      thumbnail: mockData.thumbnail,
      error: mockData.error
    };
  }

  private static mockData = new Map<string, any>();

  private static simulateProcessing(id: string) {
    const mockData = ImageService.mockData.get(id);
    if (!mockData) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      
      if (progress >= 100) {
        clearInterval(interval);
        mockData.status = 'completed';
        mockData.progress = 100;
        mockData.url = `https://picsum.photos/1024/1024?random=${Date.now()}`;
        mockData.thumbnail = `https://picsum.photos/512/512?random=${Date.now()}`;
      } else {
        mockData.progress = progress;
      }
      
      ImageService.mockData.set(id, mockData);
    }, 2000);
  }
}