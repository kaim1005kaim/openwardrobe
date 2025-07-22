"use client";

import { useAuth } from "@/hooks/useAuth";
import { signIn, signOut } from "next-auth/react";
import { User, LogOut, LogIn } from "lucide-react";

export function LoginButton() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={16} />
          <span>{user.name || user.email}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <LogOut size={14} />
          <span>ログアウト</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("credentials", { callbackUrl: "/" })}
      className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
    >
      <LogIn size={14} />
      <span>ログイン</span>
    </button>
  );
}