'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Download, Eye, Zap, MoreHorizontal } from 'lucide-react';
import { GeneratedImage } from '@/lib/types';

interface ImageCardProps {
  image: GeneratedImage;
  isFavorite: boolean;
  onImageClick: () => void;
  onToggleFavorite: () => void;
}

export function ImageCard({ image, isFavorite, onImageClick, onToggleFavorite }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (image.imageUrl) {
      const link = document.createElement('a');
      link.href = image.imageUrl;
      link.download = `openwardrobe-${image.id}.jpg`;
      link.click();
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageClick();
  };

  const getStatusColor = () => {
    switch (image.status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-foreground-secondary';
    }
  };

  const getStatusText = () => {
    switch (image.status) {
      case 'completed':
        return '完了';
      case 'in-progress':
        return '生成中';
      case 'failed':
        return '失敗';
      default:
        return '待機中';
    }
  };

  return (
    <motion.div
      layout
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onImageClick}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Main image container */}
      <div className="relative overflow-hidden rounded-2xl bg-surface">
        {/* Status indicator */}
        <div className="absolute top-3 left-3 z-20">
          <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>

        {/* Progress bar for in-progress images */}
        {image.status === 'in-progress' && image.progress && (
          <div className="absolute top-0 left-0 right-0 z-20">
            <div className="h-1 bg-surface/30">
              <motion.div
                className="h-full bg-primary-accent"
                initial={{ width: 0 }}
                animate={{ width: `${image.progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Image */}
        {image.status === 'completed' && image.imageUrl ? (
          <div className="relative">
            <img
              src={image.imageUrl}
              alt={image.prompt}
              className="w-full h-auto object-cover"
              onLoad={() => setImageLoaded(true)}
              style={{
                aspectRatio: 'auto',
                minHeight: '200px'
              }}
            />
            
            {/* Gradient overlay on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                />
              )}
            </AnimatePresence>
          </div>
        ) : (
          // Placeholder for pending/failed images
          <div className="aspect-square bg-surface flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              {image.status === 'pending' || image.status === 'in-progress' ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-accent mb-2 mx-auto"></div>
                  <p className="text-caption text-foreground-secondary">生成中...</p>
                </>
              ) : (
                <>
                  <div className="text-2xl mb-2">❌</div>
                  <p className="text-caption text-foreground-secondary">生成失敗</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action buttons overlay */}
        <AnimatePresence>
          {isHovered && image.status === 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ 
                duration: 0.2,
                staggerChildren: 0.05
              }}
              className="absolute bottom-4 left-4 right-4 z-20"
            >
              <div className="flex items-center justify-between">
                {/* Left side actions */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={handleFavorite}
                    className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                      isFavorite
                        ? 'bg-red-500 text-white'
                        : 'bg-black/50 text-white hover:bg-black/70'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </motion.button>

                  <motion.button
                    onClick={handleDownload}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    onClick={handleViewDetails}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Right side actions */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="p-2 rounded-full bg-primary-accent text-white hover:bg-primary-accent/80 backdrop-blur-sm transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Zap className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card footer */}
      <motion.div
        className="p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-caption text-foreground-secondary leading-relaxed overflow-hidden" 
           style={{ 
             display: '-webkit-box', 
             WebkitLineClamp: 2, 
             WebkitBoxOrient: 'vertical' 
           }}>
          {image.prompt}
        </p>
        <div className="flex items-center justify-between mt-2">
          <time className="text-caption text-foreground-secondary">
            {new Date(image.timestamp).toLocaleDateString('ja-JP', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </time>
          
          {/* Design options tags */}
          <div className="flex items-center space-x-1">
            {image.designOptions.mood && (
              <span className="px-2 py-1 bg-surface/50 rounded-full text-xs text-foreground-secondary">
                {image.designOptions.mood}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}