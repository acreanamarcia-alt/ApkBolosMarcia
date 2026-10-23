import React, { useState } from 'react';
import { 
  FileText, 
  Eye, 
  Download, 
  Copy, 
  Check, 
  BookOpen,
  Sparkles,
  Heading1,
  List,
  Code
} from 'lucide-react';

interface MarkdownViewProps {
  onNotify: (msg: string) => void;
}

const DEFAULT_MARKDOWN = `# Semicolon (;) — Developer Scratchpad & Syntax Lab

Welcome to **Semicolon**, a developer workbench crafted for speed, syntax verification, and real-time computation.

---

## Key Capabilities

1. **JavaScript Sandbox**: Run ES2024 code with intercepted \`console.table\`, timers, and performance profiling.
2. **Regex Analyzer**: Real-time matching, flag toggles, capture group inspector, and substitution engine.
3. **Data Transformer**: JSON formatting, JWT inspection, Base64 & URL encoding, and cryptographic SHA-256 hashes.
4. **Diff Comparator**: Line-by-line and side-by-side Myers diff analysis.
5. **Manus File Inspector**: Compare, inspect, and preview artifacts from Manus sessions.

---

### Code Example

\`\`\`javascript
// Semicolon statement check
const calculateVelocity = (distance, time) => {
  if (time <= 0) throw new Error("Time must be positive");
  return distance / time;
};
\`\`\`

> *"Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."* — Antoine de Saint-Exupéry
`;

export const MarkdownView: React.FC<MarkdownViewProps> = ({ onNotify }) => {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [copied, setCopied] = useState(false);

  // Compute stats
  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
  const lineCount = markdown.split('\n').length;
  const charCount = markdown.length;
  const readTimeMin = Math.ceil(wordCount / 200);

  // Simple safe client markdown parser for preview
  const parseMarkdownToHtml = (md: string): string => {
    return md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Headings
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold text-slate-100 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-slate-100 mt-5 mb-2 pb-1 border-b border-slate-800">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-slate-50 mt-2 mb-3 pb-2 border-b border-slate-800">$1</h1>')
      // Blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-2 border-emerald-500 pl-3 py-1 my-3 text-slate-400 italic text-xs">$1</blockquote>')
      // Code blocks
      .replace(/```([a-z]*)\n([\s\S]*?)```/gim, '<pre class="bg-slate-900 border border-slate-800 p-3 rounded-lg font-mono text-xs text-emerald-300 my-3 overflow-x-auto"><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-emerald-400 px-1 py-0.5 rounded font-mono text-xs">$1</code>')
      // Bold & Italic
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-100">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="italic text-slate-300">$1</em>')
      // Horizontal rules
      .replace(/^---$/gim, '<hr class="border-slate-800 my-4" />')
      // Unordered lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-slate-300">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal text-slate-300">$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '<p class="my-2.5 text-slate-300 leading-relaxed"></p>')
      .replace(/\n/g, '<br />');
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'semicolon-notes.md';
    link.click();
    URL.revokeObjectURL(url);
    onNotify('Downloaded markdown file');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onNotify('Copied markdown to clipboard');
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-53px)] bg-slate-950 text-slate-200 overflow-hidden">
      {/* Action Header */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span className="text-slate-200 font-medium">DOCUMENT STATS:</span>
          <span>{wordCount} words</span>
          <span className="text-slate-600">·</span>
          <span>{lineCount} lines</span>
          <span className="text-slate-600">·</span>
          <span>{charCount} chars</span>
          <span className="text-slate-600">·</span>
          <span>~{readTimeMin} min read</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-slate-100 bg-slate-800 border border-slate-700 rounded-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy MD</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-slate-100 bg-slate-800 border border-slate-700 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Split View */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-hidden">
        {/* Editor */}
        <div className="flex flex-col h-full bg-slate-950/70 overflow-hidden">
          <div className="px-3 py-1.5 bg-slate-900/50 border-b border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Editor (Markdown Input)</span>
            <span className="text-slate-400">Supports GFM tables, quotes & code</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
            className="flex-1 p-4 bg-transparent font-mono text-xs leading-6 text-slate-200 outline-none resize-none code-textarea"
            placeholder="# Write your markdown notes here..."
          />
        </div>

        {/* Live HTML Preview */}
        <div className="flex flex-col h-full bg-slate-900/20 overflow-hidden">
          <div className="px-3 py-1.5 bg-slate-900/70 border-b border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Eye className="w-3 h-3" />
              Live Rendered HTML
            </span>
          </div>
          <div
            className="flex-1 p-6 overflow-y-auto text-xs leading-relaxed font-sans text-slate-200 selection:bg-emerald-500/20"
            dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(markdown) }}
          />
        </div>
      </div>
    </div>
  );
};
