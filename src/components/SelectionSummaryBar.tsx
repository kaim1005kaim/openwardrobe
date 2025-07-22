'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Wand2, Loader2 } from 'lucide-react';
import { SelectionTag, DesignOptions } from '@/lib/types';
import { getLoadingCopy } from '@/lib/loadingCopy';
import { LoginButton } from '@/components/auth/LoginButton';
import { useAuth } from '@/hooks/useAuth';

interface SelectionSummaryBarProps {
  designOptions: DesignOptions;
  onClearAll: () => void;
  onRemoveTag: (kind: SelectionTag['kind']) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
}

export function SelectionSummaryBar({
  designOptions,
  onClearAll,
  onRemoveTag,
  onGenerate,
  isGenerating,
  isDisabled = false,
  disabledReason
}: SelectionSummaryBarProps) {
  
  // Convert design options to selection tags
  const selectionTags: SelectionTag[] = [];
  
  if (designOptions.trend) {
    selectionTags.push({
      id: `trend-${designOptions.trend}`,
      label: getTrendLabel(designOptions.trend),
      kind: 'style',
      value: designOptions.trend
    });
  }
  
  if (designOptions.colorScheme) {
    selectionTags.push({
      id: `color-${designOptions.colorScheme}`,
      label: getColorLabel(designOptions.colorScheme),
      kind: 'color',
      value: designOptions.colorScheme
    });
  }
  
  if (designOptions.mood) {
    selectionTags.push({
      id: `mood-${designOptions.mood}`,
      label: getMoodLabel(designOptions.mood),
      kind: 'mood',
      value: designOptions.mood
    });
  }
  
  if (designOptions.season) {
    selectionTags.push({
      id: `season-${designOptions.season}`,
      label: getSeasonLabel(designOptions.season),
      kind: 'season',
      value: designOptions.season
    });
  }
  
  const hasSelections = selectionTags.length > 0;
  const isValidForGeneration = hasSelections && !isDisabled;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-glass-surface backdrop-blur-xl border-b border-surface/30 p-4"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Selection Pills */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <AnimatePresence mode="popLayout">
            {selectionTags.map((tag) => (
              <SelectionPill
                key={tag.id}
                tag={tag}
                onRemove={() => onRemoveTag(tag.kind)}
              />
            ))}
          </AnimatePresence>
          
          {hasSelections && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={onClearAll}
              className="text-xs text-foreground-secondary hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-surface/30"
            >
              すべてクリア
            </motion.button>
          )}
          
          {!hasSelections && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-foreground-secondary"
            >
              スタイルを選択してください
            </motion.p>
          )}
        </div>
        
        {/* Auth and Generate Button */}
        <div className="flex items-center gap-3">
          <LoginButton />
          
          <div className="relative">
            <motion.button
              onClick={onGenerate}
              disabled={!isValidForGeneration || isGenerating}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
                ${isValidForGeneration && !isGenerating
                  ? 'bg-primary-accent hover:bg-primary-accent/90 text-white shadow-lg shadow-primary-accent/30'
                  : 'bg-surface/50 text-foreground-secondary cursor-not-allowed'
                }
              `}
              whileHover={isValidForGeneration && !isGenerating ? { scale: 1.02 } : {}}
              whileTap={isValidForGeneration && !isGenerating ? { scale: 0.98 } : {}}
              title={!isValidForGeneration ? disabledReason || 'スタイルを1つ以上選択してください' : undefined}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{getLoadingCopy('generating')}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>生成する</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface SelectionPillProps {
  tag: SelectionTag;
  onRemove: () => void;
}

function SelectionPill({ tag, onRemove }: SelectionPillProps) {
  const kindColors = {
    style: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    color: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    mood: 'bg-green-500/20 text-green-300 border-green-500/40',
    season: 'bg-orange-500/20 text-orange-300 border-orange-500/40'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: -20 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-center space-x-2 px-3 py-1.5 rounded-full border text-sm font-medium
        ${kindColors[tag.kind]}
      `}
    >
      <span>{tag.label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

// Helper functions for label mapping
function getTrendLabel(trend: string): string {
  const labels: Record<string, string> = {
    'minimalist': 'ミニマル',
    'y2k': 'Y2K',
    'cottage-core': 'コテージコア',
    'tech-wear': 'テックウェア',
    'vintage': 'ヴィンテージ',
    'bohemian': 'ボヘミアン',
    'streetwear': 'ストリート',
    'preppy': 'プレッピー'
  };
  return labels[trend] || trend;
}

function getColorLabel(color: string): string {
  const labels: Record<string, string> = {
    'monochrome': 'モノクロ',
    'pastel': 'パステル',
    'vivid': 'ビビッド',
    'earth-tone': 'アースト',
    'jewel-tone': 'ジュエル',
    'neon': 'ネオン',
    'muted': 'ミュート'
  };
  return labels[color] || color;
}

function getMoodLabel(mood: string): string {
  const labels: Record<string, string> = {
    'casual': 'カジュアル',
    'formal': 'フォーマル',
    'edgy': 'エッジー',
    'romantic': 'ロマンチック',
    'professional': 'プロフェッショナル',
    'playful': 'プレイフル',
    'sophisticated': 'ソフィスティケート'
  };
  return labels[mood] || mood;
}

function getSeasonLabel(season: string): string {
  const labels: Record<string, string> = {
    'spring': '春',
    'summer': '夏',
    'autumn': '秋',
    'winter': '冬'
  };
  return labels[season] || season;
}