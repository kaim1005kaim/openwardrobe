'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Sparkles, SkipForward } from 'lucide-react';
import { tutorialSteps, TutorialStep, TutorialManager } from '@/lib/tutorialSystem';

interface TutorialOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export function TutorialOverlay({ isVisible, onClose, onOpenSettings }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightPosition, setSpotlightPosition] = useState<DOMRect | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentTutorialStep = tutorialSteps[currentStep];

  // Update spotlight position when step changes
  useEffect(() => {
    if (!isVisible || !currentTutorialStep) return;

    const updatePosition = () => {
      if (currentTutorialStep.target) {
        const position = TutorialManager.getElementPosition(currentTutorialStep.target);
        setSpotlightPosition(position);
        
        if (position) {
          TutorialManager.scrollToElement(currentTutorialStep.target);
          TutorialManager.highlightElement(currentTutorialStep.target);
        }
      } else {
        setSpotlightPosition(null);
      }
    };

    // Delay to allow for DOM updates
    const timer = setTimeout(updatePosition, currentTutorialStep.delay || 500);
    return () => clearTimeout(timer);
  }, [currentStep, isVisible, currentTutorialStep]);

  // Clean up highlights when closing
  useEffect(() => {
    return () => {
      tutorialSteps.forEach(step => {
        if (step.target) {
          TutorialManager.removeHighlight(step.target);
        }
      });
    };
  }, []);

  const nextStep = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Remove highlight from current element
    if (currentTutorialStep.target) {
      TutorialManager.removeHighlight(currentTutorialStep.target);
    }

    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Special handling for settings button step
      if (tutorialSteps[currentStep + 1]?.id === 'settings-button') {
        // Wait a bit before opening settings to show the highlight first
        setTimeout(() => {
          onOpenSettings?.();
        }, 1000);
      }
    } else {
      // Tutorial completed
      handleComplete();
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevStep = () => {
    if (isAnimating || currentStep === 0) return;
    
    setIsAnimating(true);
    
    // Remove highlight from current element
    if (currentTutorialStep.target) {
      TutorialManager.removeHighlight(currentTutorialStep.target);
    }
    
    setCurrentStep(currentStep - 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const skipTutorial = () => {
    handleComplete();
  };

  const handleComplete = () => {
    // Remove all highlights
    tutorialSteps.forEach(step => {
      if (step.target) {
        TutorialManager.removeHighlight(step.target);
      }
    });
    
    TutorialManager.markTutorialCompleted();
    onClose();
  };

  if (!isVisible) return null;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;
  const isCenterStep = currentTutorialStep.position === 'center';

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Dark backdrop without blur to keep highlighted elements visible */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Spotlight cutout area - make the highlighted element area brighter */}
      {spotlightPosition && (
        <>
          {/* Create a clear "window" where the element can be seen without obstruction */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute pointer-events-none"
            style={{
              left: spotlightPosition.left - 15,
              top: spotlightPosition.top - 15,
              width: spotlightPosition.width + 30,
              height: spotlightPosition.height + 30,
              borderRadius: '16px',
              backgroundColor: 'transparent',
              border: '3px solid #7B61FF',
              boxShadow: `
                0 0 0 2px rgba(255, 255, 255, 0.8),
                0 0 30px #7B61FF,
                0 0 60px rgba(123, 97, 255, 0.8)
              `,
              zIndex: 10001
            }}
          />
          
          {/* Animated pulse border */}
          <motion.div
            animate={{ 
              opacity: [0.4, 1, 0.4],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
            className="absolute pointer-events-none"
            style={{
              left: spotlightPosition.left - 8,
              top: spotlightPosition.top - 8,
              width: spotlightPosition.width + 16,
              height: spotlightPosition.height + 16,
              borderRadius: '12px',
              border: '2px solid #7B61FF',
              backgroundColor: 'transparent',
              zIndex: 10000
            }}
          />
          
          {/* Expanding attention ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 0.8, 0], 
              scale: [0.8, 1.3, 1.6]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeOut"
            }}
            className="absolute pointer-events-none border-2 border-purple-400/60 rounded-2xl"
            style={{
              left: spotlightPosition.left - 20,
              top: spotlightPosition.top - 20,
              width: spotlightPosition.width + 40,
              height: spotlightPosition.height + 40,
              zIndex: 9999
            }}
          />
        </>
      )}

      {/* Tutorial content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`absolute ${getPositionClasses(currentTutorialStep.position, spotlightPosition)}`}
        >
          <div className="bg-glass-surface backdrop-blur-xl rounded-2xl border border-surface/30 shadow-2xl max-w-sm mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface/30">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary-accent/20 rounded-lg">
                  <Sparkles className="w-4 h-4 text-primary-accent" />
                </div>
                <span className="text-sm text-foreground-secondary">
                  {currentStep + 1} / {tutorialSteps.length}
                </span>
              </div>
              <button
                onClick={skipTutorial}
                className="p-2 hover:bg-surface/50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-foreground-secondary" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {currentTutorialStep.title}
              </h3>
              <p className="text-sm text-foreground-secondary leading-relaxed mb-6">
                {currentTutorialStep.description}
              </p>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-foreground-secondary">進行状況</span>
                  <span className="text-xs text-primary-accent">
                    {Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-surface/50 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-primary-accent h-2 rounded-full"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={isFirstStep}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isFirstStep
                      ? 'text-foreground-secondary cursor-not-allowed'
                      : 'text-foreground hover:bg-surface/50'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>戻る</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={skipTutorial}
                    className="flex items-center space-x-2 px-4 py-2 text-foreground-secondary hover:text-foreground rounded-lg transition-colors"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span>スキップ</span>
                  </button>

                  <motion.button
                    onClick={nextStep}
                    disabled={isAnimating}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-accent hover:bg-primary-accent/90 text-white rounded-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{isLastStep ? '完了' : '次へ'}</span>
                    {!isLastStep && <ArrowRight className="w-4 h-4" />}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function getPositionClasses(position: string, spotlightPosition: DOMRect | null): string {
  // ALWAYS center the tutorial modal regardless of position or sidebar state
  // This ensures consistent, predictable placement that's always visible
  return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
}