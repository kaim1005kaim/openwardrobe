'use client';

import { useState } from 'react';
import { Heart, Download, Share2, Palette, Sparkles, RotateCcw, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedImage } from '@/lib/types';
import { useImageStore } from '@/store/imageStore';
import { useJobStore } from '@/store/jobStore';
import { ImageService } from '@/lib/imageService';
import { PromptGenerator } from '@/lib/promptGenerator';
import { ImageGrid } from '@/components/ImageGrid';
import { ImageModal } from '@/components/ImageModal';
import { extractQuadrantFromImage, downloadImageFromBlob } from '@/lib/imageUtils';

interface ImageGalleryProps {
  images: GeneratedImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const { toggleFavorite, favorites, removeImage } = useImageStore();
  const { getJobById, highlightJob } = useJobStore();
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  
  // Handler for creating image variations
  const onVariation = (image: GeneratedImage, type: 'color' | 'pattern' | 'mood' | 'upscale') => {
    // This handler is defined at ImageCard level
    console.log('Variation requested for image:', image.id, 'type:', type);
  };

  // Check if an image should be highlighted
  const isImageHighlighted = (imageId: string): boolean => {
    const job = getJobById(imageId);
    return job?.isHighlighted || false;
  };

  // Handle dismissing highlight
  const handleDismissHighlight = (imageId: string) => {
    highlightJob(imageId, false);
  };

