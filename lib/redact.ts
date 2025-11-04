const SENSITIVE_KEYS = new Set([
  'client_secret',
  'secret',
  'apiKey',
  'api_key',
  'authorization',
  'token',
  'password',
]);

function mask(value: unknown): string {
  const str = String(value || '');
  if (str.length <= 6) return '***';
  return `${str.slice(0, 3)}***${str.slice(-3)}`;
}

export function redactSecrets(data: any): any {
  if (data == null) return data;
  if (Array.isArray(data)) return data.map(redactSecrets);
  if (typeof data === 'object') {
    const out: any = Array.isArray(data) ? [] : {};
    for (const [k, v] of Object.entries(data as any)) {
      if (SENSITIVE_KEYS.has(k)) {
        out[k] = typeof v === 'string' ? mask(v) : '***';
      } else {
        out[k] = redactSecrets(v);
      }
    }
    return out;
  }
  return data;
}


