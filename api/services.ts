import type { IncomingMessage, ServerResponse } from 'http';
import { getDatabase } from '../lib/mongodb.js';

interface RequestWithQuery extends IncomingMessage {
  method?: string;
  query?: Record<string, string | string[]>;
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
    const db = await getDatabase();
    const services = await db
      .collection('services')
      .find({ isActive: true })
      .project({ _id: 1, slug: 1, name: 1, category: 1, format: 1, durationMinutes: 1, durationLabel: 1, pricePerPerson: 1, totalPrice: 1, badge: 1, popular: 1, shortDescription: 1, fullDescription: 1, benefits: 1, includes: 1, restrictions: 1, image: 1, availableAddons: 1 })
      .toArray();

    // Map _id to id for seamless frontend compatibility
    const formattedServices = services.map((s) => ({
      ...s,
      id: s.slug || s._id.toString(),
      _id: s._id.toString(),
    }));

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return sendJson(200, {
      success: true,
      count: formattedServices.length,
      services: formattedServices,
    });
  } catch (error: any) {
    console.error('Error fetching services:', error);
    return sendJson(500, {
      success: false,
      error: 'Impossible de charger le catalogue de soins pour le moment.',
    });
  }
}
