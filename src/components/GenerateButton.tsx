'use client';

import { useState } from 'react';
import { Wand2, Loader2, Sparkles, Settings } from 'lucide-react';
import { DesignOptions } from '@/lib/types';
import { ImageService } from '@/lib/imageService';
import { PromptGenerator } from '@/lib/promptGenerator';
import { useImageStore } from '@/store/imageStore';

interface GenerateButtonProps {
  designOptions: DesignOptions;
  disabled?: boolean;
}

export function GenerateButton({ designOptions, disabled = false }: GenerateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<{
    creativityLevel: 'conservative' | 'balanced' | 'experimental' | 'maximum';
    quality: 'standard' | 'high' | 'ultra';
    count: number;
  }>({
    creativityLevel: 'balanced',
    quality: 'high',
    count: 1
  });

  const { addImage, setGenerating } = useImageStore();

  const handleGenerate = async () => {
    if (isGenerating || disabled) return;

    setIsGenerating(true);
    setGenerating(true);

    try {
      // Check system status before generating
      console.log('🔍 Checking API system status...');
      const statusResponse = await fetch('/api/test');
      const statusData = await statusResponse.json();
      
      if (statusData.tests?.systemStatus?.systemStatus !== 'ok') {
        console.warn('⚠️ API system status:', statusData.tests?.systemStatus);
        if (statusData.tests?.systemStatus?.status === 'failed') {
          throw new Error('API system is currently unavailable');
        }
      } else {
        console.log('✅ API system status: OK');
      }
      // Generate multiple images based on count
      const generatePromises = Array.from({ length: settings.count }, async () => {
        const prompt = PromptGenerator.generatePrompt(designOptions, {
          creativityLevel: settings.creativityLevel,
          includeSeasonalConsistency: true,
          includeColorHarmony: true,
          cameraAngle: 'random',
          aspectRatio: '--ar 3:4',
          quality: settings.quality
        });

        const imageId = await ImageService.generateImage({
          prompt,
          designOptions,
          action: 'generate'
        });

        const newImage = {
          id: imageId,
          prompt,
          status: 'pending' as const,
          timestamp: new Date(),
          designOptions,
          variations: []
        };

        addImage(newImage);
        return imageId;
      });

      await Promise.all(generatePromises);

      // Show success message
      console.log('🎨 Generation started for', settings.count, 'image(s)');

      // Start enhanced polling for new images
      const startEnhancedPolling = () => {
        let pollCount = 0;
        const maxPolls = 60; // Maximum 2 minutes of polling
        
        const enhancedPoll = setInterval(async () => {
          pollCount++;
          
          try {
            // Check if we have any pending/in-progress images
            const currentImages = useImageStore.getState().images;
            const processingImages = currentImages.filter(img => 
              img.status === 'pending' || img.status === 'in-progress'
            );
            
            if (processingImages.length === 0 || pollCount >= maxPolls) {
              clearInterval(enhancedPoll);
              return;
            }
            
            // Also sync from API periodically to catch any missed updates
            if (pollCount % 10 === 0) { // Every 20 seconds
              const response = await fetch('/api/test');
              const data = await response.json();
              
              if (data.tests?.authTest?.recentImages) {
                data.tests.authTest.recentImages.forEach((img: any) => {
                  if (img.status === 'completed' && img.url) {
                    const existingImage = currentImages.find(existing => existing.id === img.id);
                    if (existingImage && (existingImage.status === 'pending' || existingImage.status === 'in-progress')) {
                      useImageStore.getState().updateImageStatus(img.id, {
                        id: img.id,
                        status: img.status,
                        url: img.url,
                        upscaled_urls: img.upscaled_urls,
                        progress: img.progress
                      });
                    }
                  }
                });
              }
            }
          } catch (error) {
            console.error('❌ Enhanced polling error:', error);
          }
        }, 2000); // Poll every 2 seconds
      };

      // Start enhanced polling
      startEnhancedPolling();
      
    } catch (error) {
      console.error('❌ Generation failed:', error);
      
      // Show detailed error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to generate image. Please try again.';
      
      alert(`Generation failed: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
      setGenerating(false);
    }
  };

  const canGenerate = () => {
    return designOptions.trend || designOptions.colorScheme || designOptions.mood;
  };

  const getButtonText = () => {
    if (isGenerating) return '生成中...';
    if (!canGenerate()) return 'オプションを選択してください';
    return `デザインを${settings.count}個生成`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-700 rounded-lg p-4 w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">生成設定</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Creativity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                創造性レベル
              </label>
              <select
                value={settings.creativityLevel}
                onChange={(e) => setSettings(prev => ({ ...prev, creativityLevel: e.target.value as 'conservative' | 'balanced' | 'experimental' | 'maximum' }))}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
              >
                <option value="conservative">控えめ</option>
                <option value="balanced">バランス</option>
                <option value="experimental">実験的</option>
                <option value="maximum">最大</option>
              </select>
            </div>

            {/* Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                品質
              </label>
              <select
                value={settings.quality}
                onChange={(e) => setSettings(prev => ({ ...prev, quality: e.target.value as 'standard' | 'high' | 'ultra' }))}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
              >
                <option value="standard">標準</option>
                <option value="high">高品質</option>
                <option value="ultra">最高品質</option>
              </select>
            </div>

            {/* Count */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                生成枚数
              </label>
              <select
                value={settings.count}
                onChange={(e) => setSettings(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
              >
                <option value={1}>1枚</option>
                <option value={2}>2枚</option>
                <option value={3}>3枚</option>
                <option value={4}>4枚</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Generate Button */}
      <div className="w-full">
        <button
          onClick={handleGenerate}
          disabled={!canGenerate() || isGenerating || disabled}
          className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            canGenerate() && !isGenerating
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Wand2 className="w-5 h-5" />
          )}
          <span>{getButtonText()}</span>
          {!isGenerating && <Sparkles className="w-4 h-4" />}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full mt-2 p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors text-sm"
          title="生成設定"
        >
          <Settings className="w-4 h-4 inline mr-1" />
          設定
        </button>
      </div>

      {/* Generation Info */}
      {canGenerate() && !isGenerating && (
        <div className="w-full">
          <p className="text-sm text-gray-400 mb-2">
            選択された設定:{' '}
            {[
              designOptions.trend && `${designOptions.trend}トレンド`,
              designOptions.colorScheme && `${designOptions.colorScheme}カラー`,
              designOptions.mood && `${designOptions.mood}ムード`,
              designOptions.season && `${designOptions.season}シーズン`
            ].filter(Boolean).join('、')}
          </p>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="w-full flex gap-2">
        <button
          onClick={() => {
            const randomOptions = PromptGenerator.generateRandomDesign();
            useImageStore.getState().setDesignOptions(randomOptions);
          }}
          className="flex-1 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
        >
          🎲 ランダム
        </button>
        
        <button
          onClick={() => {
            useImageStore.getState().setDesignOptions({
              trend: null,
              colorScheme: null,
              mood: null,
              season: 'spring'
            });
          }}
          className="flex-1 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
        >
          🗑️ クリア
        </button>
      </div>
    </div>
  );
}