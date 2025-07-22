"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

interface FavoriteData {
  id: string;
  createdAt: string;
  image: {
    id: string;
    userId?: string;
    prompt: string;
    imageUrl?: string;
    upscaledUrls?: string[];
    status: string;
    progress?: number;
    designOptions: any;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
    isFavorited: boolean;
  };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseFavoritesOptions {
  page?: number;
  limit?: number;
  autoRefresh?: boolean;
}

export function useFavorites(options: UseFavoritesOptions = {}) {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteData[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    page = 1,
    limit = 20,
    autoRefresh = false
  } = options;

  const fetchFavorites = async () => {
    if (!isAuthenticated || !user) {
      setFavorites([]);
      setPagination(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await fetch(`/api/favorites?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }

      const data = await response.json();
      setFavorites(data.favorites);
      setPagination(data.pagination);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch favorites");
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (imageId: string) => {
    if (!isAuthenticated) {
      return false;
    }

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ imageId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add to favorites");
      }

      const newFavorite = await response.json();
      
      // Update local state
      setFavorites(prev => [newFavorite, ...prev]);
      
      return true;

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add to favorites");
      return false;
    }
  };

  const removeFromFavorites = async (imageId: string) => {
    if (!isAuthenticated) {
      return false;
    }

    try {
      const response = await fetch(`/api/favorites/${imageId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to remove from favorites");
      }

      // Update local state
      setFavorites(prev => prev.filter(fav => fav.image.id !== imageId));
      
      return true;

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove from favorites");
      return false;
    }
  };

  const toggleFavorite = async (imageId: string) => {
    const isFavorited = favorites.some(fav => fav.image.id === imageId);
    
    if (isFavorited) {
      return await removeFromFavorites(imageId);
    } else {
      return await addToFavorites(imageId);
    }
  };

  const isFavorited = (imageId: string) => {
    return favorites.some(fav => fav.image.id === imageId);
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && isAuthenticated) {
      const interval = setInterval(fetchFavorites, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, isAuthenticated, page, limit]);

  // Initial fetch
  useEffect(() => {
    fetchFavorites();
  }, [isAuthenticated, page, limit]);

  return {
    favorites,
    pagination,
    loading,
    error,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorited,
    refetch: fetchFavorites
  };
}