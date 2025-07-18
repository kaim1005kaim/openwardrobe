interface TrendData {
  trends: string[];
  season: string;
  year: number;
  fetchedAt: Date;
  expiresAt: Date;
}

export class TrendCache {
  private static readonly CACHE_KEY = 'fashion_trends_cache';
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get cached trends or fetch new ones
   */
  static async getTrends(season?: string, year?: number): Promise<string[]> {
    const currentSeason = season || this.getCurrentSeason();
    const currentYear = year || new Date().getFullYear();
    
    // Check cache first
    const cached = this.getCachedTrends(currentSeason, currentYear);
    if (cached) {
      return cached.trends;
    }

    // Fetch new trends
    try {
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'trends',
          season: currentSeason,
          year: currentYear
        })
      });

      if (!response.ok) throw new Error('Failed to fetch trends');

      const data = await response.json();
      const trends = data.result || [];

      // Cache the results
      this.cacheTrends(trends, currentSeason, currentYear);
      
      return trends;
    } catch (error) {
      console.error('Failed to fetch trends:', error);
      // Return default trends on error
      return this.getDefaultTrends(currentSeason);
    }
  }

  /**
   * Get cached trends if valid
   */
  private static getCachedTrends(season: string, year: number): TrendData | null {
    if (typeof window === 'undefined') return null;

    const cacheKey = `${this.CACHE_KEY}_${season}_${year}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;

    try {
      const data: TrendData = JSON.parse(cached);
      const now = new Date();
      
      if (new Date(data.expiresAt) > now) {
        return data;
      }
      
      // Clean expired cache
      localStorage.removeItem(cacheKey);
      return null;
    } catch (error) {
      console.error('Failed to parse cached trends:', error);
      localStorage.removeItem(cacheKey);
      return null;
    }
  }

  /**
   * Cache trends
   */
  private static cacheTrends(trends: string[], season: string, year: number): void {
    if (typeof window === 'undefined') return;

    const now = new Date();
    const data: TrendData = {
      trends,
      season,
      year,
      fetchedAt: now,
      expiresAt: new Date(now.getTime() + this.CACHE_DURATION)
    };

    const cacheKey = `${this.CACHE_KEY}_${season}_${year}`;
    localStorage.setItem(cacheKey, JSON.stringify(data));
  }

  /**
   * Get current season
   */
  private static getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  /**
   * Get default trends by season
   */
  private static getDefaultTrends(season: string): string[] {
    const defaultTrends: Record<string, string[]> = {
      spring: [
        'floral prints',
        'pastel colors',
        'lightweight layers',
        'romantic details',
        'sustainable materials'
      ],
      summer: [
        'bold prints',
        'breathable fabrics',
        'minimalist designs',
        'vibrant colors',
        'resort wear'
      ],
      autumn: [
        'earth tones',
        'layered textures',
        'vintage inspired',
        'cozy knits',
        'tailored pieces'
      ],
      winter: [
        'monochrome palette',
        'luxe fabrics',
        'oversized silhouettes',
        'tech materials',
        'statement outerwear'
      ]
    };

    return defaultTrends[season] || defaultTrends.spring;
  }

  /**
   * Clear all trend caches
   */
  static clearCache(): void {
    if (typeof window === 'undefined') return;

    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.CACHE_KEY)) {
        localStorage.removeItem(key);
      }
    });
  }
}