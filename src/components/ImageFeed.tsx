'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { GeneratedImage } from '@/lib/types';
import { ImageCard } from './ImageCard';
import { useJobStore } from '@/store/jobStore';
import { useAuth } from '@/hooks/useAuth';

type GalleryFilter = 'all' | 'favorites' | 'history';

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
  const { getJobById, highlightJob } = useJobStore();
  const { isAuthenticated } = useAuth();
  const prevImagesLength = useRef(images.length);
  
  // Filter state
  const [currentFilter, setCurrentFilter] = useState<GalleryFilter>('all');
  const [filteredImages, setFilteredImages] = useState<GeneratedImage[]>(images);
  const [userImages, setUserImages] = useState<GeneratedImage[]>([]);
  const [favoriteImages, setFavoriteImages] = useState<GeneratedImage[]>([]);
  const [filterLoading, setFilterLoading] = useState(false);

  // Grid layout breakpoints (horizontal layout instead of masonry)
  const breakpointColumnsObj = {
    default: 6,
    1536: 5,
    1280: 4,
    1024: 3,
    768: 2,
    640: 1
  };

  // Fetch user-specific data
  const fetchUserData = async () => {
    if (!isAuthenticated) return;
    
    setFilterLoading(true);
    try {
      // Fetch user's images
      const userResponse = await fetch('/api/images?userId=current');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('User images data:', userData);
        // Transform the user images to GeneratedImage format
        const userImages = userData.images?.map((image: any) => ({
          id: image.id,
          prompt: image.prompt,
          imageUrl: image.imageUrl,
          status: image.status || 'completed',
          timestamp: new Date(image.createdAt),
          designOptions: image.designOptions || {},
          upscaledUrls: image.upscaledUrls || [],
          tags: image.tags || [],
          progress: image.progress || 100
        } as GeneratedImage)) || [];
        setUserImages(userImages);
      }

      // Fetch user's favorites
      const favResponse = await fetch('/api/favorites');
      if (favResponse.ok) {
        const favData = await favResponse.json();
        console.log('Favorites data:', favData);
        // Transform the favorites data to GeneratedImage format
        const favoriteImages = favData.favorites?.map((fav: any) => {
          const image = fav.image;
          return {
            id: image.id,
            prompt: image.prompt,
            imageUrl: image.imageUrl,
            status: image.status || 'completed',
            timestamp: new Date(image.createdAt),
            designOptions: image.designOptions || {},
            upscaledUrls: image.upscaledUrls || [],
            tags: image.tags || [],
            progress: image.progress || 100
          } as GeneratedImage;
        }) || [];
        console.log('Transformed favorite images:', favoriteImages);
        setFavoriteImages(favoriteImages);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setFilterLoading(false);
    }
  };

  // Update filtered images based on current filter
  useEffect(() => {
    let sourceImages: GeneratedImage[];
    switch (currentFilter) {
      case 'favorites':
        sourceImages = favoriteImages;
        break;
      case 'history':
        sourceImages = userImages;
        break;
      case 'all':
      default:
        sourceImages = images;
        break;
    }
    setFilteredImages(sourceImages);
    setVisibleImages(sourceImages.slice(0, 20)); // Reset visible images for new filter
  }, [currentFilter, images, userImages, favoriteImages]);

  // Force refetch when switching to favorites tab
  useEffect(() => {
    if (currentFilter === 'favorites' && isAuthenticated) {
      fetchUserData();
    }
  }, [currentFilter]);

  // Fetch user data when component mounts or authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  // Refetch data when favorites change
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [favorites, isAuthenticated]);

  // Initialize visible images
  useEffect(() => {
    if (filteredImages.length > 0) {
      setVisibleImages(filteredImages.slice(0, 20)); // Start with first 20 images
    }
  }, [filteredImages]);

  // Auto-scroll to new completed images
  useEffect(() => {
    // Check if a new image was added
    if (images.length > prevImagesLength.current) {
      const newImages = images.slice(0, images.length - prevImagesLength.current);
      const completedNewImages = newImages.filter(img => img.status === 'completed');
      
      if (completedNewImages.length > 0) {
        // Scroll to top after a short delay to allow for animation
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
      }
    }
    prevImagesLength.current = images.length;
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
  }, [visibleImages.length, filteredImages.length]);

  const loadMoreImages = () => {
    if (isLoading || visibleImages.length >= filteredImages.length) return;

    setIsLoading(true);
    
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      const nextImages = filteredImages.slice(visibleImages.length, visibleImages.length + 10);
      setVisibleImages(prev => [...prev, ...nextImages]);
      setIsLoading(false);
    }, 300);
  };

  // Empty state content based on filter
  const getEmptyStateContent = () => {
    switch (currentFilter) {
      case 'favorites':
        return {
          title: 'お気に入りがありません',
          description: 'お気に入りに追加してみましょう'
        };
      case 'history':
        return {
          title: 'あなたの作品がありません',
          description: '最初のファッションデザインを作成してみましょう'
        };
      default:
        return {
          title: '創造の始まり',
          description: '下のプロンプトバーにアイデアを入力して、AIがあなたのビジョンを美しいファッションデザインに変換します'
        };
    }
  };

  if (filteredImages.length === 0 && !filterLoading) {
    const emptyState = getEmptyStateContent();
    return (
      <div>
        {/* Filter Tabs - Minimal Design */}
        {isAuthenticated && (
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-8">
              <button
                onClick={() => setCurrentFilter('all')}
                className={`relative pb-2 text-sm font-medium transition-colors ${
                  currentFilter === 'all'
                    ? 'text-foreground'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                すべて
                {images.length > 0 && (
                  <span className="ml-2 text-xs text-foreground-secondary">
                    {images.length}
                  </span>
                )}
                {currentFilter === 'all' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
              <button
                onClick={() => setCurrentFilter('history')}
                className={`relative pb-2 text-sm font-medium transition-colors ${
                  currentFilter === 'history'
                    ? 'text-foreground'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                私の作品
                {userImages.length > 0 && (
                  <span className="ml-2 text-xs text-foreground-secondary">
                    {userImages.length}
                  </span>
                )}
                {currentFilter === 'history' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
              <button
                onClick={() => setCurrentFilter('favorites')}
                className={`relative pb-2 text-sm font-medium transition-colors ${
                  currentFilter === 'favorites'
                    ? 'text-foreground'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                お気に入り
                {favoriteImages.length > 0 && (
                  <span className="ml-2 text-xs text-foreground-secondary">
                    {favoriteImages.length}
                  </span>
                )}
                {currentFilter === 'favorites' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            </div>
          </div>
        )}
        
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md"
          >
            <h2 className="text-h2 font-semibold text-foreground mb-4">
              {emptyState.title}
            </h2>
            <p className="text-body text-foreground-secondary leading-relaxed">
              {emptyState.description}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Filter Tabs - Minimal Design */}
      {isAuthenticated && (
        <div className="flex items-center justify-center pt-6 mb-8">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setCurrentFilter('all')}
              className={`relative pb-2 text-sm font-medium transition-colors ${
                currentFilter === 'all'
                  ? 'text-foreground'
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              すべて
              {images.length > 0 && (
                <span className="ml-2 text-xs text-foreground-secondary">
                  {images.length}
                </span>
              )}
              {currentFilter === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => setCurrentFilter('history')}
              className={`relative pb-2 text-sm font-medium transition-colors ${
                currentFilter === 'history'
                  ? 'text-foreground'
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              私の作品
              {userImages.length > 0 && (
                <span className="ml-2 text-xs text-foreground-secondary">
                  {userImages.length}
                </span>
              )}
              {currentFilter === 'history' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => setCurrentFilter('favorites')}
              className={`relative pb-2 text-sm font-medium transition-colors ${
                currentFilter === 'favorites'
                  ? 'text-foreground'
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              お気に入り
              {favoriteImages.length > 0 && (
                <span className="ml-2 text-xs text-foreground-secondary">
                  {favoriteImages.length}
                </span>
              )}
              {currentFilter === 'favorites' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {filterLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-foreground-secondary">読み込み中...</span>
        </div>
      )}

      {/* Main feed container */}
      {!filterLoading && (
        <div 
          ref={containerRef}
          className="px-8 pt-2 pb-32" // Bottom padding to account for fixed prompt bar
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
                    isHighlighted={getJobById(image.id)?.isHighlighted || false}
                    onImageClick={() => onImageClick(image)}
                    onToggleFavorite={() => onToggleFavorite(image.id)}
                    onDismissHighlight={() => highlightJob(image.id, false)}
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
      )}

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