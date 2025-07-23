import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageEditService, VaryOptions, BlendOptions } from '@/lib/imageEditService';
import { GeneratedImage } from '@/lib/types';

interface ImageEditPanelProps {
  image: GeneratedImage;
  onEditStart?: (operation: string, jobId: string) => void;
  onDescribe?: (descriptions: string[]) => void;
  className?: string;
}

interface EditOperation {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  estimatedTime: string;
}

export function ImageEditPanel({ 
  image, 
  onEditStart, 
  onDescribe,
  className = '' 
}: ImageEditPanelProps) {
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Variation settings
  const [variationType, setVariationType] = useState<'subtle' | 'strong'>('subtle');
  const [varyPrompt, setVaryPrompt] = useState('');
  
  // Blend settings
  const [blendImages, setBlendImages] = useState<string[]>([image.imageUrl || '']);
  const [blendWeights, setBlendWeights] = useState<number[]>([1]);
  const [blendPrompt, setBlendPrompt] = useState('');

  const operations: EditOperation[] = [
    {
      id: 'vary',
      name: 'バリエーション',
      description: '現在の画像をベースに新しいバリエーションを生成',
      estimatedTime: ImageEditService.getEstimatedProcessingTime('vary'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      id: 'blend',
      name: 'ブレンド',
      description: '複数の画像を組み合わせて新しい画像を作成',
      estimatedTime: ImageEditService.getEstimatedProcessingTime('blend'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    },
    {
      id: 'describe',
      name: 'プロンプト生成',
      description: '画像を解析してプロンプトを自動生成',
      estimatedTime: ImageEditService.getEstimatedProcessingTime('describe'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  const handleOperationSelect = (operationId: string) => {
    if (activeOperation === operationId) {
      setActiveOperation(null);
    } else {
      setActiveOperation(operationId);
      setError(null);
    }
  };

  const handleVarySubmit = async () => {
    if (!image.imageUrl) {
      setError('画像URLが見つかりません');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const options: VaryOptions = {
        imageUrl: image.imageUrl,
        variationType,
        prompt: varyPrompt.trim() || undefined
      };

      const result = await ImageEditService.createVariation(options);
      
      if (result.success) {
        onEditStart?.('vary', result.jobId);
        setActiveOperation(null);
        setVaryPrompt('');
      } else {
        setError('バリエーション生成に失敗しました');
      }
    } catch (err) {
      console.error('Variation error:', err);
      setError(err instanceof Error ? err.message : 'バリエーション生成に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBlendSubmit = async () => {
    const validImages = blendImages.filter(url => url && ImageEditService.isValidImageUrl(url));
    
    if (validImages.length < 2) {
      setError('最低2枚の有効な画像URLが必要です');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const options: BlendOptions = {
        imageUrls: validImages,
        weights: blendWeights.length === validImages.length ? blendWeights : undefined,
        prompt: blendPrompt.trim() || undefined
      };

      const result = await ImageEditService.blendImages(options);
      
      if (result.success) {
        onEditStart?.('blend', result.jobId);
        setActiveOperation(null);
        setBlendPrompt('');
      } else {
        setError('ブレンド生成に失敗しました');
      }
    } catch (err) {
      console.error('Blend error:', err);
      setError(err instanceof Error ? err.message : 'ブレンド生成に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDescribeSubmit = async () => {
    if (!image.imageUrl) {
      setError('画像URLが見つかりません');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await ImageEditService.describeImage(image.imageUrl, 'ja');
      
      if (result.descriptions.length > 0) {
        onDescribe?.(result.descriptions);
        setActiveOperation(null);
      } else {
        setError('プロンプトを生成できませんでした');
      }
    } catch (err) {
      console.error('Describe error:', err);
      setError(err instanceof Error ? err.message : 'プロンプト生成に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  const addBlendImage = () => {
    setBlendImages([...blendImages, '']);
    setBlendWeights([...blendWeights, 0]);
  };

  const removeBlendImage = (index: number) => {
    const newImages = blendImages.filter((_, i) => i !== index);
    const newWeights = blendWeights.filter((_, i) => i !== index);
    setBlendImages(newImages);
    setBlendWeights(newWeights);
  };

  const updateBlendImage = (index: number, url: string) => {
    const newImages = [...blendImages];
    newImages[index] = url;
    setBlendImages(newImages);
  };

  const updateBlendWeight = (index: number, weight: number) => {
    const newWeights = [...blendWeights];
    newWeights[index] = Math.max(0, Math.min(1, weight));
    setBlendWeights(newWeights);
  };

  const normalizeWeights = () => {
    const sum = blendWeights.reduce((a, b) => a + b, 0);
    if (sum > 0) {
      setBlendWeights(blendWeights.map(w => w / sum));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <h3 className="text-lg font-semibold text-gray-900">画像編集</h3>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Operation Buttons */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {operations.map((operation) => (
          <motion.button
            key={operation.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOperationSelect(operation.id)}
            disabled={isProcessing}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200 text-left
              ${activeOperation === operation.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                activeOperation === operation.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {operation.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{operation.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{operation.description}</p>
                <span className="text-xs text-gray-500">処理時間: {operation.estimatedTime}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Operation Details */}
      <AnimatePresence mode="wait">
        {activeOperation === 'vary' && (
          <motion.div
            key="vary"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 pt-6"
          >
            <h4 className="font-medium text-gray-900 mb-4">バリエーション設定</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  変更の強度
                </label>
                <div className="flex space-x-4">
                  {(['subtle', 'strong'] as const).map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="variationType"
                        value={type}
                        checked={variationType === type}
                        onChange={(e) => setVariationType(e.target.value as 'subtle' | 'strong')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        {ImageEditService.getVariationTypeLabel(type)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  追加プロンプト（オプション）
                </label>
                <textarea
                  value={varyPrompt}
                  onChange={(e) => setVaryPrompt(e.target.value)}
                  placeholder="特定の変更を指示したい場合は入力してください..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVarySubmit}
                disabled={isProcessing}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>処理中...</span>
                  </>
                ) : (
                  <>
                    <span>バリエーション生成</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {activeOperation === 'blend' && (
          <motion.div
            key="blend"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 pt-6"
          >
            <h4 className="font-medium text-gray-900 mb-4">ブレンド設定</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  画像URL（最大5枚）
                </label>
                <div className="space-y-2">
                  {blendImages.map((url, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateBlendImage(index, e.target.value)}
                        placeholder="画像URLを入力..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={blendWeights[index] || 0}
                        onChange={(e) => updateBlendWeight(index, parseFloat(e.target.value) || 0)}
                        min="0"
                        max="1"
                        step="0.1"
                        className="w-16 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {blendImages.length > 2 && (
                        <button
                          onClick={() => removeBlendImage(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between mt-2">
                  {blendImages.length < 5 && (
                    <button
                      onClick={addBlendImage}
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      + 画像を追加
                    </button>
                  )}
                  <button
                    onClick={normalizeWeights}
                    className="text-sm text-gray-500 hover:text-gray-600"
                  >
                    ウェイトを正規化
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  追加プロンプト（オプション）
                </label>
                <textarea
                  value={blendPrompt}
                  onChange={(e) => setBlendPrompt(e.target.value)}
                  placeholder="ブレンド結果に対する指示があれば入力してください..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBlendSubmit}
                disabled={isProcessing}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>処理中...</span>
                  </>
                ) : (
                  <>
                    <span>ブレンド生成</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {activeOperation === 'describe' && (
          <motion.div
            key="describe"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 pt-6"
          >
            <h4 className="font-medium text-gray-900 mb-4">プロンプト生成</h4>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                この画像を解析して、類似の画像を生成するためのプロンプトを自動生成します。
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDescribeSubmit}
                disabled={isProcessing}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>解析中...</span>
                  </>
                ) : (
                  <>
                    <span>プロンプト生成</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}