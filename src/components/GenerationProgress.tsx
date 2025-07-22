'use client';

import { motion } from 'framer-motion';
import { Upload, Clock, Sparkles, Palette, CheckCircle } from 'lucide-react';
import { getSafeLoadingCopy } from '@/lib/loadingCopy';

export type GenerationPhase = 'uploading' | 'queued' | 'generating' | 'rendering' | 'complete';

interface GenerationProgressProps {
  phase: GenerationPhase;
  progress: number; // 0-100
  jobId: string;
  onCancel?: () => void;
}

export function GenerationProgress({ phase, progress, jobId, onCancel }: GenerationProgressProps) {
  const phases = [
    { key: 'uploading', icon: Upload, label: 'アップロード' },
    { key: 'queued', icon: Clock, label: '順番待ち' },
    { key: 'generating', icon: Sparkles, label: '生成中' },
    { key: 'rendering', icon: Palette, label: '仕上げ' },
    { key: 'complete', icon: CheckCircle, label: '完了' }
  ] as const;

  const currentPhaseIndex = phases.findIndex(p => p.key === phase);
  const loadingMessage = getSafeLoadingCopy(phase);

  return (
    <div className="bg-surface/30 backdrop-blur-sm rounded-lg border border-surface/50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">生成中</h3>
        {onCancel && phase !== 'complete' && (
          <button
            onClick={onCancel}
            className="text-xs text-foreground-secondary hover:text-foreground transition-colors"
          >
            キャンセル
          </button>
        )}
      </div>

      {/* Phase Steps */}
      <div className="flex items-center justify-between mb-4">
        {phases.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentPhaseIndex;
          const isCurrent = index === currentPhaseIndex;
          
          return (
            <div key={step.key} className="flex flex-col items-center space-y-1">
              {/* Step Icon */}
              <div className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${isActive 
                  ? 'border-primary-accent bg-primary-accent/20 text-primary-accent' 
                  : 'border-surface text-foreground-secondary'
                }
                ${isCurrent ? 'ring-2 ring-primary-accent/30' : ''}
              `}>
                <motion.div
                  animate={isCurrent ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ 
                    duration: isCurrent && phase === 'generating' ? 2 : 0.5, 
                    repeat: isCurrent && phase === 'generating' ? Infinity : 0,
                    ease: 'linear'
                  }}
                >
                  <Icon className="w-4 h-4" />
                </motion.div>
              </div>
              
              {/* Step Label */}
              <span className={`text-xs ${isActive ? 'text-foreground' : 'text-foreground-secondary'}`}>
                {step.label}
              </span>
              
              {/* Connector Line */}
              {index < phases.length - 1 && (
                <div className={`
                  absolute w-12 h-0.5 -z-10 transition-colors duration-300
                  ${isActive ? 'bg-primary-accent' : 'bg-surface'}
                `} 
                style={{ 
                  left: `${(index * 100) / (phases.length - 1) + 12}%`,
                  top: '16px' 
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-foreground-secondary">{loadingMessage}</p>
          <span className="text-xs text-foreground-secondary">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-surface/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-accent to-primary-accent/80 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Job Info */}
      <div className="flex items-center justify-between text-xs text-foreground-secondary">
        <span>ジョブID: {jobId.slice(-8)}</span>
        <span>{new Date().toLocaleTimeString('ja-JP', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}</span>
      </div>
    </div>
  );
}