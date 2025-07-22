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
import { DisabledTooltip } from '@/components/DisabledTooltip';

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
        action: actionType as 'generate' | 'upscale' | 'variation' | 'blend' | 'subtle' | 'strong' | 'animate' | 'regenerate' | 'remix' | 'vary',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-glass-surface backdrop-blur-xl border border-surface/30 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface/30 flex-shrink-0">
          <h2 className="text-h2 font-semibold text-foreground">
            デザイン詳細
          </h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-surface/50 rounded-xl transition-all duration-200"
          >
            <X className="w-6 h-6 text-foreground-secondary hover:text-foreground" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Side - Image */}
          <div className="flex-1 p-6">
            <div className="bg-surface/30 rounded-2xl overflow-hidden border border-surface/20">
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
                  <div className="w-full h-full flex items-center justify-center bg-surface/20">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-accent mb-4"></div>
                      <p className="text-foreground-secondary">生成中...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">作成日時</span>
                <span className="text-sm text-foreground">{new Date(image.timestamp).toLocaleString('ja-JP')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">ステータス</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                  image.status === 'completed' ? 'text-green-400 bg-green-400/10' : 
                  image.status === 'in-progress' ? 'text-blue-400 bg-blue-400/10' : 
                  image.status === 'failed' ? 'text-red-400 bg-red-400/10' : 'text-foreground-secondary bg-surface/30'
                }`}>
                  {image.status === 'completed' ? '完了' : 
                   image.status === 'in-progress' ? '処理中' : 
                   image.status === 'failed' ? '失敗' : '待機中'}
                </span>
              </div>
              <div>
                <span className="text-sm text-foreground-secondary">プロンプト</span>
                <p className="text-sm text-foreground mt-2 p-3 bg-surface/30 rounded-xl border border-surface/20">{image.prompt}</p>
              </div>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="w-80 p-6 border-l border-surface/30 overflow-y-auto">
            <div className="space-y-6">
              {/* Quadrant Selection */}
              {selectedQuadrant && (
                <div className="bg-primary-accent/20 p-4 rounded-xl border border-primary-accent/30">
                  <h3 className="text-sm font-semibold text-primary-accent mb-1">選択中</h3>
                  <p className="text-xs text-foreground-secondary">象限 {selectedQuadrant} を選択しています</p>
                  <button
                    onClick={() => setSelectedQuadrant(null)}
                    className="text-xs text-foreground-secondary hover:text-foreground mt-2 transition-colors"
                  >
                    選択解除
                  </button>
                </div>
              )}
              
              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">クイック操作</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => toggleFavorite(image.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isFavorite 
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30' 
                        : 'bg-surface/50 hover:bg-surface/70 text-foreground-secondary border border-surface/30'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    <span>{isFavorite ? 'お気に入り解除' : 'お気に入り追加'}</span>
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-surface/50 hover:bg-surface/70 text-foreground-secondary rounded-xl transition-all duration-200 border border-surface/30"
                  >
                    <Download className="w-4 h-4" />
                    <span>ダウンロード</span>
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-surface/50 hover:bg-surface/70 text-foreground-secondary rounded-xl transition-all duration-200 border border-surface/30"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>共有</span>
                  </button>
                </div>
              </div>

              {/* Generation Actions */}
              {image.status === 'completed' && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">生成操作</h3>
                  <div className="space-y-2">
                    <DisabledTooltip
                      disabled={isLoading}
                      tooltip="他の操作が完了するまでお待ちください"
                      position="top"
                    >
                      <button
                        onClick={() => handleAction('regenerate')}
                        disabled={isLoading}
                        className="w-full flex items-center space-x-3 px-4 py-3 bg-primary-accent/20 hover:bg-primary-accent/30 text-primary-accent rounded-xl transition-all duration-200 disabled:opacity-50 border border-primary-accent/30"
                      >
                        <Repeat className="w-4 h-4" />
                        <span>再生成</span>
                        {isLoading && selectedAction === 'regenerate' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-accent ml-auto"></div>}
                      </button>
                    </DisabledTooltip>
                    
                    <DisabledTooltip
                      disabled={isLoading}
                      tooltip="他の操作が完了するまでお待ちください"
                      position="top"
                    >
                      <button
                        onClick={() => handleAction('vary')}
                        disabled={isLoading}
                        className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-all duration-200 disabled:opacity-50 border border-blue-500/30"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>バリエーション</span>
                        {isLoading && selectedAction === 'vary' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 ml-auto"></div>}
                      </button>
                    </DisabledTooltip>
                    
                    <DisabledTooltip
                      disabled={isLoading}
                      tooltip="他の操作が完了するまでお待ちください"
                      position="top"
                    >
                      <button
                        onClick={() => handleAction('remix')}
                        disabled={isLoading}
                        className="w-full flex items-center space-x-3 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-all duration-200 disabled:opacity-50 border border-green-500/30"
                      >
                        <Palette className="w-4 h-4" />
                        <span>リミックス</span>
                        {isLoading && selectedAction === 'remix' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400 ml-auto"></div>}
                      </button>
                    </DisabledTooltip>
                    
                    <DisabledTooltip
                      disabled={isLoading}
                      tooltip="他の操作が完了するまでお待ちください"
                      position="top"
                    >
                      <button
                        onClick={() => handleAction('upscale')}
                        disabled={isLoading}
                        className="w-full flex items-center space-x-3 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl transition-all duration-200 disabled:opacity-50 border border-yellow-500/30"
                      >
                        <Zap className="w-4 h-4" />
                        <span>アップスケール</span>
                        {isLoading && selectedAction === 'upscale' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400 ml-auto"></div>}
                      </button>
                    </DisabledTooltip>
                  </div>
                </div>
              )}

              {/* Style Actions */}
              {image.status === 'completed' && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">スタイル調整</h3>
                  {!selectedQuadrant && (
                    <p className="text-sm text-foreground-secondary mb-4 p-3 bg-surface/20 rounded-xl border border-surface/20">
                      画像の象限を選択してからスタイル調整を行ってください
                    </p>
                  )}
                  <div className="space-y-2">
                    <DisabledTooltip
                      disabled={!selectedQuadrant}
                      tooltip="画像の象限を選択してください"
                      position="top"
                    >
                      <button
                        onClick={() => handleAction('subtle')}
                        disabled={isLoading || !selectedQuadrant}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 border ${
                          selectedQuadrant 
                            ? 'bg-surface/50 hover:bg-surface/70 text-foreground border-surface/30' 
                            : 'bg-surface/20 text-foreground-secondary border-surface/20 cursor-not-allowed'
                        } disabled:opacity-50`}
                      >
                        <span>📝</span>
                        <span>Subtle</span>
                        {selectedQuadrant && <span className="text-xs text-foreground-secondary">({selectedQuadrant})</span>}
                        {isLoading && selectedAction === 'subtle' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground ml-auto"></div>}
                      </button>
                    </DisabledTooltip>
                    
                    <DisabledTooltip
                      disabled={!selectedQuadrant}
                      tooltip="画像の象限を選択してください"
                      position="top"
                    >
                      <button
                        onClick={() => handleAction('strong')}
                        disabled={isLoading || !selectedQuadrant}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 border ${
                          selectedQuadrant 
                            ? 'bg-surface/50 hover:bg-surface/70 text-foreground border-surface/30' 
                            : 'bg-surface/20 text-foreground-secondary border-surface/20 cursor-not-allowed'
                        } disabled:opacity-50`}
                      >
                        <span>💪</span>
                        <span>Strong</span>
                        {selectedQuadrant && <span className="text-xs text-foreground-secondary">({selectedQuadrant})</span>}
                        {isLoading && selectedAction === 'strong' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground ml-auto"></div>}
                      </button>
                    </DisabledTooltip>
                    
                    <DisabledTooltip
                      disabled={!selectedQuadrant}
                      tooltip="画像の象限を選択してください"
                      position="top"
                    >
                      <button
                        onClick={() => handleAction('animate')}
                        disabled={isLoading || !selectedQuadrant}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 border ${
                          selectedQuadrant 
                            ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-orange-500/30' 
                            : 'bg-surface/20 text-foreground-secondary border-surface/20 cursor-not-allowed'
                        } disabled:opacity-50`}
                      >
                        <Video className="w-4 h-4" />
                        <span>動画生成</span>
                        {selectedQuadrant && <span className="text-xs text-foreground-secondary">({selectedQuadrant})</span>}
                        {isLoading && selectedAction === 'animate' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400 ml-auto"></div>}
                      </button>
                    </DisabledTooltip>
                  </div>
                </div>
              )}

              {/* Design Options */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">デザイン設定</h3>
                <div className="space-y-2">
                  {image.designOptions.trend && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground-secondary">トレンド</span>
                      <span className="text-sm text-primary-accent bg-primary-accent/20 px-3 py-1 rounded-lg border border-primary-accent/30">
                        {image.designOptions.trend}
                      </span>
                    </div>
                  )}
                  {image.designOptions.colorScheme && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground-secondary">カラー</span>
                      <span className="text-sm text-pink-400 bg-pink-500/20 px-3 py-1 rounded-lg border border-pink-500/30">
                        {image.designOptions.colorScheme}
                      </span>
                    </div>
                  )}
                  {image.designOptions.mood && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground-secondary">ムード</span>
                      <span className="text-sm text-blue-400 bg-blue-500/20 px-3 py-1 rounded-lg border border-blue-500/30">
                        {image.designOptions.mood}
                      </span>
                    </div>
                  )}
                  {image.designOptions.season && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground-secondary">シーズン</span>
                      <span className="text-sm text-green-400 bg-green-500/20 px-3 py-1 rounded-lg border border-green-500/30">
                        {image.designOptions.season}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Danger Zone */}
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-4">削除</h3>
                <button
                  onClick={() => {
                    if (confirm('この画像を削除しますか？')) {
                      removeImage(image.id);
                      onClose();
                    }
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all duration-200 border border-red-500/30"
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