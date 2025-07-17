'use client';

import { useEffect, useState } from 'react';
import { Loader2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useImageStore } from '@/store/imageStore';
import { ImageService } from '@/lib/imageService';
import { GeneratedImage } from '@/lib/types';

export function ProgressBar() {
  const { images, updateImageStatus } = useImageStore();
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  // Get currently processing images (updated for ImagineAPI status)
  const processingImages = images.filter(img => 
    img.status === 'pending' || img.status === 'in-progress'
  );

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (mounted && processingImages.length > 0) {
      // Start polling for status updates with adaptive interval
      const pollImages = async () => {
        console.log('🔄 Polling status for', processingImages.length, 'images');
        
        // Use Promise.allSettled to handle all requests concurrently
        const statusPromises = processingImages.map(async (image) => {
          try {
            console.log('📊 Checking status for image:', image.id);
            const status = await ImageService.getImageStatus(image.id);
            console.log('📊 Status received for', image.id, ':', {
              status: status.status,
              progress: status.progress,
              url: status.url,
              upscaled_urls: status.upscaled_urls
            });
            updateImageStatus(image.id, status);
            return { success: true, id: image.id };
          } catch (error) {
            console.error('❌ Failed to get image status for', image.id, ':', error);
            updateImageStatus(image.id, {
              id: image.id,
              status: 'failed',
              error: 'Failed to get status'
            });
            return { success: false, id: image.id };
          }
        });

        await Promise.allSettled(statusPromises);
      };

      // Initial poll
      pollImages();

      // Set up interval with adaptive timing
      const interval = setInterval(pollImages, 2000); // Poll every 2 seconds for faster updates
      setPollingInterval(interval);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    } else {
      // Clear interval if no processing images
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    }
  }, [mounted, processingImages.length, updateImageStatus]); // Remove processingImages from deps to avoid constant re-renders

  if (!mounted || processingImages.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          画像生成中
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{processingImages.length}件処理中</span>
        </div>
      </div>

      <div className="space-y-4">
        {processingImages.map((image) => (
          <ImageProgressItem key={image.id} image={image} />
        ))}
      </div>

      {/* Overall Progress */}
      <div className="mt-6 pt-4 border-t border-gray-600">
        <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
          <span>全体の進捗</span>
          <span>残り{processingImages.length}件</span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.max(20, (images.length - processingImages.length) / Math.max(images.length, 1) * 100)}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ImageProgressItem({ image }: { image: GeneratedImage }) {
  const getStatusIcon = () => {
    switch (image.status) {
      case 'in-progress':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (image.status) {
      case 'in-progress':
        return '処理中...';
      case 'completed':
        return '完了';
      case 'failed':
        return '失敗';
      case 'pending':
      default:
        return '待機中';
    }
  };

  const getProgress = () => {
    // Use actual progress from API if available (ImagineAPI returns 0-100)
    if (image.progress !== undefined && image.progress !== null) {
      return Math.round(image.progress); // Progress is already 0-100
    }
    
    // Fallback: estimate based on time elapsed
    const timeSinceStart = Date.now() - new Date(image.timestamp).getTime();
    const estimatedDuration = 60000; // 60 seconds estimate for Midjourney
    return Math.min(90, (timeSinceStart / estimatedDuration) * 100);
  };

  return (
    <div className="bg-gray-600 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-white">
            デザイン #{image.id.slice(-6)}
          </span>
        </div>
        <span className="text-xs text-gray-300">
          {getStatusText()}
        </span>
      </div>

      {/* Progress Bar */}
      {(image.status === 'pending' || image.status === 'in-progress') && (
        <div className="space-y-2">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-300">
            <span>
              {image.progress !== undefined && image.progress !== null 
                ? 'ImagineAPIで生成中...' 
                : '進捗を推定中...'}
            </span>
            <span>{Math.round(getProgress())}%</span>
          </div>
        </div>
      )}

      {/* Design Options Preview */}
      <div className="mt-2 flex flex-wrap gap-1">
        {image.designOptions.trend && (
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
            {image.designOptions.trend}
          </span>
        )}
        {image.designOptions.colorScheme && (
          <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded text-xs">
            {image.designOptions.colorScheme}
          </span>
        )}
        {image.designOptions.mood && (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
            {image.designOptions.mood}
          </span>
        )}
      </div>
    </div>
  );
}