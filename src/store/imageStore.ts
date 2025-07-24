import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GeneratedImage, DesignOptions, ImageStatus, GenerationSettings } from '@/lib/types';
import { useImageHistory } from '@/hooks/useImageHistory';

interface ImageStore {
  // State
  images: GeneratedImage[];
  currentDesignOptions: DesignOptions;
  generationSettings: GenerationSettings;
  isGenerating: boolean;
  favorites: string[];
  
  // Actions
  setDesignOptions: (options: DesignOptions) => void;
  setGenerationSettings: (settings: GenerationSettings) => void;
  addImage: (image: GeneratedImage) => void;
  updateImageStatus: (id: string, status: ImageStatus) => void;
  setGenerating: (isGenerating: boolean) => void;
  toggleFavorite: (id: string) => Promise<void>;
  clearImages: () => void;
  removeImage: (id: string) => void;
  
  // Getters
  getImageById: (id: string) => GeneratedImage | undefined;
  getFavoriteImages: () => GeneratedImage[];
  getRecentImages: (count?: number) => GeneratedImage[];
}

export const useImageStore = create<ImageStore>()(
  persist(
    (set, get) => ({
      // Initial state
      images: [],
      currentDesignOptions: {
        trend: null,
        colorScheme: null,
        mood: null,
        season: null
      },
      generationSettings: {
        batchSize: 4,
        aspectRatio: '1:1',
        quality: 'high',
        stylize: 100
      },
      isGenerating: false,
      favorites: [],
      
      // Actions
      setDesignOptions: (options) => set({ currentDesignOptions: options }),
      setGenerationSettings: (settings) => set({ generationSettings: settings }),
      
      addImage: (image) => set((state) => {
        // Check if image already exists to prevent duplicates
        const existingImage = state.images.find(img => img.id === image.id);
        if (existingImage) {
          // Update existing image instead of adding duplicate
          return {
            images: state.images.map(img => 
              img.id === image.id ? { ...img, ...image } : img
            )
          };
        }

        // Check for similar pending images with same prompt to prevent duplicates
        const similarPendingImage = state.images.find(img => 
          img.prompt === image.prompt && 
          (img.status === 'pending' || img.status === 'in-progress') &&
          img.id !== image.id
        );

        if (similarPendingImage && image.status === 'pending') {
          console.log(`Preventing duplicate pending image. Similar image exists: ${similarPendingImage.id}`);
          return state; // Don't add duplicate pending image
        }
        
        // Save to persistent storage if user is authenticated
        if (typeof window !== 'undefined') {
          // Note: This is a bit of a hack - ideally we'd have access to auth state here
          // In a real implementation, we might dispatch this through a different mechanism
          fetch('/api/images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: image.prompt,
              designOptions: image.designOptions,
              status: image.status,
              progress: image.progress || 0,
              imageUrl: image.imageUrl,
              upscaledUrls: image.upscaled_urls || [],
              tags: [] // Could extract tags from designOptions
            })
          }).catch(console.error); // Silent fail for anonymous users
        }
        
        // Add new image
        return {
          images: [image, ...state.images].slice(0, 100) // Keep only last 100 images
        };
      }),
      
      updateImageStatus: (id, status) => set((state) => ({
        images: state.images.map(image => 
          image.id === id 
            ? { 
                ...image, 
                status: status.status,
                progress: status.progress,
                imageUrl: status.url || image.imageUrl,
                upscaled_urls: status.upscaled_urls || image.upscaled_urls
              }
            : image
        )
      })),
      
      setGenerating: (isGenerating) => set({ isGenerating }),
      
      toggleFavorite: async (id) => {
        const state = get();
        const isFavorited = state.favorites.includes(id);
        
        try {
          if (isFavorited) {
            // Remove from favorites
            const response = await fetch(`/api/favorites/${id}`, {
              method: 'DELETE'
            });
            if (response.ok) {
              set((state) => ({
                favorites: state.favorites.filter(fav => fav !== id)
              }));
            }
          } else {
            // Add to favorites
            const response = await fetch('/api/favorites', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageId: id })
            });
            if (response.ok) {
              set((state) => ({
                favorites: [...state.favorites, id]
              }));
            }
          }
        } catch (error) {
          console.error('Failed to toggle favorite:', error);
        }
      },
      
      clearImages: () => set({ images: [] }),
      
      removeImage: (id) => set((state) => ({
        images: state.images.filter(image => image.id !== id),
        favorites: state.favorites.filter(fav => fav !== id)
      })),
      
      // Getters
      getImageById: (id) => get().images.find(image => image.id === id),
      
      getFavoriteImages: () => {
        const { images, favorites } = get();
        return images.filter(image => favorites.includes(image.id));
      },
      
      getRecentImages: (count = 20) => {
        const { images } = get();
        return images.slice(0, count);
      }
    }),
    {
      name: 'openwardrobe-store',
      // Only persist non-sensitive data
      partialize: (state) => ({
        images: state.images.map(img => ({
          ...img,
          // Don't persist processing states
          status: (img.status === 'pending' || img.status === 'in-progress') ? 'failed' : img.status
        })),
        favorites: state.favorites,
        currentDesignOptions: state.currentDesignOptions
      })
    }
  )
);