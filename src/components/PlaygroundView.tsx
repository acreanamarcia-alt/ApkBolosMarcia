import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  Terminal, 
  Code2, 
  Eye, 
  Wand2, 
  FileCode,
  AlertCircle,
  Info,
  AlertTriangle
} from 'lucide-react';
import { CODE_PRESETS } from '../data/presets';
import { runJavaScriptSandbox, countSemicolons, toggleSemicolons, formatBasicIndentation } from '../utils/sandbox';
import { ConsoleMessage } from '../types';

interface PlaygroundViewProps {
  onNotify: (msg: string) => void;
  externalCode?: string;
}

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({ onNotify, externalCode }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('quicksort');
  const [code, setCode] = useState<string>(CODE_PRESETS[0].code);
  const [isHtmlMode, setIsHtmlMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'console' | 'preview'>('console');
  const [logs, setLogs] = useState<ConsoleMessage[]>([]);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [autoRun, setAutoRun] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // If external code passed in (e.g. from Snippet vault)
  useEffect(() => {
    if (externalCode) {
      setCode(externalCode);
      setIsHtmlMode(false);
      setActiveTab('console');
    }
  }, [externalCode]);

  // Execute Code
  const handleRunCode = () => {
    setError(null);
    if (isHtmlMode) {
      setActiveTab('preview');
      if (iframeRef.current) {
        iframeRef.current.srcdoc = code;
      }
      onNotify('HTML Preview updated');
      return;
    }

    const result = runJavaScriptSandbox(code);
    setLogs(result.logs);
    setExecutionTime(result.durationMs);
    if (result.error) {
      setError(result.error);
    }
  };

  // Run on mount
  useEffect(() => {
    handleRunCode();
  }, []);

  // Keyboard shortcut Cmd/Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, isHtmlMode]);

  // Auto-run debounce if enabled
  useEffect(() => {
    if (!autoRun || isHtmlMode) return;
    const timer = setTimeout(() => {
      handleRunCode();
    }, 600);
    return () => clearTimeout(timer);
  }, [code, autoRun]);

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const preset = CODE_PRESETS.find(p => p.id === id);
    if (preset) {
      setCode(preset.code);
      const isHtml = preset.language === 'html';
      setIsHtmlMode(isHtml);
      setActiveTab(isHtml ? 'preview' : 'console');
      setTimeout(() => {
        if (isHtml && iframeRef.current) {
          iframeRef.current.srcdoc = preset.code;
        } else {
          const res = runJavaScriptSandbox(preset.code);
          setLogs(res.logs);
          setExecutionTime(res.durationMs);
        }
      }, 50);
      onNotify(`Loaded: ${preset.name}`);
    }
  };

  const handleAddSemicolons = () => {
    const updated = toggleSemicolons(code, 'add');
    setCode(updated);
    onNotify('Appended semicolons (;) to statement endings');
  };

  const handleRemoveSemicolons = () => {
    const updated = toggleSemicolons(code, 'remove');
    setCode(updated);
    onNotify('Stripped trailing semicolons (StandardJS style)');
  };

  const handleFormatCode = () => {
    const formatted = formatBasicIndentation(code);
    setCode(formatted);
    onNotify('Formatted code indentation');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onNotify('Copied code to clipboard');
  };

  // Tab key indentation support in textarea
  const handleKeyDownTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;
      target.value = val.substring(0, start) + '  ' + val.substring(end);
      target.selectionStart = target.selectionEnd = start + 2;
      setCode(target.value);
    }
  };

  const stats = countSemicolons(code);
  const lineCount = code.split('\n').length;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-53px)] bg-slate-950 text-slate-200 overflow-hidden">
      {/* Top Action Bar */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Preset Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="font-medium text-slate-300">Preset:</span>
          </div>
          <select
            value={selectedPresetId}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
          >
            {CODE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.category})
              </option>
            ))}
          </select>

          {/* Semicolon Stats badge */}
          <div className="hidden md:flex items-center gap-2 text-slate-400 font-mono text-[11px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
            <span className="text-emerald-400 font-bold">;</span>
            <span>{stats.total} semicolons</span>
            <span className="text-slate-600">·</span>
            <span>{stats.linesWithSemicolons}/{stats.totalLines} lines</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Semicolon Fixer actions */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-md p-0.5">
            <button
              onClick={handleAddSemicolons}
              title="Add semicolons to statements"
              className="px-2 py-1 text-[11px] text-slate-300 hover:text-emerald-400 rounded hover:bg-slate-700/60 transition-colors"
            >
              + Add ;
            </button>
            <div className="w-[1px] h-3 bg-slate-700" />
            <button
              onClick={handleRemoveSemicolons}
              title="Remove trailing semicolons"
              className="px-2 py-1 text-[11px] text-slate-300 hover:text-amber-400 rounded hover:bg-slate-700/60 transition-colors"
            >
              - Remove ;
            </button>
          </div>

          <button
            onClick={handleFormatCode}
            title="Clean indentation"
            className="px-2 py-1 text-slate-300 hover:text-slate-100 bg-slate-800 border border-slate-700 rounded-md flex items-center gap-1 hover:bg-slate-700/80 transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Format</span>
          </button>

          <button
            onClick={handleCopyCode}
            title="Copy Code"
            className="p-1.5 text-slate-300 hover:text-slate-100 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700/80 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Auto-run toggle */}
          <label className="hidden lg:flex items-center gap-1.5 cursor-pointer text-slate-400 select-none text-[11px] px-1">
            <input
              type="checkbox"
              checked={autoRun}
              onChange={(e) => setAutoRun(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
            />
            <span>Auto-run</span>
          </label>

          {/* Run Button */}
          <button
            onClick={handleRunCode}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-md shadow-sm transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run</span>
            <kbd className="text-[10px] bg-emerald-600/60 text-slate-950 px-1 py-0.2 rounded font-mono">
              ⌘↵
            </kbd>
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-hidden">
        {/* Left: Code Editor */}
        <div className="flex flex-col h-full bg-slate-950/70 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/50 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-medium">script.js</span>
              <span className="text-slate-600">·</span>
              <span>{lineCount} lines</span>
              <span className="text-slate-600">·</span>
              <span>{code.length} chars</span>
            </div>
            <span className="text-slate-400">Tab indent = 2 spaces</span>
          </div>

          <div className="flex-1 relative overflow-auto flex">
            {/* Line numbers column */}
            <div className="w-10 py-3 pr-2 select-none text-right font-mono text-[12px] text-slate-600 bg-slate-950/40 border-r border-slate-800/40">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDownTextarea}
              spellCheck={false}
              className="flex-1 p-3 bg-transparent font-mono text-[13px] leading-6 text-slate-100 placeholder-slate-600 outline-none resize-none code-textarea"
              placeholder="// Write your code or paste functions here..."
            />
          </div>
        </div>

        {/* Right: Console Output & Preview */}
        <div className="flex flex-col h-full bg-slate-900/30 overflow-hidden">
          {/* Header tabs for output */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/70 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('console')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === 'console'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console</span>
                {logs.length > 0 && (
                  <span className="text-[10px] bg-slate-700/60 px-1 rounded text-slate-300">
                    {logs.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('preview');
                  if (iframeRef.current) {
                    iframeRef.current.srcdoc = code;
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live View / Canvas</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {executionTime !== null && (
                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400/90">
                  <Clock className="w-3 h-3" />
                  <span>{executionTime.toFixed(2)} ms</span>
                </div>
              )}
              {activeTab === 'console' && (
                <button
                  onClick={() => setLogs([])}
                  title="Clear Console"
                  className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 relative overflow-auto p-3 font-mono text-xs">
            {activeTab === 'console' ? (
              <div className="space-y-2">
                {logs.length === 0 ? (
                  <div className="text-slate-400 py-12 text-center select-none font-sans">
                    <Terminal className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                    <p className="text-sm">Console is clean</p>
                    <p className="text-xs text-slate-400 mt-1">Press ⌘↵ or Run to execute code</p>
                  </div>
                ) : (
                  logs.map((log) => {
                    const isErr = log.type === 'error';
                    const isWarn = log.type === 'warn';
                    const isTable = log.type === 'table';
                    const isResult = log.type === 'result';

                    return (
                      <div
                        key={log.id}
                        className={`p-2 rounded border transition-colors ${
                          isErr
                            ? 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                            : isWarn
                            ? 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                            : isResult
                            ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                            : 'bg-slate-900/60 border-slate-800/60 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 border-b border-slate-800/40 pb-1">
                          <div className="flex items-center gap-1.5 uppercase font-semibold">
                            {isErr && <AlertCircle className="w-3 h-3 text-rose-400" />}
                            {isWarn && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                            {isResult && <Sparkles className="w-3 h-3 text-emerald-400" />}
                            <span>{log.type}</span>
                          </div>
                          <span>{log.timestamp}</span>
                        </div>

                        {/* Log Payload display */}
                        {isTable && Array.isArray(log.args[0]) ? (
                          <div className="overflow-x-auto my-1">
                            <table className="w-full text-left border-collapse text-[11px]">
                              <thead>
                                <tr className="border-b border-slate-700 text-slate-400">
                                  <th className="p-1">#</th>
                                  {Object.keys(log.args[0][0] || {}).map((k) => (
                                    <th key={k} className="p-1 font-medium">{k}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {log.args[0].map((row: any, i: number) => (
                                  <tr key={i} className="border-b border-slate-800/40 hover:bg-slate-800/30">
                                    <td className="p-1 text-slate-400">{i}</td>
                                    {Object.values(row).map((v: any, vi: number) => (
                                      <td key={vi} className="p-1 text-slate-200 font-mono">
                                        {String(v)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : isTable && typeof log.args[0] === 'object' ? (
                          <div className="overflow-x-auto my-1">
                            <table className="w-full text-left border-collapse text-[11px]">
                              <thead>
                                <tr className="border-b border-slate-700 text-slate-400">
                                  <th className="p-1">Key</th>
                                  <th className="p-1">Value</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(log.args[0]).map(([k, v], i) => (
                                  <tr key={i} className="border-b border-slate-800/40">
                                    <td className="p-1 text-slate-400">{k}</td>
                                    <td className="p-1 text-slate-200">{String(v)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {log.args.map((arg: any, argIdx: number) => (
                              <pre key={argIdx} className="whitespace-pre-wrap break-all leading-5">
                                {typeof arg === 'object'
                                  ? JSON.stringify(arg, null, 2)
                                  : String(arg)}
                              </pre>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="h-full w-full flex flex-col">
                <iframe
                  ref={iframeRef}
                  title="HTML/Canvas Sandbox Preview"
                  sandbox="allow-scripts"
                  className="w-full h-full rounded border border-slate-800 bg-slate-900"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
