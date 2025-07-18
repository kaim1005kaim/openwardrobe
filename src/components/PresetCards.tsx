'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { PresetGenerator, PresetDesign } from '@/lib/presetGenerator';

interface PresetCardsProps {
  onPresetSelect: (preset: PresetDesign) => void;
  isGenerating: boolean;
}

export function PresetCards({ onPresetSelect, isGenerating }: PresetCardsProps) {
  const presets = PresetGenerator.presets;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary-accent" />
        <h3 className="text-body font-semibold text-foreground">
          人気のプリセット
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {presets.map((preset, index) => (
          <motion.button
            key={preset.id}
            onClick={() => onPresetSelect(preset)}
            disabled={isGenerating}
            className={`p-4 rounded-xl border text-left transition-all ${
              isGenerating
                ? 'border-surface/30 bg-surface/20 cursor-not-allowed opacity-50'
                : 'border-surface/50 hover:border-primary-accent hover:bg-primary-accent/5 hover:text-primary-accent'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={!isGenerating ? { scale: 1.02 } : {}}
            whileTap={!isGenerating ? { scale: 0.98 } : {}}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{preset.emoji}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {preset.name}
                </h4>
                <p className="text-xs text-foreground-secondary leading-relaxed">
                  {preset.description}
                </p>
                
                {/* Option tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {preset.options.trend && (
                    <span className="px-2 py-1 bg-primary-accent/20 text-primary-accent text-xs rounded">
                      {preset.options.trend}
                    </span>
                  )}
                  {preset.options.colorScheme && (
                    <span className="px-2 py-1 bg-pink-500/20 text-pink-400 text-xs rounded">
                      {preset.options.colorScheme}
                    </span>
                  )}
                  {preset.options.mood && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                      {preset.options.mood}
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