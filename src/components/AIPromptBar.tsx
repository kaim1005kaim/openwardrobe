'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Send, Sparkles, Wand2, TrendingUp, MessageSquare, Loader2 } from 'lucide-react';
import { TrendCache } from '@/lib/trendCache';
import { useImageStore } from '@/store/imageStore';

interface AIPromptBarProps {
  onSubmit: (prompt: string) => void;
  onToggleDrawer: () => void;
  isGenerating: boolean;
}

export function AIPromptBar({ onSubmit, onToggleDrawer, isGenerating }: AIPromptBarProps) {
  const [prompt, setPrompt] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [trends, setTrends] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { images, currentDesignOptions } = useImageStore();

  // Load trends on mount
  useEffect(() => {
    loadTrends();
  }, []);

  // Generate suggestions as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      if (prompt.length > 10) {
        generateSuggestions();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [prompt]);

  const loadTrends = async () => {
    const trendList = await TrendCache.getTrends();
    setTrends(trendList);
  };

  const generateSuggestions = async () => {
    try {
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggestions',
          userInput: prompt
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.result || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    }
  };

  const enhanceWithAI = async () => {
    if (!prompt.trim() || isEnhancing) return;

    setIsEnhancing(true);
    setShowAIPanel(true);

    try {
      // Get user preferences from history
      const recentPrompts = images.slice(0, 10).map(img => img.prompt);
      let userPreferences = '';
      
      if (recentPrompts.length >= 3) {
        const prefResponse = await fetch('/api/deepseek', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'analyze',
            promptHistory: recentPrompts
          })
        });

        if (prefResponse.ok) {
          const prefData = await prefResponse.json();
          userPreferences = prefData.result;
        }
      }

      // Enhance the prompt
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enhance',
          userInput: prompt,
          designOptions: currentDesignOptions,
          userPreferences
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiPrompt(data.result);
      }
    } catch (error) {
      console.error('Failed to enhance prompt:', error);
      setAiPrompt(prompt); // Fallback to original
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = () => {
    const finalPrompt = aiPrompt || prompt;
    if (finalPrompt.trim() && !isGenerating) {
      onSubmit(finalPrompt.trim());
      setPrompt('');
      setAiPrompt('');
      setShowAIPanel(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    setShowSuggestions(false);
    enhanceWithAI();
  };

  const handleTrendClick = (trend: string) => {
    setPrompt(prev => prev ? `${prev}, ${trend}` : trend);
  };

  const refinePrompt = async (feedback: string) => {
    if (!aiPrompt || isEnhancing) return;

    setIsEnhancing(true);
    try {
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'refine',
          currentPrompt: aiPrompt,
          userFeedback: feedback
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiPrompt(data.result);
      }
    } catch (error) {
      console.error('Failed to refine prompt:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        if (aiPrompt) {
          handleSubmit();
        } else {
          enhanceWithAI();
        }
      }
    }
    if (e.key === 'Escape') {
      inputRef.current?.blur();
      setShowSuggestions(false);
      setShowAIPanel(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 p-8"
    >
      {/* AI Enhancement Panel */}
      <AnimatePresence>
        {showAIPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="max-w-4xl mx-auto mb-4"
          >
            <div className="bg-glass-surface backdrop-blur-xl rounded-2xl border border-surface/30 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary-accent" />
                  <h3 className="text-lg font-semibold text-foreground">AI 強化プロンプト</h3>
                </div>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="text-foreground-secondary hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {isEnhancing ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-primary-accent animate-spin" />
                </div>
              ) : aiPrompt ? (
                <>
                  <div className="bg-surface/30 rounded-xl p-4 mb-4">
                    <p className="text-foreground text-sm leading-relaxed">{aiPrompt}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-primary-accent hover:bg-primary-accent/90 text-white rounded-xl transition-all duration-200"
                    >
                      <Send className="w-4 h-4" />
                      <span>このプロンプトで生成</span>
                    </button>
                    <button
                      onClick={() => refinePrompt('もっとエレガントに')}
                      className="px-4 py-3 bg-surface/50 hover:bg-surface/70 text-foreground-secondary rounded-xl transition-all duration-200"
                    >
                      エレガント
                    </button>
                    <button
                      onClick={() => refinePrompt('もっとカジュアルに')}
                      className="px-4 py-3 bg-surface/50 hover:bg-surface/70 text-foreground-secondary rounded-xl transition-all duration-200"
                    >
                      カジュアル
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions Panel */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="max-w-4xl mx-auto mb-4"
          >
            <div className="bg-glass-surface backdrop-blur-xl rounded-2xl border border-surface/30 p-4">
              <h4 className="text-sm font-medium text-foreground-secondary mb-3">スタイル提案</h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 bg-surface/50 hover:bg-surface/70 text-foreground-secondary rounded-lg transition-all duration-200 text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trend Pills */}
      {trends.length > 0 && !showAIPanel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto mb-4"
        >
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            <div className="flex items-center space-x-2 text-foreground-secondary flex-shrink-0">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">トレンド:</span>
            </div>
            <div className="flex space-x-2">
              {trends.map((trend, index) => (
                <button
                  key={index}
                  onClick={() => handleTrendClick(trend)}
                  className="px-3 py-1 bg-surface/30 hover:bg-surface/50 text-foreground-secondary rounded-full transition-all duration-200 text-sm whitespace-nowrap"
                >
                  {trend}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main prompt bar */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          className={`relative bg-glass-surface backdrop-blur-xl rounded-2xl border transition-all duration-250 ${
            isFocused 
              ? 'border-primary-accent shadow-2xl shadow-primary-accent/20' 
              : 'border-surface/50 shadow-xl shadow-black/20'
          }`}
          animate={{
            scale: isFocused ? 1.02 : 1,
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

            {/* AI enhance button */}
            <motion.button
              onClick={enhanceWithAI}
              disabled={!prompt.trim() || isEnhancing}
              className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
                prompt.trim() && !isEnhancing
                  ? 'bg-primary-accent/20 hover:bg-primary-accent/30 text-primary-accent'
                  : 'bg-surface/50 text-foreground-secondary cursor-not-allowed'
              }`}
              whileHover={prompt.trim() && !isEnhancing ? { scale: 1.05 } : {}}
              whileTap={prompt.trim() && !isEnhancing ? { scale: 0.95 } : {}}
            >
              {isEnhancing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
            </motion.button>

            {/* Submit button */}
            <motion.button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isGenerating}
              className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
                (aiPrompt || prompt.trim()) && !isGenerating
                  ? 'bg-primary-accent hover:bg-primary-accent/90 text-white shadow-lg shadow-primary-accent/30'
                  : 'bg-surface/50 text-foreground-secondary cursor-not-allowed'
              }`}
              whileHover={(aiPrompt || prompt.trim()) && !isGenerating ? { scale: 1.05 } : {}}
              whileTap={(aiPrompt || prompt.trim()) && !isGenerating ? { scale: 0.95 } : {}}
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
                  <span className="ml-2">で{aiPrompt ? '生成' : 'AI強化'}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}