import crypto from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import type { Db } from 'mongodb';
import { ObjectId } from 'mongodb';

export interface AdminTokenPayload {
  sub: string; // admin user _id
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

const COOKIE_NAME = 'duo_admin_token';
const TOKEN_EXPIRY_SECONDS = 86400; // 24 hours

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('JWT_SECRET is missing or insufficiently strong in environment variables.');
  }
  return secret;
}

/**
 * Signs an HS256 JWT for authenticated admin sessions.
 */
export function signAdminToken(admin: { id: string; email: string; name: string; role: string }): string {
  const secret = getJwtSecret();
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminTokenPayload = {
    sub: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    iat: now,
    exp: now + TOKEN_EXPIRY_SECONDS,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', secret)
    .update(dataToSign)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${dataToSign}.${signature}`;
}

/**
 * Cryptographically verifies an HS256 JWT using timing-safe comparisons.
 */
export function verifyAdminToken(token: string): { valid: boolean; payload?: AdminTokenPayload; error?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Jeton manquant.' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Structure de jeton invalide.' };
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const secret = getJwtSecret();
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(dataToSign)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  // Constant-time comparison to prevent timing attacks
  const sigBuffer = Buffer.from(signature);
  const expectedSigBuffer = Buffer.from(expectedSig);

  if (sigBuffer.length !== expectedSigBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)) {
    return { valid: false, error: 'Signature de jeton invalide.' };
  }

  try {
    const payload: AdminTokenPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'La session a expiré. Veuillez vous reconnecter.' };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'Données de jeton corrompues.' };
  }
}

/**
 * Parses HTTP request cookies into a key-value object.
 */
export function parseCookies(req: IncomingMessage): Record<string, string> {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return {};

  const list: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      list[name] = decodeURIComponent(val);
    }
  });
  return list;
}

/**
 * Creates an HttpOnly, SameSite=Strict, Secure session cookie string.
 */
export function createSessionCookie(token: string): string {
  const isProd = process.env.NODE_ENV === 'production';
  const secureFlag = isProd ? '; Secure' : '';
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TOKEN_EXPIRY_SECONDS}${secureFlag}`;
}

/**
 * Creates a cookie clearing header to invalidate user sessions on logout.
 */
export function createClearSessionCookie(): string {
  const isProd = process.env.NODE_ENV === 'production';
  const secureFlag = isProd ? '; Secure' : '';
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secureFlag}`;
}

/**
 * Authenticates an admin request from session cookies or Bearer headers,
 * verifying that the admin user exists and is active in the database.
 */
export async function authenticateAdmin(
  req: IncomingMessage,
  dbOrGetter: Db | (() => Promise<Db>)
): Promise<{ authenticated: boolean; user?: any; error?: string }> {
  let token = '';

  // 1. Try reading from HttpOnly cookie
  const cookies = parseCookies(req);
  if (cookies[COOKIE_NAME]) {
    token = cookies[COOKIE_NAME];
  }

  // 2. Try Authorization: Bearer <token> fallback (useful for automated testing/scripts)
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7).trim();
  }

  if (!token) {
    return { authenticated: false, error: 'Session non authentifiée. Veuillez vous connecter.' };
  }

  const verification = verifyAdminToken(token);
  if (!verification.valid || !verification.payload) {
    return { authenticated: false, error: verification.error || 'Jeton de session invalide.' };
  }

  const { sub } = verification.payload;
  if (!ObjectId.isValid(sub)) {
    return { authenticated: false, error: 'Identifiant administrateur invalide.' };
  }

  const db = typeof dbOrGetter === 'function' ? await dbOrGetter() : dbOrGetter;
  const adminUser = await db.collection('adminUsers').findOne({
    _id: new ObjectId(sub),
    isActive: true,
  });

  if (!adminUser) {
    return { authenticated: false, error: 'Compte administrateur inactif ou introuvable.' };
  }

  return {
    authenticated: true,
    user: {
      id: adminUser._id.toString(),
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    },
  };
}
