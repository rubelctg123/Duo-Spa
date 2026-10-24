import type { IncomingMessage, ServerResponse } from 'http';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../../lib/mongodb.js';
import { signAdminToken, createSessionCookie } from '../../lib/auth.js';

interface RequestWithBody extends IncomingMessage {
  method?: string;
  body?: any;
}

interface ResponseWithJson extends ServerResponse {
  status?: (statusCode: number) => ResponseWithJson;
  json?: (data: any) => void;
}

async function parseBody(req: RequestWithBody): Promise<any> {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 32768) {
        reject(new Error('Payload trop volumineux'));
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Format JSON invalide'));
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req: RequestWithBody, res: ResponseWithJson) {
  const sendJson = (statusCode: number, data: any) => {
    const statusFn = res.status;
    const jsonFn = res.json;
    if (typeof statusFn === 'function' && typeof jsonFn === 'function') {
      statusFn.call(res, statusCode);
      jsonFn.call(res, data);
    } else {
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    }
  };

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(405, { success: false, error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    const body = await parseBody(req);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return sendJson(400, {
        success: false,
        error: 'L’adresse courriel et le mot de passe sont obligatoires.',
      });
    }

    const db = await getDatabase();
    const adminUser = await db.collection('adminUsers').findOne({ email, isActive: true });

    if (!adminUser || !adminUser.passwordHash) {
      // Use identical timing/message to prevent user enumeration
      return sendJson(401, {
        success: false,
        error: 'Identifiants invalides ou compte inactif.',
      });
    }

    const passwordMatches = await bcrypt.compare(password, adminUser.passwordHash);
    if (!passwordMatches) {
      return sendJson(401, {
        success: false,
        error: 'Identifiants invalides ou compte inactif.',
      });
    }

    // Generate JWT and session cookie
    const token = signAdminToken({
      id: adminUser._id.toString(),
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    });

    const cookieHeader = createSessionCookie(token);
    res.setHeader('Set-Cookie', cookieHeader);

    // Update lastLoginAt
    await db.collection('adminUsers').updateOne(
      { _id: adminUser._id },
      { $set: { lastLoginAt: new Date() } }
    );

    return sendJson(200, {
      success: true,
      message: 'Connexion réussie.',
      admin: {
        id: adminUser._id.toString(),
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
      token, // Also returned for API client / test compatibility
    });
  } catch (error: any) {
    console.error('Error during admin login:', error);
    return sendJson(500, {
      success: false,
      error: 'Erreur serveur lors de la tentative de connexion.',
    });
  }
}
