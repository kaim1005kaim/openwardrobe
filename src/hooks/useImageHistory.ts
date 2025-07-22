"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

interface ImageData {
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
  isFavorited?: boolean;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseImageHistoryOptions {
  page?: number;
  limit?: number;
  tags?: string[];
  status?: string;
  autoRefresh?: boolean;
}

export function useImageHistory(options: UseImageHistoryOptions = {}) {
  const { user, isAuthenticated } = useAuth();
  const [images, setImages] = useState<ImageData[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    page = 1,
    limit = 20,
    tags = [],
    status,
    autoRefresh = false
  } = options;

  const fetchImages = async () => {
    if (!isAuthenticated || !user) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        userId: user.id,
        ...(tags.length > 0 && { tags: tags.join(",") }),
        ...(status && { status })
      });

      const response = await fetch(`/api/images?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const data = await response.json();
      setImages(data.images);
      setPagination(data.pagination);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  const saveImage = async (imageData: Omit<ImageData, "id" | "createdAt" | "updatedAt">) => {
    if (!isAuthenticated) {
      // For anonymous users, we could store in localStorage or skip saving
      return null;
    }

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(imageData)
      });

      if (!response.ok) {
        throw new Error("Failed to save image");
      }

      const savedImage = await response.json();
      
      // Update local state
      setImages(prev => [savedImage, ...prev]);
      
      return savedImage;

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save image");
      return null;
    }
  };

  const updateImage = async (id: string, updates: Partial<ImageData>) => {
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error("Failed to update image");
      }

      const updatedImage = await response.json();
      
      // Update local state
      setImages(prev => 
        prev.map(img => img.id === id ? updatedImage : img)
      );
      
      return updatedImage;

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update image");
      return null;
    }
  };

  const deleteImage = async (id: string) => {
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      // Update local state
      setImages(prev => prev.filter(img => img.id !== id));
      
      return true;

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
      return false;
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && isAuthenticated) {
      const interval = setInterval(fetchImages, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, isAuthenticated, page, limit, tags, status]);

  // Initial fetch
  useEffect(() => {
    fetchImages();
  }, [isAuthenticated, page, limit, tags, status]);

  return {
    images,
    pagination,
    loading,
    error,
    fetchImages,
    saveImage,
    updateImage,
    deleteImage,
    refetch: fetchImages
  };
}