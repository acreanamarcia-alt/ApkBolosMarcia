import { JwtDecoded } from '../types';

export function formatJson(input: string, space = 2): { formatted?: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    return { formatted: JSON.stringify(parsed, null, space) };
  } catch (err: any) {
    return { error: err.message || 'Invalid JSON syntax' };
  }
}

export function minifyJson(input: string): { formatted?: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    return { formatted: JSON.stringify(parsed) };
  } catch (err: any) {
    return { error: err.message || 'Invalid JSON syntax' };
  }
}

export function encodeBase64(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binString);
  } catch {
    return btoa(str);
  }
}

export function decodeBase64(b64: string): { decoded?: string; error?: string } {
  try {
    const binString = atob(b64.trim());
    const bytes = Uint8Array.from(binString, m => m.charCodeAt(0));
    return { decoded: new TextDecoder().decode(bytes) };
  } catch (err: any) {
    return { error: 'Invalid Base64 sequence: ' + (err.message || 'Malformed data') };
  }
}

export function encodeUrl(str: string): string {
  return encodeURIComponent(str);
}

export function decodeUrl(str: string): { decoded?: string; error?: string } {
  try {
    return { decoded: decodeURIComponent(str) };
  } catch (err: any) {
    return { error: 'Invalid URL encoded string: ' + err.message };
  }
}

export function parseJwt(token: string): JwtDecoded {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return {
      header: null,
      payload: null,
      signature: '',
      isExpired: false,
      isValidStructure: false,
      error: 'JWT must contain exactly three parts separated by dots (header.payload.signature)',
    };
  }

  try {
    const decodePart = (part: string) => {
      let b64 = part.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4 !== 0) {
        b64 += '=';
      }
      return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(b64), c => c.charCodeAt(0))));
    };

    const header = decodePart(parts[0]);
    const payload = decodePart(parts[1]);
    const signature = parts[2];

    let isExpired = false;
    let expiresAt: string | undefined;
    let expiresIn: string | undefined;
    let issuedAt: string | undefined;

    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      expiresAt = expDate.toISOString();
      const diffMs = expDate.getTime() - Date.now();
      isExpired = diffMs <= 0;

      const absDiffMinutes = Math.abs(Math.round(diffMs / 60000));
      const absDiffHours = (absDiffMinutes / 60).toFixed(1);
      if (isExpired) {
        expiresIn = `Expired ${absDiffMinutes > 120 ? `${absDiffHours} hours` : `${absDiffMinutes} min`} ago`;
      } else {
        expiresIn = `Expires in ${absDiffMinutes > 120 ? `${absDiffHours} hours` : `${absDiffMinutes} min`}`;
      }
    }

    if (payload.iat) {
      issuedAt = new Date(payload.iat * 1000).toISOString();
    }

    return {
      header,
      payload,
      signature,
      isExpired,
      expiresAt,
      expiresIn,
      issuedAt,
      isValidStructure: true,
    };
  } catch (err: any) {
    return {
      header: null,
      payload: null,
      signature: parts[2] || '',
      isExpired: false,
      isValidStructure: false,
      error: 'Failed to decode JWT claims: ' + err.message,
    };
  }
}

export function convertTextCase(text: string, targetCase: 'camel' | 'snake' | 'kebab' | 'pascal' | 'constant' | 'title'): string {
  // Normalize into words
  const words = text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return '';

  switch (targetCase) {
    case 'camel':
      return words
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join('');
    case 'pascal':
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    case 'kebab':
      return words.map(w => w.toLowerCase()).join('-');
    case 'snake':
      return words.map(w => w.toLowerCase()).join('_');
    case 'constant':
      return words.map(w => w.toUpperCase()).join('_');
    case 'title':
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }
}

export async function computeHash(text: string, algorithm: 'SHA-256' | 'SHA-512' | 'SHA-1'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateUuids(count = 5, uppercase = false): string[] {
  const list: string[] = [];
  for (let i = 0; i < count; i++) {
    const id = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    list.push(uppercase ? id.toUpperCase() : id);
  }
  return list;
}

export function csvToJson(csv: string): { json?: string; count?: number; error?: string } {
  try {
    const lines = csv.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) return { error: 'CSV is empty' };

    const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const currentline = lines[i].split(',').map(val => val.replace(/^["']|["']$/g, '').trim());
      const obj: Record<string, string> = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j] || '';
      }
      data.push(obj);
    }

    return { json: JSON.stringify(data, null, 2), count: data.length };
  } catch (err: any) {
    return { error: 'Failed to parse CSV: ' + err.message };
  }
}

export function jsonToCsv(jsonStr: string): { csv?: string; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed) || !parsed.length) {
      return { error: 'Input must be a JSON array of objects' };
    }

    const headers = Object.keys(parsed[0]);
    const csvRows = [headers.join(',')];

    for (const row of parsed) {
      const values = headers.map(header => {
        const val = row[header] !== undefined ? String(row[header]) : '';
        const escaped = val.includes(',') || val.includes('"') || val.includes('\n')
          ? `"${val.replace(/"/g, '""')}"`
          : val;
        return escaped;
      });
      csvRows.push(values.join(','));
    }

    return { csv: csvRows.join('\n') };
  } catch (err: any) {
    return { error: 'Invalid JSON array: ' + err.message };
  }
}
