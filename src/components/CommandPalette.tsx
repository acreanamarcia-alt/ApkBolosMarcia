import React, { useState, useEffect, useRef } from 'react';
import { 
  Command, 
  Terminal, 
  Search, 
  ArrowLeftRight, 
  GitCompare, 
  Bookmark, 
  FileText, 
  Sparkles, 
  Wand2, 
  Moon, 
  Sun,
  FileCode,
  Eye
} from 'lucide-react';
import { ToolMode, AppTheme } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: ToolMode) => void;
  onToggleSemicolons: () => void;
  onToggleTheme: () => void;
  onLoadPreset: (id: string) => void;
}

interface PaletteItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectMode,
  onToggleSemicolons,
  onToggleTheme,
  onLoadPreset,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items: PaletteItem[] = [
    // Views
    {
      id: 'view-html',
      title: 'Run Live HTML Preview Runner',
      category: 'Navigation',
      icon: <Eye className="w-4 h-4 text-emerald-400" />,
      action: () => { onSelectMode('html'); onClose(); },
      shortcut: 'H',
    },
    {
      id: 'view-diff',
      title: 'Open Dual File & Manus Diff Viewer',
      category: 'Navigation',
      icon: <GitCompare className="w-4 h-4 text-purple-400" />,
      action: () => { onSelectMode('diff'); onClose(); },
      shortcut: 'D',
    },
    {
      id: 'view-playground',
      title: 'Go to JavaScript Playground',
      category: 'Navigation',
      icon: <Terminal className="w-4 h-4 text-cyan-400" />,
      action: () => { onSelectMode('playground'); onClose(); },
      shortcut: '1',
    },
    {
      id: 'view-regex',
      title: 'Go to Regex Lab',
      category: 'Navigation',
      icon: <Search className="w-4 h-4 text-amber-400" />,
      action: () => { onSelectMode('regex'); onClose(); },
      shortcut: '3',
    },
    {
      id: 'view-transform',
      title: 'Go to Data Transformers & Crypto',
      category: 'Navigation',
      icon: <ArrowLeftRight className="w-4 h-4 text-cyan-400" />,
      action: () => { onSelectMode('transform'); onClose(); },
      shortcut: '4',
    },
    {
      id: 'view-snippets',
      title: 'Open Snippet Vault',
      category: 'Navigation',
      icon: <Bookmark className="w-4 h-4 text-rose-400" />,
      action: () => { onSelectMode('snippets'); onClose(); },
      shortcut: '5',
    },
    {
      id: 'view-markdown',
      title: 'Open Markdown Documentation',
      category: 'Navigation',
      icon: <FileText className="w-4 h-4 text-blue-400" />,
      action: () => { onSelectMode('markdown'); onClose(); },
      shortcut: '6',
    },
    // Actions
    {
      id: 'action-semicolon',
      title: 'Toggle / Fix Semicolons (;)',
      category: 'Syntax Tools',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      action: () => { onToggleSemicolons(); onClose(); },
      shortcut: ';',
    },
    {
      id: 'action-theme',
      title: 'Toggle Color Theme (Dark / Light)',
      category: 'Settings',
      icon: <Sun className="w-4 h-4 text-amber-400" />,
      action: () => { onToggleTheme(); onClose(); },
    },
    // Presets
    {
      id: 'preset-quicksort',
      title: 'Load Quick Sort Algorithm',
      category: 'Presets',
      icon: <FileCode className="w-4 h-4 text-slate-400" />,
      action: () => { onSelectMode('playground'); onLoadPreset('quicksort'); onClose(); },
    },
    {
      id: 'preset-particles',
      title: 'Load Canvas Particle Swarm',
      category: 'Presets',
      icon: <FileCode className="w-4 h-4 text-slate-400" />,
      action: () => { onSelectMode('playground'); onLoadPreset('canvas-particles'); onClose(); },
    },
    {
      id: 'preset-emitter',
      title: 'Load Event Emitter Architecture',
      category: 'Presets',
      icon: <FileCode className="w-4 h-4 text-slate-400" />,
      action: () => { onSelectMode('playground'); onLoadPreset('event-emitter'); onClose(); },
    },
  ];

  const filtered = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-4">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-800">
          <Command className="w-4 h-4 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 outline-none"
          />
          <kbd className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono border border-slate-700/60">
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands found
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                    isSelected
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-[10px] text-slate-400">{item.category}</div>
                    </div>
                  </div>
                  {item.shortcut && (
                    <kbd className="font-mono text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
