'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useImageStore } from '@/store/imageStore';
import { ImageService } from '@/lib/imageService';
import { PromptGenerator } from '@/lib/promptGenerator';
import { AIPromptBar } from '@/components/AIPromptBar';
import { ImageFeed } from '@/components/ImageFeed';
import { ControlDrawer } from '@/components/ControlDrawer';
import { ImageModal } from '@/components/ImageModal';
import { GeneratedImage } from '@/lib/types';

export default function HomePage() {
  const { 
    currentDesignOptions, 
    setDesignOptions, 
    isGenerating,
    setGenerating,
    images,
    addImage,
    toggleFavorite,
    favorites
  } = useImageStore();
  
  const [mounted, setMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const hasInitialized = useRef(false);
  
  // Prevent hydration mismatch by waiting for client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Auto-sync images from API on startup
  useEffect(() => {
    if (mounted && !hasInitialized.current) {
      hasInitialized.current = true;
      syncImagesFromAPI();
    }
  }, [mounted]);

  // Real-time polling for pending images
  useEffect(() => {
    if (!mounted) return;

    const pendingImages = images.filter(img => img.status === 'pending' || img.status === 'in-progress');
    
    if (pendingImages.length === 0) return;

    const pollInterval = setInterval(async () => {
      console.log('🔄 Polling for pending images updates...');
      await syncImagesFromAPI();
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [mounted, images]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global ESC to close modal
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
      // Global shortcuts (⌘+K for focus prompt, etc.)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Focus prompt bar if available
        const promptInput = document.querySelector('textarea[placeholder=""]') as HTMLTextAreaElement;
        if (promptInput) {
          promptInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  // Auto-sync function
  const syncImagesFromAPI = async () => {
    console.log('🔄 Auto-syncing images from API...');
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      
      if (data.tests?.authTest?.recentImages) {
        console.log('📊 Found', data.tests.authTest.recentImages.length, 'recent images');
        
        // Add recent images to store (avoid duplicates and update existing)
        data.tests.authTest.recentImages.forEach((img: any) => {
          const existingImage = images.find(existing => existing.id === img.id);
          
          if (existingImage) {
            // Update existing image if status changed
            if (existingImage.status !== img.status && img.status === 'completed' && img.url) {
              console.log('🔄 Updating image status:', img.id, 'to completed');
              addImage({
                ...existingImage,
                status: img.status,
                imageUrl: img.url,
                upscaled_urls: img.upscaled_urls,
                progress: img.progress || 100
              });
            }
          } else if (img.url) {
            // Add new image (completed or in-progress)
            console.log('➕ Adding new image:', img.id, 'status:', img.status);
            addImage({
              id: img.id,
              prompt: img.prompt || 'From API',
              status: img.status,
              imageUrl: img.url,
              upscaled_urls: img.upscaled_urls,
              progress: img.progress,
              timestamp: new Date(),
              designOptions: {
                trend: null,
                colorScheme: null,
                mood: null,
                season: 'spring'
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('❌ Failed to sync images:', error);
    }
  };

  // Handle prompt submission
  const handlePromptSubmit = async (prompt: string) => {
    if (isGenerating) {
      console.warn('⚠️ Already generating, skipping duplicate request');
      return;
    }
    
    setGenerating(true);
    
    try {
      // AIPromptBar already handles prompt enhancement, so we use the prompt as-is
      console.log('🎨 Submitting prompt:', prompt);
      
      // Create image generation request
      const imageId = await ImageService.generateImage({
        prompt: prompt,
        designOptions: currentDesignOptions,
        action: 'generate'
      });

      // Add to store immediately (optimistic update)
      const newImage: GeneratedImage = {
        id: imageId,
        prompt: prompt,
        status: 'pending',
        progress: 0,
        timestamp: new Date(),
        designOptions: currentDesignOptions
      };

      addImage(newImage);
      console.log('✅ Image generation started:', imageId);
      
      // Small delay to prevent rapid successive calls
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('❌ Generation failed:', error);
      alert('Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Get sorted images (most recent first)
  const sortedImages = [...images].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-30 bg-glass-surface backdrop-blur-xl border-b border-surface/30"
      >
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.h1
              className="text-h1 font-bold text-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Open<span className="text-primary-accent">Wardrobe</span>
            </motion.h1>
            
            <motion.div
              className="flex items-center space-x-4 text-caption text-foreground-secondary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>{images.filter(img => img.status === 'completed').length} 完了</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>{images.filter(img => img.status === 'pending' || img.status === 'in-progress').length} 生成中</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>{favorites.length} お気に入り</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24 relative z-10">
        <ImageFeed
          images={sortedImages}
          onImageClick={setSelectedImage}
          onToggleFavorite={toggleFavorite}
          favorites={favorites}
        />
      </main>

      {/* Fixed AI Prompt Bar */}
      <AIPromptBar
        onSubmit={handlePromptSubmit}
        onToggleDrawer={() => setIsDrawerOpen(true)}
        isGenerating={isGenerating}
      />

      {/* Control Drawer */}
      <ControlDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        designOptions={currentDesignOptions}
        onDesignOptionsChange={setDesignOptions}
      />

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            isOpen={!!selectedImage}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}