import { ConsoleMessage } from '../types';

export function runJavaScriptSandbox(code: string): {
  logs: ConsoleMessage[];
  returnValue?: any;
  durationMs: number;
  error?: string;
} {
  const logs: ConsoleMessage[] = [];
  const timers: Record<string, number> = {};
  const startTime = performance.now();

  const createLog = (type: ConsoleMessage['type'], ...args: any[]) => {
    logs.push({
      id: Math.random().toString(36).substring(2, 9),
      type,
      args: args.map(arg => {
        try {
          if (arg === undefined) return 'undefined';
          if (arg === null) return 'null';
          if (typeof arg === 'function') return `[Function: ${arg.name || 'anonymous'}]`;
          if (typeof arg === 'symbol') return arg.toString();
          if (arg instanceof Error) {
            return {
              name: arg.name,
              message: arg.message,
              stack: arg.stack,
            };
          }
          if (typeof arg === 'object') {
            return JSON.parse(JSON.stringify(arg, (key, value) => {
              if (typeof value === 'function') return `[Function]`;
              if (value instanceof Map) return Array.from(value.entries());
              if (value instanceof Set) return Array.from(value.values());
              return value;
            }));
          }
          return arg;
        } catch {
          return String(arg);
        }
      }),
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }),
    });
  };

  const customConsole = {
    log: (...args: any[]) => createLog('log', ...args),
    info: (...args: any[]) => createLog('info', ...args),
    warn: (...args: any[]) => createLog('warn', ...args),
    error: (...args: any[]) => createLog('error', ...args),
    table: (data: any) => createLog('table', data),
    time: (label = 'default') => {
      timers[label] = performance.now();
      createLog('info', `Timer "${label}" started`);
    },
    timeEnd: (label = 'default') => {
      if (timers[label] !== undefined) {
        const elapsed = (performance.now() - timers[label]).toFixed(2);
        createLog('info', `${label}: ${elapsed}ms`);
        delete timers[label];
      } else {
        createLog('warn', `Timer "${label}" does not exist`);
      }
    },
    clear: () => {
      logs.length = 0;
    }
  };

  try {
    // Sandboxed execution
    const wrappedCode = `
      "use strict";
      return (async function(console) {
        ${code}
      })(console);
    `;
    const runner = new Function('console', wrappedCode);
    const result = runner(customConsole);

    // If returns promise, handle synchronously or let async finish
    if (result && typeof result.then === 'function') {
      result.then((val: any) => {
        if (val !== undefined) {
          createLog('result', val);
        }
      }).catch((err: any) => {
        createLog('error', err?.message || String(err));
      });
    } else if (result !== undefined) {
      createLog('result', result);
    }

    const durationMs = performance.now() - startTime;
    return { logs, returnValue: result, durationMs };
  } catch (err: any) {
    const durationMs = performance.now() - startTime;
    createLog('error', err?.message || String(err));
    return {
      logs,
      error: err?.message || String(err),
      durationMs,
    };
  }
}

/**
 * Smart Semicolon Processor:
 * Toggles semicolons on statements while respecting JS grammar
 */
export function countSemicolons(code: string): { total: number; linesWithSemicolons: number; totalLines: number } {
  const total = (code.match(/;/g) || []).length;
  const lines = code.split('\n');
  const linesWithSemicolons = lines.filter(line => line.trim().endsWith(';')).length;
  return {
    total,
    linesWithSemicolons,
    totalLines: lines.length,
  };
}

export function toggleSemicolons(code: string, mode: 'add' | 'remove'): string {
  const lines = code.split('\n');

  if (mode === 'remove') {
    return lines.map(line => {
      const trimmed = line.trimEnd();
      // Don't strip within for loop definitions e.g. for (let i = 0; i < 10; i++)
      if (/^\s*for\s*\(/.test(line)) {
        return line;
      }
      if (trimmed.endsWith(';')) {
        return trimmed.slice(0, -1);
      }
      return line;
    }).join('\n');
  }

  // mode === 'add': Add semicolons to lines needing them
  return lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return line;
    // Comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return line;
    // Blocks or function headers
    if (trimmed.endsWith('{') || trimmed.endsWith('}') || trimmed.endsWith(':') || trimmed.endsWith(',') || trimmed.endsWith('=>') || trimmed.endsWith('(') || trimmed.endsWith('\\')) return line;
    // Loops and conditionals
    if (/^(if|for|while|switch|catch)\s*\(.*?\)$/.test(trimmed)) return line;
    if (/^else$/.test(trimmed)) return line;
    if (trimmed.endsWith(';')) return line;

    return line.trimEnd() + ';';
  }).join('\n');
}

export function formatBasicIndentation(code: string): string {
  const lines = code.split('\n');
  let indent = 0;
  const formatted: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      formatted.push('');
      continue;
    }

    // Decrement indent if line begins with closing bracket
    if (line.startsWith('}') || line.startsWith(']') || line.startsWith(')')) {
      indent = Math.max(0, indent - 1);
    }

    formatted.push('  '.repeat(indent) + line);

    // Increment if line ends with opening bracket
    if (line.endsWith('{') || (line.endsWith('[') && !line.includes(']')) || (line.endsWith('(') && !line.includes(')'))) {
      indent++;
    }
  }

  return formatted.join('\n');
}
