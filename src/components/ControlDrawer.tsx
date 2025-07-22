'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Sparkles, Calendar, Shirt, Wand2, Shuffle, Settings, Image } from 'lucide-react';
import { DesignOptions, GenerationSettings } from '@/lib/types';
import { PresetCards } from './PresetCards';
import { PresetDesign, PresetGenerator } from '@/lib/presetGenerator';
import { SelectionSummaryBar } from './SelectionSummaryBar';

interface ControlDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  designOptions: DesignOptions;
  onDesignOptionsChange: (options: DesignOptions) => void;
  generationSettings: GenerationSettings;
  onGenerationSettingsChange: (settings: GenerationSettings) => void;
  onGenerateFromSettings: () => void;
  onGenerateFromPreset: (preset: PresetDesign) => void;
  isGenerating: boolean;
}

export function ControlDrawer({ 
  isOpen, 
  onClose, 
  designOptions, 
  onDesignOptionsChange,
  generationSettings,
  onGenerationSettingsChange,
  onGenerateFromSettings,
  onGenerateFromPreset,
  isGenerating
}: ControlDrawerProps) {
  const handleOptionChange = (key: keyof DesignOptions, value: any) => {
    onDesignOptionsChange({
      ...designOptions,
      [key]: value
    });
  };

  const handleGenerationSettingChange = (key: keyof GenerationSettings, value: any) => {
    onGenerationSettingsChange({
      ...generationSettings,
      [key]: value
    });
  };

  const handleRandomize = () => {
    const randomTrend = trendOptions[Math.floor(Math.random() * trendOptions.length)];
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    const randomMood = moodOptions[Math.floor(Math.random() * moodOptions.length)];
    const randomSeason = seasonOptions[Math.floor(Math.random() * seasonOptions.length)];

    onDesignOptionsChange({
      trend: randomTrend.id as any,
      colorScheme: randomColor.id as any,
      mood: randomMood.id as any,
      season: randomSeason.id as any
    });
  };

  const getSelectionCount = () => {
    let count = 0;
    if (designOptions.trend) count++;
    if (designOptions.colorScheme) count++;
    if (designOptions.mood) count++;
    if (designOptions.season) count++;
    return count;
  };

  const trendOptions = [
    { id: 'minimalist', label: 'ミニマル', icon: '⚪' },
    { id: 'y2k', label: 'Y2K', icon: '✨' },
    { id: 'cottage-core', label: 'コテージコア', icon: '🌸' },
    { id: 'tech-wear', label: 'テックウェア', icon: '⚡' },
    { id: 'vintage', label: 'ヴィンテージ', icon: '🕰️' },
    { id: 'bohemian', label: 'ボヘミアン', icon: '🌙' },
    { id: 'streetwear', label: 'ストリート', icon: '🏙️' },
    { id: 'preppy', label: 'プレッピー', icon: '🎓' }
  ];

  const colorOptions = [
    { id: 'monochrome', label: 'モノクロ', color: '#000000' },
    { id: 'pastel', label: 'パステル', color: '#FFB6C1' },
    { id: 'vivid', label: 'ビビッド', color: '#FF6B6B' },
    { id: 'earth-tone', label: 'アースト', color: '#8B4513' },
    { id: 'jewel-tone', label: 'ジュエル', color: '#4B0082' },
    { id: 'neon', label: 'ネオン', color: '#00FF00' },
    { id: 'muted', label: 'ミュート', color: '#808080' }
  ];

  const moodOptions = [
    { id: 'casual', label: 'カジュアル' },
    { id: 'formal', label: 'フォーマル' },
    { id: 'edgy', label: 'エッジー' },
    { id: 'romantic', label: 'ロマンチック' },
    { id: 'professional', label: 'プロフェッショナル' },
    { id: 'playful', label: 'プレイフル' },
    { id: 'sophisticated', label: 'ソフィスティケート' }
  ];

  const seasonOptions = [
    { id: 'spring', label: '春', icon: '🌸' },
    { id: 'summer', label: '夏', icon: '☀️' },
    { id: 'autumn', label: '秋', icon: '🍂' },
    { id: 'winter', label: '冬', icon: '❄️' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 top-0 h-full w-96 bg-surface/95 backdrop-blur-xl border-r border-surface/50 z-50 flex flex-col"
          >
            {/* Header with Selection Summary */}
            <div className="p-6 border-b border-surface/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-h2 font-semibold text-foreground">
                  デザイン設定
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface/50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-foreground-secondary" />
                </button>
              </div>

              {/* Selection Pills */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {designOptions.trend && (
                  <SelectionPill
                    label={trendOptions.find(t => t.id === designOptions.trend)?.label || designOptions.trend}
                    onRemove={() => handleOptionChange('trend', null)}
                    color="blue"
                  />
                )}
                {designOptions.colorScheme && (
                  <SelectionPill
                    label={colorOptions.find(c => c.id === designOptions.colorScheme)?.label || designOptions.colorScheme}
                    onRemove={() => handleOptionChange('colorScheme', null)}
                    color="pink"
                  />
                )}
                {designOptions.mood && (
                  <SelectionPill
                    label={moodOptions.find(m => m.id === designOptions.mood)?.label || designOptions.mood}
                    onRemove={() => handleOptionChange('mood', null)}
                    color="green"
                  />
                )}
                {designOptions.season && (
                  <SelectionPill
                    label={seasonOptions.find(s => s.id === designOptions.season)?.label || designOptions.season}
                    onRemove={() => handleOptionChange('season', 'spring')}
                    color="orange"
                  />
                )}
                {getSelectionCount() > 0 && (
                  <button
                    onClick={() => onDesignOptionsChange({
                      trend: null,
                      colorScheme: null,
                      mood: null,
                      season: 'spring'
                    })}
                    className="text-xs text-foreground-secondary hover:text-foreground px-2 py-1 rounded-md hover:bg-surface/30"
                  >
                    すべてクリア
                  </button>
                )}
              </div>

              {/* Generate Button */}
              <motion.button
                onClick={onGenerateFromSettings}
                disabled={!designOptions.trend || isGenerating}
                className={`w-full p-3 rounded-xl font-medium transition-all ${
                  designOptions.trend && !isGenerating
                    ? 'bg-primary-accent hover:bg-primary-accent/90 text-white'
                    : 'bg-surface/50 text-foreground-secondary cursor-not-allowed'
                }`}
                whileHover={designOptions.trend && !isGenerating ? { scale: 1.02 } : {}}
                whileTap={designOptions.trend && !isGenerating ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Wand2 className="w-4 h-4" />
                  <span>選択した設定で生成</span>
                </div>
              </motion.button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Preset Generation */}
              <div className="p-6 bg-glass-surface rounded-2xl border border-surface/30" data-tutorial="preset-cards">
                <PresetCards
                  onPresetSelect={onGenerateFromPreset}
                  isGenerating={isGenerating}
                />
              </div>

              {/* Trends */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary-accent" />
                  <h3 className="text-body font-medium text-foreground">トレンド</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {trendOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleOptionChange('trend', option.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        designOptions.trend === option.id
                          ? 'border-primary-accent bg-primary-accent/10 text-primary-accent'
                          : 'border-surface/50 hover:border-surface text-foreground-secondary hover:text-foreground'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-lg mb-1">{option.icon}</div>
                      <div className="text-caption font-medium">{option.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Palette className="w-5 h-5 text-primary-accent" />
                  <h3 className="text-body font-medium text-foreground">カラー</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {colorOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleOptionChange('colorScheme', option.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        designOptions.colorScheme === option.id
                          ? 'border-primary-accent bg-primary-accent/10 text-primary-accent'
                          : 'border-surface/50 hover:border-surface text-foreground-secondary hover:text-foreground'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: option.color }}
                        />
                        <div className="text-caption font-medium">{option.label}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Shirt className="w-5 h-5 text-primary-accent" />
                  <h3 className="text-body font-medium text-foreground">ムード</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {moodOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleOptionChange('mood', option.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        designOptions.mood === option.id
                          ? 'border-primary-accent bg-primary-accent/10 text-primary-accent'
                          : 'border-surface/50 hover:border-surface text-foreground-secondary hover:text-foreground'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-caption font-medium">{option.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Season */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-5 h-5 text-primary-accent" />
                  <h3 className="text-body font-medium text-foreground">シーズン</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {seasonOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleOptionChange('season', option.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        designOptions.season === option.id
                          ? 'border-primary-accent bg-primary-accent/10 text-primary-accent'
                          : 'border-surface/50 hover:border-surface text-foreground-secondary hover:text-foreground'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-lg mb-1">{option.icon}</div>
                      <div className="text-caption font-medium">{option.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Generation Settings */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Settings className="w-5 h-5 text-primary-accent" />
                  <h3 className="text-body font-medium text-foreground">生成設定</h3>
                </div>
                <div className="space-y-6">
                  {/* Batch Size */}
                  <div>
                    <label className="block text-sm font-medium text-foreground-secondary mb-2">
                      生成枚数
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((size) => (
                        <motion.button
                          key={size}
                          onClick={() => handleGenerationSettingChange('batchSize', size)}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            generationSettings.batchSize === size
                              ? 'border-primary-accent bg-primary-accent/10 text-primary-accent'
                              : 'border-surface/50 hover:border-surface text-foreground-secondary hover:text-foreground'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-sm font-medium">{size}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>


                  {/* Aspect Ratio */}
                  <div>
                    <label className="block text-sm font-medium text-foreground-secondary mb-2">
                      アスペクト比
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '1:1', label: '正方形' },
                        { id: '2:3', label: 'ポートレート' },
                        { id: '3:2', label: 'ランドスケープ' },
                        { id: '16:9', label: 'ワイド' },
                        { id: '9:16', label: '縦長' },
                        { id: '4:5', label: 'インスタ' }
                      ].map((ratio) => (
                        <motion.button
                          key={ratio.id}
                          onClick={() => handleGenerationSettingChange('aspectRatio', ratio.id)}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            generationSettings.aspectRatio === ratio.id
                              ? 'border-primary-accent bg-primary-accent/10 text-primary-accent'
                              : 'border-surface/50 hover:border-surface text-foreground-secondary hover:text-foreground'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-xs font-medium">{ratio.label}</div>
                          <div className="text-xs text-foreground-secondary">{ratio.id}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Quality */}
                  <div>
                    <label className="block text-sm font-medium text-foreground-secondary mb-2">
                      画質
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'standard', label: '標準' },
                        { id: 'high', label: '高品質' },
                        { id: 'ultra', label: '最高品質' }
                      ].map((quality) => (
                        <motion.button
                          key={quality.id}
                          onClick={() => handleGenerationSettingChange('quality', quality.id)}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            generationSettings.quality === quality.id
                              ? 'border-primary-accent bg-primary-accent/10 text-primary-accent'
                              : 'border-surface/50 hover:border-surface text-foreground-secondary hover:text-foreground'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-sm font-medium">{quality.label}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// SelectionPill component for drawer
interface SelectionPillProps {
  label: string;
  onRemove: () => void;
  color: 'blue' | 'pink' | 'green' | 'orange';
}

function SelectionPill({ label, onRemove, color }: SelectionPillProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    pink: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    green: 'bg-green-500/20 text-green-300 border-green-500/40',
    orange: 'bg-orange-500/20 text-orange-300 border-orange-500/40'
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-sm font-medium ${colorClasses[color]}`}>
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}