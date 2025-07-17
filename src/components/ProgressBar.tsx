'use client';

import { useEffect, useState } from 'react';
import { Loader2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useImageStore } from '@/store/imageStore';
import { ImageService } from '@/lib/imageService';
import { GeneratedImage } from '@/lib/types';

export function ProgressBar() {
  const { images, updateImageStatus } = useImageStore();
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Get currently processing images
  const processingImages = images.filter(img => img.status === 'processing');
  
  useEffect(() => {
    if (processingImages.length > 0) {
      // Start polling for status updates
      const interval = setInterval(async () => {
        for (const image of processingImages) {
          try {
            const status = await ImageService.getImageStatus(image.id);
            updateImageStatus(image.id, status);
          } catch (error) {
            console.error('Failed to get image status:', error);
            updateImageStatus(image.id, {
              id: image.id,
              status: 'failed',
              error: 'Failed to get status'
            });
          }
        }
      }, 3000); // Poll every 3 seconds

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
  }, [processingImages, updateImageStatus]);

  if (processingImages.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Generating Images
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{processingImages.length} in progress</span>
        </div>
      </div>

      <div className="space-y-4">
        {processingImages.map((image) => (
          <ImageProgressItem key={image.id} image={image} />
        ))}
      </div>

      {/* Overall Progress */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Overall Progress</span>
          <span>{processingImages.length} remaining</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (image.status) {
      case 'processing':
        return 'Processing...';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  const getProgress = () => {
    // Use actual progress from API if available
    if (image.progress !== undefined && image.progress !== null) {
      return Math.round(image.progress * 100); // Convert decimal to percentage
    }
    
    // Fallback: estimate based on time elapsed
    const timeSinceStart = Date.now() - new Date(image.timestamp).getTime();
    const estimatedDuration = 60000; // 60 seconds estimate for Midjourney
    return Math.min(90, (timeSinceStart / estimatedDuration) * 100);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Design #{image.id.slice(-6)}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {getStatusText()}
        </span>
      </div>

      {/* Progress Bar */}
      {image.status === 'processing' && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              {image.progress !== undefined && image.progress !== null 
                ? 'Generating with ImagineAPI...' 
                : 'Estimating progress...'}
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