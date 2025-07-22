"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Suspense } from "react";

function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case "CredentialsSignin":
        return "メールアドレスまたはパスワードが正しくありません";
      case "EmailSignin":
        return "メールアドレスの確認に失敗しました";
      case "OAuthSignin":
        return "OAuth認証に失敗しました";
      case "OAuthCallback":
        return "OAuth認証コールバックでエラーが発生しました";
      case "OAuthCreateAccount":
        return "OAuthアカウントの作成に失敗しました";
      case "EmailCreateAccount":
        return "メールアカウントの作成に失敗しました";
      case "Callback":
        return "認証コールバックでエラーが発生しました";
      case "OAuthAccountNotLinked":
        return "このアカウントは既に別の認証方法で登録されています";
      case "EmailSignin":
        return "メール認証に失敗しました";
      case "CredentialsSignin":
        return "認証情報が正しくありません";
      case "SessionRequired":
        return "このページにアクセスするにはログインが必要です";
      default:
        return "認証エラーが発生しました";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 text-center"
      >
        {/* Error Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">認証エラー</h1>
          <p className="text-gray-600">{getErrorMessage(error)}</p>
        </div>

        {/* Error Details */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-800">
              エラーコード: <code className="font-mono">{error}</code>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            onClick={() => router.push("/auth/signin")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>再度ログインする</span>
          </motion.button>

          <motion.button
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ホームに戻る</span>
          </motion.button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>問題が解決しない場合は、</p>
          <p>デモアカウントをお試しください</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}