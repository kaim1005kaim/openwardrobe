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
  const [settings, setSettings] = useState({
    creativityLevel: 'balanced' as const,
    quality: 'high' as const,
    count: 1
  });

  const { addImage, setGenerating } = useImageStore();

  const handleGenerate = async () => {
    if (isGenerating || disabled) return;

    setIsGenerating(true);
    setGenerating(true);

    try {
      // Generate multiple images based on count
      const generatePromises = Array.from({ length: settings.count }, async (_, index) => {
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
          status: 'processing' as const,
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
      
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerating(false);
    }
  };

  const canGenerate = () => {
    return designOptions.trend || designOptions.colorScheme || designOptions.mood;
  };

  const getButtonText = () => {
    if (isGenerating) return 'Generating...';
    if (!canGenerate()) return 'Select options to generate';
    return `Generate ${settings.count} Design${settings.count > 1 ? 's' : ''}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generation Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Creativity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Creativity Level
              </label>
              <select
                value={settings.creativityLevel}
                onChange={(e) => setSettings(prev => ({ ...prev, creativityLevel: e.target.value as any }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="conservative">Conservative</option>
                <option value="balanced">Balanced</option>
                <option value="experimental">Experimental</option>
                <option value="maximum">Maximum</option>
              </select>
            </div>

            {/* Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quality
              </label>
              <select
                value={settings.quality}
                onChange={(e) => setSettings(prev => ({ ...prev, quality: e.target.value as any }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="standard">Standard</option>
                <option value="high">High</option>
                <option value="ultra">Ultra</option>
              </select>
            </div>

            {/* Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Images
              </label>
              <select
                value={settings.count}
                onChange={(e) => setSettings(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={1}>1 Image</option>
                <option value={2}>2 Images</option>
                <option value={3}>3 Images</option>
                <option value={4}>4 Images</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Generate Button */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleGenerate}
          disabled={!canGenerate() || isGenerating || disabled}
          className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed ${
            canGenerate() && !isGenerating
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}
        >
          {isGenerating ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Wand2 className="w-6 h-6" />
          )}
          <span>{getButtonText()}</span>
          {!isGenerating && <Sparkles className="w-5 h-5" />}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Generation Settings"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Generation Info */}
      {canGenerate() && !isGenerating && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ready to generate with{' '}
            {[
              designOptions.trend && `${designOptions.trend} trend`,
              designOptions.colorScheme && `${designOptions.colorScheme} colors`,
              designOptions.mood && `${designOptions.mood} mood`,
              designOptions.season && `${designOptions.season} season`
            ].filter(Boolean).join(', ')}
          </p>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => {
            const randomOptions = PromptGenerator.generateRandomDesign();
            useImageStore.getState().setDesignOptions(randomOptions);
          }}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          🎲 Random
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
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
}