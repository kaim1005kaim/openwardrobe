'use client';

import { motion } from 'framer-motion';
import { LoadingPhase, LoadingState } from '@/lib/types';
import { Loader2, Clock, Palette, Sparkles, CheckCircle } from 'lucide-react';
import { getLoadingCopy, getProgressBasedCopy } from '@/lib/loadingCopy';
import { PresetGenerator } from '@/lib/presetGenerator';

interface ProgressCardSkeletonProps {
  loadingState: LoadingState;
  jobId: string;
  onCancel?: () => void;
  prompt?: string;
}

export function ProgressCardSkeleton({ 
  loadingState, 
  jobId, 
  onCancel,
  prompt 
}: ProgressCardSkeletonProps) {
  
  const getPhaseIcon = (phase: LoadingPhase) => {
    switch (phase) {
      case 'uploading': return Clock;
      case 'queued': return Clock;
      case 'generating': return Sparkles;
      case 'rendering': return Palette;
      case 'complete': return CheckCircle;
      default: return Loader2;
    }
  };

  const getPhaseColor = (phase: LoadingPhase) => {
    switch (phase) {
      case 'uploading': return 'text-blue-400';
      case 'queued': return 'text-yellow-400';
      case 'generating': return 'text-primary-accent';
      case 'rendering': return 'text-green-400';
      case 'complete': return 'text-green-400';
      default: return 'text-foreground-secondary';
    }
  };

  const Icon = getPhaseIcon(loadingState.phase);
  const iconColor = getPhaseColor(loadingState.phase);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-surface/50 backdrop-blur-sm rounded-2xl border border-surface/30 overflow-hidden"
    >
      {/* Main Content Area */}
      <div className="aspect-square relative bg-gradient-to-br from-surface/20 to-surface/40">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="w-full h-full bg-gradient-to-br from-primary-accent/20 via-transparent to-primary-accent/20"
            style={{
              backgroundSize: '200% 200%',
            }}
          />
        </div>

        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            {/* Phase Icon */}
            <motion.div
              animate={{ rotate: loadingState.phase === 'generating' ? 360 : 0 }}
              transition={{ 
                duration: loadingState.phase === 'generating' ? 2 : 0.5, 
                repeat: loadingState.phase === 'generating' ? Infinity : 0,
                ease: 'linear'
              }}
              className={`w-12 h-12 rounded-full bg-surface/50 flex items-center justify-center ${iconColor}`}
            >
              <Icon className="w-6 h-6" />
            </motion.div>

            {/* Loading Message */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                {loadingState.message}
              </p>
              
              {/* Progress Bar */}
              <div className="w-24 h-1 bg-surface/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${loadingState.progress * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-primary-accent rounded-full"
                />
              </div>
              
              <p className="text-xs text-foreground-secondary">
                {Math.round(loadingState.progress * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        {onCancel && loadingState.phase !== 'complete' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={onCancel}
            className="absolute top-3 right-3 w-8 h-8 bg-surface/80 hover:bg-surface rounded-full flex items-center justify-center text-foreground-secondary hover:text-foreground transition-colors"
          >
            <span className="text-sm">×</span>
          </motion.button>
        )}
      </div>

      {/* Footer with Prompt */}
      <div className="p-4 space-y-3">
        {prompt && (
          <div className="space-y-1">
            <p className="text-xs text-foreground-secondary uppercase tracking-wide">
              プロンプト
            </p>
            <p className="text-sm text-foreground line-clamp-2">
              {PresetGenerator.cleanPromptForDisplay(prompt)}
            </p>
          </div>
        )}

        {/* Status Tags */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <StatusChip phase={loadingState.phase} />
          </div>
          
          <p className="text-xs text-foreground-secondary">
            ID: {jobId.slice(0, 8)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

interface StatusChipProps {
  phase: LoadingPhase;
}

function StatusChip({ phase }: StatusChipProps) {
  const getChipStyle = (phase: LoadingPhase) => {
    switch (phase) {
      case 'uploading':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'queued':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'generating':
        return 'bg-primary-accent/20 text-primary-accent border-primary-accent/40';
      case 'rendering':
        return 'bg-green-500/20 text-green-300 border-green-500/40';
      case 'complete':
        return 'bg-green-500/20 text-green-300 border-green-500/40';
      default:
        return 'bg-surface/50 text-foreground-secondary border-surface/30';
    }
  };

  const getChipLabel = (phase: LoadingPhase) => {
    switch (phase) {
      case 'uploading': return '送信中';
      case 'queued': return '順番待ち';
      case 'generating': return '生成中';
      case 'rendering': return '仕上げ中';
      case 'complete': return '完了';
      default: return '処理中';
    }
  };

  return (
    <div className={`
      px-2 py-1 rounded-full border text-xs font-medium
      ${getChipStyle(phase)}
    `}>
      {getChipLabel(phase)}
    </div>
  );
}

// Loading state helpers
export function createLoadingState(phase: LoadingPhase, progress: number = 0): LoadingState {
  let message: string;
  
  switch (phase) {
    case 'uploading':
      message = getLoadingCopy('uploading');
      break;
    case 'queued':
      message = getLoadingCopy('queued');
      break;
    case 'generating':
      message = getLoadingCopy('generating');
      break;
    case 'rendering':
      message = getLoadingCopy('rendering');
      break;
    case 'complete':
      message = '完了しました！';
      break;
    default:
      message = getProgressBasedCopy(progress * 100);
  }

  return {
    phase,
    message,
    progress: Math.max(0, Math.min(1, progress))
  };
}

// Phase progression helper
export function getNextPhase(currentPhase: LoadingPhase): LoadingPhase {
  const phases: LoadingPhase[] = ['uploading', 'queued', 'generating', 'rendering', 'complete'];
  const currentIndex = phases.indexOf(currentPhase);
  return phases[Math.min(currentIndex + 1, phases.length - 1)];
}

// Progress calculation helper
export function calculateProgress(phase: LoadingPhase, subProgress: number = 0): number {
  const phaseWeights = {
    uploading: 0.1,
    queued: 0.2,
    generating: 0.6,
    rendering: 0.9,
    complete: 1.0
  };

  const baseProgress = phaseWeights[phase];
  const nextPhaseWeight = Object.values(phaseWeights)[
    Math.min(Object.keys(phaseWeights).indexOf(phase) + 1, Object.keys(phaseWeights).length - 1)
  ];

  return baseProgress + (nextPhaseWeight - baseProgress) * subProgress;
}