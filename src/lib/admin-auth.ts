/**
 * Cookie-session auth for the admin panel.
 *
 * The session token is `<expiry>.<hmac>` where the HMAC-SHA256 is keyed
 * with ADMIN_PASSWORD, so setting the secret is the only configuration
 * needed and changing the password invalidates existing sessions.
 */

export const ADMIN_COOKIE = 'sap_admin';
export const SESSION_SECONDS = 7 * 24 * 60 * 60;

/** Cookie options shared by login (set) and logout (delete). */
export const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: SESSION_SECONDS,
} as const;

const encoder = new TextEncoder();

/*
 * Secrets pasted into the dashboard easily pick up an invisible trailing
 * newline or space, so leading/trailing whitespace is ignored on both the
 * stored secret and the typed password.
 */
function norm(secret: string): string {
  return secret.trim();
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(norm(secret)), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createSessionToken(password: string): Promise<string> {
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(password), encoder.encode(exp));
  return `${exp}.${toHex(sig)}`;
}

export async function verifySessionToken(token: string | undefined, password: string): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf('.');
  if (dot < 1) return false;
  const exp = token.slice(0, dot);
  const sigHex = token.slice(dot + 1);
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  const sig = Uint8Array.from(sigHex.match(/.{2}/g)?.map((h) => parseInt(h, 16)) ?? []);
  if (sig.length !== 32) return false;
  return crypto.subtle.verify('HMAC', await hmacKey(password), sig, encoder.encode(exp));
}

/** Constant-time password check (compares SHA-256 digests). */
export async function passwordMatches(input: string, expected: string): Promise<boolean> {
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(norm(input))),
    crypto.subtle.digest('SHA-256', encoder.encode(norm(expected))),
  ]);
  const va = new Uint8Array(a);
  const vb = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i]! ^ vb[i]!;
  return diff === 0;
}

/** True when the request carries a valid admin session. */
export async function isAdmin(cookies: { get(name: string): { value: string } | undefined }, env: Env | undefined): Promise<boolean> {
  if (!env?.ADMIN_PASSWORD) return false;
  return verifySessionToken(cookies.get(ADMIN_COOKIE)?.value, env.ADMIN_PASSWORD);
}
