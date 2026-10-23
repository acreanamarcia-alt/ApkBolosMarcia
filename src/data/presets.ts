import { CodePreset, RegexPreset } from '../types';

export const CODE_PRESETS: CodePreset[] = [
  {
    id: 'quicksort',
    name: 'Quick Sort Algorithm',
    category: 'Algorithms',
    description: 'In-place partitioning with detailed step logging and performance metric',
    language: 'javascript',
    code: `// QuickSort with performance benchmark and step tracking;
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;

  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}

// Generate random sample
const sample = Array.from({ length: 15 }, () => Math.floor(Math.random() * 100));
console.log("Original array:", sample);

console.time("Execution Time");
const sorted = quickSort([...sample]);
console.timeEnd("Execution Time");

console.log("Sorted array:  ", sorted);
console.table({
  "Total Elements": sample.length,
  "Min Value": Math.min(...sorted),
  "Max Value": Math.max(...sorted),
  "Median": sorted[Math.floor(sorted.length / 2)]
});
`,
  },
  {
    id: 'canvas-particles',
    name: 'Interactive Canvas Particle Swarm',
    category: 'Graphics / Canvas',
    description: 'Renders connected glowing particle nodes on HTML5 Canvas preview',
    language: 'html',
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; background: #090d16; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
    canvas { display: block; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .hud { position: absolute; top: 16px; left: 16px; color: #10b981; font-family: monospace; font-size: 12px; pointer-events: none; }
  </style>
</head>
<body>
  <div class="hud">● PARTICLES ACTIVE: <span id="count">0</span></div>
  <canvas id="c" width="600" height="380"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const particles = [];
    const count = 55;
    document.getElementById('count').textContent = count;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 1.5,
        hue: 150 + Math.random() * 40
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(9, 13, 22, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = \`hsl(\${p.hue}, 90%, 60%)\`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 85) {
            ctx.strokeStyle = \`hsla(160, 80%, 50%, \${1 - dist / 85})\`;
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
    id: 'event-emitter',
    name: 'Custom Typed Event Emitter',
    category: 'Architecture',
    description: 'Production-ready observer pattern implementation with once, off, and emit',
    language: 'javascript',
    code: `// Lightweight Pub/Sub Event Hub;
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(listener);
    return () => this.off(event, listener);
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener.apply(this, args);
    };
    return this.on(event, wrapper);
  }

  off(event, listener) {
    if (!this.events.has(event)) return;
    this.events.get(event).delete(listener);
  }

  emit(event, ...args) {
    if (!this.events.has(event)) return false;
    for (const listener of this.events.get(event)) {
      listener(...args);
    }
    return true;
  }
}

// Test case demonstration
const bus = new EventEmitter();

const unsubAuth = bus.on('auth:login', (user) => {
  console.log('✓ User logged in:', user.name, \`[\${user.email}]\`);
});

bus.once('system:startup', (version) => {
  console.info('🚀 System initialized version:', version);
});

bus.emit('system:startup', '3.4.1');
bus.emit('system:startup', 'SHOULD_NOT_FIRE'); // Once only fired once

bus.emit('auth:login', { name: 'Ada Lovelace', email: 'ada@computing.org' });
unsubAuth();
bus.emit('auth:login', { name: 'Grace Hopper', email: 'grace@navy.mil' }); // Already unsubscribed
`,
  },
  {
    id: 'async-pipeline',
    name: 'Async Task Pool & Rate Limiter',
    category: 'Concurrency',
    description: 'Concurrent promise execution with max concurrency throttle',
    language: 'javascript',
    code: `// Concurrent Promise Pool Limiter;
async function mapConcurrent(items, limit, asyncFn) {
  const results = new Array(items.length);
  let currentIndex = 0;

  async function worker(workerId) {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      console.log(\`[Worker \${workerId}] Processing task #\${idx + 1} (\${items[idx]})...\`);
      results[idx] = await asyncFn(items[idx], idx);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, (_, i) => worker(i + 1));
  await Promise.all(workers);
  return results;
}

// Simulation with 8 network requests and limit 3
const tasks = ['Fetch User', 'Fetch Orders', 'Fetch Analytics', 'Fetch Logs', 'Calculate Tax', 'Generate Invoice', 'Sync Cache', 'Send Webhook'];

async function simulateWork(name) {
  const delay = 100 + Math.random() * 200;
  await new Promise(r => setTimeout(r, delay));
  return { task: name, durationMs: Math.round(delay), status: 'OK' };
}

(async () => {
  console.log('Starting pool with max concurrency = 3...');
  console.time('Total Batch Time');
  const finished = await mapConcurrent(tasks, 3, simulateWork);
  console.timeEnd('Total Batch Time');
  console.table(finished);
})();
`,
  },
  {
    id: 'deep-clone',
    name: 'Circular-Safe Deep Clone',
    category: 'Utilities',
    description: 'Handles circular references, Dates, RegExps, Maps, and Sets',
    language: 'javascript',
    code: `function deepClone(obj, hash = new WeakMap()) {
  if (Object(obj) !== obj) return obj; // Primitives
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
  if (obj instanceof Set) {
    const copy = new Set();
    obj.forEach(val => copy.add(deepClone(val, hash)));
    return copy;
  }
  if (obj instanceof Map) {
    const copy = new Map();
    obj.forEach((val, key) => copy.set(key, deepClone(val, hash)));
    return copy;
  }
  if (hash.has(obj)) return hash.get(obj); // Circular ref handle

  const result = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, result);

  for (const key of Reflect.ownKeys(obj)) {
    result[key] = deepClone(obj[key], hash);
  }
  return result;
}

// Test with circular reference & diverse types
const source = {
  name: 'Semicolon Object',
  created: new Date(),
  flags: /test/gi,
  tags: new Set(['fast', 'pure', 'robust']),
  meta: {
    nested: true,
    count: 42
  }
};
source.self = source; // Circular reference!

const cloned = deepClone(source);
console.log('Cloned successfully!', cloned.name);
console.log('Is deep copy (different reference)?', cloned !== source);
console.log('Is nested meta different reference?', cloned.meta !== source.meta);
console.log('Circular reference holds in clone?', cloned.self === cloned);
`,
  }
];

export const REGEX_PRESETS: RegexPreset[] = [
  {
    name: 'Email Address (RFC 5322 standard)',
    pattern: '[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+',
    flags: 'g',
    testSample: 'Contact us at team@example.com or support@sub.domain.co.uk. Invalid: test@, @domain.com',
    description: 'Matches standard internet email addresses',
  },
  {
    name: 'Semantic Versioning (SemVer)',
    pattern: 'v?(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?',
    flags: 'g',
    testSample: 'Released v1.0.0, 2.14.3-beta.1+build.2026, and 0.9.5-rc.2. Ignore: 1.2, 01.2.3',
    description: 'Matches official semver v2.0.0 specifications with pre-release and build tags',
  },
  {
    name: 'URL / Web Links',
    pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)',
    flags: 'gi',
    testSample: 'Visit https://github.com/project or http://localhost:3000/api?user=42&sort=asc now!',
    description: 'Finds HTTP and HTTPS URLs with query strings and paths',
  },
  {
    name: 'Hex Color Codes',
    pattern: '#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b',
    flags: 'gi',
    testSample: 'Styles: #fff, #10b981, #f43f5e88 (with alpha), and #0f172a. Invalid: #gg0011',
    description: 'Extracts 3, 4, 6, and 8-digit hexadecimal color codes',
  },
  {
    name: 'UUID / GUID v4',
    pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}',
    flags: 'gi',
    testSample: 'Session ID: 41b6c86a-72bf-4f11-9e23-64a8563f8e12. Test token: c1234567-89ab-4cde-8f01-23456789abcd',
    description: 'Validates RFC 4122 compliant version 4 UUIDs',
  },
  {
    name: 'IPv4 Address with Port',
    pattern: '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}(?::[0-9]{1,5})?',
    flags: 'g',
    testSample: 'Server connected to 192.168.1.1:8080 and router at 10.0.0.1. DNS at 8.8.8.8.',
    description: 'Detects IPv4 addresses with optional port numbers',
  },
  {
    name: 'ISO 8601 Date & Timestamp',
    pattern: '\\d{4}-\\d{2}-\\d{2}(?:T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})?)?',
    flags: 'g',
    testSample: 'Created on 2026-10-22T16:40:00.000Z and modified on 2026-10-23.',
    description: 'Matches international ISO date and UTC timestamps',
  },
  {
    name: 'HTML / XML Tags & Attributes',
    pattern: '<([a-zA-Z0-9]+)(\\s+[^>]*)?>(.*?)<\\/\\1>|<([a-zA-Z0-9]+)(\\s+[^>]*)?\\/>',
    flags: 'gi',
    testSample: '<div class="banner"><span>Hello World</span><img src="/logo.png" /></div>',
    description: 'Parses open/close and self-closing HTML/XML elements',
  }
];
