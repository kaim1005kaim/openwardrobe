'use client';

import { useState } from 'react';
import { Download, Heart, Share2, Check } from 'lucide-react';

interface SelectableImageGridProps {
  imageUrl: string;
  alt: string;
  selectedQuadrant: number | null;
  onQuadrantSelect: (quadrant: number | null) => void;
  onDownload?: (quadrant: number) => void;
  onShare?: (quadrant: number) => void;
  onFavorite?: (quadrant: number) => void;
}

export function SelectableImageGrid({ 
  imageUrl, 
  alt, 
  selectedQuadrant, 
  onQuadrantSelect, 
  onDownload, 
  onShare, 
  onFavorite 
}: SelectableImageGridProps) {
  const [hoveredQuadrant, setHoveredQuadrant] = useState<number | null>(null);

  const handleQuadrantClick = (quadrant: number, action: 'select' | 'download' | 'share' | 'favorite', e: React.MouseEvent) => {
    e.stopPropagation();
    
    switch (action) {
      case 'select':
        onQuadrantSelect(selectedQuadrant === quadrant ? null : quadrant);
        break;
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
      
      {/* 4つの選択可能な領域 */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        {[1, 2, 3, 4].map((quadrant) => (
          <div
            key={quadrant}
            className={`relative cursor-pointer transition-all ${
              selectedQuadrant === quadrant 
                ? 'border-2 border-purple-400 bg-purple-400/20' 
                : 'border border-gray-400 border-opacity-20 hover:border-opacity-60'
            }`}
            onMouseEnter={() => setHoveredQuadrant(quadrant)}
            onMouseLeave={() => setHoveredQuadrant(null)}
            onClick={(e) => handleQuadrantClick(quadrant, 'select', e)}
          >
            {/* 選択状態の表示 */}
            {selectedQuadrant === quadrant && (
              <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            
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
            <div className={`absolute top-1 left-1 text-xs px-2 py-1 rounded transition-all ${
              selectedQuadrant === quadrant 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800 bg-opacity-70 text-white'
            }`}>
              {quadrant}
            </div>
            
            {/* 選択可能であることを示すヒント */}
            {hoveredQuadrant === quadrant && selectedQuadrant !== quadrant && (
              <div className="absolute bottom-1 right-1 text-xs bg-gray-800 bg-opacity-70 text-white px-2 py-1 rounded">
                クリックで選択
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}