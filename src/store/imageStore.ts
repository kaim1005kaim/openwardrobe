import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GeneratedImage, DesignOptions, ImageStatus } from '@/lib/types';

interface ImageStore {
  // State
  images: GeneratedImage[];
  currentDesignOptions: DesignOptions;
  isGenerating: boolean;
  favorites: string[];
  
  // Actions
  setDesignOptions: (options: DesignOptions) => void;
  addImage: (image: GeneratedImage) => void;
  updateImageStatus: (id: string, status: ImageStatus) => void;
  setGenerating: (isGenerating: boolean) => void;
  toggleFavorite: (id: string) => void;
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
        season: 'spring'
      },
      isGenerating: false,
      favorites: [],
      
      // Actions
      setDesignOptions: (options) => set({ currentDesignOptions: options }),
      
      addImage: (image) => set((state) => ({
        images: [image, ...state.images].slice(0, 100) // Keep only last 100 images
      })),
      
      updateImageStatus: (id, status) => set((state) => ({
        images: state.images.map(image => 
          image.id === id 
            ? { 
                ...image, 
                status: status.status,
                progress: status.progress,
                imageUrl: status.url || image.imageUrl,
                thumbnailUrl: status.thumbnail || image.thumbnailUrl
              }
            : image
        )
      })),
      
      setGenerating: (isGenerating) => set({ isGenerating }),
      
      toggleFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter(fav => fav !== id)
          : [...state.favorites, id]
      })),
      
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
          status: img.status === 'processing' ? 'failed' : img.status
        })),
        favorites: state.favorites,
        currentDesignOptions: state.currentDesignOptions
      })
    }
  )
);