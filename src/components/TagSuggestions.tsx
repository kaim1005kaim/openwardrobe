import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TagAssistService, 
  TagSuggestion as TagSuggestionType, 
  AssistResponse 
} from '@/lib/tagAssistService';
import { DesignOptions } from '@/lib/types';

interface TagSuggestionsProps {
  userInput: string;
  currentOptions: DesignOptions;
  onApplyTag: (type: string, value: string) => void;
  onApplyAllSuggestions: (options: Partial<DesignOptions>) => void;
  onGenerate?: () => void;
  className?: string;
}

interface TagSuggestionItemProps {
  suggestion: TagSuggestionType;
  onApply: (type: string, value: string) => void;
  disabled: boolean;
}

export function TagSuggestions({
  userInput,
  currentOptions,
  onApplyTag,
  onApplyAllSuggestions,
  onGenerate,
  className = ''
}: TagSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<TagSuggestionType[]>([]);
  const [userIntent, setUserIntent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedTags, setAppliedTags] = useState<Set<string>>(new Set());
  const [showGenerateButton, setShowGenerateButton] = useState(false);

  React.useEffect(() => {
    if (userInput.trim()) {
      loadSuggestions();
    } else {
      setSuggestions([]);
      setUserIntent('');
      setError(null);
    }
  }, [userInput, JSON.stringify(currentOptions)]);

  const loadSuggestions = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result: AssistResponse = await TagAssistService.getSuggestions(
        userInput,
        currentOptions,
        { maxSuggestions: 6 }
      );

      console.log('[TagSuggestions] Result from API:', result);

      // Filter out suggestions for already selected categories
      console.log('[TagSuggestions] Current options:', currentOptions);
      console.log('[TagSuggestions] All suggestions before filter:', result.suggestions);
      
      const validSuggestions = result.suggestions.filter(suggestion => {
        const isValid = TagAssistService.isValidSuggestion(suggestion, currentOptions);
        console.log(`[TagSuggestions] Suggestion ${suggestion.type}:${suggestion.value} - isValid: ${isValid}`);
        return isValid;
      });

      console.log('[TagSuggestions] Valid suggestions after filter:', validSuggestions);

      setSuggestions(validSuggestions);
      setUserIntent(result.userIntent);
      
      // Reset applied tags when loading new suggestions
      if (validSuggestions.length > 0) {
        setAppliedTags(new Set());
        setShowGenerateButton(false);
      }
    } catch (err) {
      console.error('Failed to load suggestions:', err);
      // Don't show error message if we have no suggestions
      // The API should have returned fallback suggestions
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAllHighConfidence = () => {
    const highConfidenceSuggestions = suggestions.filter(s => s.confidence > 0.7);
    const updatedOptions = TagAssistService.applySuggestions(
      currentOptions,
      highConfidenceSuggestions,
      0.7
    );
    onApplyAllSuggestions(updatedOptions);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-700 border-green-200';
    if (confidence >= 0.6) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return '高い信頼度';
    if (confidence >= 0.6) return '中程度の信頼度';
    return '低い信頼度';
  };

  if (!userInput.trim()) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border border-gray-300 shadow-sm p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary-accent rounded-full"></div>
          <h3 className="text-sm font-semibold text-gray-900">AIタグ提案</h3>
        </div>
        
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="w-3 h-3 border border-primary-accent border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-medium">分析中...</span>
          </div>
        )}
      </div>

      {/* User Intent */}
      {userIntent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-100 rounded-lg p-3 mb-4 border border-gray-200"
        >
          <p className="text-xs text-gray-600 mb-1 font-medium">解釈:</p>
          <p className="text-sm text-gray-800 font-medium">{userIntent}</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-16 w-full"></div>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      <AnimatePresence mode="popLayout">
        {!isLoading && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {/* Apply All Button */}
            {suggestions.some(s => s.confidence > 0.7) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-end mb-3"
              >
                <button
                  onClick={handleApplyAllHighConfidence}
                  className="text-xs bg-primary-accent text-white px-3 py-1.5 rounded-full hover:bg-primary-accent/90 transition-colors"
                >
                  高信頼度の提案をすべて適用
                </button>
              </motion.div>
            )}

            {/* Suggestion Items */}
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={`${suggestion.type}-${suggestion.value}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TagSuggestionItem
                  suggestion={suggestion}
                  onApply={(type, value) => {
                    onApplyTag(type, value);
                    const tagKey = `${type}:${value}`;
                    const newAppliedTags = new Set(appliedTags);
                    newAppliedTags.add(tagKey);
                    setAppliedTags(newAppliedTags);
                    setShowGenerateButton(true);
                  }}
                  disabled={false}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isLoading && !error && suggestions.length === 0 && userInput.trim() && (
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 font-medium">このリクエストに適用可能な提案が見つかりませんでした</p>
        </div>
      )}

      {/* Generate Button */}
      {(showGenerateButton || appliedTags.size > 0) && onGenerate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onGenerate();
              setShowGenerateButton(false);
              setAppliedTags(new Set());
            }}
            className="px-6 py-3 bg-primary-accent hover:bg-primary-accent/90 text-white font-medium rounded-xl shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>このタグで生成</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

function TagSuggestionItem({ 
  suggestion, 
  onApply, 
  disabled 
}: TagSuggestionItemProps) {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    if (disabled || isApplying) return;

    setIsApplying(true);
    try {
      onApply(suggestion.type, suggestion.value);
    } finally {
      setTimeout(() => setIsApplying(false), 500);
    }
  };

  const confidenceColor = getConfidenceColor(suggestion.confidence);
  const confidenceText = getConfidenceText(suggestion.confidence);

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        border border-gray-300 rounded-lg p-4 cursor-pointer transition-all duration-200 bg-white
        ${disabled 
          ? 'opacity-50 cursor-not-allowed bg-gray-50' 
          : 'hover:border-primary-accent hover:shadow-md'
        }
        ${isApplying ? 'bg-blue-50 border-primary-accent' : ''}
      `}
      onClick={handleApply}
    >
      <div className="flex items-start justify-between">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 font-medium rounded-full border border-gray-200">
              {TagAssistService.getTagTypeLabel(suggestion.type)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full border font-medium ${confidenceColor}`}>
              {confidenceText}
            </span>
          </div>
          
          <h4 className="font-semibold text-gray-900 mb-1">
            {TagAssistService.getTagValueLabel(suggestion.type, suggestion.value)}
          </h4>
          
          <p className="text-sm text-gray-600">
            {suggestion.reason}
          </p>
        </div>

        {/* Apply Button / Status */}
        <div className="ml-4 flex items-center">
          {isApplying ? (
            <div className="w-5 h-5 border-2 border-primary-accent border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-6 h-6 bg-primary-accent text-white rounded-full flex items-center justify-center shadow-sm"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </motion.div>
          )}
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mt-3 bg-gray-200 rounded-full h-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${suggestion.confidence * 100}%` }}
          className="h-full bg-primary-accent rounded-full"
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

// Helper functions (same as in TagAssistService but repeated for performance)
function getConfidenceColor(confidence: number) {
  if (confidence >= 0.8) return 'bg-green-100 text-green-700 border-green-200';
  if (confidence >= 0.6) return 'bg-blue-100 text-blue-700 border-blue-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
}

function getConfidenceText(confidence: number) {
  if (confidence >= 0.8) return '高い信頼度';
  if (confidence >= 0.6) return '中程度の信頼度';
  return '低い信頼度';
}