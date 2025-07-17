'use client';

import { useState } from 'react';
import { Palette, Sparkles, Heart, Sun, Snowflake, Leaf, Flower2 } from 'lucide-react';
import { DesignOptions, TrendType, ColorSchemeType, MoodType, SeasonType } from '@/lib/types';

interface DesignPickerProps {
  value: DesignOptions;
  onChange: (options: DesignOptions) => void;
}

export function DesignPicker({ value, onChange }: DesignPickerProps) {
  const [activeTab, setActiveTab] = useState<'trend' | 'color' | 'mood' | 'season'>('trend');

  const trends: { id: TrendType; name: string; description: string; icon: string }[] = [
    { id: 'minimalist', name: 'Minimalist', description: 'Clean lines, simple silhouettes', icon: '⚪' },
    { id: 'y2k', name: 'Y2K', description: 'Futuristic, metallic, bold', icon: '🔮' },
    { id: 'cottage-core', name: 'Cottage Core', description: 'Romantic, floral, vintage', icon: '🌸' },
    { id: 'tech-wear', name: 'Tech Wear', description: 'Functional, urban, modern', icon: '⚡' },
    { id: 'vintage', name: 'Vintage', description: 'Retro, classic, timeless', icon: '📻' },
    { id: 'bohemian', name: 'Bohemian', description: 'Free-flowing, artistic, ethnic', icon: '🌙' },
    { id: 'streetwear', name: 'Streetwear', description: 'Urban, oversized, casual', icon: '🏙️' },
    { id: 'preppy', name: 'Preppy', description: 'Classic, polished, traditional', icon: '👔' }
  ];

  const colorSchemes: { id: ColorSchemeType; name: string; colors: string[]; description: string }[] = [
    { id: 'monochrome', name: 'Monochrome', colors: ['#000000', '#808080', '#FFFFFF'], description: 'Black, white, gray' },
    { id: 'pastel', name: 'Pastel', colors: ['#FFB6C1', '#E6E6FA', '#98FB98'], description: 'Soft, gentle hues' },
    { id: 'vivid', name: 'Vivid', colors: ['#FF1493', '#00BFFF', '#32CD32'], description: 'Bright, bold colors' },
    { id: 'earth-tone', name: 'Earth Tone', colors: ['#8B4513', '#808000', '#F4A460'], description: 'Natural, warm colors' },
    { id: 'jewel-tone', name: 'Jewel Tone', colors: ['#50C878', '#4169E1', '#DC143C'], description: 'Rich, luxurious colors' },
    { id: 'neon', name: 'Neon', colors: ['#39FF14', '#FF073A', '#00FFFF'], description: 'Electric, glowing colors' },
    { id: 'muted', name: 'Muted', colors: ['#D2B48C', '#9ACD32', '#708090'], description: 'Subtle, understated' }
  ];

  const moods: { id: MoodType; name: string; description: string; icon: string }[] = [
    { id: 'casual', name: 'Casual', description: 'Relaxed, everyday wear', icon: '👕' },
    { id: 'formal', name: 'Formal', description: 'Elegant, sophisticated', icon: '👗' },
    { id: 'edgy', name: 'Edgy', description: 'Bold, unconventional', icon: '🗲' },
    { id: 'romantic', name: 'Romantic', description: 'Soft, feminine, dreamy', icon: '💕' },
    { id: 'professional', name: 'Professional', description: 'Business-appropriate', icon: '💼' },
    { id: 'playful', name: 'Playful', description: 'Fun, whimsical, youthful', icon: '🎈' },
    { id: 'sophisticated', name: 'Sophisticated', description: 'Refined, mature elegance', icon: '🥂' }
  ];

  const seasons: { id: SeasonType; name: string; description: string; icon: React.ReactNode }[] = [
    { id: 'spring', name: 'Spring', description: 'Fresh, light, blooming', icon: <Flower2 className="w-5 h-5" /> },
    { id: 'summer', name: 'Summer', description: 'Bright, airy, sun-ready', icon: <Sun className="w-5 h-5" /> },
    { id: 'autumn', name: 'Autumn', description: 'Warm, rich, cozy', icon: <Leaf className="w-5 h-5" /> },
    { id: 'winter', name: 'Winter', description: 'Deep, warm, protective', icon: <Snowflake className="w-5 h-5" /> }
  ];

  const handleSelection = (type: keyof DesignOptions, value: any) => {
    onChange({
      ...value,
      [type]: value[type] === value ? null : value // Toggle selection
    });
  };

  const isSelected = (type: keyof DesignOptions, id: any) => {
    return value[type] === id;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex flex-col space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          {[
            { id: 'trend', label: 'Trend', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'color', label: 'Color', icon: <Palette className="w-4 h-4" /> },
            { id: 'mood', label: 'Mood', icon: <Heart className="w-4 h-4" /> },
            { id: 'season', label: 'Season', icon: <Sun className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Trend Selection */}
        {activeTab === 'trend' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Choose a Trend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {trends.map((trend) => (
                <button
                  key={trend.id}
                  onClick={() => handleSelection('trend', trend.id)}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    isSelected('trend', trend.id)
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{trend.icon}</div>
                  <div className="font-medium text-gray-900 dark:text-white">{trend.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{trend.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Scheme Selection */}
        {activeTab === 'color' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Choose a Color Scheme</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => handleSelection('colorScheme', scheme.id)}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    isSelected('colorScheme', scheme.id)
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex space-x-1 mb-2">
                    {scheme.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white">{scheme.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{scheme.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mood Selection */}
        {activeTab === 'mood' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Choose a Mood</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleSelection('mood', mood.id)}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    isSelected('mood', mood.id)
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{mood.icon}</div>
                  <div className="font-medium text-gray-900 dark:text-white">{mood.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{mood.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Season Selection */}
        {activeTab === 'season' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Choose a Season</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {seasons.map((season) => (
                <button
                  key={season.id}
                  onClick={() => handleSelection('season', season.id)}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    isSelected('season', season.id)
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="mb-2 text-purple-600 dark:text-purple-400">{season.icon}</div>
                  <div className="font-medium text-gray-900 dark:text-white">{season.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{season.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Current Selection:</h4>
          <div className="flex flex-wrap gap-2 text-sm">
            {value.trend && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                {trends.find(t => t.id === value.trend)?.name}
              </span>
            )}
            {value.colorScheme && (
              <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded">
                {colorSchemes.find(c => c.id === value.colorScheme)?.name}
              </span>
            )}
            {value.mood && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                {moods.find(m => m.id === value.mood)?.name}
              </span>
            )}
            {value.season && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                {seasons.find(s => s.id === value.season)?.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}