  const handleImageClick = (image: GeneratedImage) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          まだデザインがありません
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          最初のファッションデザインを作成してみましょう！
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <AnimatePresence>
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              isFavorite={favorites.includes(image.id)}
              isHighlighted={isImageHighlighted(image.id)}
              onToggleFavorite={() => toggleFavorite(image.id)}
              onRemove={() => removeImage(image.id)}
              onVariation={(type) => onVariation(image, type)}
              onClick={() => handleImageClick(image)}
              onDismissHighlight={() => handleDismissHighlight(image.id)}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          isOpen={!!selectedImage}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

interface ImageCardProps {
  image: GeneratedImage;
  isFavorite: boolean;
  isHighlighted: boolean;
  onToggleFavorite: () => void;
  onRemove: () => void;
  onVariation: (type: 'color' | 'pattern' | 'mood' | 'upscale') => void;
  onClick: () => void;
  onDismissHighlight: () => void;
}

function ImageCard({ 
  image, 
  isFavorite, 
  isHighlighted, 
  onToggleFavorite, 
  onRemove, 
  onVariation, 
  onClick, 
  onDismissHighlight 
}: ImageCardProps) {
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
        return '完了';
      case 'in-progress':
        return '処理中...';
      case 'failed':
        return '失敗';
      case 'pending':
      default:
        return '待機中';
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
        action: 'variation' as const,
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

  const handleDownload = (quadrant?: number) => {
    if (image.imageUrl) {
      const link = document.createElement('a');
      link.href = image.imageUrl;
      const suffix = quadrant ? `-${quadrant}` : '';
      link.download = `fashion-design-${image.id}${suffix}.jpg`;
      link.click();
    }
  };

  const handleQuadrantDownload = async (quadrant: number) => {
    if (!image.imageUrl) return;
    
    try {
      console.log(`🖼️ Extracting quadrant ${quadrant} from image:`, image.id);
      
      // 4枚組画像から指定された象限を抽出
      const blobUrl = await extractQuadrantFromImage(image.imageUrl, quadrant);
      
      // ダウンロード
      const filename = `fashion-design-${image.id}-${quadrant}.jpg`;
      downloadImageFromBlob(blobUrl, filename);
      
      console.log(`✅ Downloaded quadrant ${quadrant} as ${filename}`);
    } catch (error) {
      console.error('❌ Failed to extract quadrant:', error);
      // フォールバック: 元画像をダウンロード
      handleDownload(quadrant);
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

  const handleMidjourneyAction = async (action: 'subtle' | 'strong' | 'animate') => {
    setIsLoading(true);
    try {
      console.log(`🎨 Midjourney ${action} action for image:`, image.id);
      
      // Create enhanced prompt based on action
      let enhancedPrompt = image.prompt;
      
      switch (action) {
        case 'subtle':
          enhancedPrompt = `${image.prompt} --stylize 50 --quality 0.5`;
          break;
        case 'strong':
          enhancedPrompt = `${image.prompt} --stylize 1000 --quality 2`;
          break;
        case 'animate':
          enhancedPrompt = `${image.prompt} --video --motion 4`;
          break;
      }
      
      // Generate new image with enhanced prompt
      const newImageId = await ImageService.generateImage({
        prompt: enhancedPrompt,
        designOptions: image.designOptions,
        action: action as 'subtle' | 'strong' | 'animate',
        ref: image.id
      });

      const newImage = {
        id: newImageId,
        prompt: enhancedPrompt,
        status: 'pending' as const,
        timestamp: new Date(),
        designOptions: image.designOptions
      };

      useImageStore.getState().addImage(newImage);
      console.log(`✅ ${action} variant created:`, newImageId);
      
    } catch (error) {
      console.error(`❌ ${action} action failed:`, error);
      alert(`${action}の処理に失敗しました。再度お試しください。`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        boxShadow: isHighlighted 
          ? '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-all cursor-pointer group relative
        ${isHighlighted ? 'ring-2 ring-primary-accent ring-opacity-60' : ''}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-600">
        {image.status === 'completed' && image.imageUrl ? (
          <ImageGrid
            imageUrl={image.imageUrl}
            alt="Generated fashion design"
            onDownload={handleQuadrantDownload}
            onShare={(quadrant) => console.log('Share quadrant:', quadrant)}
            onFavorite={(quadrant) => console.log('Favorite quadrant:', quadrant)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {image.status === 'pending' || image.status === 'in-progress' ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mb-2"></div>
                <p className="text-gray-300 text-sm">生成中...</p>
              </div>
            ) : image.status === 'failed' ? (
              <div className="text-center">
                <div className="text-2xl mb-1">❌</div>
                <p className="text-red-400 text-sm">失敗</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl mb-1">⏳</div>
                <p className="text-gray-300 text-sm">待機中</p>
              </div>
            )}
          </div>
        )}

        {/* Highlight Badge and Dismiss Button */}
        {isHighlighted && (
          <>
            {/* NEW Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute top-2 left-2 z-10"
            >
              <div className="bg-primary-accent text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                NEW
              </div>
            </motion.div>
            
            {/* Dismiss Highlight Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                onDismissHighlight();
              }}
              className="absolute top-2 right-2 z-10 w-6 h-6 bg-surface/80 hover:bg-surface rounded-full flex items-center justify-center text-foreground-secondary hover:text-foreground transition-colors"
              title="ハイライトを消す"
            >
              <span className="text-xs">×</span>
            </motion.button>
          </>
        )}

        {/* Full Image Actions - Only for non-4grid images */}
        {showActions && image.status === 'completed' && !isHighlighted && (
          <div className="absolute top-2 right-2 flex space-x-1">
            <button
              onClick={() => image.imageUrl && window.open(image.imageUrl, '_blank')}
              className="p-1 bg-gray-800 bg-opacity-70 rounded hover:bg-gray-700 transition-colors"
              title="フルサイズ表示"
            >
              <ExternalLink className="w-3 h-3 text-white" />
            </button>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          className={`absolute bottom-2 right-2 p-1 rounded-full transition-colors ${
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-gray-800 bg-opacity-70 text-gray-300 hover:text-red-400'
          }`}
        >
          <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Status Badge */}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 rounded text-xs font-medium bg-gray-800 bg-opacity-70 ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-3">
        {/* Midjourney-style Action Buttons */}
        {image.status === 'completed' && (
          <div className="space-y-2 mb-2">
            {/* Variation Buttons */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => onVariation('color')}
                disabled={isLoading}
                className="flex items-center space-x-1 px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 disabled:opacity-50"
              >
                <Palette className="w-3 h-3" />
                <span>カラー</span>
              </button>
              <button
                onClick={() => onVariation('pattern')}
                disabled={isLoading}
                className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" />
                <span>パターン</span>
              </button>
              <button
                onClick={() => onVariation('mood')}
                disabled={isLoading}
                className="flex items-center space-x-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
              >
                <RotateCcw className="w-3 h-3" />
                <span>ムード</span>
              </button>
            </div>
            
            {/* Midjourney-style Enhancement Buttons */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => handleMidjourneyAction('subtle')}
                disabled={isLoading}
                className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500 disabled:opacity-50 border border-gray-500"
              >
                📝 Subtle
              </button>
              <button
                onClick={() => handleMidjourneyAction('strong')}
                disabled={isLoading}
                className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500 disabled:opacity-50 border border-gray-500"
              >
                💪 Strong
              </button>
              <button
                onClick={() => handleMidjourneyAction('animate')}
                disabled={isLoading}
                className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500 disabled:opacity-50 border border-gray-500"
              >
                🎬 Animate
              </button>
            </div>
          </div>
        )}

        {/* Design Options Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {image.designOptions.trend && (
            <span className="px-2 py-1 bg-gray-600 text-purple-300 rounded text-xs">
              {image.designOptions.trend}
            </span>
          )}
          {image.designOptions.colorScheme && (
            <span className="px-2 py-1 bg-gray-600 text-pink-300 rounded text-xs">
              {image.designOptions.colorScheme}
            </span>
          )}
          {image.designOptions.mood && (
            <span className="px-2 py-1 bg-gray-600 text-blue-300 rounded text-xs">
              {image.designOptions.mood}
            </span>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{new Date(image.timestamp).toLocaleString('ja-JP')}</span>
          <button
            onClick={onRemove}
            className="p-1 hover:text-red-400 transition-colors"
            title="削除"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}