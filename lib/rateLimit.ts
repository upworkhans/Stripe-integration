type Attempt = number;

const keyToAttempts: Map<string, Attempt[]> = new Map();

function getNow(): number { return Date.now(); }

export type RateLimitResult = { allowed: true } | { allowed: false; reason: string };

export function rateLimitPaymentAttempts(key: string): RateLimitResult {
  const now = getNow();
  const tenMinutesMs = 10 * 60 * 1000;
  const oneHourMs = 60 * 60 * 1000;
  const attempts = (keyToAttempts.get(key) || []).filter(ts => now - ts <= oneHourMs);

  // Enforce max 6 per rolling hour
  if (attempts.length >= 6) {
    return { allowed: false, reason: 'Rate limit exceeded: max 6 payments per hour.' };
  }
  // Enforce 10-minute gap from last attempt
  const last = attempts[attempts.length - 1];
  if (last && (now - last) < tenMinutesMs) {
    const remaining = Math.ceil((tenMinutesMs - (now - last)) / 60000);
    return { allowed: false, reason: `Please wait ${remaining} min before the next payment.` };
  }
  attempts.push(now);
  keyToAttempts.set(key, attempts);
  return { allowed: true };
}

export function rateLimitKeyFromRequestHeaders(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for') || '';
  const ip = fwd.split(',')[0]?.trim() || 'unknown';
  const ua = (headers.get('user-agent') || '').slice(0, 80);
  return `${ip}|${ua}`;
}


