'use client';

import { useState } from 'react';
import { Download, Heart, Share2, ExternalLink } from 'lucide-react';

interface ImageGridProps {
  imageUrl: string;
  alt: string;
  onDownload?: (quadrant: number) => void;
  onShare?: (quadrant: number) => void;
  onFavorite?: (quadrant: number) => void;
}

export function ImageGrid({ imageUrl, alt, onDownload, onShare, onFavorite }: ImageGridProps) {
  const [hoveredQuadrant, setHoveredQuadrant] = useState<number | null>(null);

  const handleQuadrantClick = (quadrant: number, action: 'download' | 'share' | 'favorite', e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素のクリックイベントを防ぐ
    
    switch (action) {
      case 'download':
        onDownload?.(quadrant);
        break;
      case 'share':
        onShare?.(quadrant);
        break;
      case 'favorite':
        onFavorite?.(quadrant);
        break;
    }
  };

  return (
    <div className="relative w-full h-full">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
      />
      
      {/* 4つの透明な領域 */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        {[1, 2, 3, 4].map((quadrant) => (
          <div
            key={quadrant}
            className="relative border border-gray-400 border-opacity-20 hover:border-opacity-60 transition-all"
            onMouseEnter={() => setHoveredQuadrant(quadrant)}
            onMouseLeave={() => setHoveredQuadrant(null)}
          >
            {/* ホバー時のボタン表示（オーバーレイなし） */}
            {hoveredQuadrant === quadrant && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => handleQuadrantClick(quadrant, 'download', e)}
                    className="p-2 bg-gray-800 bg-opacity-90 rounded-full hover:bg-gray-700 transition-colors shadow-lg"
                    title={`${quadrant}番をダウンロード`}
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={(e) => handleQuadrantClick(quadrant, 'share', e)}
                    className="p-2 bg-gray-800 bg-opacity-90 rounded-full hover:bg-gray-700 transition-colors shadow-lg"
                    title={`${quadrant}番を共有`}
                  >
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={(e) => handleQuadrantClick(quadrant, 'favorite', e)}
                    className="p-2 bg-gray-800 bg-opacity-90 rounded-full hover:bg-gray-700 transition-colors shadow-lg"
                    title={`${quadrant}番をお気に入り`}
                  >
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}
            
            {/* 象限番号 */}
            <div className="absolute top-1 left-1 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {quadrant}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}