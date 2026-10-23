import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Plus, 
  Star, 
  Copy, 
  Check, 
  Play, 
  Trash2, 
  Download, 
  Upload,
  Tag,
  Code
} from 'lucide-react';
import { Snippet } from '../types';
import { DEFAULT_SNIPPETS } from '../data/defaultSnippets';

interface SnippetVaultViewProps {
  onNotify: (msg: string) => void;
  onSendToPlayground: (code: string) => void;
}

export const SnippetVaultView: React.FC<SnippetVaultViewProps> = ({
  onNotify,
  onSendToPlayground,
}) => {
  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    try {
      const stored = localStorage.getItem('semicolon_snippets');
      return stored ? JSON.parse(stored) : DEFAULT_SNIPPETS;
    } catch {
      return DEFAULT_SNIPPETS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New snippet form state
  const [newTitle, setNewTitle] = useState('');
  const [newLanguage, setNewLanguage] = useState('javascript');
  const [newCategory, setNewCategory] = useState('Custom');
  const [newDescription, setNewDescription] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newTags, setNewTags] = useState('helper, utility');

  const saveToStorage = (updated: Snippet[]) => {
    setSnippets(updated);
    try {
      localStorage.setItem('semicolon_snippets', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ['All', ...Array.from(new Set(snippets.map(s => s.category)))];

  const filteredSnippets = snippets.filter(s => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      s.title.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.tags.some((t: string) => t.toLowerCase().includes(query)) ||
      s.code.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  const handleToggleFavorite = (id: string) => {
    const updated = snippets.map(s => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s);
    saveToStorage(updated);
  };

  const handleDeleteSnippet = (id: string) => {
    const updated = snippets.filter(s => s.id !== id);
    saveToStorage(updated);
    onNotify('Snippet deleted');
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    onNotify('Copied code to clipboard');
  };

  const handleAddNewSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) {
      onNotify('Please fill in title and code');
      return;
    }

    const created: Snippet = {
      id: 'snip-' + Date.now(),
      title: newTitle.trim(),
      language: newLanguage,
      category: newCategory.trim() || 'General',
      description: newDescription.trim(),
      code: newCode.trim(),
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      isFavorite: false,
      updatedAt: Date.now(),
    };

    saveToStorage([created, ...snippets]);
    setIsAddingNew(false);
    setNewTitle('');
    setNewCode('');
    setNewDescription('');
    onNotify(`Saved "${created.title}" to Snippet Vault`);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(snippets, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `semicolon-snippets-export.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    onNotify('Exported all snippets to JSON');
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-53px)] bg-slate-950 text-slate-200 overflow-hidden">
      {/* Header bar */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 focus-within:border-emerald-500">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search snippets by name, tag, or syntax..."
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-400 outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-md shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Snippet</span>
          </button>

          <button
            onClick={handleExportJson}
            title="Backup Snippets"
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950 flex items-center gap-1 overflow-x-auto text-xs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-800 text-emerald-400 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content list */}
      <div className="flex-1 overflow-y-auto p-4 max-w-6xl w-full mx-auto space-y-4">
        {filteredSnippets.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            No snippets found matching your query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSnippets.map((snip) => (
              <div
                key={snip.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all shadow-sm"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-100">{snip.title}</span>
                      <button
                        onClick={() => handleToggleFavorite(snip.id)}
                        className={`text-slate-500 hover:text-amber-400 ${snip.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`}
                      >
                        <Star className={`w-3.5 h-3.5 ${snip.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    {snip.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{snip.description}</p>
                    )}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/40 shrink-0">
                    {snip.language}
                  </span>
                </div>

                {/* Code Preview Box */}
                <div className="relative group">
                  <pre className="p-3 bg-slate-950 rounded-lg font-mono text-[11px] leading-5 text-slate-300 overflow-x-auto max-h-40 border border-slate-800/80 code-textarea">
                    {snip.code}
                  </pre>
                </div>

                {/* Tags and Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {snip.tags.map((t: string) => (
                      <span key={t} className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopyCode(snip.code, snip.id)}
                      title="Copy Code"
                      className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-700 rounded transition-colors"
                    >
                      {copiedId === snip.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onSendToPlayground(snip.code)}
                      title="Run in Playground"
                      className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium rounded flex items-center gap-1 border border-slate-700/60 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Playground</span>
                    </button>

                    <button
                      onClick={() => handleDeleteSnippet(snip.id)}
                      title="Delete"
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Snippet Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddNewSnippet}
            className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-semibold text-slate-100 text-sm">Add New Snippet</span>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Snippet Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Robust Retry with Exponential Backoff"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded outline-none text-slate-100 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Language</label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded outline-none text-slate-100"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="html">HTML / CSS</option>
                    <option value="sql">SQL</option>
                    <option value="python">Python</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Functions, DB, Hooks..."
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded outline-none text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description (optional)</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Short note on how to use it..."
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded outline-none text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Code</label>
                <textarea
                  required
                  rows={6}
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="export function example() { ... }"
                  className="w-full p-2.5 bg-slate-950 font-mono text-xs border border-slate-800 rounded outline-none text-slate-100 focus:border-emerald-500 code-textarea"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="api, network, async"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded outline-none text-slate-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded"
              >
                Save Snippet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
