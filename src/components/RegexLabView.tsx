import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Replace, 
  Copy, 
  Check, 
  AlertCircle, 
  BookOpen, 
  Layers,
  Sparkles
} from 'lucide-react';
import { REGEX_PRESETS } from '../data/presets';

interface RegexLabViewProps {
  onNotify: (msg: string) => void;
}

export const RegexLabView: React.FC<RegexLabViewProps> = ({ onNotify }) => {
  const [pattern, setPattern] = useState<string>(REGEX_PRESETS[0].pattern);
  const [flags, setFlags] = useState<string>(REGEX_PRESETS[0].flags);
  const [testText, setTestText] = useState<string>(REGEX_PRESETS[0].testSample);
  const [replacement, setReplacement] = useState<string>('[$&]');
  const [selectedPreset, setSelectedPreset] = useState<string>(REGEX_PRESETS[0].name);
  const [copied, setCopied] = useState(false);
  const [showCheatsheet, setShowCheatsheet] = useState(false);

  // Parse regex safely
  const { regex, error, matches } = useMemo(() => {
    try {
      const reg = new RegExp(pattern, flags);
      const mList: { text: string; index: number; groups: Record<string, string> | null }[] = [];

      if (flags.includes('g')) {
        let match: RegExpExecArray | null;
        let count = 0;
        while ((match = reg.exec(testText)) !== null && count < 200) {
          mList.push({
            text: match[0],
            index: match.index,
            groups: match.groups ? { ...match.groups } : null,
          });
          if (match.index === reg.lastIndex) {
            reg.lastIndex++;
          }
          count++;
        }
      } else {
        const match = reg.exec(testText);
        if (match) {
          mList.push({
            text: match[0],
            index: match.index,
            groups: match.groups ? { ...match.groups } : null,
          });
        }
      }

      return { regex: reg, error: null, matches: mList };
    } catch (err: any) {
      return { regex: null, error: err.message || 'Invalid regular expression', matches: [] };
    }
  }, [pattern, flags, testText]);

  // Substitution result
  const substitutedText = useMemo(() => {
    if (!regex || error) return testText;
    try {
      return testText.replace(regex, replacement);
    } catch {
      return testText;
    }
  }, [regex, error, testText, replacement]);

  const handleSelectPreset = (name: string) => {
    setSelectedPreset(name);
    const p = REGEX_PRESETS.find(x => x.name === name);
    if (p) {
      setPattern(p.pattern);
      setFlags(p.flags);
      setTestText(p.testSample);
      onNotify(`Loaded regex: ${p.name}`);
    }
  };

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-53px)] bg-slate-950 text-slate-200 overflow-hidden">
      {/* Top Toolbar */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Search className="w-4 h-4 text-emerald-400" />
            <span className="font-medium text-slate-300">Preset Library:</span>
          </div>
          <select
            value={selectedPreset}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
          >
            {REGEX_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCheatsheet(!showCheatsheet)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              showCheatsheet
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Regex Cheatsheet</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-hidden">
        {/* Left Column: Pattern & Text input (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-full overflow-y-auto p-4 space-y-4">
          {/* Pattern Input Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Regular Expression</span>
              {error ? (
                <span className="text-rose-400 flex items-center gap-1 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </span>
              ) : (
                <span className="text-emerald-400 text-[11px]">Valid Syntax</span>
              )}
            </div>

            <div className="flex items-center gap-2 font-mono text-sm bg-slate-950 px-3 py-2 rounded border border-slate-800 focus-within:border-emerald-500">
              <span className="text-emerald-500 font-bold select-none">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="flex-1 bg-transparent text-emerald-300 outline-none font-mono text-xs"
                placeholder="Write regex pattern..."
                spellCheck={false}
              />
              <span className="text-emerald-500 font-bold select-none">/</span>
              <span className="text-amber-400 select-none font-semibold">{flags}</span>
            </div>

            {/* Flag toggles */}
            <div className="flex items-center gap-3 pt-1 text-xs">
              <span className="text-slate-400 font-medium">Flags:</span>
              {[
                { flag: 'g', label: 'Global (g)' },
                { flag: 'i', label: 'Case-Insensitive (i)' },
                { flag: 'm', label: 'Multiline (m)' },
                { flag: 's', label: 'DotAll (s)' },
                { flag: 'u', label: 'Unicode (u)' },
              ].map(({ flag, label }) => {
                const isChecked = flags.includes(flag);
                return (
                  <button
                    key={flag}
                    onClick={() => toggleFlag(flag)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      isChecked
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-300 border border-slate-700/60'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Text Input */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Test Text Sample</span>
              <span>{testText.length} characters</span>
            </div>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              spellCheck={false}
              rows={6}
              className="w-full flex-1 p-2.5 bg-slate-950 font-mono text-xs leading-5 text-slate-200 border border-slate-800 rounded outline-none focus:border-emerald-500 resize-none code-textarea"
              placeholder="Paste text to test matching against..."
            />
          </div>

          {/* Substitution / Replacement */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Replace className="w-3.5 h-3.5 text-emerald-400" />
                Substitution Preview
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Use $& for match, $1 for capture group</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                placeholder="Replacement string (e.g. [$1])"
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(substitutedText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                  onNotify('Copied substituted text');
                }}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Result</span>
              </button>
            </div>

            <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded font-mono text-xs text-slate-300 whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
              {substitutedText}
            </div>
          </div>
        </div>

        {/* Right Column: Matches & Breakdown & Cheatsheet (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full bg-slate-900/40 overflow-y-auto p-4 space-y-4">
          {/* Match summary header */}
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">Match Results</span>
            </div>
            <span className="text-emerald-400 font-mono font-medium">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
            </span>
          </div>

          {/* Cheatsheet Modal or Drawer if toggled */}
          {showCheatsheet && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
              <div className="font-semibold text-slate-200 text-xs">Regex Quick Reference</div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                <div><code>\\d</code> : Digit (0-9)</div>
                <div><code>\\w</code> : Word char</div>
                <div><code>\\s</code> : Whitespace</div>
                <div><code>^ / $</code> : Start / End</div>
                <div><code>[a-z]</code> : Range</div>
                <div><code>(abc)</code> : Group</div>
                <div><code>* / + / ?</code> : 0+, 1+, 0 or 1</div>
                <div><code>{'{n,m}'}</code> : Quantifier</div>
              </div>
            </div>
          )}

          {/* Match List */}
          <div className="space-y-2 flex-1">
            {matches.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No matches found for current pattern.
              </div>
            ) : (
              matches.map((m, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-emerald-400 font-semibold">Match #{idx + 1}</span>
                    <span className="font-mono">Index: {m.index}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded font-mono text-xs text-slate-100 break-all border border-slate-800/60">
                    {m.text}
                  </div>
                  {m.groups && Object.keys(m.groups).length > 0 && (
                    <div className="pt-1 space-y-1">
                      <div className="text-[10px] text-slate-400 font-medium">Named Groups:</div>
                      {Object.entries(m.groups).map(([gName, gVal]) => (
                        <div key={gName} className="flex items-center justify-between text-[11px] font-mono bg-slate-950/60 px-2 py-0.5 rounded">
                          <span className="text-amber-400">{gName}:</span>
                          <span className="text-slate-200">{gVal}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
