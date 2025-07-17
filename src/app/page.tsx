'use client';

import { useState, useEffect } from 'react';
import { useImageStore } from '@/store/imageStore';
import { DesignPicker } from '@/components/DesignPicker';
import { GenerateButton } from '@/components/GenerateButton';
import { ImageGallery } from '@/components/ImageGallery';
import { ProgressBar } from '@/components/ProgressBar';

export default function HomePage() {
  const { 
    currentDesignOptions, 
    setDesignOptions, 
    isGenerating,
    getRecentImages,
    images
  } = useImageStore();
  
  const [currentView, setCurrentView] = useState<'create' | 'gallery' | 'favorites'>('create');
  const [mounted, setMounted] = useState(false);
  const recentImages = getRecentImages(12);
  const { getFavoriteImages } = useImageStore();
  const favoriteImages = getFavoriteImages();
  
  // Prevent hydration mismatch by waiting for client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Auto-sync images from API on startup
  useEffect(() => {
    if (mounted) {
      syncImagesFromAPI();
    }
  }, [mounted]);

  // Auto-switch to gallery when there are images
  useEffect(() => {
    if (mounted && images.length > 0 && currentView === 'create') {
      // Optional: Auto-switch to gallery when first image is created
      // setCurrentView('gallery');
    }
  }, [mounted, images.length, currentView]);

  // Auto-sync function
  const syncImagesFromAPI = async () => {
    console.log('🔄 Auto-syncing images from API...');
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      
      if (data.tests?.authTest?.recentImages) {
        console.log('📊 Found', data.tests.authTest.recentImages.length, 'recent images');
        
        // Add recent images to store (avoid duplicates)
        data.tests.authTest.recentImages.forEach((img: any) => {
          if (img.status === 'completed' && img.url) {
            const existingImage = images.find(existing => existing.id === img.id);
            if (!existingImage) {
              useImageStore.getState().addImage({
                id: img.id,
                prompt: img.prompt || 'From API',
                status: img.status,
                imageUrl: img.url,
                upscaled_urls: img.upscaled_urls,
                progress: img.progress,
                timestamp: new Date(),
                designOptions: {
                  trend: null,
                  colorScheme: null,
                  mood: null,
                  season: 'spring'
                }
              });
            }
          }
        });
      }
    } catch (error) {
      console.error('❌ Failed to sync images:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Navigation */}
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">
              Open<span className="text-purple-400">Wardrobe</span>
            </h1>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-slate-800/30 rounded-lg p-1">
              <button 
                onClick={() => setCurrentView('create')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'create' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                🎨 作成
              </button>
              <button 
                onClick={() => setCurrentView('gallery')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                  currentView === 'gallery' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>🖼️ ギャラリー</span>
                {recentImages.length > 0 && (
                  <span className="bg-slate-600 text-xs px-2 py-0.5 rounded-full">
                    {recentImages.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setCurrentView('favorites')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                  currentView === 'favorites' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>⭐ お気に入り</span>
                {favoriteImages.length > 0 && (
                  <span className="bg-slate-600 text-xs px-2 py-0.5 rounded-full">
                    {favoriteImages.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Stats Summary */}
            {mounted && (
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-400">完成 {recentImages.filter(img => img.status === 'completed').length}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-400">生成中 {recentImages.filter(img => img.status === 'pending' || img.status === 'in-progress').length}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span className="text-gray-400">お気に入り {favoriteImages.length}</span>
                </div>
              </div>
            )}
            
            <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
              <span className="text-lg">⚙️</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Create View */}
        {currentView === 'create' && (
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">AIファッションデザイン生成</h2>
              <p className="text-gray-400">最新のAI技術でユニークなファッションデザインを生成します</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Panel - Design Controls */}
              <div className="xl:col-span-1 space-y-6">
                {/* Design Options */}
                <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/30">
                  <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                    <span className="text-purple-400">✨</span>
                    <span>デザイン設定</span>
                  </h3>
                  <DesignPicker 
                    value={currentDesignOptions}
                    onChange={setDesignOptions}
                  />
                </div>

                {/* Generate Section */}
                <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/30">
                  <GenerateButton 
                    designOptions={currentDesignOptions}
                    disabled={isGenerating}
                  />
                </div>

                {/* Progress Section */}
                {isGenerating && (
                  <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/30">
                    <ProgressBar />
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/30">
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <span className="text-blue-400">⚡</span>
                    <span>クイック操作</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={async () => {
                        await syncImagesFromAPI();
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-xl hover:bg-blue-600/30 transition-all"
                    >
                      <span>🔄</span>
                      <span>同期</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        const { clearImages } = useImageStore.getState();
                        clearImages();
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600/20 border border-red-500/30 text-red-300 rounded-xl hover:bg-red-600/30 transition-all"
                    >
                      <span>🗑️</span>
                      <span>全削除</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Panel - Recent Images */}
              <div className="xl:col-span-2">
                <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold flex items-center space-x-2">
                      <span className="text-green-400">🎨</span>
                      <span>最近のデザイン</span>
                    </h3>
                    <span className="text-sm text-gray-400 bg-slate-800/50 px-3 py-1 rounded-full">
                      {recentImages.length > 0 ? `${recentImages.length}件のデザイン` : 'デザインがありません'}
                    </span>
                  </div>
                  
                  {recentImages.length > 0 ? (
                    <ImageGallery images={recentImages} />
                  ) : (
                    <div className="text-center py-16">
                      <div className="text-8xl mb-6 opacity-50">🎨</div>
                      <h3 className="text-2xl font-semibold mb-3 text-gray-300">まだデザインがありません</h3>
                      <p className="text-gray-500 max-w-md mx-auto">左側のパネルからデザイン設定を選択し、最初のファッションデザインを生成してみましょう！</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery View */}
        {currentView === 'gallery' && (
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">デザインギャラリー</h2>
              <p className="text-gray-400">作成されたすべてのデザインを閲覧できます</p>
            </div>
            
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center space-x-2">
                  <span className="text-blue-400">🖼️</span>
                  <span>すべてのデザイン</span>
                </h3>
                <span className="text-sm text-gray-400 bg-slate-800/50 px-3 py-1 rounded-full">
                  {recentImages.length}件のデザイン
                </span>
              </div>
              
              {recentImages.length > 0 ? (
                <ImageGallery images={recentImages} />
              ) : (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6 opacity-50">🖼️</div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-300">ギャラリーが空です</h3>
                  <p className="text-gray-500 max-w-md mx-auto">作成ページでデザインを生成してみましょう！</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Favorites View */}
        {currentView === 'favorites' && (
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">お気に入りデザイン</h2>
              <p className="text-gray-400">お気に入りに追加したデザインのコレクション</p>
            </div>
            
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center space-x-2">
                  <span className="text-pink-400">⭐</span>
                  <span>お気に入りのデザイン</span>
                </h3>
                <span className="text-sm text-gray-400 bg-slate-800/50 px-3 py-1 rounded-full">
                  {favoriteImages.length}件のお気に入り
                </span>
              </div>
              
              {favoriteImages.length > 0 ? (
                <ImageGallery images={favoriteImages} />
              ) : (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6 opacity-50">⭐</div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-300">お気に入りがありません</h3>
                  <p className="text-gray-500 max-w-md mx-auto">気に入ったデザインをお気に入りに追加してみましょう！</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}