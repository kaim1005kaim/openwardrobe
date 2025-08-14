'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Grid3X3, Grid2X2, LayoutGrid, Filter, Palette, Download, ExternalLink, Wand2 } from 'lucide-react';
import Masonry from 'react-masonry-css';
import Link from 'next/link';

interface GalleryImage {
  id: string;
  name: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  mimeType?: string;
  createdTime?: string;
  modifiedTime?: string;
}

interface ColorFilter {
  name: string;
  keywords: string[];
  color: string;
}

const colorFilters: ColorFilter[] = [
  { name: 'All', keywords: [], color: '#6b7280' },
  { name: 'Red', keywords: ['red', 'rouge', 'crimson', 'scarlet'], color: '#ef4444' },
  { name: 'Blue', keywords: ['blue', 'bleu', 'navy', 'azure'], color: '#3b82f6' },
  { name: 'Green', keywords: ['green', 'vert', 'emerald', 'olive'], color: '#10b981' },
  { name: 'Yellow', keywords: ['yellow', 'jaune', 'gold', 'amber'], color: '#f59e0b' },
  { name: 'Purple', keywords: ['purple', 'violet', 'lavender', 'plum'], color: '#8b5cf6' },
  { name: 'Pink', keywords: ['pink', 'rose', 'magenta', 'fuchsia'], color: '#ec4899' },
  { name: 'Black', keywords: ['black', 'noir', 'dark', 'ebony'], color: '#1f2937' },
  { name: 'White', keywords: ['white', 'blanc', 'ivory', 'cream'], color: '#f9fafb' },
  { name: 'Brown', keywords: ['brown', 'brun', 'tan', 'beige'], color: '#92400e' },
];

const FIXED_FOLDER_ID = '1h7NWBXZEsBT_JPgKALL7AISUYy-mdnsz';
const IMAGES_PER_LOAD = 20;

export function EnhancedGallery() {
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [displayedImages, setDisplayedImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [colorFilter, setColorFilter] = useState('All');
  const [gridSize, setGridSize] = useState(5); // 3, 5, 8 columns
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const breakpointColumns = useMemo(() => {
    const base = gridSize;
    return {
      default: base,
      1536: base === 8 ? 6 : base === 5 ? 4 : 3,
      1280: base === 8 ? 5 : base === 5 ? 3 : 2,
      1024: base === 8 ? 4 : base === 5 ? 3 : 2,
      768: base === 8 ? 3 : 2,
      640: 1
    };
  }, [gridSize]);

  const filteredImages = useMemo(() => {
    if (colorFilter === 'All') return allImages;
    
    const filter = colorFilters.find(f => f.name === colorFilter);
    if (!filter) return allImages;

    return allImages.filter(image => 
      filter.keywords.some(keyword => 
        image.name.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }, [allImages, colorFilter]);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/gallery?folderId=${FIXED_FOLDER_ID}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch images');
      }

      setAllImages(data.images || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreImages = useCallback(() => {
    if (loading) return; // Prevent multiple simultaneous loads
    
    const startIndex = (currentPage - 1) * IMAGES_PER_LOAD;
    const endIndex = startIndex + IMAGES_PER_LOAD;
    const newImages = filteredImages.slice(startIndex, endIndex);
    
    console.log('📦 loadMoreImages called:', {
      currentPage,
      startIndex,
      endIndex,
      newImagesCount: newImages.length,
      totalFiltered: filteredImages.length,
      hasMore: endIndex < filteredImages.length
    });
    
    if (newImages.length === 0) {
      setHasMore(false);
      return;
    }
    
    if (currentPage === 1) {
      setDisplayedImages(newImages);
    } else {
      setDisplayedImages(prev => {
        const updated = [...prev, ...newImages];
        console.log('📸 Images updated:', {
          previousCount: prev.length,
          newCount: updated.length,
          addedCount: newImages.length
        });
        return updated;
      });
    }
    
    setHasMore(endIndex < filteredImages.length);
  }, [filteredImages, currentPage, loading]);

  // Initial load
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
    setDisplayedImages([]);
    setHasMore(true);
  }, [colorFilter]);

  // Load images when filter or page changes
  useEffect(() => {
    if (filteredImages.length > 0) {
      loadMoreImages();
    }
  }, [loadMoreImages, filteredImages]);

  // Infinite scroll with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.offsetHeight;
          
          // Trigger load when user is 1000px from bottom
          if (scrollTop + windowHeight >= documentHeight - 1000) {
            if (hasMore && !loading && filteredImages.length > 0) {
              console.log('🔄 Loading more images...', {
                currentPage,
                hasMore,
                displayedCount: displayedImages.length,
                totalFilteredCount: filteredImages.length
              });
              setCurrentPage(prev => prev + 1);
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, filteredImages.length, currentPage, displayedImages.length]);

  const getImageUrl = (image: GalleryImage, size: 'thumbnail' | 'full' = 'thumbnail') => {
    if (size === 'full' && image.webContentLink) {
      return image.webContentLink;
    }
    if (image.thumbnailLink) {
      const targetSize = size === 'thumbnail' ? 's400' : 's1600';
      return image.thumbnailLink.replace('=s220', `=${targetSize}`);
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Tab Navigation */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <Link
              href="/"
              className="group inline-flex items-center py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 font-medium text-sm transition-colors"
            >
              <Wand2 className="mr-2 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
              Create
            </Link>
            <div className="inline-flex items-center py-4 px-1 border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium text-sm">
              <Palette className="mr-2 h-5 w-5 text-blue-500 dark:text-blue-400" />
              Gallery
            </div>
          </nav>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-16 z-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Color Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {colorFilters.map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => setColorFilter(filter.name)}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5
                    ${colorFilter === filter.name
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: filter.color }}
                  />
                  {filter.name}
                </button>
              ))}
            </div>

            {/* Grid Size Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Grid:</span>
              {[3, 5, 8].map((size) => (
                <button
                  key={size}
                  onClick={() => setGridSize(size)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1
                    ${gridSize === size 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  {size === 3 && <Grid2X2 className="w-4 h-4" />}
                  {size === 5 && <Grid3X3 className="w-4 h-4" />}
                  {size === 8 && <LayoutGrid className="w-4 h-4" />}
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Showing {displayedImages.length} of {filteredImages.length} images
            {colorFilter !== 'All' && ` (filtered by ${colorFilter})`}
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto p-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            <div className="whitespace-pre-line">{error}</div>
          </div>
        )}

        {!loading && displayedImages.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
            <Palette className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">No images found</p>
            <p className="text-sm mt-2">Try adjusting your color filter</p>
          </div>
        )}

        {displayedImages.length > 0 && (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex -ml-2 w-auto"
            columnClassName="pl-2 bg-clip-padding"
          >
            {displayedImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className="mb-2"
              >
                <div
                  className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={getImageUrl(image)}
                    alt=""
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </Masonry>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-7xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                {selectedImage.webViewLink && (
                  <a
                    href={selectedImage.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-white" />
                  </a>
                )}
                {selectedImage.webContentLink && (
                  <a
                    href={selectedImage.webContentLink}
                    download="image.png"
                    className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                  >
                    <Download className="w-5 h-5 text-white" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <img
                src={getImageUrl(selectedImage, 'full')}
                alt=""
                className="max-w-full max-h-[90vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}