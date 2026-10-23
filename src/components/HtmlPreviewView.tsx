import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCw, 
  Maximize2, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Layout, 
  Code2, 
  Eye, 
  Copy, 
  Check, 
  Download, 
  FileCode,
  Terminal,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface HtmlPreviewViewProps {
  onNotify: (msg: string) => void;
  initialHtml?: string;
}

interface HtmlPreset {
  id: string;
  name: string;
  description: string;
  html: string;
}

const HTML_PRESETS: HtmlPreset[] = [
  {
    id: 'manus-file-2',
    name: 'Manus File 2: Dashboard v2.0 (Optimized)',
    description: 'The updated Manus analytics dashboard with system metrics, live badges, and grid layout',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>System Dashboard v2.0 - Manus</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      background: #090d16;
      color: #f1f5f9;
      min-height: 100vh;
      padding: 2.5rem 2rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 1.5rem;
    }
    .title-group h1 {
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .badge-live {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #10b981;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
    }
    .pulse-dot {
      width: 6px;
      height: 6px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }
    .subtitle {
      color: #64748b;
      font-size: 0.875rem;
      margin-top: 0.35rem;
      font-family: monospace;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.2s ease;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }
    .card:hover {
      border-color: #374151;
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
    }
    .card-label {
      color: #9ca3af;
      font-size: 0.85rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }
    .card-val {
      font-size: 2.25rem;
      font-weight: 700;
      color: #f9fafb;
      font-family: "JetBrains Mono", monospace;
    }
    .card-val.accent {
      color: #10b981;
    }
    .card-val.cyan {
      color: #38bdf8;
    }
    .card-foot {
      margin-top: 0.75rem;
      font-size: 0.8rem;
      color: #10b981;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .chart-box {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .chart-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }
    .chart-bars {
      display: flex;
      align-items: flex-end;
      height: 140px;
      gap: 0.75rem;
      padding-top: 1rem;
    }
    .bar {
      flex: 1;
      background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%);
      border-radius: 4px 4px 0 0;
      transition: height 0.5s ease;
      position: relative;
    }
    .bar:hover {
      background: linear-gradient(180deg, #10b981 0%, #059669 100%);
    }
    .bar-label {
      position: absolute;
      bottom: -22px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.7rem;
      color: #64748b;
      font-family: monospace;
    }
    .btn-action {
      background: #10b981;
      color: #090d16;
      border: none;
      padding: 0.5rem 1rem;
      font-weight: 600;
      font-size: 0.85rem;
      border-radius: 6px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-action:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title-group">
      <h1>
        Operational Metrics (v2.0)
        <span class="badge-live"><span class="pulse-dot"></span> REALTIME</span>
      </h1>
      <div class="subtitle">Session: f6d6eee5-4d71-4210-8c12-065464a1fa65 · Verified Stream</div>
    </div>
    <button class="btn-action" onclick="refreshMetrics()">Simulate Burst</button>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-label">Active Users</div>
      <div class="card-val accent" id="users">28,540</div>
      <div class="card-foot">↑ +14.2% from last cycle</div>
    </div>
    <div class="card">
      <div class="card-label">API Latency (p99)</div>
      <div class="card-val cyan" id="latency">18.4 ms</div>
      <div class="card-foot">↓ 4.6ms faster than baseline</div>
    </div>
    <div class="card">
      <div class="card-label">System Uptime</div>
      <div class="card-val">99.99%</div>
      <div class="card-foot">No incidents recorded in 30d</div>
    </div>
    <div class="card">
      <div class="card-label">Throughput</div>
      <div class="card-val" id="tps">4.8k req/s</div>
      <div class="card-foot">Auto-scaling healthy</div>
    </div>
  </div>

  <div class="chart-box">
    <div class="chart-header">
      <h3 style="font-size: 1rem; font-weight: 600;">Hourly Request Load Distribution</h3>
      <span style="font-size: 0.8rem; color: #64748b; font-family: monospace;">UTC-07:00</span>
    </div>
    <div class="chart-bars" id="bars">
      <div class="bar" style="height: 45%;"><span class="bar-label">12:00</span></div>
      <div class="bar" style="height: 60%;"><span class="bar-label">13:00</span></div>
      <div class="bar" style="height: 75%;"><span class="bar-label">14:00</span></div>
      <div class="bar" style="height: 90%;"><span class="bar-label">15:00</span></div>
      <div class="bar" style="height: 65%;"><span class="bar-label">16:00</span></div>
      <div class="bar" style="height: 85%;"><span class="bar-label">17:00</span></div>
      <div class="bar" style="height: 98%;"><span class="bar-label">18:00</span></div>
      <div class="bar" style="height: 80%;"><span class="bar-label">19:00</span></div>
    </div>
  </div>

  <script>
    function refreshMetrics() {
      const u = 28000 + Math.floor(Math.random() * 2500);
      const l = (14 + Math.random() * 8).toFixed(1);
      const t = (4.2 + Math.random() * 1.5).toFixed(1);
      document.getElementById('users').textContent = u.toLocaleString();
      document.getElementById('latency').textContent = l + ' ms';
      document.getElementById('tps').textContent = t + 'k req/s';
      
      const bars = document.querySelectorAll('.bar');
      bars.forEach(b => {
        b.style.height = (35 + Math.random() * 60) + '%';
      });
      console.log('Metrics refreshed:', { users: u, latency: l + 'ms', tps: t });
    }
  </script>
</body>
</html>`,
  },
  {
    id: 'manus-file-1',
    name: 'Manus File 1: Dashboard v1.0 (Baseline)',
    description: 'The baseline overview dashboard from the initial Manus file generation',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>System Overview v1.0</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      padding: 3rem 2rem;
      line-height: 1.5;
    }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { font-size: 1.875rem; font-weight: 700; margin-bottom: 0.5rem; }
    p.meta { color: #94a3b8; font-size: 0.875rem; margin-bottom: 2rem; }
    .metric {
      background: #1e293b;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.25rem;
      border: 1px solid #334155;
    }
    .label { font-size: 0.875rem; color: #94a3b8; text-transform: uppercase; font-weight: 600; }
    .value { font-size: 2.25rem; font-weight: 700; color: #38bdf8; margin-top: 0.25rem; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <h1>System Overview (v1.0)</h1>
    <p class="meta">Artifact ID: 45557239-814d-4c08-bf81-d36e4e040406</p>
    
    <div class="metric">
      <div class="label">Total Users</div>
      <div class="value">14,290</div>
    </div>
    
    <div class="metric">
      <div class="label">API Latency</div>
      <div class="value">42ms</div>
    </div>

    <div class="metric">
      <div class="label">Cache Hit Ratio</div>
      <div class="value">88.4%</div>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'canvas-particles',
    name: 'Interactive Canvas Particle Swarm',
    description: 'Dynamic physics-based particle connections with mouse interaction',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; }
    body { background: #030712; overflow: hidden; height: 100vh; font-family: monospace; }
    #hud {
      position: absolute;
      top: 16px;
      left: 16px;
      color: #34d399;
      font-size: 13px;
      z-index: 10;
      pointer-events: none;
      background: rgba(3, 7, 18, 0.7);
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid rgba(52, 211, 153, 0.3);
    }
  </style>
</head>
<body>
  <div id="hud">● SWARM SIMULATION · MOVE CURSOR TO ATTRACT</div>
  <canvas id="canvas"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 75;
    const mouse = { x: width / 2, y: height / 2, active: false };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 2.5 + 1,
        hue: 160 + Math.random() * 40
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.2)';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            p.vx += (dx / dist) * 0.15;
            p.vy += (dy / dist) * 0.15;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = \`hsl(\${p.hue}, 90%, 65%)\`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.strokeStyle = \`hsla(170, 80%, 55%, \${1 - dist / 100})\`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  </script>
</body>
</html>`,
  },
  {
    id: 'saas-card-hero',
    name: 'Modern Neo-Brutalist Card Component',
    description: 'Clean responsive pricing card layout with interactive hover states',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #020617;
      font-family: system-ui, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 2.5rem;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
    }
    .badge {
      display: inline-block;
      background: #10b981;
      color: #020617;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1.25rem;
    }
    h2 { font-size: 1.75rem; color: #f8fafc; margin-bottom: 0.5rem; font-weight: 700; }
    p.desc { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin-bottom: 2rem; }
    .price { font-size: 3rem; font-weight: 800; color: #f8fafc; font-family: monospace; }
    .price span { font-size: 1rem; color: #64748b; font-weight: normal; }
    ul { list-style: none; margin: 2rem 0; }
    li { color: #cbd5e1; font-size: 0.95rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.75rem; }
    li::before { content: "✓"; color: #10b981; font-weight: bold; }
    button {
      width: 100%;
      background: #38bdf8;
      color: #020617;
      font-weight: 700;
      padding: 0.85rem;
      border-radius: 8px;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    button:hover { background: #7dd3fc; transform: translateY(-1px); }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">PRO SUITE</div>
    <h2>Developer Pro</h2>
    <p class="desc">Unlimited playground executions, full AST transforms, and shared artifact tunnels.</p>
    <div class="price">$29<span>/month</span></div>
    <ul>
      <li>Full access to Regex & Sandbox engines</li>
      <li>Instant Dual-File diff comparator</li>
      <li>Local storage snippet vault sync</li>
      <li>Zero rate limits on AST transforms</li>
    </ul>
    <button onclick="alert('Trial activated successfully!')">Start 14-Day Free Trial</button>
  </div>
</body>
</html>`,
  }
];

export const HtmlPreviewView: React.FC<HtmlPreviewViewProps> = ({
  onNotify,
  initialHtml,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('manus-file-2');
  const [htmlCode, setHtmlCode] = useState<string>(initialHtml || HTML_PRESETS[0].html);
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'code'>('split');
  const [viewport, setViewport] = useState<'100%' | '1024px' | '768px' | '375px'>('100%');
  const [autoRun, setAutoRun] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // If initialHtml is passed from outside
  useEffect(() => {
    if (initialHtml) {
      setHtmlCode(initialHtml);
      handleRunPreview();
    }
  }, [initialHtml]);

  // Inject message listener from iframe to capture console.log
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'IFRAME_CONSOLE') {
        setConsoleLogs(prev => [...prev.slice(-40), `[${e.data.level.toUpperCase()}] ${e.data.message}`]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const getInstrumentedHtml = (rawHtml: string) => {
    // Inject lightweight bridge for console logs
    const consoleBridge = `
      <script>
        (function() {
          const originalLog = console.log;
          const originalWarn = console.warn;
          const originalError = console.error;
          console.log = function(...args) {
            window.parent.postMessage({ type: 'IFRAME_CONSOLE', level: 'log', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
            originalLog.apply(console, args);
          };
          console.warn = function(...args) {
            window.parent.postMessage({ type: 'IFRAME_CONSOLE', level: 'warn', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
            originalWarn.apply(console, args);
          };
          console.error = function(...args) {
            window.parent.postMessage({ type: 'IFRAME_CONSOLE', level: 'error', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
            originalError.apply(console, args);
          };
        })();
      </script>
    `;

    if (rawHtml.includes('<head>')) {
      return rawHtml.replace('<head>', '<head>' + consoleBridge);
    }
    return consoleBridge + rawHtml;
  };

  const handleRunPreview = () => {
    setIframeKey(k => k + 1);
    if (iframeRef.current) {
      iframeRef.current.srcdoc = getInstrumentedHtml(htmlCode);
    }
    onNotify('HTML preview updated & running');
  };

  // Run on mount
  useEffect(() => {
    handleRunPreview();
  }, []);

  // Debounced auto-run if enabled
  useEffect(() => {
    if (!autoRun) return;
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = getInstrumentedHtml(htmlCode);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [htmlCode, autoRun]);

  // Keyboard shortcut Cmd/Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunPreview();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [htmlCode]);

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const p = HTML_PRESETS.find(x => x.id === id);
    if (p) {
      setHtmlCode(p.html);
      setConsoleLogs([]);
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = getInstrumentedHtml(p.html);
        }
      }, 50);
      onNotify(`Loaded: ${p.name}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onNotify('Copied HTML code');
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedPresetId}.html`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify(`Downloaded ${selectedPresetId}.html`);
  };

  // Tab key indent in textarea
  const handleKeyDownTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      target.value = target.value.substring(0, start) + '  ' + target.value.substring(end);
      target.selectionStart = target.selectionEnd = start + 2;
      setHtmlCode(target.value);
    }
  };

  const lineCount = htmlCode.split('\n').length;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-53px)] bg-slate-950 text-slate-200 overflow-hidden">
      {/* Top Controls Toolbar */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Preset Selector */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <Eye className="w-4 h-4" />
            <span className="text-slate-300">HTML Source:</span>
          </div>
          <select
            value={selectedPresetId}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
          >
            {HTML_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Viewport size buttons */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 border border-slate-700/80 rounded-lg p-0.5">
          {[
            { id: '100%', label: 'Full', icon: <Monitor className="w-3.5 h-3.5" /> },
            { id: '1024px', label: '1024px', icon: <Monitor className="w-3.5 h-3.5" /> },
            { id: '768px', label: '768px', icon: <Tablet className="w-3.5 h-3.5" /> },
            { id: '375px', label: '375px', icon: <Smartphone className="w-3.5 h-3.5" /> },
          ].map((vp) => (
            <button
              key={vp.id}
              onClick={() => setViewport(vp.id as any)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                viewport === vp.id
                  ? 'bg-slate-700 text-emerald-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {vp.icon}
              <span>{vp.label}</span>
            </button>
          ))}
        </div>

        {/* View Mode (Split, Preview Only, Code Only) */}
        <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/80 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
              viewMode === 'split' ? 'bg-slate-700 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Split</span>
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
              viewMode === 'preview' ? 'bg-slate-700 text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Only</span>
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
              viewMode === 'code' ? 'bg-slate-700 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Code</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Console toggle button */}
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`p-1.5 rounded-md border text-xs flex items-center gap-1 transition-colors ${
              showConsole || consoleLogs.length > 0
                ? 'bg-slate-800 text-emerald-400 border-slate-700'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Iframe Console"
          >
            <Terminal className="w-3.5 h-3.5" />
            {consoleLogs.length > 0 && (
              <span className="text-[10px] bg-emerald-950/60 text-emerald-300 px-1 rounded font-mono">
                {consoleLogs.length}
              </span>
            )}
          </button>

          <button
            onClick={handleCopy}
            title="Copy HTML"
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 border border-slate-700 rounded-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownload}
            title="Download .html file"
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 border border-slate-700 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Auto-run checkbox */}
          <label className="hidden lg:flex items-center gap-1.5 cursor-pointer text-slate-400 select-none text-[11px] px-1">
            <input
              type="checkbox"
              checked={autoRun}
              onChange={(e) => setAutoRun(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
            />
            <span>Auto-refresh</span>
          </label>

          {/* Run / Reload Button */}
          <button
            onClick={handleRunPreview}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-md shadow-sm transition-all active:scale-95"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Run Preview</span>
            <kbd className="text-[10px] bg-emerald-600/60 text-slate-950 px-1 rounded font-mono">
              ⌘↵
            </kbd>
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Code Editor Pane (shown in 'split' or 'code') */}
        {(viewMode === 'split' || viewMode === 'code') && (
          <div className={`${viewMode === 'code' ? 'w-full' : 'w-full md:w-1/2'} flex flex-col h-full bg-slate-950/80 border-r border-slate-800 overflow-hidden`}>
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/50 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-medium">index.html</span>
                <span className="text-slate-600">·</span>
                <span>{lineCount} lines</span>
                <span className="text-slate-600">·</span>
                <span>{htmlCode.length} bytes</span>
              </div>
              <span className="text-emerald-400/90 font-mono">HTML / CSS / JS</span>
            </div>

            <div className="flex-1 relative overflow-auto flex">
              {/* Line numbers column */}
              <div className="w-10 py-3 pr-2 select-none text-right font-mono text-[11px] text-slate-600 bg-slate-950/40 border-r border-slate-800/40">
                {Array.from({ length: lineCount }).map((_, i) => (
                  <div key={i} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                onKeyDown={handleKeyDownTextarea}
                spellCheck={false}
                className="flex-1 p-3 bg-transparent font-mono text-[12px] leading-6 text-slate-100 placeholder-slate-600 outline-none resize-none code-textarea"
                placeholder="<!DOCTYPE html><html>..."
              />
            </div>
          </div>
        )}

        {/* Live Preview Iframe Pane (shown in 'split' or 'preview') */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`${viewMode === 'preview' ? 'w-full' : 'w-full md:w-1/2'} flex flex-col h-full bg-slate-900/40 overflow-hidden relative`}>
            {/* Top Preview Status Bar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/70 border-b border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-200">Live Web Runtime</span>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-emerald-400">Sandbox Active</span>
              </div>
              <div className="font-mono text-slate-400">
                Viewport: {viewport === '100%' ? 'Responsive' : viewport}
              </div>
            </div>

            {/* Centered Iframe container based on viewport size */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-2 bg-slate-950/60">
              <div
                style={{
                  width: viewport,
                  maxWidth: '100%',
                  height: '100%',
                  transition: 'width 0.25s ease-in-out',
                }}
                className="rounded-lg overflow-hidden border border-slate-800 shadow-2xl bg-white flex flex-col relative"
              >
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  title="HTML Live Execution Preview"
                  sandbox="allow-scripts allow-forms allow-modals allow-same-origin"
                  className="w-full h-full border-none"
                />
              </div>
            </div>

            {/* Collapsible Console Drawer */}
            {showConsole && (
              <div className="h-44 bg-slate-950 border-t border-slate-800 flex flex-col overflow-hidden">
                <div className="px-3 py-1.5 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>IFRAME CONSOLE OUTPUT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConsoleLogs([])}
                      className="text-[11px] hover:text-slate-200"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowConsole(false)}
                      className="text-[11px] hover:text-slate-200"
                    >
                      ✕ Close
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] space-y-1 text-slate-300">
                  {consoleLogs.length === 0 ? (
                    <div className="text-slate-400 italic">No console output recorded yet.</div>
                  ) : (
                    consoleLogs.map((log, i) => (
                      <div key={i} className="leading-5 border-b border-slate-900 pb-0.5">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
