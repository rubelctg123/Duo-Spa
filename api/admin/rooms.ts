import type { IncomingMessage, ServerResponse } from 'http';
import { getDatabase } from '../../lib/mongodb.js';
import { authenticateAdmin } from '../../lib/auth.js';

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

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(405, { success: false, error: 'Méthode non autorisée. Utilisez GET.' });
  }

  try {
    const db = await getDatabase();
    const auth = await authenticateAdmin(req, db);

    if (!auth.authenticated) {
      return sendJson(401, { success: false, error: auth.error || 'Accès refusé.' });
    }

    const rooms = await db.collection('rooms').find().toArray();

    return sendJson(200, {
      success: true,
      isDemoData: true,
      demoNotice: 'Ces suites et cabines sont des ressources physiques de démonstration utilisées pour valider les contraintes de capacité et l’allocation des duos.',
      count: rooms.length,
      rooms,
    });
  } catch (error: any) {
    console.error('Error in admin rooms handler:', error);
    return sendJson(500, { success: false, error: 'Erreur lors du chargement des salles.' });
  }
}
