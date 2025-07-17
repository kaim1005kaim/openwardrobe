'use client';

import { useState, useEffect } from 'react';
import { useImageStore } from '@/store/imageStore';
import { DesignPicker } from '@/components/DesignPicker';
import { GenerateButton } from '@/components/GenerateButton';
import { ImageGallery } from '@/components/ImageGallery';
import { ProgressBar } from '@/components/ProgressBar';

export default function HomePage() {
  const { 
    currentDesignOptions, 
    setDesignOptions, 
    isGenerating,
    getRecentImages,
    images
  } = useImageStore();
  
  const [showGallery, setShowGallery] = useState(false);
  const recentImages = getRecentImages(12);
  
  // Auto-show gallery when there are images
  useEffect(() => {
    if (images.length > 0 && !showGallery) {
      setShowGallery(true);
    }
  }, [images.length, showGallery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Open
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Wardrobe
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI-powered fashion design generator. Create stunning fashion designs with just a few clicks.
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Design Picker */}
          <section className="mb-8">
            <DesignPicker 
              value={currentDesignOptions}
              onChange={setDesignOptions}
            />
          </section>

          {/* Generate Button */}
          <section className="mb-8">
            <GenerateButton 
              designOptions={currentDesignOptions}
              disabled={isGenerating}
            />
          </section>

          {/* Progress Bar */}
          {isGenerating && (
            <section className="mb-8">
              <ProgressBar />
            </section>
          )}

          {/* Quick Actions */}
          <section className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setShowGallery(!showGallery)}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {showGallery ? 'Hide Gallery' : 'Show Gallery'}
            </button>
            
            <button
              onClick={() => {
                // Random design generation
                const randomOptions = {
                  trend: null,
                  colorScheme: null,
                  mood: null,
                  season: 'spring' as const
                };
                setDesignOptions(randomOptions);
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              🎲 Random Design
            </button>
            
            <button
              onClick={async () => {
                // Refresh all processing images
                const processingImages = images.filter(img => img.status === 'processing');
                console.log('🔄 Refreshing', processingImages.length, 'processing images');
                for (const image of processingImages) {
                  try {
                    const response = await fetch(`/api/status/${image.id}`);
                    const data = await response.json();
                    console.log('📊 Status update:', data);
                    useImageStore.getState().updateImageStatus(image.id, data.data);
                  } catch (error) {
                    console.error('Failed to refresh image:', error);
                  }
                }
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Refresh Status
            </button>
          </section>

          {/* Image Gallery */}
          {showGallery && recentImages.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Recent Designs
              </h2>
              <ImageGallery images={recentImages} />
            </section>
          )}

          {/* Quick Stats */}
          <section className="mt-12 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {recentImages.length}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Designs Created
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {useImageStore.getState().getFavoriteImages().length}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Favorites
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {recentImages.filter(img => img.status === 'completed').length}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Completed
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}