'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useImageStore } from '@/store/imageStore';
import { ImageService } from '@/lib/imageService';
import { PromptGenerator } from '@/lib/promptGenerator';
import { PresetGenerator, PresetDesign } from '@/lib/presetGenerator';
import { TutorialManager } from '@/lib/tutorialSystem';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { AIPromptBar } from '@/components/AIPromptBar';
import { ImageFeed } from '@/components/ImageFeed';
import { ControlDrawer } from '@/components/ControlDrawer';
import { ImageModal } from '@/components/ImageModal';
import { SelectionSummaryBar } from '@/components/SelectionSummaryBar';
import { ProgressCardSkeleton, createLoadingState } from '@/components/ProgressCardSkeleton';
import { useJobStore } from '@/store/jobStore';
import { useNetworkStore } from '@/store/networkStore';
import { GeneratedImage, LoadingPhase } from '@/lib/types';

export default function HomePage() {
  const { 
    currentDesignOptions, 
    setDesignOptions, 
    generationSettings,
    setGenerationSettings,
    isGenerating,
    setGenerating,
    images,
    addImage,
    toggleFavorite,
    favorites
  } = useImageStore();
  
  // Job store for progress tracking
  const { 
    jobs, 
    getPendingJobs, 
    cancelJob,
    createJob,
    updateJobStatus
  } = useJobStore();
  
  // Network store for offline queue and auto-retry
  const { 
    online, 
    pendingQueue, 
    retryQueue, 
    enqueue,
    flush,
    getTotalPendingJobs 
  } = useNetworkStore();
  
  const [mounted, setMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const hasInitialized = useRef(false);
  
  // Prevent hydration mismatch by waiting for client-side mounting
  useEffect(() => {
    setMounted(true);
    
    // Check if tutorial should be shown
    if (!TutorialManager.isTutorialCompleted()) {
      setShowTutorial(true);
    }
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
    
    // Check for existing pending jobs with same prompt
    const existingPendingJob = jobs.find(job => 
      job.params.prompt === prompt && 
      (job.status === 'idle' || job.status === 'submitting' || job.status === 'queued' || job.status === 'generating')
    );

    if (existingPendingJob) {
      console.warn('⚠️ Job with same prompt already in progress:', existingPendingJob.id);
      return;
    }
    
    setGenerating(true);
    
    // Create job in job store (outside try block so it's accessible in catch)
    const jobId = createJob({
      prompt: prompt,
      designOptions: currentDesignOptions,
      action: 'generate'
    });
    
    try {
      // AIPromptBar already handles prompt enhancement, so we use the prompt as-is
      console.log('🎨 Submitting prompt:', prompt);
      
      // Start the generation process
      updateJobStatus(jobId, 'submitting');
      
      // Create image generation request
      const imageId = await ImageService.generateImage({
        prompt: prompt,
        designOptions: currentDesignOptions,
        action: 'generate'
      });
      
      // Update job status to queued
      updateJobStatus(jobId, 'queued');

      // Also add to image store for immediate display (optimistic update)
      const newImage: GeneratedImage = {
        id: jobId,
        prompt: prompt,
        status: 'pending',
        progress: 0,
        timestamp: new Date(),
        designOptions: currentDesignOptions
      };

      addImage(newImage);
      console.log('✅ Image generation started:', jobId);
      
      // Small delay to prevent rapid successive calls
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('❌ Generation failed:', error);
      
      // If offline, add to network queue for retry
      if (!online) {
        const failedJob: import('@/lib/types').GenerationJob = {
          id: jobId,
          createdAt: Date.now(),
          params: {
            prompt: prompt,
            designOptions: currentDesignOptions,
            action: 'generate' as const
          },
          status: 'failed' as const,
          progress: 0,
          isHighlighted: false,
          error: {
            code: 'NETWORK_ERROR',
            message: error instanceof Error ? error.message : 'Unknown error'
          }
        };
        enqueue(failedJob);
        alert('オフラインです。オンラインに戻ったら自動的にリトライされます。');
      } else {
        alert('Generation failed. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  // Handle generation from settings
  const handleGenerateFromSettings = async () => {
    if (isGenerating) {
      console.warn('⚠️ Already generating, skipping duplicate request');
      return;
    }

    let jobId: string | null = null;

    try {
      console.log('🎨 Generating from settings:', currentDesignOptions);
      
      // Generate unified prompt from current design options and generation settings
      const generatedPrompt = await PresetGenerator.generateUnifiedPrompt(
        currentDesignOptions,
        generationSettings,
        '現在の設定に基づいたファッションデザイン'
      );

      // Create job in job store for settings generation
      jobId = createJob({
        prompt: generatedPrompt,
        designOptions: currentDesignOptions,
        action: 'generate'
      });
      
      // Start the generation process
      updateJobStatus(jobId, 'submitting');
      
      // Create image generation request
      const imageId = await ImageService.generateImage({
        prompt: generatedPrompt,
        designOptions: currentDesignOptions,
        action: 'generate'
      });
      
      // Update job status to queued
      updateJobStatus(jobId, 'queued');

      // Also add to image store for immediate display (optimistic update)
      const newImage: GeneratedImage = {
        id: jobId,
        prompt: generatedPrompt,
        status: 'pending',
        progress: 0,
        timestamp: new Date(),
        designOptions: currentDesignOptions
      };

      addImage(newImage);
      console.log('✅ Settings generation started:', jobId);
      
      // Close drawer after generation
      setIsDrawerOpen(false);
      
    } catch (error) {
      console.error('❌ Settings generation failed:', error);
      
      // If offline and job was created, add to network queue for retry
      if (!online && jobId) {
        const failedJob: import('@/lib/types').GenerationJob = {
          id: jobId,
          createdAt: Date.now(),
          params: {
            prompt: 'Failed settings generation',
            designOptions: currentDesignOptions,
            action: 'generate' as const
          },
          status: 'failed' as const,
          progress: 0,
          isHighlighted: false,
          error: {
            code: 'NETWORK_ERROR',
            message: error instanceof Error ? error.message : 'Unknown error'
          }
        };
        enqueue(failedJob);
        alert('オフラインです。オンラインに戻ったら自動的にリトライされます。');
      } else {
        alert('設定からの生成に失敗しました。再度お試しください。');
      }
    }
  };

  // Handle generation from preset
  const handleGenerateFromPreset = async (preset: PresetDesign) => {
    if (isGenerating) {
      console.warn('⚠️ Already generating, skipping duplicate request');
      return;
    }

    let jobId: string | null = null;

    try {
      console.log('🎨 Generating from preset:', preset.name);
      
      // Update design options with preset
      setDesignOptions(preset.options);
      
      // Generate unified prompt from preset with current generation settings
      const generatedPrompt = await PresetGenerator.generateUnifiedPrompt(
        preset.options,
        generationSettings,
        `プリセット「${preset.name}」に基づくファッションデザイン`
      );

      // Create job in job store for preset generation
      jobId = createJob({
        prompt: generatedPrompt,
        designOptions: preset.options,
        action: 'generate'
      });
      
      // Start the generation process
      updateJobStatus(jobId, 'submitting');
      
      // Create image generation request
      const imageId = await ImageService.generateImage({
        prompt: generatedPrompt,
        designOptions: preset.options,
        action: 'generate'
      });
      
      // Update job status to queued
      updateJobStatus(jobId, 'queued');

      // Also add to image store for immediate display (optimistic update)
      const newImage: GeneratedImage = {
        id: jobId,
        prompt: generatedPrompt,
        status: 'pending',
        progress: 0,
        timestamp: new Date(),
        designOptions: preset.options
      };

      addImage(newImage);
      console.log('✅ Preset generation started:', jobId);
      
      // Close drawer after generation
      setIsDrawerOpen(false);
      
    } catch (error) {
      console.error('❌ Preset generation failed:', error);
      
      // If offline and job was created, add to network queue for retry  
      if (!online && jobId) {
        const failedJob: import('@/lib/types').GenerationJob = {
          id: jobId,
          createdAt: Date.now(),
          params: {
            prompt: `Failed preset generation: ${preset.name}`,
            designOptions: preset.options,
            action: 'generate' as const
          },
          status: 'failed' as const,
          progress: 0,
          isHighlighted: false,
          error: {
            code: 'NETWORK_ERROR',
            message: error instanceof Error ? error.message : 'Unknown error'
          }
        };
        enqueue(failedJob);
        alert('オフラインです。オンラインに戻ったら自動的にリトライされます。');
      } else {
        alert('プリセットからの生成に失敗しました。再度お試しください。');
      }
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Tutorial handlers
  const handleTutorialClose = () => {
    setShowTutorial(false);
  };

  const handleTutorialOpenSettings = () => {
    setIsDrawerOpen(true);
  };

  // Development helper to reset tutorial (only in development)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === 'development' && e.ctrlKey && e.shiftKey && e.key === 'T') {
        TutorialManager.resetTutorial();
        setShowTutorial(true);
        console.log('Tutorial reset for development testing');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get sorted images (most recent first)
  const sortedImages = [...images].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Get pending jobs with loading states
  const pendingJobs = getPendingJobs();
  
  // Convert job status to loading phase
  const getLoadingPhaseFromJobStatus = (status: string): LoadingPhase => {
    switch (status) {
      case 'idle':
      case 'submitting': return 'uploading';
      case 'queued': return 'queued';
      case 'generating': return 'generating';
      default: return 'rendering';
    }
  };
  
  // Handle job cancellation
  const handleCancelJob = (jobId: string) => {
    cancelJob(jobId);
  };

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
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>{online ? 'オンライン' : 'オフライン'}</span>
                {getTotalPendingJobs() > 0 && (
                  <span className="text-yellow-400">({getTotalPendingJobs()} 待機中)</span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Selection Summary Bar */}
      <SelectionSummaryBar
        designOptions={currentDesignOptions}
        onClearAll={() => setDesignOptions({
          trend: null,
          colorScheme: null, 
          mood: null,
          season: null
        })}
        onRemoveTag={(kind) => {
          const updates: any = {};
          if (kind === 'style') updates.trend = null;
          if (kind === 'color') updates.colorScheme = null;
          if (kind === 'mood') updates.mood = null;
          setDesignOptions({ ...currentDesignOptions, ...updates });
        }}
        onGenerate={handleGenerateFromSettings}
        isGenerating={isGenerating}
      />

      {/* Main Content */}
      <main className="pt-36 relative z-10" data-tutorial="image-feed">
        {/* Progress Cards for Active Jobs */}
        {pendingJobs.length > 0 && (
          <div className="px-8 pb-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-sm font-medium text-foreground-secondary">
                生成中 ({pendingJobs.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                  {pendingJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProgressCardSkeleton
                        loadingState={createLoadingState(
                          getLoadingPhaseFromJobStatus(job.status),
                          job.progress
                        )}
                        jobId={job.id}
                        prompt={job.params.prompt}
                        onCancel={() => handleCancelJob(job.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
        
        <ImageFeed
          images={sortedImages}
          onImageClick={setSelectedImage}
          onToggleFavorite={toggleFavorite}
          favorites={favorites}
        />
      </main>

      {/* Fixed AI Prompt Bar */}
      <div data-tutorial="prompt-bar">
        <AIPromptBar
          onSubmit={handlePromptSubmit}
          onToggleDrawer={() => setIsDrawerOpen(true)}
          isGenerating={isGenerating}
        />
      </div>

      {/* Control Drawer */}
      <ControlDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        designOptions={currentDesignOptions}
        onDesignOptionsChange={setDesignOptions}
        generationSettings={generationSettings}
        onGenerationSettingsChange={setGenerationSettings}
        onGenerateFromSettings={handleGenerateFromSettings}
        onGenerateFromPreset={handleGenerateFromPreset}
        isGenerating={isGenerating}
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

      {/* Tutorial Overlay */}
      <TutorialOverlay
        isVisible={showTutorial}
        onClose={handleTutorialClose}
        onOpenSettings={handleTutorialOpenSettings}
      />
    </div>
  );
}