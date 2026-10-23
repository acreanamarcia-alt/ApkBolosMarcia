import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900/95 text-white border border-rose-500/40 rounded-2xl shadow-2xl text-xs font-semibold backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      <span>{message}</span>
    </div>
  );
};
