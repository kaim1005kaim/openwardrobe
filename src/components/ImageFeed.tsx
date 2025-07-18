'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { GeneratedImage } from '@/lib/types';
import { ImageCard } from './ImageCard';

interface ImageFeedProps {
  images: GeneratedImage[];
  onImageClick: (image: GeneratedImage) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
}

export function ImageFeed({ images, onImageClick, onToggleFavorite, favorites }: ImageFeedProps) {
  const [visibleImages, setVisibleImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Grid layout breakpoints (horizontal layout instead of masonry)
  const breakpointColumnsObj = {
    default: 6,
    1536: 5,
    1280: 4,
    1024: 3,
    768: 2,
    640: 1
  };

  // Initialize visible images
  useEffect(() => {
    if (images.length > 0) {
      setVisibleImages(images.slice(0, 20)); // Start with first 20 images
    }
  }, [images]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMoreImages();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleImages.length, images.length]);

  const loadMoreImages = () => {
    if (isLoading || visibleImages.length >= images.length) return;

    setIsLoading(true);
    
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      const nextImages = images.slice(visibleImages.length, visibleImages.length + 10);
      setVisibleImages(prev => [...prev, ...nextImages]);
      setIsLoading(false);
    }, 300);
  };

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <div className="text-8xl mb-8 opacity-40">✨</div>
          <h2 className="text-h2 font-semibold text-foreground mb-4">
            創造の始まり
          </h2>
          <p className="text-body text-foreground-secondary leading-relaxed">
            下のプロンプトバーにアイデアを入力して、<br />
            AIがあなたのビジョンを美しいファッションデザインに変換します
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main feed container */}
      <div 
        ref={containerRef}
        className="px-8 pt-8 pb-32" // Bottom padding to account for fixed prompt bar
      >
        {/* Grid Layout */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          <AnimatePresence mode="popLayout">
            {visibleImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.25,
                  delay: index * 0.02,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="w-full"
              >
                <ImageCard
                  image={image}
                  isFavorite={favorites.includes(image.id)}
                  onImageClick={() => onImageClick(image)}
                  onToggleFavorite={() => onToggleFavorite(image.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Loading indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-8"
            >
              <div className="flex items-center space-x-2 text-foreground-secondary">
                <div className="w-2 h-2 bg-primary-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary-accent rounded-full animate-bounce"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll to top button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-32 right-8 p-4 bg-surface/80 backdrop-blur-sm rounded-full border border-surface/50 shadow-xl z-40"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg 
          className="w-5 h-5 text-foreground-secondary" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>
      </motion.button>
    </div>
  );
}