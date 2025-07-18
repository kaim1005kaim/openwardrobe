'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Send, Sparkles } from 'lucide-react';

interface PromptBarProps {
  onSubmit: (prompt: string) => void;
  onToggleDrawer: () => void;
  isGenerating: boolean;
}

export function PromptBar({ onSubmit, onToggleDrawer, isGenerating }: PromptBarProps) {
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (prompt.trim() && !isGenerating) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        handleSubmit();
      }
    }
    // ESC to unfocus
    if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Glass container */}
        <motion.div
          className={`relative bg-glass-surface backdrop-blur-xl rounded-2xl border transition-all duration-250 ${
            isFocused 
              ? 'border-primary-accent shadow-2xl shadow-primary-accent/20' 
              : 'border-surface/50 shadow-xl shadow-black/20'
          }`}
          animate={{
            scale: isFocused ? 1.02 : 1,
            boxShadow: isFocused 
              ? '0 25px 50px -12px rgba(123, 97, 255, 0.25)' 
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-end gap-4 p-6">
            {/* Settings trigger */}
            <motion.button
              onClick={onToggleDrawer}
              className="flex-shrink-0 p-3 rounded-xl bg-surface/50 hover:bg-surface/80 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SlidersHorizontal className="w-5 h-5 text-foreground-secondary" />
            </motion.button>

            {/* Prompt input */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder=""
                className="w-full bg-transparent text-foreground placeholder-transparent resize-none border-none outline-none text-body leading-relaxed min-h-[60px] max-h-[120px] py-4"
                rows={1}
                style={{ 
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontFeatureSettings: '"cv02", "cv03", "cv04"'
                }}
              />
              
              {/* Placeholder enhancement */}
              <AnimatePresence>
                {!prompt && !isFocused && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 left-0 pointer-events-none"
                  >
                    <div className="flex items-center gap-2 text-foreground-secondary">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-body">アイデアを教えてください...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit button */}
            <motion.button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isGenerating}
              className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
                prompt.trim() && !isGenerating
                  ? 'bg-primary-accent hover:bg-primary-accent/90 text-white shadow-lg shadow-primary-accent/30'
                  : 'bg-surface/50 text-foreground-secondary cursor-not-allowed'
              }`}
              whileHover={prompt.trim() && !isGenerating ? { scale: 1.05 } : {}}
              whileTap={prompt.trim() && !isGenerating ? { scale: 0.95 } : {}}
            >
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="animate-spin"
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="send"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Send className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Keyboard shortcut hint */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="px-6 pb-4"
              >
                <div className="text-caption text-foreground-secondary">
                  <kbd className="px-2 py-1 bg-surface/50 rounded text-xs">⌘</kbd>
                  <span className="mx-1">+</span>
                  <kbd className="px-2 py-1 bg-surface/50 rounded text-xs">Enter</kbd>
                  <span className="ml-2">で送信</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}