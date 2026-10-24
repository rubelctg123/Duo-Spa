import type { IncomingMessage, ServerResponse } from 'http';
import { getDatabase } from '../lib/mongodb.js';
import { calculateAvailability } from '../lib/availability.js';

interface RequestWithQuery extends IncomingMessage {
  method?: string;
  query?: Record<string, string | string[]>;
  url?: string;
}

interface ResponseWithJson extends ServerResponse {
  status?: (statusCode: number) => ResponseWithJson;
  json?: (data: any) => void;
}

export default async function handler(req: RequestWithQuery, res: ResponseWithJson) {
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
    // Parse query parameters
    let serviceId = '';
    let date = '';

    if (req.query && typeof req.query.serviceId === 'string') {
      serviceId = req.query.serviceId;
    }
    if (req.query && typeof req.query.date === 'string') {
      date = req.query.date;
    }

    // Fallback if req.query is not pre-parsed by the runner
    if ((!serviceId || !date) && req.url && req.url.includes('?')) {
      const urlObj = new URL(req.url, 'http://localhost');
      serviceId = serviceId || urlObj.searchParams.get('serviceId') || '';
      date = date || urlObj.searchParams.get('date') || '';
    }

    if (!serviceId || !date) {
      return sendJson(400, {
        success: false,
        error: 'Les paramètres "serviceId" et "date" (AAAA-MM-JJ) sont obligatoires.',
      });
    }

    const db = await getDatabase();
    const result = await calculateAvailability(db, { serviceId, date });

    if (!result.success) {
      return sendJson(400, result);
    }

    // Cache availability briefly to allow fast re-clicks while reflecting fresh bookings
    res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=15');
    return sendJson(200, result);
  } catch (error: any) {
    console.error('Error in availability API:', error);
    return sendJson(500, {
      success: false,
      error: 'Erreur lors du calcul des disponibilités en temps réel.',
      debug: error?.message || String(error),
    });
  }
}
