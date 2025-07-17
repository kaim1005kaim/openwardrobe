'use client';

import { useState } from 'react';
import { Heart, Download, Share2, Palette, Sparkles, RotateCcw, Trash2, ExternalLink } from 'lucide-react';
import { GeneratedImage } from '@/lib/types';
import { useImageStore } from '@/store/imageStore';
import { ImageService } from '@/lib/imageService';
import { PromptGenerator } from '@/lib/promptGenerator';

interface ImageGalleryProps {
  images: GeneratedImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const { toggleFavorite, favorites, removeImage } = useImageStore();
  
  // Handler for creating image variations
  const onVariation = (image: GeneratedImage, type: 'color' | 'pattern' | 'mood' | 'upscale') => {
    // This handler is defined at ImageCard level
    console.log('Variation requested for image:', image.id, 'type:', type);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No designs yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Create your first fashion design to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          isFavorite={favorites.includes(image.id)}
          onToggleFavorite={() => toggleFavorite(image.id)}
          onRemove={() => removeImage(image.id)}
          onVariation={(type) => onVariation(image, type)}
        />
      ))}
    </div>
  );
}

interface ImageCardProps {
  image: GeneratedImage;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRemove: () => void;
  onVariation: (type: 'color' | 'pattern' | 'mood' | 'upscale') => void;
}

function ImageCard({ image, isFavorite, onToggleFavorite, onRemove, onVariation }: ImageCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = () => {
    switch (image.status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'in-progress':
        return 'text-blue-600 dark:text-blue-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      case 'pending':
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (image.status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'Processing...';
      case 'failed':
        return 'Failed';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  const handleVariation = async (type: 'color' | 'pattern' | 'mood' | 'upscale') => {
    setIsLoading(true);
    try {
      let newPrompt = image.prompt;
      
      // Modify prompt based on variation type
      switch (type) {
        case 'color':
          const colorSchemes = ['monochrome', 'pastel', 'vivid', 'earth-tone', 'jewel-tone', 'neon', 'muted'];
          const randomColor = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
          newPrompt = PromptGenerator.modifyPromptForColorChange(image.prompt, randomColor);
          break;
        case 'pattern':
          newPrompt = `${image.prompt}, different pattern, alternative texture`;
          break;
        case 'mood':
          const moods = ['casual', 'formal', 'edgy', 'romantic', 'professional', 'playful', 'sophisticated'];
          const randomMood = moods[Math.floor(Math.random() * moods.length)];
          newPrompt = PromptGenerator.modifyPromptForMoodChange(image.prompt, randomMood);
          break;
        case 'upscale':
          // For upscaling, we use the original image as reference
          const upscaleId = await ImageService.upscaleImage(image.id, 1);
          const upscaleImage = {
            id: upscaleId,
            prompt: image.prompt + ' (upscaled)',
            status: 'pending' as const,
            timestamp: new Date(),
            designOptions: image.designOptions
          };
          useImageStore.getState().addImage(upscaleImage);
          setIsLoading(false);
          return;
      }

      // Generate new image with modified prompt
      const newImageId = await ImageService.generateImage({
        prompt: newPrompt,
        designOptions: image.designOptions,
        action: 'variation',
        ref: image.id
      });

      const newImage = {
        id: newImageId,
        prompt: newPrompt,
        status: 'pending' as const,
        timestamp: new Date(),
        designOptions: image.designOptions
      };

      useImageStore.getState().addImage(newImage);
      
    } catch (error) {
      console.error('Variation failed:', error);
      alert('Failed to create variation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (image.imageUrl) {
      const link = document.createElement('a');
      link.href = image.imageUrl;
      link.download = `fashion-design-${image.id}.jpg`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share && image.imageUrl) {
      try {
        await navigator.share({
          title: 'Fashion Design',
          text: 'Check out this AI-generated fashion design!',
          url: image.imageUrl
        });
      } catch (error) {
        console.error('Sharing failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      if (image.imageUrl) {
        navigator.clipboard.writeText(image.imageUrl);
        alert('Image URL copied to clipboard!');
      }
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
        {image.status === 'completed' && image.imageUrl ? (
          <img
            src={image.imageUrl}
            alt="Generated fashion design"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {image.status === 'pending' || image.status === 'in-progress' ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Generating...</p>
              </div>
            ) : image.status === 'failed' ? (
              <div className="text-center">
                <div className="text-4xl mb-2">❌</div>
                <p className="text-red-600 dark:text-red-400">Failed</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-2">⏳</div>
                <p className="text-gray-600 dark:text-gray-400">Pending</p>
              </div>
            )}
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-800 ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {/* Action Buttons Overlay */}
        {showActions && image.status === 'completed' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="flex space-x-2">
              <button
                onClick={handleDownload}
                className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Share"
              >
                <Share2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={() => image.imageUrl && window.open(image.imageUrl, '_blank')}
                className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="View Full Size"
              >
                <ExternalLink className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          className={`absolute top-2 left-2 p-2 rounded-full transition-colors ${
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Design Options */}
        <div className="flex flex-wrap gap-1 mb-3">
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

        {/* Variation Buttons */}
        {image.status === 'completed' && (
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => onVariation('color')}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs hover:from-pink-600 hover:to-purple-600 disabled:opacity-50"
            >
              <Palette className="w-3 h-3" />
              <span>Color</span>
            </button>
            <button
              onClick={() => onVariation('pattern')}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-xs hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" />
              <span>Pattern</span>
            </button>
            <button
              onClick={() => onVariation('mood')}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full text-xs hover:from-green-600 hover:to-teal-600 disabled:opacity-50"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Mood</span>
            </button>
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{new Date(image.timestamp).toLocaleString()}</span>
          <button
            onClick={onRemove}
            className="p-1 hover:text-red-500 transition-colors"
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}