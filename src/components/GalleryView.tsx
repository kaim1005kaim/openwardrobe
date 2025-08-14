'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Download, X, Loader2, ImageIcon, FolderOpen } from 'lucide-react';
import Masonry from 'react-masonry-css';

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

interface GalleryViewProps {
  folderUrl?: string;
  folderId?: string;
}

export function GalleryView({ folderUrl, folderId }: GalleryViewProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [inputUrl, setInputUrl] = useState(folderUrl || '');

  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  const fetchImages = async (url?: string, id?: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (url) params.append('folderUrl', url);
      if (id) params.append('folderId', id);

      const response = await fetch(`/api/gallery?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch images');
      }

      setImages(data.images || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (folderUrl || folderId) {
      fetchImages(folderUrl, folderId);
    }
  }, [folderUrl, folderId]);

  const handleLoadFolder = () => {
    if (inputUrl.trim()) {
      fetchImages(inputUrl.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoadFolder();
    }
  };

  const getImageUrl = (image: GalleryImage) => {
    if (image.thumbnailLink) {
      return image.thumbnailLink.replace('=s220', '=s800');
    }
    if (image.webContentLink) {
      return image.webContentLink;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <FolderOpen className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Paste Google Drive folder URL..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLoadFolder}
              disabled={loading || !inputUrl.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load Gallery'
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && images.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
            <ImageIcon className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">No images to display</p>
            <p className="text-sm mt-2">Enter a Google Drive folder URL above to load images</p>
          </div>
        )}

        {images.length > 0 && (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex -ml-4 w-auto"
            columnClassName="pl-4 bg-clip-padding"
          >
            {images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <div
                  className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={image.name}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm font-medium truncate">{image.name}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                {selectedImage.webViewLink && (
                  <a
                    href={selectedImage.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/90 dark:bg-gray-700/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </a>
                )}
                {selectedImage.webContentLink && (
                  <a
                    href={selectedImage.webContentLink}
                    download={selectedImage.name}
                    className="p-2 bg-white/90 dark:bg-gray-700/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  >
                    <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 bg-white/90 dark:bg-gray-700/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              <img
                src={getImageUrl(selectedImage)}
                alt={selectedImage.name}
                className="max-w-full max-h-[90vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white font-medium">{selectedImage.name}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}