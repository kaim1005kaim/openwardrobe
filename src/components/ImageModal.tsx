'use client';

import { useState, useEffect } from 'react';
import { X, Download, Share2, Heart, Palette, Sparkles, RotateCcw, Play, Repeat, Zap, Video } from 'lucide-react';
import { GeneratedImage } from '@/lib/types';
import { useImageStore } from '@/store/imageStore';
import { ImageService } from '@/lib/imageService';
import { PromptGenerator } from '@/lib/promptGenerator';
import { extractQuadrantFromImage, downloadImageFromBlob } from '@/lib/imageUtils';
import { ImageGrid } from '@/components/ImageGrid';
import { SelectableImageGrid } from '@/components/SelectableImageGrid';

interface ImageModalProps {
  image: GeneratedImage;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ image, isOpen, onClose }: ImageModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState<number | null>(null);
  const { toggleFavorite, favorites, removeImage } = useImageStore();
  const isFavorite = favorites.includes(image.id);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleAction = async (action: string) => {
    setIsLoading(true);
    setSelectedAction(action);
    
    try {
      console.log(`🎨 ${action} action for image:`, image.id, selectedQuadrant ? `quadrant ${selectedQuadrant}` : 'full image');
      
      let enhancedPrompt = image.prompt;
      let actionType = action;
      
      // Add quadrant selection for style adjustments
      if (selectedQuadrant && ['subtle', 'strong', 'animate', 'vary', 'upscale'].includes(action)) {
        enhancedPrompt = `${image.prompt} --quadrant ${selectedQuadrant}`;
      }
      
      switch (action) {
        case 'regenerate':
          enhancedPrompt = image.prompt;
          actionType = 'regenerate';
          break;
        case 'subtle':
          enhancedPrompt = `${enhancedPrompt} --stylize 50 --quality 0.5`;
          actionType = 'subtle';
          break;
        case 'strong':
          enhancedPrompt = `${enhancedPrompt} --stylize 1000 --quality 2`;
          actionType = 'strong';
          break;
        case 'animate':
          enhancedPrompt = `${enhancedPrompt} --video --motion 4`;
          actionType = 'animate';
          break;
        case 'remix':
          enhancedPrompt = PromptGenerator.modifyPromptForColorChange(enhancedPrompt, 'random');
          actionType = 'remix';
          break;
        case 'upscale':
          enhancedPrompt = `${enhancedPrompt} --uplight --q 2`;
          actionType = 'upscale';
          break;
        case 'vary':
          enhancedPrompt = `${enhancedPrompt} --chaos 20`;
          actionType = 'vary';
          break;
      }
      
      // Generate new image with enhanced prompt
      const newImageId = await ImageService.generateImage({
        prompt: enhancedPrompt,
        designOptions: image.designOptions,
        action: actionType,
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
      setSelectedAction(null);
    }
  };

  const handleQuadrantDownload = async (quadrant: number) => {
    if (!image.imageUrl) return;
    
    try {
      const blobUrl = await extractQuadrantFromImage(image.imageUrl, quadrant);
      const filename = `fashion-design-${image.id}-${quadrant}.jpg`;
      downloadImageFromBlob(blobUrl, filename);
    } catch (error) {
      console.error('❌ Failed to extract quadrant:', error);
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
      if (image.imageUrl) {
        navigator.clipboard.writeText(image.imageUrl);
        alert('Image URL copied to clipboard!');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white">
            デザイン詳細
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Side - Image */}
          <div className="flex-1 p-6">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-square relative">
                {image.status === 'completed' && image.imageUrl ? (
                  <SelectableImageGrid
                    imageUrl={image.imageUrl}
                    alt="Generated fashion design"
                    selectedQuadrant={selectedQuadrant}
                    onQuadrantSelect={setSelectedQuadrant}
                    onDownload={handleQuadrantDownload}
                    onShare={(quadrant) => console.log('Share quadrant:', quadrant)}
                    onFavorite={(quadrant) => console.log('Favorite quadrant:', quadrant)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mb-4"></div>
                      <p className="text-gray-300">生成中...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image Info */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">作成日時</span>
                <span className="text-sm text-gray-300">{new Date(image.timestamp).toLocaleString('ja-JP')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">ステータス</span>
                <span className={`text-sm font-medium ${
                  image.status === 'completed' ? 'text-green-400' : 
                  image.status === 'in-progress' ? 'text-blue-400' : 
                  image.status === 'failed' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {image.status === 'completed' ? '完了' : 
                   image.status === 'in-progress' ? '処理中' : 
                   image.status === 'failed' ? '失敗' : '待機中'}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-400">プロンプト</span>
                <p className="text-sm text-gray-300 mt-1 p-2 bg-gray-800 rounded">{image.prompt}</p>
              </div>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="w-80 p-6 border-l border-gray-700 overflow-y-auto">
            <div className="space-y-6">
              {/* Quadrant Selection */}
              {selectedQuadrant && (
                <div className="bg-purple-900/30 p-3 rounded-lg">
                  <h3 className="text-sm font-semibold text-purple-300 mb-1">選択中</h3>
                  <p className="text-xs text-gray-300">象限 {selectedQuadrant} を選択しています</p>
                  <button
                    onClick={() => setSelectedQuadrant(null)}
                    className="text-xs text-gray-400 hover:text-white mt-1"
                  >
                    選択解除
                  </button>
                </div>
              )}
              
              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">クイック操作</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => toggleFavorite(image.id)}
                    className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isFavorite 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    <span>{isFavorite ? 'お気に入り解除' : 'お気に入り追加'}</span>
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>ダウンロード</span>
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>共有</span>
                  </button>
                </div>
              </div>

              {/* Generation Actions */}
              {image.status === 'completed' && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">生成操作</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAction('regenerate')}
                      disabled={isLoading}
                      className="w-full flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Repeat className="w-4 h-4" />
                      <span>再生成</span>
                      {isLoading && selectedAction === 'regenerate' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-auto"></div>}
                    </button>
                    
                    <button
                      onClick={() => handleAction('vary')}
                      disabled={isLoading}
                      className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>バリエーション</span>
                      {isLoading && selectedAction === 'vary' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-auto"></div>}
                    </button>
                    
                    <button
                      onClick={() => handleAction('remix')}
                      disabled={isLoading}
                      className="w-full flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Palette className="w-4 h-4" />
                      <span>リミックス</span>
                      {isLoading && selectedAction === 'remix' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-auto"></div>}
                    </button>
                    
                    <button
                      onClick={() => handleAction('upscale')}
                      disabled={isLoading}
                      className="w-full flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4" />
                      <span>アップスケール</span>
                      {isLoading && selectedAction === 'upscale' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-auto"></div>}
                    </button>
                  </div>
                </div>
              )}

              {/* Style Actions */}
              {image.status === 'completed' && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">スタイル調整</h3>
                  {!selectedQuadrant && (
                    <p className="text-sm text-gray-400 mb-3">
                      画像の象限を選択してからスタイル調整を行ってください
                    </p>
                  )}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAction('subtle')}
                      disabled={isLoading || !selectedQuadrant}
                      className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors border ${
                        selectedQuadrant 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600' 
                          : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                      } disabled:opacity-50`}
                    >
                      <span>📝</span>
                      <span>Subtle</span>
                      {selectedQuadrant && <span className="text-xs text-gray-400">({selectedQuadrant})</span>}
                      {isLoading && selectedAction === 'subtle' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-auto"></div>}
                    </button>
                    
                    <button
                      onClick={() => handleAction('strong')}
                      disabled={isLoading || !selectedQuadrant}
                      className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors border ${
                        selectedQuadrant 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600' 
                          : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                      } disabled:opacity-50`}
                    >
                      <span>💪</span>
                      <span>Strong</span>
                      {selectedQuadrant && <span className="text-xs text-gray-400">({selectedQuadrant})</span>}
                      {isLoading && selectedAction === 'strong' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-auto"></div>}
                    </button>
                    
                    <button
                      onClick={() => handleAction('animate')}
                      disabled={isLoading || !selectedQuadrant}
                      className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        selectedQuadrant 
                          ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      } disabled:opacity-50`}
                    >
                      <Video className="w-4 h-4" />
                      <span>動画生成</span>
                      {selectedQuadrant && <span className="text-xs text-gray-400">({selectedQuadrant})</span>}
                      {isLoading && selectedAction === 'animate' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-auto"></div>}
                    </button>
                  </div>
                </div>
              )}

              {/* Design Options */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">デザイン設定</h3>
                <div className="space-y-2">
                  {image.designOptions.trend && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">トレンド</span>
                      <span className="text-sm text-purple-300 bg-purple-900/30 px-2 py-1 rounded">
                        {image.designOptions.trend}
                      </span>
                    </div>
                  )}
                  {image.designOptions.colorScheme && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">カラー</span>
                      <span className="text-sm text-pink-300 bg-pink-900/30 px-2 py-1 rounded">
                        {image.designOptions.colorScheme}
                      </span>
                    </div>
                  )}
                  {image.designOptions.mood && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">ムード</span>
                      <span className="text-sm text-blue-300 bg-blue-900/30 px-2 py-1 rounded">
                        {image.designOptions.mood}
                      </span>
                    </div>
                  )}
                  {image.designOptions.season && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">シーズン</span>
                      <span className="text-sm text-green-300 bg-green-900/30 px-2 py-1 rounded">
                        {image.designOptions.season}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Danger Zone */}
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-3">削除</h3>
                <button
                  onClick={() => {
                    if (confirm('この画像を削除しますか？')) {
                      removeImage(image.id);
                      onClose();
                    }
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>画像を削除</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}