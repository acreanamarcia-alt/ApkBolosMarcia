import React from 'react';
import { 
  Play, 
  Search, 
  ArrowLeftRight, 
  GitCompare, 
  Bookmark, 
  FileText, 
  Sparkles, 
  Command, 
  Moon, 
  Sun, 
  Terminal, 
  Settings2,
  Eye
} from 'lucide-react';
import { ToolMode, AppTheme } from '../types';

interface NavbarProps {
  currentMode: ToolMode;
  onSelectMode: (mode: ToolMode) => void;
  onOpenCommandPalette: () => void;
  onToggleSemicolons: () => void;
  onRunPlayground?: () => void;
  theme: AppTheme;
  onToggleTheme: () => void;
  semicolonCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  onOpenCommandPalette,
  onToggleSemicolons,
  onRunPlayground,
  theme,
  onToggleTheme,
  semicolonCount,
}) => {
  const navItems: { mode: ToolMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'html', label: 'HTML Preview', icon: <Eye className="w-4 h-4 text-emerald-400" /> },
    { mode: 'diff', label: 'Diff & Manus Files', icon: <GitCompare className="w-4 h-4" /> },
    { mode: 'playground', label: 'Playground', icon: <Terminal className="w-4 h-4" /> },
    { mode: 'regex', label: 'Regex Lab', icon: <Search className="w-4 h-4" /> },
    { mode: 'transform', label: 'Transformers', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { mode: 'snippets', label: 'Snippets', icon: <Bookmark className="w-4 h-4" /> },
    { mode: 'markdown', label: 'Markdown', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between gap-4">
      {/* Brand & Monogram */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-lg select-none">
          ;
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-slate-100">Semicolon</span>
            <span className="text-xs text-slate-400 font-mono">v1.0</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Dev Scratchpad & Syntax Lab</span>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800/80 rounded-lg">
        {navItems.map(item => {
          const isActive = currentMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => onSelectMode(item.mode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Semicolon Inspector button */}
        <button
          onClick={onToggleSemicolons}
          title="Toggle / Fix Semicolons on active code"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
        >
          <span className="text-emerald-400 font-bold">;</span>
          <span className="hidden md:inline">Semicolons</span>
          {semicolonCount !== undefined && (
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
              {semicolonCount}
            </span>
          )}
        </button>

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-400 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-md transition-colors"
          title="Open Command Palette (⌘K / Ctrl+K)"
        >
          <Command className="w-3.5 h-3.5" />
          <span className="hidden lg:inline text-slate-400">Search tools...</span>
          <kbd className="hidden sm:inline-block font-mono text-[10px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded border border-slate-700/60">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={`Switch Theme (Current: ${theme})`}
          className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-md hover:bg-slate-800 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
