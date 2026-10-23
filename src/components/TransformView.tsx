import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  KeyRound, 
  Hash, 
  Type, 
  Table, 
  Copy, 
  Check, 
  AlertCircle, 
  Sparkles,
  FileJson,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { 
  formatJson, 
  minifyJson, 
  encodeBase64, 
  decodeBase64, 
  encodeUrl, 
  decodeUrl, 
  parseJwt, 
  convertTextCase, 
  computeHash, 
  generateUuids, 
  csvToJson, 
  jsonToCsv 
} from '../utils/transformers';

interface TransformViewProps {
  onNotify: (msg: string) => void;
}

type TabType = 'json' | 'jwt' | 'base64' | 'crypto' | 'casing' | 'csv';

export const TransformView: React.FC<TransformViewProps> = ({ onNotify }) => {
  const [activeTab, setActiveTab] = useState<TabType>('json');
  const [copied, setCopied] = useState<string | null>(null);

  // JSON state
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify({ project: "Semicolon", version: "1.0.0", features: ["Playground", "Regex", "Transformers"], active: true }, null, 2)
  );
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // JWT state
  const [jwtInput, setJwtInput] = useState<string>(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDgwMDAwMDAwfQ.X5Vl2t7G3yS0Y-kG8FmI8nJ9K1x2Y3Z4'
  );

  // Base64 & URL state
  const [b64Input, setB64Input] = useState<string>('Hello Semicolon! Developer Scratchpad & Syntax Lab');
  const [b64Output, setB64Output] = useState<string>('');

  // Crypto / Hash state
  const [hashInput, setHashInput] = useState<string>('The quick brown fox jumps over the lazy dog');
  const [hashes, setHashes] = useState<{ sha256: string; sha512: string; sha1: string }>({ sha256: '', sha512: '', sha1: '' });
  const [uuids, setUuids] = useState<string[]>([]);

  // Text Casing state
  const [casingInput, setCasingInput] = useState<string>('user profile activity status');

  // CSV state
  const [csvInput, setCsvInput] = useState<string>(
    'id,name,role,status\n101,Ada Lovelace,Chief Architect,active\n102,Alan Turing,Cryptanalyst,active\n103,Grace Hopper,Systems Engineer,lead'
  );
  const [csvOutput, setCsvOutput] = useState<string>('');

  // Auto-compute hashes
  useEffect(() => {
    (async () => {
      try {
        const sha256 = await computeHash(hashInput, 'SHA-256');
        const sha512 = await computeHash(hashInput, 'SHA-512');
        const sha1 = await computeHash(hashInput, 'SHA-1');
        setHashes({ sha256, sha512, sha1 });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [hashInput]);

  // Initial UUIDs
  useEffect(() => {
    setUuids(generateUuids(5));
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    onNotify('Copied to clipboard');
  };

  // JWT parsed
  const decodedJwt = parseJwt(jwtInput);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-53px)] bg-slate-950 text-slate-200 overflow-hidden">
      {/* Sub Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto text-xs">
        <div className="flex items-center gap-1">
          {[
            { id: 'json', label: 'JSON Tools', icon: <FileJson className="w-3.5 h-3.5" /> },
            { id: 'jwt', label: 'JWT Inspector', icon: <KeyRound className="w-3.5 h-3.5" /> },
            { id: 'base64', label: 'Base64 & URL', icon: <ArrowLeftRight className="w-3.5 h-3.5" /> },
            { id: 'crypto', label: 'Hash & UUID', icon: <Hash className="w-3.5 h-3.5" /> },
            { id: 'casing', label: 'Text Casing', icon: <Type className="w-3.5 h-3.5" /> },
            { id: 'csv', label: 'CSV ↔ JSON', icon: <Table className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto p-4 max-w-6xl w-full mx-auto">
        {/* JSON TAB */}
        {activeTab === 'json' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200">JSON Formatter, Validator & Minifier</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const res = formatJson(jsonInput, 2);
                    if (res.error) setJsonError(res.error);
                    else {
                      setJsonError(null);
                      setJsonInput(res.formatted!);
                      onNotify('JSON formatted with 2 spaces');
                    }
                  }}
                  className="px-2.5 py-1 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded"
                >
                  Pretty Print (2 Spaces)
                </button>
                <button
                  onClick={() => {
                    const res = minifyJson(jsonInput);
                    if (res.error) setJsonError(res.error);
                    else {
                      setJsonError(null);
                      setJsonInput(res.formatted!);
                      onNotify('JSON minified to 1 line');
                    }
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                >
                  Minify
                </button>
                <button
                  onClick={() => copyToClipboard(jsonInput, 'json')}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                >
                  {copied === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {jsonError && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{jsonError}</span>
              </div>
            )}

            <div className="h-[480px] bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
              <textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setJsonError(null);
                }}
                spellCheck={false}
                className="w-full h-full p-4 bg-transparent font-mono text-xs leading-5 text-slate-100 outline-none resize-none code-textarea"
                placeholder="Paste JSON here..."
              />
            </div>
          </div>
        )}

        {/* JWT TAB */}
        {activeTab === 'jwt' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-200">Encoded JWT Token</span>
                <span className="text-xs text-slate-400">Paste your JSON Web Token to inspect claims</span>
              </div>
              <textarea
                value={jwtInput}
                onChange={(e) => setJwtInput(e.target.value)}
                spellCheck={false}
                rows={3}
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs text-amber-300 outline-none focus:border-emerald-500 code-textarea"
                placeholder="Paste Bearer JWT token..."
              />
            </div>

            {decodedJwt.error ? (
              <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{decodedJwt.error}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Header */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-rose-400 font-semibold border-b border-slate-800 pb-1">
                    <span>Header (Algorithm & Token Type)</span>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(decodedJwt.header, null, 2), 'jwt-hdr')}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      {copied === 'jwt-hdr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <pre className="p-2 bg-slate-950 rounded font-mono text-xs text-rose-300 overflow-x-auto">
                    {JSON.stringify(decodedJwt.header, null, 2)}
                  </pre>
                </div>

                {/* Payload */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-purple-400 font-semibold border-b border-slate-800 pb-1">
                    <span>Payload Data (Claims)</span>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(decodedJwt.payload, null, 2), 'jwt-payload')}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      {copied === 'jwt-payload' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <pre className="p-2 bg-slate-950 rounded font-mono text-xs text-purple-300 overflow-x-auto">
                    {JSON.stringify(decodedJwt.payload, null, 2)}
                  </pre>

                  {/* Expiration status badge */}
                  {decodedJwt.expiresIn && (
                    <div className="flex items-center gap-2 text-xs pt-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span className={decodedJwt.isExpired ? 'text-rose-400 font-medium' : 'text-emerald-400 font-medium'}>
                        {decodedJwt.expiresIn}
                      </span>
                      {decodedJwt.expiresAt && (
                        <span className="text-slate-400 text-[11px]">({decodedJwt.expiresAt})</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* BASE64 & URL TAB */}
        {activeTab === 'base64' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>Input Text</span>
                  <span>{b64Input.length} chars</span>
                </div>
                <textarea
                  value={b64Input}
                  onChange={(e) => setB64Input(e.target.value)}
                  rows={8}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs text-slate-200 outline-none focus:border-emerald-500 resize-none code-textarea"
                  placeholder="Enter raw text to encode or base64/url to decode..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>Quick Transform Actions</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setB64Output(encodeBase64(b64Input));
                      onNotify('Base64 Encoded');
                    }}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 text-left"
                  >
                    Encode to Base64
                  </button>
                  <button
                    onClick={() => {
                      const res = decodeBase64(b64Input);
                      if (res.error) onNotify(res.error);
                      else {
                        setB64Output(res.decoded!);
                        onNotify('Base64 Decoded');
                      }
                    }}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 text-left"
                  >
                    Decode from Base64
                  </button>
                  <button
                    onClick={() => {
                      setB64Output(encodeUrl(b64Input));
                      onNotify('URL Encoded');
                    }}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-amber-400 text-left"
                  >
                    URL Encode (URIComponent)
                  </button>
                  <button
                    onClick={() => {
                      const res = decodeUrl(b64Input);
                      if (res.error) onNotify(res.error);
                      else {
                        setB64Output(res.decoded!);
                        onNotify('URL Decoded');
                      }
                    }}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-amber-400 text-left"
                  >
                    URL Decode
                  </button>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Result Output</span>
                    {b64Output && (
                      <button
                        onClick={() => copyToClipboard(b64Output, 'b64')}
                        className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      >
                        {copied === 'b64' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                    )}
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs text-slate-100 break-all min-h-[90px] max-h-48 overflow-y-auto">
                    {b64Output || '// Click any action above to generate output'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CRYPTO / HASH & UUID TAB */}
        {activeTab === 'crypto' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-slate-200">Hash Checksum Calculator</span>
              <input
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="Text to compute hash..."
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs text-slate-100 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              {[
                { label: 'SHA-256', val: hashes.sha256, id: 'h-sha256' },
                { label: 'SHA-512', val: hashes.sha512, id: 'h-sha512' },
                { label: 'SHA-1', val: hashes.sha1, id: 'h-sha1' },
              ].map(h => (
                <div key={h.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-400 font-mono">{h.label}</span>
                    <button
                      onClick={() => copyToClipboard(h.val, h.id)}
                      className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      {copied === h.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span className="text-[11px]">Copy</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-slate-300 break-all select-all">
                    {h.val}
                  </div>
                </div>
              ))}
            </div>

            {/* UUID Generator */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-slate-200">UUID v4 Generator</span>
                  <p className="text-xs text-slate-400">Cryptographically strong random UUIDs</p>
                </div>
                <button
                  onClick={() => {
                    const fresh = generateUuids(5);
                    setUuids(fresh);
                    onNotify('Generated 5 fresh UUIDs');
                  }}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded"
                >
                  Generate More
                </button>
              </div>

              <div className="space-y-1">
                {uuids.map((id, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-slate-200 hover:border-slate-700"
                  >
                    <span>{id}</span>
                    <button
                      onClick={() => copyToClipboard(id, `uuid-${index}`)}
                      className="p-1 text-slate-400 hover:text-slate-200"
                    >
                      {copied === `uuid-${index}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEXT CASING TAB */}
        {activeTab === 'casing' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-slate-200">Case Transformation Engine</span>
              <input
                type="text"
                value={casingInput}
                onChange={(e) => setCasingInput(e.target.value)}
                placeholder="Type or paste any text or variable name..."
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs text-slate-100 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { type: 'camel', label: 'camelCase', sample: convertTextCase(casingInput, 'camel') },
                { type: 'pascal', label: 'PascalCase', sample: convertTextCase(casingInput, 'pascal') },
                { type: 'kebab', label: 'kebab-case', sample: convertTextCase(casingInput, 'kebab') },
                { type: 'snake', label: 'snake_case', sample: convertTextCase(casingInput, 'snake') },
                { type: 'constant', label: 'CONSTANT_CASE', sample: convertTextCase(casingInput, 'constant') },
                { type: 'title', label: 'Title Case', sample: convertTextCase(casingInput, 'title') },
              ].map(c => (
                <div key={c.type} className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">{c.label}</div>
                    <div className="font-mono text-xs text-emerald-400 select-all">{c.sample || '—'}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(c.sample, c.type)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded"
                  >
                    {copied === c.type ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CSV <-> JSON TAB */}
        {activeTab === 'csv' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>Input Data</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const res = csvToJson(csvInput);
                        if (res.error) onNotify(res.error);
                        else {
                          setCsvOutput(res.json!);
                          onNotify(`Converted ${res.count} CSV rows to JSON`);
                        }
                      }}
                      className="px-2 py-0.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded text-[11px]"
                    >
                      CSV → JSON
                    </button>
                    <button
                      onClick={() => {
                        const res = jsonToCsv(csvInput);
                        if (res.error) onNotify(res.error);
                        else {
                          setCsvOutput(res.csv!);
                          onNotify('Converted JSON array to CSV');
                        }
                      }}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[11px]"
                    >
                      JSON → CSV
                    </button>
                  </div>
                </div>
                <textarea
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  rows={14}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs text-slate-200 outline-none focus:border-emerald-500 resize-none code-textarea"
                  placeholder="Paste CSV with header line or JSON array of objects..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>Converted Output</span>
                  {csvOutput && (
                    <button
                      onClick={() => copyToClipboard(csvOutput, 'csv-out')}
                      className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      {copied === 'csv-out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  )}
                </div>
                <textarea
                  readOnly
                  value={csvOutput}
                  rows={14}
                  className="w-full p-3 bg-slate-900/60 border border-slate-800 rounded-lg font-mono text-xs text-emerald-300 outline-none resize-none code-textarea"
                  placeholder="Output will appear here..."
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
