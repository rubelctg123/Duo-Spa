import type { IncomingMessage, ServerResponse } from 'http';
import { createClearSessionCookie } from '../../lib/auth.js';

interface ResponseWithJson extends ServerResponse {
  status?: (statusCode: number) => ResponseWithJson;
  json?: (data: any) => void;
}

export default async function handler(req: IncomingMessage, res: ResponseWithJson) {
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

  res.setHeader('Set-Cookie', createClearSessionCookie());
  return sendJson(200, {
    success: true,
    message: 'Déconnexion effectuée avec succès.',
  });
}
