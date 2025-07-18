'use client';

import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Flower2, 
  Zap, 
  Heart, 
  Stars, 
  Briefcase, 
  Sun 
} from 'lucide-react';
import { PresetGenerator, PresetDesign } from '@/lib/presetGenerator';

interface PresetCardsProps {
  onPresetSelect: (preset: PresetDesign) => void;
  isGenerating: boolean;
}

export function PresetCards({ onPresetSelect, isGenerating }: PresetCardsProps) {
  const presets = PresetGenerator.presets;

  // Icon mapping for each preset
  const presetIcons: Record<string, React.ReactNode> = {
    'minimalist-spring': <Flower2 className="w-5 h-5" />,
    'tech-urban': <Zap className="w-5 h-5" />,
    'vintage-romantic': <Heart className="w-5 h-5" />,
    'y2k-neon': <Stars className="w-5 h-5" />,
    'professional-modern': <Briefcase className="w-5 h-5" />,
    'bohemian-summer': <Sun className="w-5 h-5" />
  };

  // Color mapping for each preset
  const presetColors: Record<string, string> = {
    'minimalist-spring': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    'tech-urban': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'vintage-romantic': 'text-red-400 bg-red-500/10 border-red-500/20',
    'y2k-neon': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    'professional-modern': 'text-gray-400 bg-gray-500/10 border-gray-500/20',
    'bohemian-summer': 'text-orange-400 bg-orange-500/10 border-orange-500/20'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary-accent" />
        <h3 className="text-body font-semibold text-foreground">
          人気のプリセット
        </h3>
      </div>

      <div className="space-y-3">
        {presets.map((preset, index) => (
          <motion.button
            key={preset.id}
            onClick={() => onPresetSelect(preset)}
            disabled={isGenerating}
            className={`w-full p-4 rounded-xl border text-left transition-all ${
              isGenerating
                ? 'border-surface/30 bg-surface/20 cursor-not-allowed opacity-50'
                : 'border-surface/50 hover:border-primary-accent hover:bg-primary-accent/5'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={!isGenerating ? { scale: 1.02 } : {}}
            whileTap={!isGenerating ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center space-x-4">
              {/* Icon */}
              <div className={`p-3 rounded-xl border ${presetColors[preset.id] || 'text-primary-accent bg-primary-accent/10 border-primary-accent/20'}`}>
                {presetIcons[preset.id] || <Sparkles className="w-5 h-5" />}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {preset.name}
                </h4>
                <p className="text-xs text-foreground-secondary leading-relaxed mb-2">
                  {preset.description}
                </p>
                
                {/* Option tags */}
                <div className="flex flex-wrap gap-1">
                  {preset.options.trend && (
                    <span className="px-2 py-1 bg-primary-accent/20 text-primary-accent text-xs rounded-md">
                      {preset.options.trend}
                    </span>
                  )}
                  {preset.options.colorScheme && (
                    <span className="px-2 py-1 bg-pink-500/20 text-pink-400 text-xs rounded-md">
                      {preset.options.colorScheme}
                    </span>
                  )}
                  {preset.options.mood && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md">
                      {preset.options.mood}
                    </span>
                  )}
                  {preset.options.season && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md">
                      {preset.options.season}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}