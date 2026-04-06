/**
 * LoadingSpinner Component - Loading states cho application
 */

import React from "react";
import { Loader2 } from "lucide-react";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  center?: boolean;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

export function LoadingSpinner({
  size = "md",
  text,
  center = false,
  fullScreen = false,
  className = "",
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">{spinner}</div>
      </div>
    );
  }

  if (center) {
    return (
      <div className="flex items-center justify-center py-8">{spinner}</div>
    );
  }

  return spinner;
}

// Page Loading Component
export function PageLoading({ message = "Đang tải..." }: { message?: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// Button Loading Component
export function ButtonLoading({ text = "Đang xử lý..." }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>{text}</span>
    </div>
  );
}
