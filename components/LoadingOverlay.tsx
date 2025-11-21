import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, message }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center max-w-sm mx-4 shadow-2xl">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 rounded-full animate-pulse"></div>
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
        </div>
        <h3 className="mt-6 text-lg font-semibold text-slate-800 text-center">
          Gemini is working...
        </h3>
        <p className="mt-2 text-sm text-slate-500 text-center">{message}</p>
      </div>
    </div>
  );
};
