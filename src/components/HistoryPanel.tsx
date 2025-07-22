"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Search, Filter, Heart, Trash2, Download, Eye } from "lucide-react";
import { useImageHistory } from "@/hooks/useImageHistory";
import { useAuth } from "@/hooks/useAuth";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [page, setPage] = useState(1);

  const { images, loading, pagination, refetch } = useImageHistory({
    page,
    limit: 12,
    status: filterStatus || undefined,
    autoRefresh: true
  });

  const filteredImages = images.filter(image => 
    image.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-y-0 right-0 w-96 bg-white/95 backdrop-blur-lg shadow-xl z-50 border-l border-gray-200/50"
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">履歴を表示するにはログインが必要です</h3>
                <p className="text-gray-600">ログインして生成した画像の履歴を管理しましょう</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          className="fixed inset-y-0 right-0 w-96 bg-white/95 backdrop-blur-lg shadow-xl z-50 border-l border-gray-200/50 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-gray-600" />
                <h2 className="font-medium text-gray-900">生成履歴</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Search and Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="プロンプトで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">全てのステータス</option>
                <option value="completed">完了</option>
                <option value="pending">待機中</option>
                <option value="failed">失敗</option>
              </select>
            </div>
          </div>

          {/* Images Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">まだ画像がありません</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredImages.map((image) => (
                  <HistoryImageCard key={image.id} image={image} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-gray-200/50">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      page === i + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface HistoryImageCardProps {
  image: any;
}

function HistoryImageCard({ image }: HistoryImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    completed: "完了",
    pending: "処理中",
    failed: "失敗",
  };

  return (
    <motion.div
      className="relative group rounded-lg overflow-hidden border border-gray-200/50"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="aspect-square bg-gray-100 relative">
        {image.imageUrl ? (
          <img
            src={image.imageUrl}
            alt={image.prompt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Eye className="w-6 h-6" />
          </div>
        )}

        {/* Status Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full ${statusColors[image.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
          {statusLabels[image.status as keyof typeof statusLabels] || image.status}
        </div>

        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2"
            >
              <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Heart className="w-4 h-4 text-white" />
              </button>
              <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Download className="w-4 h-4 text-white" />
              </button>
              <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-xs text-gray-600 line-clamp-2 mb-1">
          {image.prompt}
        </p>
        <p className="text-xs text-gray-400">
          {new Date(image.createdAt).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
}