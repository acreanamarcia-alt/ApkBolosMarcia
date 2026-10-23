import React, { useState, useEffect } from 'react';
import { 
  FileCode, 
  Upload, 
  ArrowLeftRight, 
  GitCompare, 
  Eye, 
  Copy, 
  Check, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw,
  Sparkles,
  Download,
  Code2,
  FileText
} from 'lucide-react';
import { computeLineDiff } from '../utils/diff';

interface DualFileViewerProps {
  onNotify: (msg: string) => void;
  onSendToPlayground: (code: string) => void;
  onOpenInHtmlPreview?: (html: string) => void;
}

const SAMPLE_FILE_1 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dashboard v1.0</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; }
    .metric { background: #1e293b; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; }
    .value { font-size: 2rem; font-weight: bold; color: #38bdf8; }
  </style>
</head>
<body>
  <h1>System Overview (v1.0)</h1>
  <div class="metric">
    <div class="label">Total Users</div>
    <div class="value">14,290</div>
  </div>
  <div class="metric">
    <div class="label">API Latency</div>
    <div class="value">42ms</div>
  </div>
</body>
</html>`;

const SAMPLE_FILE_2 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dashboard v2.0 - Optimized</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #090d16; color: #f8fafc; padding: 2rem; }
    .metric { background: #151e2e; padding: 1.5rem; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 1rem; }
    .value { font-size: 2.25rem; font-weight: bold; color: #10b981; }
    .badge { font-size: 0.75rem; color: #10b981; background: rgba(16,185,129,0.1); padding: 4px 8px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>System Overview (v2.0) <span class="badge">Live</span></h1>
  <div class="metric">
    <div class="label">Total Active Users</div>
    <div class="value">28,540</div>
  </div>
  <div class="metric">
    <div class="label">API Latency (p99)</div>
    <div class="value">18ms</div>
  </div>
  <div class="metric">
    <div class="label">Uptime</div>
    <div class="value">99.99%</div>
  </div>
</body>
</html>`;

export const DualFileViewer: React.FC<DualFileViewerProps> = ({
  onNotify,
  onSendToPlayground,
  onOpenInHtmlPreview,
}) => {
  const [file1Name, setFile1Name] = useState<string>('45557239-814d-4c08-bf81-d36e4e040406');
  const [file2Name, setFile2Name] = useState<string>('f6d6eee5-4d71-4210-8c12-065464a1fa65');
  const [file1Content, setFile1Content] = useState<string>(SAMPLE_FILE_1);
  const [file2Content, setFile2Content] = useState<string>(SAMPLE_FILE_2);
  const [viewMode, setViewMode] = useState<'diff' | 'side-by-side' | 'preview1' | 'preview2'>('diff');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const diffResult = computeLineDiff(file1Content, file2Content);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fileNumber: 1 | 2) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (fileNumber === 1) {
        setFile1Content(text);
        setFile1Name(file.name);
      } else {
        setFile2Content(text);
        setFile2Name(file.name);
      }
      onNotify(`Loaded ${file.name} into File ${fileNumber}`);
    };
    reader.readAsText(file);
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    onNotify('Copied file content');
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.includes('.') ? filename : `${filename}.html`;
    link.click();
    URL.revokeObjectURL(url);
    onNotify(`Downloaded ${filename}`);
  };

  const handleSwap = () => {
    const tempName = file1Name;
    const tempContent = file1Content;
    setFile1Name(file2Name);
    setFile1Content(file2Content);
    setFile2Name(tempName);
    setFile2Content(tempContent);
    onNotify('Swapped File 1 and File 2');
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-53px)] bg-slate-950 text-slate-200 overflow-hidden">
      {/* Notice regarding Manus links */}
      <div className="bg-amber-950/30 border-b border-amber-800/40 px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong>Manus File Notice:</strong> The links for <code>45557239...</code> and <code>f6d6eee5...</code> require active session cookies or have expired on manus.im.
            Upload your downloaded files or paste content below to compare, inspect diffs, and render live previews.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://manus.im/share/file/45557239-814d-4c08-bf81-d36e4e040406"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
          >
            File 1 link <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-amber-700">·</span>
          <a
            href="https://manus.im/share/file/f6d6eee5-4d71-4210-8c12-065464a1fa65"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
          >
            File 2 link <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-800/80 border border-slate-700/80 rounded-lg">
          <button
            onClick={() => setViewMode('diff')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewMode === 'diff'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Diff Comparator</span>
            <span className="text-[10px] bg-emerald-950/60 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
              +{diffResult.additions} -{diffResult.deletions}
            </span>
          </button>

          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewMode === 'side-by-side'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Side-by-Side Editors</span>
          </button>

          <button
            onClick={() => setViewMode('preview1')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewMode === 'preview1'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Render File 1</span>
          </button>

          <button
            onClick={() => setViewMode('preview2')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewMode === 'preview2'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Render File 2</span>
          </button>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSwap}
            title="Swap File 1 and File 2"
            className="flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-slate-100 bg-slate-800 border border-slate-700 rounded-md transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Swap</span>
          </button>

          {onOpenInHtmlPreview && (
            <button
              onClick={() => onOpenInHtmlPreview(viewMode === 'preview1' ? file1Content : file2Content)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-md shadow-sm transition-all"
            >
              <Eye className="w-3.5 h-3.5 fill-current" />
              <span>Run in HTML Previewer</span>
            </button>
          )}

          <button
            onClick={() => onSendToPlayground(file2Content)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-md transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Send to Playground</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* DIFF COMPARATOR VIEW */}
        {viewMode === 'diff' && (
          <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
            {/* Diff Header */}
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-4">
                <span className="text-rose-400 flex items-center gap-1">
                  --- <strong>{file1Name}</strong>
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  +++ <strong>{file2Name}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">+{diffResult.additions} lines added</span>
                <span className="text-rose-400">-{diffResult.deletions} lines removed</span>
                <span className="text-slate-500">{diffResult.unchanged} unchanged</span>
              </div>
            </div>

            {/* Diff Lines Table */}
            <div className="flex-1 overflow-auto font-mono text-[12px] leading-6 divide-y divide-slate-900">
              {diffResult.diffs.map((diff, index) => {
                const isAdded = diff.type === 'added';
                const isRemoved = diff.type === 'removed';

                return (
                  <div
                    key={index}
                    className={`flex items-start transition-colors ${
                      isAdded
                        ? 'bg-emerald-950/20 text-emerald-200 hover:bg-emerald-950/30'
                        : isRemoved
                        ? 'bg-rose-950/20 text-rose-300 hover:bg-rose-950/30'
                        : 'text-slate-400 hover:bg-slate-900/50'
                    }`}
                  >
                    {/* Old line number */}
                    <div className="w-12 text-right pr-2 text-slate-600 select-none border-r border-slate-800/40 shrink-0">
                      {diff.oldLineNumber || ''}
                    </div>

                    {/* New line number */}
                    <div className="w-12 text-right pr-2 text-slate-600 select-none border-r border-slate-800/40 shrink-0">
                      {diff.newLineNumber || ''}
                    </div>

                    {/* Prefix + / - */}
                    <div className="w-6 text-center select-none shrink-0 font-bold">
                      {isAdded ? '+' : isRemoved ? '-' : ' '}
                    </div>

                    {/* Code text */}
                    <pre className="flex-1 px-2 whitespace-pre overflow-x-auto code-textarea">
                      {diff.text || ' '}
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SIDE BY SIDE EDITORS VIEW */}
        {viewMode === 'side-by-side' && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 h-full overflow-hidden">
            {/* File 1 Panel */}
            <div className="flex flex-col h-full bg-slate-950/60 overflow-hidden">
              <div className="px-3 py-2 bg-slate-900/70 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                  <input
                    type="text"
                    value={file1Name}
                    onChange={(e) => setFile1Name(e.target.value)}
                    className="bg-transparent text-slate-200 font-mono text-xs focus:ring-1 focus:ring-emerald-500 rounded px-1 outline-none truncate"
                  />
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="cursor-pointer px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Upload</span>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 1)}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => handleCopy(file1Content, 1)}
                    className="p-1 text-slate-400 hover:text-slate-200 bg-slate-800 rounded"
                    title="Copy File 1"
                  >
                    {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDownload(file1Name, file1Content)}
                    className="p-1 text-slate-400 hover:text-slate-200 bg-slate-800 rounded"
                    title="Download File 1"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={file1Content}
                onChange={(e) => setFile1Content(e.target.value)}
                spellCheck={false}
                className="flex-1 p-3 bg-transparent font-mono text-[12px] leading-5 text-slate-200 outline-none resize-none code-textarea"
                placeholder="Paste File 1 content here..."
              />
            </div>

            {/* File 2 Panel */}
            <div className="flex flex-col h-full bg-slate-950/60 overflow-hidden">
              <div className="px-3 py-2 bg-slate-900/70 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    value={file2Name}
                    onChange={(e) => setFile2Name(e.target.value)}
                    className="bg-transparent text-slate-200 font-mono text-xs focus:ring-1 focus:ring-emerald-500 rounded px-1 outline-none truncate"
                  />
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="cursor-pointer px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Upload</span>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 2)}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => handleCopy(file2Content, 2)}
                    className="p-1 text-slate-400 hover:text-slate-200 bg-slate-800 rounded"
                    title="Copy File 2"
                  >
                    {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDownload(file2Name, file2Content)}
                    className="p-1 text-slate-400 hover:text-slate-200 bg-slate-800 rounded"
                    title="Download File 2"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={file2Content}
                onChange={(e) => setFile2Content(e.target.value)}
                spellCheck={false}
                className="flex-1 p-3 bg-transparent font-mono text-[12px] leading-5 text-slate-200 outline-none resize-none code-textarea"
                placeholder="Paste File 2 content here..."
              />
            </div>
          </div>
        )}

        {/* PREVIEW 1 */}
        {viewMode === 'preview1' && (
          <div className="flex-1 flex flex-col h-full bg-slate-900 p-2">
            <iframe
              srcDoc={file1Content}
              title="Preview File 1"
              sandbox="allow-scripts"
              className="w-full h-full rounded border border-slate-800 bg-white"
            />
          </div>
        )}

        {/* PREVIEW 2 */}
        {viewMode === 'preview2' && (
          <div className="flex-1 flex flex-col h-full bg-slate-900 p-2">
            <iframe
              srcDoc={file2Content}
              title="Preview File 2"
              sandbox="allow-scripts"
              className="w-full h-full rounded border border-slate-800 bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
};
