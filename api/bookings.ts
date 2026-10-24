import type { IncomingMessage, ServerResponse } from 'http';
import { getClient, getDatabase } from '../lib/mongodb.js';
import { createBookingAtomic, type CreateBookingInput } from '../lib/bookingEngine.js';

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
      // Guard against payload flooding (max 100KB)
      if (raw.length > 102400) {
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
    const payload = (await parseBody(req)) as CreateBookingInput;

    const client = await getClient();
    const db = await getDatabase();

    const result = await createBookingAtomic(client, db, payload);

    return sendJson(result.statusCode, result);
  } catch (error: any) {
    console.error('Error in bookings API handler:', error);
    return sendJson(error.message === 'Format JSON invalide' ? 400 : 500, {
      success: false,
      error: error.message || 'Erreur serveur lors de la création de la réservation.',
    });
  }
}
